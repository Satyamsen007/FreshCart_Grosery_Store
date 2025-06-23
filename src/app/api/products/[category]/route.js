import Product from "@/models/Product.model";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  const { category } = await params;
  try {
    await connectDb();
    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const products = await Product.find({
      category: formattedCategory
    }).lean();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message
      },
      { status: 500 }
    );
  }
}