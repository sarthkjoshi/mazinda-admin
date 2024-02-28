import connectDB from "@/libs/mongoose";
import Mode from "@/models/Mode";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const modeDoc = await Mode.findOne({});
    const mode = modeDoc.mode;

    return NextResponse.json({ success: true, mode });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the mode: " + error,
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { newMode } = await req.json();
    console.log(newMode);
    const agya = await Mode.updateOne({}, { mode: newMode }, { upsert: true });

    return NextResponse.json({ success: true, newMode });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while updating the mode: " + error,
    });
  }
}
