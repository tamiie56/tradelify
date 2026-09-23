import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: "ক্যাটাগরি লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const existingCategory = await Category.findOne({ name: body.name });
    if (existingCategory) {
      return NextResponse.json(
        { error: "এই নামে ক্যাটাগরি আগেই আছে" },
        { status: 400 }
      );
    }

    const slug = body.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const category = await Category.create({
      name: body.name,
      slug,
      image: body.image || "",
      description: body.description || "",
    });

    return NextResponse.json(
      { message: "ক্যাটাগরি যোগ হয়েছে", category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "ক্যাটাগরি যোগ করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "ক্যাটাগরি মুছে গেছে" });
  } catch (error) {
    return NextResponse.json(
      { error: "ক্যাটাগরি মুছে ফেলা যায়নি" },
      { status: 500 }
    );
  }
}