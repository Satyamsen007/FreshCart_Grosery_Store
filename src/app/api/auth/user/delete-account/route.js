import { connectDb } from "@/lib/dbConnect";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/options";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();
    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(session.user.id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Delete user's avatar from Cloudinary if exists
    if (deletedUser.avatar?.public_id) {
      try {
        await cloudinary.uploader.destroy(deletedUser.avatar.public_id);
      } catch (error) {
        console.error("Error deleting avatar:", error);
      }
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}