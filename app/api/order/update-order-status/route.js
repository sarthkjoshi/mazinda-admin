import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        const { id, status } = await req.json();

        await connectDB()

        let order = await Order.findById(id)

        if (!order) {
            return NextResponse.json({ success: false, error: "Order doesn't exists" });
        }
        
        order.status = status;
        order.isDelivered = status === "delivered";
        
        await order.save();

        return NextResponse.json({ success: true, message: "Orders status successfully", order });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the products : " + error });
    }
}