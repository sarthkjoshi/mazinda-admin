// Assuming you have a page, pageSize, and approvalStatus parameter
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    
    const { page = 1, pageSize = 10, approvalStatus } = await req.json();
    const skip = (page - 1) * pageSize;

    // Apply filter for approvalStatus if provided and not undefined
    const filter = approvalStatus !== undefined ? { approvalStatus } : {};

    let products = await Product.find(filter).skip(skip).limit(pageSize);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: "An error occurred while fetching the products: " + error });
  }
}
