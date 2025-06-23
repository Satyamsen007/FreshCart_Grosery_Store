import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Product from '@/models/Product.model';
import User from '@/models/User.model';
import { connectDb } from '@/lib/dbConnect';

// Add a review
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, comment, rating } = await req.json();

    if (!productId || !comment || !rating) {
      return NextResponse.json(
        { error: 'Product ID, comment, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await connectDb();

    const user = await User.findById(session.user._id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(
      review => review.reviewCustommer.toString() === user._id.toString()
    );

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    const review = {
      reviewCustommer: user._id,
      reviewComment: comment,
      rating,
      likes: [],
      createdAt: new Date()
    };

    product.reviews.push(review);
    await product.save();

    // Populate user details for the response
    const populatedReview = await Product.populate(product, {
      path: 'reviews.reviewCustommer',
      select: 'fullName avatar image'
    });

    return NextResponse.json(populatedReview.reviews[populatedReview.reviews.length - 1]);
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}