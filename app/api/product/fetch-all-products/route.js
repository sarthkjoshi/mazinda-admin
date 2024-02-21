// Assuming you have a page, pageSize, approvalStatus, and vendorId parameter
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    
    const { page = 1, pageSize = 10, approvalStatus, selectedVendor, selectedCategory } = await req.json();
    const skip = (page - 1) * pageSize;

    // Apply filters for approvalStatus and vendorId if provided and not undefined
    const filters = {};
    
    if (approvalStatus !== undefined) {
      filters.approvalStatus = approvalStatus;
    }

    if (selectedVendor !== "") {
      filters.storeId = selectedVendor;
    }

    if (selectedCategory !== "") {
      filters.category = selectedCategory;
    }
    // console.log(filters);
    let products = await Product.find(filters).skip(skip).limit(pageSize);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: "An error occurred while fetching the products: " + error });
  }
}
