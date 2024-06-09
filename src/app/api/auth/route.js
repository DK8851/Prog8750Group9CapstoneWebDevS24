import Utils from '@/utils';
import admin from '@/utils/firebase/firebase-admin';
import db from '@/utils/firebase/firestore';
import { addDoc, collection } from 'firebase/firestore';

export async function POST(req, res) {
  try {
    const { uid, role } = await req.json();

    await admin.auth().setCustomUserClaims(uid, { role });

    await addDoc(collection(db, "roles"), {
      uid,
      role
    });

    return Utils.sendSuccess({ message: 'User role set successfully' });
  } catch (exception) {
    console.error('Error setting user role:', exception);
    return Utils.sendError()(exception)
  }
}
