import { connectDb } from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to update order payment status" },
        { status: 401 }
      );
    }

    const { orderId, paymentStatus } = await req.json();

    if (!orderId || !paymentStatus) {
      return NextResponse.json(
        { success: false, message: "Order ID and paymentStatus are required" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to update this order
    if (order.seller.toString() !== session.user._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to update this order payment status" },
        { status: 403 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'unpaid', 'paid', 'failed', 'refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment Status" },
        { status: 400 }
      );
    }


    order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();


    return NextResponse.json({
      success: true,
      message: "Order Payment status updated successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order payment status" },
      { status: 500 }
    );
  }
}
