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
    const rating = parseFloat(searchParams.get("rating")) || undefined;
    const offer = searchParams.get("offer") || "";
    const brand = searchParams.get("brand") || "";
    const category = searchParams.get("category") || "all";
    const minPrice = parseFloat(searchParams.get("minPrice")) || undefined;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || undefined;

    // Base filters (excluding unitsSold here)
    const baseQuery = {
      unitsSold: { $gt: 0 }, // Best-selling filter first
      ...(brand && { brand: { $regex: brand, $options: 'i' } }),
      ...(category && category !== "all" && { category }),
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

    const [products, totalProducts] = await Promise.all([
      Product.find(baseQuery)
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
