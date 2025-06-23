import { connectDb } from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import Product from "@/models/Product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to place an order" },
        { status: 401 }
      );
    }

    const orderData = await req.json();

    // Get the first product to find its seller
    const firstProduct = await Product.findById(orderData.items[0].product);
    if (!firstProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Create the order with seller information
    const order = await Order.create({
      ...orderData,
      buyer: session.user._id,
      seller: firstProduct.createdBy,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'unpaid' : 'pending'
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
