import { auth } from "../../src/firebase"; // ✅ Adjust based on structure
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return Response.json({ user: userCredential.user }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 401 });
  }
}
