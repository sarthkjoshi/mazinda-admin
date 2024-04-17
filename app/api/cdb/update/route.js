import ProductCDB from "@/models/ProductCDB";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    await connectDB();
    const { productData } = await req.json();

    const result = await ProductCDB.updateOne(
      { _id: new ObjectId(productData._id) },
      {
        $set: {
          productName: productData.productName,
          pricing: productData.pricing,
          category: productData.category,
          subcategory: productData.subcategory,
          imagePaths: productData.imagePaths,
          tags: productData.tags,
          description: productData.description,
        },
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ success: true, message: "Product updated" });
    } else {
      return NextResponse.json({
        success: false,
        message: "Product not found or not updated",
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
