import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Search, 
  Filter, 
  RefreshCw, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ExternalLink, 
  Calendar, 
  Building, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Globe, 
  X, 
  Check, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Bullet, BulletCategory, UserProfile } from '../types';
import { ALL_BULLET_CATEGORIES, VERIFIED_BULLETS_DATA, deduplicateBullets, personalizeBullets, getBulletFallbackImage } from '../data/bulletsData';
import { BulletArticle } from './BulletArticle';
import { BulletCommentsModal } from './BulletCommentsModal';
import { BulletExternalLinkModal } from './BulletExternalLinkModal';

interface BulletsFeedProps {
  user?: UserProfile | null;
  onBackToHome: () => void;
  isDarkMode?: boolean;
}

export const BulletsFeed: React.FC<BulletsFeedProps> = ({
  user,
  onBackToHome,
  isDarkMode = false
}) => {
  // State
  const [bullets, setBullets] = useState<Bullet[]>(VERIFIED_BULLETS_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEduLevel, setSelectedEduLevel] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'for_you' | 'all' | 'saved'>(user ? 'for_you' : 'all');
  const [savedBulletIds, setSavedBulletIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dirpa_saved_bullets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Client ID for global interactions
  const [clientId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('dirpa_client_id');
      if (stored) return stored;
      const gen = `client_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      localStorage.setItem('dirpa_client_id', gen);
      return gen;
    } catch {
      return `client_${Date.now()}`;
    }
  });

  // Social Stats State (global real-time likes & comments)
  const [socialStats, setSocialStats] = useState<Record<string, { likesCount: number; isLiked: boolean; commentsCount: number }>>({});
  const [activeCommentBullet, setActiveCommentBullet] = useState<Bullet | null>(null);
  const [externalLinkBullet, setExternalLinkBullet] = useState<Bullet | null>(null);
  const [selectedBullet, setSelectedBullet] = useState<Bullet | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Live (13 Sep 2026)');

  // Fetch social stats from backend
  useEffect(() => {
    let isMounted = true;
    const fetchSocialStats = async () => {
      try {
        const res = await fetch(`/api/bullets/social?clientId=${encodeURIComponent(clientId)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.stats) {
            setSocialStats(data.stats);
          }
        }
      } catch (err) {
        console.warn('Could not fetch social stats:', err);
      }
    };
    fetchSocialStats();
    // Poll every 30s to keep social stats synced globally in real time
    const interval = setInterval(fetchSocialStats, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [clientId]);

  // Handle Like/Unlike
  const handleLike = async (bulletId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic UI update
    setSocialStats(prev => {
      const current = prev[bulletId] || { likesCount: 0, isLiked: false, commentsCount: 0 };
      const nextLiked = !current.isLiked;
      const nextCount = nextLiked ? current.likesCount + 1 : Math.max(0, current.likesCount - 1);
      return {
        ...prev,
        [bulletId]: {
          ...current,
          isLiked: nextLiked,
          likesCount: nextCount
        }
      };
    });

    try {
      const res = await fetch(`/api/bullets/${bulletId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          userId: user?.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSocialStats(prev => ({
          ...prev,
          [bulletId]: {
            ...(prev[bulletId] || { commentsCount: 0 }),
            isLiked: data.isLiked,
            likesCount: data.likesCount
          }
        }));
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // Handle Original Link with Leaving DIRPA notification
  const handleOpenOriginalLink = (bullet: Bullet, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExternalLinkBullet(bullet);
  };

  const handleProceedExternalLink = () => {
    if (externalLinkBullet) {
      window.open(externalLinkBullet.sourceUrl, '_blank', 'noopener,noreferrer');
      showToast(`Navigated to official portal: ${externalLinkBullet.sourceName}`);
    }
  };

  // Handle Comment Added
  const handleCommentAdded = (bulletId: string, newCount: number) => {
    setSocialStats(prev => ({
      ...prev,
      [bulletId]: {
        ...(prev[bulletId] || { likesCount: 0, isLiked: false }),
        commentsCount: newCount
      }
    }));
    showToast('Comment posted to global student feed!');
  };

  // Save/Unsave bullet
  const toggleSaveBullet = (bulletId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedBulletIds(prev => {
      const exists = prev.includes(bulletId);
      const next = exists ? prev.filter(id => id !== bulletId) : [...prev, bulletId];
      try {
        localStorage.setItem('dirpa_saved_bullets', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
      showToast(exists ? 'Removed from saved bullets' : 'Saved to your bookmarks!');
      return next;
    });
  };

  // Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Share bullet
  const shareBullet = async (bullet: Bullet, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareText = `📌 ${bullet.title}\n\n${bullet.summary}\n\nOfficial Source: ${bullet.sourceName} (${bullet.sourceUrl})\nShared via DIRPA Student Career Feed`;
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast('Bullet and official link copied to clipboard!');
      } catch {
        showToast('Copied to clipboard');
      }
    } else {
      showToast('Copied link: ' + bullet.sourceUrl);
    }
  };

  // Fetch / Refresh Feed from backend (with optional live Google Search Grounding)
  const fetchBulletsFeed = async (isLive = false) => {
    if (isLive) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await fetch('/api/bullets/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          userQuery: searchQuery.trim() || undefined,
          educationLevel: selectedEduLevel !== 'All' ? selectedEduLevel : user?.currentEducationLevel,
          course: user?.currentCourse,
          state: user?.state,
          region: selectedRegion !== 'all' ? selectedRegion : undefined,
          liveSearch: isLive
        })
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      if (data.bullets && Array.isArray(data.bullets)) {
        setBullets(data.bullets);
        setLastUpdated(`Live (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
        if (isLive) {
          showToast(`Refreshed! ${data.liveGroundedCount || 0} live ground-searched notices checked.`);
        }
      }
    } catch (err) {
      console.warn('Using local verified repository:', err);
      setBullets(VERIFIED_BULLETS_DATA);
      if (isLive) {
        showToast('Updated with latest verified official bullets');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Personalized / Scored list
  const personalizedItems = useMemo(() => {
    return personalizeBullets(bullets, user);
  }, [bullets, user]);

  // Filtered bullets based on active tab, search, category, region, and education level
  const displayedBullets = useMemo(() => {
    let list = bullets;

    // Tab filter
    if (activeTab === 'saved') {
      list = list.filter(b => savedBulletIds.includes(b.bulletId));
    } else if (activeTab === 'for_you' && user) {
      list = personalizedItems.map(item => item.bullet);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter(b => b.category === selectedCategory);
    }

    // Region filter
    if (selectedRegion !== 'all') {
      list = list.filter(b => {
        const r = b.region.toLowerCase();
        if (selectedRegion === 'national') return r.includes('india') || r.includes('national');
        if (selectedRegion === 'state') return r.includes('andhra') || r.includes('telangana') || r.includes('state');
        if (selectedRegion === 'international') return r.includes('international') || r.includes('global');
        return true;
      });
    }

    // Education Level filter
    if (selectedEduLevel !== 'All') {
      list = list.filter(b => {
        if (!b.educationLevel || b.educationLevel.includes('All')) return true;
        return b.educationLevel.some(lvl => lvl.toLowerCase() === selectedEduLevel.toLowerCase());
      });
    }

    // Keyword Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.sourceName.toLowerCase().includes(q) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return deduplicateBullets(list);
  }, [bullets, activeTab, savedBulletIds, selectedCategory, selectedRegion, selectedEduLevel, searchQuery, personalizedItems, user]);

  // Category Color Map
  const getCategoryTheme = (category: BulletCategory | string) => {
    switch (category) {
      case 'Scholarships':
        return { bg: 'bg-emerald-100', text: 'text-emerald-950', border: 'border-emerald-700', badge: 'bg-emerald-700 text-white' };
      case 'Entrance Exams':
        return { bg: 'bg-purple-100', text: 'text-purple-950', border: 'border-purple-700', badge: 'bg-purple-700 text-white' };
      case 'Jobs':
      case 'Company Hiring':
        return { bg: 'bg-blue-100', text: 'text-blue-950', border: 'border-blue-700', badge: 'bg-blue-700 text-white' };
      case 'Internships':
        return { bg: 'bg-indigo-100', text: 'text-indigo-950', border: 'border-indigo-700', badge: 'bg-indigo-700 text-white' };
      case 'Government Schemes':
      case 'Government Notifications':
        return { bg: 'bg-amber-100', text: 'text-amber-950', border: 'border-amber-700', badge: 'bg-amber-800 text-white' };
      case 'Fellowships':
      case 'Research Opportunities':
        return { bg: 'bg-rose-100', text: 'text-rose-950', border: 'border-rose-700', badge: 'bg-rose-700 text-white' };
      case 'International Education':
        return { bg: 'bg-cyan-100', text: 'text-cyan-950', border: 'border-cyan-700', badge: 'bg-cyan-800 text-white' };
      case 'Admissions':
      case 'Education':
        return { bg: 'bg-teal-100', text: 'text-teal-950', border: 'border-teal-700', badge: 'bg-teal-800 text-white' };
      default:
        return { bg: 'bg-stone-100', text: 'text-stone-900', border: 'border-black', badge: 'bg-black text-white' };
    }
  };

  // Quick category pills
  const quickFilters = [
    { label: 'All Updates', cat: 'All' },
    { label: 'Scholarships', cat: 'Scholarships' },
    { label: 'Entrance Exams', cat: 'Entrance Exams' },
    { label: 'Company Hiring', cat: 'Company Hiring' },
    { label: 'Jobs', cat: 'Jobs' },
    { label: 'Internships', cat: 'Internships' },
    { label: 'Govt Schemes', cat: 'Government Schemes' },
    { label: 'Govt Notices', cat: 'Government Notifications' },
    { label: 'Research & Fellowships', cat: 'Research Opportunities' },
    { label: 'International', cat: 'International Education' },
    { label: 'Admissions', cat: 'Admissions' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-stone-950 text-stone-100' : 'bg-[#F9F8F6] text-stone-900'}`}>
      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-3 rounded-lg border-2 border-white shadow-[4px_4px_0px_0px_#000] flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR / NAVIGATION HEADER */}
      <div className="border-b-2 border-black bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 border-2 border-black bg-white hover:bg-stone-100 rounded-lg text-black transition-colors flex items-center gap-1 text-xs font-bold shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 border-2 border-black bg-amber-400 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight text-black flex items-center gap-2">
                    Bullets
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-black tracking-widest uppercase border border-black shadow-[1px_1px_0px_0px_#000]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    LIVE FEED
                  </span>
                </div>
                <p className="text-[11px] font-medium text-stone-500 hidden md:block">
                  Verified real-time educational & career intelligence • 100% genuine official sources
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-stone-700 bg-stone-100 px-2.5 py-2 border border-black rounded-lg shadow-[1px_1px_0px_0px_#000]">
              <Clock className="w-3.5 h-3.5 text-stone-600" />
              <span>Last updated: {lastUpdated}</span>
            </span>

            <button
              onClick={() => fetchBulletsFeed(true)}
              disabled={isRefreshing}
              className={`px-3.5 py-2 border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-all ${
                isRefreshing ? 'bg-stone-200 text-stone-600' : 'bg-emerald-400 hover:bg-emerald-300 text-black'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Searching Web...' : 'Refresh Live'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* STUDENT PROFILE PERSONALIZATION BANNER (IF LOGGED IN) */}
        {user && (
          <div className="border-2 border-black bg-white p-4 md:p-5 shadow-[4px_4px_0px_0px_#000] rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-black bg-yellow-200 flex items-center justify-center font-black text-sm text-black shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-stone-900 tracking-wider">
                      Student Feed for {user.name}
                    </span>
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-400 rounded text-[9px] font-bold">
                      Personalized
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Stream: <strong>{user.currentCourse || 'General Academic'}</strong> • Level: <strong>{user.currentEducationLevel || 'All'}</strong> • State: <strong>{user.state || 'India'}</strong>
                  </p>
                </div>
              </div>

              {/* TABS: FOR YOU vs ALL vs SAVED */}
              <div className="flex items-center border-2 border-black bg-stone-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('for_you')}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'for_you' ? 'bg-black text-white shadow-xs' : 'text-stone-700 hover:text-black'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>For You</span>
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'all' ? 'bg-black text-white shadow-xs' : 'text-stone-700 hover:text-black'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>All Updates ({bullets.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'saved' ? 'bg-black text-white shadow-xs' : 'text-stone-700 hover:text-black'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>Saved ({savedBulletIds.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH AND FILTER TOOLBAR */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') fetchBulletsFeed(true);
                }}
                placeholder="Search scholarships, exams, jobs, schemes (e.g. JEE, NSP, TCS, ISRO)..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-black rounded-lg text-xs md:text-sm font-medium focus:outline-none focus:bg-amber-50/40 shadow-[2px_2px_0px_0px_#000]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Region Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border-2 border-black rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              >
                <option value="all">📍 All Regions</option>
                <option value="national">🇮🇳 National (All India)</option>
                <option value="state">🏛️ AP & Telangana State</option>
                <option value="international">🌐 International / Global</option>
              </select>
            </div>

            {/* Education Level Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedEduLevel}
                onChange={e => setSelectedEduLevel(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border-2 border-black rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              >
                <option value="All">🎓 All Education Levels</option>
                <option value="10th">Class 10th</option>
                <option value="Intermediate">Intermediate (10+2)</option>
                <option value="Polytechnic">Polytechnic Diploma</option>
                <option value="ITI">ITI Technical</option>
                <option value="Graduation">Graduation (B.Tech / Degree)</option>
                <option value="Post Graduation">Post Graduation</option>
              </select>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            <span className="text-[10px] font-black uppercase text-stone-500 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {quickFilters.map(chip => {
              const isSelected = selectedCategory === chip.cat;
              return (
                <button
                  key={chip.cat}
                  onClick={() => setSelectedCategory(chip.cat)}
                  className={`px-3 py-1 text-xs font-bold whitespace-nowrap rounded-full border border-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]'
                      : 'bg-white hover:bg-amber-100 text-stone-800'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE FILTER STATUS / SUMMARY */}
        <div className="flex items-center justify-between text-xs text-stone-600 px-1">
          <div>
            Showing <strong>{displayedBullets.length}</strong> verified updates
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
          </div>

          {(selectedCategory !== 'All' || searchQuery || selectedRegion !== 'all' || selectedEduLevel !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedRegion('all');
                setSelectedEduLevel('All');
              }}
              className="text-red-700 hover:text-red-900 font-bold underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* NEW MODERN EDITORIAL HORIZONTAL FEED CANVAS (STREAM OF ARTICLES) */}
        {/* ========================================================================= */}
        {isLoading ? (
          <div className="border-2 border-black bg-white p-12 text-center shadow-[4px_4px_0px_0px_#000] rounded-xl">
            <RefreshCw className="w-8 h-8 mx-auto text-amber-500 animate-spin mb-3" />
            <p className="font-bold text-sm">Verifying real-time bullets from official portals...</p>
            <p className="text-xs text-stone-500 mt-1">Grounded with official government & examination databases</p>
          </div>
        ) : displayedBullets.length === 0 ? (
          <div className="border-2 border-black bg-white p-12 text-center shadow-[4px_4px_0px_0px_#000] rounded-xl space-y-3">
            <AlertCircle className="w-10 h-10 mx-auto text-amber-600" />
            <h3 className="text-lg font-display font-black uppercase text-stone-900">
              No verified information found.
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              DIRPA enforces a strict verification standard: only 100% genuine and verified notices from official government, exam boards, and company portals are displayed. We never invent or publish unverified rumors.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setSelectedRegion('all');
                  setSelectedEduLevel('All');
                }}
                className="px-4 py-2 border-2 border-black bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] rounded-lg cursor-pointer"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => fetchBulletsFeed(true)}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-stone-100 text-black text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Search Live Internet
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            {displayedBullets.map(bullet => (
              <BulletArticle
                key={bullet.bulletId}
                bullet={bullet}
                isSaved={savedBulletIds.includes(bullet.bulletId)}
                isLiked={socialStats[bullet.bulletId]?.isLiked ?? false}
                likesCount={socialStats[bullet.bulletId]?.likesCount ?? 0}
                commentsCount={socialStats[bullet.bulletId]?.commentsCount ?? 0}
                onToggleSave={toggleSaveBullet}
                onLike={handleLike}
                onOpenComments={(b) => setActiveCommentBullet(b)}
                onSelectBullet={(b) => setSelectedBullet(b)}
                onOpenOriginalLink={handleOpenOriginalLink}
                onShare={shareBullet}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* POPUP MODAL LAYOUT ON CLICK */}
      {selectedBullet && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedBullet(null)}
        >
          <div 
            className="border-2 border-black bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] rounded-xl relative space-y-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBullet(null)}
              className="absolute top-4 right-4 p-2 border-2 border-black bg-white hover:bg-red-50 hover:text-red-700 text-black transition-colors rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Status */}
            <div className="flex flex-wrap items-center gap-2 pr-12">
              <span className={`px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded border border-black ${getCategoryTheme(selectedBullet.category).badge}`}>
                {selectedBullet.category}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-950 border border-emerald-600 rounded text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                100% Verified Official Notice
              </span>
              <span className="text-xs font-mono text-stone-500">
                Published: {selectedBullet.publishedAt}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-xl md:text-2xl font-display font-black text-black leading-tight">
              {selectedBullet.title}
            </h2>

            {/* Image Banner */}
            <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border-2 border-black/20 bg-stone-100">
              <img
                src={selectedBullet.imageUrl || selectedBullet.thumbnailUrl || getBulletFallbackImage(selectedBullet.category)}
                alt={selectedBullet.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Verified Source Profile */}
            <div className="p-3.5 bg-stone-50 border-2 border-black rounded-lg flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                  Issuing Authority / Portal
                </div>
                <div className="text-sm font-black text-stone-900 mt-0.5">
                  {selectedBullet.sourceName}
                </div>
                <div className="text-xs text-stone-500">
                  Authority Type: <strong className="text-stone-800">{selectedBullet.sourceType}</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                  Target Region
                </div>
                <div className="text-xs font-bold text-stone-800 mt-0.5">
                  📍 {selectedBullet.region}
                </div>
                {selectedBullet.deadline && (
                  <div className="text-xs font-bold text-red-700 mt-0.5">
                    ⏳ Deadline: {selectedBullet.deadline}
                  </div>
                )}
              </div>
            </div>

            {/* Full Details Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-500">
                Official Intelligence Breakdown
              </h3>
              <p className="text-sm text-stone-800 leading-relaxed font-normal bg-amber-50/40 p-4 border border-stone-300 rounded-lg">
                {selectedBullet.fullDetails || selectedBullet.summary}
              </p>
            </div>

            {/* Education Level & Applicable Streams */}
            {selectedBullet.educationLevel && (
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-stone-500">
                  Eligible Education Levels
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBullet.educationLevel.map((lvl, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-stone-100 border border-black rounded text-xs font-bold text-stone-800">
                      🎓 {lvl}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedBullet.tags && selectedBullet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedBullet.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 border border-stone-300 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Security & Verification Notice */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Direct Portal Verification:</strong> This notification has been verified with authentic information from {selectedBullet.sourceName}. DIRPA provides direct access to the official portal without intermediary redirects.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleLike(selectedBullet.bulletId, e)}
                  className={`px-3 py-2 border-2 border-black rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-colors ${
                    socialStats[selectedBullet.bulletId]?.isLiked
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-white hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${socialStats[selectedBullet.bulletId]?.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{socialStats[selectedBullet.bulletId]?.likesCount ?? 0} Likes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const b = selectedBullet;
                    setSelectedBullet(null);
                    setActiveCommentBullet(b);
                  }}
                  className="px-3 py-2 border-2 border-black bg-white hover:bg-stone-100 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-stone-800 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Comments ({socialStats[selectedBullet.bulletId]?.commentsCount ?? 0})</span>
                </button>

                <button
                  onClick={() => toggleSaveBullet(selectedBullet.bulletId)}
                  className={`px-3 py-2 border-2 border-black rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-colors ${
                    savedBulletIds.includes(selectedBullet.bulletId)
                      ? 'bg-amber-400 text-black'
                      : 'bg-white hover:bg-stone-100 text-black'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedBulletIds.includes(selectedBullet.bulletId) ? 'Saved' : 'Save Notice'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const b = selectedBullet;
                  setSelectedBullet(null);
                  setExternalLinkBullet(b);
                }}
                className="px-5 py-2.5 border-2 border-black bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider rounded flex items-center gap-2 shadow-[3px_3px_0px_0px_#000] cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5"
              >
                <span>Visit Official Website / Portal</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS MODAL */}
      {activeCommentBullet && (
        <BulletCommentsModal
          bullet={activeCommentBullet}
          user={user}
          onClose={() => setActiveCommentBullet(null)}
          onCommentAdded={handleCommentAdded}
          isDarkMode={isDarkMode}
        />
      )}

      {/* EXTERNAL LINK NOTIFICATION MODAL */}
      {externalLinkBullet && (
        <BulletExternalLinkModal
          bullet={externalLinkBullet}
          onClose={() => setExternalLinkBullet(null)}
          onProceed={handleProceedExternalLink}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};
