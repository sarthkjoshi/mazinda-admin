import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { productData } = await req.json();

    await connectDB();

    let product = await Product.findOne({ _id: productData._id });

    if (product) {
      product.storeId = productData.storeId;
      product.productName = productData.productName;
      product.imagePaths = productData.imagePaths;
      product.category = productData.category;
      product.subcategory = productData.subcategory;
      product.pricing = productData.pricing;
      product.password = productData.password;
      product.approvalStatus = productData.approvalStatus;
      product.trending = productData.trending;
      product.topDeal = productData.topDeal;
      product.isAvailable = productData.isAvailable;
      product.description = productData.description;
      product.tags = productData.tags;
      product.variants = productData.variants;

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
