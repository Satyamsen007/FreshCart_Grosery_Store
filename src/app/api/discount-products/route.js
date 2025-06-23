// /api/products/discounted/route.js
import Product from "@/models/Product.model";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);

    // Pagination setup
    const page = Math.max(1, parseInt(searchParams.get("page"))) || 1;
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")))) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const rating = parseFloat(searchParams.get("rating")) || undefined;
    const brand = searchParams.get("brand") || "";
    const category = searchParams.get("category") || "all";
    const minPrice = parseFloat(searchParams.get("minPrice")) || undefined;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || undefined;

    // Get all products with at least one variant
    const allProducts = await Product.find({ "variants.0": { $exists: true } }).lean();

    // Filter only those whose first variant has 40%+ discount and not expired
    let filtered = allProducts.filter((product) => {
      const v = product.variants[0];
      if (
        v.discountPrice > 0 &&
        v.discountExpires &&
        v.discountPrice >= v.regularPrice * 0.6
      ) {
        return true;
      }
      return false;
    });

    // Apply additional filters
    filtered = filtered.filter((product) => {
      const v = product.variants[0];
      if (
        (brand && !product.brand.toLowerCase().includes(brand.toLowerCase())) ||
        (category !== "all" && product.category !== category) ||
        (rating && product.reviews?.every((r) => r.rating < rating)) ||
        (minPrice !== undefined && v.regularPrice < minPrice) ||
        (maxPrice !== undefined && v.regularPrice > maxPrice)
      ) {
        return false;
      }
      return true;
    });

    // Sort by best-selling (default)
    filtered.sort((a, b) => b.unitsSold - a.unitsSold);

    // Paginate
    const paginated = filtered.slice(skip, skip + limit);
    const productsWithDiscount = paginated.map(product => {
      const v = product.variants[0];
      return {
        ...product,
        discountPercent: Math.round(100 - (v.discountPrice / v.regularPrice) * 100),
      };
    });

    return NextResponse.json({
      success: true,
      products: productsWithDiscount,
      totalProducts: filtered.length,
      currentPage: page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  } catch (error) {
    console.error("Error fetching filtered discounted products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch discounted products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
