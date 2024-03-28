import BulkUploadRequest from "@/models/BulkUploadRequest";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const data = await req.json();
    await connectDB();

    let bulk_upload_request = await BulkUploadRequest.findById(data.request_id);

    bulk_upload_request.requestProducts.splice(data.index, 1);
    await bulk_upload_request.save();

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
