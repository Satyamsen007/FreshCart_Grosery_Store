import { connectDb } from "@/lib/dbConnect";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/options";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudenary";
import cloudinary from "cloudinary";


export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { avatar, fullName } = await req.json();

    if (!avatar || !fullName) {
      return NextResponse.json(
        { message: "Avatar and fullName are required" },
        { status: 400 }
      );
    }

    await connectDb();

    // Get current user to check existing avatar
    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    let avatarUrl = avatar;

    // Check if user has existing avatar

    if (currentUser.avatar.url) {
      // Check if it's a Cloudinary image
      if (currentUser.avatar.url.includes('cloudinary')) {
        try {
          // Destroy the existing image
          await cloudinary.uploader.destroy(currentUser.avatar.public_id);
        } catch (error) {
          console.error("Error deleting old avatar:", error);
        }
      }
    }

    // Upload new avatar to Cloudinary
    try {
      const uploadResult = await uploadToCloudinary(avatar);
      if (uploadResult && uploadResult.secure_url) {
        avatarUrl = uploadResult.secure_url;
      }
    } catch (error) {
      console.error("Error uploading new avatar:", error);
      return NextResponse.json(
        { message: "Failed to upload avatar" },
        { status: 500 }
      );
    }

    // Update user with new avatar and fullName
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        avatar: {
          public_id: avatarUrl.split('/').slice(-1)[0].split('.')[0],
          url: avatarUrl
        },
        fullName
      },
      { new: true }
    ).select("-password");

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


