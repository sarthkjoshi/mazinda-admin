import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { variantId, variants } = await req.json();

    await connectDB();

    let products = await Product.find({ variantId });

    if (products.length) {
      for (let product of products) {
        product.variants = variants;
        await product.save();
      }

      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Products doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while updating the product : " + error,
    });
  }
}
