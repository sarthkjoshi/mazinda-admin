import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import FoodDetail from "@/models/FoodDetail";

export async function GET() {
  try {
    await connectDB();

    const foodDetails = await FoodDetail.findOne({});
    const alert = foodDetails.alert;

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching Cultery Details." + error,
    });
  }
}
export async function PUT(req) {
  try {
    const { message, isActive } = await req.json();

    let alert = await FoodDetail.findOne();

    if (!alert) {
      alert = new FoodDetail({ message, isActive });
    } else {
      alert.alert.message = message;
      alert.alert.isActive = isActive;
    }

    await alert.save();

    return NextResponse.json({
      success: true,
      message: "Alert saved successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while saving Alert." + error,
    });
  }
}
