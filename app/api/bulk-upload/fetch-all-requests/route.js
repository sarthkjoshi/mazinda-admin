import BulkUploadRequest from "@/models/BulkUploadRequest";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();
    let bulk_upload_requests = await BulkUploadRequest.find();

    return NextResponse.json({
      success: true,
      message: "Bulk upload requests fetched successfully",
      bulk_upload_requests,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the bulk upload requests",
      error,
    });
  }
}
