import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import DeliveryBoy from "@/models/DeliveryBoy";
import FoodOrder from "@/models/FoodOrder";

export async function GET(req) {
  try {
    // Connecting to database
    await connectDB();

    const deliveryBoys = await DeliveryBoy.find({});
    console.log(deliveryBoys);
    return NextResponse.json({
      success: true,
      message: "DeliveryBoys fetched successfully",
      deliveryBoys,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the deliveryBoys",
      error,
    });
  }
}
export async function PUT(req) {
  try {
    // Connecting to database
    await connectDB();
    const { orderId, deliveryBoyId } = await req.json();
    const order = await FoodOrder.findByIdAndUpdate(
      orderId,
      { deliveryBoyId },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Assigned successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while assigning the deliveryBoys",
      error,
    });
  }
}
