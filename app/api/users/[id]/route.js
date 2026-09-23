import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

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

    const user = await User.findByIdAndUpdate(
      params.id,
      { role: body.role },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "ব্যবহারকারী পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "রোল আপডেট হয়েছে", user });
  } catch (error) {
    return NextResponse.json(
      { error: "আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    await connectDB();

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "ব্যবহারকারী মুছে গেছে" });
  } catch (error) {
    return NextResponse.json(
      { error: "মুছে ফেলা যায়নি" },
      { status: 500 }
    );
  }
}