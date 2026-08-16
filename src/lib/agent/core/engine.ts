import { ITERATION_LIMIT } from "@/consts";
import { LLMClient } from "./llm-client";
import { saveChordTool } from "../tools/tool-definition";
import { saveChord } from "@/app/actions/chord-mutations";

export const llm = new LLMClient({
  model: "gemini-3.1-flash-lite",
  temperature: 0.2,
  systemInstruction:
    "You are a helpful music theory teacher. Answer questions about music theory in a clear and concise manner.",
  tools: [saveChordTool],
});

export async function* runAgent(chatMessages: any[]) {
  let iterations = 0;
  // Clone the messages array so we don't mutate the client's original request object
  const contents = [...chatMessages];

  while (iterations < ITERATION_LIMIT) {
    iterations++;
    const responseStream = await llm.generateStream(contents);

    let fullText = "";
    let functionCalls: any[] = [];

    // 1. Stream the model's response back to the client chunk by chunk
    for await (const chunk of responseStream) {
      if (chunk.text) {
        fullText += chunk.text;
        yield { type: "text", content: chunk.text };
      }
      if (chunk.functionCalls) {
        functionCalls.push(...chunk.functionCalls);
      }
    }

    // 2. Append the model's response to our internal history
    const assistantParts = [];
    if (fullText) assistantParts.push({ text: fullText });
    functionCalls.forEach((fc) => assistantParts.push({ functionCall: fc }));
    contents.push({ role: "model", parts: assistantParts });

    // 3. Check if the model requested any tool executions
    if (functionCalls.length > 0) {
      const toolResponses = [];

      for (const call of functionCalls) {
        if (call.name === "store_chord_info") {
          yield {
            type: "system",
            content: "\n\n*[System: Saving chord to database...]*\n",
          };
          try {
            // Execute the actual server action logic
            const id = await saveChord(call.args);
            toolResponses.push({
              functionResponse: {
                name: call.name,
                response: { success: true, id },
              },
            });
            yield {
              type: "system",
              content: "*[System: Successfully saved chord!]*\n",
            };
          } catch (error: any) {
            toolResponses.push({
              functionResponse: {
                name: call.name,
                response: { success: false, error: error.message },
              },
            });
            yield {
              type: "system",
              content: `*[System: Failed to save chord: ${error.message}]*\n`,
            };
          }
        }
      }
      // Append the tool results to the context and loop again to let the LLM give a final answer
      contents.push({ role: "user", parts: toolResponses });
    } else {
      // No tools called, the LLM is done thinking, we can exit the loop
      break;
    }
  }
}
