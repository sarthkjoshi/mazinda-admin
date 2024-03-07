import connectDB from "@/libs/mongoose";
import FoodDetail from "@/models/FoodDetail";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const foodDetails = await FoodDetail.findOne({});
    const mode = foodDetails.mode.mode;

    return NextResponse.json({ success: true, mode });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the mode: " + error,
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { newMode } = await req.json();

    await FoodDetail.updateOne({}, { mode: newMode }, { upsert: true });

    return NextResponse.json({ success: true, newMode });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while updating the mode: " + error,
    });
  }
}
