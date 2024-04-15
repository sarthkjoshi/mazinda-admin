import ProductCDB from "@/models/ProductCDB";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    let products = await ProductCDB.find();

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      products,
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
