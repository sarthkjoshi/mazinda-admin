import Category from "@/models/Category";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { categoryName, categoryImage, subcategories } = await req.json();

        await connectDB()
        let category = await Category.findOne({ categoryName })

        if (!category) {
            await Category.create({ categoryName, categoryImage, subcategories });
            return NextResponse.json({ success: true, message: "Category created successfully" });
        } else {
            return NextResponse.json({ success: false, message: "Category already exists" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the Category : " + error });
    }
}