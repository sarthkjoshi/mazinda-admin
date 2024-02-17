import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import FoodOrder from "@/models/FoodOrder";

export async function POST(req) {
  const { page, perPage } = await req.json();
  try {
    // Connecting to database
    await connectDB();
    // const orders = await Order.find()
    const food_orders = await FoodOrder.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return NextResponse.json({
      success: true,
      message: "Food orders fetched successfully",
      food_orders,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the food orders",
      error,
    });
  }
}
