import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import HomePage from '@/src/models/HomePage';
import { isAdmin } from '@/src/lib/auth';
import { TAG_HOME_PAGE } from '@/src/lib/revalidate-tags';

export async function POST(request: Request) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
    }

    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = await HomePage.create({});
    }

    // Update the specific section
    // We use set() explicitly to trigger the setter if needed, though direct assignment works too with proper model definition
    homePage.set(section, data);
    
    await homePage.save();
    revalidateTag(TAG_HOME_PAGE, 'max');
    revalidatePath('/');

    return NextResponse.json({ success: true, data: homePage });
  } catch (error) {
    console.error('Error updating home page:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
