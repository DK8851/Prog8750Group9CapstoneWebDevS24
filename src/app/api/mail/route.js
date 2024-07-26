import Utils from "@/utils";
import { sendEmail } from "@/utils/email";
import { getDocumentStatusUpdateTemplate } from "@/utils/email/template";

export async function POST(req, res) {
  try {
    const { docId, status, to, message } = await req.json();

    const emailContent = getDocumentStatusUpdateTemplate({
      docId,
      status,
      updatedBy: "RapidAid Admin",
      date: new Date().toLocaleString(),
      message,
    });

    // Send the email
    await sendEmail({
      to,
      subject: "Document Status Updated",
      html: emailContent,
    });

    return Utils.sendSuccess({ message: "Email sent successfully" });
  } catch (exception) {
    console.error("Error sending email:", exception);
    return Utils.sendError()(exception);
  }
}
