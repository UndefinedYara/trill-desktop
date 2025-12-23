import { db } from "@/lib/firebase/firebase-server-config";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const suffix = url.searchParams.get("suffix");

    const chordsRef = db.collection("chords");

    // Add filters only if they exist
    const queryRef = suffix
      ? chordsRef.where("suffix", "==", suffix)
      : chordsRef;

    const snapshot = await queryRef.get();

    const chords = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return Response.json({ data: chords });
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
