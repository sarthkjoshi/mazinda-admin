import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const imagePath = formData.get("imagePath"); // Add a new field for the existing image path

  if (!file || !imagePath) {
    return NextResponse.json({
      success: false,
      error: "No file or imagePath provided",
    });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const s3 = new AWS.S3();

    // Extract bucket name and key from the existing image path
    let [, , Bucket] = imagePath.split("/");
    Bucket = Bucket.split(".")[0];

    const url = new URL(imagePath);
    const Key = url.pathname.substring(1); // will return the folder structure of the required file. for eg: https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/top-carousel/1.jpeg

    // here url.pathname returns /home-page/top-carousel/1.jpeg
    // .substring(1) removes the /

    // Upload the new image to S3, replacing the existing one
    const uploadParams = {
      Bucket: Bucket,
      Key,
      Body: buffer,
    };

    const uploadResult = await s3.upload(uploadParams).promise();

    console.log("File replaced successfully", uploadResult.Location);

    return NextResponse.json({
      success: true,
      fileName: Key,
      location: uploadResult.Location,
    });
  } catch (error) {
    console.error("Error replacing file:", error);
    return NextResponse.json({ success: false, error: "Error replacing file" });
  }
}
