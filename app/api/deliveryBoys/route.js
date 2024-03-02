import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import DeliveryBoy from "@/models/DeliveryBoy";
import FoodOrder from "@/models/FoodOrder";
import axios from "axios";
export async function GET(req) {
  try {
    // Connecting to database
    await connectDB();

    const deliveryBoys = await DeliveryBoy.find({});

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
    const {
      deliveryBoyId,
      groupid,
      orderId,
      vendorName,
      products,
      address,
      amount,
    } = await req.json();

    const productsList = Object.entries(products)
      .map(
        ([productName, details]) => `\n\t${productName} - ${details.quantity}\n`
      )
      .join("");

    const message = `*New Order (id: ${orderId.slice(-4)})*

      *Pickup*: ${vendorName}
 
      *Products*: \n${productsList}
 
      *Delivery Location*: 
        
        *Phone Number*: ${address.phoneNumber}
        *Address*: ${address.hostel}, ${address.campus}

      *Amount*: ${amount}
      *Open in browser*: enter your url
      `;

    console.log(message);
    //asssignment
    await FoodOrder.findByIdAndUpdate(
      orderId,
      { deliveryBoyId },
      { new: true }
    );
    const res = NextResponse.json({
      success: true,
      message: "Assigned successfully",
    });
    console.log(groupid);
    // REPLACE group_id with groupid
    const response = await axios.post(
      `https://wapp.powerstext.in/api/send_group?group_id=${groupid}&type=text&message=${message}&instance_id=6534CC8282DA7&access_token=65338e1dbc831`
    );

    if (response.data.status === "success") {
      console.log("message dilevered");
    }

    return res;
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `An error occurred while assigning the deliveryBoys ${error}`,
      error,
    });
  }
}
