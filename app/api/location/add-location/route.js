import Location from "@/models/Location";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { city, pincodes } = await req.json();

        await connectDB()
        let location = await Location.findOne({ city })

        if (!location) {
            await Location.create({ city, pincodes });
            return NextResponse.json({ success: true, message: "Location created successfully" });
        }

        else {
            return NextResponse.json({ success: false, message: "Location already exists" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the Location : " + error });
    }
}