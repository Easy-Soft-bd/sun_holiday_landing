
export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string;
    content: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: "Top 10 Hidden Gems in Bangladesh You Must Visit",
        excerpt: "Discover the untouched beauty of Bangladesh beyond the popular tourist spots. From silent forests to ancient ruins, explore these hidden treasures.",
        date: "Jan 12, 2024",
        category: "Travel Tips",
        image: "https://images.unsplash.com/photo-1626018517488-5b64242cfa75?q=80&w=2070&auto=format&fit=crop",
        content: `
            <p>Bangladesh, a land of sprawling greenery and winding rivers, holds secrets that even the most seasoned travelers might overlook. Beyond the bustling streets of Dhaka and the sandy shores of Cox's Bazar lie hidden gems waiting to be discovered.</p>
            
            <h3>1. The Silent Stone Forest of Birishiri</h3>
            <p>Located in Netrokona, Birishiri is home to the stunning Shomeshwari River and the ceramic hills. The turquoise water against the white clay hills creates a landscape that feels like it's from another planet.</p>
            
            <h3>2. The Floating Guava Markets of Barisal</h3>
            <p>Experience a unique tradition in the backwaters of Barisal. Hundreds of boats filled with fresh guavas create a vibrant, floating market that is a photographer's dream.</p>
            
            <h3>3. Nijhum Dwip: The Island of Deer</h3>
            <p>A small island in the mouth of the Meghna river, known for its serene environment and the large population of spotted deer. It's the perfect escape for nature lovers.</p>
            
            <p>These destinations offer a glimpse into the diverse and rich cultural tapestry of Bangladesh. Whether you're seeking adventure or tranquility, these hidden gems promise an unforgettable journey.</p>
        `
    },
    {
        id: '2',
        title: "The Ultimate Umrah Guide: Preparation & Tips",
        excerpt: "Planning your first Umrah journey? Our comprehensive guide covers everything from documentation to spiritual preparation for a meaningful experience.",
        date: "Jan 08, 2024",
        category: "Hajj & Umrah",
        image: "https://images.unsplash.com/photo-1720549973451-018d3623b55a?q=80&w=2070&auto=format&fit=crop",
        content: `
            <p>Embarking on the journey of Umrah is a significant spiritual milestone for any Muslim. Proper preparation ensures that you can focus entirely on your worship and the spiritual significance of the pilgrimage.</p>
            
            <h3>Step 1: Essential Documentation</h3>
            <p>Ensure your passport is valid for at least 6 months. Apply for your Umrah visa well in advance and keep copies of all your travel documents, including vaccination certificates.</p>
            
            <h3>Step 2: Physical and Mental Preparation</h3>
            <p>Umrah involves a significant amount of walking. Start a walking routine a few weeks before your departure. Mentally, educate yourself on the rituals and their significance.</p>
            
            <h3>Step 3: What to Pack</h3>
            <p>Pack comfortable Ihram clothing, unscented toiletries, and a good pair of walking shoes. Don't forget your prayer mat and a small waist bag for essentials.</p>
            
            <p>May your journey be blessed and your Umrah accepted. We are here to assist you with every step of your travel arrangements.</p>
        `
    },
    {
        id: '3',
        title: "Exotic Maldives: Why It's the Perfect Honeymoon Destination",
        excerpt: "With its crystal clear waters and private overwater villas, find out why the Maldives remains the top choice for couples and honeymooners.",
        date: "Jan 05, 2024",
        category: "International",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2070&auto=format&fit=crop",
        content: `
            <p>If there's one place on Earth that defines paradise, it's the Maldives. This archipelago of islands in the Indian Ocean offers an unparalleled romantic experience for newly married couples.</p>
            
            <h3>Private Overwater Villas</h3>
            <p>Imagine waking up to the sound of gentle waves and stepping directly into the turquoise ocean from your private deck. Maldivian resorts are world-renowned for their luxury and privacy.</p>
            
            <h3>Underwater Dining Experiences</h3>
            <p>Dine among the vibrant marine life in one of the Maldives' spectacular underwater restaurants. It's a surreal and unforgettable experience that adds a touch of magic to your honeymoon.</p>
            
            <h3>Breathtaking Sunsets</h3>
            <p>There's nothing quite like a Maldivian sunset. Enjoy a private dinner on the beach or a sunset cruise to witness the sky turn into a canvas of pink, orange, and purple hues.</p>
            
            <p>The Maldives isn't just a destination; it's a dream come true for every couple seeking a romantic escape.</p>
        `
    },
    {
        id: '4',
        title: "How to Secure Your Visa: A Stress-Free Approach",
        excerpt: "Visa applications can be overwhelming. Learn our expert tips on how to organize your documents and increase your chances of a successful approval.",
        date: "Dec 28, 2023",
        category: "Visa Guide",
        image: "https://images.unsplash.com/photo-1619467416348-6a782839e95f?q=80&w=2070&auto=format&fit=crop",
        content: `
            <p>Navigating the visa application process can often feel like a daunting task. However, with the right approach and careful planning, you can significantly reduce stress and increase your success rate.</p>
            
            <h3>Understand the Requirements</h3>
            <p>Every country has its own set of requirements. Visit the official embassy website and create a detailed checklist of all necessary documents, from bank statements to invitation letters.</p>
            
            <h3>The Power of Organization</h3>
            <p>Keep your documents neatly organized in a folder. Ensure all copies are clear and all forms are filled out accurately and completely. Small errors can often lead to delays or denials.</p>
            
            <h3>Seek Professional Guidance</h3>
            <p>If you're unsure about any part of the process, don't hesitate to consult with visa experts. They can provide valuable insights and ensure your application is as strong as possible.</p>
            
            <p>At Sun Holidays Ltd, we specialize in making the visa process seamless for you. Contact us today for expert assistance.</p>
        `
    },
    {
        id: '5',
        title: "Luxury Resorts: Redefining Comfort in Bali",
        excerpt: "Experience the pinnacle of luxury as we review some of the most stunning resorts in Bali that offer breathtaking views and world-class service.",
        date: "Dec 20, 2023",
        category: "Resorts",
        image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=2070&auto=format&fit=crop",
        content: `
            <p>Bali, often called the Island of the Gods, is not just a destination for spiritual seekers and surfers. It's also a haven for luxury travelers looking for world-class resorts and unmatched hospitality.</p>
            
            <h3>The Jungle Retreats of Ubud</h3>
            <p>Experience tranquility like never before in Ubud's luxury jungle resorts. These properties offer breathtaking views of the lush green valleys and the sound of the flowing Ayung River.</p>
            
            <h3>Beachfront Splendor in Seminyak</h3>
            <p>For those who prefer the ocean, Seminyak offers some of the most stylish and sophisticated beachfront resorts. Enjoy world-class dining, infinity pools, and direct access to Bali's famous beaches.</p>
            
            <h3>Traditional Balinese Architecture</h3>
            <p>Many luxury resorts in Bali seamlessly blend modern comforts with traditional Balinese architecture, creating a unique and authentic atmosphere that reflects the island's rich heritage.</p>
            
            <p>Bali's luxury resorts are more than just places to stay; they are destinations in themselves that offer a truly rejuvenating experience.</p>
        `
    },
    {
        id: '6',
        title: "Budget Travel: Exploring Turkey Under $500",
        excerpt: "Think Turkey is expensive? Our detailed budget itinerary shows you how to enjoy the rich culture and history of Istanbul on a modest budget.",
        date: "Dec 15, 2023",
        category: "International",
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop",
        content: `
            <p>Turkey is a land where East meets West, offering a rich tapestry of history, culture, and stunning landscapes. And the best part? It can be surprisingly affordable if you know how to plan.</p>
            
            <h3>Affordable Accommodation in Istanbul</h3>
            <p>Skip the luxury hotels in Sultanahmet and look for boutique guesthouses in areas like Kadikoy or Besiktas. You'll get more value for your money and a more authentic experience.</p>
            
            <h3>Savoring Street Food</h3>
            <p>Turkish street food is not only delicious but also very light on the pocket. From Simit to Balik Ekmek, you can eat like a king for just a few liras.</p>
            
            <h3>Exploring Free and Low-Cost Attractions</h3>
            <p>Many of Istanbul's most famous sites, like the Blue Mosque, are free to enter. Take advantage of public ferries for a scenic Bosphorus cruise at a fraction of the cost of a private tour.</p>
            
            <p>Traveling on a budget doesn't mean you have to miss out on the magic of Turkey. With a little planning, you can have a world-class experience without breaking the bank.</p>
        `
    }
];
