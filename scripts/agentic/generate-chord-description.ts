import {
    chordsCollection,
} from "../../src/lib/firebase/firebase-server-config";
import path from "path";
import { promises as fs } from "fs";
import { retryAsync } from "ts-retry";
import { CHUNK_SIZE, MAX_RETRIES } from "../consts";
import { LLMClient } from "../../src/lib/agent/core/llm-client";
import { getChordKeys, getChordSuffixes } from "@/app/actions/chord-queries";

const llmClient = new LLMClient();

async function main() {

    const args = process.argv.slice(2);
    const pathArg = args.find((arg) => arg.startsWith("--path="));
    if (!pathArg) {
        throw new Error("Missing --path argument");
    }
    const rawPath = pathArg.replace("--path=", "");
    const basePath = path.resolve(rawPath);
    const successFilePath = path.join(basePath, "success.json");
    const successContent = await createSuccessFile(successFilePath);
    const failureFilePath = path.join(basePath, "failure.json");
    const failureContent = await createFailureFile(failureFilePath);

    await generateChordDescription(successContent, successFilePath, failureContent, failureFilePath);

}


async function createSuccessFile(basePath: string) {

    console.log("Using base path for success JSON file:", basePath);
    // Ensure the directory exists
    const dirPath = path.dirname(basePath);
    await fs.mkdir(dirPath, { recursive: true });

    let existingSuccessContent: any;
    try {
        const fileContent = await fs.readFile(basePath, 'utf8');
        existingSuccessContent = JSON.parse(fileContent);
        console.log(`JSON already exists at ${basePath}.`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(basePath, "{}", 'utf8');
            existingSuccessContent = {};
            console.log(`Empty JSON file created at ${basePath}`);
        } else {
            throw error;
        }
    }
    return existingSuccessContent;


}


async function createFailureFile(basePath: string) {

    console.log("Using base path for failure JSON file:", basePath);
    // Ensure the directory exists
    const dirPath = path.dirname(basePath);
    await fs.mkdir(dirPath, { recursive: true });

    let existingFailureContent: any;
    try {
        const fileContent = await fs.readFile(basePath, 'utf8');
        existingFailureContent = JSON.parse(fileContent);
        console.log(`JSON already exists at ${basePath}.`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(basePath, "{}", 'utf8');
            existingFailureContent = {};
            console.log(`Empty JSON file created at ${basePath}`);
        } else {
            throw error;
        }
    }
    return existingFailureContent;


}



async function generateChordDescription(successContent: any, successFilePath: string, failureContent: any, failureFilePath: string) {
    const chordKeys = await getChordKeys()
    const chordSuffixes = await getChordSuffixes()


    const chordResponse = await chordsCollection.get();
    const chordList = chordResponse.docs.map(doc => doc.data());

    for (let i = 0; i < chordList.length; i += CHUNK_SIZE) {
        const chunk = chordList.slice(i, i + CHUNK_SIZE);

        const unprocessedChords = chunk.filter(chord => {
            const chordName = chord.key + chord.suffix;
            if (successContent[chordName]) {
                console.log(`Chord ${chordName} already processed successfully, skipping`);
                return false;
            }
            if (failureContent[chordName]) {
                console.log(`Chord ${chordName} previously failed (in DLQ), skipping`);
                return false;
            }
            return true;
        });

        if (unprocessedChords.length === 0) {
            console.log(`Chunk ${Math.min(i + CHUNK_SIZE, chordList.length)} / ${chordList.length} already processed. Skipping...`);
            continue;
        }

        console.log(`Generating chord descriptions for a chunk of ${unprocessedChords.length} chords...`);

        const chordListString = unprocessedChords.map(c => `- ${c.key}${c.suffix}`).join("\n");

        const LLM_DESCRIPTION_GENERATOR_PROMPT =
            `You are an expert music theorist and data annotator building a dataset for a semantic search engine. Your task is to analyze musical chords and generate highly concise, emotionally rich descriptions for them.
            These descriptions will be converted into vector embeddings, so your vocabulary must perfectly mirror the colloquial, emotional words a music producer or songwriter would use when searching for a specific "vibe". 
            Rules for the description:
            1. Strongly prioritize emotional adjectives (e.g., "sad", "happy", "bright", "melancholic", "tense", "dark", "triumphant", "dreamy", "dissonant").
            2. Describe the feeling, color, and typical use case of the chord rather than just its technical theory. 
            3. The description MUST be strictly under 150 characters.
            4. Abide by these chord keys ${chordKeys} and these chord suffixes ${chordSuffixes}. Do not make up chord names.
            You must respond ONLY with a valid JSON array matching this exact schema. Do not include markdown formatting, just the raw JSON:
            [
              {
                "key": "the chord key. must be valid and is included in the ${chordKeys} list",
                "suffix": "the chord suffix. must be valid and is included in the ${chordSuffixes} list,
                "description": "The emotional, keyword-rich string.",
                "success": true
              }
            ]
            Here are the chords you need to describe:
            ${chordListString}
            `

        try {
            await retryAsync(async () => {
                const llmResponse = await llmClient.generate(LLM_DESCRIPTION_GENERATOR_PROMPT, {
                    responseMimeType: "application/json"
                });

                let responseJson: any[];
                try {
                    // Sometimes LLMs still wrap with markdown even if told not to
                    const cleanJson = llmResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
                    responseJson = JSON.parse(cleanJson);
                } catch (e) {
                    throw new Error("Failed to parse LLM response as JSON: " + llmResponse);
                }

                if (!Array.isArray(responseJson)) {
                    throw new Error("Expected an array but got: " + typeof responseJson);
                }

                for (const item of responseJson) {
                    if (item.key && item.suffix) {
                        const chordName = item.key + item.suffix;
                        successContent[chordName] = item;
                    }
                }
            }, {
                maxTry: MAX_RETRIES,
                delay: 1000,
                onSuccessFunc: (result: any, currentTry: number) => {
                    console.log(`Successfully generated descriptions for chunk in ${currentTry} tries`);
                },
                onError: (error: any) => {
                    console.warn(`Retry failed for chunk, retrying...`);
                    return undefined
                }
            });

            console.log(`Waiting 15 seconds before next request to avoid rate limits...`);
            await new Promise(resolve => setTimeout(resolve, 15000));
        } catch (error: any) {
            console.error(`Exhausted retries for chunk. Pushing to DLQ.`);
            for (const chord of unprocessedChords) {
                const chordName = chord.key + chord.suffix;
                failureContent[chordName] = error.message || "Unknown error during chunk generation";
            }
        }

        // Write batch results to file to reduce I/O bottleneck
        await fs.writeFile(successFilePath, JSON.stringify(successContent, null, 2), 'utf8');
        await fs.writeFile(failureFilePath, JSON.stringify(failureContent, null, 2), 'utf8');
        console.log(`Processed ${Math.min(i + CHUNK_SIZE, chordList.length)} / ${chordList.length} chords.`);
    }

}

main().catch(console.error);