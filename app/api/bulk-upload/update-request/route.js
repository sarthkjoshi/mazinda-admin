import BulkUploadRequest from "@/models/BulkUploadRequest";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { editableData, request_id } = await req.json();
  try {
    await connectDB();

    let bulk_upload_request = await BulkUploadRequest.findByIdAndUpdate(
      request_id,
      { requestProducts: editableData }
    );
    if (!bulk_upload_request) {
      return NextResponse.json({
        success: false,
        message: "Bulk upload request not found",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Bulk upload request updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the bulk upload request",
      error,
    });
  }
}
