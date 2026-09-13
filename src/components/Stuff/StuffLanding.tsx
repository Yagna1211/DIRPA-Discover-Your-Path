import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Sparkles, Filter, BookOpen, ThumbsUp, 
  ExternalLink, Layers, CheckCircle2, TrendingUp, RefreshCw, 
  ArrowLeft, Compass, Info, Zap, ChevronRight
} from 'lucide-react';
import { StuffCategory, StuffResource, StuffSubject, UserProfile } from '../../types';
import { fetchSubjects, fetchSubjectInfo, fetchResources, fetchUserVotes, deleteResource } from '../../services/stuffService';
import { ResourceCard } from './ResourceCard';
import { AddResourceModal } from './AddResourceModal';

interface StuffLandingProps {
  user: UserProfile | null;
  onBackToHome: () => void;
  onRequireAuth?: () => void;
  isDarkMode?: boolean;
}

const CATEGORY_TABS: { key: StuffCategory | 'All'; label: string; icon: string }[] = [
  { key: 'All', label: 'All Resources', icon: '⚡' },
  { key: 'Videos', label: 'Videos', icon: '🎥' },
  { key: 'Web Resources', label: 'Web Resources', icon: '🌐' },
  { key: 'Practice', label: 'Practice', icon: '💻' },
  { key: 'Documentation', label: 'Documentation', icon: '📚' },
  { key: 'Courses', label: 'Courses', icon: '🎓' }
];

const SUGGESTED_SUBJECTS = [
  'Java OOP',
  'Data Structures',
  'DBMS',
  'React',
  'Machine Learning',
  'Operating Systems',
  'Computer Networks'
];

export const StuffLanding: React.FC<StuffLandingProps> = ({
  user,
  onBackToHome,
  onRequireAuth,
  isDarkMode = false
}) => {
  // Search query in input
  const [searchQuery, setSearchQuery] = useState('');
  // Active selected subject (e.g. "Java OOP" or "All")
  const [selectedSubject, setSelectedSubject] = useState<string>('Java OOP');
  // Selected category filter tab
  const [selectedCategory, setSelectedCategory] = useState<StuffCategory | 'All'>('All');
  // Sort order
  const [sortBy, setSortBy] = useState<'ranking' | 'helpful' | 'recent'>('ranking');
  // Tab for All vs My Submissions
  const [viewScope, setViewScope] = useState<'all' | 'my_submissions'>('all');

  // Subjects list & current subject details
  const [subjectsList, setSubjectsList] = useState<StuffSubject[]>([]);
  const [currentSubjectInfo, setCurrentSubjectInfo] = useState<StuffSubject | null>(null);
  const [isLoadingSubjectInfo, setIsLoadingSubjectInfo] = useState(false);

  // Resources state
  const [resources, setResources] = useState<StuffResource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);

  // Current student's votes map { [resourceId]: 'helpful' | 'not_helpful' }
  const [userVotes, setUserVotes] = useState<Record<string, 'helpful' | 'not_helpful'>>({});

  // Add Resource Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Target resource highlight (if user clicked an existing duplicate link)
  const [highlightedResourceId, setHighlightedResourceId] = useState<string | null>(null);

  // 1. Load subjects catalog & student votes on mount
  useEffect(() => {
    loadSubjectsCatalog();
    if (user?.id) {
      loadUserVotes(user.id);
    }
  }, [user?.id]);

  const loadSubjectsCatalog = async () => {
    try {
      const data = await fetchSubjects();
      setSubjectsList(data);
    } catch (err) {
      console.warn('Failed loading subjects catalog:', err);
    }
  };

  const loadUserVotes = async (uid: string) => {
    try {
      const votes = await fetchUserVotes(uid);
      setUserVotes(votes);
    } catch (err) {
      console.warn('Failed loading student votes:', err);
    }
  };

  // 2. Fetch subject information (concise factual description & related topics via Gemini server API)
  useEffect(() => {
    if (selectedSubject && selectedSubject !== 'All') {
      loadSubjectDetails(selectedSubject);
    } else {
      setCurrentSubjectInfo(null);
    }
  }, [selectedSubject]);

  const loadSubjectDetails = async (subject: string) => {
    setIsLoadingSubjectInfo(true);
    try {
      const info = await fetchSubjectInfo(subject);
      setCurrentSubjectInfo(info);
    } catch (err) {
      console.warn('Error loading subject details:', err);
    } finally {
      setIsLoadingSubjectInfo(false);
    }
  };

  // 3. Load resources matching subject, category, search, and sort
  const loadResourcesData = async () => {
    setIsLoadingResources(true);
    try {
      const data = await fetchResources({
        subject: selectedSubject !== 'All' ? selectedSubject : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
        sortBy,
        userId: user?.id
      });
      setResources(data);
    } catch (err) {
      console.error('Error loading resources:', err);
    } finally {
      setIsLoadingResources(false);
    }
  };

  useEffect(() => {
    loadResourcesData();
  }, [selectedSubject, selectedCategory, sortBy, user?.id]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      setSelectedSubject(query);
      loadResourcesData();
    }
  };

  // Handle vote update in memory
  const handleVoteUpdated = (
    resourceId: string,
    helpful: number,
    notHelpful: number,
    score: number,
    nextVote: 'helpful' | 'not_helpful' | null
  ) => {
    setResources((prev) =>
      prev.map((r) =>
        r.resourceId === resourceId
          ? {
              ...r,
              helpfulCount: helpful,
              notHelpfulCount: notHelpful,
              totalVotes: helpful + notHelpful,
              rankingScore: score
            }
          : r
      )
    );

    setUserVotes((prev) => {
      const next = { ...prev };
      if (nextVote) {
        next[resourceId] = nextVote;
      } else {
        delete next[resourceId];
      }
      return next;
    });
  };

  // Handle deletion of student's own resource
  const handleDeleteResource = async (resourceId: string) => {
    if (!user) return;
    const ok = await deleteResource(resourceId, user.id);
    if (ok) {
      setResources((prev) => prev.filter((r) => r.resourceId !== resourceId));
      if (currentSubjectInfo) {
        setCurrentSubjectInfo({
          ...currentSubjectInfo,
          resourcesCount: Math.max(0, (currentSubjectInfo.resourcesCount || 1) - 1)
        });
      }
    } else {
      alert('Could not delete resource. Please verify your permissions.');
    }
  };

  // Filtered resources according to viewScope (All vs My Submissions)
  const displayedResources = useMemo(() => {
    if (viewScope === 'my_submissions' && user) {
      return resources.filter((r) => r.submittedBy === user.id);
    }
    return resources;
  }, [resources, viewScope, user]);

  return (
    <div className="min-h-screen bg-white text-stone-900 pb-24">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BRAND BAR */}
      {/* ========================================================================= */}
      <div className="border-b-2 border-black bg-[#FFE500] sticky top-0 z-30 shadow-[0_2px_0_0_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="px-2.5 py-1.5 bg-white border-2 border-black text-xs font-black uppercase tracking-wider hover:bg-stone-100 transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
              title="Return to DIRPA Home"
              id="stuff-back-to-home-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase text-black">
                STUFF
              </span>
              <span className="hidden sm:inline-block text-xs font-bold text-stone-800 font-mono bg-white/70 px-2 py-0.5 border border-black rounded">
                Student Learning Discovery
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!user && onRequireAuth) {
                  onRequireAuth();
                } else {
                  setIsAddModalOpen(true);
                }
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-amber-300 hover:bg-stone-800 border-2 border-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              id="stuff-top-add-resource-btn"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ ADD RESOURCE</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO / SEARCH BANNER */}
      {/* ========================================================================= */}
      <div className="border-b-2 border-black bg-stone-50 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-black text-xs font-mono font-bold text-amber-950 rounded-full shadow-[2px_2px_0px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>DIRPA Student-Powered Resource Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-stone-900 tracking-tight">
            Find the best resources to learn anything.
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Stop wasting hours sifting through low-quality links. Search any subject or topic to see the best videos, articles, documentation, and practice platforms ranked by feedback from real DIRPA students.
          </p>

          {/* Prominent Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn? (e.g. Java OOP, Data Structures, DBMS, React...)"
                className="w-full pl-11 pr-28 py-3.5 sm:py-4 bg-white border-3 border-black text-sm sm:text-base font-medium shadow-[4px_4px_0px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                id="stuff-main-search-input"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-4" />

              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                id="stuff-search-submit-btn"
              >
                SEARCH
              </button>
            </div>
          </form>

          {/* Quick Subject Suggestion Chips */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-mono font-bold text-stone-400 uppercase mr-1">
              Popular Topics:
            </span>
            {SUGGESTED_SUBJECTS.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  setSearchQuery(sub);
                  setSelectedSubject(sub);
                }}
                className={`px-2.5 py-1 text-xs font-mono font-bold border transition-all cursor-pointer ${
                  selectedSubject.toLowerCase() === sub.toLowerCase()
                    ? 'bg-black text-amber-300 border-black shadow-[2px_2px_0px_0px_#FFE500]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-black hover:bg-amber-50'
                }`}
                id={`suggested-topic-${sub.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* 3. CURRENT SUBJECT OVERVIEW CARD */}
        {/* ========================================================================= */}
        {selectedSubject && (
          <div className="bg-stone-50 border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-amber-200 text-amber-900 border border-amber-400 rounded">
                    Subject Hub
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-500">
                    {displayedResources.length} {displayedResources.length === 1 ? 'Resource' : 'Resources'} Available
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-stone-950 tracking-tight">
                  {selectedSubject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!user && onRequireAuth) {
                    onRequireAuth();
                  } else {
                    setIsAddModalOpen(true);
                  }
                }}
                className="self-start sm:self-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                id="add-resource-for-current-subject-btn"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>+ ADD RESOURCE FOR {selectedSubject.toUpperCase()}</span>
              </button>
            </div>

            {/* Factual Subject Description (Enhanced via Gemini Factual Prompt) */}
            <div className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
              {isLoadingSubjectInfo ? (
                <div className="flex items-center gap-2 text-stone-400 font-mono py-1">
                  <div className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading subject details...</span>
                </div>
              ) : (
                <p>{currentSubjectInfo?.description || `Explore top community-reviewed resources for ${selectedSubject}.`}</p>
              )}
            </div>

            {/* Related Topics Chips */}
            {currentSubjectInfo?.relatedTopics && currentSubjectInfo.relatedTopics.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-mono font-bold text-stone-500 uppercase mr-1">
                  Related Topics:
                </span>
                {currentSubjectInfo.relatedTopics.map((topic) => (
                  <span
                    key={topic}
                    onClick={() => {
                      setSearchQuery(topic);
                      setSelectedSubject(topic);
                    }}
                    className="text-[11px] font-mono font-semibold bg-white text-stone-700 border border-stone-300 px-2 py-0.5 rounded cursor-pointer hover:border-black hover:bg-amber-100 transition-colors"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. RESOURCE CATEGORY TABS & SORT CONTROLS */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-3">
            
            {/* Category Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_TABS.map((cat) => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.key
                      ? 'bg-amber-300 border-black text-black shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-stone-50 border-stone-300 text-stone-600 hover:border-black hover:text-black'
                  }`}
                  id={`filter-tab-${cat.key.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Sort & Scope Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {/* My Submissions filter tab if logged in */}
              {user && (
                <div className="flex items-center border-2 border-black bg-stone-100 text-xs font-mono font-bold">
                  <button
                    type="button"
                    onClick={() => setViewScope('all')}
                    className={`px-2.5 py-1 ${viewScope === 'all' ? 'bg-black text-white' : 'text-stone-700 hover:bg-stone-200'}`}
                  >
                    All Resources
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewScope('my_submissions')}
                    className={`px-2.5 py-1 ${viewScope === 'my_submissions' ? 'bg-amber-400 text-black' : 'text-stone-700 hover:bg-stone-200'}`}
                  >
                    My Submissions
                  </button>
                </div>
              )}

              {/* Sorting options */}
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                <span className="text-stone-500 uppercase">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border-2 border-black px-2 py-1 text-xs font-mono font-bold text-stone-800 focus:outline-hidden"
                  id="stuff-sort-select"
                >
                  <option value="ranking">⭐ Top Resources (Community Weighted)</option>
                  <option value="helpful">👍 Most Helpful Votes</option>
                  <option value="recent">🕒 Recently Added</option>
                </select>
              </div>

              <button
                type="button"
                onClick={loadResourcesData}
                disabled={isLoadingResources}
                className="p-1.5 bg-white border-2 border-black hover:bg-stone-100 transition-colors shadow-[1px_1px_0px_0px_#000]"
                title="Refresh resources"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-stone-700 ${isLoadingResources ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filter summary status */}
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 px-1">
            <span>
              Showing <strong>{displayedResources.length}</strong> resources in <strong>{selectedCategory}</strong>
              {selectedSubject && selectedSubject !== 'All' ? ` for "${selectedSubject}"` : ''}
            </span>
            <span className="text-[11px] text-stone-400">
              Ranked by DIRPA student evaluations
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. RESOURCES GRID */}
        {/* ========================================================================= */}
        {isLoadingResources ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-black rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono font-bold text-stone-600">
              Loading student-recommended resources...
            </p>
          </div>
        ) : displayedResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedResources.map((resource) => (
              <ResourceCard
                key={resource.resourceId}
                resource={resource}
                user={user}
                userVote={userVotes[resource.resourceId] || null}
                onVoteUpdated={handleVoteUpdated}
                onDeleteResource={handleDeleteResource}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        ) : (
          /* Empty State: Prompting students to add the first resource! */
          <div className="border-3 border-dashed border-stone-300 p-8 sm:p-12 text-center bg-stone-50 space-y-4">
            <div className="w-16 h-16 bg-amber-100 border-2 border-black rounded-full flex items-center justify-center mx-auto text-3xl shadow-[3px_3px_0px_0px_#000]">
              📚
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-display font-black uppercase text-stone-900 tracking-tight">
                No resources added yet for {selectedSubject || 'this category'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Be the first student to add a helpful tutorial, video, documentation, or practice platform for this subject! Your recommendation will help thousands of DIRPA peers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!user && onRequireAuth) {
                  onRequireAuth();
                } else {
                  setIsAddModalOpen(true);
                }
              }}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
              id="empty-state-add-resource-btn"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>+ Add the First Resource</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. HOW STUFF COMMUNITY RANKING WORKS (TRANSPARENCY NOTE) */}
        {/* ========================================================================= */}
        <div className="border-2 border-black bg-stone-50 p-6 shadow-[4px_4px_0px_0px_#000] space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700" />
            <h4 className="text-sm font-display font-black uppercase text-stone-900 tracking-wide">
              How STUFF Community Ranking Works
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700 font-medium">
            <div className="p-3 bg-white border border-stone-300 space-y-1">
              <strong className="text-stone-900 block font-mono">1. Evaluated by Real Students</strong>
              <p>
                Every authenticated DIRPA student can vote 👍 Helpful or 👎 Not Helpful. Zero fake bots or generated ratings.
              </p>
            </div>

            <div className="p-3 bg-white border border-stone-300 space-y-1">
              <strong className="text-stone-900 block font-mono">2. Confidence-Weighted Algorithm</strong>
              <p>
                Uses the Wilson score interval lower bound. A resource with only 2 upvotes cannot jump over a resource proven by 100+ students.
              </p>
            </div>

            <div className="p-3 bg-white border border-stone-300 space-y-1">
              <strong className="text-stone-900 block font-mono">3. Submitter Integrity</strong>
              <p>
                Submitters cannot vote on their own recommendations. URLs are normalized to eliminate duplicate submissions.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 7. ADD RESOURCE MODAL */}
      {/* ========================================================================= */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        user={user}
        initialSubject={selectedSubject !== 'All' ? selectedSubject : ''}
        onResourceAdded={(newResource) => {
          // Prepend newly added resource to list
          setResources((prev) => [newResource, ...prev]);
          if (currentSubjectInfo) {
            setCurrentSubjectInfo({
              ...currentSubjectInfo,
              resourcesCount: (currentSubjectInfo.resourcesCount || 0) + 1
            });
          }
        }}
        onViewExistingResource={(existing) => {
          setSelectedSubject(existing.subjectName || selectedSubject);
          setSelectedCategory('All');
          setHighlightedResourceId(existing.resourceId);
          // Scroll to resource if present
          setTimeout(() => {
            const el = document.getElementById(`resource-card-${existing.resourceId}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('ring-4', 'ring-amber-400');
              setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 3000);
            }
          }, 400);
        }}
      />
    </div>
  );
};
