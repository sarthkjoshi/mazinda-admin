import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { productId, propertyName, propertyValue } = await req.json();

    await connectDB();
    
    let product = await Product.findOne({ _id: productId });

    if (product) {

      if(propertyName == "topDeal"){
          product.topDeal = propertyValue;
      }
      if(propertyName == "trending"){
        product.trending = propertyValue;
      }

      await product.save();
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Product doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while updating the product : " + error,
    });
  }
}
