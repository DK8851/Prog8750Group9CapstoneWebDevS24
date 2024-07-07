import Utils from "@/utils";
import admin from "@/utils/firebase/firebase-admin";

export async function POST(req, res) {
  try {
    const { userId } = await req.json();

    const userRecord = await admin.auth().getUser(userId);
    const email = userRecord.email;

    return Utils.sendSuccess({ message: "User found successfully", email });
  } catch (exception) {
    console.error("Error finding User:", exception);
    return Utils.sendError()(exception);
  }
}
