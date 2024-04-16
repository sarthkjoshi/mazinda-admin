import ProductCDB from "@/models/ProductCDB";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  await connectDB();

  try {
    const { pricing, id } = await req.json();
    console.log(pricing, id);
    const product = await ProductCDB.findByIdAndUpdate(
      id,
      { pricing: pricing },
      { new: true }
    );
    console.log("123", pricing, id);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
