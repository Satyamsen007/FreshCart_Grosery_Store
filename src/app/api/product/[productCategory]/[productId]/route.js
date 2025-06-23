import Product from "@/models/Product.model";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  const { productCategory, productId } = await params;

  try {
    await connectDb();

    const product = await Product.findOne({
      _id: productId,
    })
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewCustommer',
          select: 'fullName email avatar'
        }
      })
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product", error: error.message },
      { status: 500 }
    );
  }
}
