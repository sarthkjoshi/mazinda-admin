import Banner from "@/models/Banner";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();

    const banners = await Banner.find();

    return NextResponse.json({
      success: true,
      message: "Banners fetched successfully",
      banners,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the banners",
      error,
    });
  }
}
