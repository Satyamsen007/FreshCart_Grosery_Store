import { connectDb } from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();

    // Find all orders
    const orders = await Order.find({});

    console.log("Current order statuses:", orders.map(o => ({ id: o._id, status: o.status })));

    // Count orders by status
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    console.log("Status counts:", statusCounts);

    return NextResponse.json({
      success: true,
      message: "Order statuses retrieved",
      statusCounts,
      orders: orders.map(o => ({ id: o._id, status: o.status }))
    });

  } catch (error) {
    console.error("Error checking orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check orders", error: error.message },
      { status: 500 }
    );
  }
} 