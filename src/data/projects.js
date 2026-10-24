/**
 * Sample project data
 * ---------------------------------------------------------------
 * seedProjects : demo projects copied into localStorage the first time
 *                the app runs (see getProjects in utils/storage.js).
 *                After that they behave like normal user projects, so
 *                they can be edited, archived and deleted.
 * sampleProjects : kept empty on purpose (older files still import it).
 * statuses : all possible project statuses.
 *
 * Fields used by the pages:
 *  - Graveyard cards : name, years, status, progress, summary, tags
 *  - Bury / Edit form : vision, completed, unfinished, salvage, reason,
 *                       reasonNote, epitaph, createdAt, buriedAt
 *  - ProjectDetail    : story, reasons, features, techStack, startDate,
 *                       lastActive, visibility, completion
 */
export const seedProjects = [
  {
    id: 'prepsport',
    name: 'Prepsport',
    icon: '🌱',
    years: '2025 – 2026',
    status: 'Buried',
    progress: 65,
    tags: ['Education', 'Productivity', 'Student Tools', 'Web'],
    summary:
      'A platform that organizes previous-year question papers by branch and semester.',
    vision:
      'A platform that organizes previous-year question papers by branch and semester. The goal was to make exam preparation simpler and more structured.',
    completed: ['Landing page', 'Paper listing UI'],
    unfinished: ['Backend', 'User accounts', 'Bookmarks'],
    reason: 'Lost time',
    reasonNote: 'Other commitments took over.',
    salvage: ['Paper listing UI'], // parts worth reusing ("organ donors")
    createdAt: '2025-01-10',
    buriedAt: '2025-06-15',

    // ProjectDetail page fields
    epitaph: 'A better way to prepare, waiting for its next chapter.',
    completion: 65,
    startDate: 'Jan 2025',
    lastActive: 'Jun 2025',
    visibility: 'Private',
    story:
      'Every exam season, students scramble across WhatsApp groups and random drives to find previous-year papers. Prepsport was meant to fix that: one clean place where papers are sorted by branch, semester, subject and year. The landing page and paper listing UI were built, but the backend for uploads and accounts kept growing, and exams and other commitments slowly took over.',
    reasons: [
      { title: 'Lost time', text: 'Other commitments took over.' },
      { title: 'Tech challenges', text: 'Backend became more complex.' },
      { title: 'Lack of team', text: 'Needed consistent collaboration.' },
    ],
    features: [
      'Search question papers by branch and semester',
      'Organize by subject and year',
      'Download PDFs',
      'User accounts and bookmarks',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
  },
  {
    id: 'moviecircle',
    name: 'MovieCircle',
    icon: '👻',
    years: '2025',
    status: 'Buried',
    progress: 40,
    tags: ['Entertainment', 'Social'],
    summary: 'A community for cinephiles.',
    vision: 'Friends share watchlists and rate movies together.',
    completed: ['Home feed UI', 'Movie cards'],
    unfinished: ['Backend', 'Friend system', 'Ratings'],
    reason: 'Scope grew too big',
    reasonNote: 'Too many features for a small team.',
    salvage: ['Movie card UI'],
    createdAt: '2025-05-02',
    buriedAt: '2025-09-20',

    // ProjectDetail page fields
    epitaph: 'The credits rolled before the story ended.',
    completion: 40,
    startDate: 'May 2025',
    lastActive: 'Sep 2025',
    visibility: 'Private',
    story:
      'MovieCircle was imagined as a small social space for movie lovers. Friends could build shared watchlists, rate films, and see what their circle was watching. The home feed and movie cards were designed, but the idea kept expanding with chats, recommendations and reviews, and the small team could not keep up with the growing scope.',
    reasons: [
      { title: 'Scope grew too big', text: 'Too many features for a small team.' },
      { title: 'Tech challenges', text: 'Friend system and ratings needed a complex backend.' },
      { title: 'Lack of team', text: 'Teammates got busy with other work.' },
    ],
    features: [
      'Shared watchlists with friends',
      'Rate and review movies',
      'Friend system and activity feed',
      'Movie search with posters and details',
    ],
    techStack: ['React', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
  },
  {
    id: 'greencart',
    name: 'GreenCart',
    icon: '🛒',
    years: '2024 - 2025',
    status: 'Buried',
    progress: 25,
    tags: ['Sustainability', 'Marketplace'],
    summary: 'A marketplace for sustainable products.',
    vision: 'Buy and sell eco-friendly products in one trusted place.',
    completed: ['Landing page', 'Product grid'],
    unfinished: ['Cart', 'Payments', 'Seller dashboard'],
    reason: 'Time ran out',
    reasonNote: 'College work took over.',
    salvage: ['Product grid', 'Landing page'],
    createdAt: '2024-10-05',
    buriedAt: '2025-01-18',

    // ProjectDetail page fields
    epitaph: 'Grew an idea, never reached the harvest.',
    completion: 25,
    startDate: 'Oct 2024',
    lastActive: 'Jan 2025',
    visibility: 'Private',
    story:
      'GreenCart aimed to be a trusted marketplace where people could buy and sell eco-friendly products, from reusable bottles to organic goods. Sellers would list verified sustainable items and buyers could shop with confidence. The landing page and product grid were ready, but the cart, payments and seller dashboard never started because college work took over.',
    reasons: [
      { title: 'Time ran out', text: 'College work took over.' },
      { title: 'Tech challenges', text: 'Payments and seller flow were complex.' },
      { title: 'Lack of team', text: 'Nobody to share the backend work.' },
    ],
    features: [
      'Browse eco-friendly product listings',
      'Seller dashboard to add and manage products',
      'Cart and secure checkout',
      'Verified sustainable badge for sellers',
    ],
    techStack: ['React', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
  },
]

// Samples now live in localStorage (seeded once), so this stays empty
export const sampleProjects = []

// All possible project statuses
export const statuses = ['Buried', 'Haunting', 'Resurrected', 'Repurposed', 'Archived']