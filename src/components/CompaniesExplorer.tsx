import React, { useState, useMemo } from 'react';
import { 
  Search, Building2, ExternalLink, MessageSquare, Star, 
  Sparkles, CheckCircle2, ChevronRight, Briefcase, 
  GraduationCap, DollarSign, Award, MapPin, Users, 
  Calendar, Globe, ShieldCheck, Heart, ThumbsUp, 
  Send, Plus, Filter, ArrowUpRight, BookOpen, Layers, X, Info
} from 'lucide-react';
import { UserProfile, Company, CompanyRole, CompanyFeedback } from '../types';
import { COMPANIES_DATA } from '../data/companiesData';
import { CompanyLogo } from './CompanyLogo';

interface CompaniesExplorerProps {
  user: UserProfile | null;
  onStartChat?: (alumni: any) => void;
  onBackToHome?: () => void;
  isDarkMode?: boolean;
}

export const CompaniesExplorer: React.FC<CompaniesExplorerProps> = ({
  user,
  onStartChat,
  onBackToHome,
  isDarkMode = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(COMPANIES_DATA[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'feedback'>('overview');
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<CompanyRole | null>(null);

  // Saved companies state
  const [savedCompanyIds, setSavedCompanyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dirpa_saved_companies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  // Dynamic feedback state per company (combining default + user submitted)
  const [customFeedbacks, setCustomFeedbacks] = useState<Record<string, CompanyFeedback[]>>(() => {
    try {
      const stored = localStorage.getItem('dirpa_custom_company_feedbacks');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Feedback form state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackAuthorName, setFeedbackAuthorName] = useState(user?.name || '');
  const [feedbackAuthorRole, setFeedbackAuthorRole] = useState(user?.careerGoal ? `${user.careerGoal} @ Candidate` : '');
  const [feedbackCollege, setFeedbackCollege] = useState(user?.currentCourse ? `${user.currentCourse}` : '');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackWlbRating, setFeedbackWlbRating] = useState<number>(5);
  const [feedbackGrowthRating, setFeedbackGrowthRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackInterviewExp, setFeedbackInterviewExp] = useState('');
  const [feedbackFresherAdvice, setFeedbackFresherAdvice] = useState('');
  const [feedbackSubmittedSuccess, setFeedbackSubmittedSuccess] = useState(false);

  // Liked feedbacks tracking
  const [likedFeedbackIds, setLikedFeedbackIds] = useState<Record<string, boolean>>({});

  const industries = [
    'All',
    'Tech & Product',
    'IT Services & Consulting',
    'Automotive & Core Engineering',
    'Aerospace & Defence / PSU',
    'Finance & Fintech',
    'Healthcare & Pharma'
  ];

  const streamFilters = [
    { label: 'All Streams', value: 'All' },
    { label: 'B.Tech CSE / IT', value: 'CSE' },
    { label: 'Core (Mech / Civil / EEE / ECE)', value: 'Core' },
    { label: 'Polytechnic Diploma', value: 'Diploma' },
    { label: 'Degree / BCA / Commerce', value: 'Degree' },
    { label: 'Pharmacy / Biotech', value: 'Pharma' },
    { label: 'PSU & Govt Exam', value: 'Govt' }
  ];

  const toggleSaveCompany = (companyId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedCompanyIds(prev => {
      const updated = prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId];
      try {
        localStorage.setItem('dirpa_saved_companies', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving company', err);
      }
      return updated;
    });
  };

  const handleLikeFeedback = (feedbackId: string) => {
    setLikedFeedbackIds(prev => ({
      ...prev,
      [feedbackId]: !prev[feedbackId]
    }));
  };

  // Filtered companies list
  const filteredCompanies = useMemo(() => {
    return COMPANIES_DATA.filter(company => {
      // Saved filter
      if (showOnlySaved && !savedCompanyIds.includes(company.id)) {
        return false;
      }

      // Industry filter
      if (selectedIndustry !== 'All' && company.industry !== selectedIndustry) {
        return false;
      }

      // Stream filter
      if (selectedStream !== 'All') {
        const matchesStream = company.roles.some(role => {
          const joinedEligibility = role.targetEligibility.join(' ').toLowerCase();
          if (selectedStream === 'CSE') {
            return joinedEligibility.includes('cse') || joinedEligibility.includes('cs') || joinedEligibility.includes('it') || joinedEligibility.includes('computer');
          }
          if (selectedStream === 'Core') {
            return joinedEligibility.includes('mech') || joinedEligibility.includes('civil') || joinedEligibility.includes('eee') || joinedEligibility.includes('ece') || joinedEligibility.includes('electrical') || joinedEligibility.includes('electronics');
          }
          if (selectedStream === 'Diploma') {
            return joinedEligibility.includes('diploma') || joinedEligibility.includes('polytechnic') || company.hiringOverview.acceptedStreams.some(s => s.toLowerCase().includes('diploma') || s.toLowerCase().includes('polytechnic'));
          }
          if (selectedStream === 'Degree') {
            return joinedEligibility.includes('bca') || joinedEligibility.includes('bsc') || joinedEligibility.includes('b.com') || joinedEligibility.includes('bba');
          }
          if (selectedStream === 'Pharma') {
            return joinedEligibility.includes('pharm') || joinedEligibility.includes('biotech') || joinedEligibility.includes('chemistry');
          }
          if (selectedStream === 'Govt') {
            return company.companyType.toLowerCase().includes('gov') || company.companyType.toLowerCase().includes('psu') || company.industry.toLowerCase().includes('psu');
          }
          return true;
        });
        if (!matchesStream) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = company.name.toLowerCase().includes(q);
        const inTagline = company.tagline.toLowerCase().includes(q);
        const inDesc = company.description.toLowerCase().includes(q);
        const inIndustry = company.industry.toLowerCase().includes(q);
        const inHq = company.headquarters.toLowerCase().includes(q);
        const inRoles = company.roles.some(r => 
          r.title.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
          r.targetEligibility.some(e => e.toLowerCase().includes(q))
        );
        const inFeedback = company.alumniFeedbacks.some(f => 
          f.feedbackText.toLowerCase().includes(q) ||
          f.authorRole.toLowerCase().includes(q) ||
          f.adviceForFreshers?.toLowerCase().includes(q)
        );
        return inName || inTagline || inDesc || inIndustry || inHq || inRoles || inFeedback;
      }

      return true;
    });
  }, [searchQuery, selectedIndustry, selectedStream, showOnlySaved, savedCompanyIds]);

  // Active selected company
  const activeCompany = useMemo(() => {
    const found = COMPANIES_DATA.find(c => c.id === selectedCompanyId);
    return found || filteredCompanies[0] || COMPANIES_DATA[0];
  }, [selectedCompanyId, filteredCompanies]);

  // Combined feedback for active company
  const allFeedbacksForActive = useMemo(() => {
    if (!activeCompany) return [];
    const defaults = activeCompany.alumniFeedbacks || [];
    const custom = customFeedbacks[activeCompany.id] || [];
    return [...custom, ...defaults];
  }, [activeCompany, customFeedbacks]);

  // Submit feedback handler
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany || !feedbackText.trim()) return;

    const newFeedback: CompanyFeedback = {
      id: `custom-fb-${Date.now()}`,
      userId: user?.id || 'guest-user',
      authorName: feedbackAuthorName.trim() || 'Anonymous Contributor',
      authorRole: feedbackAuthorRole.trim() || 'Associate Engineer',
      collegeOrBatch: feedbackCollege.trim() || 'Alumni Contributor',
      rating: feedbackRating,
      workLifeBalanceRating: feedbackWlbRating,
      careerGrowthRating: feedbackGrowthRating,
      feedbackText: feedbackText.trim(),
      interviewExperience: feedbackInterviewExp.trim() || undefined,
      adviceForFreshers: feedbackFresherAdvice.trim() || undefined,
      likes: 1,
      timestamp: 'Just now',
      isVerifiedAlumni: true
    };

    const updated = {
      ...customFeedbacks,
      [activeCompany.id]: [newFeedback, ...(customFeedbacks[activeCompany.id] || [])]
    };

    setCustomFeedbacks(updated);
    try {
      localStorage.setItem('dirpa_custom_company_feedbacks', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to store feedback in localStorage', err);
    }

    setFeedbackSubmittedSuccess(true);
    setTimeout(() => {
      setFeedbackSubmittedSuccess(false);
      setShowFeedbackModal(false);
      setFeedbackText('');
      setFeedbackInterviewExp('');
      setFeedbackFresherAdvice('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* TOP CONTROLS & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {onBackToHome && (
          <button 
            onClick={onBackToHome}
            className="self-start px-3.5 py-2 border-2 border-black text-xs font-black uppercase bg-white hover:bg-stone-50 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1.5 cursor-pointer text-black"
            id="back-to-home-companies"
          >
            ← Back to Home
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowOnlySaved(!showOnlySaved)}
            className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none ${
              showOnlySaved 
                ? 'bg-rose-500 text-white' 
                : 'bg-white text-black hover:bg-yellow-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlySaved ? 'fill-white' : 'text-rose-500'}`} />
            <span>Saved Companies ({savedCompanyIds.length})</span>
          </button>

          <span className="text-xs font-mono font-bold px-2.5 py-1 border-2 border-black bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            🏢 {filteredCompanies.length} Verified Companies
          </span>
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl pointer-events-none select-none">
          🏢
        </div>

        <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-black bg-indigo-100 text-indigo-950 text-[10px] font-black uppercase tracking-widest mb-3 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>DIRPA Corporate & Hiring Intelligence</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black flex items-center gap-2.5">
          <span>Company Directory & Career Pathways</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-3xl mt-2 leading-relaxed">
          Search top hiring tech giants, core engineering leaders, IT services conglomerates, and PSUs. 
          Inspect hiring processes, fresher packages, department roles, eligibility criteria, and verified alumni employee reviews.
        </p>

        {/* SEARCH BAR */}
        <div className="mt-6 space-y-3">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-3.5 text-stone-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name, roles (e.g. SDE, GET, Cloud), skills (Python, CAD, VLSI), or eligibility..."
              className="w-full pl-11 pr-10 py-3 border-2 border-black bg-stone-50 text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-yellow-50 focus:border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors placeholder:text-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-stone-500 hover:text-black font-bold text-sm"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* QUICK SEARCH CHIPS */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-black uppercase text-stone-500 mr-1">Trending:</span>
            {['Google', 'Microsoft', 'TCS', 'Infosys', 'Tata Motors', 'L&T', 'ISRO', 'Deloitte', 'Qualcomm', 'Reliance Jio', 'Dr. Reddy\'s'].map(name => (
              <button
                key={name}
                onClick={() => {
                  setSearchQuery(name);
                  const matching = COMPANIES_DATA.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
                  if (matching) setSelectedCompanyId(matching.id);
                }}
                className={`text-[10px] font-bold px-2 py-0.5 border border-black transition-all ${
                  searchQuery.toLowerCase() === name.toLowerCase()
                    ? 'bg-black text-yellow-300'
                    : 'bg-white text-stone-800 hover:bg-yellow-100'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER TABS & STREAM PILLS */}
      <div className="space-y-3">
        {/* Industry Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-black uppercase text-black shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-black" />
            <span>Sector:</span>
          </span>
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase whitespace-nowrap transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer ${
                selectedIndustry === ind
                  ? 'bg-black text-yellow-300'
                  : 'bg-white text-black hover:bg-yellow-50'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Academic Stream Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-black uppercase text-black shrink-0 flex items-center gap-1 mr-1">
            <GraduationCap className="w-3.5 h-3.5 text-black" />
            <span>Target Stream:</span>
          </span>
          {streamFilters.map(stream => (
            <button
              key={stream.value}
              onClick={() => setSelectedStream(stream.value)}
              className={`px-2.5 py-1 border border-black text-[11px] font-bold uppercase whitespace-nowrap transition-all ${
                selectedStream === stream.value
                  ? 'bg-blue-600 text-white font-black'
                  : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
              }`}
            >
              {stream.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: COMPANY SELECTION LIST (LEFT) & DETAILED COMPANY DOSSIER (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: COMPANY CARDS LIST */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-stone-700">
              {filteredCompanies.length} {filteredCompanies.length === 1 ? 'Company' : 'Companies'} Available
            </span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[10px] font-black text-blue-700 underline uppercase"
              >
                Reset Search
              </button>
            )}
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="border-2 border-dashed border-black p-8 bg-stone-50 text-center space-y-3">
              <div className="text-3xl">🔍</div>
              <h3 className="text-sm font-black uppercase text-black">No Companies Matched</h3>
              <p className="text-xs text-stone-500">
                Try adjusting your search keywords or switching sector / stream filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndustry('All');
                  setSelectedStream('All');
                  setShowOnlySaved(false);
                }}
                className="px-3 py-1.5 bg-black text-white text-xs font-black uppercase border-2 border-black hover:bg-stone-800"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[850px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredCompanies.map(company => {
                const isSelected = activeCompany?.id === company.id;
                const isSaved = savedCompanyIds.includes(company.id);
                const feedbackCount = (company.alumniFeedbacks?.length || 0) + (customFeedbacks[company.id]?.length || 0);

                return (
                  <div
                    key={company.id}
                    onClick={() => {
                      setSelectedCompanyId(company.id);
                      setSelectedRoleForDetail(null);
                    }}
                    className={`border-2 border-black p-4 transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-yellow-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1'
                        : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    {/* Header with Company Logo & Bookmark */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <CompanyLogo company={company} size="sm" />
                        <div>
                          <h3 className="text-sm font-black uppercase text-black group-hover:text-blue-700 transition-colors line-clamp-1">
                            {company.name}
                          </h3>
                          <span className="text-[10px] font-bold text-stone-600 block">
                            {company.companyType}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleSaveCompany(company.id, e)}
                        className={`p-1.5 border border-black transition-colors ${
                          isSaved ? 'bg-rose-500 text-white' : 'bg-white text-stone-400 hover:text-rose-500 hover:bg-rose-50'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save company'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 italic mb-3">
                      "{company.tagline}"
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                      <span className="px-2 py-0.5 border border-black bg-blue-50 text-blue-900 font-bold">
                        💰 {company.salaryOverview.fresherMedian.split(' ')[0]}
                      </span>
                      <span className="px-2 py-0.5 border border-black bg-emerald-50 text-emerald-900 font-bold">
                        💼 {company.roles.length} Roles
                      </span>
                      <span className="px-2 py-0.5 border border-black bg-purple-50 text-purple-900 font-bold flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-purple-600 text-purple-600" />
                        <span>{feedbackCount} Reviews</span>
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-dashed border-stone-300 flex items-center justify-between text-[11px] font-black uppercase">
                      <span className="text-stone-500 text-[10px]">📍 {company.headquarters.split(',')[0]}</span>
                      <span className="text-blue-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Explore Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILED DOSSIER FOR ACTIVE COMPANY */}
        <div className="lg:col-span-8 space-y-4">
          {activeCompany && (
            <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] p-6 md:p-8 space-y-6">
              
              {/* DOSSIER HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b-2 border-black">
                <div className="flex items-start gap-4">
                  <CompanyLogo company={activeCompany} size="lg" />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                        {activeCompany.name}
                      </h2>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-black bg-black text-yellow-300">
                        {activeCompany.companyType}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium italic">
                      "{activeCompany.tagline}"
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-stone-600 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        <span>{activeCompany.headquarters}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        <span>{activeCompany.employeeCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        <span>Est. {activeCompany.foundedYear}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => toggleSaveCompany(activeCompany.id)}
                    className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all ${
                      savedCompanyIds.includes(activeCompany.id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white text-black hover:bg-rose-50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${savedCompanyIds.includes(activeCompany.id) ? 'fill-white' : 'text-rose-500'}`} />
                    <span>{savedCompanyIds.includes(activeCompany.id) ? 'Saved' : 'Save Company'}</span>
                  </button>

                  <a 
                    href={activeCompany.careersUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 border-2 border-black bg-black text-white text-xs font-black uppercase flex items-center gap-1.5 hover:bg-blue-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                  >
                    <span>Official Careers</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* TABS NAVIGATION */}
              <div className="flex border-b-2 border-black gap-2 overflow-x-auto pb-0">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-t-2 border-x-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'bg-yellow-300 text-black border-b-2 border-b-yellow-300 -mb-[2px] shadow-[0px_-2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-b-2 border-b-black'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Overview & Hiring</span>
                </button>

                <button
                  onClick={() => setActiveTab('roles')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-t-2 border-x-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'roles'
                      ? 'bg-yellow-300 text-black border-b-2 border-b-yellow-300 -mb-[2px] shadow-[0px_-2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-b-2 border-b-black'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Company Roles ({activeCompany.roles.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-t-2 border-x-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'feedback'
                      ? 'bg-yellow-300 text-black border-b-2 border-b-yellow-300 -mb-[2px] shadow-[0px_-2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-b-2 border-b-black'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  <span>Alumni Reviews ({allFeedbacksForActive.length})</span>
                </button>
              </div>

              {/* TAB CONTENT 1: OVERVIEW & HIRING */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Company Description & Culture */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-black p-4 bg-stone-50 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>About Enterprise & Innovation</span>
                      </h4>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {activeCompany.description}
                      </p>
                    </div>

                    <div className="border-2 border-black p-4 bg-yellow-50 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Work Culture & Values</span>
                      </h4>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {activeCompany.aboutCulture}
                      </p>
                    </div>
                  </div>

                  {/* Compensation & Perquisites Box */}
                  <div className="border-2 border-black p-4 bg-emerald-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/20 pb-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-700" />
                        <span>Compensation Matrix & Benefits</span>
                      </h4>
                      <span className="text-xs font-mono font-black text-emerald-900 px-2 py-0.5 bg-emerald-200 border border-black">
                        Fresher Median: {activeCompany.salaryOverview.fresherMedian}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-stone-700 block mb-1">Estimated Band Range:</span>
                        <p className="font-mono text-emerald-900 font-bold">{activeCompany.salaryOverview.range}</p>
                      </div>
                      <div>
                        <span className="font-bold text-stone-700 block mb-1">Key Perquisites & Perks:</span>
                        <ul className="space-y-1">
                          {activeCompany.salaryOverview.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 text-stone-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Hiring Eligibility & Selection Pipeline */}
                  <div className="border-2 border-black p-5 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-black border-b border-black pb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span>Hiring Criteria & Entry Pathways</span>
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-black text-stone-800 uppercase text-[10px] block mb-1">Minimum Academic Benchmark:</span>
                        <p className="text-stone-700 bg-stone-50 p-2.5 border border-black font-medium">{activeCompany.hiringOverview.minimumEligibility}</p>
                      </div>

                      <div>
                        <span className="font-black text-stone-800 uppercase text-[10px] block mb-1.5">Target Streams Accepted:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeCompany.hiringOverview.acceptedStreams.map((stream, idx) => (
                            <span key={idx} className="px-2.5 py-1 border border-black bg-stone-100 text-black text-[11px] font-bold">
                              🎓 {stream}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-black text-stone-800 uppercase text-[10px] block mb-1.5">Standard Selection Stages:</span>
                        <div className="space-y-1.5">
                          {activeCompany.hiringOverview.standardSelectionProcess.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2 border border-black">
                              <span className="w-5 h-5 bg-black text-yellow-300 text-[10px] font-black flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-stone-800 font-medium">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="bg-blue-50 p-3 border border-black">
                          <span className="font-black uppercase text-[10px] text-blue-900 block mb-1">Special Fresher Hiring Drives:</span>
                          <ul className="space-y-1 text-stone-800 font-medium">
                            {activeCompany.hiringOverview.fresherHiringPrograms.map((prog, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-blue-700">•</span>
                                <span>{prog}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-purple-50 p-3 border border-black">
                          <span className="font-black uppercase text-[10px] text-purple-900 block mb-1">Student Internships:</span>
                          <p className="text-stone-800 font-medium">{activeCompany.hiringOverview.internshipOpportunities}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Strategic Highlights */}
                  <div className="border-2 border-black p-4 bg-stone-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="text-xs font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Key Career Takeaways</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeCompany.keyHighlights.map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white p-2.5 border border-black">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-stone-800 font-medium">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: COMPANY ROLES */}
              {activeTab === 'roles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-black">Available Engineering & Corporate Profiles</h3>
                      <p className="text-xs text-stone-500">Explore specific designations, requirements, and hiring packages offered by {activeCompany.name}.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {activeCompany.roles.map(role => (
                      <div 
                        key={role.id}
                        className="border-2 border-black bg-stone-50 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-900 border border-black">
                                {role.department}
                              </span>
                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-stone-200 text-stone-800 border border-black">
                                {role.experienceLevel}
                              </span>
                            </div>
                            <h4 className="text-base font-black uppercase text-black mt-1 flex items-center gap-2">
                              <span>💼 {role.title}</span>
                            </h4>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 border border-black inline-block">
                              {role.packageRange}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-700 font-medium leading-relaxed">
                          {role.description}
                        </p>

                        {/* Eligibility & Skills Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="bg-white p-3 border border-black">
                            <span className="text-[10px] font-black uppercase text-stone-500 block mb-1.5">🎓 Target Educational Eligibility:</span>
                            <div className="flex flex-wrap gap-1">
                              {role.targetEligibility.map((el, i) => (
                                <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-amber-900 border border-black">
                                  {el}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white p-3 border border-black">
                            <span className="text-[10px] font-black uppercase text-stone-500 block mb-1.5">⚡ Core Competencies & Skills:</span>
                            <div className="flex flex-wrap gap-1">
                              {role.requiredSkills.map((sk, i) => (
                                <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-900 border border-black">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Responsibilities */}
                        <div className="bg-white p-3 border border-black space-y-1.5">
                          <span className="text-[10px] font-black uppercase text-stone-500 block">📋 Day-to-Day Responsibilities:</span>
                          <ul className="space-y-1 text-xs text-stone-800">
                            {role.keyResponsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Hiring Stages for this Role */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                          <span className="font-black uppercase text-stone-600 text-[10px]">Assessment Pipeline:</span>
                          {role.hiringStages.map((stage, i) => (
                            <span key={i} className="px-2 py-0.5 bg-stone-200 text-black border border-black font-mono text-[10px]">
                              {i + 1}. {stage}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: ALUMNI FEEDBACK & REVIEWS */}
              {activeTab === 'feedback' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
                    <div>
                      <h3 className="text-sm font-black uppercase text-black">Alumni & Employee Experience Reviews</h3>
                      <p className="text-xs text-stone-500">Real feedback, work-life balance insights, and fresher preparation tips from graduates working at {activeCompany.name}.</p>
                    </div>

                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="px-3.5 py-2 border-2 border-black bg-yellow-300 text-black text-xs font-black uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Write Alumni Review</span>
                    </button>
                  </div>

                  {/* FEEDBACK CARDS LIST */}
                  <div className="space-y-4">
                    {allFeedbacksForActive.length === 0 ? (
                      <div className="border-2 border-dashed border-black p-8 bg-stone-50 text-center space-y-2">
                        <div className="text-2xl">📝</div>
                        <h4 className="text-sm font-black uppercase text-black">No Reviews Yet</h4>
                        <p className="text-xs text-stone-500">Be the first to share your interview experience or company feedback!</p>
                        <button
                          onClick={() => setShowFeedbackModal(true)}
                          className="px-3 py-1.5 bg-black text-white text-xs font-black uppercase border-2 border-black hover:bg-stone-800"
                        >
                          Add Feedback Now
                        </button>
                      </div>
                    ) : (
                      allFeedbacksForActive.map(fb => {
                        const isLiked = likedFeedbackIds[fb.id];
                        const totalLikes = (fb.likes || 0) + (isLiked ? 1 : 0);

                        return (
                          <div 
                            key={fb.id}
                            className="border-2 border-black bg-stone-50 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 relative"
                          >
                            {/* Author & Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black pb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 border-2 border-black bg-yellow-200 text-black font-black flex items-center justify-center text-sm uppercase shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                  {fb.authorName.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-black uppercase text-black">{fb.authorName}</h4>
                                    {fb.isVerifiedAlumni && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-black">
                                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                        <span>Verified</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-stone-600 font-bold">{fb.authorRole} • <span className="font-normal text-stone-500">{fb.collegeOrBatch}</span></p>
                                </div>
                              </div>

                              {/* Star Ratings */}
                              <div className="flex items-center gap-1 bg-white px-2.5 py-1 border border-black">
                                <div className="flex items-center text-amber-500">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-mono font-black ml-1 text-black">{fb.rating}.0</span>
                              </div>
                            </div>

                            {/* Ratings Sub-scores if present */}
                            {(fb.workLifeBalanceRating || fb.careerGrowthRating) && (
                              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                                {fb.workLifeBalanceRating && (
                                  <span className="px-2 py-0.5 border border-black bg-blue-50 text-blue-900 font-bold">
                                    ⚖️ Work-Life Balance: {fb.workLifeBalanceRating}/5
                                  </span>
                                )}
                                {fb.careerGrowthRating && (
                                  <span className="px-2 py-0.5 border border-black bg-emerald-50 text-emerald-900 font-bold">
                                    🚀 Career Growth: {fb.careerGrowthRating}/5
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Main Review Text */}
                            <p className="text-xs text-stone-800 leading-relaxed font-medium">
                              "{fb.feedbackText}"
                            </p>

                            {/* Interview Insights & Fresher Advice */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              {fb.interviewExperience && (
                                <div className="bg-yellow-50/80 p-3 border border-black space-y-1">
                                  <span className="text-[10px] font-black uppercase text-amber-900 flex items-center gap-1">
                                    <span>🎯 Interview Experience & Round Topics:</span>
                                  </span>
                                  <p className="text-xs text-stone-700">{fb.interviewExperience}</p>
                                </div>
                              )}

                              {fb.adviceForFreshers && (
                                <div className="bg-indigo-50/80 p-3 border border-black space-y-1">
                                  <span className="text-[10px] font-black uppercase text-indigo-900 flex items-center gap-1">
                                    <span>💡 Direct Advice for Freshers:</span>
                                  </span>
                                  <p className="text-xs text-stone-700">{fb.adviceForFreshers}</p>
                                </div>
                              )}
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-300 text-xs">
                              <span className="text-[10px] font-mono text-stone-400">{fb.timestamp}</span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleLikeFeedback(fb.id)}
                                  className={`px-2.5 py-1 border border-black text-[10px] font-black uppercase flex items-center gap-1 transition-colors ${
                                    isLiked ? 'bg-black text-yellow-300' : 'bg-white text-stone-700 hover:bg-stone-100'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>Helpful ({totalLikes})</span>
                                </button>

                                {onStartChat && (
                                  <button
                                    onClick={() => onStartChat({
                                      id: fb.id,
                                      name: fb.authorName,
                                      role: fb.authorRole,
                                      avatar: fb.authorAvatar || 'default',
                                      institution: fb.collegeOrBatch
                                    })}
                                    className="px-2.5 py-1 border border-black bg-blue-600 text-white text-[10px] font-black uppercase flex items-center gap-1 hover:bg-blue-700 transition-colors"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>Chat with Mentor</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* MODAL: SUBMIT ALUMNI REVIEW */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="border-3 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xl w-full p-6 space-y-4 my-8 relative">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 p-1.5 border-2 border-black bg-white hover:bg-stone-100 text-black"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b-2 border-black pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-700">
                {activeCompany && <CompanyLogo company={activeCompany} size="xs" showBorder={false} className="border border-black" />}
                <span>{activeCompany?.name}</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black">Submit Alumni & Work Feedback</h3>
              <p className="text-xs text-stone-500">Help students and freshers understand the interview process, company culture, and career prospects.</p>
            </div>

            {feedbackSubmittedSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 border-2 border-black">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black uppercase text-emerald-900">Review Submitted Successfully!</h4>
                <p className="text-xs text-emerald-700">Thank you for contributing your real experience to the DIRPA community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black uppercase text-[10px] text-stone-700 mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={feedbackAuthorName}
                      onChange={(e) => setFeedbackAuthorName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full border-2 border-black p-2 bg-stone-50 font-medium focus:outline-none focus:bg-yellow-50"
                    />
                  </div>

                  <div>
                    <label className="block font-black uppercase text-[10px] text-stone-700 mb-1">Your Designation / Role *</label>
                    <input 
                      type="text" 
                      required
                      value={feedbackAuthorRole}
                      onChange={(e) => setFeedbackAuthorRole(e.target.value)}
                      placeholder={`e.g. SDE 1 @ ${activeCompany?.name}`}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-medium focus:outline-none focus:bg-yellow-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-[10px] text-stone-700 mb-1">College, Degree & Passing Batch *</label>
                  <input 
                    type="text" 
                    required
                    value={feedbackCollege}
                    onChange={(e) => setFeedbackCollege(e.target.value)}
                    placeholder="e.g. NIT Warangal (B.Tech CSE '23)"
                    className="w-full border-2 border-black p-2 bg-stone-50 font-medium focus:outline-none focus:bg-yellow-50"
                  />
                </div>

                {/* Ratings Row */}
                <div className="grid grid-cols-3 gap-3 bg-stone-50 p-3 border border-black">
                  <div>
                    <label className="block font-black uppercase text-[9px] text-stone-700 mb-1">Overall Rating</label>
                    <select 
                      value={feedbackRating}
                      onChange={(e) => setFeedbackRating(Number(e.target.value))}
                      className="w-full border border-black p-1.5 bg-white font-bold"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                      <option value={2}>⭐⭐ (2/5)</option>
                      <option value={1}>⭐ (1/5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black uppercase text-[9px] text-stone-700 mb-1">Work-Life Balance</label>
                    <select 
                      value={feedbackWlbRating}
                      onChange={(e) => setFeedbackWlbRating(Number(e.target.value))}
                      className="w-full border border-black p-1.5 bg-white font-bold"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Demanding</option>
                      <option value={1}>1 - Stressful</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black uppercase text-[9px] text-stone-700 mb-1">Career Growth</label>
                    <select 
                      value={feedbackGrowthRating}
                      onChange={(e) => setFeedbackGrowthRating(Number(e.target.value))}
                      className="w-full border border-black p-1.5 bg-white font-bold"
                    >
                      <option value={5}>5 - Fast-track</option>
                      <option value={4}>4 - Strong</option>
                      <option value={3}>3 - Moderate</option>
                      <option value={2}>2 - Slow</option>
                      <option value={1}>1 - Stagnant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-[10px] text-stone-700 mb-1">Work Experience & Culture Review *</label>
                  <textarea
                    required
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Share how the day-to-day work is, team culture, learning curve, tools used..."
                    className="w-full border-2 border-black p-2 bg-stone-50 font-medium focus:outline-none focus:bg-yellow-50"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-[10px] text-stone-700 mb-1">Interview Experience & Rounds Tips (Optional)</label>
                  <textarea
                    rows={2}
                    value={feedbackInterviewExp}
                    onChange={(e) => setFeedbackInterviewExp(e.target.value)}
                    placeholder="What questions or topics were asked? Any specific DSA topics or core subjects?"
                    className="w-full border-2 border-black p-2 bg-stone-50 font-medium focus:outline-none focus:bg-yellow-50"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-[10px] text-stone-700 mb-1">Direct Advice for Freshers / Students (Optional)</label>
                  <input 
                    type="text" 
                    value={feedbackFresherAdvice}
                    onChange={(e) => setFeedbackFresherAdvice(e.target.value)}
                    placeholder="e.g. Master LeetCode Mediums and focus on clean communication."
                    className="w-full border-2 border-black p-2 bg-stone-50 font-medium focus:outline-none focus:bg-yellow-50"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border-2 border-black bg-white font-black uppercase text-stone-700 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 border-2 border-black bg-black text-yellow-300 font-black uppercase tracking-wider hover:bg-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
