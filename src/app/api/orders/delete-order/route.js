import { connectDb } from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to delete order" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
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

    // Check if user is authorized to delete this order
    if (order.buyer.toString() !== session.user._id && order.seller.toString() !== session.user._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to delete this order" },
        { status: 403 }
      );
    }

    // Check if order can be deleted (only allow deletion of cancelled or failed orders)
    if (!['cancelled', 'failed'].includes(order.status)) {
      return NextResponse.json(
        { success: false, message: "Only cancelled or failed orders can be deleted" },
        { status: 400 }
      );
    }

    // Delete the order
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      deleteOrderId: deletedOrder._id
    });

  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}
