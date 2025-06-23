import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to proceed with payment" },
        { status: 401 }
      );
    }

    const { items, orderId } = await req.json();

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate tax (10%) and delivery charge
    const tax = subtotal * 0.10;
    const deliveryCharge = 40; // Fixed delivery charge
    const finalAmount = subtotal + tax + deliveryCharge;

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: session.user.email,
      metadata: {
        orderId: orderId
      },
      line_items: [
        // Add product items
        ...items.map(item => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100), // Convert to paise
          },
          quantity: item.quantity,
        })),
        // Add tax as a separate line item
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Tax (10%)",
            },
            unit_amount: Math.round(tax * 100), // Convert to paise
          },
          quantity: 1,
        },
        // Add delivery charge as a separate line item
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Delivery Charge",
            },
            unit_amount: Math.round(deliveryCharge * 100), // Convert to paise
          },
          quantity: 1,
        }
      ],
    });

    return NextResponse.json({
      success: true,
      url: stripeSession.url
    });

  } catch (error) {
    console.error("Stripe session creation error:", error);
    return NextResponse.json(
      { success: false, message: "Payment session creation failed" },
      { status: 500 }
    );
  }
} 