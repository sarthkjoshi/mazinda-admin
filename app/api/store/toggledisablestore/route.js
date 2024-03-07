import connectDB from "@/libs/mongoose";
import Store from "@/models/Store";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { id } = await req.json();

    // Connecting to database
    await connectDB();

    // Checking if the Vendor already exists
    let store = await Store.findOne({ _id: id });

    if (store) {
      store.disableShop = !store.disableShop;
      await store.save();
      if (store.disableShop === true) {
        return NextResponse.json({
          success: true,
          message: `${store.storeName} disabled successfully`,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: `${store.storeName} enabled successfully`,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Store doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the store : " + error,
    });
  }
}
