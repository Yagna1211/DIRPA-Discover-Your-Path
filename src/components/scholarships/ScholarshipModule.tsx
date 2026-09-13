import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Scholarship, SavedScholarship, UserProfile } from '../../types';
import {
  fetchScholarships,
  createScholarshipInDB,
  updateScholarshipInDB,
  deleteScholarshipFromDB,
  fetchSavedScholarships,
  saveScholarshipToDB,
  unsaveScholarshipFromDB,
  evaluateScholarshipMatch
} from '../../services/scholarshipService';
import { ScholarshipCard } from './ScholarshipCard';
import { ScholarshipDetailModal } from './ScholarshipDetailModal';
import { ScholarshipAdminModal } from './ScholarshipAdminModal';
import { ScholarshipAIAssistantModal } from './ScholarshipAIAssistantModal';
import { CommunityScholarshipContribution } from './CommunityScholarshipContribution';
import { ScholarshipListSkeleton } from '../SkeletonLayouts';
import {
  Search, Filter, Bookmark, Sparkles, Plus, Award, CheckCircle2,
  Building2, GraduationCap, ArrowLeft, RefreshCw, AlertCircle, Edit3, ShieldAlert,
  X, Check
} from 'lucide-react';
import i18n from '../../i18n/i18n';

interface ScholarshipModuleProps {
  user: UserProfile | null;
  onBackToDashboard: () => void;
  onUpdateUserProfile?: (updatedFields: Partial<UserProfile>) => Promise<void>;
  isDarkMode?: boolean;
}

export const ScholarshipModule: React.FC<ScholarshipModuleProps> = ({
  user,
  onBackToDashboard,
  onUpdateUserProfile,
  isDarkMode = false
}) => {
  const { t } = useTranslation();
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'saved' | 'admin'>('recommended');

  // Scholarship list & saved state
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [savedRecords, setSavedRecords] = useState<SavedScholarship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [filterProviderType, setFilterProviderType] = useState<string>('All');
  const [filterState, setFilterState] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Modal states
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [adminTargetScholarship, setAdminTargetScholarship] = useState<Scholarship | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [aiTargetScholarship, setAiTargetScholarship] = useState<Scholarship | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Inline Profile Editor Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    familyIncome: user?.familyIncome || 180000,
    percentageMarks: user?.percentageMarks || 75,
    category: user?.category || 'General',
    gender: user?.gender || 'Male',
    state: user?.state || 'Andhra Pradesh',
    currentEducationLevel: user?.currentEducationLevel || 'Graduation',
    currentCourse: user?.currentCourse || 'B.Tech'
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Load scholarships & saved list
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchScholarships();
      setScholarships(data);

      if (user?.id) {
        const saved = await fetchSavedScholarships(user.id);
        setSavedRecords(saved);
      }
    } catch (err) {
      console.error('Error loading scholarships:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        familyIncome: user.familyIncome ?? 180000,
        percentageMarks: user.percentageMarks ?? 75,
        category: user.category || 'General',
        gender: user.gender || 'Male',
        state: user.state || 'Andhra Pradesh',
        currentEducationLevel: user.currentEducationLevel || 'Graduation',
        currentCourse: user.currentCourse || 'B.Tech'
      });
    }
  }, [user]);

  // Bookmark Toggle
  const handleToggleSave = async (scholarship: Scholarship) => {
    if (!user?.id) {
      alert('Please sign in to save scholarships.');
      return;
    }

    const isAlreadySaved = savedRecords.some(s => s.scholarshipId === scholarship.scholarshipId);
    try {
      if (isAlreadySaved) {
        await unsaveScholarshipFromDB(user.id, scholarship.scholarshipId);
        setSavedRecords(prev => prev.filter(s => s.scholarshipId !== scholarship.scholarshipId));
      } else {
        const newSaved = await saveScholarshipToDB(user.id, scholarship);
        setSavedRecords(prev => [...prev, newSaved]);
      }
    } catch (err) {
      console.error('Toggle save error:', err);
    }
  };

  // Admin Save handler
  const handleAdminSave = async (updatedScholarship: Scholarship) => {
    const existingIndex = scholarships.findIndex(s => s.scholarshipId === updatedScholarship.scholarshipId);
    if (existingIndex >= 0) {
      await updateScholarshipInDB(updatedScholarship.scholarshipId, updatedScholarship);
      setScholarships(prev => prev.map(s => s.scholarshipId === updatedScholarship.scholarshipId ? updatedScholarship : s));
    } else {
      await createScholarshipInDB(updatedScholarship);
      setScholarships(prev => [updatedScholarship, ...prev]);
    }
  };

  // Admin Delete handler
  const handleAdminDelete = async (scholarshipId: string) => {
    await deleteScholarshipFromDB(scholarshipId);
    setScholarships(prev => prev.filter(s => s.scholarshipId !== scholarshipId));
  };

  // Save Profile Handler
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      if (onUpdateUserProfile) {
        await onUpdateUserProfile(profileForm);
      }
      if (user) {
        user.familyIncome = profileForm.familyIncome;
        user.percentageMarks = profileForm.percentageMarks;
        user.category = profileForm.category as any;
        user.gender = profileForm.gender as any;
        user.state = profileForm.state;
        user.currentEducationLevel = profileForm.currentEducationLevel as any;
        user.currentCourse = profileForm.currentCourse;
      }
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Filter & Search Logic
  const filteredScholarships = useMemo(() => {
    return scholarships.filter(scholarship => {
      // 1. Search Query (Name, Provider, Course, State, Keywords)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = scholarship.scholarshipName.toLowerCase().includes(q);
        const matchesProvider = scholarship.provider.toLowerCase().includes(q);
        const matchesDesc = scholarship.description.toLowerCase().includes(q);
        const matchesCourses = scholarship.eligibleCourses.some(c => c.toLowerCase().includes(q));
        const matchesStates = scholarship.eligibleStates.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesProvider && !matchesDesc && !matchesCourses && !matchesStates) {
          return false;
        }
      }

      // 2. Education Level
      if (filterLevel !== 'All') {
        if (scholarship.educationLevel !== 'All' && scholarship.educationLevel !== filterLevel) {
          return false;
        }
      }

      // 3. Provider Type
      if (filterProviderType !== 'All') {
        if (scholarship.providerType !== filterProviderType) {
          return false;
        }
      }

      // 4. State
      if (filterState !== 'All') {
        const isAllIndia = scholarship.eligibleStates.some(s => s.toLowerCase().includes('all'));
        const matchesState = scholarship.eligibleStates.some(s => s.toLowerCase() === filterState.toLowerCase());
        if (!isAllIndia && !matchesState) {
          return false;
        }
      }

      // 5. Category
      if (filterCategory !== 'All') {
        if (scholarship.category !== 'All' && scholarship.category !== filterCategory) {
          return false;
        }
      }

      // 6. Gender
      if (filterGender !== 'All') {
        if (scholarship.gender !== 'All' && scholarship.gender !== filterGender) {
          return false;
        }
      }

      // 7. Status
      if (filterStatus === 'Open') {
        if (scholarship.status !== 'Open') return false;
      } else if (filterStatus === 'Closing Soon') {
        if (scholarship.status !== 'Open') return false;
        if (scholarship.applicationEndDate) {
          const deadline = new Date(scholarship.applicationEndDate).getTime();
          const now = new Date().getTime();
          const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
          if (daysLeft < 0 || daysLeft > 15) return false;
        } else {
          return false;
        }
      }

      return true;
    });
  }, [scholarships, searchQuery, filterLevel, filterProviderType, filterState, filterCategory, filterGender, filterStatus]);

  // Recommended Scholarships List (Sorted by match score)
  const recommendedScholarships = useMemo(() => {
    return filteredScholarships
      .map(s => {
        const match = evaluateScholarshipMatch(user, s);
        return { scholarship: s, match };
      })
      .filter(item => item.match.isEligible && item.match.matchScore >= 50)
      .sort((a, b) => b.match.matchScore - a.match.matchScore)
      .map(item => item.scholarship);
  }, [filteredScholarships, user]);

  // Saved Scholarships List
  const savedScholarshipsList = useMemo(() => {
    const savedIds = new Set(savedRecords.map(s => s.scholarshipId));
    return scholarships.filter(s => savedIds.has(s.scholarshipId));
  }, [scholarships, savedRecords]);

  // Check if student profile is complete for recommendations
  const isProfileComplete = Boolean(
    user &&
    user.familyIncome !== undefined &&
    user.percentageMarks !== undefined &&
    user.category &&
    user.state
  );

  return (
    <div className={`min-h-screen p-4 md:p-8 text-left transition-colors duration-200 ${
      isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-stone-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP BAR / BREADCRUMB */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-2 bg-white border-2 border-black hover:bg-stone-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <div>
            <h1 className="text-2xl md:text-4xl font-display font-black uppercase text-stone-900 tracking-tight mt-1">
                {t('scholarships.title', 'Scholarships')}
              </h1>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-3 bg-white border-2 border-black p-2.5 px-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center">
              <span className="block text-[10px] font-mono font-bold uppercase text-stone-500">{t('common.all', 'All')}</span>
              <span className="text-lg font-display font-black text-stone-900">{scholarships.length}</span>
            </div>
            <div className="h-8 border-r-2 border-dashed border-stone-300"></div>
            <div className="text-center">
              <span className="block text-[10px] font-mono font-bold uppercase text-stone-500">{t('scholarships.matchScore', 'Match Score')}</span>
              <span className="text-lg font-display font-black text-emerald-700">{recommendedScholarships.length}</span>
            </div>
            <div className="h-8 border-r-2 border-dashed border-stone-300"></div>
            <div className="text-center">
              <span className="block text-[10px] font-mono font-bold uppercase text-stone-500">{t('scholarships.savedTab', 'Saved Scholarships')}</span>
              <span className="text-lg font-display font-black text-amber-800">{savedRecords.length}</span>
            </div>
          </div>
        </div>

        {/* STUDENT PROFILE WARNING / UPDATE BANNER */}
        {!isProfileComplete && (
          <div className="bg-amber-100 border-2 border-black p-4 md:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-display font-black uppercase text-amber-900">
                  {t('scholarships.profileFilterTitle', 'Your Profile Eligibility Parameters')}
                </h3>
                <p className="text-xs text-amber-950 font-medium mt-1 leading-relaxed">
                  State ({user?.state || 'Not set'}), Income ({user?.familyIncome ? `₹${user.familyIncome.toLocaleString('en-IN')}` : 'Not set'}), Marks ({user?.percentageMarks ? `${user.percentageMarks}%` : 'Not set'}).
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-bold uppercase text-xs tracking-wider flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> {t('scholarships.editProfile', 'Edit Profile Filters')}
            </button>
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-300 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'recommended'
                  ? 'bg-amber-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>{t('scholarships.recommendedTab', 'For Me')} ({recommendedScholarships.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span>{t('scholarships.allTab', '📚 All Scholarships')} ({filteredScholarships.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-amber-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-800" />
              <span>{t('scholarships.savedTab', '🔖 Saved Scholarships')} ({savedScholarshipsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-900 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('scholarships.adminTab', '⚙️ Manage Database')}</span>
            </button>
          </div>

          <button
            onClick={() => { setAiTargetScholarship(null); setIsAiModalOpen(true); }}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border-2 border-black hover:bg-purple-200 transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>{t('scholarships.askAiGuidance', '✨ Ask Scholarship AI')}</span>
          </button>
        </div>

        {/* SEARCH & FILTERS PANEL (For Recommended & All tabs) */}
        {activeTab !== 'admin' && (
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search scholarships by Name, Provider (e.g. NSP, AICTE), Course, State, or Keywords..."
                className="w-full pl-11 pr-4 py-3 border-2 border-black text-xs font-bold placeholder:text-stone-400 focus:outline-none focus:bg-amber-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-stone-100 hover:bg-stone-200 border border-black text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {/* Education Level */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1">
                  Education Level
                </label>
                <select
                  value={filterLevel}
                  onChange={e => setFilterLevel(e.target.value)}
                  className="w-full p-2 border-2 border-black text-xs font-bold bg-stone-50"
                >
                  <option value="All">All Levels</option>
                  <option value="10th">10th Class</option>
                  <option value="Intermediate">Intermediate / 12th</option>
                  <option value="Polytechnic">Polytechnic</option>
                  <option value="ITI">ITI</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                </select>
              </div>

              {/* Provider Type */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1">
                  Provider Type
                </label>
                <select
                  value={filterProviderType}
                  onChange={e => setFilterProviderType(e.target.value)}
                  className="w-full p-2 border-2 border-black text-xs font-bold bg-stone-50"
                >
                  <option value="All">All Providers</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="NGO">NGO</option>
                  <option value="University">University</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1">
                  State Domicile
                </label>
                <select
                  value={filterState}
                  onChange={e => setFilterState(e.target.value)}
                  className="w-full p-2 border-2 border-black text-xs font-bold bg-stone-50"
                >
                  <option value="All">All States / All India</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1">
                  Social Category
                </label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full p-2 border-2 border-black text-xs font-bold bg-stone-50"
                >
                  <option value="All">All Categories</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="Minority">Minority</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1">
                  Gender Eligibility
                </label>
                <select
                  value={filterGender}
                  onChange={e => setFilterGender(e.target.value)}
                  className="w-full p-2 border-2 border-black text-xs font-bold bg-stone-50"
                >
                  <option value="All">All Genders</option>
                  <option value="Female">Female Only</option>
                  <option value="Male">Male Only</option>
                </select>
              </div>

              {/* Application Status */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1">
                  Application Status
                </label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full p-2 border-2 border-black text-xs font-bold bg-stone-50"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open Applications</option>
                  <option value="Closing Soon">Closing Soon (15 days)</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || filterLevel !== 'All' || filterProviderType !== 'All' || filterState !== 'All' || filterCategory !== 'All' || filterGender !== 'All' || filterStatus !== 'All') && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterLevel('All');
                    setFilterProviderType('All');
                    setFilterState('All');
                    setFilterCategory('All');
                    setFilterGender('All');
                    setFilterStatus('All');
                  }}
                  className="text-[11px] font-mono font-bold uppercase text-red-700 underline hover:text-red-900"
                >
                  Clear All Search & Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* MAIN CONTENT AREA BY TAB */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border-2 border-black text-xs font-mono font-bold text-amber-900 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>// SYNCHRONIZING VERIFIED SCHOLARSHIP DATABASE & ELIGIBILITY METRICS...</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            <ScholarshipListSkeleton />
          </div>
        ) : (
          <div>
            {/* 1. RECOMMENDED TAB */}
            {activeTab === 'recommended' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border-2 border-black p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <h3 className="text-sm font-display font-black uppercase text-emerald-900">
                        Recommendations For Your Profile
                      </h3>
                      <p className="text-xs text-emerald-800 font-medium">
                        Showing scholarships matching your level ({user?.currentEducationLevel || 'Graduation'}), state ({user?.state || 'Andhra Pradesh'}), category ({user?.category || 'General'}), income (₹{user?.familyIncome?.toLocaleString('en-IN') || '1,80,000'}), and marks ({user?.percentageMarks || 75}%).
                      </p>
                    </div>
                  </div>
                </div>

                {recommendedScholarships.length === 0 ? (
                  <div className="bg-white border-2 border-black p-10 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Award className="w-12 h-12 text-amber-600 mx-auto mb-3 opacity-40" />
                    <h3 className="text-xl font-display font-black uppercase text-stone-900">
                      No Exact Match Under Current Filters
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-2 max-w-md mx-auto">
                      Try adjusting search terms or view the "All Scholarships" tab to explore all government and university opportunities.
                    </p>
                    <button
                      onClick={() => setActiveTab('all')}
                      className="mt-4 px-5 py-2 bg-amber-300 text-black border-2 border-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Browse All Scholarships
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedScholarships.map(scholarship => (
                      <ScholarshipCard
                        key={scholarship.scholarshipId}
                        scholarship={scholarship}
                        studentProfile={user}
                        isSaved={savedRecords.some(s => s.scholarshipId === scholarship.scholarshipId)}
                        onViewDetails={s => { setSelectedScholarship(s); setIsDetailModalOpen(true); }}
                        onToggleSave={handleToggleSave}
                        onAskAI={s => { setAiTargetScholarship(s); setIsAiModalOpen(true); }}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ALL SCHOLARSHIPS TAB */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-stone-500">
                  <span>Showing {filteredScholarships.length} scholarships from official database</span>
                </div>

                {filteredScholarships.length === 0 ? (
                  <div className="bg-white border-2 border-black p-10 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Search className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                    <h3 className="text-lg font-display font-black uppercase text-stone-900">
                      No Scholarships Found Matching Search
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      Try clearing search terms or selecting "All States" / "All Levels".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScholarships.map(scholarship => (
                      <ScholarshipCard
                        key={scholarship.scholarshipId}
                        scholarship={scholarship}
                        studentProfile={user}
                        isSaved={savedRecords.some(s => s.scholarshipId === scholarship.scholarshipId)}
                        onViewDetails={s => { setSelectedScholarship(s); setIsDetailModalOpen(true); }}
                        onToggleSave={handleToggleSave}
                        onAskAI={s => { setAiTargetScholarship(s); setIsAiModalOpen(true); }}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SAVED SCHOLARSHIPS TAB */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="bg-amber-50 border-2 border-black p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-amber-800 shrink-0 fill-amber-300" />
                    <div>
                      <h3 className="text-sm font-display font-black uppercase text-stone-900">
                        Bookmarked Scholarships ({savedScholarshipsList.length})
                      </h3>
                      <p className="text-xs text-stone-600 font-medium">
                        Quickly access and track deadlines for scholarships saved to your student account.
                      </p>
                    </div>
                  </div>
                </div>

                {savedScholarshipsList.length === 0 ? (
                  <div className="bg-white border-2 border-black p-10 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-lg font-display font-black uppercase text-stone-900">
                      You Haven't Saved Any Scholarships Yet
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      Click the bookmark icon on any scholarship card to save it for quick reference later.
                    </p>
                    <button
                      onClick={() => setActiveTab('recommended')}
                      className="mt-4 px-5 py-2 bg-amber-300 text-black border-2 border-black font-bold uppercase text-xs"
                    >
                      Explore Recommended Scholarships
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedScholarshipsList.map(scholarship => (
                      <ScholarshipCard
                        key={scholarship.scholarshipId}
                        scholarship={scholarship}
                        studentProfile={user}
                        isSaved={true}
                        onViewDetails={s => { setSelectedScholarship(s); setIsDetailModalOpen(true); }}
                        onToggleSave={handleToggleSave}
                        onAskAI={s => { setAiTargetScholarship(s); setIsAiModalOpen(true); }}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. ADMIN MANAGEMENT TAB */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <div className="bg-purple-900 text-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-200 tracking-wider">
                      ADMINISTRATION MANAGEMENT PORTAL
                    </span>
                    <h2 className="text-xl font-display font-black uppercase tracking-tight text-white mt-0.5">
                      Scholarship Directory Control
                    </h2>
                    
                  </div>

                  <button
                    onClick={() => { setAdminTargetScholarship(null); setIsAdminModalOpen(true); }}
                    className="px-5 py-2.5 bg-amber-300 text-black border-2 border-black hover:bg-amber-400 font-bold uppercase text-xs flex items-center gap-2 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Plus className="w-4 h-4" /> Add New Scholarship
                  </button>
                </div>

                {/* Admin Scholarships Table */}
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-100 border-b-2 border-black text-[10px] font-mono font-black uppercase text-stone-700">
                        <th className="p-3 border-r border-stone-300">Scholarship Name</th>
                        <th className="p-3 border-r border-stone-300">Provider & Type</th>
                        <th className="p-3 border-r border-stone-300">Award Amount</th>
                        <th className="p-3 border-r border-stone-300">Level & State</th>
                        <th className="p-3 border-r border-stone-300">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-xs">
                      {scholarships.map(s => (
                        <tr key={s.scholarshipId} className="hover:bg-amber-50/50 font-medium">
                          <td className="p-3 border-r border-stone-200 font-bold text-stone-900 max-w-xs">
                            <div>{s.scholarshipName}</div>
                            {s.contributedBy && (
                              <div className="mt-1 flex items-center gap-1 text-[9px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 w-fit">
                                <span>🤝 Contributed by: {s.contributedBy}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-3 border-r border-stone-200 text-stone-700">
                            <div>{s.provider}</div>
                            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-stone-100 border border-stone-300">
                              {s.providerType}
                            </span>
                          </td>
                          <td className="p-3 border-r border-stone-200 font-bold text-amber-900">
                            {s.scholarshipAmount}
                          </td>
                          <td className="p-3 border-r border-stone-200 text-stone-600 font-mono text-[11px]">
                            {s.educationLevel} | {s.eligibleStates.join(', ')}
                          </td>
                          <td className="p-3 border-r border-stone-200">
                            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                              s.status === 'Open' ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-red-100 text-red-900 border-red-300'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="p-3 flex items-center gap-2">
                            <button
                              onClick={() => { setAdminTargetScholarship(s); setIsAdminModalOpen(true); }}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-black text-[10px] font-bold uppercase"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleAdminDelete(s.scholarshipId)}
                              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 border border-red-400 text-[10px] font-bold uppercase"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Community Sourced Scholarships Contribution Section */}
                <CommunityScholarshipContribution
                  currentUser={user}
                  onScholarshipAdded={handleAdminSave}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
          </div>
        )}

      </div>

      {/* ALL MODALS */}
      {/* 1. Detail Modal */}
      {isDetailModalOpen && selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          studentProfile={user}
          isSaved={savedRecords.some(s => s.scholarshipId === selectedScholarship.scholarshipId)}
          onClose={() => setIsDetailModalOpen(false)}
          onToggleSave={handleToggleSave}
          onAskAI={s => { setAiTargetScholarship(s); setIsAiModalOpen(true); }}
        />
      )}

      {/* 2. Admin Form Modal */}
      {isAdminModalOpen && (
        <ScholarshipAdminModal
          scholarship={adminTargetScholarship}
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onSave={handleAdminSave}
          onDelete={handleAdminDelete}
        />
      )}

      {/* 3. AI Assistant Guidance Modal */}
      {isAiModalOpen && (
        <ScholarshipAIAssistantModal
          scholarship={aiTargetScholarship}
          allScholarships={scholarships}
          studentProfile={user}
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      {/* 4. Inline Student Profile Completion Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black text-stone-900 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative text-left">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-stone-100 hover:bg-stone-200 border-2 border-black cursor-pointer"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <h3 className="text-xl font-display font-black uppercase text-stone-900 mb-1">
              Student Profile Details
            </h3>
            <p className="text-xs text-stone-600 font-medium mb-4">
              Enter your economic and academic parameters to receive 100% accurate scholarship recommendation match scores.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                  Family Annual Income (₹)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={profileForm.familyIncome === 0 ? '' : profileForm.familyIncome}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setProfileForm({ ...profileForm, familyIncome: raw === '' ? 0 : parseInt(raw, 10) });
                  }}
                  className="w-full p-2 border-2 border-black text-xs font-bold"
                  placeholder="e.g. 180000"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                  Percentage Marks (%)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={profileForm.percentageMarks === 0 ? '' : profileForm.percentageMarks}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9.]/g, '');
                    const parsed = parseFloat(raw);
                    setProfileForm({ ...profileForm, percentageMarks: isNaN(parsed) ? 0 : parsed });
                  }}
                  className="w-full p-2 border-2 border-black text-xs font-bold"
                  placeholder="e.g. 82"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                    State Domicile
                  </label>
                  <select
                    value={profileForm.state}
                    onChange={e => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
                  >
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                    Social Category
                  </label>
                  <select
                    value={profileForm.category}
                    onChange={e => setProfileForm({ ...profileForm, category: e.target.value as any })}
                    className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                    <option value="Minority">Minority</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                    Education Level
                  </label>
                  <select
                    value={profileForm.currentEducationLevel}
                    onChange={e => setProfileForm({ ...profileForm, currentEducationLevel: e.target.value as any })}
                    className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
                  >
                    <option value="10th">10th</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Polytechnic">Polytechnic</option>
                    <option value="ITI">ITI</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Post Graduation">Post Graduation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={profileForm.gender}
                    onChange={e => setProfileForm({ ...profileForm, gender: e.target.value as any })}
                    className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-stone-300 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border-2 border-black font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="px-5 py-2 bg-amber-300 hover:bg-amber-400 border-2 border-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile Parameters'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
