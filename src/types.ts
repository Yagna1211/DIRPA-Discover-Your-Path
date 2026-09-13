export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni';
  avatar: string;
  interests?: string[];
  strengths?: string[];
  careerGoal?: string;
  bio?: string;
  onboarded?: boolean;
  hasSubmittedPlatformFeedback?: boolean;
  timeline?: any[];
  // Scholarship Recommendation Profile Fields
  familyIncome?: number;
  percentageMarks?: number;
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'Disabled';
  gender?: 'Male' | 'Female' | 'Other';
  state?: string;
  currentEducationLevel?: '10th' | 'Intermediate' | 'Polytechnic' | 'ITI' | 'Graduation' | 'Post Graduation';
  currentCourse?: string;
  isAdmin?: boolean;
}

export interface Scholarship {
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  providerType: 'Government' | 'Private' | 'NGO' | 'University';
  description: string;
  eligibility: string;
  educationLevel: '10th' | 'Intermediate' | 'Polytechnic' | 'ITI' | 'Graduation' | 'Post Graduation' | 'All';
  eligibleCourses: string[];
  eligibleStates: string[];
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'Disabled' | 'All';
  gender: 'All' | 'Male' | 'Female';
  minimumPercentage: number;
  maximumFamilyIncome: number;
  scholarshipAmount: string;
  applicationStartDate: string;
  applicationEndDate: string;
  documentsRequired: string[];
  selectionProcess: string;
  renewalAvailable: boolean;
  officialWebsite: string;
  applicationLink: string;
  status: 'Open' | 'Closed' | 'Draft' | 'Archived';
  contributedBy?: string;
  contributorNote?: string;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedScholarship {
  id: string;
  userId: string;
  scholarshipId: string;
  scholarshipName: string;
  createdAt: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'education' | 'career' | 'milestone';
}

export interface AlumniInsight {
  id: string;
  userId?: string;
  name: string;
  role: string;
  avatar: string; // Avatar name or character id
  isCustomAvatar?: boolean;
  institution: string;
  yearCompleted: string;
  experience: string;
  advice: string;
  rating: number;
  timeline: TimelineEvent[];
  authorEmail?: string;
  likes?: number;
  replies?: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AcademicPathway {
  id: string;
  level: '10th' | '12th';
  category: 'Science' | 'Commerce' | 'Arts' | 'Vocational' | 'Engineering' | 'Medical' | 'Specialized';
  name: string;
  duration: string;
  eligibility: string;
  subjects: string[];
  estimatedFees: string;
  description: string;
  futureOpportunities: string[];
  higherEducationOptions: string[];
  careerOutcomes: string[];
  alumniInsights: AlumniInsight[];
  // Positions for interactive graph node positioning in percentages (e.g. x: 40, y: 50)
  nodePosition: {
    x: number;
    y: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string; // Always dynamic
  alumniId: string;
  alumniName: string;
  alumniAvatar: string;
  alumniRole: string;
  messages: Message[];
}

export interface SavedPath {
  id: string;
  pathId: string;
  pathName: string;
  level: '10th' | '12th';
  savedAt: string;
}

export interface SavedAlumni {
  id: string;
  alumniId: string;
  alumniName: string;
  alumniRole: string;
  alumniAvatar: string;
  savedAt: string;
}

export interface AIRecommendationRequest {
  level: '10th' | '12th' | 'Graduation';
  interests: string[];
  strengths: string[];
  budget: 'low' | 'medium' | 'high' | 'any';
  durationPref: string;
  careerGoal: string;
}

export interface AIRecommendationResponse {
  recommendedPaths: {
    name: string;
    description: string;
    whyFits: string;
    estimatedFees: string;
    subjects: string[];
    timeline: string[];
    careerPotential: string[];
  }[];
  alternatives: {
    name: string;
    description: string;
    whyAlternative: string;
  }[];
  generalAdvice: string;
}

export interface CompanyRole {
  id: string;
  title: string;
  department: string;
  targetEligibility: string[];
  experienceLevel: 'Entry-Level / Fresher' | 'Junior' | 'Mid-Senior' | 'All Levels';
  packageRange: string;
  description: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  hiringStages: string[];
}

export interface CompanyFeedback {
  id: string;
  userId?: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  collegeOrBatch?: string;
  rating: number;
  workLifeBalanceRating?: number;
  careerGrowthRating?: number;
  feedbackText: string;
  interviewExperience?: string;
  adviceForFreshers?: string;
  likes?: number;
  timestamp: string;
  isVerifiedAlumni?: boolean;
}

export interface Company {
  id: string;
  name: string;
  logoEmoji?: string;
  logoUrl?: string;
  brandColor?: string;
  tagline: string;
  industry: 'Tech & Product' | 'IT Services & Consulting' | 'Automotive & Core Engineering' | 'Finance & Fintech' | 'Aerospace & Defence / PSU' | 'Healthcare & Pharma' | string;
  companyType: 'Product MNC' | 'IT Services MNC' | 'Indian Tech Giant' | 'Government / PSU' | 'Automotive Leader' | 'Fintech & Banking' | 'Pharma Leader' | 'Core Engineering Giant' | 'Telecom & Digital' | 'Semiconductor MNC' | string;
  headquarters: string;
  foundedYear: string;
  employeeCount: string;
  description: string;
  aboutCulture: string;
  website: string;
  careersUrl: string;
  hiringOverview: {
    minimumEligibility: string;
    acceptedStreams: string[];
    standardSelectionProcess: string[];
    fresherHiringPrograms: string[];
    internshipOpportunities: string;
  };
  salaryOverview: {
    fresherMedian: string;
    range: string;
    benefits: string[];
  };
  roles: CompanyRole[];
  alumniFeedbacks: CompanyFeedback[];
  keyHighlights: string[];
}

export type BulletCategory =
  | 'Scholarships'
  | 'Education'
  | 'Entrance Exams'
  | 'Admissions'
  | 'Government Schemes'
  | 'Government Notifications'
  | 'Jobs'
  | 'Company Hiring'
  | 'Internships'
  | 'Fellowships'
  | 'Research Opportunities'
  | 'Career Opportunities'
  | 'International Education'
  | 'Important Student Announcements';

export type BulletSourceType =
  | 'Official Government'
  | 'Official University'
  | 'Official Company Portal'
  | 'Examination Board'
  | 'Scholarship Portal'
  | 'Reputable Media'
  | 'Official Institution';

export interface Bullet {
  bulletId: string;
  title: string;
  summary: string;
  fullDetails?: string;
  category: BulletCategory;
  publishedAt: string; // e.g. "13 September 2026" or "12 Sep 2026"
  sourceName: string;
  sourceUrl: string;
  sourceType: BulletSourceType;
  lastVerified: string;
  region: string; // e.g. "India (National)", "Andhra Pradesh & Telangana", "Karnataka", "International"
  educationLevel?: ('10th' | 'Intermediate' | 'Polytechnic' | 'ITI' | 'Graduation' | 'Post Graduation' | 'All')[];
  relevantStreams?: string[]; // e.g. ['Engineering', 'Medical', 'Commerce', 'Arts', 'All']
  deadline?: string;
  isImportant?: boolean;
  isVerified: boolean;
  tags?: string[];
  officialPortalName?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

export interface BulletComment {
  id: string;
  bulletId: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  text: string;
  createdAt: string;
}

// =========================================================================
// STUFF - Student-Powered Learning Resource Discovery Types
// =========================================================================

export type StuffCategory = 
  | 'Videos'
  | 'Web Resources'
  | 'Practice'
  | 'Documentation'
  | 'Courses';

export interface StuffSubject {
  subjectId: string;
  subjectName: string;
  description: string;
  relatedTopics: string[];
  resourcesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StuffResource {
  resourceId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  recommendationReason?: string;
  url: string;
  normalizedUrl: string;
  resourceType: StuffCategory;
  platform: string;
  submittedBy: string;
  submittedByName: string;
  submittedByAvatar?: string;
  createdAt: string;
  updatedAt: string;
  helpfulCount: number;
  notHelpfulCount: number;
  totalVotes: number;
  rankingScore: number;
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  lastReviewedAt?: string;
}

export interface StuffVote {
  voteId: string;
  resourceId: string;
  userId: string;
  voteType: 'helpful' | 'not_helpful';
  createdAt: string;
  updatedAt: string;
}

