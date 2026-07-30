import { NextResponse } from "next/server";
import { getCachedHomeFeaturedTours } from "@/src/lib/data/tours";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tours = await getCachedHomeFeaturedTours();
    return NextResponse.json(tours, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Failed to load featured tours:", error);
    return NextResponse.json([], { status: 200 });
  }
}
