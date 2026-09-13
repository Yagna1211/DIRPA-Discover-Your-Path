import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Briefcase, Award, BookOpen, TrendingUp, CheckCircle, ShieldCheck, Cpu, DollarSign, Sparkles, RefreshCw, BarChart2, Globe, ExternalLink } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RegionSelector, JobRegion, REGIONS } from './RegionSelector';
import { fetchIndianJobData } from '../services/geminiJobService';
import { OnetCareerSkeleton } from './SkeletonLayouts';

interface OnetOccupation {
  code: string;
  title: string;
  description: string;
  sample_of_reported_job_titles?: string[];
  tasks?: string[];
  skills?: string[];
  knowledge?: string[];
  abilities?: string[];
  work_activities?: string[];
  education?: string;
  currency?: string;
  symbol?: string;
  wage_outlook?: {
    median_annual_salary?: string;
    entry_salary?: string;
    senior_salary?: string;
    growth_rate?: string;
    projected_job_openings?: string;
  };
}

interface OnetStatus {
  active: boolean;
  provider: string;
  apiKeyProvided: boolean;
  keyPreview: string;
  endpoint: string;
}

export const OnetCareerExplorer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('software');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<OnetStatus | null>(null);
  const [occupations, setOccupations] = useState<OnetOccupation[]>([]);
  const [selectedOccupation, setSelectedOccupation] = useState<OnetOccupation | null>(null);
  const [apiSource, setApiSource] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [citations, setCitations] = useState<{ title: string; url: string }[]>([]);

  // Region state (IN = India via Gemini Live Search, US = O*NET API)
  const [region, setRegion] = useState<JobRegion>(() => {
    const saved = localStorage.getItem('dirpa_job_region') as JobRegion;
    return saved === 'US' || saved === 'IN' ? saved : 'IN';
  });

  const currencySymbol = region === 'IN' ? '₹' : '$';

  // Fetch O*NET status & initial search on mount
  useEffect(() => {
    fetchOnetStatus();
    handleSearch('software', region);
  }, []);

  // Helper to parse currency string into number for Recharts
  const parseSalaryNumber = (str?: string, defaultVal: number = 0): number => {
    if (!str) return defaultVal;
    const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) || num === 0 ? defaultVal : num;
  };

  // Prepare chart dataset comparing Entry, Median, and Senior salaries across matching occupations
  const salaryChartData = occupations.map((occ) => {
    const defaultEntry = region === 'IN' ? 600000 : 60000;
    const defaultMedian = region === 'IN' ? 1450000 : 105000;
    const defaultSenior = region === 'IN' ? 2800000 : 160000;

    const entry = parseSalaryNumber(occ.wage_outlook?.entry_salary, defaultEntry);
    const median = parseSalaryNumber(occ.wage_outlook?.median_annual_salary, defaultMedian);
    const senior = parseSalaryNumber(occ.wage_outlook?.senior_salary, defaultSenior);

    return {
      name: occ.title.length > 18 ? occ.title.substring(0, 16) + '…' : occ.title,
      fullTitle: occ.title,
      code: occ.code,
      Entry: entry,
      Median: median,
      Senior: senior,
    };
  });

  const fetchOnetStatus = async () => {
    try {
      const res = await fetch('/api/onet/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch O*NET API status', err);
    }
  };

  const handleRegionChange = (newRegion: JobRegion) => {
    setRegion(newRegion);
    localStorage.setItem('dirpa_job_region', newRegion);
    handleSearch(searchTerm, newRegion);
  };

  const handleSearch = async (termToSearch?: string, targetRegion?: JobRegion) => {
    const query = termToSearch !== undefined ? termToSearch : searchTerm;
    const activeRegion = targetRegion || region;
    if (!query.trim()) {
      setErrorMsg("Please enter a job title or skill keyword to search.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setCitations([]);

    if (activeRegion === 'IN') {
      // Route query through Gemini Live Search Grounding Service
      try {
        const result = await fetchIndianJobData(query, i18n.language);
        setApiSource(result.source || 'gemini_live_search');
        if (result.citations) {
          setCitations(result.citations);
        }
        if (result.occupations && result.occupations.length > 0) {
          setOccupations(result.occupations);
          setSelectedOccupation(result.occupations[0]);
        } else {
          setOccupations([]);
          setSelectedOccupation(null);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error connecting to Indian job search service.');
      } finally {
        setLoading(false);
      }
    } else {
      // US O*NET API search route
      try {
        const res = await fetch(`/api/onet/search?keyword=${encodeURIComponent(query)}`);
        if (res.ok) {
          const result = await res.json();
          setApiSource(result.source || 'onet_api');
          if (result.occupations && result.occupations.length > 0) {
            setOccupations(result.occupations);
            fetchOccupationDetail(result.occupations[0].code);
          } else {
            setOccupations([]);
            setSelectedOccupation(null);
          }
        } else {
          setErrorMsg('Could not fetch O*NET search results.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error connecting to O*NET API service');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchOccupationDetail = async (code: string) => {
    if (region === 'IN') {
      const match = occupations.find((o) => o.code === code);
      if (match) setSelectedOccupation(match);
      return;
    }

    try {
      const res = await fetch(`/api/onet/occupations/${encodeURIComponent(code)}`);
      if (res.ok) {
        const result = await res.json();
        if (result.occupation) {
          setSelectedOccupation(result.occupation);
        }
      }
    } catch (err) {
      console.warn('Error fetching occupation detail:', err);
    }
  };

  const presetQueries = ['Software', 'Registered Nurse', 'Cybersecurity', 'Mechanical Engineer', 'Data Science', 'Pharmacist'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black">
        <div>
          <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-wide flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            {region === 'IN' ? 'Indian Job Market & Career Explorer' : t('onet.title', 'US Job Market & Career Explorer')}
          </h2>
          <p className="text-xs font-medium text-stone-600 dark:text-zinc-300 mt-1">
            {region === 'IN'
              ? 'Real-time Indian occupational tasks, skills, NCO qualifications, and live INR (₹) salary data retrieved via AI with Search Grounding.'
              : t('onet.subtitle', 'Real-world occupational tasks, skills, knowledge areas, and wage metrics fetched via U.S. Dept. of Labor O*NET API.')}
          </p>
        </div>

        {/* Region Switcher & Provider Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <RegionSelector
            currentRegion={region}
            onRegionChange={handleRegionChange}
            variant="compact"
          />

          <div className="bg-stone-50 dark:bg-zinc-800 p-2.5 rounded-xl border-2 border-black text-left md:text-right">
            <span className="text-[10px] font-mono text-stone-500 dark:text-zinc-400 block uppercase font-bold">
              Market Context
            </span>
            <span className="text-xs font-black text-black dark:text-white block">
              {region === 'IN' ? '🇮🇳 India (INR ₹)' : '🇺🇸 United States (USD $)'}
            </span>
          </div>
        </div>
      </div>

      {/* Search Input and Region Presets */}
      <div className="space-y-3 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                region === 'IN'
                  ? 'Search Indian Careers (e.g. Full Stack Developer, Clinical Nurse, Automobile Engineer)...'
                  : t('onet.searchPlaceholder', 'Search O*NET Occupations (e.g., Software Developers, Pharmacist, Data Scientist)...')
              }
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-zinc-800 text-black dark:text-white border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[2px_2px_0px_0px_#000]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wide border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {t('common.search', 'Search')}
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold font-mono text-stone-500 uppercase">Popular Searches:</span>
          {presetQueries.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setSearchTerm(preset);
                handleSearch(preset);
              }}
              className="px-2.5 py-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-black rounded-lg transition shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Live Gemini Grounding Citation Links */}
        {region === 'IN' && citations.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-stone-500 flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-600" /> Grounded Web Sources:
            </span>
            {citations.map((c, i) => (
              <a
                key={i}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-300 dark:border-blue-800 hover:underline"
              >
                <span>{c.title}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      {loading && occupations.length === 0 && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-zinc-800/80 border-2 border-black rounded-xl text-xs font-mono font-bold text-blue-900 dark:text-blue-300 flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
            <span>// {region === 'IN' ? 'Grounding search with live Indian market data & Gemini AI...' : 'Fetching real-time O*NET occupational data...'}</span>
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          </div>
          <OnetCareerSkeleton />
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-100 border-2 border-black text-red-900 text-xs font-bold rounded-xl mb-4">
          {errorMsg}
        </div>
      )}

      {/* Main Content Layout */}
      {(!loading || occupations.length > 0) && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Search Results List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black uppercase text-stone-500 dark:text-zinc-400 tracking-wider flex items-center justify-between">
            <span>
              Matching Roles ({occupations.length}) [{region === 'IN' ? '🇮🇳 India' : '🇺🇸 US'}]
            </span>
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />}
          </h3>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {occupations.map((occ) => {
              const isSelected = selectedOccupation?.code === occ.code;
              return (
                <div
                  key={occ.code}
                  onClick={() => fetchOccupationDetail(occ.code)}
                  className={`p-3.5 rounded-xl border-2 border-black cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-950/40 border-black shadow-[4px_4px_0px_0px_#000]'
                      : 'bg-stone-50 dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700/60 shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-blue-100 text-blue-900 border border-black rounded">
                        {region === 'IN' ? 'NCO' : 'SOC'} {occ.code}
                      </span>
                      {occ.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) && (
                        <span className="text-[9px] font-extrabold font-mono px-1.5 py-0.5 bg-emerald-200 text-emerald-950 border border-black rounded">
                          ✓ Match
                        </span>
                      )}
                    </div>
                    {occ.wage_outlook?.median_annual_salary && (
                      <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800">
                        {occ.wage_outlook.median_annual_salary}/yr
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-black dark:text-white mt-1.5 leading-snug">
                    {occ.title}
                  </h4>
                  <p className="text-xs font-medium text-stone-600 dark:text-zinc-300 line-clamp-2 mt-1">
                    {occ.description}
                  </p>
                </div>
              );
            })}

            {occupations.length === 0 && !loading && (
              <div className="text-center py-8 text-stone-500 dark:text-zinc-400 text-xs font-bold border-2 border-dashed border-stone-300 rounded-xl">
                No roles found. Try searching for "Software", "Analyst", "Nurse", or "Mechanical".
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Occupation Inspector */}
        <div className="lg:col-span-8">
          {selectedOccupation ? (
            <div className="bg-stone-50 dark:bg-zinc-800 border-2 border-black rounded-xl p-5 space-y-6 shadow-[4px_4px_0px_0px_#000]">
              {/* Header */}
              <div className="pb-4 border-b-2 border-black">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white font-mono text-xs font-black px-2.5 py-1 rounded-md border border-black shadow-[2px_2px_0px_0px_#000]">
                    {region === 'IN' ? 'NCO Standard Code:' : 'O*NET SOC Code:'} {selectedOccupation.code}
                  </span>
                  {selectedOccupation.education && (
                    <span className="bg-purple-100 text-purple-900 font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-black">
                      🎓 {selectedOccupation.education}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-black dark:text-white mb-2">
                  {selectedOccupation.title}
                </h3>
                <p className="text-xs font-medium text-stone-700 dark:text-zinc-300 leading-relaxed bg-white dark:bg-zinc-900 p-3 rounded-lg border border-black">
                  {selectedOccupation.description}
                </p>
              </div>

              {/* Salary & Outlook Cards */}
              {selectedOccupation.wage_outlook && (
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Wage & Employment Outlook ({region === 'IN' ? 'Indian Market INR ₹' : 'U.S. Market USD $'})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-black rounded-lg">
                      <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                        Median Salary
                      </span>
                      <span className="text-base font-black text-emerald-900 dark:text-emerald-100">
                        {selectedOccupation.wage_outlook.median_annual_salary || `${currencySymbol}${region === 'IN' ? '14,50,000' : '110,000'}`}
                      </span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border-2 border-black rounded-lg">
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-800 dark:text-blue-300 block">
                        Entry Level
                      </span>
                      <span className="text-base font-black text-blue-900 dark:text-blue-100">
                        {selectedOccupation.wage_outlook.entry_salary || `${currencySymbol}${region === 'IN' ? '6,00,000' : '65,000'}`}
                      </span>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-2 border-black rounded-lg">
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 block">
                        Growth Rate
                      </span>
                      <span className="text-base font-black text-amber-900 dark:text-amber-100">
                        {selectedOccupation.wage_outlook.growth_rate || '20% Growth'}
                      </span>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border-2 border-black rounded-lg">
                      <span className="text-[10px] font-mono uppercase font-bold text-purple-800 dark:text-purple-300 block">
                        Annual Openings
                      </span>
                      <span className="text-base font-black text-purple-900 dark:text-purple-100">
                        {selectedOccupation.wage_outlook.projected_job_openings || '50,000+'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Reported Job Titles */}
              {selectedOccupation.sample_of_reported_job_titles && selectedOccupation.sample_of_reported_job_titles.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Reported Job Titles in Industry
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOccupation.sample_of_reported_job_titles.map((title, i) => (
                      <span key={i} className="text-xs font-bold bg-white dark:bg-zinc-900 text-black dark:text-white px-2.5 py-1 rounded-md border border-black shadow-[2px_2px_0px_0px_#000]">
                        💼 {title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Tasks & Responsibilities */}
              {selectedOccupation.tasks && selectedOccupation.tasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Core Occupational Tasks
                  </h4>
                  <ul className="space-y-2">
                    {selectedOccupation.tasks.map((task, i) => (
                      <li key={i} className="text-xs font-medium text-stone-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-black flex items-start gap-2">
                        <span className="text-emerald-600 font-extrabold shrink-0 mt-0.5">✓</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills & Knowledge Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedOccupation.skills && selectedOccupation.skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase text-stone-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      Key Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedOccupation.skills.map((skill, i) => (
                        <span key={i} className="text-xs font-bold bg-blue-100 text-blue-900 border border-black px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOccupation.knowledge && selectedOccupation.knowledge.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase text-stone-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      Knowledge Domains
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedOccupation.knowledge.map((k, i) => (
                        <span key={i} className="text-xs font-bold bg-purple-100 text-purple-900 border border-black px-2 py-0.5 rounded">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 dark:bg-zinc-800 border-2 border-black rounded-xl p-8 text-center text-stone-500 dark:text-zinc-400 font-bold text-xs">
              Select an occupation from the list on the left to inspect detailed occupational data.
            </div>
          )}
        </div>
      </div>
      )}

      {/* Recharts Salary & Compensation Comparison Chart */}
      {salaryChartData.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                Comparative Salary Ranges ({region === 'IN' ? 'INR ₹ Lakhs' : 'USD $ Thousands'})
              </h3>
              <p className="text-xs font-medium text-stone-600 dark:text-zinc-400">
                Visualizing Entry, Median, and Senior annual salary figures in {region === 'IN' ? 'INR (₹)' : 'USD ($)'}.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded border border-black"></span> Entry
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-500 rounded border border-black"></span> Median
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-purple-500 rounded border border-black"></span> Senior
              </span>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-zinc-800 border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_#000]">
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryChartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tick={{ fontSize: 11, fontWeight: 'bold', fill: '#4b5563' }}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis
                    tickFormatter={(val) =>
                      region === 'IN'
                        ? val >= 100000
                          ? `₹${(val / 100000).toFixed(1)}L`
                          : `₹${Math.round(val / 1000)}k`
                        : `$${Math.round(val / 1000)}k`
                    }
                    tick={{ fontSize: 11, fontWeight: 'bold', fill: '#4b5563' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      region === 'IN'
                        ? `₹${Number(value).toLocaleString('en-IN')}/yr`
                        : `$${Number(value).toLocaleString()}/yr`,
                      '',
                    ]}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return item ? `${item.fullTitle} (${item.code})` : label;
                    }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #000000',
                      borderRadius: '8px',
                      boxShadow: '4px 4px 0px 0px #000000',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                  <Bar dataKey="Entry" fill="#3b82f6" name="Entry Level Salary" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Median" fill="#10b981" name="Median Salary" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Senior" fill="#8b5cf6" name="Senior Level Salary" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnetCareerExplorer;
