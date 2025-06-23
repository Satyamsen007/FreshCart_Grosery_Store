import { connectDb } from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to view orders" },
        { status: 401 }
      );
    }

    // Get orders with populated product details and variants
    const orders = await Order.find({ buyer: session.user._id })
      .populate({
        path: 'items.product',
        select: 'name images variants'
      })
      .sort({ createdAt: -1 }); // Most recent first

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}