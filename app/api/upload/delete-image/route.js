import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export async function DELETE(request) {
  const { fileName } = await request.json(); // Assuming you pass the fileName to delete in the request body

  if (!fileName) {
    return NextResponse.json({ success: false, error: "No fileName provided" });
  }

  const bucketName = "mazindabucket";

  try {
    const s3 = new AWS.S3();

    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    const data = await s3.deleteObject(params).promise();

    console.log("File deleted successfully");

    return NextResponse.json({
      success: true,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ success: false, error: "Error deleting file" });
  }
}
