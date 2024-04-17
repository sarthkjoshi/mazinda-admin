import ProductCDB from "@/models/ProductCDB";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { _id } = await req.json();

    const result = await ProductCDB.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true, message: "Product deleted" });
    } else {
      return NextResponse.json({
        success: false,
        message: "Product not found or not deleted",
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
