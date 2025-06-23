import Product from "@/models/Product.model";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);

    // Pagination setup
    const page = Math.max(1, parseInt(searchParams.get("page"))) || 1;
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")))) || 6;
    const skip = (page - 1) * limit;

    // Filters
    const sort = searchParams.get("sort") || "";
    const rating = parseFloat(searchParams.get("rating")) || undefined;
    const offer = searchParams.get("offer") || "";
    const brand = searchParams.get("brand") || "";
    const category = searchParams.get("category") || "all";
    const minPrice = parseFloat(searchParams.get("minPrice")) || undefined;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || undefined;
    const search = searchParams.get("search") || "";

    // Base filters (excluding unitsSold here)
    const baseQuery = {
      unitsSold: { $gt: 0 }, // Best-selling filter first
      ...(brand && { brand: { $regex: brand, $options: 'i' } }),
      ...(category && category !== "all" && { category }),
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }),
    };

    const priceQuery = {};
    if (minPrice !== undefined) priceQuery.$gte = minPrice;
    if (maxPrice !== undefined) priceQuery.$lte = maxPrice;

    if (Object.keys(priceQuery).length > 0) {
      baseQuery["variants.regularPrice"] = priceQuery;
    }

    // Offer conditions
    if (offer === "discount") {
      baseQuery["variants.isDiscountActive"] = true;
    } else if (offer === "bogo") {
      baseQuery["isBOGO"] = true;
    } else if (offer === "clearance") {
      baseQuery["isClearance"] = true;
    }

    // Rating filter
    if (rating !== undefined) {
      baseQuery["reviews.rating"] = { $gte: rating };
    }

    // Sort options
    let sortOption = { unitsSold: -1 }; // default for best-selling
    if (sort === "price_low_to_high") sortOption = { "variants.regularPrice": 1 };
    else if (sort === "price_high_to_low") sortOption = { "variants.regularPrice": -1 };
    else if (sort === "rating") sortOption = { "reviews.rating": -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };
    else if (sort === "popular") sortOption = { unitsSold: -1 };

    const [products, totalProducts] = await Promise.all([
      Product.find(baseQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(baseQuery),
    ]);

    return NextResponse.json({
      success: true,
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
