
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TourDetailsView from '@/src/view/tours/TourDetailsView';
import { getCachedTourById } from '@/src/lib/data/tours';
import { buildPageMetadata } from '@/src/lib/site';

type Props = {
  params: Promise<{ id: string }>;
};

// Remove generateStaticParams to enable SSR for dynamic IDs
// export async function generateStaticParams() { ... }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const tour = await getCachedTourById(id);

    if (!tour) {
      return buildPageMetadata({
        title: 'Tour Not Found - Sun Holidays Ltd',
        description: 'The requested tour package could not be found.',
        path: `/tours/${id}`,
      });
    }

    return buildPageMetadata({
      title: `${tour.title} - Sun Holidays Ltd`,
      description: tour.description.substring(0, 160),
      path: `/tours/${id}`,
      image: tour.image,
      keywords: [tour.title, tour.location, tour.category, 'Sun Holidays Ltd'],
    });
  } catch (error) {
    console.error('Error fetching tour metadata:', error);
    return buildPageMetadata({
      title: 'Error - Sun Holidays Ltd',
      description: 'There was a problem loading this tour package.',
      path: `/tours/${id}`,
    });
  }
}

export default async function TourDetailsPage({ params }: Props) {
  const { id } = await params;
  let tour;
  
  try {
    tour = await getCachedTourById(id);
  } catch (error) {
    console.error('Error fetching tour details:', error);
    throw error; 
  }

  if (!tour) {
    notFound();
  }

  return <TourDetailsView tour={{ ...tour, id: String(tour.id) }} />;
}
