import { StuffCategory } from '../types';

/**
 * Normalizes a URL by:
 * - Converting scheme & domain to lowercase
 * - Stripping www.
 * - Standardizing YouTube / youtu.be links
 * - Removing tracking parameters (utm_*, ref, fbclid, etc.)
 * - Trimming trailing slashes
 */
export function normalizeResourceUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    const parsed = new URL(url);
    let host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    // YouTube specific normalization
    if (host === 'youtu.be') {
      const vid = parsed.pathname.replace(/^\/+/, '');
      return `youtube.com/watch?v=${vid}`;
    }
    if (host.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      const list = parsed.searchParams.get('list');
      if (v && list) {
        return `youtube.com/watch?v=${v}&list=${list}`;
      } else if (v) {
        return `youtube.com/watch?v=${v}`;
      } else if (list) {
        return `youtube.com/playlist?list=${list}`;
      }
    }

    // Strip common tracking and referral parameters
    const stripParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'fbclid', 'gclid', 'msclkid', 'source', 'trk', 'si', 'feature'
    ];
    stripParams.forEach(param => parsed.searchParams.delete(param));

    // Normalize path & query
    const pathname = parsed.pathname.replace(/\/+$/, '') || '';
    const search = parsed.search;

    return `${host}${pathname}${search}`;
  } catch {
    return rawUrl.trim().toLowerCase().replace(/\/+$/, '');
  }
}

/**
 * Detects the platform name and default category from a URL
 */
export function detectPlatformAndType(url: string): { platform: string; resourceType: StuffCategory } {
  const lower = (url || '').toLowerCase();

  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return { platform: 'YouTube', resourceType: 'Videos' };
  }
  if (lower.includes('geeksforgeeks.org')) {
    return { platform: 'GeeksforGeeks', resourceType: 'Web Resources' };
  }
  if (lower.includes('leetcode.com')) {
    return { platform: 'LeetCode', resourceType: 'Practice' };
  }
  if (lower.includes('hackerrank.com')) {
    return { platform: 'HackerRank', resourceType: 'Practice' };
  }
  if (lower.includes('codechef.com')) {
    return { platform: 'CodeChef', resourceType: 'Practice' };
  }
  if (lower.includes('w3schools.com')) {
    return { platform: 'W3Schools', resourceType: 'Web Resources' };
  }
  if (lower.includes('developer.mozilla.org') || lower.includes('mdn')) {
    return { platform: 'MDN Web Docs', resourceType: 'Documentation' };
  }
  if (lower.includes('docs.oracle.com')) {
    return { platform: 'Oracle Java Docs', resourceType: 'Documentation' };
  }
  if (lower.includes('docs.python.org')) {
    return { platform: 'Python Official Docs', resourceType: 'Documentation' };
  }
  if (lower.includes('react.dev') || lower.includes('reactjs.org')) {
    return { platform: 'React Docs', resourceType: 'Documentation' };
  }
  if (lower.includes('coursera.org')) {
    return { platform: 'Coursera', resourceType: 'Courses' };
  }
  if (lower.includes('edx.org')) {
    return { platform: 'edX', resourceType: 'Courses' };
  }
  if (lower.includes('nptel.ac.in')) {
    return { platform: 'NPTEL', resourceType: 'Courses' };
  }
  if (lower.includes('freecodecamp.org')) {
    return { platform: 'freeCodeCamp', resourceType: 'Practice' };
  }
  if (lower.includes('khanacademy.org')) {
    return { platform: 'Khan Academy', resourceType: 'Courses' };
  }
  if (lower.includes('github.com')) {
    return { platform: 'GitHub', resourceType: 'Web Resources' };
  }
  if (lower.includes('stackoverflow.com')) {
    return { platform: 'Stack Overflow', resourceType: 'Web Resources' };
  }
  if (lower.includes('javatpoint.com')) {
    return { platform: 'JavaTpoint', resourceType: 'Web Resources' };
  }

  // Domain extraction fallback
  try {
    const full = /^https?:\/\//i.test(url) ? url : 'https://' + url;
    const host = new URL(full).hostname.replace(/^www\./, '');
    const name = host.split('.')[0];
    return {
      platform: name.charAt(0).toUpperCase() + name.slice(1),
      resourceType: 'Web Resources'
    };
  } catch {
    return { platform: 'Web', resourceType: 'Web Resources' };
  }
}

/**
 * Calculates a community-weighted ranking score.
 * 
 * Rules & Requirements:
 * - Does NOT rank resources solely by raw upvote count.
 * - Prevents a resource with only 2 or 3 votes from jumping over a resource evaluated by hundreds of students.
 * - Uses Wilson Score interval lower bound for positive vote proportion.
 * - Adds volume scaling based on total evaluation count.
 * - Adds a small recency factor.
 */
export function calculateRankingScore(
  helpfulCount: number,
  notHelpfulCount: number,
  createdAt?: string
): number {
  const u = Math.max(0, helpfulCount || 0);
  const d = Math.max(0, notHelpfulCount || 0);
  const n = u + d;

  if (n === 0) return 0;

  // Wilson score interval lower bound for 95% confidence (z = 1.96)
  const z = 1.96;
  const p = u / n;
  const denominator = 1 + (z * z) / n;
  const centre = p + (z * z) / (2 * n);
  const spread = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  const lowerBound = Math.max(0, (centre - spread) / denominator);

  // Confidence volume dampener: rewards higher community sample sizes
  // e.g. 5 votes -> ~1.6, 50 votes -> ~3.9, 200 votes -> ~5.3
  const volumeBonus = Math.min(15, Math.log2(n + 1) * 1.8);

  // Small recency factor: recent additions with strong initial traction get slight boost (up to 3 points within 60 days)
  let recencyBonus = 0;
  if (createdAt) {
    try {
      const createdDate = new Date(createdAt).getTime();
      const ageInDays = Math.max(0, (Date.now() - createdDate) / (1000 * 60 * 60 * 24));
      if (ageInDays < 60) {
        recencyBonus = (1 - ageInDays / 60) * 3;
      }
    } catch {
      recencyBonus = 0;
    }
  }

  // Combined score on a 0 - 100 scale
  const rawScore = (lowerBound * 80) + volumeBonus + recencyBonus;
  return Math.round(Math.max(0, Math.min(100, rawScore)) * 10) / 10;
}

/**
 * Returns a human-friendly ranking badge text
 */
export function getCommunityRatingBadge(score: number, totalVotes: number): {
  label: string;
  badgeClass: string;
} {
  if (totalVotes >= 10 && score >= 75) {
    return { label: '🔥 Top Resource', badgeClass: 'bg-amber-100 text-amber-900 border-amber-400' };
  }
  if (totalVotes >= 5 && score >= 60) {
    return { label: '⭐ Most Helpful', badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400' };
  }
  if (totalVotes >= 2 && score >= 45) {
    return { label: '👍 Recommended', badgeClass: 'bg-blue-100 text-blue-900 border-blue-400' };
  }
  return { label: '🌱 Student Community Pick', badgeClass: 'bg-stone-100 text-stone-700 border-stone-300' };
}
