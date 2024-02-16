import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("file");

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const bucketName = "mazindabucket";

  try {
    const s3 = new AWS.S3();

    // Generate a timestamp for the file name
    const currentDate = new Date();
    const timestamp = currentDate.toISOString().replace(/[:.]/g, "");

    // Replace spaces with underscores in the original filename
    // const sanitizedFileName = file.name.replace(/ /g, "_");
    const sanitizedFileName = file.name.replace(/ /g, "_").replace(/\((.*?)\)/g, "_$1")
    const fileNameWithTimestamp = `${timestamp}_${sanitizedFileName}`;

    const params = {
      Bucket: bucketName,
      Key: fileNameWithTimestamp, // Use the new filename
      Body: buffer,
    };

    const data = await s3.upload(params).promise();

    console.log("File uploaded successfully", data.Location);

    return NextResponse.json({
      success: true,
      fileName: fileNameWithTimestamp,
      location: data.Location,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, error: "Error uploading file" });
  }
}
