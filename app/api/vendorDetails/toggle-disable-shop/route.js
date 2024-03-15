import Vendor from "@/models/Vendor";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { id } = await req.json();

    // Connecting to database
    await connectDB();

    // Checking if the Vendor already exists
    let vendor = await Vendor.findById(id);

    if (vendor) {
      vendor.disabled = !vendor.disabled;
      await vendor.save();
      if (vendor.disabled === true) {
        return NextResponse.json({
          success: true,
          message: `${vendor.name} disabled successfully`,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: `${vendor.name} enabled successfully`,
        });
      }
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
