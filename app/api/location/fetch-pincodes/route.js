import Location from "@/models/Location";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { id } = await req.json()
    try {
        await connectDB()

        let location = await Location.findById(id)
        return NextResponse.json({ success: true, pincodes: location.pincodes });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the Locations : " + error });
    }
}