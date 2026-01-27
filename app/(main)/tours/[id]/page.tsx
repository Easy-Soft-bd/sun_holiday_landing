
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TourDetailsView from '@/src/view/tours/TourDetailsView';
import Tour from '@/src/models/Tour';
import sequelize from '@/src/lib/db';

type Props = {
  params: Promise<{ id: string }>;
};

// Remove generateStaticParams to enable SSR for dynamic IDs
// export async function generateStaticParams() { ... }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    await sequelize.authenticate();
    const tour = await Tour.findByPk(id);

    if (!tour) {
      return {
        title: 'Tour Not Found - Sun Holidays Ltd',
      };
    }

    return {
      title: `${tour.title} - Sun Holidays Ltd`,
      description: tour.description.substring(0, 160), // Truncate description for meta tag
      openGraph: {
          images: [tour.image],
      }
    };
  } catch (error) {
    console.error('Error fetching tour metadata:', error);
    return {
      title: 'Error - Sun Holidays Ltd',
    };
  }
}

export default async function TourDetailsPage({ params }: Props) {
  const { id } = await params;
  
  try {
    await sequelize.authenticate();
    const tour = await Tour.findByPk(id);

    if (!tour) {
      notFound();
    }
    
    // Serialize to plain object to pass to client component if needed, 
    // though Server Components can pass serializable data directly.
    // Sequelize instances are not directly serializable due to methods.
    const tourData = tour.toJSON();

    return <TourDetailsView tour={tourData} />;
  } catch (error) {
    console.error('Error fetching tour details:', error);
    // You might want to show an error page or notFound
    throw error; 
  }
}
