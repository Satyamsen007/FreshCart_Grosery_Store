import { connectDb } from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to cancel order" },
        { status: 401 }
      );
    }

    const { orderId } = await req.json();
    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user owns this order
    if (order.buyer.toString() !== session.user._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to cancel this order" },
        { status: 403 }
      );
    }

    // Check if order can be cancelled
    if (order.status !== 'ordered' && order.status !== 'order confirm') {
      return NextResponse.json(
        { success: false, message: "Order cannot be cancelled at this stage" },
        { status: 400 }
      );
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel order" },
      { status: 500 }
    );
  }
} 