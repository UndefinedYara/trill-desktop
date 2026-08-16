"use server";

import { chordsCollection } from "@/lib/firebase/firebase-server-config";
import { createVectorMap } from "@/lib/agent/utils/create-vector-map";
import { FieldValue } from "firebase-admin/firestore";
import { ChordType } from "@/types/ui/chord";

export async function searchChordsByDescription(query: string, topN: number = 10): Promise<Partial<ChordType>[]> {
    if (!query || query.trim() === "") {
        return [];
    }
    const queryVector = await createVectorMap(query);
    const vectorQuery = chordsCollection.findNearest(
        {
            vectorField: 'vector',
            queryVector: FieldValue.vector(queryVector),
            limit: topN,
            distanceMeasure: 'COSINE'
        }
    );

    const snapshot = await vectorQuery.get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            chord: data.key + " " + data.suffix,
            key: data.key,
            suffix: data.suffix,
            positions: data.positions,
            description: data.description
        };
    });
}
