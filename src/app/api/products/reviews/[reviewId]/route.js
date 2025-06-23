import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Product from '@/models/Product.model';
import { connectDb } from '@/lib/dbConnect';

// Update a review
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reviewId = await params.reviewId;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const { reviewComment, rating } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!reviewComment || !rating) {
      return NextResponse.json(
        { error: 'Comment and rating are required' },
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

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the review
    if (review.reviewCustommer.toString() !== session.user._id) {
      return NextResponse.json(
        { error: 'You can only update your own reviews' },
        { status: 403 }
      );
    }

    // Update the review
    review.reviewComment = reviewComment;
    review.rating = rating;
    await product.save();

    // Update product's average rating
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;
    product.totalReviews = product.reviews.length;
    await product.save();

    // Populate user details for the response
    const populatedReview = await Product.populate(product, {
      path: 'reviews.reviewCustommer',
      select: 'fullName avatar image'
    });

    const updatedReview = populatedReview.reviews.id(reviewId);

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a review
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reviewId = await params.reviewId;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectDb();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the review
    if (review.reviewCustommer.toString() !== session.user._id) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    // Remove the review using pull
    product.reviews.pull(reviewId);
    await product.save();

    // Update product's average rating
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;
    product.totalReviews = product.reviews.length;
    await product.save();

    return NextResponse.json({
      message: 'Review deleted successfully',
      reviewId: reviewId
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 