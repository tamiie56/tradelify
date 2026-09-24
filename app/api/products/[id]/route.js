import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id).populate("category", "name slug");

    if (!product) {
      return NextResponse.json({ error: "পণ্য পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "পণ্য লোড করা যায়নি" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    const product = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!product) {
      return NextResponse.json({ error: "পণ্য পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ message: "পণ্য আপডেট হয়েছে", product });
  } catch (error) {
    return NextResponse.json({ error: "পণ্য আপডেট করা যায়নি" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: "পণ্য পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ message: "পণ্য মুছে গেছে" });
  } catch (error) {
    return NextResponse.json({ error: "পণ্য মুছে ফেলা যায়নি" }, { status: 500 });
  }
}