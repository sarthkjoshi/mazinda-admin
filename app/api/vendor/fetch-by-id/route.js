// Import necessary modules
import Cors from "micro-cors";
import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Vendor from "@/models/Vendor";

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

// Define your Next.js API route function for POST
export const POST = async (req, res) => {
  // Enable CORS
  cors(req, res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return NextResponse.status(200).end();
  }

  try {
    // Extract _id from the request body
    const { _id } = await req.json();

    console.log("hereeeee");

    // Connect to the database
    await connectDB();

    // Fetch the vendor by ID
    let vendor = await Vendor.findById(_id).select(
      "-password -number -alternateNumber"
    );

    // Handle the response based on whether the vendor exists
    if (vendor) {
      return NextResponse.json({
        success: true,
        message: "Vendor fetched successfully",
        vendor,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Vendor doesn't exist",
      });
    }
  } catch (error) {
    // Handle errors during the process
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the vendor: " + error,
    });
  }
};

// Define your Next.js API route function for GET
export const GET = async (req, res) => {
  // Handle GET method
  // ...
};

// Define your Next.js API route function for PUT
export const PUT = async (req, res) => {
  // Handle PUT method
  // ...
};
