import { NextRequest, NextResponse } from "next/server";
import { getReminderOverview } from "@/api/reminders";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const branchId = searchParams.get("branchId");

  if (!branchId) {
    return NextResponse.json(
      { message: "branchId is required" },
      { status: 400 },
    );
  }

  try {
    const overviewData = await getReminderOverview(branchId);
    return NextResponse.json(overviewData);
  } catch (error) {
    console.error("Failed to fetch reminder overview:", error);
    return NextResponse.json(
      { message: "Failed to fetch reminder overview" },
      { status: 500 },
    );
  }
}
