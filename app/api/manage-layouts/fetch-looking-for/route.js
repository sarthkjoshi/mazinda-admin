import LookingFor from "@/models/LookingFor";
import Category from "@/models/Category"; // Import the Category model
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDB()

        // Use populate to replace category_id with the actual Category document
        let sections = await LookingFor.find().populate('category_id');

        return NextResponse.json({ success: true, sections });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the lookingfor images: " + error });
    }
}