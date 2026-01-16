
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockTours } from '@/src/view/tours/data/mockTours';
import TourDetailsView from '@/src/view/tours/TourDetailsView';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return mockTours.map((tour) => ({
    id: tour.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tour = mockTours.find((t) => t.id === id);
  
  if (!tour) {
    return {
      title: 'Tour Not Found - Sun Holidays Ltd',
    };
  }

  return {
    title: `${tour.title} - Sun Holidays Ltd`,
    description: tour.description,
  };
}

export default async function TourDetailsPage({ params }: Props) {
  const { id } = await params;
  console.log('TourDetailsPage id:', id);
  const tour = mockTours.find((t) => t.id === id);
  console.log('Found tour:', tour);

  if (!tour) {
    console.log('Tour not found, triggering notFound()');
    notFound();
  }

  return <TourDetailsView tour={tour} />;
}
