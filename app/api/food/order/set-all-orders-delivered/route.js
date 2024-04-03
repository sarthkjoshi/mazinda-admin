import FoodOrder from "@/models/FoodOrder";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT() {
  try {
    // Connecting to the database
    await connectDB();

    // Finding orders with status "Processing" or "Out for delivery"
    let orders = await FoodOrder.find({
      status: { $in: ["Processing", "Out for delivery"] },
    });

    if (orders && orders.length > 0) {
      // Update status to "Delivered" for all retrieved orders
      await Promise.all(
        orders.map(async (order) => {
          order.status = "Delivered";
          await order.save();
        })
      );

      return NextResponse.json({
        success: true,
        message: "Orders updated successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message:
          "Orders with 'Processing' or 'Out for delivery' status don't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while updating the orders: " + error,
    });
  }
}
