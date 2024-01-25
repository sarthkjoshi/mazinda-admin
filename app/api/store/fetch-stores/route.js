import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Connecting to database
    await connectDB();

    // Checking if the user already exists
    let stores = await Store.find();
    return NextResponse.json({
      success: true,
      message: "Stores fetched successfully",
      stores,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the store : " + error,
    });
  }
}
