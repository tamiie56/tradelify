import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "লগইন করুন" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const order = await Order.create({
      user: session.user.id,
      items: body.items,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      note: body.note,
      totalPrice: body.totalPrice,
    });

    return NextResponse.json(
      { message: "অর্ডার হয়েছে", order },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "অর্ডার দেওয়া যায়নি" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "লগইন করুন" },
        { status: 401 }
      );
    }

    await connectDB();

    let orders;

    if (session.user.role === "admin") {
      orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: session.user.id }).sort({
        createdAt: -1,
      });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "অর্ডার লোড করা যায়নি" },
      { status: 500 }
    );
  }
}