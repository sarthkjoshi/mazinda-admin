import LookingFor from "@/models/LookingFor";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { section_id } = await req.json();

        await connectDB()

        await LookingFor.findByIdAndDelete(section_id);
        
        return NextResponse.json({ success: true, message: "Successfully deleted the section" });

    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while deleting the section : " + error });
    }
}