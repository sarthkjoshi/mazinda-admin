import BulkUploadRequest from "@/models/BulkUploadRequest";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { request_id } = await req.json();
  try {
    await connectDB();
    let bulk_upload_request = await BulkUploadRequest.findById(request_id);

    return NextResponse.json({
      success: true,
      message: "Bulk upload request fetched successfully",
      bulk_upload_request,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the bulk upload request",
      error,
    });
  }
}
