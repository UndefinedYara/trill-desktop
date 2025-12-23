import { db } from "@/lib/firebase/firebase-server-config";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    const chordsRef = db.collection("chords");
    const queryRef = key ? chordsRef.where("key", "==", key) : chordsRef;
    // Execute query
    const snapshot = await queryRef.get();
    const chords = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return Response.json({ data: chords });
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
