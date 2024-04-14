import ProductCDB from "@/models/ProductCDB";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import Cors from "micro-cors";

// Create a CORS middleware instance
const cors = Cors({
  allowMethods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
  allowHeaders: [
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Date",
    "X-Api-Version",
  ],
});

export async function POST(req, res) {
  // Enable CORS
  cors(req, res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return NextResponse.status(200).end();
  }

  const { productName, description, imagePaths, category, subcategory } =
    await req.json();
  try {
    // Check if required headers are provided
    if (
      !productName ||
      !description ||
      !imagePaths ||
      !category ||
      !subcategory
    ) {
      throw new Error("Missing required fields");
    }

    await connectDB();

    let product = await ProductCDB.findOne({ productName });

    if (product) {
      return NextResponse.json({
        success: false,
        message: "Duplicate Product",
        error: "Duplicate Product",
      });
    }
    product = await ProductCDB.create({
      productName,
      description,
      imagePaths,
      category,
      subcategory,
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating products:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the products",
      error: error.message,
    });
  }
}
