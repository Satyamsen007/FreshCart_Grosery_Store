import { connectDb } from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import Product from "@/models/Product.model";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get('limit')) || 6;
    const skip = (page - 1) * limit;

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to view orders" },
        { status: 401 }
      );
    }

    // Get orders with populated product and buyer details
    const orders = await Order.find({ seller: session.user._id })
      .populate({
        path: 'items.product',
        model: Product,
        select: 'name images variants'
      })
      .populate({
        path: 'buyer',
        model: User,
        select: 'fullName email avatar'
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalOrders = await Order.countDocuments({ seller: session.user._id });

    return NextResponse.json({
      success: true,
      orders,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}