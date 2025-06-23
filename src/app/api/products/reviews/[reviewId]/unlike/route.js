import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { connectDb } from '@/lib/dbConnect';
import Product from '@/models/Product.model';

// Unlike a review
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId } = await params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDb();

    // Find the product that contains the review
    const product = await Product.findOne({ 'reviews._id': reviewId });
    if (!product) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // Find the specific review
    const review = product.reviews.id(reviewId);
    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // Check if the user has liked the review
    if (!review.likes.includes(userId)) {
      return NextResponse.json(
        { message: 'You have already Unliked this review' },
        { status: 400 }
      );
    }

    // Remove the user from the likes array
    review.likes = review.likes.filter(id => id.toString() !== userId);
    await product.save();

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error unliking review:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 