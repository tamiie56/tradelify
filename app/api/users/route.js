import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    await connectDB();

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "ব্যবহারকারী লোড করা যায়নি" },
      { status: 500 }
    );
  }
}