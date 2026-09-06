export type LeaderboardUser = {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  percentile: string;
  isCurrentUser?: boolean;
};

export type ActivityComment = {
  id: string;
  name: string;
  avatar: string;
  time: string;
  comment: string;
};

export type BlogPostStats = {
  pages_read: number;
  total_pages: number;
  avg_time: string;
  level: number;
  reacts_to_level: number;
  streak_days: number;
  badges: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  category: "Movies" | "Anime" | "Series" | "Cinematography";
  tags: string[];
  coverImage: string;
  readTime: string;
  views: string;
  
  /* §3 & §8 Stored Swatches */
  theme_accent: string;
  theme_accent_light: string;
  theme_bg_from: string;

  /* §5 Quick View Stats & Leaderboard */
  stats: BlogPostStats;
  leaderboard: {
    friends: LeaderboardUser[];
    bookclub: LeaderboardUser[];
    global: LeaderboardUser[];
  };
  activity: ActivityComment[];

  /* §6 Full Article Content */
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "secrets-of-cinematography-in-modern-fantasy",
    title: "Secrets of Cinematic Lighting in Modern Dark Fantasy",
    description:
      "A masterclass in volumetric mist, amber key lighting, and practical candle arrays that defined Hogwarts and beyond.",
    datePublished: "2026-08-24",
    dateModified: "2026-08-25",
    author: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: "Lead Director of Photography"
    },
    category: "Cinematography",
    tags: ["lighting", "dark-fantasy", "volumetric", "optics"],
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    readTime: "7 min read",
    views: "24.8k",
    theme_accent: "#F5A623",
    theme_accent_light: "#FFD98A",
    theme_bg_from: "#2A1B08",
    stats: {
      pages_read: 354,
      total_pages: 420,
      avg_time: "1:45",
      level: 8,
      reacts_to_level: 24,
      streak_days: 14,
      badges: ["Wand Master", "Lorekeeper", "Speed Reader", "Cinephile", "Night Owl", "Trendsetter"]
    },
    leaderboard: {
      friends: [
        { rank: 1, name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", points: 2840, percentile: "Top 1%" },
        { rank: 2, name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", points: 2610, percentile: "Top 3%", isCurrentUser: true },
        { rank: 3, name: "David Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", points: 2490, percentile: "Top 5%" },
        { rank: 4, name: "Sarah Jenkins", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80", points: 2180, percentile: "Top 12%" }
      ],
      bookclub: [
        { rank: 1, name: "Hogwarts Archival Guild", avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80", points: 14200, percentile: "Top 1%" },
        { rank: 2, name: "Anamorphic Society", avatar: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&auto=format&fit=crop&q=80", points: 12850, percentile: "Top 2%" },
        { rank: 3, name: "Neon Cinephiles", avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&auto=format&fit=crop&q=80", points: 11400, percentile: "Top 5%" }
      ],
      global: [
        { rank: 1, name: "Aria Sterling", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", points: 34200, percentile: "Top 0.1%" },
        { rank: 2, name: "Kenji Sato", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", points: 31900, percentile: "Top 0.5%" },
        { rank: 3, name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", points: 29400, percentile: "Top 1%" }
      ]
    },
    activity: [
      {
        id: "c1",
        name: "Clara Oswald",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        time: "12m ago",
        comment: "The breakdown of candle lumen output and practical diffusion in Chapter 3 completely changed how we lit our indie short film yesterday!"
      },
      {
        id: "c2",
        name: "Liam O'Connor",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
        time: "45m ago",
        comment: "Agreed on Cooke lenses having that subtle warmth. Nothing beats that organic rolloff on parchment and stone castle walls."
      },
      {
        id: "c3",
        name: "Maya Lin",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80",
        time: "2h ago",
        comment: "Bookmarked for our studio crew prep session next Monday. Essential reading for every DP."
      }
    ],
    content: `Great dark fantasy cinematography is never just about turning off lights—it is about sculpting the darkness. When you look at iconic scenes in magical halls, every beam of light has weight, texture, and a narrative origin.

In this deep dive, we break down how volumetric haze, amber tungsten sources, and low-contrast optical coatings work in unison to build cinematic depth without muddying your dynamic range.

"Lighting a dark fantasy world is an act of restraint. You must allow shadows to swallow what isn't essential so that the flame in the center commands the eye."

First, let's explore practical candle arrays. Using real flicker circuits tied to dimmed tungsten bulbs inside lanterns gives you the micro-pulsing behavior that CGI passes simply cannot replicate on skin tones. Pairing this with a 1/4 Black Pro-Mist filter blossoms highlights gently into the surrounding shadows.

When staging shots with multiple depth layers, always maintain separation between the character's silhouette and the background architecture. A sharp edge light placed three stops above key creates the distinct separation that prevents the subject from melting into dark castle stonework.

Finally, managing smoke and atmosphere requires consistent air circulation. High-output glycol hazers run through a chiller produce a uniform low-lying suspension that catches directional light rays without creating distracting fog bursts.`
  },
  {
    slug: "cyberpunk-visual-languages-neon-shadows",
    title: "Cyberpunk Aesthetics: Neon, Dystopia & Visual Rhythms",
    description:
      "How high-contrast chromatic aberration, anamorphic flares, and rain-slicked pavement engineer futuristic immersion.",
    datePublished: "2026-08-20",
    dateModified: "2026-08-21",
    author: {
      name: "Taro Tanaka",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      role: "Visual Stylist & Colorist"
    },
    category: "Anime",
    tags: ["cyberpunk", "neon", "anime", "grading"],
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    readTime: "9 min read",
    views: "31.2k",
    theme_accent: "#E23FE0",
    theme_accent_light: "#FFA8FE",
    theme_bg_from: "#260624",
    stats: {
      pages_read: 280,
      total_pages: 350,
      avg_time: "2:10",
      level: 9,
      reacts_to_level: 18,
      streak_days: 21,
      badges: ["Neon Runner", "Cyber Sage", "Master Colorist", "Speed Reader"]
    },
    leaderboard: {
      friends: [
        { rank: 1, name: "Taro Tanaka", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", points: 3100, percentile: "Top 1%", isCurrentUser: true },
        { rank: 2, name: "Ren Takahashi", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", points: 2890, percentile: "Top 3%" }
      ],
      bookclub: [
        { rank: 1, name: "Neo-Tokyo Cinematics", avatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80", points: 15400, percentile: "Top 1%" }
      ],
      global: [
        { rank: 1, name: "Aria Sterling", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", points: 34200, percentile: "Top 0.1%" }
      ]
    },
    activity: [
      {
        id: "c4",
        name: "Devon Reed",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        time: "30m ago",
        comment: "The magenta/cyan split tone palette is iconic for a reason. Great breakdown of LUT balancing!"
      }
    ],
    content: `Cyberpunk is defined by the tension between high technology and low life. Visually, this is expressed through harsh neon saturation battling impenetrable urban shadows.

Color palettes in cyberpunk cinema rely heavily on dual-complementary lighting. A piercing cyan backlight paired with saturated magenta fill gives characters an electric, alienated edge.

"When city neon reflects off wet asphalt, every street corner becomes a natural diffusion filter."

In animation and live-action grading alike, preserving skin tones while bathing the environment in vibrant saturated LEDs is the primary challenge. Subtractive color wheels and selective hue qualifiers ensure talent doesn't turn into a glowing monochrome statue.`
  },
  {
    slug: "epic-scale-worldbuilding-pre-production-guide",
    title: "Epic Scale Worldbuilding: From Blueprint to Soundstage",
    description:
      "Deconstructing architectural scale, matte painting extensions, and practical set continuity for blockbuster series.",
    datePublished: "2026-08-15",
    dateModified: "2026-08-16",
    author: {
      name: "Victoria Sterling",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: "Production Designer"
    },
    category: "Series",
    tags: ["series", "worldbuilding", "production-design", "stages"],
    coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
    readTime: "11 min read",
    views: "18.4k",
    theme_accent: "#3B9BF5",
    theme_accent_light: "#84C3FF",
    theme_bg_from: "#081C2E",
    stats: {
      pages_read: 190,
      total_pages: 250,
      avg_time: "1:30",
      level: 6,
      reacts_to_level: 12,
      streak_days: 7,
      badges: ["Architect", "Set Veteran", "Scholar"]
    },
    leaderboard: {
      friends: [
        { rank: 1, name: "Victoria Sterling", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", points: 2150, percentile: "Top 8%", isCurrentUser: true }
      ],
      bookclub: [
        { rank: 1, name: "Guild of Production Designers", avatar: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&auto=format&fit=crop&q=80", points: 9800, percentile: "Top 3%" }
      ],
      global: [
        { rank: 1, name: "Kenji Sato", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", points: 31900, percentile: "Top 0.5%" }
      ]
    },
    activity: [
      {
        id: "c5",
        name: "Samuel Brody",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        time: "1h ago",
        comment: "Fascinating analysis of virtual volume LED walls vs traditional blue screens!"
      }
    ],
    content: `Building vast fictional civilizations requires establishing visual continuity that starts in sketches and carries all the way through practical stage construction.

When planning sets that will be extended digitally, the physical build must provide the tactile interaction points—door handles, railings, stairs—while leaving clean tracking sightlines for visual effects teams.

"A world feels authentic when wear and tear reflect centuries of history, not just a coat of faux-aging spray."

Lighting integration between the physical stage floor and virtual LED volume backgrounds is the linchpin of modern episodic worldbuilding.`
  },
  {
    slug: "anamorphic-optics-mastery-aspect-ratios",
    title: "Anamorphic Optics Mastery: Flares, Oval Bokeh & Field Curvature",
    description:
      "Why vintage glass and 2.39:1 widescreen framing remain the ultimate cinematic storyteller's choice.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-09",
    author: {
      name: "Julian Cross",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
      role: "Optics Engineer & Filmmaker"
    },
    category: "Movies",
    tags: ["anamorphic", "optics", "lenses", "cinematography"],
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    readTime: "8 min read",
    views: "42.1k",
    theme_accent: "#2BD9C4",
    theme_accent_light: "#82F2E4",
    theme_bg_from: "#052622",
    stats: {
      pages_read: 410,
      total_pages: 450,
      avg_time: "2:05",
      level: 11,
      reacts_to_level: 30,
      streak_days: 35,
      badges: ["Optics Guru", "Bokeh Master", "Anamorphic Elite", "Lorekeeper"]
    },
    leaderboard: {
      friends: [
        { rank: 1, name: "Julian Cross", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80", points: 3450, percentile: "Top 1%", isCurrentUser: true }
      ],
      bookclub: [
        { rank: 1, name: "Anamorphic Society", avatar: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&auto=format&fit=crop&q=80", points: 12850, percentile: "Top 2%" }
      ],
      global: [
        { rank: 1, name: "Julian Cross", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80", points: 34500, percentile: "Top 0.1%" }
      ]
    },
    activity: [
      {
        id: "c6",
        name: "Evelyn Reed",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80",
        time: "5h ago",
        comment: "Those horizontal blue streak flares are hypnotic. Excellent optics comparison."
      }
    ],
    content: `Anamorphic lenses squeeze a wider field of view onto a traditional sensor, resulting in unique characteristics that immediately evoke classic Hollywood cinema.

From signature oval bokeh in out-of-focus highlights to organic horizontal streak flares and barrel distortion near the edges, anamorphic optics add a distinct human imperfection to pristine digital sensors.

"The imperfect lens often tells the most authentic human story."

When pairing modern sensors with vintage front-anamorphic lenses, careful attention must be paid to sensor resolution and squeeze ratios to avoid jagged artifacts in post-de-squeeze workflows.`
  }
];

export function getPostBySlug(slug: string): BlogPost | null {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return blogPosts.slice(0, limit);

  const scored = blogPosts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const score = p.tags.reduce((acc, t) => acc + (current.tags.includes(t) ? 1 : 0), 0) +
        (p.category === current.category ? 2 : 0);
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score || b.post.datePublished.localeCompare(a.post.datePublished));

  return scored.map((s) => s.post).slice(0, limit);
}
