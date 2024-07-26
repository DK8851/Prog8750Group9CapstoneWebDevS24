import Utils from "@/utils";
import db from "@/utils/firebase/firestore";
import { collection, doc, setDoc } from "firebase/firestore";

export async function POST(req, res) {
  try {
    const { name, email, subject, description } = await req.json();

    // Add a new document with a generated id
    const newDocRef = doc(collection(db, "contactus"));

    await setDoc(newDocRef, {
      name,
      email,
      subject,
      description,
    });

    return Utils.sendSuccess({
      message: "contactus details recieved successfully",
    });
  } catch (exception) {
    console.error("Error getting contactus details:", exception);
    return Utils.sendError()(exception);
  }
}
