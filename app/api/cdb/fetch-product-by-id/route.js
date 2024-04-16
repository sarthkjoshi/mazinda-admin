import ProductCDB from "@/models/ProductCDB";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { id } = await req.json();

    const product = await ProductCDB.findOne({ _id: id });

    if (product) {
      return NextResponse.json({ success: true, product });
    } else {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
