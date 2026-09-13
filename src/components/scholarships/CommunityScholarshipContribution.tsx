import React, { useState } from 'react';
import { Scholarship, UserProfile } from '../../types';
import {
  Sparkles,
  Plus,
  Building2,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  Globe,
  Share2,
  CheckCircle2,
  AlertCircle,
  X,
  HeartHandshake,
  HelpCircle,
  Send,
  Users,
  ShieldCheck
} from 'lucide-react';

interface CommunityScholarshipContributionProps {
  currentUser?: Partial<UserProfile> | null;
  onScholarshipAdded: (scholarship: Scholarship) => Promise<void>;
  isDarkMode?: boolean;
}

const COMMON_DOCUMENTS = [
  'Aadhaar Card',
  'Previous Year Marksheet',
  'Family Income Certificate',
  'Caste / Category Certificate',
  'College Bonafide Certificate',
  'Bank Passbook Copy',
  'Domicile / Residence Certificate',
  'Admission Fee Receipt',
  'Passport Size Photographs',
  'Disability Certificate (If applicable)'
];

const POPULAR_STATES = [
  'All India',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Maharashtra',
  'Delhi',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Bihar',
  'Gujarat'
];

export const CommunityScholarshipContribution: React.FC<CommunityScholarshipContributionProps> = ({
  currentUser,
  onScholarshipAdded,
  isDarkMode = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form state initialized with structured defaults
  const [formData, setFormData] = useState<Scholarship>({
    scholarshipId: '',
    scholarshipName: '',
    provider: '',
    providerType: 'Government',
    description: '',
    eligibility: '',
    educationLevel: 'Graduation',
    eligibleCourses: ['All Courses'],
    eligibleStates: ['All India'],
    category: 'All',
    gender: 'All',
    minimumPercentage: 50,
    maximumFamilyIncome: 250000,
    scholarshipAmount: '',
    applicationStartDate: new Date().toISOString().split('T')[0],
    applicationEndDate: '',
    documentsRequired: ['Aadhaar Card', 'Previous Year Marksheet', 'Family Income Certificate'],
    selectionProcess: 'Merit list and financial verification by scholarship board.',
    renewalAvailable: true,
    officialWebsite: '',
    applicationLink: '',
    status: 'Open',
    contributedBy: currentUser?.name ? `${currentUser.name} (${currentUser.role || 'Student'})` : 'Community Student',
    contributorNote: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [coursesString, setCoursesString] = useState('All Courses, B.Tech, B.Sc, B.Com, MBBS');
  const [customDocInput, setCustomDocInput] = useState('');

  const resetForm = () => {
    setFormData({
      scholarshipId: '',
      scholarshipName: '',
      provider: '',
      providerType: 'Government',
      description: '',
      eligibility: '',
      educationLevel: 'Graduation',
      eligibleCourses: ['All Courses'],
      eligibleStates: ['All India'],
      category: 'All',
      gender: 'All',
      minimumPercentage: 50,
      maximumFamilyIncome: 250000,
      scholarshipAmount: '',
      applicationStartDate: new Date().toISOString().split('T')[0],
      applicationEndDate: '',
      documentsRequired: ['Aadhaar Card', 'Previous Year Marksheet', 'Family Income Certificate'],
      selectionProcess: 'Merit list and financial verification by scholarship board.',
      renewalAvailable: true,
      officialWebsite: '',
      applicationLink: '',
      status: 'Open',
      contributedBy: currentUser?.name ? `${currentUser.name} (${currentUser.role || 'Student'})` : 'Community Student',
      contributorNote: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setCoursesString('All Courses, B.Tech, B.Sc, B.Com, MBBS');
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleToggleDoc = (docName: string) => {
    const exists = formData.documentsRequired.includes(docName);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        documentsRequired: prev.documentsRequired.filter(d => d !== docName)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documentsRequired: [...prev.documentsRequired, docName]
      }));
    }
  };

  const handleAddCustomDoc = () => {
    if (!customDocInput.trim()) return;
    const docTrimmed = customDocInput.trim();
    if (!formData.documentsRequired.includes(docTrimmed)) {
      setFormData(prev => ({
        ...prev,
        documentsRequired: [...prev.documentsRequired, docTrimmed]
      }));
    }
    setCustomDocInput('');
  };

  const handleToggleState = (stateName: string) => {
    if (stateName === 'All India') {
      setFormData(prev => ({ ...prev, eligibleStates: ['All India'] }));
      return;
    }

    let updated = formData.eligibleStates.filter(s => s !== 'All India');
    if (updated.includes(stateName)) {
      updated = updated.filter(s => s !== stateName);
      if (updated.length === 0) updated = ['All India'];
    } else {
      updated.push(stateName);
    }
    setFormData(prev => ({ ...prev, eligibleStates: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.scholarshipName.trim()) {
      errors.scholarshipName = 'Scholarship Name is required';
    }
    if (!formData.provider.trim()) {
      errors.provider = 'Providing organization / government trust name is required';
    }
    if (!formData.scholarshipAmount.trim()) {
      errors.scholarshipAmount = 'Scholarship Amount / Benefit details are required (e.g. ₹50,000 / year or 100% Tuition Fee)';
    }
    if (!formData.eligibility.trim()) {
      errors.eligibility = 'Eligibility summary is required so students can evaluate their fit';
    }
    if (!formData.officialWebsite.trim() && !formData.applicationLink.trim()) {
      errors.officialWebsite = 'Please provide an official website or application link';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fill in all the required question fields before submitting.');
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Parse courses
      const parsedCourses = coursesString
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const uniqueId = `sch_comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const finalScholarship: Scholarship = {
        ...formData,
        scholarshipId: uniqueId,
        eligibleCourses: parsedCourses.length > 0 ? parsedCourses : ['All Courses'],
        officialWebsite: formData.officialWebsite.trim() || formData.applicationLink.trim() || 'https://scholarships.gov.in',
        applicationLink: formData.applicationLink.trim() || formData.officialWebsite.trim() || 'https://scholarships.gov.in',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onScholarshipAdded(finalScholarship);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setSuccessMessage(`"${finalScholarship.scholarshipName}" has been successfully added to the database and is now live across the platform!`);

      // Clear success banner after 8 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 8000);
    } catch (err: any) {
      console.error('Failed to submit community scholarship:', err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to save scholarship to database. Please check your connection.');
    }
  };

  return (
    <div className="space-y-4">
      {/* SUCCESS BANNER */}
      {successMessage && (
        <div className="bg-emerald-100 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start justify-between gap-3 text-emerald-950">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-display font-black uppercase">Scholarship Added Successfully!</h4>
              <p className="text-xs font-semibold mt-0.5 leading-relaxed">{successMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 hover:bg-emerald-200 border border-black text-xs"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>
      )}

      {/* MAIN COMMUNITY CONTAINER */}
      <div
        className={`border-4 border-black p-6 md:p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
          isDarkMode
            ? 'bg-gradient-to-br from-purple-950 via-zinc-900 to-amber-950 text-white'
            : 'bg-gradient-to-br from-amber-50 via-white to-purple-50 text-stone-900'
        }`}
      >
        {/* Top Decorative Banner Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 bg-amber-300 text-black border-2 border-black tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <HeartHandshake className="w-3.5 h-3.5 text-black" />
              Community Knowledge Exchange
            </span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-purple-100 text-purple-900 border border-purple-300 hidden sm:inline-block">
              // Student & Alumni Sourced
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
            <Users className="w-4 h-4 text-purple-700" />
            <span>Visible to all students nationwide</span>
          </div>
        </div>

        {/* Headline & Body Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2.5">
            <h2 className="text-xl md:text-3xl font-display font-black uppercase tracking-tight text-stone-900 dark:text-white leading-snug">
              Do you know any scholarships? Please add in here!
            </h2>
            <p className="text-xs md:text-sm text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
              Have you received or come across a scholarship that helped your education? Share it with the DIRPA community so students across the platform can discover and apply for it. Every submitted scholarship is saved directly to the database and made immediately visible to all students nationwide with instant eligibility scoring!
            </p>

            {/* 3 Pillars / Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
              <div className="p-2.5 bg-white dark:bg-zinc-800 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] font-bold uppercase font-mono">100% Platform-Wide Visibility</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-zinc-800 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px] font-bold uppercase font-mono">Auto Student Match Score</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-zinc-800 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold uppercase font-mono">Verified Cloud Storage</span>
              </div>
            </div>
          </div>

          {/* Action Button & Callout Box */}
          <div className="lg:col-span-4 flex flex-col items-stretch sm:items-end justify-center gap-3">
            <button
              onClick={handleOpenModal}
              className="w-full sm:w-auto px-6 py-4 bg-amber-300 hover:bg-amber-400 text-black border-4 border-black font-display font-black text-sm md:text-base uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
            >
              <Plus className="w-5 h-5 text-black stroke-[3]" />
              <span>Add Scholarship Details</span>
            </button>

            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 text-center sm:text-right">
              Takes ~2 minutes • Asks required eligibility questions
            </span>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE SUBMISSION MODAL WITH STRUCTURED QUESTIONS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-stone-900 border-4 border-black w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-8 relative my-auto text-left">
            {/* Modal Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 border-2 border-black cursor-pointer transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 border-b-2 border-black pb-4 pr-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-amber-300 text-black border border-black">
                  📝 Add New Scholarship
                </span>
                <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 border border-purple-200">
                  Global Platform Visibility
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-stone-900 tracking-tight">
                Contribute Scholarship Details
              </h2>
              <p className="text-xs text-stone-600 font-medium mt-1">
                Please provide accurate details. Once submitted, this scholarship will be indexed in the database and visible to all students using DIRPA.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border-2 border-red-500 text-red-900 p-3 mb-6 flex items-center gap-2 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* QUESTION GROUP 1: BASIC SCHOLARSHIP IDENTITY */}
              <div className="bg-stone-50 border-2 border-black p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-300 pb-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center">1</span>
                  <h3 className="text-sm font-display font-black uppercase text-stone-900">
                    Basic Scholarship Identity & Organization
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Scholarship Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      1.1 Scholarship Scheme / Grant Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.scholarshipName}
                      onChange={e => setFormData({ ...formData, scholarshipName: e.target.value })}
                      placeholder="e.g. AICTE Pragati Scholarship for Girls / HDFC Parivartan ECSS"
                      className={`w-full p-2.5 border-2 ${
                        fieldErrors.scholarshipName ? 'border-red-500 bg-red-50' : 'border-black'
                      } text-xs font-bold bg-white focus:outline-none focus:bg-amber-50/50`}
                    />
                    {fieldErrors.scholarshipName && (
                      <span className="text-[10px] text-red-600 font-bold mt-0.5 block">{fieldErrors.scholarshipName}</span>
                    )}
                  </div>

                  {/* Provider Name */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      1.2 Providing Body / Trust / Ministry <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.provider}
                      onChange={e => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="e.g. Ministry of Education / Tata Trusts / Reliance Foundation"
                      className={`w-full p-2.5 border-2 ${
                        fieldErrors.provider ? 'border-red-500 bg-red-50' : 'border-black'
                      } text-xs font-bold bg-white focus:outline-none focus:bg-amber-50/50`}
                    />
                    {fieldErrors.provider && (
                      <span className="text-[10px] text-red-600 font-bold mt-0.5 block">{fieldErrors.provider}</span>
                    )}
                  </div>

                  {/* Provider Type */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      1.3 Provider Category
                    </label>
                    <select
                      value={formData.providerType}
                      onChange={e => setFormData({ ...formData, providerType: e.target.value as any })}
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    >
                      <option value="Government">Government (Central / State Ministry)</option>
                      <option value="Private">Private Corporate / CSR Program</option>
                      <option value="NGO">NGO / Philanthropic Trust</option>
                      <option value="University">University / Institutional Endowment</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      1.4 Overview & Purpose of Scholarship
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the scholarship mission, target students, and objectives..."
                      className="w-full p-2.5 border-2 border-black text-xs font-medium bg-white focus:outline-none focus:bg-amber-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* QUESTION GROUP 2: FINANCIAL BENEFITS & AWARD */}
              <div className="bg-stone-50 border-2 border-black p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-300 pb-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center">2</span>
                  <h3 className="text-sm font-display font-black uppercase text-stone-900">
                    Award Benefits & Financial Value
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Amount / Coverage */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      2.1 Award Amount / Financial Coverage <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.scholarshipAmount}
                      onChange={e => setFormData({ ...formData, scholarshipAmount: e.target.value })}
                      placeholder="e.g. ₹50,000 / year OR 100% Tuition Fee Reimbursement + ₹20,000 Hostel"
                      className={`w-full p-2.5 border-2 ${
                        fieldErrors.scholarshipAmount ? 'border-red-500 bg-red-50' : 'border-black'
                      } text-xs font-bold bg-white focus:outline-none focus:bg-amber-50/50`}
                    />
                    {fieldErrors.scholarshipAmount && (
                      <span className="text-[10px] text-red-600 font-bold mt-0.5 block">{fieldErrors.scholarshipAmount}</span>
                    )}
                  </div>

                  {/* Renewal Available */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      2.2 Is Renewal Available for Multi-Year Studies?
                    </label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="radio"
                          name="renewal"
                          checked={formData.renewalAvailable === true}
                          onChange={() => setFormData({ ...formData, renewalAvailable: true })}
                          className="accent-black w-4 h-4"
                        />
                        <span>Yes, Renewable Annually</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="radio"
                          name="renewal"
                          checked={formData.renewalAvailable === false}
                          onChange={() => setFormData({ ...formData, renewalAvailable: false })}
                          className="accent-black w-4 h-4"
                        />
                        <span>No, One-Time Grant</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUESTION GROUP 3: ELIGIBILITY CRITERIA & DEMOGRAPHICS */}
              <div className="bg-stone-50 border-2 border-black p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-300 pb-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center">3</span>
                  <h3 className="text-sm font-display font-black uppercase text-stone-900">
                    Student Eligibility & Demographic Parameters
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Education Level */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      3.1 Target Education Stage
                    </label>
                    <select
                      value={formData.educationLevel}
                      onChange={e => setFormData({ ...formData, educationLevel: e.target.value as any })}
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    >
                      <option value="All">All Education Levels</option>
                      <option value="10th">10th Standard</option>
                      <option value="Intermediate">Intermediate / 12th</option>
                      <option value="Polytechnic">Polytechnic Diploma</option>
                      <option value="ITI">ITI Vocational</option>
                      <option value="Graduation">Graduation (B.Tech, B.Sc, MBBS, etc.)</option>
                      <option value="Post Graduation">Post Graduation (M.Tech, MBA, etc.)</option>
                    </select>
                  </div>

                  {/* Category Reservation */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      3.2 Social Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    >
                      <option value="All">Open for All Categories</option>
                      <option value="General">General / Open Category</option>
                      <option value="OBC">OBC (Other Backward Classes)</option>
                      <option value="SC">SC (Scheduled Castes)</option>
                      <option value="ST">ST (Scheduled Tribes)</option>
                      <option value="EWS">EWS (Economically Weaker Section)</option>
                      <option value="Minority">Minority Communities (Muslim, Christian, Jain, Sikh)</option>
                      <option value="Disabled">Differently Abled (PwD / Divyangjan)</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      3.3 Gender Restriction
                    </label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    >
                      <option value="All">All Genders (Male & Female)</option>
                      <option value="Female">Only Girl Students / Female</option>
                      <option value="Male">Only Boys / Male</option>
                    </select>
                  </div>

                  {/* Max Family Income */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      3.4 Maximum Family Annual Income (₹)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.maximumFamilyIncome === 0 ? '' : formData.maximumFamilyIncome}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, maximumFamilyIncome: raw === '' ? 0 : parseInt(raw, 10) });
                      }}
                      placeholder="e.g. 250000 (Enter 0 for No Income Limit)"
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    />
                    <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
                      {formData.maximumFamilyIncome === 0 ? 'No income cap' : `₹${formData.maximumFamilyIncome.toLocaleString('en-IN')} / year max`}
                    </span>
                  </div>

                  {/* Minimum Percentage */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      3.5 Minimum Marks Required (%)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.minimumPercentage === 0 ? '' : formData.minimumPercentage}
                      onChange={e => {
                        const raw = e.target.value.replace(/[^0-9.]/g, '');
                        const parsed = parseFloat(raw);
                        setFormData({ ...formData, minimumPercentage: isNaN(parsed) ? 0 : parsed });
                      }}
                      placeholder="e.g. 60 (Enter 0 for No Minimum)"
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    />
                    <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
                      {formData.minimumPercentage === 0 ? 'No min marks required' : `${formData.minimumPercentage}% minimum score`}
                    </span>
                  </div>

                  {/* Application Status */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      3.6 Current Portal Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    >
                      <option value="Open">🟢 Open for Applications</option>
                      <option value="Closed">🔴 Currently Closed</option>
                    </select>
                  </div>
                </div>

                {/* Eligible Courses string */}
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                    3.7 Eligible Courses & Streams (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={coursesString}
                    onChange={e => setCoursesString(e.target.value)}
                    placeholder="e.g. B.Tech, B.Sc, B.Com, MBBS, Diploma, All Courses"
                    className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                  />
                </div>

                {/* States Multi-Select Chips */}
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1.5">
                    3.8 Eligible Domicile States
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_STATES.map(st => {
                      const isSelected = formData.eligibleStates.includes(st);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleToggleState(st)}
                          className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-amber-300 text-black border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                              : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Eligibility Summary */}
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                    3.9 Concise Eligibility Summary <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.eligibility}
                    onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g. Must be a girl student enrolled in 1st year B.Tech/Diploma via central counselling with family income < ₹8 LPA."
                    className={`w-full p-2.5 border-2 ${
                      fieldErrors.eligibility ? 'border-red-500 bg-red-50' : 'border-black'
                    } text-xs font-medium bg-white focus:outline-none focus:bg-amber-50/50`}
                  />
                  {fieldErrors.eligibility && (
                    <span className="text-[10px] text-red-600 font-bold mt-0.5 block">{fieldErrors.eligibility}</span>
                  )}
                </div>
              </div>

              {/* QUESTION GROUP 4: APPLICATION PROCESS & OFFICIAL LINKS */}
              <div className="bg-stone-50 border-2 border-black p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-300 pb-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center">4</span>
                  <h3 className="text-sm font-display font-black uppercase text-stone-900">
                    Application Portal, Links & Required Documents
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Official Website */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      4.1 Official Website URL <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.officialWebsite}
                      onChange={e => setFormData({ ...formData, officialWebsite: e.target.value })}
                      placeholder="https://scholarships.gov.in"
                      className={`w-full p-2.5 border-2 ${
                        fieldErrors.officialWebsite ? 'border-red-500 bg-red-50' : 'border-black'
                      } text-xs font-bold bg-white focus:outline-none focus:bg-amber-50/50`}
                    />
                    {fieldErrors.officialWebsite && (
                      <span className="text-[10px] text-red-600 font-bold mt-0.5 block">{fieldErrors.officialWebsite}</span>
                    )}
                  </div>

                  {/* Direct Application Link */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      4.2 Direct Application Portal Link
                    </label>
                    <input
                      type="url"
                      value={formData.applicationLink}
                      onChange={e => setFormData({ ...formData, applicationLink: e.target.value })}
                      placeholder="https://scholarships.gov.in/fresh/newRegister"
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    />
                  </div>

                  {/* Application Deadline */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      4.3 Application Deadline / Last Date
                    </label>
                    <input
                      type="date"
                      value={formData.applicationEndDate}
                      onChange={e => setFormData({ ...formData, applicationEndDate: e.target.value })}
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    />
                  </div>

                  {/* Selection Process */}
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                      4.4 Selection Process Summary
                    </label>
                    <input
                      type="text"
                      value={formData.selectionProcess}
                      onChange={e => setFormData({ ...formData, selectionProcess: e.target.value })}
                      placeholder="e.g. Merit rank in qualifying exam followed by institute verification."
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    />
                  </div>
                </div>

                {/* Required Documents Selector */}
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1.5">
                    4.5 Required Documents for Application (Click to select)
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {COMMON_DOCUMENTS.map(docName => {
                      const isSelected = formData.documentsRequired.includes(docName);
                      return (
                        <button
                          key={docName}
                          type="button"
                          onClick={() => handleToggleDoc(docName)}
                          className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-purple-900 text-white border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                              : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {docName}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom doc adder */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={customDocInput}
                      onChange={e => setCustomDocInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomDoc();
                        }
                      }}
                      placeholder="Add another required document name..."
                      className="flex-1 p-2 border-2 border-black text-xs font-bold bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDoc}
                      className="px-3 py-2 bg-stone-200 hover:bg-stone-300 border-2 border-black font-bold uppercase text-xs cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* QUESTION GROUP 5: BENEFICIARY NOTE & CONTRIBUTOR DETAILS */}
              <div className="bg-purple-50 border-2 border-black p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
                  <span className="w-6 h-6 rounded-full bg-purple-900 text-white font-mono font-bold text-xs flex items-center justify-center">5</span>
                  <h3 className="text-sm font-display font-black uppercase text-purple-900">
                    Your Experience & Community Tips (Optional)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-purple-950 mb-1">
                      5.1 Contributed By (Your Name / Role)
                    </label>
                    <input
                      type="text"
                      value={formData.contributedBy || ''}
                      onChange={e => setFormData({ ...formData, contributedBy: e.target.value })}
                      placeholder="e.g. Priya R. (2nd Year B.Tech) or Alumni Advisor"
                      className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-purple-950 mb-1">
                      5.2 Practical Advice / Beneficiary Tip for Applicants
                    </label>
                    <input
                      type="text"
                      value={formData.contributorNote || ''}
                      onChange={e => setFormData({ ...formData, contributorNote: e.target.value })}
                      placeholder="e.g. Ensure your bank account is Aadhaar seeded for seamless direct benefit transfer."
                      className="w-full p-2.5 border-2 border-black text-xs font-medium bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SUBMISSION ACTIONS */}
              <div className="border-t-4 border-black pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] font-mono text-stone-500 font-bold text-center sm:text-left">
                  // This scholarship will be stored in Firestore & visible to all users.
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-stone-100 hover:bg-stone-200 border-2 border-black font-bold uppercase text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-display font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Save & Publish to Platform</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
