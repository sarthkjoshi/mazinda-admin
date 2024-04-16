import ProductCDB from "@/models/ProductCDB";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { page = 1, pageSize = 10 } = await request.json();
    const skip = (page - 1) * pageSize;

    const totalCount = await ProductCDB.countDocuments();
    const products = await ProductCDB.find().skip(skip).limit(pageSize);

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      products,
      totalCount,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the products",
      error: error.message,
    });
  }
}
