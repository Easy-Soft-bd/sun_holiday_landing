export type MediaSamplePost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "News" | "Event" | "Blog" | "CSR";
  image: string;
  content: string;
  publishedAt: string;
  eventDate?: string;
  eventLocation?: string;
};

export const MEDIA_SAMPLE_POSTS: MediaSamplePost[] = [
  {
    slug: "dhaka-service-desk-now-open",
    title: "Dhaka service desk now open on weekends",
    excerpt: "Sun Tourism Ltd now welcomes walk-in visa and ticket questions every Friday and Saturday at the Dhaka office.",
    category: "News",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "2026-09-12",
    content: `
      <p>Travelers can now visit the Dhaka office on Friday and Saturday for visa questions, ticket changes, and tour bookings.</p>
      <h2>What to bring</h2>
      <p>Bring a passport copy and any existing booking reference so the desk can help on the first visit.</p>
    `,
  },
  {
    slug: "monsoon-travel-advisory",
    title: "Monsoon travel advisory for domestic tours",
    excerpt: "A short note on weather delays, ferry schedules, and how Sun Tourism Ltd updates guests before departure.",
    category: "News",
    image: "https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "2026-08-02",
    content: `
      <p>Heavy rain can shift ferry and road timings on a few domestic routes. Guests receive a message the day before departure when a plan changes.</p>
      <h2>How updates are sent</h2>
      <p>The office calls the number on the booking and sends the same note by email.</p>
    `,
  },
  {
    slug: "coxs-bazar-travel-fair-2026",
    title: "Cox's Bazar travel fair",
    excerpt: "Meet the Sun Tourism Ltd team, compare winter packages, and book a resort stay at the Cox's Bazar travel fair.",
    category: "Event",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "2026-10-01",
    eventDate: "2026-11-14",
    eventLocation: "Hotel Sea Crown, Cox's Bazar",
    content: `
      <p>The fair brings resort partners and the Sun Tourism Ltd booking desk into one hall for a single afternoon.</p>
      <h2>At the booth</h2>
      <p>Guests can review winter dates, ask about family rooms, and leave a booking request with the team.</p>
    `,
  },
  {
    slug: "dhaka-winter-package-evening",
    title: "Winter package evening in Dhaka",
    excerpt: "An evening briefing on winter tours, group departures, and visa timelines for the coming season.",
    category: "Event",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "2026-10-08",
    eventDate: "2026-12-05",
    eventLocation: "Sun Tourism Ltd office, Gulshan, Dhaka",
    content: `
      <p>The evening is for guests planning a winter trip. Seats are limited to the office meeting room.</p>
      <h2>Topics</h2>
      <p>Group departure dates, resort availability, and how long a typical visa file takes in winter.</p>
    `,
  },
  {
    slug: "a-quiet-weekend-in-sylhet",
    title: "A quiet weekend in Sylhet",
    excerpt: "Tea gardens, a short walk, and a simple two-day plan for a first visit to Sylhet.",
    category: "Blog",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "2026-07-18",
    content: `
      <p>Sylhet rewards a slow weekend. One day in the tea gardens and one morning by the river is enough for a first visit.</p>
      <h2>Day one</h2>
      <p>Start late, walk a single garden trail, and keep the afternoon free for rain.</p>
    `,
  },
  {
    slug: "what-to-pack-for-a-beach-resort",
    title: "What to pack for a beach resort",
    excerpt: "A short packing list for a three-night stay at a Bangladesh beach resort.",
    category: "Blog",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "2026-06-04",
    content: `
      <p>Resort stays are easier with a small bag. Reef-safe sunscreen, a light shawl for the evening, and one pair of sandals cover most of the weekend.</p>
      <h2>Leave at home</h2>
      <p>Heavy jackets and extra shoes rarely leave the room.</p>
    `,
  },
  {
    slug: "school-kits-for-barisal",
    title: "School kits for students in Barisal",
    excerpt: "Sun Tourism Ltd staff packed notebooks and pencils for a primary school visit in Barisal.",
    category: "CSR",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "2026-05-20",
    content: `
      <p>The office team spent a morning packing school kits before a visit arranged with a local school in Barisal.</p>
      <h2>What was included</h2>
      <p>Each kit held notebooks, pencils, and a simple pencil case.</p>
    `,
  },
  {
    slug: "beach-cleanup-with-local-guides",
    title: "Beach cleanup with local guides",
    excerpt: "Guides and Sun Tourism Ltd staff spent a morning clearing a stretch of beach before the tourist season.",
    category: "CSR",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "2026-04-11",
    content: `
      <p>Before the busy season, local guides and the resort team walked one stretch of beach and collected plastic left from the last holiday weekend.</p>
      <h2>Why it is part of the season plan</h2>
      <p>The cleanup is scheduled every year so the shore is ready for guests and for the people who work there.</p>
    `,
  },
];
