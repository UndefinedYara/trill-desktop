import { pipeline } from "@xenova/transformers";

let pipeInstance: any = null;

export async function createVectorMap(chord: string) {
    if (!pipeInstance) {
        pipeInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    const embeddings: { data: Float32Array } = await pipeInstance(chord, { pooling: 'mean', normalize: true });
    return Array.from(embeddings.data);
}
