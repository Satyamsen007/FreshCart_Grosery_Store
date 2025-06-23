// File: /app/api/get-products/route.js
import Product from "@/models/Product.model";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";

export async function GET(req) {
  try {

    await connectDb();

    const { searchParams } = new URL(req.url);

    // Pagination params with validation
    const page = Math.max(1, parseInt(searchParams.get("page"))) || 1;
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")))) || 6;
    const skip = (page - 1) * limit;

    // Filter params with better handling
    const sort = searchParams.get("sort") || "";
    const rating = parseFloat(searchParams.get("rating")) || undefined;
    const offer = searchParams.get("offer") || "";
    const brand = searchParams.get("brand") || "";
    const category = searchParams.get("category") || "all";
    const minPrice = parseFloat(searchParams.get("minPrice")) || undefined;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || undefined;
    const search = searchParams.get("search") || "";

    // Build MongoDB query
    const baseQuery = {
      ...(brand && { brand: { $regex: brand, $options: 'i' } }),
      ...(category && category !== "all" && { category }),
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }),
    };

    // Handle price filtering for variants
    const priceQuery = {};
    if (minPrice !== undefined) priceQuery.$gte = minPrice;
    if (maxPrice !== undefined) priceQuery.$lte = maxPrice;

    // Handle offer types
    const offerQuery = {};
    if (offer === "discount") {
      offerQuery["variants.isDiscountActive"] = true;
    } else if (offer === "bogo") {
      offerQuery["isBOGO"] = true;
    } else if (offer === "clearance") {
      offerQuery["isClearance"] = true;
    }

    // Combine all queries
    const finalQuery = {
      ...baseQuery,
      ...(Object.keys(priceQuery).length > 0 && {
        "variants.regularPrice": priceQuery
      }),
      ...offerQuery,
      ...(rating !== undefined && { "reviews.rating": { $gte: rating } })
    };

    // Sort options
    let sortOption = { createdAt: -1 }; // default sort
    if (sort === "price_low_to_high") sortOption = { "variants.regularPrice": 1 };
    else if (sort === "price_high_to_low") sortOption = { "variants.regularPrice": -1 };
    else if (sort === "rating") sortOption = { "reviews.rating": -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };
    else if (sort === "popular") sortOption = { unitsSold: -1 };

    const [products, totalProducts] = await Promise.all([
      Product.find(finalQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Product.countDocuments(finalQuery),
    ]);

    // Process products to include only variants that match price range
    const processedProducts = products.map(product => {
      // Filter variants based on price range
      const filteredVariants = product.variants.filter(variant => {
        const priceMatch = (minPrice === undefined || variant.regularPrice >= minPrice) &&
          (maxPrice === undefined || variant.regularPrice <= maxPrice);

        // Filter based on offer type
        const offerMatch =
          offer === "" ||
          (offer === "discount" && variant.isDiscountActive) ||
          (offer === "bogo" && product.isBOGO) ||
          (offer === "clearance" && product.isClearance);

        return priceMatch && offerMatch;
      });

      // Calculate average rating
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

      return {
        ...product,
        variants: filteredVariants,
        averageRating: avgRating,
        hasDiscount: filteredVariants.some(v => v.isDiscountActive)
      };
    });

    // Filter out products with no matching variants after filtering
    const validProducts = processedProducts.filter(p => p.variants.length > 0);

    return NextResponse.json({
      success: true,
      products: validProducts,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}