import { connectDb } from "@/lib/dbConnect";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

// GET /api/addresses - Get all addresses for the current user
export async function GET() {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, addresses: user.addresses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Create a new address
export async function POST(req) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const addressData = await req.json();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // If this is the first address or isPrimary is true, update other addresses
    if (addressData.isPrimary || user.addresses.length === 0) {
      user.addresses.forEach(addr => {
        addr.isPrimary = false;
      });
      addressData.isPrimary = true;
    }

    user.addresses.push(addressData);
    await user.save();

    // Return the newly created address
    const newAddress = user.addresses[user.addresses.length - 1];

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        address: newAddress
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 