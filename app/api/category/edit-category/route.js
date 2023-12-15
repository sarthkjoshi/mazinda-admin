import Category from "@/models/Category";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { updated_category } = await req.json();
    try {
        await connectDB()
        let category = await Category.findById(updated_category._id);

        if (!category) {
            return NextResponse.json({ success: false, error: "Category doesn't exist" + error });
        }

        category.subcategories = updated_category.subcategories;
        await category.save();

        return NextResponse.json({ success: true, message: "Category updated successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the Category : " + error });
    }
}