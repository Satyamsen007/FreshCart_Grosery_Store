import { connectDb } from "@/lib/dbConnect";
import User from "@/models/User.model";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";


export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET_KEY })
  if (!token) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized request!'
    }, { status: 401 })
  }
  try {
    await connectDb();
    const authorizedUser = await User.findById(token._id);
    if (!authorizedUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found!'
      }, { status: 404 })
    }
    return NextResponse.json({
      success: true,
      message: 'Get User Details successFully',
      data: authorizedUser
    }, { status: 200 })
  } catch (error) {
    console.log('Error While get the user details', error);
    return NextResponse.json({
      success: false,
      message: 'Got Error while get the user details',
      error: error.message
    })
  }
}