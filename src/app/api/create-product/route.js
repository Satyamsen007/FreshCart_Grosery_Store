import { connectDb } from "@/lib/dbConnect";
import Product from "@/models/Product.model";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import User from "@/models/User.model";

// Helper function to extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  const urlParts = url.split('/');
  const uploadIndex = urlParts.indexOf('upload');
  const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
  return pathAfterUpload.split('.')[0]; // Remove file extension
};

export async function POST(req) {
  try {
    // 1. Authentication Check
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET_KEY });
    if (!token || !token._id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // 5. Database Operation
    await connectDb();
    const user = await User.findById(token._id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    // 2. Parse and Validate Request Data
    const requestData = await req.json();

    if (!requestData.images || !Array.isArray(requestData.images) || requestData.images.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one image is required' },
        { status: 400 }
      );
    }


    // 4. Validate Variants
    if (!requestData.variants || !Array.isArray(requestData.variants) || requestData.variants.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one variant is required' },
        { status: 400 }
      );
    }

    const processedVariants = requestData.variants.map(variant => {
      // Set discount expiration if discount exists
      if (variant.discountPrice) {
        return {
          ...variant,
          discountExpires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          isDiscountActive: true
        };
      }
      return variant;
    });

    // 3. Transform Images Array
    const transformedImages = requestData.images.map(url => ({
      public_id: extractPublicId(url),
      url: url
    }));

    const productData = {
      ...requestData,
      images: transformedImages,
      variants: processedVariants,
      createdBy: token._id,
      // Calculate total stock across all variants
      stock: processedVariants.reduce((total, variant) => total + (variant.stock || 0), 0)
    };

    // 8. Create Product
    const newProduct = await Product.create(productData);


    // 6. Success Response
    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product: newProduct
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Product creation error:', error);

    // 7. Error Handling
    let errorMessage = 'Failed to create product';
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
      statusCode = 400;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}