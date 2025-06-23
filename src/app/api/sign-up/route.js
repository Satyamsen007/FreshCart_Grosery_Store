import { connectDb } from "@/lib/dbConnect";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDb();

  try {
    const { fullName, email, password } = await req.json();

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Create new user
    await User.create({
      fullName,
      email,
      password,
      role: email === 'democoders2004@gmail.com' ? 'admin' : 'user',
      avatar: {},
      cart: [],
      wishlist: [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating user:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the user.",
      },
      { status: 500 }
    );
  }
}
