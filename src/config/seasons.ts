export interface SeasonConfig {
  id: 'autumn' | 'christmas' | 'winter' | 'none';
  name: string;
  // Month is 1-indexed (11 = Nov, 12 = Dec)
  start: { month: number; day: number };
  end: { month: number; day: number };
  colors: {
    accent: string;      // Warm highlight color
    background: string;  // Subtle tinted card bg
    border: string;      // Border tone
    textDark: string;    // Text color for readability
  };
  utilityBar?: {
    icon: string;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  spotlight?: {
    tagline: string;
    heading: string;
    scripture: string;
    scriptureRef: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
}

export const SEASONS: SeasonConfig[] = [
  {
    id: 'autumn',
    name: 'Autumn & Thanksgiving',
    start: { month: 11, day: 1 },   // Nov 1
    end: { month: 11, day: 28 },    // Thanksgiving weekend
    colors: {
      accent: '#c47e1b',            // Rich harvest amber / gold
      background: '#fcf8f2',        // Warm parchment cream
      border: '#e8d9c5',            // Soft warm border
      textDark: '#4a2c06',          // Warm dark brown
    },
    utilityBar: {
      icon: '🌾',
      text: 'Thanksgiving Praise & Fellowship Service — Sunday, Nov 22 at 6:00 PM',
      linkText: 'Learn More →',
      linkUrl: '/bulletin/',
    },
    spotlight: {
      tagline: 'Harvest of Gratitude',
      heading: 'A Season of Thanksgiving',
      scripture: 'Enter his gates with thanksgiving, and his courts with praise!',
      scriptureRef: 'Psalm 100:4',
      description: 'Join us as we gather to reflect on God’s abundant blessings over our church, our community, and our harvest families.',
      buttonText: 'View Weekly Bulletin & Events',
      buttonUrl: '/bulletin/',
    },
  },
  {
    id: 'christmas',
    name: 'Advent & Christmas',
    start: { month: 11, day: 29 },  // 1st Sunday of Advent
    end: { month: 12, day: 26 },    // Through Boxing Day
    colors: {
      accent: '#9a2b37',            // Deep cranberry / burgundy
      background: '#f4f7f5',        // Winter pine mist
      border: '#c8d6ce',            // Pine frost border
      textDark: '#1c3628',          // Deep pine forest
    },
    utilityBar: {
      icon: '🎄',
      text: 'Celebrate Advent with us! Christmas Eve Candlelight Service — Dec 24 at 6:00 PM',
      linkText: 'Service Details →',
      linkUrl: '/bulletin/',
    },
    spotlight: {
      tagline: 'The Light of the World',
      heading: 'Hope Has Come',
      scripture: 'The light shines in the darkness, and the darkness has not overcome it.',
      scriptureRef: 'John 1:5',
      description: 'Celebrate the birth of our Savior Jesus Christ with candlelight carols, Sunday school pageantry, and community fellowship.',
      buttonText: 'Christmas Services & Times',
      buttonUrl: '/bulletin/',
    },
  },
];

/**
 * Checks whether a given month and day falls within a seasonal range.
 */
export function isDateInSeason(month: number, day: number, start: { month: number; day: number }, end: { month: number; day: number }): boolean {
  if (start.month === end.month) {
    return month === start.month && day >= start.day && day <= end.day;
  }
  // Range spans across months (e.g. late Nov to late Dec)
  return (
    (month === start.month && day >= start.day) ||
    (month === end.month && day <= end.day) ||
    (month > start.month && month < end.month)
  );
}

/**
 * Returns the currently active season based on a date.
 * Defaults to current date.
 */
export function getActiveSeason(date = new Date()): SeasonConfig | null {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  return (
    SEASONS.find((season) => isDateInSeason(month, day, season.start, season.end)) || null
  );
}

