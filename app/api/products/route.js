import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    let query = {};

    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: "পণ্য লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const product = await Product.create(body);

    return NextResponse.json(
      { message: "পণ্য যোগ হয়েছে", product },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "পণ্য যোগ করা যায়নি" },
      { status: 500 }
    );
  }
}