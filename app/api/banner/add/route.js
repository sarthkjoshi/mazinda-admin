import Banner from "@/models/Banner";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      image,
      banner_type,
      link_type,
      category_id,
      product_id,
      external_link,
      city_ids,
    } = await req.json();

    await connectDB();

    // Check if category_id is provided and not an empty string
    const bannerData = {
      image,
      banner_type,
      link_type,
      product_id,
      external_link,
      city_ids,
    };

    if (category_id && category_id.trim() !== "") {
      bannerData.category_id = category_id;
    }

    await Banner.create(bannerData);

    return NextResponse.json({
      success: true,
      message: "Banner created successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while creating the banner",
      error,
    });
  }
}
