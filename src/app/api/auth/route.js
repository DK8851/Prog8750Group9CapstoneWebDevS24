import Utils from "@/utils";
import admin from "@/utils/firebase/firebase-admin";
import db from "@/utils/firebase/firestore";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export async function POST(req, res) {
  try {
    const { uid, role, displayName } = await req.json();

    await admin.auth().setCustomUserClaims(uid, { role });

    // Reference to the document with the specific ID
    const docRef = doc(db, "users", uid);

    await setDoc(docRef, {
      uid,
      role,
      displayName,
    });

    return Utils.sendSuccess({ message: "User role set successfully" });
  } catch (exception) {
    console.error("Error setting user role:", exception);
    return Utils.sendError()(exception);
  }
}
