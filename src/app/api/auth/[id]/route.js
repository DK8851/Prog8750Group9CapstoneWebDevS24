import Utils from "@/utils";
import admin from "@/utils/firebase/firebase-admin";

export async function DELETE(_, { params }) {
    try {

        await admin.auth().deleteUser(params.id);

        return Utils.sendSuccess({ success: `User ${params.id} has been deleted` });
    } catch (exception) {
        return Utils.sendError()(exception)
    }
}