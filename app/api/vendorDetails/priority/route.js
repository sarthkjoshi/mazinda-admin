import Vendor from "@/models/Vendor";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { vendorId, priority } = await req.json();
    await connectDB();

    const vendor = await Vendor.findOne({ _id: vendorId });
    if (vendor) {
      vendor.priority = priority;

      await vendor.save();
      return NextResponse.json({
        success: true,
        message: "Priority updated successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Vendor doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the vendor : " + error,
    });
  }
}
