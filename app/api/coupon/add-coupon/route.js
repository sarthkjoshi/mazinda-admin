import Coupon from "@/models/Coupon";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { coupon } = await req.json();
    const {
      code,
      isActive,
      discount,
      discountType,
      discountOn,
      maxLimit,
      minOrder,
      usageLimit,
      categories,
      cities,
      description,
    } = coupon;

    await connectDB();
    let fetchedCoupon = await Coupon.findOne({ code });

    if (!fetchedCoupon) {
      await Coupon.create({
        code: code.toUpperCase(),
        isActive,
        discount,
        discountType,
        discountOn,
        maxLimit,
        minOrder,
        usageLimit,
        categories,
        cities,
        description,
      });
      return NextResponse.json({
        success: true,
        message: "Coupon created successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Coupon already exists",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the coupon : " + error,
    });
  }
}
