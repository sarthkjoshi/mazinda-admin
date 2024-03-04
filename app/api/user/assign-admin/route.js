import User from "@/models/User";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phoneNumber, password, allowedPaths } = await req.json();

    // Connecting to the database
    await connectDB();

    // Checking if the user already exists with either email or phone number
    const user = await User.findOne({ phoneNumber });

    if (user) {
      if (user.role && user.role === "admin") {
        return NextResponse.json({
          success: false,
          message: "Already an admin",
        });
      }
      user.role = "admin";
      user.allowedPaths = allowedPaths;
      user.password = password;

      await user.save();

      return NextResponse.json({
        success: true,
        message: "User assigned as admin successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "User does not exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the user",
      error,
    });
  }
}
