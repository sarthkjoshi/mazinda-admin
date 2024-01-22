import Coupon from "@/models/Coupon";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();
    let coupons = await Coupon.find();

    return NextResponse.json({
      success: true,
      message: "Coupon fetched successfully",
      coupons,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the coupons : " + error,
    });
  }
}
