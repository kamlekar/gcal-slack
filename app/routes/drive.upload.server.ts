import { json } from "@remix-run/node";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { UploadService } from "~/services/google-drive";
import { createOAuth2Client } from "~/utils/google-auth.server";

export type ActionData =
  | { success: true; data: unknown }
  | { success: false; error: string };

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const file = formData.get("docFile") as File;
  const visitDate = formData.get("visitDate") as string;
  const patientName = formData.get("patientName") as string;
  const ailments = formData.get("ailments") as string;
  const hospital = formData.get("hospital") as string;
  const fileType = formData.get("fileType") as string;

  if (!file) {
    return json<ActionData>(
      { success: false, error: "No file selected" },
      { status: 400 }
    );
  }

  try {
    const uploadService = new UploadService();
    const oauth2Client = createOAuth2Client();

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a temporary file path
    const tempFilePath = join(tmpdir(), file.name);

    // Write the buffer to a temporary file
    await writeFile(tempFilePath, buffer);

    const result = await uploadService.uploadFile(
      {
        files: {
          docFile: {
            name: file.name,
            mimeType: file.type,
            tempFilePath,
          },
        },
        body: {
          fileType,
          patientName,
          visitDate,
          ailments,
          hospital,
        },
      },
      null,
      oauth2Client
    );

    // Clean up temp file
    await unlink(tempFilePath);

    return json<ActionData>({ success: true, data: result });
  } catch (error) {
    console.error("Upload error:", error);
    return json<ActionData>(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
