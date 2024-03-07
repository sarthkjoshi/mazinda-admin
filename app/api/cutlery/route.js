import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import FoodDetail from "@/models/FoodDetail";

export async function GET() {
  try {
    await connectDB();

    const c = await FoodDetail.findOne({});
    const cutlery = c.cutleryDetail;

    return NextResponse.json({ success: true, cutlery });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching alert." + error,
    });
  }
}
export async function PUT(req) {
  try {
    const { isAvailable, price } = await req.json();

    let foodDetails = await FoodDetail.findOne();
    if (!foodDetails) {
      foodDetails = new FoodDetail({ isAvailable, price });
    } else {
      foodDetails.cutleryDetail.isAvailable = isAvailable;
      foodDetails.cutleryDetail.price = price;
    }
    await foodDetails.save();

    return NextResponse.json({
      success: true,
      message: "Cutlery details saved successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while saving Cultery Details." + error,
    });
  }
}
