import { StuffSubject, StuffResource, StuffVote, StuffCategory } from '../types';
import { normalizeResourceUrl, detectPlatformAndType } from '../utils/stuffRanking';

export interface VoteResponse {
  success: boolean;
  userVote: 'helpful' | 'not_helpful' | null;
  helpfulCount: number;
  notHelpfulCount: number;
  totalVotes: number;
  rankingScore: number;
  error?: string;
}

export interface CreateResourceResponse {
  success: boolean;
  resource?: StuffResource;
  isDuplicate?: boolean;
  message?: string;
  existingResource?: StuffResource;
  error?: string;
}

/**
 * Fetch all popular / active subjects
 */
export async function fetchSubjects(): Promise<StuffSubject[]> {
  try {
    const res = await fetch('/api/stuff/subjects');
    if (!res.ok) throw new Error(`Failed to fetch subjects: ${res.statusText}`);
    const data = await res.json();
    return data.subjects || [];
  } catch (err) {
    console.warn('Error loading subjects from server:', err);
    return [];
  }
}

/**
 * Fetch or generate factual subject description and related topics via server & Gemini
 */
export async function fetchSubjectInfo(subjectName: string): Promise<StuffSubject> {
  const cleanSubject = (subjectName || '').trim();
  if (!cleanSubject) {
    return {
      subjectId: 'general',
      subjectName: 'General',
      description: 'Find the best student-recommended resources to learn any subject or skill.',
      relatedTopics: ['Computer Science', 'Mathematics', 'Engineering', 'Web Development'],
      resourcesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  try {
    const res = await fetch(`/api/stuff/subject-info?subject=${encodeURIComponent(cleanSubject)}`);
    if (!res.ok) throw new Error(`Subject info error: ${res.statusText}`);
    const data = await res.json();
    return data.subject;
  } catch (err) {
    console.warn('Fallback generating local subject descriptor:', err);
    return {
      subjectId: cleanSubject.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subjectName: cleanSubject,
      description: `Comprehensive learning curriculum and core concepts for ${cleanSubject}, verified and reviewed by real DIRPA students.`,
      relatedTopics: ['Fundamentals', 'Best Practices', 'Interviews', 'Hands-on Projects'],
      resourcesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * Fetch resources for a subject, category, or search filter
 */
export async function fetchResources(params: {
  subject?: string;
  category?: StuffCategory | 'All';
  search?: string;
  sortBy?: 'ranking' | 'helpful' | 'recent';
  userId?: string;
}): Promise<StuffResource[]> {
  const queryParts: string[] = [];
  if (params.subject && params.subject !== 'All') {
    queryParts.push(`subject=${encodeURIComponent(params.subject)}`);
  }
  if (params.category && params.category !== 'All') {
    queryParts.push(`category=${encodeURIComponent(params.category)}`);
  }
  if (params.search) {
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  }
  if (params.sortBy) {
    queryParts.push(`sortBy=${encodeURIComponent(params.sortBy)}`);
  }
  if (params.userId) {
    queryParts.push(`userId=${encodeURIComponent(params.userId)}`);
  }

  const queryUrl = `/api/stuff/resources${queryParts.length > 0 ? `?${queryParts.join('&')}` : ''}`;

  try {
    const res = await fetch(queryUrl);
    if (!res.ok) throw new Error(`Failed to fetch resources: ${res.statusText}`);
    const data = await res.json();
    return data.resources || [];
  } catch (err) {
    console.error('Error fetching resources:', err);
    return [];
  }
}

/**
 * Fetch student's votes on resources
 */
export async function fetchUserVotes(userId: string): Promise<Record<string, 'helpful' | 'not_helpful'>> {
  if (!userId) return {};
  try {
    const res = await fetch(`/api/stuff/user-votes?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return {};
    const data = await res.json();
    return data.votes || {};
  } catch (err) {
    console.warn('Error fetching student votes:', err);
    return {};
  }
}

/**
 * Cast or toggle a vote on a resource
 */
export async function castVote(
  resourceId: string,
  userId: string,
  voteType: 'helpful' | 'not_helpful'
): Promise<VoteResponse> {
  try {
    const res = await fetch('/api/stuff/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, userId, voteType })
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        userVote: null,
        helpfulCount: 0,
        notHelpfulCount: 0,
        totalVotes: 0,
        rankingScore: 0,
        error: data.error || data.message || 'Failed to submit vote'
      };
    }

    return {
      success: true,
      userVote: data.userVote,
      helpfulCount: data.helpfulCount,
      notHelpfulCount: data.notHelpfulCount,
      totalVotes: data.totalVotes,
      rankingScore: data.rankingScore
    };
  } catch (err: any) {
    return {
      success: false,
      userVote: null,
      helpfulCount: 0,
      notHelpfulCount: 0,
      totalVotes: 0,
      rankingScore: 0,
      error: err.message || 'Network error voting'
    };
  }
}

/**
 * Add a new student resource
 */
export async function createResource(data: {
  subjectName: string;
  title: string;
  url: string;
  resourceType?: StuffCategory;
  description: string;
  recommendationReason?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
}): Promise<CreateResourceResponse> {
  try {
    const res = await fetch('/api/stuff/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.status === 409 || result.error === 'DUPLICATE') {
      return {
        success: false,
        isDuplicate: true,
        message: result.message || 'This resource has already been added.',
        existingResource: result.existingResource
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: result.error || result.message || 'Failed to add resource'
      };
    }

    return {
      success: true,
      resource: result.resource
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error submitting resource'
    };
  }
}

/**
 * Submitter delete own resource
 */
export async function deleteResource(resourceId: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/stuff/resources/${resourceId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.ok;
  } catch {
    return false;
  }
}
