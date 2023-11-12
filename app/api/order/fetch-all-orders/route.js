import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        const { filter } = await req.json();

        await connectDB()

        let orders;

        if (filter === 'delivered') {
            orders = await Order.find({ isDelivered: true });
        } else if (filter === 'active') {
            orders = await Order.find({ isDelivered: false });
        } else {
            orders = await Order.find();
        }

        return NextResponse.json({ success: true, message: "Current orders fetched successfully", orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the orders : " + error });
    }
}