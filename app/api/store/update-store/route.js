import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { storeData } = await req.json();
        // Connecting to database
        await connectDB()

        // Checking if the user already exists
        let store = await Store.findOne({ _id: storeData._id });

        if (store) {
            
            store.storeName = storeData.storeName;
            store.ownerName = storeData.ownerName;
            store.mobileNumber = storeData.mobileNumber;
            store.alternateMobileNumber = storeData.alternateMobileNumber;
            store.email = storeData.email;
            store.password = storeData.password;
            store.imageURI = storeData.imageURI;
            store.approvedStatus = storeData.approvedStatus;

            await store.save();
            return NextResponse.json({ success: true, message: "Store updated successfully" });
        } else {
            return NextResponse.json({ success: false, message: "Store doesn't exist" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the store : " + error });
    }
}

