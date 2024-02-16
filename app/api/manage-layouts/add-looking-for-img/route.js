
import LookingFor from "@/models/LookingFor";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { image, link_type, category_id, cityIds } = await req.json();

        await connectDB()
        
        await LookingFor.create({ image, link_type, category_id, cityIds });
        return NextResponse.json({ success: true, message: "LookingFor section created successfully" });
        
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the LookingFor : " + error });
    }
}