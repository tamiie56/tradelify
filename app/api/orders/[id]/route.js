import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "লগইন করুন" },
        { status: 401 }
      );
    }

    await connectDB();

    const order = await Order.findById(params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return NextResponse.json(
        { error: "অর্ডার পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: "অর্ডার লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    const order = await Order.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!order) {
      return NextResponse.json(
        { error: "অর্ডার পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "অর্ডার আপডেট হয়েছে", order });
  } catch (error) {
    return NextResponse.json(
      { error: "অর্ডার আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}