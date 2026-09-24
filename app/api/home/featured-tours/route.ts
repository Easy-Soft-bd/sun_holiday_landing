import { NextResponse } from "next/server";
import { getCachedHomeFeaturedTours } from "@/src/lib/data/tours";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tours = await getCachedHomeFeaturedTours();
    return NextResponse.json(tours, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to load featured tours:", error);
    return NextResponse.json([], { status: 200 });
  }
}
