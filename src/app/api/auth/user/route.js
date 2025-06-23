import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../[...nextauth]/options'
import { connectDb } from '@/lib/dbConnect'
import User from '@/models/User.model'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Connect to database
    await connectDb();

    // Find user in database
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const primaryAddress = user.addresses?.find(address => address.isPrimary);

    // Return user data from database
    return NextResponse.json({
      fullName: user.fullName,
      email: user.email,
      phone: primaryAddress?.contact?.phone || '',
      avatar: {
        url: user.avatar?.url || ''
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}