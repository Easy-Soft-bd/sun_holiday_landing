import Tour from '../src/models/Tour';
import sequelize from '../src/lib/db';

async function verifyTourModel() {
  try {
    console.log('Authenticating database connection...');
    await sequelize.authenticate();
    console.log('Database connection successful.');

    console.log('Syncing Tour model...');
    await Tour.sync({ alter: true });
    console.log('Tour model synced successfully.');

    console.log('Creating a test tour...');
    const testTour = await Tour.create({
      title: 'Test Tour',
      location: 'Test Location',
      price: 1000,
      duration: '2 Days',
      category: 'Domestic',
      status: 'Draft',
      image: 'https://example.com/image.jpg',
      description: 'This is a test tour.',
      highlights: ['Highlight 1', 'Highlight 2'],
      itinerary: [{ day: 1, title: 'Day 1', description: 'Description 1' }],
      includes: ['Include 1'],
      excludes: ['Exclude 1'],
      gallery: ['https://example.com/gallery1.jpg'],
      videoUrl: 'https://example.com/video',
      rating: 5,
      reviews: 10
    });
    console.log('Test tour created:', testTour.toJSON());

    console.log('Deleting test tour...');
    await testTour.destroy();
    console.log('Test tour deleted.');

    console.log('Verification successful!');
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await sequelize.close();
  }
}

verifyTourModel();
