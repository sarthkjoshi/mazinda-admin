import Location from "@/models/Location";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDB()

        let locations = await Location.find()
        return NextResponse.json({ success: true, locations });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the Locations : " + error });
    }
}