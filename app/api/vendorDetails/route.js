import Vendor from "@/models/Vendor";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const vendors = await Vendor.find();

    return NextResponse.json({ success: true, vendors });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching vendors.",
    });
  }
}

export async function PUT(req) {
  try {
    const { number } = await req.json();

    await connectDB();

    const vendor = await Vendor.findOne({ number });

    if (vendor) {
      const newOpenStatus = !vendor.openStatus;
      await Vendor.findOneAndUpdate(
        { number },
        { $set: { openStatus: newOpenStatus } },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: "openStatus toggled successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Vendor doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the vendor : " + error,
    });
  }
}

export async function POST(req) {
  try {
    const { updatedVendor } = await req.json();
    await connectDB();

    const vendor = await Vendor.findOne({ _id: updatedVendor._id });
    if (vendor) {
      vendor.name = updatedVendor.name;
      vendor.number = updatedVendor.number;
      vendor.alternateNumber = updatedVendor.alternateNumber;
      vendor.password = updatedVendor.password;
      vendor.imageURI = updatedVendor.imageURI;
      vendor.deliveryLocations = updatedVendor.deliveryLocations;
      vendor.deliveryCharges = updatedVendor.deliveryCharges;
      vendor.minOrders = updatedVendor.minOrders;
      vendor.menu = updatedVendor.menu;
      vendor.payPercentage = updatedVendor.payPercentage;
      vendor.whatsapp_group_id = updatedVendor.whatsapp_group_id;
      vendor.deliveryRequirements = updatedVendor.deliveryRequirements;
      await vendor.save();
      return NextResponse.json({
        success: true,
        message: "Vendor updated successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Vendor doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the vendor : " + error,
    });
  }
}
