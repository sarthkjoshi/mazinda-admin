import BulkUploadRequest from "@/models/BulkUploadRequest";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  const { requestId } = await req.json();

  try {
    await connectDB();

    const bulk_upload_request = await BulkUploadRequest.findById(requestId);

    await bulk_upload_request.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Request deleted",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message:
        "An error occurred while fetching the bulk upload request" + error,
      error,
    });
  }
}
