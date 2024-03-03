import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import CutleryDetail from "@/models/CutleryDetail";

export async function GET() {
  try {
    await connectDB();

    const cutlery = await CutleryDetail.findOne({});

    return NextResponse.json({ success: true, cutlery });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching Cultery Details." + error,
    });
  }
}
export async function PUT(req) {
  try {
    const { isAvailable, price } = await req.json();

    let cutleryDetails = await CutleryDetail.findOne();
    if (!cutleryDetails) {
      cutleryDetails = new CutleryDetail({ isAvailable, price });
    } else {
      cutleryDetails.isAvailable = isAvailable;
      cutleryDetails.price = price;
    }
    await cutleryDetails.save();

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
