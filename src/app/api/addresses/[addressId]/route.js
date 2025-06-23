import { connectDb } from "@/lib/dbConnect";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

// PUT /api/addresses/[addressId] - Update an address
export async function PUT(req, { params }) {
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

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === params.addressId
    );

    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // If setting as primary, update other addresses
    if (addressData.isPrimary) {
      user.addresses.forEach(addr => {
        addr.isPrimary = false;
      });
    }

    // Update the address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...addressData,
    };

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address updated successfully",
        address: user.addresses[addressIndex]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses/[addressId] - Delete an address
export async function DELETE(req, { params }) {
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

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === params.addressId
    );

    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // If deleting the primary address, make the first remaining address primary
    const wasDeleted = user.addresses[addressIndex].isPrimary;
    user.addresses.splice(addressIndex, 1);

    if (wasDeleted && user.addresses.length > 0) {
      user.addresses[0].isPrimary = true;
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address deleted successfully",
        addressId: params.addressId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 