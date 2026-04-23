import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import SunviaEcoResortPage from "@/src/models/SunviaEcoResortPage";
import { isAdmin } from "@/src/lib/auth";
import { TAG_SUNVIA_ECO_RESORT } from "@/src/lib/revalidate-tags";
import {
  isResortSectionKey,
  validateSunviaEcoResortSection,
} from "@/src/lib/data/sunvia-eco-resort";

export async function POST(request: Request) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body ?? {};

    if (!isResortSectionKey(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const validation = validateSunviaEcoResortSection(section, data);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    let page = await SunviaEcoResortPage.findOne();
    if (!page) {
      page = await SunviaEcoResortPage.create({});
    }

    page.set(section, validation.data);
    await page.save();

    revalidateTag(TAG_SUNVIA_ECO_RESORT, "max");
    revalidatePath("/sunvia-eco-resort");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating Sunvia Eco Resort page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
