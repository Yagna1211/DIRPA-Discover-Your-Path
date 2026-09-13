import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  MessageSquare,
  Bookmark,
  User,
  Sparkles,
  Send,
  Plus,
  X,
  Menu,
  Search,
  Info,
  Award,
  Briefcase,
  Check,
  Star,
  ChevronRight,
  ChevronLeft,
  LogOut,
  MapPin,
  Calendar,
  Share2,
  Trash2,
  Copy,
  Trash,
  ThumbsUp,
  Sliders,
  Filter,
  CheckSquare,
  Sun,
  Moon,
  Palette,
  GitCompare,
  Scale,
  ArrowLeftRight,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Clock,
  Coins,
  ExternalLink,
  Download,
  Linkedin,
  Instagram,
  Heart,
  Users,
  Loader2,
  AlertTriangle,
  BarChart3,
  Quote,
  Mail,
  Phone,
  ArrowRight,
  Globe,
  Building2,
  Zap
} from 'lucide-react';
import { ACADEMIC_PATHWAYS, GENERAL_STATISTICS, INTERMEDIATE_GROUPS, POLYTECHNIC_DIPLOMAS, ITI_VOCATIONAL_TRADES } from './data/coursesData';
import { getLocalizedPathway, getLocalizedPathways } from './i18n/localizeData';
import { AcademicPathway, AlumniInsight, ChatThread, Message, SavedPath, TimelineEvent } from './types';
import { motion, AnimatePresence } from 'motion/react';
import LandingAnimation from './components/LandingAnimation';
import AlumniOnboardingWizard from './components/AlumniOnboardingWizard';
import { OnetCareerExplorer } from './components/OnetCareerExplorer';
import { EntranceExamsInfo } from './components/EntranceExamsInfo';
import { ScholarshipModule } from './components/scholarships/ScholarshipModule';
import { CompaniesExplorer } from './components/CompaniesExplorer';
import { BulletsFeed } from './components/BulletsFeed';
import { StuffLanding } from './components/Stuff/StuffLanding';
import DirpaLogo, { getActiveLogoStyle, LogoStyle } from './components/DirpaLogo';
import { AppPageSkeleton } from './components/SkeletonLayouts';
import Markdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CUSTOM_ILLUSTRATIONS, getIllustrationByIdOrUrl } from './data/illustrationsData';
import { IllustrationSelector } from './components/IllustrationSelector';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { AvatarDisplay, resolveAvatarUrl } from './components/AvatarDisplay';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import RegionSelector from './components/RegionSelector';
import { TranslatableText } from './components/TranslatableText';
export { resolveAvatarUrl };

export const seedIllustrationsToFirestore = async () => {
  try {
    for (const ill of CUSTOM_ILLUSTRATIONS) {
      const docRef = doc(db, 'illustrations', ill.id);
      await setDoc(docRef, {
        id: ill.id,
        name: ill.name,
        type: ill.type,
        badge: ill.badge,
        description: ill.description,
        url: ill.url,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.error("Firestore illustrations seeding error:", err);
  }
};
import { 
  DEGREE_SPECIALIZATION_MAP, 
  SpecializationCourse, 
  JobDetailInfo, 
  getFallbackSpecializations 
} from './data/specializations';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser, verifyPasswordResetCode, confirmPasswordReset, checkActionCode, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { auth, db } from './lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error logged and handled gracefully: ', JSON.stringify(errInfo));
}

export interface GraduationDegreeOption {
  name: string;
  careers: string[];
  description: string;
  duration: string;
}

export const ELIGIBILITY_MATRIX: Record<string, GraduationDegreeOption[]> = {
  MPC: [
    { name: "B.Tech/B.E (All Engineering Branches)", careers: ["Software Engineer", "Systems Architect", "Data Engineer"], description: "Core engineering pathways spanning computer science, electronics, informatics, mechanics, and civil infrastructures.", duration: "4 Years" },
    { name: "B.Arch", careers: ["Registered Architect", "Urban Planner", "Interior Designer"], description: "Professional building design, structural layout planning, architectural drawing, and landscape engineering.", duration: "5 Years" },
    { name: "BCA", careers: ["Software Developer", "Web Developer", "System Administrator"], description: "Computer applications, databases, lightweight programming, web layouts, and software solutions.", duration: "3 Years" },
    { name: "B.Sc Computer Science/Maths", careers: ["Data Analyst", "Research Assistant", "Actuarial Associate"], description: "Rigorous academic grounding in algebraic structures, processing matrices, and algorithm development.", duration: "3 Years" },
    { name: "B.Stat", careers: ["Actuary", "Quantitative Analyst", "Biostatistician"], description: "Advanced mathematical statistics, probability models, risk assessments, and big-data computations.", duration: "3 Years" },
    { name: "Commercial Pilot Training", careers: ["Commercial Pilot", "First Officer", "Flight Instructor"], description: "Flight navigation, cockpit mechanics, meteorology readings, and real-time aviation rules.", duration: "2 Years" },
    { name: "National Defence Academy (NDA)", careers: ["Lieutenant (Army)", "Sub-Lieutenant (Navy)", "Flying Officer (Air Force)"], description: "Joint services military training academy for standard commissions into Army, Navy, or Air Force.", duration: "3 Years" }
  ],
  BiPC: [
    { name: "MBBS", careers: ["Medical Doctor", "Resident Physician", "Surgeon Trainee"], description: "Clinical surgery, internal medicine, diagnosis, anatomical dissection, and healthcare diagnostics.", duration: "5.5 Years" },
    { name: "BDS (Dental)", careers: ["Dentist", "Orthodontist", "Dental Surgeon"], description: "Maxillofacial surgery, prosthodontics, cosmetic dentistry, and dental pathology.", duration: "4 Years" },
    { name: "BAMS/BHMS (AYUSH)", careers: ["AYUSH Practitioner", "Natural Medicine Consultant", "Wellness Center Director"], description: "Traditional Indian medical systems like Ayurveda and Homeopathy, holistic healthcare grids.", duration: "5.5 Years" },
    { name: "B.Sc Agriculture", careers: ["Agricultural Officer", "Agronomist", "Smart Farm Consultant"], description: "Crop production sciences, soil diagnostics, smart farm techniques, and organic breeding.", duration: "4 Years" },
    { name: "B.Pharmacy", careers: ["Pharmacist", "Drug Inspector", "R&D Scientist"], description: "Chemical drug synthesis, pharmacology, dosage optimization, and healthcare regulations.", duration: "4 Years" },
    { name: "B.Sc Nursing", careers: ["Clinical Registered Nurse", "Theater Nurse", "Ward Administrator"], description: "Patient care, operating theater backup, critical toxicology, and clinical ward administration.", duration: "4 Years" },
    { name: "Biotechnology / Food Tech", careers: ["Bio-process Engineer", "Food Safety Analyst", "Quality Controller"], description: "Enzymatic biochemistry, fermentation arrays, food preservation metrics, and genetic research.", duration: "4 Years" }
  ],
  MEC_CEC: [
    { name: "B.Com (Honors)", careers: ["Financial Analyst", "Corporate Accountant", "Investment Analyst"], description: "Advanced accounts ledger, audits, tax planning rules, corporate law, and commercial portfolio.", duration: "3 Years" },
    { name: "BBA (Business Administration)", careers: ["Management Trainee", "HR Partner", "Business Consultant"], description: "Organizational strategy, marketing funnels, employee behavior, and leadership parameters.", duration: "3 Years" },
    { name: "CA (Chartered Accountancy Foundation)", careers: ["Chartered Auditor", "Tax Consultant", "Finance Controller"], description: "Rigorous accounting standards, statutory audits, tax litigations, and forensic budgeting.", duration: "4 - 5 Years" },
    { name: "CS (Company Secretary)", careers: ["Corporate Compliance Officer", "Legal Advisor", "Board Secretary"], description: "Board structures, statutory secretarial standards, company laws, and compliance auditing.", duration: "3 Years" },
    { name: "B.A. Economics", careers: ["Economic Policy Researcher", "Data Analyst", "Financial Planner"], description: "Macro-economic matrices, market pricing theory, econometrics, and policy simulation models.", duration: "3 Years" },
    { name: "Integrated Law (BA LLB)", careers: ["Corporate Advocate", "Legal Consultant", "Legal Associate"], description: "Dual academic law degrees covering constitutional, civil, criminal, and business jurisprudence.", duration: "5 Years" }
  ],
  POLY: [
    { name: "B.Tech Lateral Entry (Direct 2nd Year via ECET)", careers: ["Specialist Design Engineer", "Tech Lead", "Process Engineer"], description: "Direct second-year admission bypass into professional engineering degree colleges.", duration: "3 Years" },
    { name: "AMIE Certification", careers: ["Corporate Licensed Engineer", "Project Supervisor", "Quality Lead"], description: "Distance-mode examination certification recognized-equivalent to standard B.Tech degrees.", duration: "3 Years" },
    { name: "Advanced Technical Diplomas", careers: ["Senior Testing Specialist", "Robotics Integrator", "R&D Lead"], description: "Niche advanced diplomas focusing on heavy industrial machinery and precision robotics.", duration: "1 - 2 Years" }
  ]
};

export const deriveStreamKey = (stream: string | null): 'MPC' | 'BiPC' | 'MEC_CEC' | 'POLY' | null => {
  if (!stream) return null;
  const s = stream.toUpperCase();
  if (s === 'POLY' || s.startsWith('POLY_') || s.includes('DIPLOMA') || s.includes('POLYTECHNIC') || POLYTECHNIC_DIPLOMAS.some(p => p.id === stream || p.name.toUpperCase() === s)) {
    return 'POLY';
  }
  if (s.includes('MPC') || s.includes('MATH') || s === '001') {
    return 'MPC';
  }
  if (s.includes('BIPC') || s.includes('BPC') || s.includes('BOTANY') || s.includes('ZOOLOGY') || s === '003') {
    return 'BiPC';
  }
  if (s.includes('MEC') || s.includes('CEC') || s.includes('HEC') || s.includes('COMMERCE') || s.includes('ECONOMICS') || s.includes('CIVICS') || s.includes('ARTS') || s.includes('HISTORY')) {
    return 'MEC_CEC';
  }
  return 'MPC';
};

export const getStreamKey = (name: string): 'MPC' | 'BiPC' | 'MEC_CEC' | 'POLY' | null => {
  return deriveStreamKey(name);
};

export const findMatchingGraduationDegree = (
  pathway: AcademicPathway,
  stream: string | null
): GraduationDegreeOption | null => {
  const streamKey = deriveStreamKey(stream);
  const normName = pathway.name.toLowerCase();
  
  // Custom manual mappings for precise matching
  if (normName.includes("b.tech") || normName.includes("engineering") || normName.includes("b.e")) {
    if (streamKey === 'POLY') {
      return ELIGIBILITY_MATRIX.POLY.find(d => d.name.includes("ECET")) || ELIGIBILITY_MATRIX.POLY[0];
    }
    return ELIGIBILITY_MATRIX.MPC.find(d => d.name.toLowerCase().includes("b.tech") || d.name.toLowerCase().includes("b.e")) || null;
  }
  
  if (normName.includes("mbbs") || normName.includes("surgery")) {
    return ELIGIBILITY_MATRIX.BiPC.find(d => d.name.includes("MBBS")) || null;
  }
  if (normName.includes("dental") || normName.includes("bds")) {
    return ELIGIBILITY_MATRIX.BiPC.find(d => d.name.includes("BDS")) || null;
  }
  if (normName.includes("pharmacy") || normName.includes("b.pharm")) {
    return ELIGIBILITY_MATRIX.BiPC.find(d => d.name.toLowerCase().includes("pharmacy") || d.name.toLowerCase().includes("b.pharm")) || null;
  }
  if (normName.includes("agriculture")) {
    return ELIGIBILITY_MATRIX.BiPC.find(d => d.name.toLowerCase().includes("agriculture")) || null;
  }
  if (normName.includes("nursing")) {
    return ELIGIBILITY_MATRIX.BiPC.find(d => d.name.toLowerCase().includes("nursing")) || null;
  }
  if (normName.includes("bca") || normName.includes("computer applications")) {
    return ELIGIBILITY_MATRIX.MPC.find(d => d.name.toLowerCase().includes("bca")) || null;
  }
  if (normName.includes("accountancy") || normName.includes("chartered") || normName.includes("ca")) {
    return ELIGIBILITY_MATRIX.MEC_CEC.find(d => d.name.includes("CA")) || null;
  }
  if (normName.includes("bba") || normName.includes("business administration") || normName.includes("management")) {
    return ELIGIBILITY_MATRIX.MEC_CEC.find(d => d.name.includes("BBA")) || null;
  }
  if (normName.includes("law") || normName.includes("llb")) {
    return ELIGIBILITY_MATRIX.MEC_CEC.find(d => d.name.toLowerCase().includes("law") || d.name.toLowerCase().includes("llb")) || null;
  }
  if (normName.includes("nda") || normName.includes("defence")) {
    return ELIGIBILITY_MATRIX.MPC.find(d => d.name.includes("NDA")) || null;
  }
  if (normName.includes("b.com") || normName.includes("commerce")) {
    return ELIGIBILITY_MATRIX.MEC_CEC.find(d => d.name.includes("B.Com")) || null;
  }
  if (normName.includes("pilot") || normName.includes("aviation")) {
    return ELIGIBILITY_MATRIX.MPC.find(d => d.name.toLowerCase().includes("pilot")) || null;
  }
  if (normName.includes("arch")) {
    return ELIGIBILITY_MATRIX.MPC.find(d => d.name.toLowerCase().includes("b.arch")) || null;
  }
  
  // Generic lookup in ELIGIBILITY_MATRIX as a fallback
  for (const streamKey in ELIGIBILITY_MATRIX) {
    const list = ELIGIBILITY_MATRIX[streamKey];
    for (const deg of list) {
      if (normName.includes(deg.name.toLowerCase()) || deg.name.toLowerCase().includes(normName)) {
        return deg;
      }
    }
  }
  
  return null;
};

export const getEquivalentCourseIds = (courseId: string): string[] => {
  const cid = courseId.toLowerCase().trim();
  if (cid === "inter_001" || cid === "mpc") {
    return ["inter_001", "mpc", "Intermediate MPC (Maths, Physics, Chemistry)", "Intermediate MPC (Code: 001)"];
  }
  if (cid === "inter_002" || cid === "mec") {
    return ["inter_002", "mec", "Intermediate MEC (Mathematics, Economics, Commerce)", "Intermediate MEC (Code: 002)"];
  }
  if (cid === "inter_003" || cid === "bipc" || cid === "bpc") {
    return ["inter_003", "bipc", "bpc", "Intermediate BiPC (Biology, Physics, Chemistry)", "Intermediate BiPC (Code: 003)"];
  }
  if (cid === "inter_004" || cid === "cec") {
    return ["inter_004", "cec", "Intermediate CEC (Civics, Economics, Commerce)", "Intermediate CEC (Code: 004)"];
  }
  if (cid === "inter_005" || cid === "hec") {
    return ["inter_005", "hec", "Intermediate HEC (History, Economics, Civics)", "Intermediate HEC (Code: 005)"];
  }
  return [courseId];
};

export const isCourseIdEquivalent = (idA?: string | null, idB?: string | null): boolean => {
  if (!idA || !idB) return false;
  
  const clean = (id: string) => {
    return id.toLowerCase()
      .trim()
      // Remove prefixes
      .replace(/^(inter|poly|iti|grad)[\s_|-]+/, '')
      // Remove common words and suffixes
      .replace(/[\s_|-]*(trainee|certification|specialist|course|degree|specialization|trade|diploma|group|in|of|and)[\s_|-]*/g, '_')
      // Clean up multiple underscores
      .replace(/_+/g, '_')
      // Strip outer underscores
      .replace(/^_+|_+$/g, '');
  };

  const a = idA.toLowerCase().trim();
  const b = idB.toLowerCase().trim();
  if (a === b) return true;

  const ca = clean(idA);
  const cb = clean(idB);
  if (ca === cb && ca !== "") return true;

  // Let's do common short code expansions/aliases
  const getAliases = (val: string): string[] => {
    const c = val.toLowerCase().trim().replace(/[\s_|-]+/g, '');
    if (c === 'mpc' || c === '001' || c === 'inter001' || c === 'intermpc') {
      return ['mpc', '001', 'inter001', 'intermpc', 'intermediate_mpc'];
    }
    if (c === 'mec' || c === '002' || c === 'inter002' || c === 'intermec') {
      return ['mec', '002', 'inter002', 'intermec', 'intermediate_mec'];
    }
    if (c === 'bipc' || c === 'bpc' || c === '003' || c === 'inter003' || c === 'interbipc' || c === 'interbpc') {
      return ['bipc', 'bpc', '003', 'inter003', 'interbipc', 'interbpc', 'intermediate_bipc'];
    }
    if (c === 'cec' || c === '004' || c === 'inter004' || c === 'intercec') {
      return ['cec', '004', 'inter004', 'intercec', 'intermediate_cec'];
    }
    if (c === 'hec' || c === '005' || c === 'inter005' || c === 'interhec') {
      return ['hec', '005', 'inter005', 'interhec', 'intermediate_hec'];
    }

    // Polytechnic branch matches
    if (c.includes('computer') || c.includes('cse')) {
      return ['poly_computer', 'computer_engineering', 'computer', 'cse', 'diploma_computer', 'poly_diploma_in_computer_science_engineering', 'btech_cs'];
    }
    if (c.includes('ece') || (c.includes('electronics') && c.includes('communication')) || c.includes('btechece')) {
      return ['poly_ece', 'electronics_communication', 'ece', 'diploma_ece', 'poly_diploma_in_electronics_and_communication_engineering', 'btech_ece'];
    }
    if (c.includes('eee') || c.includes('electrical') || c.includes('btecheee')) {
      return ['poly_electrical', 'electrical_engineering', 'electrical', 'eee', 'diploma_eee', 'poly_diploma_in_electrical_and_electronics_engineering', 'electrical_electronics', 'btech_eee'];
    }
    if (c.includes('mechanical') || c.includes('btechmech')) {
      return ['poly_mechanical', 'mechanical_engineering', 'mechanical', 'diploma_mechanical', 'poly_diploma_in_mechanical_engineering', 'btech_mechanical', 'btech_mech'];
    }
    if (c.includes('civil')) {
      return ['poly_civil', 'civil_engineering', 'civil', 'diploma_civil', 'poly_diploma_in_civil_engineering'];
    }

    // ITI matches
    if (c.includes('electrician')) {
      return ['electrician', 'iti_electrician', 'electrician_industry', 'trainee_electrician'];
    }
    if (c.includes('fitter')) {
      return ['fitter', 'iti_fitter', 'machinist_fitter', 'fitter_machinist'];
    }
    if (c.includes('electronicsrepair') || c.includes('electronicsmechanic')) {
      return ['electronics_mechanics', 'electronics_mechanic', 'electronics_repair'];
    }
    if (c.includes('welder') || c.includes('welding')) {
      return ['welder', 'welding', 'welding_foundry'];
    }
    if (c.includes('diesel') || c.includes('motorvehicle')) {
      return ['mechanic_motor_vehicle', 'motor_vehicle_mechanic', 'diesel_mechanic'];
    }

    // Graduation matches
    if (c.includes('btechcs') || c.includes('btechcomputer') || c.includes('computerscience') || c.includes('btech_cs') || c.includes('btechcse')) {
      return ['btech_cse', 'btech_cs', 'grad_b_tech_in_cs', 'grad_btech_cs', 'grad_btech_computer_science_engineering', 'computer_science', 'cse'];
    }
    if (c.includes('medicine') || c.includes('mbbs') || c.includes('mbbsgen')) {
      return ['medicine_mbbs', 'mbbs', 'bachelor_of_medicine', 'mbbs_gen'];
    }
    if (c.includes('dental') || c.includes('bds')) {
      return ['medicine_bds', 'bds', 'dental'];
    }
    if (c.includes('pharmacy') || c.includes('bpharm')) {
      return ['b_pharmacy', 'pharmacy', 'bpharm'];
    }
    if (c.includes('agriculture') || c.includes('smartfarming')) {
      return ['bsc_agriculture', 'agriculture', 'smart_farming'];
    }
    if (c.includes('bca') || c.includes('computerapplications') || c.includes('bcasoftware')) {
      return ['bca_applications', 'bca', 'computer_applications', 'bca_software'];
    }
    if (c.includes('law') || c.includes('llb') || c.includes('integratedlaw')) {
      return ['integrated_law', 'law', 'llb'];
    }
    if (c.includes('nda') || c.includes('defence') || c.includes('defense')) {
      return ['nda_defence', 'nda', 'defense', 'defence'];
    }
    if (c.includes('bcom') || c.includes('commerce') || c.includes('bcomfinance')) {
      return ['b_com_hons', 'bcom', 'commerce', 'bcom_finance'];
    }
    if (c.includes('nursing')) {
      return ['bsc_nursing', 'nursing'];
    }
    
    return [c];
  };

  const aliasA = getAliases(idA);
  const aliasB = getAliases(idB);

  // Check if any alias from idA matches any alias from idB
  const matchFound = aliasA.some(x => aliasB.includes(x)) || aliasB.some(x => aliasA.includes(x));
  if (matchFound) return true;

  // Final fallback helper lookup
  const eqA = getEquivalentCourseIds(a);
  const eqB = getEquivalentCourseIds(b);
  
  if (eqA.some(x => eqB.includes(x)) || eqB.some(x => eqA.includes(x))) {
    return true;
  }

  // Check wildcard matches
  if (ca !== "" && cb !== "") {
    if (ca.includes(cb) || cb.includes(ca)) {
      return true;
    }
  }

  return false;
};

const memoryStorage: Record<string, string> = {};
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage access blocked, using in-memory backup:", e);
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage access blocked, using in-memory backup:", e);
    }
    memoryStorage[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage access blocked, using in-memory backup:", e);
    }
    delete memoryStorage[key];
  }
};

function NewsletterSignupForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  if (subscribed) {
    return (
      <div className="p-3 bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 text-xs font-mono rounded flex items-center gap-2 animate-fadeIn">
        <span>⚡ You're subscribed! Stay tuned for pathway updates & scholarships.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email..."
        className="px-3.5 py-2.5 bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-400 text-xs font-mono focus:outline-none focus:border-lime-400 w-full rounded"
      />
      <button
        type="submit"
        className="px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-mono font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 shrink-0"
      >
        SIGN UP →
      </button>
    </form>
  );
}

// =========================================================================
// SKELETON LOADING COMPONENTS FOR STUDENT DASHBOARD & PERCEIVED PERFORMANCE
// =========================================================================

export function CommentSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="border-2 border-black/20 dark:border-zinc-750 bg-stone-100/90 dark:bg-zinc-900/80 p-4 relative space-y-3 animate-pulse rounded"
        >
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1.5 flex-1">
              <div className="w-28 h-4 bg-stone-300 dark:bg-zinc-700 rounded border border-black/10" />
              <div className="flex items-center gap-2 pt-1">
                <div className="w-24 h-3.5 bg-stone-300 dark:bg-zinc-700 rounded" />
                <div className="w-16 h-3 bg-amber-300/60 dark:bg-amber-500/30 rounded" />
              </div>
            </div>
            <div className="w-20 h-6 bg-stone-250 dark:bg-zinc-800 rounded border border-black/10" />
          </div>

          <div className="space-y-2 pt-2 border-t border-dashed border-stone-250 dark:border-zinc-800">
            <div className="w-full h-3.5 bg-stone-250 dark:bg-zinc-800 rounded" />
            <div className="w-11/12 h-3.5 bg-stone-200 dark:bg-zinc-800/80 rounded" />
            <div className="w-3/4 h-3 bg-stone-200 dark:bg-zinc-800/60 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AiAdvisorSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="w-full border-2 border-black/20 dark:border-zinc-750 bg-white dark:bg-zinc-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)] rounded animate-pulse space-y-6">
      {/* Skeleton Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500/20 dark:bg-blue-400/20 border border-blue-600/30 rounded-full animate-bounce" />
          <div className="w-48 h-4 bg-stone-300 dark:bg-zinc-700 rounded" />
        </div>
        <div className="w-32 h-5 bg-amber-200/80 dark:bg-amber-950/60 rounded border border-black/10 font-mono" />
      </div>

      {/* Status progress indicator bar */}
      <div className="bg-blue-50 dark:bg-zinc-800/60 border border-blue-200 dark:border-zinc-700 p-3 rounded flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping" />
          <span className="text-[10px] font-mono font-bold text-blue-900 dark:text-blue-300 uppercase tracking-widest">// ACCESSING DIRPA AI COUNSELING ENGINE...</span>
        </div>
        <div className="w-20 h-2 bg-blue-300/60 dark:bg-zinc-600 rounded" />
      </div>

      {/* Executive Summary Skeleton */}
      <div className="space-y-2 bg-stone-50 dark:bg-zinc-950/40 p-4 border border-stone-200 dark:border-zinc-800 rounded">
        <div className="w-36 h-3 bg-stone-300 dark:bg-zinc-700 rounded mb-2" />
        <div className="w-full h-3.5 bg-stone-250 dark:bg-zinc-800 rounded" />
        <div className="w-11/12 h-3.5 bg-stone-200 dark:bg-zinc-800/80 rounded" />
        <div className="w-4/5 h-3.5 bg-stone-200 dark:bg-zinc-800/60 rounded" />
      </div>

      {/* 2-Column Grid of Skeleton Sections */}
      <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-4`}>
        <div className="border border-stone-250 dark:border-zinc-800 p-4 bg-stone-50/80 dark:bg-zinc-850/50 space-y-3 rounded">
          <div className="w-28 h-3.5 bg-blue-300/50 dark:bg-blue-500/30 rounded" />
          <div className="w-full h-3 bg-stone-250 dark:bg-zinc-750 rounded" />
          <div className="w-5/6 h-3 bg-stone-200 dark:bg-zinc-800 rounded" />
          <div className="w-3/4 h-3 bg-stone-200 dark:bg-zinc-800/70 rounded" />
        </div>

        <div className="border border-stone-250 dark:border-zinc-800 p-4 bg-stone-50/80 dark:bg-zinc-850/50 space-y-3 rounded">
          <div className="w-32 h-3.5 bg-emerald-300/50 dark:bg-emerald-500/30 rounded" />
          <div className="w-full h-3 bg-stone-250 dark:bg-zinc-750 rounded" />
          <div className="w-5/6 h-3 bg-stone-200 dark:bg-zinc-800 rounded" />
          <div className="w-2/3 h-3 bg-stone-200 dark:bg-zinc-800/70 rounded" />
        </div>
      </div>

      {/* Tags Skeleton */}
      <div className="flex flex-wrap gap-2 pt-2">
        <div className="w-24 h-6 bg-stone-200 dark:bg-zinc-800 rounded-full" />
        <div className="w-28 h-6 bg-stone-200 dark:bg-zinc-800 rounded-full" />
        <div className="w-20 h-6 bg-stone-200 dark:bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
}

export function PathwayCardSkeletonGrid({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-2 border-black/20 dark:border-zinc-750 bg-white dark:bg-zinc-900 p-6 space-y-4 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center">
            <div className="w-24 h-4 bg-amber-200 dark:bg-amber-950/60 rounded border border-black/10" />
            <div className="w-16 h-4 bg-blue-100 dark:bg-blue-950/60 rounded border border-black/10" />
          </div>
          <div className="w-3/4 h-6 bg-stone-300 dark:bg-zinc-700 rounded" />
          <div className="space-y-2">
            <div className="w-full h-3.5 bg-stone-200 dark:bg-zinc-800 rounded" />
            <div className="w-5/6 h-3.5 bg-stone-200 dark:bg-zinc-800/80 rounded" />
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-dashed border-stone-200 dark:border-zinc-800">
            <div className="w-28 h-4 bg-stone-250 dark:bg-zinc-800 rounded" />
            <div className="w-20 h-7 bg-stone-300 dark:bg-zinc-700 rounded border border-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showLandingAnimation, setShowLandingAnimation] = useState<boolean>(true);
  const handleLandingAnimationComplete = React.useCallback(() => {
    setShowLandingAnimation(false);
  }, []);
  const [activeLogo, setActiveLogo] = useState<LogoStyle>(getActiveLogoStyle());
  const [showPost10thChoice, setShowPost10thChoice] = useState<boolean>(false);
  const [heroTitleIndex, setHeroTitleIndex] = useState<number>(0);

  const heroTitles = [
    "DON'T FOLLOW THE CROWD, FIND YOUR PATH",
    "भीड़ का पीछा न करें, अपना रास्ता खोजें",
    "గుంపును అనుసరించవద్దు, మీ మార్గాన్ని కనుగొనండి",
    "கூட்டத்தைப் பின்தொடராதே, உனக்கான பாதையைக் கண்டறி"
  ];

  useEffect(() => {
    const handleLogoUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<LogoStyle>;
      if (customEvent.detail) {
        setActiveLogo(customEvent.detail);
      }
    };
    window.addEventListener('dirpa_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('dirpa_logo_updated', handleLogoUpdate);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    safeLocalStorage.setItem('dirpa-theme', 'light');
    setIsDarkMode(false);
    seedIllustrationsToFirestore();
  }, []);

  // Real Google Sign-in Auth session persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userEmail = firebaseUser.email || `sandbox.${firebaseUser.uid}@dirpa.org`;
          
          // Check if this UID is blocked
          const blockRef = doc(db, 'blocked_users', firebaseUser.uid);
          const blockSnap = await getDoc(blockRef);
          if (blockSnap.exists()) {
            alert("This account has been deactivated and blocked due to receiving 3 or more independent user reports of suspicious or malicious activity. Access is permanently revoked.");
            await signOut(auth);
            setUser(null);
            setInitializingAuth(false);
            setGlobalLoading(false);
            setAuthLoading(false);
            setCurrentView('landing');
            return;
          }

          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const loggedInUser = {
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || 'Google User',
              email: userEmail,
              role: data.role || 'student',
              avatar: data.avatar || data.photoURL || firebaseUser.photoURL || '',
              interests: data.interests || [],
              strengths: data.strengths || [],
              careerGoal: data.careerGoal || '',
              bio: data.bio || '',
              onboarded: data.onboarded || false,
              hasSubmittedPlatformFeedback: data.hasSubmittedPlatformFeedback || false,
              timeline: data.timeline || []
            };
            setUser(loggedInUser as any);
            if (data.savedPathIds && Array.isArray(data.savedPathIds)) {
              setSavedPathIds(data.savedPathIds);
            }
            // Redirect from landing/auth/role-selection page once logged in
            if (loggedInUser.role === 'alumni' && !loggedInUser.onboarded) {
              setCurrentView('alumni-onboarding');
            } else {
              setCurrentView(prev => (prev === 'landing' || prev === 'auth' || prev === 'role-selection') ? 'dashboard' : prev);
            }
          } else {
            // New User Flow: User Not Found, trigger role-selection screen
            setTempGoogleUser({
              ...firebaseUser,
              email: userEmail,
              displayName: firebaseUser.displayName || 'Google Sandbox User'
            } as any);
            setCurrentView('role-selection');
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error restoring user session:", error);
      } finally {
        setInitializingAuth(false);
        setGlobalLoading(false);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Synchronize saved pathways and dynamic graduate reviews from Express backend on start
  useEffect(() => {
    const startSync = async () => {
      try {
        const response = await fetch("/api/bookmarks");
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.savedPathIds)) {
            setSavedPathIds(data.savedPathIds);
          }
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks from backend:", err);
      }
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.reviews)) {
            setDynamicPathways(prev => {
              return prev.map(p => {
                const matchedReviews = data.reviews.filter((r: any) => r.pathwayId === p.id);
                if (matchedReviews.length > 0) {
                  const nonDuplicateNew = matchedReviews.filter((r: any) => !p.alumniInsights.some(ex => ex.id === r.id));
                  return {
                    ...p,
                    alumniInsights: [...nonDuplicateNew, ...p.alumniInsights]
                  };
                }
                return p;
              });
            });
          }
        }
      } catch (err) {
        console.error("Failed to sync submitted graduate reviews from backend:", err);
      }
    };
    startSync();
  }, []);

  // Navigation & User views
  // 'landing' | 'auth' | 'dashboard' | 'saved' | 'messages' | 'profile' | 'roadmap' | 'insights' | 'role-selection'
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard' | 'saved' | 'messages' | 'profile' | 'ai-advisor' | 'insights' | 'about' | 'role-selection' | 'alumni-onboarding' | 'reset-password' | 'onet-careers' | 'entrance-exams' | 'scholarships' | 'companies' | 'bullets' | 'stuff'>('landing');

  useEffect(() => {
    if (currentView === 'landing') {
      const interval = setInterval(() => {
        setHeroTitleIndex((prev) => (prev + 1) % heroTitles.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentView, heroTitles.length]);
  const [selectedNav, setSelectedNav] = useState<'home' | 'messages' | 'saved' | 'profile' | 'ai-advisor' | 'insights' | 'about' | 'onet-careers' | 'entrance-exams' | 'scholarships' | 'companies' | 'bullets' | 'stuff'>('home');
  const [previousView, setPreviousView] = useState<'landing' | 'auth' | 'dashboard' | 'saved' | 'messages' | 'profile' | 'ai-advisor' | 'about' | 'onet-careers' | 'entrance-exams' | 'scholarships' | 'companies' | 'bullets' | 'stuff'>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on desktop resize or Escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Lock background body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // User Authentication State
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'student' | 'alumni';
    avatar: string;
    interests: string[];
    strengths: string[];
    careerGoal: string;
    bio?: string;
    onboarded?: boolean;
    hasSubmittedPlatformFeedback?: boolean;
    timeline?: any[];
  } | null>(null);

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'alumni',
    avatar: '',
    isGoogle: false,
    bio: ''
  });

  const [signupStep, setSignupStep] = useState(1);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authFieldErrors, setAuthFieldErrors] = useState<Record<string, string>>({});

  // Search & Zoom states for the interactive map
  const [mapZoom, setMapZoom] = useState<number>(1.0);
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileEditForm, setProfileEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [profileEditErrors, setProfileEditErrors] = useState<Record<string, string>>({});
  const [profileEditErrorBanner, setProfileEditErrorBanner] = useState<string | null>(null);
  const [profileFeedbackError, setProfileFeedbackError] = useState<string | null>(null);

  // Profile picture customization variables
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showIllustrationsModal, setShowIllustrationsModal] = useState<boolean>(false);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const illustrationGridRef = React.useRef<HTMLDivElement>(null);

  // PDF Flowchart export states & references
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const flowchartRef = React.useRef<HTMLDivElement>(null);
  const careerFlowchartRef = React.useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const compressImageDataUrl = (dataUrl: string, maxDim = 256, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleUpdateAvatarDirectly = async (newAvatar: string) => {
    if (!user) return;

    let finalAvatar = newAvatar;
    if (newAvatar && newAvatar.startsWith('data:image/')) {
      finalAvatar = await compressImageDataUrl(newAvatar, 256, 0.75);
    }

    const updatedUser = {
      ...user,
      avatar: finalAvatar
    };
    setUser(updatedUser);
    setProfileEditForm(prev => ({ ...prev, avatar: finalAvatar }));

    const updatedRecords = registeredUsers.map(u => {
      if (u.id === user.id || (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase())) {
        return {
          ...u,
          avatar: finalAvatar
        };
      }
      return u;
    });
    setRegisteredUsers(updatedRecords);
    safeLocalStorage.setItem('dirpa_registered_users', JSON.stringify(updatedRecords));

    // Save directly to Firestore for full persistence
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        avatar: finalAvatar,
        photoURL: finalAvatar,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Firestore avatar update error:", err);
    }

    // 1. Update platformReviews in local state
    setPlatformReviews(prev => prev.map(rev => {
      const isAuthor = rev.userId === user.id || 
                       (user.email && (rev.userEmail === user.email || rev.authorEmail === user.email || rev.email === user.email)) || 
                       (user.name && rev.name && rev.name.toLowerCase() === user.name.toLowerCase());
      return isAuthor ? { ...rev, avatar: finalAvatar, photoURL: finalAvatar } : rev;
    }));

    // 2. Update dbFeedbacks and courseReviews in local state
    setDbFeedbacks(prev => prev.map(fb => {
      const isAuthor = fb.userId === user.id || 
                       (user.email && (fb.userEmail === user.email || fb.authorEmail === user.email || fb.email === user.email)) || 
                       (user.name && fb.name && fb.name.toLowerCase() === user.name.toLowerCase());
      return isAuthor ? { ...fb, avatar: finalAvatar, authorAvatar: finalAvatar } : fb;
    }));

    setCourseReviews(prev => prev.map(cr => {
      const isAuthor = cr.userId === user.id || 
                       (user.email && (cr.userEmail === user.email || cr.authorEmail === user.email || cr.email === user.email)) || 
                       (user.name && cr.name && cr.name.toLowerCase() === user.name.toLowerCase());
      return isAuthor ? { ...cr, avatar: finalAvatar, authorAvatar: finalAvatar } : cr;
    }));

    // 3. Update current comments authored by this user
    setDynamicPathways(prev => prev.map(p => ({
      ...p,
      alumniInsights: p.alumniInsights.map(ins => {
        if ((user.email && ins.authorEmail === user.email) || (ins as any).userId === user.id || (user.name && ins.name && ins.name.toLowerCase() === user.name.toLowerCase())) {
          return {
            ...ins,
            avatar: finalAvatar
          };
        }
        return ins;
      })
    })));

    // 4. Update chat threads in local state
    setChatThreads(prev => prev.map((t: any) => {
      let updated = { ...t };
      if (t.userId === user.id || (user.email && t.userEmail === user.email)) {
        updated.userAvatar = finalAvatar;
      }
      if (t.alumniId === user.id || (user.email && t.alumniEmail === user.email) || (user.name && t.alumniName && t.alumniName.toLowerCase() === user.name.toLowerCase())) {
        updated.alumniAvatar = finalAvatar;
      }
      return updated;
    }));

    // 5. Update documents in Firestore platform_reviews collection if user authored any
    try {
      const pCol = collection(db, 'platform_reviews');
      const pSnap = await getDocs(pCol);
      pSnap.forEach(async (dSnap) => {
        const d = dSnap.data();
        const isAuthor = d.userId === user.id || 
                         (user.email && (d.userEmail === user.email || d.authorEmail === user.email || d.email === user.email)) || 
                         (user.name && d.name && d.name.toLowerCase() === user.name.toLowerCase());
        if (isAuthor) {
          await updateDoc(doc(db, 'platform_reviews', dSnap.id), { avatar: finalAvatar, photoURL: finalAvatar });
        }
      });
    } catch (e) {
      console.error("Firestore platform_reviews avatar sync error:", e);
    }

    // 6. Update documents in Firestore feedbacks collection if user authored any
    try {
      const fCol = collection(db, 'feedbacks');
      const fSnap = await getDocs(fCol);
      fSnap.forEach(async (dSnap) => {
        const d = dSnap.data();
        const isAuthor = d.userId === user.id || 
                         (user.email && (d.userEmail === user.email || d.authorEmail === user.email || d.email === user.email)) || 
                         (user.name && d.name && d.name.toLowerCase() === user.name.toLowerCase());
        if (isAuthor) {
          await updateDoc(doc(db, 'feedbacks', dSnap.id), { avatar: finalAvatar, authorAvatar: finalAvatar });
        }
      });
    } catch (e) {
      console.error("Firestore feedbacks avatar sync error:", e);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const compressed = await compressImageDataUrl(base64String, 256, 0.75);
      handleUpdateAvatarDirectly(compressed);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    if (!user) return;
    handleUpdateAvatarDirectly('');
    setShowPhotoModal(false);
  };

  // Comment engagement hub state variables
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');
  const [editAdviceText, setEditAdviceText] = useState<string>('');
  const [editRating, setEditRating] = useState<number>(5);
  const [commentReplyInputs, setCommentReplyInputs] = useState<{[key: string]: string}>({});
  const [insightsFilterPathway, setInsightsFilterPathway] = useState<string>('all');
  const [insightsSearchQuery, setInsightsSearchQuery] = useState<string>('');

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = safeLocalStorage.getItem('dirpa_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const defaults = [
      {
        id: 'user_alumni_expert',
        email: 'mentor@dirpa.org',
        password: 'password',
        name: 'DIRPA Expert Mentor',
        role: 'alumni' as const,
        avatar: '👨‍💻',
        bio: 'DIRPA platform administrator and academic pathways mentor.',
        interests: ['Academic Counseling', 'Career Planning'],
        strengths: ['Curriculum Engineering', 'Job Placement'],
        careerGoal: 'Education Director'
      }
    ];
    safeLocalStorage.setItem('dirpa_registered_users', JSON.stringify(defaults));
    return defaults;
  });

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Active Roadmap Selection
  const [activeLevel, setActiveLevel] = useState<'10th' | '12th' | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<AcademicPathway | null>(null);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniInsight | null>(null);
  const [selectedAlumniProfile, setSelectedAlumniProfile] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportingAlumniId, setReportingAlumniId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>('Spam or Advertising');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [editingFeedbackText, setEditingFeedbackText] = useState<string>('');
  const [searchMethod, setSearchMethod] = useState<'none' | 'job' | 'class'>('none');
  const [jobQuery, setJobQuery] = useState<string>('');
  const [isCalculatingJobs, setIsCalculatingJobs] = useState<boolean>(false);

  useEffect(() => {
    if (jobQuery.trim() !== '') {
      setIsCalculatingJobs(true);
      const timer = setTimeout(() => {
        setIsCalculatingJobs(false);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setIsCalculatingJobs(false);
    }
  }, [jobQuery]);

  // Graduation funnel state
  const [selectedGraduationDegree, setSelectedGraduationDegree] = useState<GraduationDegreeOption | null>(null);
  const [isGradFunnelActive, setIsGradFunnelActive] = useState<boolean>(false);
  const [selectedSpecCourse, setSelectedSpecCourse] = useState<SpecializationCourse | null>(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobDetailInfo | null>(null);

  const [selected12thType, setSelected12thType] = useState<'Intermediate' | 'Polytechnic' | null>(null);
  const [selected12thStream, setSelected12thStream] = useState<string | null>(null);
  const [interSearchQuery, setInterSearchQuery] = useState<string>('');
  const [interCategoryFilter, setInterCategoryFilter] = useState<'All' | 'Science' | 'Commerce' | 'Arts'>('All');
  const [polySearchQuery, setPolySearchQuery] = useState<string>('');
  const [polyCategoryFilter, setPolyCategoryFilter] = useState<'All' | 'Engineering' | 'Non-Engineering'>('All');
  const [selectedFlowNode, setSelectedFlowNode] = useState<{ id: string; type: 'intermediate' | 'graduation'; name: string; data?: any } | null>(null);

  useEffect(() => {
    setSelected12thType(null);
    setSelected12thStream(null);
  }, [activeLevel]);

  useEffect(() => {
    setSelectedGraduationDegree(null);
    setSelectedSpecCourse(null);
    setSelectedJobDetail(null);
  }, [selectedPathway?.id]);

  const handleSelect12thStream = (streamName: string, streamType: 'Intermediate' | 'Polytechnic', details?: any) => {
    setSelected12thStream(streamName);
    const streamKey = deriveStreamKey(streamName) || 'MPC';
    const defaultDegree = ELIGIBILITY_MATRIX[streamKey]?.[0] || null;

    const pathwayObj: AcademicPathway = {
      id: details?.code || details?.id || 'stream_' + streamName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      level: '12th',
      category: streamType === 'Polytechnic' ? (details?.isEngineering ? 'Engineering' : 'Specialized') : (streamKey === 'MPC' ? 'Engineering' : streamKey === 'BiPC' ? 'Medical' : 'Commerce'),
      name: streamName,
      duration: streamType === 'Polytechnic' ? '3 Years' : '2 Years',
      eligibility: details?.subjects ? details.subjects.filter((s: string) => s && s !== '-').join(', ') : 'Completed 10th Standard',
      subjects: details?.subjects ? details.subjects.filter((s: string) => s && s !== '-') : [streamName],
      estimatedFees: streamType === 'Polytechnic' ? '₹4,700 - ₹25,000 / year' : '₹5,000 - ₹30,000 / year',
      description: details?.description || `Completed ${streamType} specialization: ${streamName}. Unlocks targeted university degree tracks.`,
      futureOpportunities: details?.nextStudies || (streamKey === 'MPC' ? ['B.Tech / B.E', 'B.Arch', 'BCA', 'B.Sc Maths'] : streamKey === 'BiPC' ? ['MBBS', 'BDS', 'B.Pharm', 'B.Sc Agri'] : ['B.Com', 'BBA', 'CA', 'BA LLB']),
      higherEducationOptions: details?.nextStudies || [],
      careerOutcomes: details?.nextStudies || [],
      nodePosition: { x: 50, y: 50 },
      alumniInsights: []
    };

    setSelectedPathway(pathwayObj);
    if (defaultDegree) {
      setSelectedGraduationDegree(defaultDegree);
    }
    setIsGradFunnelActive(true);
  };

  useEffect(() => {
    setSelectedSpecCourse(null);
    setSelectedJobDetail(null);
  }, [selectedGraduationDegree]);

  useEffect(() => {
    setSelectedJobDetail(null);
  }, [selectedSpecCourse]);

  const handleSubmitFlowchartFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPathway) return;
    if (!flowchartFeedbackText.trim()) return;

    setIsSubmittingFlowchartFeedback(true);
    const feedbackId = `ff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const path = `flowchart_feedbacks/${feedbackId}`;

    const feedbackPayload = {
      id: feedbackId,
      userId: user?.id || "anonymous",
      userEmail: flowchartFeedbackEmail.trim() || user?.email || "anonymous",
      userName: user?.name || "Anonymous Student",
      pathwayId: selectedPathway.id,
      pathwayName: selectedPathway.name,
      feedbackType: flowchartFeedbackType,
      feedbackText: flowchartFeedbackText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "flowchart_feedbacks", feedbackId), feedbackPayload);
      setFlowchartFeedbackSubmitted(true);
      setFlowchartFeedbackText('');
      setTimeout(() => {
        setFlowchartFeedbackSubmitted(false);
        setFlowchartFeedbackOpen(false);
      }, 4000);
    } catch (err) {
      console.error("Failed to save flowchart feedback in Firestore:", err);
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsSubmittingFlowchartFeedback(false);
    }
  };

  const renderFlowchart = () => {
    if (!selectedPathway) return null;
    return (
      <div className="bg-amber-50/10 flex flex-col justify-between space-y-6 text-black h-full">
        <div>
          <div className="flex justify-between items-center border-b border-black pb-3 mb-5">
            <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-black font-display">
              🗺️ Progression Flowchart
            </h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleSavePath(selectedPathway.id)}
                className={`p-2 border border-black text-[10px] font-bold uppercase transition-transform hover:scale-105 flex items-center gap-1 ${savedPathIds.includes(selectedPathway.id) ? 'bg-yellow-300 text-black border-yellow-400 font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black'}`}
                title="Save Chart"
              >
                <Bookmark className={`w-3 h-3 ${savedPathIds.includes(selectedPathway.id) ? 'fill-current' : ''}`} />
                {savedPathIds.includes(selectedPathway.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Timeline Flow Wrapper with pristine style for PDF capturing */}
          <div ref={flowchartRef} className="bg-white p-5 border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6 relative overflow-hidden">
            
            {/* Premium Dynamic Academic Header block that prints beautifully inside the PDF */}
            <div className="border-b-2 border-dashed border-black pb-4 flex justify-between items-start gap-3">
              <div>
                <span className="text-[9px] font-mono font-black text-blue-700 block uppercase tracking-wider">// DIRPA OFFICIAL CAREER MAP</span>
                <h3 className="text-xs font-black uppercase text-black font-display tracking-tight leading-tight mt-0.5">
                  Route: {selectedPathway.name}
                </h3>
                <p className="text-[8.5px] text-zinc-500 font-bold font-mono tracking-tighter mt-1">
                  Generated on {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} // Verified Route Blueprint
                </p>
              </div>
              
              {/* Clickable PDF download badge inside the flowchart itself */}
              <button
                type="button"
                onClick={() => exportAcademicRoadmapPDF(flowchartRef.current, selectedPathway?.name)}
                disabled={isExportingPDF}
                data-html2canvas-ignore="true"
                className={`px-3 py-1.5 border-2 border-black text-[9px] font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-red-50 hover:text-red-700 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 bg-white shrink-0 rounded`}
                title="Click to Download this Flowchart as High-Resolution PDF"
              >
                {isExportingPDF ? (
                  <>
                    <div className="w-2.5 h-2.5 border-2 border-t-red-600 border-transparent rounded-full animate-spin"></div>
                    <span className="text-[8.5px]">Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-red-600" />
                    <span>Export PDF</span>
                  </>
                )}
              </button>
            </div>

            {/* Timeline Flow with Horizontal scroll configuration for mobile devices */}
            <div className="overflow-x-auto -mx-5 px-5 pb-4 md:overflow-x-visible md:mx-0 md:px-0 md:pb-0 scrollbar-thin scrollbar-thumb-black">
              <div className="relative flex flex-row md:flex-col gap-6 md:gap-0 md:space-y-6 pt-2 pb-2 min-w-[760px] md:min-w-0 md:border-l-2 md:border-dashed md:border-black/50 md:ml-3 md:pl-5">
                
                {/* Horizontal line connector specifically for mobile layout */}
                <div className="absolute left-3 right-6 top-[13.5px] h-0.5 border-t-2 border-dashed border-black/40 md:hidden z-0" />

                {/* Step 1: 10th Standard Completed */}
                <div className="relative text-black text-left shrink-0 w-[180px] md:w-auto z-10 flex flex-col justify-start">
                  <div className="absolute left-0 -top-1 md:-left-[28px] md:top-1.5 w-3 h-3 rounded-full border border-black bg-zinc-300 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-20"></div>
                  <div className="space-y-1 mt-4 md:mt-0">
                    <span className="text-[8.5px] font-mono font-black uppercase text-zinc-900 block">// STEP 01</span>
                    <h5 className="text-[11px] font-black uppercase text-black leading-none">10th Standard Finished</h5>
                    <p className="text-[10px] text-zinc-900 leading-relaxed font-sans font-semibold break-words whitespace-normal">
                      Foundation level completed. Specialty streams start here.
                    </p>
                  </div>
                </div>

                {/* Step 2: Selected Stream */}
                <div className="relative text-black text-left shrink-0 w-[220px] md:w-auto z-10 flex flex-col justify-start">
                  <div className="absolute left-0 -top-1 md:-left-[28px] md:top-1.5 w-3 h-3 rounded-full border border-black bg-blue-500 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-20"></div>
                  <div className="space-y-1 bg-sky-50 border-2 border-black p-2.5 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black mt-4 md:mt-0 break-words whitespace-normal">
                    <span className="text-[8.5px] font-mono font-black uppercase text-blue-900 block">// STEP 02: ACTIVE specialisation</span>
                    <h5 className="text-[11px] font-black text-black uppercase leading-snug">{selectedPathway.name}</h5>
                    <p className="text-[9.5px] text-black leading-snug font-mono font-bold">
                      <strong>Duration:</strong> {selectedPathway.duration} <br />
                      <strong>Est. Fees:</strong> {selectedPathway.estimatedFees}
                    </p>
                  </div>
                </div>

                {/* Step 3: Next Academic Level */}
                <div className="relative text-black text-left shrink-0 w-[200px] md:w-auto z-10 flex flex-col justify-start">
                  <div className="absolute left-0 -top-1 md:-left-[28px] md:top-1.5 w-3 h-3 rounded-full border border-black bg-purple-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-20"></div>
                  <div className="space-y-1 mt-4 md:mt-0 break-words whitespace-normal">
                    <span className="text-[8.5px] font-mono font-black uppercase text-purple-900 block">// STEP 03</span>
                    <h5 className="text-[11px] font-black uppercase text-black leading-none">Collegiate Degrees & Bridges</h5>
                    {selectedGraduationDegree ? (
                      <div className="mt-1.5 bg-purple-600 text-white border-2 border-black p-2.5 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-[8.5px] font-mono font-black text-yellow-300 block mb-0.5 uppercase tracking-widest">// SELECTED TARGET TRACK</span>
                        <h6 className="text-[11px] font-black uppercase leading-tight">🎓 {selectedGraduationDegree.name}</h6>
                        <p className="text-[9px] text-purple-100 font-medium font-mono leading-none mt-1">Duration: {selectedGraduationDegree.duration}</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {(selectedPathway.higherEducationOptions || []).slice(0, 3).map((opt, i) => (
                          <span key={i} className="text-[9px] font-black bg-purple-100 text-purple-950 border border-black px-1.5 py-0.5 rounded leading-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            🎓 {opt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 4: Ultimate Career Outcomes */}
                <div className="relative text-black text-left shrink-0 w-[200px] md:w-auto z-10 flex flex-col justify-start">
                  <div className="absolute left-0 -top-1 md:-left-[28px] md:top-1.5 w-3 h-3 rounded-full border border-black bg-emerald-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-20"></div>
                  <div className="space-y-1 mt-4 md:mt-0 break-words whitespace-normal">
                    <span className="text-[8.5px] font-mono font-black uppercase text-emerald-900 block">// STEP 04</span>
                    <h5 className="text-[11px] font-black uppercase text-black leading-none">Ultimate Job Outlets</h5>
                    {selectedGraduationDegree ? (
                      <div className="flex flex-col gap-1.5 pt-1.5">
                        {selectedGraduationDegree.careers.map((career, i) => (
                          <div key={i} className="text-[9.5px] font-mono font-black uppercase bg-emerald-50 text-emerald-950 border-2 border-black p-1.5 rounded leading-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 font-semibold">
                            <span className="bg-emerald-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[7.5px] border border-black font-black shrink-0">✔</span>
                            <span className="truncate">💼 {career}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 pt-1.5">
                        {(selectedPathway.careerOutcomes || []).slice(0, 3).map((career, i) => (
                          <div key={i} className="text-[9.5px] font-mono font-black uppercase bg-stone-100 text-black border border-black p-1.5 rounded leading-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            💼 {career}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Embedded Micro Blueprint Advisor Tip inside the printed container */}
            <div className="border-t-2 border-black pt-4 bg-zinc-50 -mx-5 -mb-5 p-5 text-left">
              <span className="text-[8.5px] font-mono font-black text-blue-800 block uppercase font-bold">// Advisor Career Blueprint:</span>
              <p className="text-[10px] font-bold leading-relaxed text-slate-800 mt-1 font-sans">
                {selectedGraduationDegree ? (
                  <>
                    With a target in <strong>{selectedGraduationDegree.name}</strong>, your focus is optimized for {selectedGraduationDegree.careers.join(', ')} roles. Post-graduation trajectory aims for specialized professional entry with higher initial payouts.
                  </>
                ) : (
                  <>
                    A direct trajectory starting from 10th Class into <strong>{selectedPathway.name}</strong> accelerates professional launch. Students typically climb from hands-on tasks to supervisor and senior expert roles in 3-5 years post-graduation.
                  </>
                )}
              </p>

              {/* Interactive Feedback / Suggestion system for flowchart details */}
              <div className="border-t border-black/20 pt-4 mt-4 text-left" data-html2canvas-ignore="true">
                {!flowchartFeedbackOpen ? (
                  <button
                    type="button"
                    onClick={() => setFlowchartFeedbackOpen(true)}
                    className="w-full py-2 px-3 border border-dashed border-zinc-400 text-[10px] hover:border-black font-semibold text-zinc-650 hover:text-black hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>🚩</span>
                    <span>Flag outdated career info or suggest missing pathway links</span>
                  </button>
                ) : (
                  <div className="bg-amber-50/50 border border-black p-3 rounded-sm space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-black text-black uppercase tracking-wider">// Send Flowchart Suggestion</span>
                      <button
                        type="button"
                        onClick={() => setFlowchartFeedbackOpen(false)}
                        className="text-[10px] font-bold hover:text-red-650 cursor-pointer text-zinc-550"
                      >
                        ✕ Close
                      </button>
                    </div>

                    {flowchartFeedbackSubmitted ? (
                      <div className="bg-emerald-50 border border-emerald-500 font-bold text-center text-emerald-800 p-2.5 text-[10px]">
                        🎉 Thank you! Your suggestion was stored. Outdated entries or missing links on the "{selectedPathway.name}" pathway will be reviewed by verified alumni advisors.
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitFlowchartFeedback} className="space-y-3">
                        <div>
                          <label className="block text-[8.5px] font-mono font-black uppercase text-zinc-600 mb-1">Feedback Category:</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setFlowchartFeedbackType('outdated')}
                              className={`py-1 px-2 border text-[9.5px] font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 ${
                                flowchartFeedbackType === 'outdated'
                                  ? 'bg-amber-101 border-black text-black font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                                  : 'bg-white border-zinc-350 text-zinc-550'
                              }`}
                            >
                              <span>⚠️</span> Outdated Info
                            </button>
                            <button
                              type="button"
                              onClick={() => setFlowchartFeedbackType('missing')}
                              className={`py-1 px-2 border text-[9.5px] font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 ${
                                flowchartFeedbackType === 'missing'
                                  ? 'bg-amber-101 border-black text-black font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                                  : 'bg-white border-zinc-350 text-zinc-550'
                              }`}
                            >
                              <span>🔗</span> Missing Link
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8.5px] font-mono font-black uppercase text-zinc-600 mb-1">
                            {flowchartFeedbackType === 'outdated' ? 'Inaccurate or Outdated Details:' : 'Describe the Missing Connection / College link:'}
                          </label>
                          <textarea
                            required
                            value={flowchartFeedbackText}
                            onChange={(e) => setFlowchartFeedbackText(e.target.value)}
                            placeholder={
                              flowchartFeedbackType === 'outdated'
                                ? 'e.g., Course fees have been raised to 30K/semester or duration is now 3 years...'
                                : 'e.g., Missing link to GMR Polytechnic for this specialization stream...'
                            }
                            className="w-full text-[10px] font-medium p-2 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black placeholder-zinc-400 min-h-[60px]"
                          />
                        </div>

                        {!user && (
                          <div>
                            <label className="block text-[8.5px] font-mono font-black uppercase text-zinc-600 mb-1">Contact Email (Optional):</label>
                            <input
                              type="email"
                              value={flowchartFeedbackEmail}
                              onChange={(e) => setFlowchartFeedbackEmail(e.target.value)}
                              placeholder="your_name@example.com"
                              className="w-full text-[10px] font-medium p-1.5 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                            />
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            disabled={isSubmittingFlowchartFeedback}
                            className="px-3 py-1.5 border border-black bg-black text-white text-[9.5px] font-black uppercase hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                          >
                            {isSubmittingFlowchartFeedback ? 'Submitting...' : 'Send Feedback ⚡'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  // Path Comparison State Group
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparePathAId, setComparePathAId] = useState<string | null>(null);
  const [comparePathBId, setComparePathBId] = useState<string | null>(null);
  const [compareTargetSlot, setCompareTargetSlot] = useState<'A' | 'B'>('A');

  // Draggable Map State (Google-like map navigation)
  const [mapPan, setMapPan] = useState({ x: -1400, y: -1520 });
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [mapDragStart, setMapDragStart] = useState({ x: 0, y: 0 });
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  const handleMapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag with left mouse click
    if (e.button !== 0) return;
    setIsMapDragging(true);
    setMapDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y });
  };

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMapDragging) return;
    setMapPan({
      x: e.clientX - mapDragStart.x,
      y: e.clientY - mapDragStart.y
    });
  };

  const handleMapMouseUpOrLeave = () => {
    setIsMapDragging(false);
  };

  // IN-MEMORY CLEANSE OF HARDCODED REVIEW DATA FOR COMPLETE DATABASE-DRIVEN INTEGRATION
  const CLEANED_ACADEMIC_PATHWAYS = ACADEMIC_PATHWAYS.map(p => ({
    ...p,
    alumniInsights: []
  }));

  const CLEANED_DEGREE_SPECIALIZATION_MAP: Record<string, SpecializationCourse[]> = {};
  for (const [degree, specs] of Object.entries(DEGREE_SPECIALIZATION_MAP)) {
    CLEANED_DEGREE_SPECIALIZATION_MAP[degree] = specs.map(s => ({
      ...s,
      feedback: [],
      jobs: (s.jobs || []).map(j => ({
        ...j,
        feedback: []
      }))
    }));
  }

  // In-memory persistent database of pathways (to support dynamic Graduate experience submissions)
  const [dynamicPathways, setDynamicPathways] = useState<AcademicPathway[]>(() => {
    const saved = safeLocalStorage.getItem('dirpa_dynamic_pathways');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({ ...p, alumniInsights: [] }));
      } catch (e) {
        // Fallback
      }
    }
    
    const seeded = CLEANED_ACADEMIC_PATHWAYS;
    safeLocalStorage.setItem('dirpa_dynamic_pathways', JSON.stringify(seeded));
    return seeded;
  });

  // Independent Feedback States: Course-specific vs Platform-level
  const [courseReviews, setCourseReviews] = useState<any[]>([]);
  const [platformReviews, setPlatformReviews] = useState<any[]>([]);
  const [dbFeedbacks, setDbFeedbacks] = useState<any[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);

  // Active filters for database feedback listing
  const [dbFilterStage, setDbFilterStage] = useState<string>('All');
  const [dbFilterYear, setDbFilterYear] = useState<string>('');
  const [dbFilterInstitution, setDbFilterInstitution] = useState<string>('');
  const [dbSortOrder, setDbSortOrder] = useState<string>('most_recent');
  const [dbSearchQuery, setDbSearchQuery] = useState<string>('');

  // Delayed User Feedback Prompt States
  const [showDelayedFeedbackPrompt, setShowDelayedFeedbackPrompt] = useState<boolean>(false);
  const [userPromptFeedbackRating, setUserPromptFeedbackRating] = useState<number>(5);
  const [userPromptFeedbackComment, setUserPromptFeedbackComment] = useState<string>('');
  const [isSubmittingPromptFeedback, setIsSubmittingPromptFeedback] = useState<boolean>(false);
  const [promptFeedbackSuccess, setPromptFeedbackSuccess] = useState<boolean>(false);

  // Profile Feedback Form States
  const [profileFeedbackText, setProfileFeedbackText] = useState<string>('');
  const [profileFeedbackRating, setProfileFeedbackRating] = useState<number>(5);
  const [isSubmittingProfileFeedback, setIsSubmittingProfileFeedback] = useState<boolean>(false);
  const [profileFeedbackSuccess, setProfileFeedbackSuccess] = useState<boolean>(false);

  // Helper function to check if the user has already submitted a platform review (Database & Local)
  const checkUserHasSubmittedFeedback = async (userId: string, userEmail?: string): Promise<boolean> => {
    if (!userId) return false;

    // 1. Check in-memory user state flag
    if (user?.hasSubmittedPlatformFeedback) return true;

    // 2. Check localStorage flag for immediate lookup
    const localFlag = localStorage.getItem(`dirpa_has_submitted_feedback_${userId}`);
    if (localFlag === 'true') return true;

    // 3. Check loaded platformReviews array
    const isAuthorInLocal = platformReviews.some(r => 
      (r.userId && r.userId === userId) ||
      (r.userEmail && userEmail && r.userEmail === userEmail) ||
      (r.authorEmail && userEmail && r.authorEmail === userEmail) ||
      (r.email && userEmail && r.email === userEmail)
    );
    if (isAuthorInLocal) return true;

    // 4. Query platform_reviews collection in Firestore for user ID
    try {
      const pRef = collection(db, 'platform_reviews');
      const qUser = query(pRef, where('userId', '==', userId));
      const snapUser = await getDocs(pRef);
      const userHasDoc = snapUser.docs.some(doc => {
        const d = doc.data();
        return d.userId === userId || (userEmail && (d.userEmail === userEmail || d.authorEmail === userEmail || d.email === userEmail));
      });
      if (userHasDoc) return true;

      // 5. Query user document in Firestore 'users/{userId}' for hasSubmittedPlatformFeedback boolean
      const uRef = doc(db, 'users', userId);
      const uSnap = await getDoc(uRef);
      if (uSnap.exists()) {
        const uData = uSnap.data();
        if (uData.hasSubmittedPlatformFeedback === true) {
          return true;
        }
      }
    } catch (err) {
      console.error("Error checking platform feedback submission status in Firestore:", err);
    }

    return false;
  };

  // Helper function to check Once-a-Day Limit in LocalStorage
  const checkIsPromptedToday = (userId: string): boolean => {
    const lastPromptStr = localStorage.getItem(`lastFeedbackPromptDate_${userId}`) || localStorage.getItem('lastFeedbackPromptDate');
    if (!lastPromptStr) return false;

    const lastPromptDate = new Date(lastPromptStr);
    const now = new Date();

    const isSameCalendarDay = lastPromptDate.toDateString() === now.toDateString();
    const isWithin24Hours = (now.getTime() - lastPromptDate.getTime()) < 24 * 60 * 60 * 1000;

    return isSameCalendarDay || isWithin24Hours;
  };

  // Delayed Feedback Prompt effect (Evaluates submission status & once-a-day limit)
  useEffect(() => {
    if (!user) {
      setShowDelayedFeedbackPrompt(false);
      return;
    }

    let isMounted = true;
    let timerId: NodeJS.Timeout | null = null;

    const evaluateAndSchedulePrompt = async () => {
      // Rule 1: Check Submission Status (Database & Local)
      const hasSubmitted = await checkUserHasSubmittedFeedback(user.id, user.email);
      if (!isMounted) return;

      if (hasSubmitted) {
        // User has already submitted feedback -> NEVER show feedback prompt/reminder again
        setUser(prev => (prev && !prev.hasSubmittedPlatformFeedback) ? { ...prev, hasSubmittedPlatformFeedback: true } : prev);
        localStorage.setItem(`dirpa_has_submitted_feedback_${user.id}`, 'true');
        setShowDelayedFeedbackPrompt(false);
        return;
      }

      // Rule 2: Once-a-Day Limit (Local Storage)
      if (checkIsPromptedToday(user.id)) {
        // Prompt appeared already today / in the last 24h -> Do NOT render/show
        setShowDelayedFeedbackPrompt(false);
        return;
      }

      // Check session storage dismissal for current tab session
      const isDismissedInSession = sessionStorage.getItem(`dirpa_feedback_dismissed_${user.id}`);
      if (isDismissedInSession === 'true') {
        setShowDelayedFeedbackPrompt(false);
        return;
      }

      // Rule 3: Schedule prompt timer if eligible
      timerId = setTimeout(() => {
        if (!isMounted) return;
        setShowDelayedFeedbackPrompt(true);

        // Save timestamp string to localStorage immediately when prompt appears
        const nowIso = new Date().toISOString();
        localStorage.setItem('lastFeedbackPromptDate', nowIso);
        localStorage.setItem(`lastFeedbackPromptDate_${user.id}`, nowIso);
      }, 20000);
    };

    evaluateAndSchedulePrompt();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [user?.id, user?.hasSubmittedPlatformFeedback, platformReviews]);

  const handleSubmitPromptFeedback = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userPromptFeedbackComment.trim()) return;

    setIsSubmittingPromptFeedback(true);
    const newPlatformDoc = {
      userId: user?.id || 'anonymous',
      name: user?.name || user?.email?.split('@')[0] || 'DIRPA Student',
      role: user?.role === 'alumni' ? 'Alumni Mentor' : 'Student',
      avatar: user?.avatar || '🎓',
      educationalStage: 'Platform User',
      feedbackText: userPromptFeedbackComment.trim(),
      overallRating: userPromptFeedbackRating,
      type: 'platform',
      createdAt: new Date().toISOString()
    };

    // Mark user as having submitted feedback in local state & localStorage
    if (user?.id) {
      setUser(prev => prev ? { ...prev, hasSubmittedPlatformFeedback: true } : prev);
      localStorage.setItem(`dirpa_has_submitted_feedback_${user.id}`, 'true');
      
      // Update user document in Firestore 'users/{userId}'
      try {
        const uRef = doc(db, 'users', user.id);
        await setDoc(uRef, {
          hasSubmittedPlatformFeedback: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.error("Error setting hasSubmittedPlatformFeedback on user doc:", e);
      }
    }

    try {
      const ref = await addDoc(collection(db, 'platform_reviews'), newPlatformDoc);
      const createdItem = { id: ref.id, feedbackId: ref.id, ...newPlatformDoc };

      setPlatformReviews(prev => [createdItem, ...prev]);
      setPromptFeedbackSuccess(true);
      if (user) sessionStorage.setItem(`dirpa_feedback_dismissed_${user.id}`, 'true');

      setTimeout(() => {
        setShowDelayedFeedbackPrompt(false);
        setPromptFeedbackSuccess(false);
        setUserPromptFeedbackComment('');
      }, 2000);
    } catch (err) {
      console.error("Error submitting prompt platform feedback:", err);
      const localId = 'platform_review_' + Date.now();
      const createdItem = { id: localId, feedbackId: localId, ...newPlatformDoc };
      setPlatformReviews(prev => [createdItem, ...prev]);
      setPromptFeedbackSuccess(true);
      if (user) sessionStorage.setItem(`dirpa_feedback_dismissed_${user.id}`, 'true');
      setTimeout(() => {
        setShowDelayedFeedbackPrompt(false);
        setPromptFeedbackSuccess(false);
        setUserPromptFeedbackComment('');
      }, 2000);
    } finally {
      setIsSubmittingPromptFeedback(false);
    }
  };

  const handleDismissPromptFeedback = () => {
    setShowDelayedFeedbackPrompt(false);
    const nowIso = new Date().toISOString();
    localStorage.setItem('lastFeedbackPromptDate', nowIso);
    if (user) {
      localStorage.setItem(`lastFeedbackPromptDate_${user.id}`, nowIso);
      sessionStorage.setItem(`dirpa_feedback_dismissed_${user.id}`, 'true');
    }
  };

  const handleSubmitProfileFeedback = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profileFeedbackText.trim()) {
      setProfileFeedbackError("Please write your review or feedback before submitting.");
      return;
    }

    setProfileFeedbackError(null);
    setIsSubmittingProfileFeedback(true);
    setProfileFeedbackSuccess(false);

    const newPlatformDoc = {
      userId: user?.id || user?.email || 'anonymous',
      name: user?.name || user?.email?.split('@')[0] || 'DIRPA Student',
      role: user?.role === 'alumni' ? 'Alumni Mentor' : 'Student Reviewer',
      avatar: user?.avatar || '🎓',
      educationalStage: 'Platform User',
      feedbackText: profileFeedbackText.trim(),
      overallRating: profileFeedbackRating,
      type: 'platform',
      createdAt: new Date().toISOString()
    };

    // Mark user as having submitted feedback in local state & localStorage
    if (user?.id) {
      setUser(prev => prev ? { ...prev, hasSubmittedPlatformFeedback: true } : prev);
      localStorage.setItem(`dirpa_has_submitted_feedback_${user.id}`, 'true');
      
      // Update user document in Firestore 'users/{userId}'
      try {
        const uRef = doc(db, 'users', user.id);
        await setDoc(uRef, {
          hasSubmittedPlatformFeedback: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.error("Error setting hasSubmittedPlatformFeedback on user doc:", e);
      }
    }

    try {
      const ref = await addDoc(collection(db, 'platform_reviews'), newPlatformDoc);
      const createdItem = { id: ref.id, feedbackId: ref.id, ...newPlatformDoc };
      setPlatformReviews(prev => [createdItem, ...prev]);
      setProfileFeedbackSuccess(true);
      setProfileFeedbackText('');
      setProfileFeedbackRating(5);
      setTimeout(() => setProfileFeedbackSuccess(false), 4000);
    } catch (err) {
      console.error("Error submitting profile platform feedback:", err);
      const localId = 'platform_review_' + Date.now();
      const createdItem = { id: localId, feedbackId: localId, ...newPlatformDoc };
      setPlatformReviews(prev => [createdItem, ...prev]);
      setProfileFeedbackSuccess(true);
      setProfileFeedbackText('');
      setProfileFeedbackRating(5);
      setTimeout(() => setProfileFeedbackSuccess(false), 4000);
    } finally {
      setIsSubmittingProfileFeedback(false);
    }
  };

  // Real-time onSnapshot listener to fetch course-specific feedbacks directly from Firestore
  useEffect(() => {
    setFeedbackLoading(true);
    const feedbacksRef = collection(db, "feedbacks");
    
    const unsubscribe = onSnapshot(feedbacksRef, (qSnap) => {
      const courseList: any[] = [];
      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.courseId || data.pathwayId || data.type === 'course') {
          courseList.push({ id: docSnap.id, feedbackId: docSnap.id, ...data });
        }
      });

      courseList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setCourseReviews(courseList);
      setFeedbackLoading(false);
      console.log("[Realtime Course Feedbacks] Course reviews synchronized successfully:", courseList.length);
    }, (err) => {
      console.error("Failed to listen to course feedbacks:", err);
      handleFirestoreError(err, OperationType.GET, "feedbacks");
      setFeedbackLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time onSnapshot listener to fetch platform-level reviews directly from Firestore
  useEffect(() => {
    const platformRef = collection(db, "platform_reviews");
    
    const unsubscribe = onSnapshot(platformRef, (qSnap) => {
      const platformList: any[] = [];
      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        platformList.push({ id: docSnap.id, feedbackId: docSnap.id, ...data });
      });

      platformList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setPlatformReviews(platformList);
      console.log("[Realtime Platform Reviews] Platform reviews synchronized successfully:", platformList.length);
    }, (err) => {
      console.error("Failed to listen to platform reviews:", err);
      handleFirestoreError(err, OperationType.GET, "platform_reviews");
    });

    return () => unsubscribe();
  }, []);

  // Reactive listener to filter, sort, and process courseReviews whenever filters update
  useEffect(() => {
    let filtered = [...courseReviews];

    const activeCourseId = selectedSpecCourse
      ? (selectedSpecCourse.id || selectedSpecCourse.code)
      : (selectedPathway ? selectedPathway.id : null);

    if (activeCourseId) {
      filtered = filtered.filter(f => isCourseIdEquivalent(f.courseId, activeCourseId));
    }

    if (dbFilterStage && dbFilterStage !== "All") {
      filtered = filtered.filter(f => String(f.educationalStage).toLowerCase() === String(dbFilterStage).toLowerCase());
    }

    if (dbFilterYear) {
      filtered = filtered.filter(f => String(f.completionYear) === String(dbFilterYear));
    }

    if (dbFilterInstitution) {
      const pQuery = String(dbFilterInstitution).toLowerCase();
      filtered = filtered.filter(f => f.institutionName && f.institutionName.toLowerCase().includes(pQuery));
    }

    if (dbSearchQuery) {
      const searchStr = String(dbSearchQuery).toLowerCase();
      filtered = filtered.filter(f => {
        return (f.courseName && f.courseName.toLowerCase().includes(searchStr)) ||
               (f.feedbackText && f.feedbackText.toLowerCase().includes(searchStr)) ||
               (f.currentJobRole && f.currentJobRole.toLowerCase().includes(searchStr)) ||
               (f.skillsLearned && f.skillsLearned.toLowerCase().includes(searchStr)) ||
               (f.likedMost && f.likedMost.toLowerCase().includes(searchStr)) ||
               (f.challengesFaced && f.challengesFaced.toLowerCase().includes(searchStr)) ||
               (f.careerOutcome && f.careerOutcome.toLowerCase().includes(searchStr)) ||
               (f.advice && f.advice.toLowerCase().includes(searchStr)) ||
               (f.companyName && f.companyName.toLowerCase().includes(searchStr));
      });
    }

    // Sort
    if (dbSortOrder === "highest_rated") {
      filtered.sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
    } else if (dbSortOrder === "lowest_rated") {
      filtered.sort((a, b) => (a.overallRating || 0) - (b.overallRating || 0));
    }

    setDbFeedbacks(filtered);
  }, [courseReviews, dbFilterStage, dbFilterYear, dbFilterInstitution, dbSortOrder, dbSearchQuery, selectedPathway, selectedSpecCourse]);

  const loadAllFeedbacks = async () => {
    // Handled dynamically in real-time by the feedbacks onSnapshot subscriber above!
  };

  // Form state for alumni submitting feedback
  const [alumniForm, setAlumniForm] = useState({
    courseId: 'btech_cs',
    courseName: 'BSC Computer Science',
    educationalStage: 'Graduation',
    institutionName: '',
    completionYear: new Date().getFullYear().toString(),
    feedbackText: '',
    difficultyRating: 4,
    overallRating: 5,
    skillsLearned: '',
    likedMost: '',
    challengesFaced: '',
    careerOutcome: '',
    advice: '',
    currentJobRole: '',
    companyName: '',
    yearsOfExperience: ''
  });

  useEffect(() => {
    safeLocalStorage.setItem('dirpa_dynamic_pathways', JSON.stringify(dynamicPathways));
  }, [dynamicPathways]);

  const getPathwayById = (id: string | null): AcademicPathway | null => {
    if (!id) return null;
    // 1. Direct match in dynamicPathways
    const directFound = dynamicPathways.find(p => p.id === id);
    if (directFound) return directFound;

    // 2. Is it intermediate? ID format "inter_XYZ" where XYZ is code
    if (id.startsWith('inter_')) {
      const code = id.replace('inter_', '');
      const o = INTERMEDIATE_GROUPS.find(g => g.code === code);
      if (o) {
        let groupCategory: 'Science' | 'Commerce' | 'Arts' | 'Vocational' | 'Engineering' | 'Medical' | 'Specialized' = 'Arts';
        const nameUpper = (o.name || '').toUpperCase();
        if (nameUpper.includes('MPC') || nameUpper.includes('PHY') || nameUpper.includes('MAT')) {
          groupCategory = 'Science';
        } else if (nameUpper.includes('BPC') || nameUpper.includes('BIO') || nameUpper.includes('ZOO')) {
          groupCategory = 'Medical';
        } else if (nameUpper.includes('MEC') || nameUpper.includes('CEC') || nameUpper.includes('CO') || nameUpper.includes('ECO')) {
          groupCategory = 'Commerce';
        }
        return {
          id: id,
          level: '10th',
          category: groupCategory,
          name: `Intermediate ${o.name} (Code: ${o.code})`,
          duration: '2 Years',
          eligibility: 'Completed Class 10/SSC from any recognized board',
          subjects: o.subjects.filter((s: string) => s !== '-'),
          estimatedFees: '₹12,000 - ₹55,000 per academic year',
          description: `This intermediate stream focuses on: ${o.subjects.filter((s: string) => s !== '-').join(', ')}. It is a standard 2-year bridge curriculum that prepares students for national and state-level higher education options.`,
          futureOpportunities: o.nextStudies,
          higherEducationOptions: o.nextStudies.map((s: string) => `${s} (after completing intermediate)`),
          careerOutcomes: [
            'Professional graduation entry',
            'Higher research fellowships',
            'Competitive Central/State exam pipelines'
          ],
          nodePosition: { x: 50, y: 50 },
          alumniInsights: []
        };
      }
    }

    // 3. Is it polytechnic? ID format "poly_XYZ"
    if (id.startsWith('poly_') || POLYTECHNIC_DIPLOMAS.some(d => d.id === id)) {
      const o = POLYTECHNIC_DIPLOMAS.find(d => d.id === id);
      if (o) {
        return {
          id: o.id,
          level: '10th',
          category: o.isEngineering ? 'Engineering' : 'Specialized',
          name: o.name.startsWith('Diploma') ? o.name : `Diploma in ${o.name}`,
          duration: '3 Years',
          eligibility: 'Passed Class 10/SSC with science and mathematics focus',
          subjects: ['Applied Physics', 'Engineering Mathematics', 'Technical Drawing', 'Workshop Lab Practice', 'Industrial Internship'],
          estimatedFees: '₹15,000 - ₹48,000 per academic year',
          description: o.description,
          futureOpportunities: [
            'AP/TS ECET direct second-year lateral entry admissions',
            'Junior Engineer (JE) exams at railways and municipal boards',
            'Technical apprentice designations at major manufacturing divisions'
          ],
          higherEducationOptions: [
            o.lateralBTech,
            'Standard B.Tech (Lateral Entry)',
            'AMIE (Associate Member of Institution of Engineers)'
          ],
          careerOutcomes: [
            'Junior Site Supervisor',
            'Hardware Support Specialist',
            'Industrial Plant Technician',
            'Piping/Machinery Estimator'
          ],
          nodePosition: { x: 50, y: 50 },
          alumniInsights: []
        };
      }
    }

    // 4. Is it vocational? ID format "iti_XYZ"
    if (id.startsWith('iti_') || ITI_VOCATIONAL_TRADES.some(t => `iti_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` === id)) {
      const o = ITI_VOCATIONAL_TRADES.find(t => `iti_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` === id || t.name === id);
      if (o) {
        const idStr = `iti_${o.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        return {
          id: idStr,
          level: '10th',
          category: 'Vocational',
          name: `Vocational Selection: ${o.name}`,
          duration: o.duration,
          eligibility: 'Passed Class 10 standard / school level',
          subjects: ['Trade Theory lectures', 'Practical Workshop training', 'Trade calculations and science', 'Employability skills'],
          estimatedFees: '₹5,000 - ₹18,000 total course fees',
          description: o.description,
          futureOpportunities: [
            o.careerPath,
            'National Apprenticeship Scheme (NATS/NAPS)',
            'Direct technical recruitment exams (Railways, Defense, ISRO, DRDO)'
          ],
          higherEducationOptions: [
            'Apprenticeship certifications (NAC)',
            'Diploma Lateral entry (direct second-year entry into polytechnics)'
          ],
          careerOutcomes: [
            o.careerPath,
            'Independent Registered Workshop Contractor',
            'Maintenance Staff specialist'
          ],
          nodePosition: { x: 50, y: 50 },
          alumniInsights: []
        };
      }
    }

    return null;
  };

  const getAllPossiblePathways = (): AcademicPathway[] => {
    const list = [...dynamicPathways];

    // Add intermediate groups
    INTERMEDIATE_GROUPS.forEach(o => {
      const id = `inter_${o.code}`;
      if (!list.some(p => p.id === id)) {
        const resolved = getPathwayById(id);
        if (resolved) list.push(resolved);
      }
    });

    // Add polytechnics
    POLYTECHNIC_DIPLOMAS.forEach(o => {
      const id = o.id;
      if (!list.some(p => p.id === id)) {
        const resolved = getPathwayById(id);
        if (resolved) list.push(resolved);
      }
    });

    // Add vocational trades
    ITI_VOCATIONAL_TRADES.forEach(o => {
      const id = `iti_${o.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (!list.some(p => p.id === id)) {
        const resolved = getPathwayById(id);
        if (resolved) list.push(resolved);
      }
    });

    // Add graduation specializations from DEGREE_SPECIALIZATION_MAP
    for (const [degreeName, specs] of Object.entries(DEGREE_SPECIALIZATION_MAP)) {
      specs.forEach(spec => {
        const id = spec.id;
        if (!list.some(p => p.id === id)) {
          const resolved: AcademicPathway = {
            id: spec.id,
            level: '12th', // fallback for type safety
            category: 'Engineering', // fallback
            name: spec.name,
            duration: spec.duration,
            eligibility: `Completed ${degreeName}`,
            subjects: spec.keyFocusAreas || [],
            estimatedFees: 'Varies',
            description: spec.description,
            futureOpportunities: (spec.jobs || []).map(j => j.title),
            higherEducationOptions: ['Post Graduation', 'Research Fellowship'],
            careerOutcomes: (spec.jobs || []).map(j => j.title),
            alumniInsights: [],
            nodePosition: { x: 50, y: 50 }
          };
          list.push(resolved);
        }
      });
    }

    return list.map(p => {
      // Find matching live DB feedbacks for this pathway ID or name
      const matchingDbFeedbacks = courseReviews.filter(
        f => isCourseIdEquivalent(f.courseId, p.id) || isCourseIdEquivalent(f.courseId, p.name)
      );

      // Map database feedbacks to AlumniInsight format
      const databaseInsights = matchingDbFeedbacks.map((f, idx) => ({
        id: f.feedbackId || f.id || `db_insight_${p.id}_${idx}`,
        userId: f.userId || "",
        name: f.name || "Verified Alumni",
        role: f.role || f.currentJobRole || ("Graduate " + p.name),
        avatar: f.avatar || "🎓",
        institution: f.institutionName || f.institution || "DIRPA Counseling Network",
        yearCompleted: f.completionYear || f.yearCompleted || "2023",
        experience: f.feedbackText || f.experience || "",
        advice: f.advice || "Stay consistent and build hands-on projects!",
        rating: Number(f.overallRating || f.rating || 5),
        authorEmail: f.authorEmail || f.userId || "",
        timeline: [
          { 
            year: f.completionYear || '2023', 
            title: 'Graduation Completion', 
            description: `Finished pathway at ${f.institutionName || 'institution'}`, 
            type: 'milestone' as const
          }
        ]
      }));

      return {
        ...p,
        alumniInsights: databaseInsights
      };
    });
  };

  const isPathwayEligibleForStream = (pathway: AcademicPathway, stream: string | null) => {
    if (!stream) return true;

    const streamUpper = stream.toUpperCase();
    const elig = (pathway.eligibility || '').toUpperCase();
    const name = (pathway.name || '').toUpperCase();
    const cat = pathway.category;

    // Check if polytechnic
    if (selected12thType === 'Polytechnic' || streamUpper.includes('POLY') || streamUpper.includes('DIPLOMA') || POLYTECHNIC_DIPLOMAS.some(p => p.id === stream || p.name.toUpperCase() === streamUpper)) {
      const polyMatch = POLYTECHNIC_DIPLOMAS.find(p => p.id === stream || p.name.toUpperCase() === streamUpper);
      if (polyMatch && !polyMatch.isEngineering) {
        return cat === 'Specialized' || cat === 'Commerce' || elig.includes('DIPLOMA') || name.includes('DESIGN') || name.includes('ARTS') || name.includes('COMMERCE') || name.includes('MANAGEMENT') || name.includes('BBA');
      }
      return elig.includes('DIPLOMA') || elig.includes('LATERAL') || elig.includes('ECET') || cat === 'Engineering' || cat === 'Specialized' || name.includes('B.TECH') || name.includes('ENGINEERING') || name.includes('B.E') || name.includes('BCA');
    }

    // Check if intermediate group
    const interMatch = INTERMEDIATE_GROUPS.find(g => g.code === stream || g.name.toUpperCase() === streamUpper || streamUpper.includes(g.name.toUpperCase()));

    if (interMatch) {
      const groupCode = interMatch.code;
      const groupName = interMatch.name.toUpperCase();
      const subjects = interMatch.subjects.map(s => s.toUpperCase());

      if (groupName.includes('MPC') || (subjects.includes('MATHS-A') && subjects.includes('PHYSICS')) || groupCode === '001') {
        return elig.includes('MPC') || elig.includes('MATH') || cat === 'Engineering' || name.includes('CS') || name.includes('TECH') || name.includes('MATH') || name.includes('STAT') || name.includes('ARCH') || cat === 'Specialized';
      }

      if (groupName.includes('BPC') || groupName.includes('BIPC') || (subjects.includes('BOTANY') && subjects.includes('ZOOLOGY')) || groupCode === '003') {
        return elig.includes('BIPC') || elig.includes('BIOLOGY') || cat === 'Medical' || name.includes('MBBS') || name.includes('PHARM') || name.includes('NURSING') || name.includes('SURGERY') || name.includes('AYUSH') || name.includes('AGRICULTURE') || name.includes('BIOTECH') || cat === 'Specialized';
      }

      if (groupName.includes('MEC') || groupName.includes('CEC') || subjects.includes('COMMERCE') || subjects.includes('ECONOMICS') || groupCode === '002' || groupCode === '004') {
        return cat === 'Commerce' || cat === 'Specialized' || elig.includes('CEC') || elig.includes('MEC') || elig.includes('COMMERCE') || name.includes('COMMERCE') || name.includes('BUSINESS') || name.includes('ARTS') || name.includes('LAW') || name.includes('ECONOMY') || name.includes('ECONOMICS') || name.includes('BBA') || name.includes('B.COM') || name.includes('CA');
      }

      if (groupName.includes('HEC') || subjects.includes('HISTORY') || subjects.includes('CIVICS') || subjects.includes('SOCIOLOGY') || groupCode === '005') {
        return cat === 'Commerce' || cat === 'Specialized' || name.includes('ARTS') || name.includes('LAW') || name.includes('JOURNALISM') || name.includes('SOCIOLOGY') || name.includes('PSYCHOLOGY') || name.includes('HISTORY');
      }

      return cat === 'Commerce' || cat === 'Specialized' || true;
    }

    // Fallback using streamKey
    const streamKey = deriveStreamKey(stream);
    if (streamKey === 'MPC') {
      return elig.includes('MPC') || elig.includes('MATH') || cat === 'Engineering' || name.includes('CS') || name.includes('TECH') || name.includes('MATH') || cat === 'Specialized';
    }
    if (streamKey === 'BiPC') {
      return elig.includes('BIPC') || elig.includes('BIOLOGY') || cat === 'Medical' || name.includes('MBBS') || name.includes('PHARM') || name.includes('NURSING') || name.includes('SURGERY') || name.includes('AYUSH') || cat === 'Specialized';
    }
    if (streamKey === 'MEC_CEC') {
      return cat === 'Commerce' || cat === 'Specialized' || elig.includes('CEC') || elig.includes('MEC') || elig.includes('COMMERCE') || name.includes('COMMERCE') || name.includes('BUSINESS') || name.includes('ARTS') || name.includes('LAW') || name.includes('ECONOMY') || name.includes('ECONOMICS');
    }
    if (streamKey === 'POLY') {
      return elig.includes('DIPLOMA') || elig.includes('LATERAL') || elig.includes('ECET') || cat === 'Engineering' || cat === 'Specialized';
    }
    return true;
  };

  interface EligibleRoute {
    streamKey: 'MPC' | 'BiPC' | 'MEC_CEC' | 'POLY';
    streamName: string;
    streamId: string;
    streamDescription: string;
    streamDuration: string;
    degreeName: string;
    degreeDuration: string;
    degreeDescription: string;
    careersList: string[];
  }

  const getEligibleRoutesForJob = (query: string): EligibleRoute[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const routes: EligibleRoute[] = [];

    const streamInfo = {
      MPC: { name: 'Intermediate MPC', id: 'inter_001', desc: 'Science group specializing in Mathematics, Physics, and Chemistry.', duration: '2 Years' },
      BiPC: { name: 'Intermediate BiPC', id: 'inter_003', desc: 'Science group specializing in Biology, Physics, and Chemistry.', duration: '2 Years' },
      MEC_CEC: { name: 'Intermediate MEC/CEC', id: 'inter_002', desc: 'Commerce and economics group specializing in Mathematics/Civics, Economics, and Commerce.', duration: '2 Years' },
      POLY: { name: 'Polytechnic Diploma', id: 'poly_computer', desc: 'Hands-on professional engineering diploma (3 Years) after 10th class.', duration: '3 Years' }
    };

    type StreamKey = 'MPC' | 'BiPC' | 'MEC_CEC' | 'POLY';
    (Object.keys(ELIGIBILITY_MATRIX) as StreamKey[]).forEach(key => {
      const degrees = ELIGIBILITY_MATRIX[key];
      degrees.forEach(deg => {
        const careerMatch = deg.careers.some(c => c.toLowerCase().includes(q));
        
        const specList = DEGREE_SPECIALIZATION_MAP[deg.name] || [];
        const specMatch = specList.some(spec => {
          return spec.name.toLowerCase().includes(q) || 
                 spec.description.toLowerCase().includes(q) ||
                 spec.jobs.some(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q));
        });

        const degreeMatch = deg.name.toLowerCase().includes(q);

        if (careerMatch || specMatch || degreeMatch) {
          routes.push({
            streamKey: key,
            streamName: streamInfo[key]?.name || key,
            streamId: streamInfo[key]?.id || `stream_${key}`,
            streamDescription: streamInfo[key]?.desc || '',
            streamDuration: streamInfo[key]?.duration || '2 Years',
            degreeName: deg.name,
            degreeDuration: deg.duration,
            degreeDescription: deg.description,
            careersList: deg.careers
          });
        }
      });
    });

    return routes;
  };

  const getMatchingPathways = (): AcademicPathway[] => {
    if (!jobQuery.trim()) return [];
    const query = jobQuery.toLowerCase().trim();
    return getAllPossiblePathways().filter(p => {
      const nameMatches = p.name.toLowerCase().includes(query);
      const categoryMatches = p.category.toLowerCase().includes(query);
      const descMatches = p.description.toLowerCase().includes(query);
      const outcomeMatches = p.careerOutcomes.some(job => job.toLowerCase().includes(query));
      const opportunitiesMatches = p.futureOpportunities?.some(opt => opt.toLowerCase().includes(query)) || false;
      const subjectMatches = p.subjects.some(subj => subj.toLowerCase().includes(query));
      
      const streamKey = getStreamKey(p.name);
      const degreeMatches = streamKey && ELIGIBILITY_MATRIX[streamKey]
        ? ELIGIBILITY_MATRIX[streamKey].some(deg => {
            const degName = deg.name.toLowerCase().includes(query);
            const degCareers = deg.careers.some(c => c.toLowerCase().includes(query));
            const degDesc = deg.description ? deg.description.toLowerCase().includes(query) : false;
            return degName || degCareers || degDesc;
          })
        : false;

      const specList = DEGREE_SPECIALIZATION_MAP[p.name] || [];
      const specMatches = specList.some(spec => {
        const specName = spec.name.toLowerCase().includes(query);
        const specDesc = spec.description.toLowerCase().includes(query);
        const specJobs = spec.jobs.some(j => 
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.skillsRequired.some(sk => sk.toLowerCase().includes(query))
        );
        return specName || specDesc || specJobs;
      });

      return nameMatches || categoryMatches || descMatches || outcomeMatches || opportunitiesMatches || subjectMatches || degreeMatches || specMatches;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pathwayIdFromUrl = params.get('pathway');
    if (pathwayIdFromUrl) {
      const found = getPathwayById(pathwayIdFromUrl);
      if (found) {
        setSelectedPathway(found);
        // Ensure user is signed in as Sarah Brown if not logged in, so they see the pathway detail nicely
        if (!user) {
          const defaultStudent = {
            id: 'user_sarah',
            name: 'Sarah Brown',
            email: 'sarah.brown@example.com',
            role: 'student' as const,
            avatar: '👩‍🎓',
            interests: ['Visualization', 'Logic', 'Coding', 'Mathematics'],
            strengths: ['Analytical Thinking', 'Creative Layouts', 'Quick learning'],
            careerGoal: 'Product UX Designer'
          };
          setUser(defaultStudent);
        }
        setCurrentView('dashboard');
        setSelectedNav('home');
      }
    }
  }, [dynamicPathways, user]);

  // Saved bookmark states
  const [savedPathIds, setSavedPathIds] = useState<string[]>([]);
  const [savedAlumniIds, setSavedAlumniIds] = useState<string[]>([]);

  // Messaging state
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const saved = safeLocalStorage.getItem('dirpa_chat_threads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const defaultThreads: ChatThread[] = [
      {
        id: 'thread_alumni_expert_cs',
        alumniId: 'alumni_expert_cs',
        alumniName: 'DIRPA Expert Mentor',
        alumniAvatar: '👨‍💻',
        alumniRole: 'Education Director',
        messages: [
          {
            id: 'm_init_expert_1',
            senderId: 'alumni_expert_cs',
            senderName: 'DIRPA Expert Mentor',
            senderAvatar: '👨‍💻',
            text: 'Welcome to DIRPA (Dynamic Interactive Roadmap and Placement Advisor)! I am your expert academic counselor. Feel free to ask me any questions about our interactive career paths, subject requirements, or software development careers.',
            timestamp: 'Just Now',
            isRead: false
          }
        ]
      }
    ];
    safeLocalStorage.setItem('dirpa_chat_threads', JSON.stringify(defaultThreads));
    return defaultThreads;
  });

  const [messageToast, setMessageToast] = useState<{
    id: string;
    threadId: string;
    senderName: string;
    senderAvatar?: string;
    text: string;
  } | null>(null);

  const shownToastMsgIdsRef = useRef<Set<string>>(new Set());
  const isInitialMountDoneRef = useRef<boolean>(false);

  // Mark initially loaded messages as seen so historical messages do not trigger popups on page reload
  useEffect(() => {
    chatThreads.forEach(t => {
      t.messages.forEach(m => {
        shownToastMsgIdsRef.current.add(m.id);
      });
    });
    const timer = setTimeout(() => {
      isInitialMountDoneRef.current = true;
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto dismiss toast after 5 seconds
  useEffect(() => {
    if (messageToast) {
      const timer = setTimeout(() => {
        setMessageToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messageToast]);

  useEffect(() => {
    safeLocalStorage.setItem('dirpa_chat_threads', JSON.stringify(chatThreads));
  }, [chatThreads]);

  // Dynamic Real-time Synchronizer for messages and counseling sessions
  useEffect(() => {
    if (!user) return;

    let unsubUserConv = () => {};
    let unsubAlumniConv = () => {};
    let unsubMessages: { [key: string]: () => void } = {};

    try {
      const qUser = query(
        collection(db, 'conversations'),
        where('userId', '==', user.id)
      );

      const qAlumni = query(
        collection(db, 'conversations'),
        where('alumniId', '==', user.id)
      );

      const handleConvSnapshot = (qSnap: any) => {
        const threadsMap: { [key: string]: any } = {};
        
        qSnap.forEach((docSnap: any) => {
          const data = docSnap.data();
          threadsMap[docSnap.id] = {
            id: docSnap.id,
            alumniId: data.alumniId || '',
            alumniName: data.alumniName || '',
            alumniAvatar: data.alumniAvatar || '🎓',
            alumniRole: data.alumniRole || '',
            messages: []
          };
        });

        // Listen for messages in each thread
        Object.keys(threadsMap).forEach(threadId => {
          if (!unsubMessages[threadId]) {
            const msgsQuery = query(
              collection(db, 'conversations', threadId, 'messages'),
              orderBy('createdAt', 'asc')
            );
            
            unsubMessages[threadId] = onSnapshot(msgsQuery, (mSnap) => {
              const msgsList: Message[] = [];
              mSnap.forEach(mDoc => {
                const mData = mDoc.data();
                const msgObj: Message = {
                  id: mDoc.id,
                  senderId: mData.senderId || '',
                  senderName: mData.senderName || '',
                  senderAvatar: mData.senderAvatar || '🎓',
                  text: mData.text || '',
                  timestamp: mData.timestamp || '',
                  isRead: mData.isRead ?? true
                };
                msgsList.push(msgObj);

                if (
                  user &&
                  msgObj.senderId !== user.id &&
                  !shownToastMsgIdsRef.current.has(msgObj.id)
                ) {
                  shownToastMsgIdsRef.current.add(msgObj.id);
                  if (isInitialMountDoneRef.current) {
                    const rawThread = threadsMap[threadId];
                    setMessageToast({
                      id: msgObj.id,
                      threadId,
                      senderName: msgObj.senderName || rawThread?.alumniName || 'DIRPA Expert Mentor',
                      senderAvatar: msgObj.senderAvatar || rawThread?.alumniAvatar,
                      text: msgObj.text
                    });
                  }
                }
              });

              setChatThreads(prev => {
                const existing = prev.find(t => t.id === threadId);
                const rawThread = threadsMap[threadId];
                if (existing) {
                  return prev.map(t => {
                    if (t.id === threadId) {
                      return { 
                        ...t, 
                        messages: msgsList,
                        alumniName: rawThread?.alumniName || t.alumniName,
                        alumniAvatar: rawThread?.alumniAvatar || t.alumniAvatar,
                        alumniRole: rawThread?.alumniRole || t.alumniRole,
                        alumniId: rawThread?.alumniId || t.alumniId
                      };
                    }
                    return t;
                  });
                } else {
                  if (rawThread) {
                    return [
                      ...prev, 
                      { 
                        ...rawThread, 
                        messages: msgsList 
                      }
                    ];
                  }
                  return prev;
                }
              });
            }, (err) => {
              console.error(`Failed to listen to messages for thread ${threadId}:`, err);
            });
          } else {
            // Thread already has a listener, but update details if changed
            setChatThreads(prev => {
              return prev.map(t => {
                if (t.id === threadId) {
                  const rawThread = threadsMap[threadId];
                  if (rawThread) {
                    return {
                      ...t,
                      alumniName: rawThread.alumniName,
                      alumniAvatar: rawThread.alumniAvatar,
                      alumniRole: rawThread.alumniRole,
                      alumniId: rawThread.alumniId
                    };
                  }
                }
                return t;
              });
            });
          }
        });
      };

      unsubUserConv = onSnapshot(qUser, handleConvSnapshot, (err) => {
        console.error("Failed to listen to user conversations:", err);
      });

      unsubAlumniConv = onSnapshot(qAlumni, handleConvSnapshot, (err) => {
        console.error("Failed to listen to alumni conversations:", err);
      });

    } catch (e) {
      console.error("Failed to establish real-time conversations listener:", e);
    }

    return () => {
      unsubUserConv();
      unsubAlumniConv();
      Object.values(unsubMessages).forEach(unsub => unsub());
    };
  }, [user]);

  // Resolved AcademicPathway from ID
  const getPathwayForComparison = (pathId: string | null): AcademicPathway | null => {
    if (!pathId) return null;

    // Check 1. 12th state pathways (dynamicPathways)
    const found12 = dynamicPathways.find(p => p.id === pathId);
    if (found12) return found12;

    // Check 2. 10th state Intermediate Streams
    if (pathId.startsWith('inter_')) {
      const code = pathId.replace('inter_', '');
      const group = INTERMEDIATE_GROUPS.find(g => g.code === code);
      if (group) {
        let groupCategory: 'Science' | 'Commerce' | 'Arts' | 'Vocational' | 'Engineering' | 'Medical' | 'Specialized' = 'Arts';
        const nameUpper = (group.name || '').toUpperCase();
        if (nameUpper.includes('MPC') || nameUpper.includes('PHY') || nameUpper.includes('MAT')) {
          groupCategory = 'Science';
        } else if (nameUpper.includes('BPC') || nameUpper.includes('BIO') || nameUpper.includes('ZOO')) {
          groupCategory = 'Medical';
        } else if (nameUpper.includes('MEC') || nameUpper.includes('CEC') || nameUpper.includes('CO') || nameUpper.includes('ECO')) {
          groupCategory = 'Commerce';
        }
        return {
          id: pathId,
          level: '10th',
          category: groupCategory,
          name: `Intermediate ${group.name} (Code: ${group.code})`,
          duration: '2 Years',
          eligibility: 'Completed Class 10/SSC from any recognized board',
          subjects: group.subjects.filter((s: string) => s !== '-'),
          estimatedFees: '₹12,000 - ₹55,000 per academic year',
          description: `This intermediate stream focuses on: ${group.subjects.filter((s: string) => s !== '-').join(', ')}. It is a standard 2-year bridge curriculum that prepares students for national and state-level higher education options.`,
          futureOpportunities: group.nextStudies,
          higherEducationOptions: group.nextStudies.map((s: string) => `${s} (after completing intermediate)`),
          careerOutcomes: [
            'Professional graduation entry',
            'Higher research fellowships',
            'Competitive Central/State exam pipelines'
          ],
          nodePosition: { x: 0, y: 0 },
          alumniInsights: []
        };
      }
    }

    // Check 3. 10th state Polytechnic diplomas
    const foundPoly = POLYTECHNIC_DIPLOMAS.find(p => p.id === pathId);
    if (foundPoly) {
      return {
        id: foundPoly.id,
        level: '10th',
        category: foundPoly.isEngineering ? 'Engineering' : 'Specialized',
        name: foundPoly.name.startsWith('Diploma') ? foundPoly.name : `Diploma in ${foundPoly.name}`,
        duration: '3 Years',
        eligibility: 'Passed Class 10/SSC with science and mathematics focus',
        subjects: ['Applied Physics', 'Engineering Mathematics', 'Technical Drawing', 'Workshop Lab Practice', 'Industrial Internship'],
        estimatedFees: '₹15,000 - ₹48,005 per academic year',
        description: foundPoly.description,
        futureOpportunities: [
          'AP/TS ECET direct second-year lateral entry admissions',
          'Junior Engineer (JE) exams at railways and municipal boards',
          'Technical apprentice designations at major manufacturing divisions'
        ],
        higherEducationOptions: [
          foundPoly.lateralBTech,
          'Standard B.Tech (Lateral Entry)',
          'AMIE (Associate Member of Institution of Engineers)'
        ],
        careerOutcomes: [
          'Junior Site Supervisor',
          'Hardware Support Specialist',
          'Industrial Plant Technician',
          'Piping/Machinery Estimator'
        ],
        nodePosition: { x: 0, y: 0 },
        alumniInsights: []
      };
    }

    // Check 4. ITI Vocational trades
    const foundIti = ITI_VOCATIONAL_TRADES.find(t => {
      const id = `iti_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      return id === pathId || t.name === pathId || t.name.toLowerCase() === pathId.toLowerCase();
    });
    if (foundIti) {
      const id = `iti_${foundIti.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      return {
        id: id,
        level: '10th',
        category: 'Vocational',
        name: `Vocational: ${foundIti.name}`,
        duration: foundIti.duration,
        eligibility: 'Passed Class 10 standard / school level completed',
        subjects: ['Trade Theory lectures', 'Practical Workshop training', 'Trade calculations and science', 'Employability skills'],
        estimatedFees: '₹5,000 - ₹18,000 total course fees',
        description: foundIti.description,
        futureOpportunities: [
          foundIti.careerPath,
          'National Apprenticeship Scheme (NATS/NAPS)',
          'Direct technical recruitment exams (Railways, Defense, ISRO, DRDO)'
        ],
        higherEducationOptions: [
          'Apprenticeship certifications (NAC)',
          'Diploma Lateral entry (direct second-year entry into polytechnics)'
        ],
        careerOutcomes: [
          foundIti.careerPath,
          'Independent Registered Workshop Contractor',
          'Maintenance Staff specialist'
        ],
        nodePosition: { x: 0, y: 0 },
        alumniInsights: []
      };
    }

    return null;
  };

  // Compile all selectable options for comparison dropdown input selectors
  const getAllSelectablePathways = () => {
    const list: { id: string; name: string; level: '10th' | '12th'; category: string }[] = [];

    // 1. 10th grade Intermediate stream
    INTERMEDIATE_GROUPS.forEach(g => {
      list.push({
        id: `inter_${g.code}`,
        name: `Intermediate ${g.name} (Code: ${g.code})`,
        level: '10th',
        category: 'Intermediate Group'
      });
    });

    // 2. 10th grade Polytechnic
    POLYTECHNIC_DIPLOMAS.forEach(p => {
      list.push({
        id: p.id,
        name: p.name.startsWith('Diploma') ? p.name : `Diploma in ${p.name}`,
        level: '10th',
        category: p.isEngineering ? 'Engineering Diploma' : 'Non-Engineering Diploma'
      });
    });

    // 3. 10th grade ITI
    ITI_VOCATIONAL_TRADES.forEach(t => {
      const id = `iti_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      list.push({
        id,
        name: `Vocational: ${t.name}`,
        level: '10th',
        category: t.type
      });
    });

    // 4. 12th grade paths
    dynamicPathways.forEach(p => {
      if (!list.some(item => item.id === p.id)) {
        list.push({
          id: p.id,
          name: p.name,
          level: '12th',
          category: p.category
        });
      }
    });

    // Sort by name for premium user layout directory structure
    return list.sort((a, b) => a.name.localeCompare(b.name));
  };

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeTypingPartner, setActiveTypingPartner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Delay slightly to ensure browser has completed DOM rendering of new messages/typing indicator
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const activeMessages = chatThreads.find(t => t.id === activeThreadId)?.messages;

  const totalUnreadMessages = useMemo(() => {
    if (!user) return 0;
    return chatThreads.reduce((total, thread) => {
      return total + thread.messages.filter(m => !m.isRead && m.senderId !== user.id).length;
    }, 0);
  }, [chatThreads, user]);

  // Auto-clear unread status when navigating to or viewing the open chat thread in Messages tab
  useEffect(() => {
    if (user && currentView === 'messages' && activeThreadId) {
      setChatThreads(prev => {
        let updatedAny = false;
        const nextThreads = prev.map(t => {
          if (t.id === activeThreadId) {
            const hasUnread = t.messages.some(m => !m.isRead && m.senderId !== user.id);
            if (hasUnread) {
              updatedAny = true;
              return {
                ...t,
                messages: t.messages.map(m => (m.senderId !== user.id && !m.isRead) ? { ...m, isRead: true } : m)
              };
            }
          }
          return t;
        });
        return updatedAny ? nextThreads : prev;
      });

      const currentActive = chatThreads.find(t => t.id === activeThreadId);
      if (currentActive) {
        currentActive.messages.forEach(async (m) => {
          if (!m.isRead && m.senderId !== user.id) {
            try {
              await setDoc(doc(db, 'conversations', activeThreadId, 'messages', m.id), { isRead: true }, { merge: true });
            } catch (e) {
              // Ignore offline fallback
            }
          }
        });
      }
    }
  }, [currentView, activeThreadId, user]);

  const handleOpenMessagesTab = () => {
    setSelectedNav('messages');
    setCurrentView('messages');
    if (!activeThreadId && chatThreads.length > 0) {
      const unreadThread = chatThreads.find(t => t.messages.some(m => !m.isRead && m.senderId !== user?.id));
      setActiveThreadId(unreadThread ? unreadThread.id : chatThreads[0].id);
    }
  };

  useEffect(() => {
    if (currentView === 'messages' && activeThreadId) {
      scrollToBottom();
    }
  }, [activeMessages, activeThreadId, activeTypingPartner, currentView]);

  // AI Recommendation engine state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiInputs, setAiInputs] = useState({
    level: '12th' as '10th' | '12th' | 'Graduation',
    interests: [] as string[],
    strengths: [] as string[],
    budget: 'any' as 'low' | 'medium' | 'high' | 'any',
    durationPref: '3-4 Years',
    careerGoal: ''
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [aiPresetSelected, setAiPresetSelected] = useState<string | null>(null);

  // Modals for AI Advisor Course Details and Job Description Specs
  const [selectedCourseModal, setSelectedCourseModal] = useState<any | null>(null);
  const [selectedJobModal, setSelectedJobModal] = useState<any | null>(null);

  // Helper to ensure full genuine, realistic data for course syllabus, feedback, and jobs
  const getCourseDetailsWithDefaults = (course: any) => {
    if (!course) return null;
    const name = course.name || "Academic Pathway";
    const duration = course.duration || "3-4 Years";
    const fees = course.estimatedFees || "₹30,000 - ₹1,80,000 / year";
    const description = course.description || `A comprehensive academic pathway focused on practical skills, theoretical fundamentals, and career excellence in ${name}.`;
    const whyFits = course.whyFits || course.whyAlternative || "Aligned with your expressed interests, academic level, and personal career aspirations.";

    // Generate or format syllabus
    let syllabus = course.syllabus;
    if (!syllabus || !Array.isArray(syllabus) || syllabus.length === 0) {
      if (name.toLowerCase().includes("tech") || name.toLowerCase().includes("computer") || name.toLowerCase().includes("engineering")) {
        syllabus = [
          {
            semesterOrYear: "Year 1 (Sem 1 & 2)",
            title: "Engineering Science & Programming Logic",
            topics: ["Calculus & Linear Algebra", "Computer Fundamentals & C/Python", "Digital Logic Design", "Engineering Physics"],
            learningOutcome: "Build baseline algorithmic problem-solving and mathematical logic."
          },
          {
            semesterOrYear: "Year 2 (Sem 3 & 4)",
            title: "Data Structures & Systems Architecture",
            topics: ["Data Structures & Algorithms", "Database Management Systems (SQL)", "Object-Oriented Java/C++", "Operating Systems"],
            learningOutcome: "Design efficient data structures and manage database relational models."
          },
          {
            semesterOrYear: "Year 3 (Sem 5 & 6)",
            title: "Software Engineering & Microservices",
            topics: ["Web Application Engineering", "Computer Networks & Security", "Machine Learning & AI Basics", "Agile Methodologies"],
            learningOutcome: "Build end-to-end full-stack web applications and API integrations."
          },
          {
            semesterOrYear: "Year 4 (Sem 7 & 8)",
            title: "Cloud Infrastructure & Capstone Project",
            topics: ["Cloud Architecture (AWS/GCP)", "Distributed Systems & Kubernetes", "Corporate Internship", "Capstone Thesis"],
            learningOutcome: "Deploy production applications and succeed in corporate tech placements."
          }
        ];
      } else if (name.toLowerCase().includes("design") || name.toLowerCase().includes("ui") || name.toLowerCase().includes("ux")) {
        syllabus = [
          {
            semesterOrYear: "Year 1",
            title: "Visual Fundamentals & Design Thinking",
            topics: ["Color Theory & Visual Ergonomics", "Drawing & Form Studies", "User Research Methods", "Typography Principles"],
            learningOutcome: "Develop visual literacy, empathy, and aesthetic design instincts."
          },
          {
            semesterOrYear: "Year 2",
            title: "Interaction Design & Figma Wireframing",
            topics: ["Information Architecture", "Wireframing & Prototyping", "Usability Testing Protocols", "Micro-interactions"],
            learningOutcome: "Create interactive clickable prototypes and validate with real users."
          },
          {
            semesterOrYear: "Year 3",
            title: "Design Systems & Frontend Engineering",
            topics: ["Design Systems & Accessibility", "HTML/CSS/Tailwind UI Styling", "Mobile App Design Patterns", "Product Strategy"],
            learningOutcome: "Bridge visual design concepts with developer design systems."
          },
          {
            semesterOrYear: "Year 4",
            title: "Industry Portfolio & Capstone Internship",
            topics: ["UX Analytics & A/B Testing", "Industry Internship", "Portfolio Case Study Defense", "Design Leadership"],
            learningOutcome: "Graduate with a job-ready portfolio of high-impact case studies."
          }
        ];
      } else {
        syllabus = [
          {
            semesterOrYear: "Year 1",
            title: "Foundational Principles & Core Methodologies",
            topics: ["Introduction to Field Theories", "Quantitative & Qualitative Analysis", "Communication & Ethics", "Core Laboratory / Applied Practice"],
            learningOutcome: "Establish baseline academic and analytical foundations."
          },
          {
            semesterOrYear: "Year 2",
            title: "Intermediate Specialization & Applied Skills",
            topics: ["Advanced Domain Subjects", "Research Methods & Case Studies", "Data Interpretation", "Industry Tools Workshop"],
            learningOutcome: "Apply theoretical models to real-world domain problems."
          },
          {
            semesterOrYear: "Year 3",
            title: "Advanced Domain Mastery & Industry Internship",
            topics: ["Specialized Electives", "Field Work & Corporate Internship", "Project Management", "Final Thesis / Project"],
            learningOutcome: "Master professional standards and prepare for industry recruitment."
          }
        ];
      }
    }

    // Genuine feedback from database only; default to empty array if none
    let feedback = course.feedback && Array.isArray(course.feedback) ? course.feedback : [];

    // Generate or format jobs
    let jobs = course.jobs;
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      const potentials = course.careerPotential || ["Software Engineer", "Product Specialist", "Domain Consultant"];
      jobs = potentials.map((titleStr: any, idx: number) => {
        if (typeof titleStr === 'object' && titleStr.responsibilities) {
          return titleStr; // Already a full job object
        }
        const title = typeof titleStr === 'string' ? titleStr : titleStr?.title || "Specialist Role";
        
        return {
          title: title,
          shortDescription: `Architect, analyze, and drive execution for high-impact projects as a ${title}.`,
          fullOverview: `As a ${title}, you will be responsible for leading key initiatives, collaborating across multidisciplinary teams, applying advanced technical and domain knowledge, and delivering high-value solutions for organization objectives.`,
          responsibilities: [
            `Lead and execute end-to-end domain projects matching corporate quality standards.`,
            `Analyze requirements, conduct research, and design sustainable operational workflows.`,
            `Collaborate with cross-functional stakeholders, engineering teams, and executive management.`,
            `Monitor performance metrics, troubleshoot operational bottlenecks, and drive continuous optimization.`
          ],
          requiredSkills: ["Analytical Thinking", "Domain Expertise", "Problem Solving", "Project Management", "Effective Communication"],
          salaryRange: {
            entry: "₹5,50,000 - ₹9,50,000 PA ($65,000 USD)",
            mid: "₹12,00,000 - ₹22,00,000 PA ($110,000 USD)",
            senior: "₹25,00,000 - ₹48,00,000+ PA ($160,000+ USD)"
          },
          growthScope: `High demand across market sectors. Clear promotion path from Junior Associate → Senior Specialist → Team Lead → Executive Director.`,
          topRecruiters: ["Google", "Microsoft", "TCS", "Deloitte", "Amazon", "Infosys", "Apollo"],
          recommendedCertifications: ["Professional Industry Certificate", "Global Domain Specialist Certification"]
        };
      });
    }

    return {
      ...course,
      name,
      duration,
      estimatedFees: fees,
      description,
      whyFits,
      syllabus,
      feedback,
      jobs
    };
  };

  // States for dynamic web course query using AI Web Grounding
  const [aiAdvisorSubTab, setAiAdvisorSubTab] = useState<'planner' | 'explorer'>('planner');
  const [webSearchQuery, setWebSearchQuery] = useState('Why are there only a few courses presented after the 12th class? Show me ALL available courses on the internet.');
  const [webSearchResponse, setWebSearchResponse] = useState<{ answer: string; citations: { title: string; url: string }[] } | null>(null);
  const [isWebSearching, setIsWebSearching] = useState(false);

  // Filter category state for the circular map display
  const [mapCategoryFilter, setMapCategoryFilter] = useState<string>('All');

  // Shared experiences state for current logged-in Alumni - Graduate detailed school feedback
  const [newExperience, setNewExperience] = useState({
    pathwayId: 'btech_cs',
    schoolName11: '',
    takenCourse11: '',
    feedback11: '',
    subjects11: '',
    completedYear11: '2021',
    sameSchool11and12: true,
    schoolName12: '',
    collegeNameGrad: '',
    currentJob: '',
    salary: '',
    placementDetails: '',
    yearsExp: '1',
    experienceText: '',
    adviceText: '',
    rating: 5,
    avatarChar: '👩‍💻'
  });

  // Inline rapid course feedback submission states
  const [inlineRating, setInlineRating] = useState<number>(5);
  const [inlineFeedback, setInlineFeedback] = useState<string>('');
  const [inlineAdvice, setInlineAdvice] = useState<string>('');

  // Deletion confirmation states to bypass sandboxed iframe confirm block
  const [feedbackIdBeingDeleted, setFeedbackIdBeingDeleted] = useState<string | null>(null);
  const [commentIdBeingDeleted, setCommentIdBeingDeleted] = useState<string | null>(null);
  const [threadIdBeingDeleted, setThreadIdBeingDeleted] = useState<string | null>(null);
  const [confirmDeleteModalThreadId, setConfirmDeleteModalThreadId] = useState<string | null>(null);
  const [isDeletingThread, setIsDeletingThread] = useState<boolean>(false);

  // Flowchart specific feedback states
  const [flowchartFeedbackOpen, setFlowchartFeedbackOpen] = useState<boolean>(false);
  const [flowchartFeedbackType, setFlowchartFeedbackType] = useState<'outdated' | 'missing'>('outdated');
  const [flowchartFeedbackText, setFlowchartFeedbackText] = useState<string>('');
  const [flowchartFeedbackEmail, setFlowchartFeedbackEmail] = useState<string>('');
  const [isSubmittingFlowchartFeedback, setIsSubmittingFlowchartFeedback] = useState<boolean>(false);
  const [flowchartFeedbackSubmitted, setFlowchartFeedbackSubmitted] = useState<boolean>(false);

  // Alumni dashboard states
  const [alumniSearchCourseQuery, setAlumniSearchCourseQuery] = useState('');
  const [alumniSelectedCourseId, setAlumniSelectedCourseId] = useState<string | null>(null);

  // New Give Your Valuable Feedback states
  const [feedbackCategory, setFeedbackCategory] = useState<'course' | 'job' | 'entrance-exam'>('course');
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');
  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState<{ id: string; name: string; category?: string; level?: string } | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackAdvice, setFeedbackAdvice] = useState('');
  const [feedbackInstitution, setFeedbackInstitution] = useState('');
  const [feedbackYear, setFeedbackYear] = useState('2024');
  const [feedbackSubmitSuccess, setFeedbackSubmitSuccess] = useState(false);

  // Master databases explorer states
  const [dbActiveTab, setDbActiveTab] = useState<'intermediate' | 'polytechnic' | 'iti'>('intermediate');
  const [intermediateSearch, setIntermediateSearch] = useState('');
  const [polytechnicSearch, setPolytechnicSearch] = useState('');
  const [itiSearch, setItiSearch] = useState('');

  // Google and Email real authentication states
  const [tempGoogleUser, setTempGoogleUser] = useState<any>(null);
  const [isFinishingRoleSetup, setIsFinishingRoleSetup] = useState(false);

  // Email + Password real authentication credentials
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [initializingAuth, setInitializingAuth] = useState(true);

  // DIRPA Custom Password Reset Portal states
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetVerifying, setResetVerifying] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Read and parse custom / standard password reset code from URL
  useEffect(() => {
    const checkResetUrl = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const oobCode = urlParams.get('oobCode');
      const isResetPath = window.location.pathname === '/reset-password';

      // Enter recovery flow if URL path says /reset-password or if it's the standard firebase action url callback with mode=resetPassword
      if (isResetPath || (mode === 'resetPassword' && oobCode)) {
        console.log("Initializing dynamic password reset portal. Path:", window.location.pathname, "Mode:", mode);
        setCurrentView('reset-password');
        
        const code = oobCode || urlParams.get('resetToken') || urlParams.get('token');
        if (!code) {
          setResetError("Invalid password reset link.");
          return;
        }

        setResetCode(code);
        setResetVerifying(true);
        setResetError(null);

        try {
          // Double-guard: check action code first
          const actionInfo = await checkActionCode(auth, code);
          if (actionInfo.operation !== 'PASSWORD_RESET') {
            setResetError("Invalid password reset link.");
            setResetVerifying(false);
            return;
          }

          // Fetch the email corresponding to this out-of-band security token
          const email = await verifyPasswordResetCode(auth, code);
          setResetEmail(email);
        } catch (error: any) {
          console.error("Firebase Action Code Verification Error:", error);
          if (error.code === 'auth/expired-action-code') {
            setResetError("Password reset link has expired.");
          } else if (error.code === 'auth/invalid-action-code' || error.code === 'auth/user-not-found') {
            setResetError("Invalid password reset link.");
          } else {
            setResetError("Invalid password reset link.");
          }
        } finally {
          setResetVerifying(false);
        }
      }
    };
    checkResetUrl();
  }, []);

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    
    if (!resetCode) {
      setResetError("Invalid password reset link.");
      return;
    }
    
    if (resetNewPassword.length < 6) {
      setResetError("Password must be at least 6 characters long.");
      return;
    }
    
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    
    setResettingPassword(true);
    try {
      await confirmPasswordReset(auth, resetCode, resetNewPassword);
      setResetSuccess(true);
      setResetNewPassword('');
      setResetConfirmPassword('');
      // Clean up search parameters and pathname visually
      window.history.replaceState({}, document.title, '/');
    } catch (error: any) {
      console.error("Firebase Confirmed Reset Password Failure:", error);
      if (error.code === 'auth/expired-action-code') {
        setResetError("Password reset link has expired.");
      } else if (error.code === 'auth/weak-password') {
        setResetError("The password is too weak. Must be at least 6 characters.");
      } else {
        setResetError(error.message || "Failed to update password.");
      }
    } finally {
      setResettingPassword(false);
    }
  };

  // Google Single Sign-on simulation state variables
  const [googleOverlayOpen, setGoogleOverlayOpen] = useState(false);
  const [googleAuthMode, setGoogleAuthMode] = useState<'signin' | 'signup'>('signin');
  const [googleSelectedEmail, setGoogleSelectedEmail] = useState('');
  const [googleRole, setGoogleRole] = useState<'student' | 'alumni'>('student');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');

  // Quick fill demo modes for easy validation
  const handleQuickDemoSign = (role: 'student' | 'alumni') => {
    if (role === 'student') {
      const studentUser = {
        id: 'user_sarah',
        name: 'Sarah Brown',
        email: 'sarah.brown@example.com',
        role: 'student' as const,
        avatar: '👩‍🎓',
        interests: ['Visualization', 'Logic', 'Coding', 'Mathematics'],
        strengths: ['Analytical Thinking', 'Creative Layouts', 'Quick learning'],
        careerGoal: 'Product UX Designer'
      };
      // Register if not exist
      if (!registeredUsers.some(u => u.email === studentUser.email)) {
        const updated = [...registeredUsers, studentUser];
        setRegisteredUsers(updated);
        safeLocalStorage.setItem('dirpa_registered_users', JSON.stringify(updated));
      }
      setUser(studentUser);
      setSavedPathIds(['btech_cs']);
    } else {
      const expertUser = registeredUsers.find(u => u.email === 'mentor@dirpa.org') || {
        id: 'user_alumni_expert',
        email: 'mentor@dirpa.org',
        password: 'password',
        name: 'DIRPA Expert Mentor',
        role: 'alumni' as const,
        avatar: '👨‍💻',
        bio: 'DIRPA platform administrator and academic pathways mentor.',
        interests: ['Academic Counseling', 'Career Planning'],
        strengths: ['Curriculum Engineering', 'Job Placement'],
        careerGoal: 'Education Director'
      };
      // Register if not exist
      if (!registeredUsers.some(u => u.email === 'mentor@dirpa.org')) {
        const updated = [...registeredUsers, expertUser];
        setRegisteredUsers(updated);
        safeLocalStorage.setItem('dirpa_registered_users', JSON.stringify(updated));
      }
      setUser(expertUser);
    }
    setCurrentView('dashboard');
    setSelectedNav('home');
  };

  const handleSubmitGoogleAuth = (email: string, name?: string) => {
    // Unused: Simulated authentication replaced by secure Google Sign-In popups.
  };

  const handleGoogleSignInDirect = async () => {
    setAuthError(null);
    setAuthLoading(true);
    setGlobalLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      if (!firebaseUser.email) {
        throw new Error("No verified email returned from your Google account.");
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const loggedInUser = {
          id: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || 'Google User',
          email: firebaseUser.email,
          role: data.role || 'student',
          avatar: data.avatar || data.photoURL || firebaseUser.photoURL || '',
          interests: data.interests || [],
          strengths: data.strengths || [],
          careerGoal: data.careerGoal || '',
          bio: data.bio || '',
        };
        setUser(loggedInUser);
        setCurrentView('dashboard');
        setSelectedNav('home');
        setActiveLevel(null);
      } else {
        // User not found in database! Show role selection screen, keep authenticated firebaseUser in state
        setTempGoogleUser(firebaseUser);
        setCurrentView('role-selection');
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
      
      // Fallback for iframe / popup restrictions (internal-error)
      if (error && (error.code === 'auth/internal-error' || error.message?.includes('internal-error') || error.message?.includes('popup') || error.message?.includes('iframe'))) {
        console.warn("Google POPUP blocked/restricted inside iframe. Performing secure anonymous sandbox login.");
        try {
          const anonResult = await signInAnonymously(auth);
          const anonUser = anonResult.user;
          const userEmail = `sandbox.${anonUser.uid}@dirpa.org`;
          
          const userRef = doc(db, 'users', anonUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const loggedInUser = {
              id: anonUser.uid,
              name: data.name || 'Google Sandbox User',
              email: userEmail,
              role: data.role || 'student',
              avatar: data.avatar || '',
              interests: data.interests || [],
              strengths: data.strengths || [],
              careerGoal: data.careerGoal || '',
              bio: data.bio || '',
            };
            setUser(loggedInUser);
            setCurrentView('dashboard');
            setSelectedNav('home');
            setActiveLevel(null);
          } else {
            setTempGoogleUser({
              ...anonUser,
              displayName: 'Google Sandbox User',
              email: userEmail,
              photoURL: ''
            } as any);
            setCurrentView('role-selection');
          }
          setAuthLoading(false);
          setGlobalLoading(false);
          return;
        } catch (anonErr: any) {
          console.error("Anonymous sign-in fallback failed:", anonErr);
        }
      }

      setAuthError(error.message || "Google Authentication failed. Please try again.");
      setAuthLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleFinishRoleSetup = async (role: 'student' | 'alumni') => {
    if (!tempGoogleUser) {
      setAuthError("No active authentication session. Please sign in again.");
      setCurrentView('auth');
      return;
    }
    setIsFinishingRoleSetup(true);
    setAuthError(null);
    try {
      const userRef = doc(db, 'users', tempGoogleUser.uid);
      const chosenRole = role;
      const defaultInterests = chosenRole === 'student' ? ['Technical Labs', 'Logic'] : ['Corporate Advisory', 'Peer Mentoring'];
      const defaultStrengths = chosenRole === 'student' ? ['Problem Solving'] : ['Software Engineering'];
      const defaultGoal = chosenRole === 'student' ? 'Technical Professional' : 'Lead Specialist';
      const defaultBio = chosenRole === 'student' ? 'Class Explorer' : 'Academic Mentor';

      const signupName = safeLocalStorage.getItem('dirpa_signup_name');
      const finalName = signupName || tempGoogleUser.displayName || tempGoogleUser.email.split('@')[0];

      const newUserObj = {
        id: tempGoogleUser.uid,
        name: finalName,
        email: tempGoogleUser.email,
        role: chosenRole,
        avatar: tempGoogleUser.photoURL || '',
        interests: defaultInterests,
        strengths: defaultStrengths,
        careerGoal: defaultGoal,
        bio: defaultBio,
      };

      await setDoc(userRef, {
        ...newUserObj,
        uid: tempGoogleUser.uid,
        photoURL: tempGoogleUser.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      safeLocalStorage.removeItem('dirpa_signup_name');

      setUser({
        ...newUserObj,
        onboarded: false,
        timeline: []
      } as any);
      setTempGoogleUser(null);
      if (chosenRole === 'alumni') {
        setCurrentView('alumni-onboarding');
      } else {
        setCurrentView('dashboard');
        setSelectedNav('home');
      }
      setActiveLevel(null);
    } catch (error: any) {
      console.error("Error creating user profile in Firestore:", error);
      setAuthError(error.message || "Failed to create your profile in the database. Please try again.");
    } finally {
      setIsFinishingRoleSetup(false);
    }
  };

  const handleCompleteAlumniOnboarding = async (onboardingJourney: any) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.id);
      
      const timeline = onboardingJourney.timeline || [];
      const latestJob = onboardingJourney.latestJob || {};
      const latestEducation = onboardingJourney.latestEducation || {};
      const finalAdvice = onboardingJourney.finalAdvice || {};
      
      const updatedUser = {
        ...user,
        onboarded: true,
        alumniOnboarded: true,
        name: onboardingJourney.name || user.name,
        avatar: onboardingJourney.avatar || user.avatar || '🎓',
        bio: finalAdvice.careerAdvice || user.bio || 'Verified Alumni',
        careerGoal: latestJob.jobTitle || 'Industry Leader',
        timeline: timeline,
        onboardingJourney: onboardingJourney
      };

      // 1. Save user document updates directly to Firestore
      await setDoc(userRef, {
        ...updatedUser,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 2. Add stage feedbacks to Firestore direct collection "feedbacks"
      if (Array.isArray(onboardingJourney.feedbacks)) {
        for (const entry of onboardingJourney.feedbacks) {
          const feedbackId = `onb_fb_${user.id}_${entry.stage}_${Date.now()}`;
          const feedbackRef = doc(db, 'feedbacks', feedbackId);

          let resolvedCourseId = entry.courseId || '';
          let resolvedCourseName = entry.courseName || '';

          const allPossibles = getAllPossiblePathways();
          const match = allPossibles.find(p => 
            isCourseIdEquivalent(p.id, resolvedCourseId) || 
            isCourseIdEquivalent(p.name, resolvedCourseId) ||
            isCourseIdEquivalent(p.id, resolvedCourseName) ||
            isCourseIdEquivalent(p.name, resolvedCourseName)
          );
          if (match) {
            resolvedCourseId = match.id;
            resolvedCourseName = match.name;
          }

          await setDoc(feedbackRef, {
            feedbackId,
            userId: user.id,
            authorEmail: user.email || "",
            authorName: updatedUser.name,
            authorAvatar: updatedUser.avatar,
            name: updatedUser.name,
            avatar: updatedUser.avatar,
            courseId: resolvedCourseId,
            courseName: resolvedCourseName,
            educationalStage: entry.educationalStage || '',
            institutionName: entry.institutionName || '',
            completionYear: String(entry.completionYear || ''),
            feedbackText: entry.feedbackText || '',
            difficultyRating: parseInt(entry.difficultyRating) || 3,
            overallRating: parseInt(entry.overallRating) || 5,
            skillsLearned: entry.skillsLearned || '',
            challengesFaced: entry.challengesFaced || '',
            careerOutcome: entry.careerOutcome || '',
            advice: entry.advice || '',
            currentJobRole: latestJob.jobTitle || '',
            companyName: latestJob.companyName || '',
            yearsOfExperience: String(latestJob.yearsOfExperience || ''),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }

      // 3. Update active client state
      setUser(updatedUser);
      
      // 4. Force global feedback reload across the platform tabs
      await loadAllFeedbacks();
      
      // 5. Route to Dashboard
      setCurrentView('dashboard');
      setSelectedNav('home');
    } catch (err: any) {
      console.error("Failed to complete alumni onboarding:", err);
      alert("Error saving onboarding details: " + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout error:", e);
    }
    setUser(null);
    setCurrentView('landing');
  };

  const handleDeleteAccount = async () => {
    if (!user || !auth.currentUser) {
      alert("No active session found or you must be logged in to delete an account.");
      return;
    }
    const userIdToDelete = user.id;

    setAuthLoading(true);
    setGlobalLoading(true);
    try {
      // 1. Delete user-profile document from Firestore database
      const userRef = doc(db, 'users', userIdToDelete);
      await deleteDoc(userRef);

      // 2. Delete associated bookmarks from Firestore database
      try {
        const bookmarksRef = collection(db, 'bookmarks');
        const q = query(bookmarksRef, where('userId', '==', userIdToDelete));
        const qSnap = await getDocs(q);
        for (const docSnap of qSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
      } catch (err) {
        console.error("Error deleting bookmarks for deleted account:", err);
      }

      // 3. Delete reviews from Firestore database
      try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('userId', '==', userIdToDelete));
        const qSnap = await getDocs(q);
        for (const docSnap of qSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
      } catch (err) {
        console.error("Error deleting reviews for deleted account:", err);
      }

      // 4. Delete messages and conversations from Firestore database
      try {
        const convRef = collection(db, 'conversations');
        // A conversation could have userId matching this user
        const qUser = query(convRef, where('userId', '==', userIdToDelete));
        const qUserSnap = await getDocs(qUser);
        for (const docSnap of qUserSnap.docs) {
          // Delete messages subcollection
          const msgsSnap = await getDocs(collection(doc(db, 'conversations', docSnap.id), 'messages'));
          for (const mDoc of msgsSnap.docs) {
            await deleteDoc(mDoc.ref);
          }
          await deleteDoc(docSnap.ref);
        }

        // Or alumniId matching this user
        const qAlumni = query(convRef, where('alumniId', '==', userIdToDelete));
        const qAlumniSnap = await getDocs(qAlumni);
        for (const docSnap of qAlumniSnap.docs) {
          // Delete messages subcollection
          const msgsSnap = await getDocs(collection(doc(db, 'conversations', docSnap.id), 'messages'));
          for (const mDoc of msgsSnap.docs) {
            await deleteDoc(mDoc.ref);
          }
          await deleteDoc(docSnap.ref);
        }
      } catch (err) {
        console.error("Error deleting conversations for deleted account:", err);
      }

      // Also invoke server-side account reset if needed, but client-side Firestore operations are fully secure.
      console.log("Cleaned up database node data for UID:", userIdToDelete);

      // 5. Delete Firebase Authentication Account
      const firebaseUser = auth.currentUser;
      await deleteUser(firebaseUser);

      console.log("Account and all user-related data deleted successfully.");
      alert("Your account and all associated profile, progress, and chat history data has been permanently deleted.");
      
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("Security Requirement: Deleting your account requires a recent login session. Please sign out, sign in again, and retry account deletion.");
        setAuthLoading(false);
        setGlobalLoading(false);
        return;
      } else {
        alert("Account deletion failed: " + (error.message || error));
      }
    } finally {
      setAuthLoading(false);
      setGlobalLoading(false);
    }

    // Sign user out & clean up local states
    try {
      const updatedRecords = registeredUsers.filter(u => u.id !== userIdToDelete);
      setRegisteredUsers(updatedRecords);
      safeLocalStorage.setItem('dirpa_registered_users', JSON.stringify(updatedRecords));
    } catch (e) {
      console.error(e);
    }
    
    setUser(null);
    setChatThreads([]);
    setSavedPathIds([]);
    setCurrentView('landing');
    setShowDeleteConfirm(false);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthFieldErrors({});

    const name = authName.trim();
    const email = authEmail.trim();
    const password = authPassword;
    const confirmPassword = authConfirmPassword;

    const errs: Record<string, string> = {};
    if (!name) errs.name = "Full Name is required.";
    if (!email) errs.email = "Email address is required.";
    if (password.length < 6) errs.password = "Password must be at least 6 characters long.";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";

    if (Object.keys(errs).length > 0) {
      setAuthFieldErrors(errs);
      setAuthError("Please fill in all required fields accurately.");
      return;
    }

    setAuthLoading(true);
    setGlobalLoading(true);
    try {
      safeLocalStorage.setItem('dirpa_signup_name', name);
      await createUserWithEmailAndPassword(auth, email, password);
      // Clean form state upon success
      setAuthEmail('');
      setAuthPassword('');
      setAuthConfirmPassword('');
      setAuthName('');
      setAuthFieldErrors({});
    } catch (error: any) {
      console.error("Sign up failed:", error);
      safeLocalStorage.removeItem('dirpa_signup_name');
      let errorMsg = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = "This email is already in use.";
        setAuthFieldErrors({ email: "This email is already registered." });
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = "Invalid email format.";
        setAuthFieldErrors({ email: "Invalid email format." });
      } else if (error.code === 'auth/weak-password') {
        errorMsg = "Password is too weak. Must be at least 6 characters.";
        setAuthFieldErrors({ password: "Password is too weak." });
      }
      setAuthError(errorMsg);
      setAuthLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthFieldErrors({});

    const email = authEmail.trim();
    const password = authPassword;

    const errs: Record<string, string> = {};
    if (!email) errs.email = "Email address is required.";
    if (!password) errs.password = "Password is required.";

    if (Object.keys(errs).length > 0) {
      setAuthFieldErrors(errs);
      setAuthError("Please fill in both email and password.");
      return;
    }

    setAuthLoading(true);
    setGlobalLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Clean form state upon success
      setAuthEmail('');
      setAuthPassword('');
      setAuthFieldErrors({});
    } catch (error: any) {
      console.error("Sign in failed:", error);
      let errorMsg = error.message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = "Incorrect email or password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = "Invalid email format.";
        setAuthFieldErrors({ email: "Invalid email format." });
      }
      setAuthError(errorMsg);
      setAuthLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setPasswordResetSent(false);

    const email = authEmail.trim();
    if (!email) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    setAuthLoading(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setPasswordResetSent(true);
    } catch (error: any) {
      console.error("Firebase Password Reset Error:", error);
      if (error.code === 'auth/user-not-found' || error.message?.includes('user-not-found') || error.message?.includes('user not found')) {
        setAuthError("No account exists with this email address.");
      } else if (error.code === 'auth/invalid-email' || error.message?.includes('invalid-email') || error.message?.includes('invalid email')) {
        setAuthError("Please enter a valid email address.");
      } else {
        setAuthError(error.message || "An unexpected error occurred sending reset link.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveProfileChanges = async () => {
    if (!user) return;
    const name = profileEditForm.name.trim();
    const email = profileEditForm.email.trim().toLowerCase();
    
    const errs: Record<string, string> = {};
    if (!name) errs.name = "Display Name is required.";
    if (!email) errs.email = "Email Address is required.";

    if (Object.keys(errs).length > 0) {
      setProfileEditErrors(errs);
      setProfileEditErrorBanner("Please fill in all mandatory profile fields.");
      return;
    }

    // Check if another user already has this email
    const emailTaken = registeredUsers.some(u => u.id !== user.id && u.email.toLowerCase() === email);
    if (emailTaken) {
      setProfileEditErrors({ email: "This email address is already registered." });
      setProfileEditErrorBanner("Validation Error: Email address already in use.");
      return;
    }

    setProfileEditErrors({});
    setProfileEditErrorBanner(null);

    const updatedUser = {
      ...user,
      name,
      email,
      bio: profileEditForm.bio,
      avatar: profileEditForm.avatar
    };

    setAuthLoading(true);
    try {
      // 1. Put /profile/update Express API call (we will call both raw and /api prefix just in case)
      const updateData = {
        userId: user.id,
        name,
        email,
        bio: profileEditForm.bio,
        avatar: profileEditForm.avatar,
        interests: user.interests || [],
        strengths: user.strengths || [],
        careerGoal: user.careerGoal || ''
      };

      try {
        await fetch("/api/profile/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData)
        });
        
        await fetch("/profile/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData)
        });
      } catch (apiErr) {
        console.error("Express profile PUT failed:", apiErr);
      }

      // 2. Persistent storage to Cloud Firestore
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        name,
        email,
        role: user.role || 'student',
        bio: profileEditForm.bio,
        avatar: profileEditForm.avatar,
        interests: user.interests || [],
        strengths: user.strengths || [],
        careerGoal: user.careerGoal || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setUser(updatedUser);

      // Sync in registered users list
      const updatedRecords = registeredUsers.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            name,
            email,
            bio: profileEditForm.bio,
            avatar: profileEditForm.avatar
          };
        }
        return u;
      });

      setRegisteredUsers(updatedRecords);
      safeLocalStorage.setItem('dirpa_registered_users', JSON.stringify(updatedRecords));

      // Update current comments authored by this user, so their displayed name & avatar details change dynamically everywhere
      setDynamicPathways(prev => prev.map(p => ({
        ...p,
        alumniInsights: p.alumniInsights.map(ins => {
          if (ins.authorEmail === user.email || ins.id === 'alumni_mentor_cs' || ins.id === 'alumni_mentor_ca' || (ins as any).userId === user.id) {
            return {
              ...ins,
              name: name,
              avatar: profileEditForm.avatar,
              authorEmail: email
            };
          }
          return ins;
        })
      })));

      // Trigger global avatar sync across all collections and views if avatar exists
      if (profileEditForm.avatar) {
        await handleUpdateAvatarDirectly(profileEditForm.avatar);
      }

      setIsEditingProfile(false);
      alert("Profile updated successfully.");
    } catch (saveError: any) {
      console.error("Failed to save profile:", saveError);
      alert("Error saving profile: " + (saveError.message || saveError));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateComment = async (pathwayId: string, commentId: string) => {
    try {
      const feedbackRef = doc(db, "feedbacks", commentId);
      await setDoc(feedbackRef, {
        feedbackText: editCommentText,
        experience: editCommentText,
        advice: editAdviceText,
        overallRating: editRating,
        rating: editRating,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setCourseReviews(prev => prev.map(f => {
        if (f.id === commentId || f.feedbackId === commentId) {
          return {
            ...f,
            feedbackText: editCommentText,
            experience: editCommentText,
            advice: editAdviceText,
            overallRating: editRating,
            rating: editRating,
            updatedAt: new Date().toISOString()
          };
        }
        return f;
      }));

      setEditingCommentId(null);
    } catch (err) {
      console.error("Failed to update comment in Firestore:", err);
      alert("Failed to save changes: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteComment = async (pathwayId: string, commentId: string) => {
    try {
      const feedbackRef = doc(db, "feedbacks", commentId);
      await deleteDoc(feedbackRef);

      setCourseReviews(prev => prev.filter(f => f.id !== commentId && f.feedbackId !== commentId));
    } catch (err) {
      console.error("Failed to delete comment from Firestore:", err);
      alert("Failed to delete comment: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const getCategoryItems = (category: 'course' | 'job' | 'entrance-exam', query: string) => {
    const q = query.toLowerCase().trim();

    if (category === 'course') {
      const allPathways = getAllPossiblePathways();
      const filtered = allPathways.filter(p => !q || p.name.toLowerCase().includes(q) || p.level.toLowerCase().includes(q));
      return filtered.map(p => ({
        id: p.id,
        name: p.name,
        level: p.level.toUpperCase(),
        category: p.category
      }));
    }

    if (category === 'job') {
      const popularJobs = [
        { id: 'job_software_eng', name: 'Software Engineer / Developer', level: 'JOB' },
        { id: 'job_data_scientist', name: 'Data Scientist / AI Specialist', level: 'JOB' },
        { id: 'job_civil_eng', name: 'Civil Engineer', level: 'JOB' },
        { id: 'job_doctor', name: 'Medical Doctor / Surgeon', level: 'JOB' },
        { id: 'job_mechanical_eng', name: 'Mechanical Engineer', level: 'JOB' },
        { id: 'job_ca', name: 'Chartered Accountant (CA)', level: 'JOB' },
        { id: 'job_product_mgr', name: 'Product Manager', level: 'JOB' },
        { id: 'job_cyber_sec', name: 'Cyber Security Analyst', level: 'JOB' },
        { id: 'job_electrical_eng', name: 'Electrical Engineer', level: 'JOB' },
        { id: 'job_ux_designer', name: 'Graphic / UX Designer', level: 'JOB' },
        { id: 'job_pharmacist', name: 'Pharmacist', level: 'JOB' },
        { id: 'job_business_analyst', name: 'Business Analyst', level: 'JOB' },
        { id: 'job_pilot', name: 'Commercial Pilot', level: 'JOB' },
        { id: 'job_civil_services', name: 'IAS / IPS Civil Servant', level: 'JOB' },
        { id: 'job_architect', name: 'Architect', level: 'JOB' },
        { id: 'job_investment_banker', name: 'Investment Banker', level: 'JOB' },
        { id: 'job_digital_marketer', name: 'Digital Marketing Manager', level: 'JOB' },
        { id: 'job_robotics_eng', name: 'Robotics Engineer', level: 'JOB' }
      ];

      const filtered = popularJobs.filter(j => !q || j.name.toLowerCase().includes(q));
      if (q && !filtered.some(f => f.name.toLowerCase() === q)) {
        filtered.unshift({
          id: `job_custom_${q.replace(/\s+/g, '_')}`,
          name: query.trim(),
          level: 'CUSTOM JOB'
        });
      }
      return filtered;
    }

    if (category === 'entrance-exam') {
      const popularExams = [
        { id: 'jee-main', name: 'JEE Main (Engineering)', level: 'EXAM' },
        { id: 'jee-advanced', name: 'JEE Advanced (IITs)', level: 'EXAM' },
        { id: 'neet-ug', name: 'NEET UG (Medical Admissions)', level: 'EXAM' },
        { id: 'ap-eapcet', name: 'AP EAPCET (Engineering & Ag)', level: 'EXAM' },
        { id: 'ts-eapcet', name: 'TS EAPCET (Engineering & Ag)', level: 'EXAM' },
        { id: 'polycet', name: 'POLYCET (Polytechnic Diploma)', level: 'EXAM' },
        { id: 'ap-ecet', name: 'AP ECET / TS ECET (Lateral Entry)', level: 'EXAM' },
        { id: 'cat-exam', name: 'CAT (IIM Management)', level: 'EXAM' },
        { id: 'clat-exam', name: 'CLAT (National Law Universities)', level: 'EXAM' },
        { id: 'bitsat', name: 'BITSAT (BITS Admissions)', level: 'EXAM' },
        { id: 'cuet-ug', name: 'CUET UG (Central Universities)', level: 'EXAM' },
        { id: 'upsc-cse', name: 'UPSC Civil Services Exam', level: 'EXAM' },
        { id: 'gate-exam', name: 'GATE (Engineering & PSU)', level: 'EXAM' }
      ];

      const filtered = popularExams.filter(e => !q || e.name.toLowerCase().includes(q));
      if (q && !filtered.some(f => f.name.toLowerCase() === q)) {
        filtered.unshift({
          id: `exam_custom_${q.replace(/\s+/g, '_')}`,
          name: query.trim(),
          level: 'CUSTOM EXAM'
        });
      }
      return filtered;
    }

    return [];
  };

  const handleSaveValuableFeedback = async () => {
    if (!user || !selectedFeedbackItem) return;
    if (!feedbackText.trim()) {
      alert("Please enter your feedback / review text.");
      return;
    }

    setIsSubmittingFeedback(true);

    // Deduplication check: verify if feedback from this user already exists for this item
    const existingDoc = courseReviews.find(f => 
      (f.userId === user.id || f.authorEmail === user.email) &&
      (isCourseIdEquivalent(f.courseId, selectedFeedbackItem.id) || 
       isCourseIdEquivalent(f.courseId, selectedFeedbackItem.name) ||
       (f.courseName && f.courseName.toLowerCase() === selectedFeedbackItem.name.toLowerCase()))
    );

    const feedbackId = existingDoc 
      ? (existingDoc.feedbackId || existingDoc.id) 
      : (`fb_alumni_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`);

    const feedbackPayload = {
      feedbackId,
      courseId: selectedFeedbackItem.id,
      courseName: selectedFeedbackItem.name,
      itemName: selectedFeedbackItem.name,
      itemType: feedbackCategory,
      type: 'course',
      userId: user.id,
      authorEmail: user.email,
      name: user.name,
      role: user.role === 'alumni' ? 'Alumni Mentor' : 'Student Contributor',
      avatar: user.avatar || '🎓',
      institutionName: feedbackInstitution.trim() || 'DIRPA Counseling Network',
      company: feedbackInstitution.trim() || 'DIRPA Counseling Network',
      completionYear: feedbackYear || '2024',
      feedbackText: feedbackText.trim(),
      experience: feedbackText.trim(),
      advice: feedbackAdvice.trim(),
      overallRating: Number(feedbackRating),
      rating: Number(feedbackRating),
      updatedAt: new Date().toISOString(),
      ...(existingDoc ? {} : { createdAt: new Date().toISOString() })
    };

    try {
      // 1. Save / Update in Firestore collection "feedbacks"
      const feedbackRef = doc(db, "feedbacks", feedbackId);
      await setDoc(feedbackRef, feedbackPayload, { merge: true });

      // 2. Optimistically update local state courseReviews so all Student views reflect immediately
      setCourseReviews(prev => {
        const idx = prev.findIndex(f => f.id === feedbackId || f.feedbackId === feedbackId);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...feedbackPayload, id: feedbackId };
          return copy;
        } else {
          return [{ id: feedbackId, ...feedbackPayload }, ...prev];
        }
      });

      setFeedbackSubmitSuccess(true);
      setTimeout(() => {
        setFeedbackSubmitSuccess(false);
        setSelectedFeedbackItem(null);
        setFeedbackText('');
        setFeedbackAdvice('');
        setFeedbackInstitution('');
      }, 2500);
    } catch (err) {
      console.error("Failed to submit alumni feedback:", err);
      alert("Error submitting feedback: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleLikeComment = async (pathwayId: string, commentId: string) => {
    const feedbackDoc = [...courseReviews, ...platformReviews].find(f => (f.feedbackId === commentId || f.id === commentId));
    const currentLikes = Number(feedbackDoc?.likes || 0);
    try {
      const targetCol = platformReviews.some(f => (f.feedbackId === commentId || f.id === commentId)) ? "platform_reviews" : "feedbacks";
      const feedbackRef = doc(db, targetCol, commentId);
      await setDoc(feedbackRef, {
        likes: currentLikes + 1
      }, { merge: true });
    } catch (err) {
      console.error("Failed to update likes in Firestore:", err);
    }
  };

  const handleAddCommentReply = async (pathwayId: string, commentId: string) => {
    const text = commentReplyInputs[commentId]?.trim();
    if (!text) return;

    const newReply = {
      id: `rep_${Date.now()}`,
      author: user?.name || "Anonymous",
      avatar: user?.avatar || "🎓",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const feedbackDoc = [...courseReviews, ...platformReviews].find(f => (f.feedbackId === commentId || f.id === commentId));
    const currentReplies = feedbackDoc?.replies || [];
    const targetReplies = [...currentReplies, newReply];

    setCommentReplyInputs(prev => ({ ...prev, [commentId]: '' }));

    try {
      const targetCol = platformReviews.some(f => (f.feedbackId === commentId || f.id === commentId)) ? "platform_reviews" : "feedbacks";
      const feedbackRef = doc(db, targetCol, commentId);
      await setDoc(feedbackRef, {
        replies: targetReplies
      }, { merge: true });
    } catch (err) {
      console.error("Failed to sync reply with Firestore:", err);
    }
  };

  // Saved list triggers
  const toggleSavePath = async (pathId: string) => {
    // Determine the next set of saved path IDs
    const alreadySaved = savedPathIds.includes(pathId);
    const nextSavedIds = alreadySaved
      ? savedPathIds.filter((id) => id !== pathId)
      : [...savedPathIds, pathId];
    
    // Optimistic UI update
    setSavedPathIds(nextSavedIds);

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathId })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.savedPathIds)) {
          // Sync with server list if successful
        }
      }
    } catch (err) {
      console.error("Failed to toggle save bookmark on backend:", err);
    }

    // Persist bookmark synchronously to Firestore if user is signed in
    if (user) {
      try {
        const userRef = doc(db, "users", user.id);
        await setDoc(userRef, { savedPathIds: nextSavedIds }, { merge: true });

        const bookmarkId = `${user.id}_${pathId}`;
        const bookmarkRef = doc(db, "bookmarks", bookmarkId);
        if (alreadySaved) {
          await deleteDoc(bookmarkRef);
        } else {
          await setDoc(bookmarkRef, {
            userId: user.id,
            pathId,
            createdAt: new Date().toISOString()
          });
        }
        console.log("Synchronized saved pathway to Firestore database.");
      } catch (dbErr) {
        console.error("Failed to sync bookmark to Firestore:", dbErr);
      }
    }
  };

  const exportAcademicRoadmapPDF = async (targetElement?: HTMLElement | null, customTitle?: string) => {
    const element = targetElement || flowchartRef.current || careerFlowchartRef.current;
    if (!element) {
      console.warn("No flowchart element found to export.");
      return;
    }
    setIsExportingPDF(true);

    // Color conversion helper to parse dangerous 'oklch' and 'oklab' styles returned by browsers
    const oklchToRgba = (oklchStr: string): string => {
      const match = oklchStr.match(/oklch\s*\(\s*([0-9.%\-+]+)\s+([0-9.%\-+]+)\s+([a-zA-Z0-9.%\-+]+)(?:\s*\/\s*([0-9.%\-+]+))?\s*\)/i);
      if (!match) return oklchStr;

      let L = parseFloat(match[1]);
      if (match[1].includes('%')) L /= 100;

      let C = parseFloat(match[2]);
      if (match[2].includes('%')) C /= 100;

      let H_val = match[3];
      let H = parseFloat(H_val);
      if (H_val.includes('rad')) {
        // Radian input
      } else {
        H = (H * Math.PI) / 180;
      }

      let A = 1;
      if (match[4]) {
        A = parseFloat(match[4]);
        if (match[4].includes('%')) A /= 100;
      }

      const a = C * Math.cos(H);
      const b_lab = C * Math.sin(H);

      const l3 = L + 0.3963377774 * a + 0.2158037573 * b_lab;
      const m3 = L - 0.1055613458 * a - 0.0638541728 * b_lab;
      const s3 = L - 0.0894841775 * a - 1.2914855480 * b_lab;

      const l = l3 * l3 * l3;
      const m = m3 * m3 * m3;
      const s = s3 * s3 * s3;

      const r_line = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      const g_line = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const b_line = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

      const convertChannel = (c: number) => {
        if (c <= 0.0031308) {
          return 12.92 * c;
        } else {
          return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
        }
      };

      const r = Math.round(Math.max(0, Math.min(1, convertChannel(r_line))) * 255);
      const g = Math.round(Math.max(0, Math.min(1, convertChannel(g_line))) * 255);
      const b = Math.round(Math.max(0, Math.min(1, convertChannel(b_line))) * 255);

      return `rgba(${r}, ${g}, ${b}, ${A})`;
    };

    const oklabToRgba = (oklabStr: string): string => {
      const match = oklabStr.match(/oklab\s*\(\s*([0-9.%\-+]+)\s+([0-9.%\-+]+)\s+([0-9.%\-+]+)(?:\s*\/\s*([0-9.%\-+]+))?\s*\)/i);
      if (!match) return oklabStr;

      let L = parseFloat(match[1]);
      if (match[1].includes('%')) L /= 100;

      let a = parseFloat(match[2]);
      if (match[2].includes('%')) a /= 100;

      let b_lab = parseFloat(match[3]);
      if (match[3].includes('%')) b_lab /= 100;

      let A = 1;
      if (match[4]) {
        A = parseFloat(match[4]);
        if (match[4].includes('%')) A /= 100;
      }

      const l3 = L + 0.3963377774 * a + 0.2158037573 * b_lab;
      const m3 = L - 0.1055613458 * a - 0.0638541728 * b_lab;
      const s3 = L - 0.0894841775 * a - 1.2914855480 * b_lab;

      const l = l3 * l3 * l3;
      const m = m3 * m3 * m3;
      const s = s3 * s3 * s3;

      const r_line = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      const g_line = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const b_line = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

      const convertChannel = (c: number) => {
        if (c <= 0.0031308) {
          return 12.92 * c;
        } else {
          return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
        }
      };

      const r = Math.round(Math.max(0, Math.min(1, convertChannel(r_line))) * 255);
      const g = Math.round(Math.max(0, Math.min(1, convertChannel(g_line))) * 255);
      const b = Math.round(Math.max(0, Math.min(1, convertChannel(b_line))) * 255);

      return `rgba(${r}, ${g}, ${b}, ${A})`;
    };

    const replaceOklchAndOklabInString = (str: string): string => {
      if (!str) return str;
      let res = str;
      if (res.includes('oklch')) {
        res = res.replace(/oklch\s*\(\s*([0-9.%\-+]+)\s+([0-9.%\-+]+)\s+([a-zA-Z0-9.%\-+]+)(?:\s*\/\s*([0-9.%\-+]+))?\s*\)/gi, (m) => {
          return oklchToRgba(m);
        });
      }
      if (res.includes('oklab')) {
        res = res.replace(/oklab\s*\(\s*([0-9.%\-+]+)\s+([0-9.%\-+]+)\s+([0-9.%\-+]+)(?:\s*\/\s*([0-9.%\-+]+))?\s*\)/gi, (m) => {
          return oklabToRgba(m);
        });
      }
      return res;
    };

    // Vectorized DIRPA Logo Drawing Helper for PDF Export
    const drawDirpaLogo = (pdfInstance: any, x: number, y: number) => {
      const cx = x - 26;
      const cy = y + 4;

      // Outer circle black background
      pdfInstance.setFillColor(0, 0, 0);
      pdfInstance.circle(cx, cy, 3.5, 'F');

      // Compass needles
      pdfInstance.setFillColor(245, 158, 11); // Amber (Compass pointer needle top)
      pdfInstance.triangle(cx, cy - 2.5, cx - 0.6, cy, cx + 0.6, cy, 'F');

      pdfInstance.setFillColor(59, 130, 246); // Blue (Compass pointer needle bottom)
      pdfInstance.triangle(cx, cy + 2.5, cx - 0.6, cy, cx + 0.6, cy, 'F');

      // Center pivot point
      pdfInstance.setFillColor(245, 158, 11);
      pdfInstance.circle(cx, cy, 0.6, 'F');

      // Mini compass signal dot at top right of icon
      pdfInstance.setFillColor(59, 130, 246);
      pdfInstance.circle(cx + 2.5, cy - 2.5, 0.8, 'F');

      // Typography DIRPA Main bold text
      pdfInstance.setFont('helvetica', 'bold');
      pdfInstance.setFontSize(10.5);
      pdfInstance.setTextColor(0, 0, 0);
      pdfInstance.text('DIRPA', cx + 5, cy + 1.2);

      // Typography DYNAMIC ADVISOR small blue mono subtitle
      pdfInstance.setFont('courier', 'bold');
      pdfInstance.setFontSize(4.2);
      pdfInstance.setTextColor(37, 99, 235); // Blue-600
      pdfInstance.text('DISCOVER YOUR PATH!', cx + 5, cy + 3.2);
    };

    try {
      // Render clean, high resolution canvas using html2canvas
      const canvas = await html2canvas(element, {
        scale: 3, // Premium high-resolution capture
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          try {
            // Expand horizontal scroll containers in clone so full flowchart renders without clipping
            const scrollables = clonedDoc.querySelectorAll('.overflow-x-auto, .overflow-hidden');
            scrollables.forEach((s) => {
              if (s instanceof HTMLElement) {
                s.style.overflow = 'visible';
                s.style.maxWidth = 'none';
              }
            });

            const allElements = clonedDoc.getElementsByTagName('*');
            const win = clonedDoc.defaultView || window;
            for (let i = 0; i < allElements.length; i++) {
              try {
                const el = allElements[i] as HTMLElement;
                if (!el) continue;
                
                // Get computed styles for element securely
                let style: CSSStyleDeclaration | null = null;
                try {
                  if (win && win.getComputedStyle) {
                    style = win.getComputedStyle(el);
                  }
                } catch (e) {
                  // getComputedStyle might throw
                }

                const colorProps = [
                  'color', 
                  'backgroundColor', 
                  'borderColor', 
                  'borderTopColor', 
                  'borderRightColor', 
                  'borderBottomColor', 
                  'borderLeftColor', 
                  'fill', 
                  'stroke',
                  'outlineColor'
                ];
                
                for (const prop of colorProps) {
                  try {
                    const val = (el.style ? el.style[prop as any] : '') || (style ? style[prop as any] : '');
                    if (val) {
                      const valStr = val.toString();
                      if (valStr.includes('oklch') || valStr.includes('oklab')) {
                        const converted = replaceOklchAndOklabInString(valStr);
                        if (el.style) {
                          el.style[prop as any] = converted;
                        }
                      }
                    }
                  } catch (propErr) {
                    // Ignore property assignment errors
                  }
                }
              } catch (elErr) {
                // Ignore element parsing errors
              }
            }
          } catch (docErr) {
            console.error("Error in html2canvas onclone:", docErr);
          }
        }
      });

      // Load standard portrait A4 dimensions in mm (210 x 297)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const padding = 15; // 15mm page borders
      const contentWidth = pdfWidth - (padding * 2);
      
      // Calculate dynamic high-res height matching image aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgScale = contentWidth / imgWidth;
      const totalScaledHeight = imgHeight * imgScale;

      // Define page margins and printable region for multi-page support
      const topMargin = 22; // Let logo render elegantly at the top
      const bottomMargin = 15;
      const pageHeightLimit = pdfHeight - topMargin - bottomMargin; // 260mm limit per page

      // If the flowchart content easily fits within one page minus top header spacing
      if (totalScaledHeight <= pageHeightLimit) {
        // Draw the flowchart content
        const yOffset = topMargin + (pageHeightLimit - totalScaledHeight) / 2;
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', padding, yOffset, contentWidth, totalScaledHeight);
        
        // Draw vector DIRPA logo at top right of the page
        drawDirpaLogo(pdf, pdfWidth - padding, 8);
        
        // Draw elegant decorative header line and details
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.3);
        pdf.line(padding, 18, pdfWidth - padding, 18);
        
        // Footer signature
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text('© 2026 DIRPA GUIDANCE SERVICES // ACADEMIC ROADMAP', pdfWidth / 2, pdfHeight - 8, { align: 'center' });
      } else {
        // Multi-page splitting logic
        const pxPageHeight = pageHeightLimit / imgScale;
        let currentY = 0;
        let pageIndex = 0;

        while (currentY < imgHeight) {
          if (pageIndex > 0) {
            pdf.addPage();
          }

          const sliceHeight = Math.min(pxPageHeight, imgHeight - currentY);
          
          // Slice the canvas via helper canvas element
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = imgWidth;
          tempCanvas.height = sliceHeight;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(
              canvas,
              0, currentY, imgWidth, sliceHeight, // source coordinate bounds
              0, 0, imgWidth, sliceHeight      // destination coordinate bounds
            );
          }

          const sliceDataUrl = tempCanvas.toDataURL('image/png');
          const sliceHeightInMm = sliceHeight * imgScale;

          // Draw slice on current page
          pdf.addImage(sliceDataUrl, 'PNG', padding, topMargin, contentWidth, sliceHeightInMm);

          // Draw vector DIRPA logo on the top right
          drawDirpaLogo(pdf, pdfWidth - padding, 8);

          // Top boundary line
          pdf.setDrawColor(220, 220, 220);
          pdf.setLineWidth(0.3);
          pdf.line(padding, 18, pdfWidth - padding, 18);

          // Footer info
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(120, 120, 120);
          pdf.text(`Page ${pageIndex + 1} // DIRPA Academic Roadmap`, pdfWidth / 2, pdfHeight - 8, { align: 'center' });

          currentY += sliceHeight;
          pageIndex++;
        }
      }

      const rawTitle = customTitle || selectedPathway?.name || (jobQuery ? `Route-${jobQuery}` : 'Academic-Roadmap-Flowchart');
      const cleanFileName = rawTitle.replace(/[^a-zA-Z0-9_\-]/g, '-');
      pdf.save(`Academic-Roadmap-${cleanFileName}.pdf`);
    } catch (error) {
      console.error("Failed to export academic roadmap PDF:", error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadPDF = async () => {
    await exportAcademicRoadmapPDF(flowchartRef.current);
  };

  const toggleSaveAlumni = (alumniId: string) => {
    if (savedAlumniIds.includes(alumniId)) {
      setSavedAlumniIds(savedAlumniIds.filter(id => id !== alumniId));
    } else {
      setSavedAlumniIds([...savedAlumniIds, alumniId]);
    }
  };

  const resolveAlumniFromFeedback = (f: { user: string; role: string; comment: string; rating: number }): AlumniInsight => {
    const normalisedUser = f.user.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
    const found = getAllPossiblePathways()
      .flatMap(p => p.alumniInsights)
      .find(a => {
        const normalisedA = a.name.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
        return normalisedA.includes(normalisedUser) || normalisedUser.includes(normalisedA);
      });
    
    if (found) return found;

    return {
      id: `alumni_feedback_${f.user.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: f.user,
      role: f.role,
      avatar: f.user.includes('Kavitha') || f.user.includes('Mohan') || f.user.includes('Dr.') || f.user.includes('Sharma') || f.user.includes('Ananya') || f.user.includes('Sneha') || f.user.includes('Dr. Shalini') || f.user.includes('Nisha') || f.user.includes('Arundhati') || f.user.includes('Deepika') || f.user.includes('Emily') || f.user.includes('Mary') || f.user.includes('Shalini') ? '👩‍🎓' : '👨‍🎓',
      institution: f.role.includes('IIT') ? 'IIT Institution' : (f.role.includes('BMC') || f.role.includes('College') ? 'Medical College Advisory Board' : 'Prestige State University Division'),
      yearCompleted: f.role.match(/20\d{2}/)?.[0] || '2023',
      experience: f.comment,
      advice: f.comment,
      rating: f.rating,
      timeline: [
        {
          year: '2020',
          title: 'Admitted into Curriculum',
          description: 'Commenced intense specialization studies with high focus area projects',
          type: 'education'
        },
        {
          year: f.role.match(/20\d{2}/)?.[0] || '2024',
          title: 'Graduated / Present Engagement',
          description: `Established core expertise in selected study field. Present: ${f.role}. Direct feedback: "${f.comment}"`,
          type: 'milestone'
        }
      ]
    };
  };

  // Direct profile navigation
  const openAlumniProfile = (alumni: AlumniInsight) => {
    setSelectedAlumni(alumni);
  };

  // Synchronize detailed alumni user profile from Firestore when selected (Real-time sync)
  useEffect(() => {
    if (!selectedAlumni) {
      setSelectedAlumniProfile(null);
      return;
    }
    const uId = (selectedAlumni as any).userId || selectedAlumni.id;
    if (!uId) {
      setSelectedAlumniProfile(null);
      return;
    }
    const userRef = doc(db, 'users', uId);

    // Auto-create document if it doesn't already exist in Firestore so likes and followers are synchronised dynamically
    const initializeProfileIfMissing = async () => {
      try {
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          const initialDoc = {
            id: uId,
            name: selectedAlumni.name || "Verified Alumni",
            avatar: selectedAlumni.avatar || "🎓",
            role: 'alumni', // complies with security rules matching ['student', 'alumni']
            institution: (selectedAlumni as any).institution || "DIRPA network",
            bio: selectedAlumni.experience || "Expert mentor advice.",
            careerGoal: selectedAlumni.role || "Consultant",
            timeline: getAlumniTimelineSteps(selectedAlumni).map(step => ({
              label: step.label,
              year: step.year,
              courseName: step.courseName,
              schoolName: step.schoolName
            })),
            likesCount: selectedAlumni.likes || 0,
            likedBy: [],
            followersCount: 0,
            followedBy: [],
            reportedBy: [],
            reportsCount: 0,
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, initialDoc);
        }
      } catch (err) {
        console.warn("Could not auto-create alumni profile in Firestore (User might not be logged in or other limits):", err);
      }
    };

    initializeProfileIfMissing();

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setSelectedAlumniProfile({ id: docSnap.id, ...docSnap.data() });
      } else {
        setSelectedAlumniProfile(null);
      }
    }, (err) => {
      console.error("[Realtime Profile Listener Error] Failed to stream selected mentor profile:", err);
    });

    return () => unsubscribe();
  }, [selectedAlumni]);

  // Handle support/likes for alumni mentor profiles
  const handleLikeAlumniProfile = async (alumniId: string) => {
    if (!user) {
      alert("Please sign in or register to support and like mentor profiles.");
      return;
    }
    try {
      const targetId = (selectedAlumni as any)?.userId || alumniId;
      const userRef = doc(db, 'users', targetId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Auto-initialize static mentor user doc so they can be liked, followed, or reported dynamically
        const initialDoc = {
          id: targetId,
          name: selectedAlumni?.name || "Verified Alumni",
          avatar: selectedAlumni?.avatar || "🎓",
          role: 'alumni',
          institution: (selectedAlumni as any)?.institution || "DIRPA network",
          bio: selectedAlumni?.experience || "Expert mentor advice.",
          careerGoal: selectedAlumni?.role || "Consultant",
          timeline: getAlumniTimelineSteps(selectedAlumni!).map(step => ({
            label: step.label,
            year: step.year,
            courseName: step.courseName,
            schoolName: step.schoolName
          })),
          likesCount: 1,
          likedBy: [user.id],
          followersCount: 0,
          followedBy: [],
          reportedBy: [],
          reportsCount: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, initialDoc);
        return;
      }

      const data = userSnap.data();
      const likedBy = Array.isArray(data.likedBy) ? data.likedBy : [];
      let nextLikedBy: string[] = [];
      let nextLikesCount = Number(data.likesCount || 0);

      if (likedBy.includes(user.id)) {
        nextLikedBy = likedBy.filter((id: string) => id !== user.id);
        nextLikesCount = Math.max(0, nextLikesCount - 1);
      } else {
        nextLikedBy = [...likedBy, user.id];
        nextLikesCount = nextLikesCount + 1;
      }

      await setDoc(userRef, {
        likedBy: nextLikedBy,
        likesCount: nextLikesCount
      }, { merge: true });

    } catch (err) {
      console.error("Failed to toggle alumni like:", err);
      alert("Failed to update like: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Handle follows for alumni mentor profiles
  const handleFollowAlumniProfile = async (alumniId: string) => {
    if (!user) {
      alert("Please sign in or register to follow mentor profiles.");
      return;
    }
    try {
      const targetId = (selectedAlumni as any)?.userId || alumniId;
      const userRef = doc(db, 'users', targetId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Auto-initialize static mentor user doc so they can be liked, followed, or reported dynamically
        const initialDoc = {
          id: targetId,
          name: selectedAlumni?.name || "Verified Alumni",
          avatar: selectedAlumni?.avatar || "🎓",
          role: 'alumni',
          institution: (selectedAlumni as any)?.institution || "DIRPA network",
          bio: selectedAlumni?.experience || "Expert mentor advice.",
          careerGoal: selectedAlumni?.role || "Consultant",
          timeline: getAlumniTimelineSteps(selectedAlumni!).map(step => ({
            label: step.label,
            year: step.year,
            courseName: step.courseName,
            schoolName: step.schoolName
          })),
          likesCount: 0,
          likedBy: [],
          followersCount: 1,
          followedBy: [user.id],
          reportedBy: [],
          reportsCount: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, initialDoc);
        return;
      }

      const data = userSnap.data();
      const followedBy = Array.isArray(data.followedBy) ? data.followedBy : [];
      let nextFollowedBy: string[] = [];
      let nextFollowersCount = Number(data.followersCount || 0);

      if (followedBy.includes(user.id)) {
        nextFollowedBy = followedBy.filter((id: string) => id !== user.id);
        nextFollowersCount = Math.max(0, nextFollowersCount - 1);
      } else {
        nextFollowedBy = [...followedBy, user.id];
        nextFollowersCount = nextFollowersCount + 1;
      }

      await setDoc(userRef, {
        followedBy: nextFollowedBy,
        followersCount: nextFollowersCount
      }, { merge: true });

    } catch (err) {
      console.error("Failed to toggle alumni follow:", err);
      alert("Failed to update follow: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Handle report systems. If 3 reports are collected, the profile is permanently deleted and banned.
  const handleReportAlumniProfile = (alumniId: string) => {
    if (!user) {
      alert("Please sign in or register to report profiles.");
      return;
    }
    setReportingAlumniId(alumniId);
    setReportReason('Spam or Advertising');
    setReportDetails('');
    setIsReportModalOpen(true);
  };

  const submitAlumniProfileReport = async () => {
    if (!user || !reportingAlumniId) return;
    if (!reportReason) {
      alert("Please pick a report reason category.");
      return;
    }
    if (!reportDetails.trim()) {
      alert("Please describe the specific issue or report details.");
      return;
    }

    try {
      const targetId = (selectedAlumni as any)?.userId || reportingAlumniId;
      const userRef = doc(db, 'users', targetId);
      const userSnap = await getDoc(userRef);

      const reportString = `[${reportReason}] ${reportDetails.trim()}`;

      if (!userSnap.exists()) {
        // Auto-initialize static mentor user doc so they can be liked, followed, or reported dynamically
        const initialDoc = {
          id: targetId,
          name: selectedAlumni?.name || "Verified Alumni",
          avatar: selectedAlumni?.avatar || "🎓",
          role: 'alumni',
          institution: (selectedAlumni as any)?.institution || "DIRPA network",
          bio: selectedAlumni?.experience || "Expert mentor advice.",
          careerGoal: selectedAlumni?.role || "Consultant",
          timeline: getAlumniTimelineSteps(selectedAlumni!).map((step: any) => ({
            label: step.label,
            year: step.year,
            courseName: step.courseName,
            schoolName: step.schoolName
          })),
          likesCount: 0,
          likedBy: [],
          followersCount: 0,
          followedBy: [],
          reportedBy: [user.id],
          reportsCount: 1,
          reportReasons: [reportString],
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, initialDoc);
        alert(`Thank you. Your report has been submitted.\nReason: ${reportReason}\nDetails: ${reportDetails.trim()}\n\nThis profile has received 1/3 reports.`);
        
        if (selectedAlumniProfile) {
          setSelectedAlumniProfile({ ...initialDoc });
        }
        setIsReportModalOpen(false);
        setReportingAlumniId(null);
        return;
      }

      const data = userSnap.data();
      const reportedBy = Array.isArray(data.reportedBy) ? data.reportedBy : [];
      const reportReasons = Array.isArray(data.reportReasons) ? data.reportReasons : [];

      if (reportedBy.includes(user.id)) {
        alert("You have already reported this profile once.");
        setIsReportModalOpen(false);
        setReportingAlumniId(null);
        return;
      }

      const nextReportedBy = [...reportedBy, user.id];
      const nextReportReasons = [...reportReasons, reportString];
      const reportsCount = nextReportedBy.length;

      if (reportsCount >= 3) {
        // BLOCK AND REMOVE IMMEDIATELY
        alert(`CRITICAL RESPONSE: This account has now accumulated 3 independent reports for suspicious behaviour.\nLast report reason: ${reportString}\n\nUnder DIRPA safety guidelines, this account has been PERMANENTLY DELETED and BLOCKED from accessing the software platform! All associated reviews/comments will also be deleted.`);

        // 1. Create entry in blocked_users to ban UID
        const emailToBlock = data.email || "";
        await setDoc(doc(db, 'blocked_users', targetId), {
          id: targetId,
          email: emailToBlock,
          name: data.name || "Suspicious Account",
          blockedAt: new Date().toISOString(),
          reason: "Banned due to 3 reports: " + nextReportReasons.join(' | ')
        });

        // 2. Clear out any associated feedbacks
        const feedbackQuery = query(collection(db, "feedbacks"), where("userId", "==", targetId));
        const feedbackSnap = await getDocs(feedbackQuery);
        for (const docS of feedbackSnap.docs) {
          await deleteDoc(doc(db, "feedbacks", docS.id));
        }

        // 3. Delete user document from users collection
        await deleteDoc(userRef);

        // 4. Close selection
        setSelectedAlumni(null);
        setSelectedAlumniProfile(null);
      } else {
        await setDoc(userRef, {
          reportedBy: nextReportedBy,
          reportsCount: reportsCount,
          reportReasons: nextReportReasons
        }, { merge: true });

        // Update selectedAlumniProfile
        if (selectedAlumniProfile) {
          setSelectedAlumniProfile((prev: any) => ({
            ...prev,
            reportedBy: nextReportedBy,
            reportsCount: reportsCount,
            reportReasons: nextReportReasons
          }));
        }

        alert(`Thank you. Your report has been submitted.\nReason: ${reportReason}\nDetails: ${reportDetails.trim()}\n\nTotal reports against this profile: ${reportsCount}/3. If reported 3 times, the profile is automatically deleted & banned.`);
      }

      setIsReportModalOpen(false);
      setReportingAlumniId(null);
    } catch (err) {
      console.error("Failed to report profile:", err);
      alert("Failed to report profile: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Transition-enabled navigation
  const handleNavigate = (view: any, nav: any = '') => {
    setGlobalLoading(true);
    if (nav) setSelectedNav(nav);
    setCurrentView(view);
    setTimeout(() => {
      setGlobalLoading(false);
    }, 450);
  };

  // Feedback CRUD operations
  const handleStartEditFeedback = (f: any, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening alumni profile modal
    const targetId = f.id || f.feedbackId;
    setEditingFeedbackId(targetId);
    setEditingFeedbackText(f.feedbackText || f.experience || '');
  };

  const handleSaveEditedFeedback = async (f: any, e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editingFeedbackText.trim()) {
      alert("Comment content cannot be empty.");
      return;
    }
    const targetId = f.id || f.feedbackId;
    if (!targetId) return;

    try {
      const feedbackRef = doc(db, "feedbacks", targetId);
      await setDoc(feedbackRef, {
        feedbackText: editingFeedbackText,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setEditingFeedbackId(null);
    } catch (err) {
      console.error("Failed to update feedback in Firestore:", err);
      alert("Failed to save feedback edits: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteFeedback = async (f: any, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening alumni profile modal
    const targetId = f.id || f.feedbackId;
    if (!targetId) return;

    try {
      const feedbackRef = doc(db, "feedbacks", targetId);
      await deleteDoc(feedbackRef);
    } catch (err) {
      console.error("Failed to delete feedback from Firestore:", err);
      alert("Failed to delete feedback: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Triggering private mentorship session
  const startMentorshipChat = async (alumni: AlumniInsight) => {
    if (!user) {
      alert("Please sign in or sign up to message mentors and access student counseling services.");
      setCurrentView('auth');
      setSelectedAlumni(null);
      return;
    }

    const existingThread = chatThreads.find(t => t.alumniId === alumni.id);
    let targetThreadId = '';

    if (existingThread) {
      targetThreadId = existingThread.id;
    } else {
      const newThreadId = `thread_${user.id}_${alumni.id}`;
      targetThreadId = newThreadId;

      const newThreadData = {
        id: newThreadId,
        userId: user.id,
        userName: user.name || "Student Scholar",
        userAvatar: user.avatar || "🎓",
        userRole: user.role || "student",
        alumniId: alumni.id || "unknown_alumni",
        alumniName: alumni.name || "Verified Alumni",
        alumniAvatar: alumni.avatar || "🎓",
        alumniRole: alumni.role || (alumni as any).currentJobRole || "Alumni Advisor",
        lastMessage: "Connected with mentor.",
        updatedAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'conversations', newThreadId), newThreadData);

        const greetingId = `msg_greet_${Date.now()}`;
        const greetingData = {
          id: greetingId,
          senderId: alumni.id,
          senderName: alumni.name,
          senderAvatar: alumni.avatar,
          text: `Hello! Thanks for connecting with me on DIRPA. I see you are looking into my profile. Ask away your questions about my timeline and challenges!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'conversations', newThreadId, 'messages', greetingId), greetingData);

        // Also add the new thread locally so that navigation updates immediately before listeners resolve
        const newThreadObj: ChatThread = {
          ...newThreadData,
          messages: [greetingData]
        };
        setChatThreads(prev => {
          if (prev.some(t => t.id === newThreadId)) return prev;
          return [newThreadObj, ...prev];
        });
      } catch (err) {
        console.error("Failed to populate thread in Firestore:", err);
        const fallbackThread: ChatThread = {
          ...newThreadData,
          messages: [{
            id: `msg_greet_${Date.now()}`,
            senderId: alumni.id,
            senderName: alumni.name,
            senderAvatar: alumni.avatar,
            text: `Hello! Thanks for connecting with me on DIRPA. I see you are looking into my profile. Ask away your questions about my timeline and challenges!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false
          }]
        };
        setChatThreads([fallbackThread, ...chatThreads]);
      }
    }

    setActiveThreadId(targetThreadId);
    setSelectedNav('messages');
    setCurrentView('messages');
    setSelectedAlumni(null); // Close modal
  };

  // Messaging system send action
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeThreadId || !user) return;

    const activeThread = chatThreads.find(t => t.id === activeThreadId);
    if (!activeThread) return;

    const textToSend = messageInput.trim();
    setMessageInput('');

    const msgId = `msg_${Date.now()}`;
    const userMessage: Message = {
      id: msgId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar || '🎓',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    try {
      const msgRef = doc(db, 'conversations', activeThreadId, 'messages', msgId);
      await setDoc(msgRef, {
        ...userMessage,
        createdAt: new Date().toISOString()
      });

      await setDoc(doc(db, 'conversations', activeThreadId), {
        lastMessage: textToSend,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // No simulated AI or mentor auto-replies to ensure strict person-to-person conversation.
      // The real mentor with the matched ID logs in and replies in real-time.

    } catch (err) {
      console.error("Failed to send message to Firestore:", err);
      // Fallback state update
      setChatThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return { ...t, messages: [...t.messages, userMessage] };
        }
        return t;
      }));
    }
  };

  const simulateAlumniReply = (threadId: string, alumniId: string, alumniName: string, alumniAvatar: string, alumniRole: string, question: string) => {
    setActiveTypingPartner(alumniName);

    setTimeout(async () => {
      let replyText = `Thanks for asking about that! For a "${alumniRole}", what matters most is consistency and build experiments. I highly advise you build a clear portfolio instead of just school scores!`;
      
      const q = question.toLowerCase();
      if (q.includes('fees') || q.includes('cost') || q.includes('expensive')) {
        replyText = `Regarding the financial aspect, the investment pays off fast once you enter internships. Try to look for state scholarships, or government colleges where fees are highly subsidized!`;
      } else if (q.includes('duration') || q.includes('years') || q.includes('long')) {
        replyText = `It is usually completed in about 3 to 5 years depending on whether you opt for PG or go directly into clinical work. Personally, I found keeping parallel projects made the years fly by.`;
      } else if (q.includes('exam') || q.includes('admission') || q.includes('preparation')) {
        replyText = `Ah, the exams are standardized but can feel like an intensive crunch. Focus entirely on previous 10-year question templates. Consistency of 2 hours daily is far better than night shifts!`;
      } else if (q.includes('easy') || q.includes('hard') || q.includes('difficult')) {
        replyText = `Honestly, it has complex portions (especially terminal labs) but it gets highly rewarding as soon as you find friends who share similar hobbies. Don't worry, you got this!`;
      }

      const replyId = `msg_auto_${Date.now()}`;
      const replyMsg = {
        id: replyId,
        senderId: alumniId,
        senderName: alumniName,
        senderAvatar: alumniAvatar || '👨‍💼',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        createdAt: new Date().toISOString()
      };

      shownToastMsgIdsRef.current.add(replyId);
      if (currentView !== 'messages' || activeThreadId !== threadId) {
        setMessageToast({
          id: replyId,
          threadId,
          senderName: alumniName,
          senderAvatar: alumniAvatar,
          text: replyText
        });
      }

      try {
        const msgRef = doc(db, 'conversations', threadId, 'messages', replyId);
        await setDoc(msgRef, replyMsg);

        await setDoc(doc(db, 'conversations', threadId), {
          lastMessage: replyText,
          updatedAt: new Date().toISOString()
        }, { merge: true });

      } catch (err) {
        console.error("Failed to commit automated alumni answer to Firestore:", err);
      } finally {
        setActiveTypingPartner(null);
      }
    }, 1500);
  };

  const handleDeleteMessage = async (threadId: string, messageId: string) => {
    if (!user) return;
    
    const thread = chatThreads.find(t => t.id === threadId);
    if (!thread) return;

    const msg = thread.messages.find(m => m.id === messageId);
    if (!msg) return;

    if (msg.senderId !== user.id) {
      alert("Error: You can only delete your own sent messages.");
      return;
    }

    try {
      await fetch(`/api/messages/${threadId}/${messageId}`, { method: 'DELETE' });
      await fetch(`/messages/${threadId}/${messageId}`, { method: 'DELETE' });

      const msgRef = doc(db, 'conversations', threadId, 'messages', messageId);
      await deleteDoc(msgRef);

      // Instantly filter out from local cache/state
      setChatThreads(prevThreads => 
        prevThreads.map(t => {
          if (t.id === threadId) {
            return {
              ...t,
              messages: t.messages.filter(m => m.id !== messageId)
            };
          }
          return t;
        })
      );
      console.log("Message deleted safely from database.");
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleDeleteConversation = async (threadId: string) => {
    if (!user) return;
    setIsDeletingThread(true);

    try {
      await fetch(`/api/conversations/${threadId}`, { method: 'DELETE' }).catch(() => {});
      await fetch(`/conversations/${threadId}`, { method: 'DELETE' }).catch(() => {});

      // Delete conversations and messages in Firestore
      try {
        const msgsSnap = await getDocs(collection(doc(db, 'conversations', threadId), 'messages'));
        for (const mDoc of msgsSnap.docs) {
          await deleteDoc(mDoc.ref).catch(() => {});
        }
        await deleteDoc(doc(db, 'conversations', threadId)).catch(() => {});
      } catch (e) {
        // Fallback for offline or cached mode
      }

      // Instantly filter out from local state
      setChatThreads(prevThreads => prevThreads.filter(t => t.id !== threadId));

      if (activeThreadId === threadId) {
        setActiveThreadId(null);
      }
      console.log("Conversation deleted safely from database.");
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    } finally {
      setIsDeletingThread(false);
      setConfirmDeleteModalThreadId(null);
      setThreadIdBeingDeleted(null);
    }
  };

  // Alumni Experience contribution registry
  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingFeedback) return;
    if (!newExperience.experienceText.trim()) {
      alert("Please write a comment and review text before publishing.");
      return;
    }

    setIsSubmittingFeedback(true);

    const customFeedbackId = `feedback_item_${Date.now()}`;
    const targetCourse = getAllPossiblePathways().find(p => p.id === newExperience.pathwayId);
    
    const feedbackPayload = {
      feedbackId: customFeedbackId,
      userId: user?.id || "anonymous_alumni",
      authorEmail: user?.email || "",
      courseId: newExperience.pathwayId,
      courseName: targetCourse?.name || "General Course / Pathway",
      educationalStage: targetCourse?.level === "10th" ? "School" : (targetCourse?.level === "12th" ? "Intermediate" : "Graduation"),
      institutionName: (user as any)?.institution || "DIRPA counseling network",
      completionYear: String(new Date().getFullYear()),
      feedbackText: newExperience.experienceText,
      difficultyRating: 3,
      overallRating: Number(newExperience.rating) || 5,
      skillsLearned: "",
      likedMost: "",
      challengesFaced: "",
      careerOutcome: "",
      advice: newExperience.adviceText || "Stay consistent and build hands-on projects!",
      currentJobRole: user?.careerGoal || "",
      companyName: "",
      yearsOfExperience: "",
      name: user?.name || "Verified Alumni",
      avatar: user?.avatar || "🎓",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      console.log("[Student Feedbacks Log] Alumni Submit -> Direct Client Firestore target", feedbackPayload);

      const feedbackRef = doc(db, "feedbacks", customFeedbackId);
      await setDoc(feedbackRef, feedbackPayload);
      console.log("[Student Feedbacks Log] Direct Database Save -> Record Created in Firestore:", customFeedbackId);
      
      alert("🎉 Awesome! Your course comment has been stored and published online.");
      
      // Reset contribution form
      setNewExperience(prev => ({
        ...prev,
        experienceText: '',
        adviceText: '',
        rating: 5
      }));
    } catch (err) {
      console.error("Database error saving review:", err);
      alert("Failed to publish comment: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handlePublishInlineFeedback = async (
    courseId: string,
    courseName: string,
    stage: string
  ) => {
    if (isSubmittingFeedback) return;
    if (!inlineFeedback.trim()) {
      alert("Please write a comment first.");
      return;
    }

    setIsSubmittingFeedback(true);

    const customFeedbackId = `feedback_item_${Date.now()}`;
    const feedbackPayload = {
      feedbackId: customFeedbackId,
      userId: user?.id || "anonymous_alumni",
      authorEmail: user?.email || "",
      courseId: courseId,
      courseName: courseName || "General Course / Pathway",
      educationalStage: stage === "10th" ? "10th Class" : (stage === "12th" ? "Intermediate" : "Graduation"),
      institutionName: (user as any)?.institution || "DIRPA counseling network",
      completionYear: String(new Date().getFullYear()),
      feedbackText: inlineFeedback,
      difficultyRating: 3,
      overallRating: Number(inlineRating) || 5,
      skillsLearned: "",
      challengesFaced: "",
      careerOutcome: "",
      advice: inlineAdvice || "Stay consistent and build hands-on projects!",
      currentJobRole: user?.careerGoal || "",
      companyName: "",
      yearsOfExperience: "",
      name: user?.name || "Verified Alumni",
      avatar: user?.avatar || "🎓",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const feedbackRef = doc(db, "feedbacks", customFeedbackId);
      await setDoc(feedbackRef, feedbackPayload);
      console.log("[Student Feedbacks Log] Inline Database Save -> Record Created in Firestore:", customFeedbackId);
      
      // Clear inline fields
      setInlineFeedback('');
      setInlineAdvice('');
      setInlineRating(5);

      alert("🎉 Awesome! Your course comment has been stored and published online.");
    } catch (err) {
      console.error("Failed to publish inline feedback:", err);
      alert("Failed to save feedback: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // AI Recommendations handler using server-side POST API
  const handleFetchAiRecommendation = async () => {
    if (aiInputs.interests.length === 0 || !aiInputs.careerGoal) {
      alert("Please select at least one interest and enter a target Career Goal first!");
      return;
    }

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...aiInputs, lang: i18n.language })
      });

      if (!response.ok) {
        throw new Error('API server failed to process request');
      }

      const result = await response.json();
      setAiResponse(result);
    } catch (error) {
      console.error("AI recommendation retrieval failed:", error);
      alert("Could not reach backend AI Advisor. Using locally computed strategic fallback advice.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Automated Internet Course search agent utilising server-side AI + Google Grounding
  const handleFetchWebSearch = async () => {
    setIsWebSearching(true);
    setWebSearchResponse(null);

    try {
      const response = await fetch('/api/search-courses-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: webSearchQuery, lang: i18n.language })
      });

      if (!response.ok) {
        throw new Error('API server failed to find courses');
      }

      const result = await response.json();
      setWebSearchResponse(result);
    } catch (error) {
      console.error("AI web course search failed:", error);
      alert("Could not complete web course query. Using built-in local comprehensive fallback registry.");
    } finally {
      setIsWebSearching(false);
    }
  };

  // Preset AI triggers for fast user exploration
  const selectAiPreset = (preset: 'designer' | 'coder' | 'healer' | 'finance') => {
    setAiPresetSelected(preset);
    if (preset === 'designer') {
      setAiInputs({
        level: '12th',
        interests: ['Visualization', 'Aesthetics', 'User Psychology'],
        strengths: ['Creative Layouts', 'Public Speaking'],
        budget: 'medium',
        durationPref: '4 Years',
        careerGoal: 'UI/UX Interactive Designer'
      });
    } else if (preset === 'coder') {
      setAiInputs({
        level: '10th',
        interests: ['Logic', 'Coding', 'Automations'],
        strengths: ['Analytical Thinking', 'Mathematics'],
        budget: 'low',
        durationPref: '2 Years (Prep)',
        careerGoal: 'Cloud Platform Architect'
      });
    } else if (preset === 'healer') {
      setAiInputs({
        level: '12th',
        interests: ['Biology', 'Social Work', 'General Diagnostics'],
        strengths: ['Empathy', 'Rote Memorization'],
        budget: 'high',
        durationPref: '5-6 Years',
        careerGoal: 'Pediatric Surgeon'
      });
    } else if (preset === 'finance') {
      setAiInputs({
        level: '12th',
        interests: ['Mathematics', 'Finance', 'National Economics'],
        strengths: ['Problem Solving', 'Data Interpretation'],
        budget: 'low',
        durationPref: '4 Years',
        careerGoal: 'Chartered Accountant'
      });
    }
  };

  // Quick helper to handle interest lists
  const toggleInterest = (interest: string) => {
    if (aiInputs.interests.includes(interest)) {
      setAiInputs({ ...aiInputs, interests: aiInputs.interests.filter(i => i !== interest) });
    } else {
      setAiInputs({ ...aiInputs, interests: [...aiInputs.interests, interest] });
    }
  };

  // Automated estimated reading time helper for alumni reviews (averages 200 words per minute)
  const calculateReadingTime = (text: string | undefined): string => {
    if (!text) return '1 min read';
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Helper to generate the 5 flow-chart timeline steps with Year, Course name, and School name
  const getAlumniTimelineSteps = (alumni: AlumniInsight | null): { label: string; year: string; courseName: string; schoolName: string }[] => {
    if (!alumni) return [];
    
    // Check if dynamic timeline is provided from onboarding
    if ((alumni as any).timeline && Array.isArray((alumni as any).timeline)) {
      return (alumni as any).timeline.map((step: any) => ({
        label: step.label || "Stage",
        year: String(step.year || ""),
        courseName: step.courseName || step.description || "",
        schoolName: step.schoolName || ""
      }));
    }
    
    const yearCompletedNum = parseInt(alumni.yearCompleted || "") || 2022;
    const institution = alumni.institution || "";
    const role = alumni.role || "";
    const name = alumni.name || "";
    const alumniId = alumni.id || "";

    // Default structure values
    let steps = [
      {
        label: "10th",
        year: String(yearCompletedNum - 5),
        courseName: "Class 10 (Board of Secondary Education)",
        schoolName: "State ZPHS School or Local Public School"
      },
      {
        label: "11th",
        year: String(yearCompletedNum - 4),
        courseName: "Class 11 (Intermediate 1st Year)",
        schoolName: institution.includes("DIRPA") ? "Model Junior College" : (institution || "Local Junior College")
      },
      {
        label: "12th",
        year: String(yearCompletedNum - 3),
        courseName: "Class 12 (Board of Intermediate Education)",
        schoolName: institution.includes("DIRPA") ? "Model Junior College" : (institution || "Local Junior College")
      },
      {
        label: "Graduation",
        year: alumni.yearCompleted || "2022",
        courseName: role.includes("Expert") || role.includes("Director") ? "Bachelor of Science / Technology" : (role.replace("Alumni", "").replace("Contributor", "").trim() || "Higher Education Degree"),
        schoolName: institution || "Affiliated University"
      },
      {
        label: "Job",
        year: "Present",
        courseName: role.includes("Advocate") || role.includes("Director") ? "Senior Corporate Career Consultant" : (role.includes("Supervisor") ? "Senior Site Supervisor" : (role || "Working Professional")),
        schoolName: "Leading Tech / Core Corporation"
      }
    ];

    // Case-by-case refinement for standard alumni nodes to keep accurate profile alignment matched to state:
    if (name.toLowerCase().includes("pranav") || alumniId.startsWith("alumni_int_")) {
      const courseClean = (name.match(/\((.*?)\s+alumni\)/i)?.[1] || "MPC").toUpperCase();
      steps = [
        {
          label: "10th",
          year: "2018",
          courseName: "SSC (Class 10 State Board)",
          schoolName: "Government High School, Hyderabad"
        },
        {
          label: "11th",
          year: "2019",
          courseName: `${courseClean} Stream - Part I`,
          schoolName: "Narayana Junior College, Hyderabad"
        },
        {
          label: "12th",
          year: "2020",
          courseName: `${courseClean} Stream (Class 12 Boards)`,
          schoolName: "Narayana Junior College, Hyderabad"
        },
        {
          label: "Graduation",
          year: "2024",
          courseName: "B.Tech Computer Science / Allied Streams",
          schoolName: "Sathyabama University / JNTUH"
        },
        {
          label: "Job",
          year: "Present",
          courseName: "Software Engineer / Career Advocate",
          schoolName: "Product Tech Solutions"
        }
      ];
    } else if (alumni.name.toLowerCase().includes("srinivasa") || alumni.id.startsWith("alumni_poly_")) {
      steps = [
        {
          label: "10th",
          year: "2015",
          courseName: "SSC Matriculation Class 10",
          schoolName: "Zilla Parishad High School, Guntur"
        },
        {
          label: "11th",
          year: "2016",
          courseName: "Diploma in Mechanical Engineering (Yr 1)",
          schoolName: "State Polytechnic Institute, Guntur"
        },
        {
          label: "12th",
          year: "2017",
          courseName: "Diploma in Mechanical Engineering (Yr 2)",
          schoolName: "State Polytechnic Institute, Guntur"
        },
        {
          label: "Graduation",
          year: "2019",
          courseName: "Diploma Engineering Professional Graduate",
          schoolName: "State Polytechnic Institute, Guntur"
        },
        {
          label: "Job",
          year: "Present",
          courseName: "Senior Industrial Supervisor & Inspector",
          schoolName: "L&T Construction & Infrastructure"
        }
      ];
    } else if (alumni.id.startsWith("alumni_poly_iti") || alumni.id.includes("iti")) {
      steps = [
        {
          label: "10th",
          year: "2019",
          courseName: "SSC Secondary School Education",
          schoolName: "Municipal High School, Vijayawada"
        },
        {
          label: "11th",
          year: "2020",
          courseName: "ITI Vocational Trade Certification (Yr 1)",
          schoolName: "Government ITI Centre, Vijayawada"
        },
        {
          label: "12th",
          year: "2021",
          courseName: "Completed Practical Apprenticeship Workshop",
          schoolName: "Government ITI Centre, Vijayawada"
        },
        {
          label: "Graduation",
          year: "2021",
          courseName: "National Trade Certificate (NTC) holder",
          schoolName: "Government ITI Centre, Vijayawada"
        },
        {
          label: "Job",
          year: "Present",
          courseName: "Registered Vocational Trades Maintenance Specialist",
          schoolName: "State Electricity Distribution Corp"
        }
      ];
    } else if (alumni.id === "alumni_expert_cs" || alumni.name.toLowerCase().includes("expert")) {
      steps = [
        {
          label: "10th",
          year: "2012",
          courseName: "Class 10 CBSE Matriculation",
          schoolName: "Kendriya Vidyalaya, New Delhi"
        },
        {
          label: "11th",
          year: "2013",
          courseName: "Class 11 Science & Tech MPC",
          schoolName: "Kendriya Vidyalaya, New Delhi"
        },
        {
          label: "12th",
          year: "2014",
          courseName: "Class 12 Boards (AISSCE Merit Scholar)",
          schoolName: "Kendriya Vidyalaya, New Delhi"
        },
        {
          label: "Graduation",
          year: "2018",
          courseName: "B.Tech in Computer Science and Engineering",
          schoolName: "IIT Delhi / Joint Entrance merit holder"
        },
        {
          label: "Job",
          year: "Present",
          courseName: "Education Director & Curriculum Advisor",
          schoolName: "DIRPA Global Counseling Network"
        }
      ];
    }

    // Filter out 10th and 12th entries strictly as per user-intent request for the alumni profile/page display standard
    return steps.filter(step => step.label !== "10th" && step.label !== "12th");
  };

  // Draggable Map Helper to fetch nodes dynamically in standard structured flowcharts
  const get12thMapNodes = () => {
    const list_12 = [...dynamicPathways].filter(p => p.level === '12th');
    // Sort by category so similar fields group together on the circle!
    list_12.sort((a, b) => (a.category || '').localeCompare(b.category || ''));

    const cx = 1800;
    const cy = 1800;

    const nodes: any[] = [
      {
        id: 'central_12th',
        name: 'Passed Class 12 / Intermediate',
        type: 'central',
        x: cx,
        y: cy,
        category: 'Root',
        originalData: null,
        angle: 0
      }
    ];

    const N = list_12.length;
    const baseRadius = 800;

    list_12.forEach((p, idx) => {
      const angle = (idx / N) * 2 * Math.PI;
      // Alternate radius slightly to make it an elegant staggered ring, preventing overlap of card content
      const r = baseRadius + (idx % 2 === 0 ? -50 : 50);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      nodes.push({
        id: p.id,
        name: p.name,
        type: 'pathway',
        x,
        y,
        category: p.category,
        originalData: p,
        angle: angle,
        r: r
      });
    });

    return nodes;
  };

  const get10thMapNodes = () => {
    const cx = 1800;
    const cy = 1800; // Centered at 1800, 1800 for 3D radial alignment

    const nodes: any[] = [
      {
        id: 'central_10th',
        name: 'Passed Class 10 (SSC)',
        type: 'central',
        x: cx,
        y: cy,
        category: 'Root',
        originalData: null,
        angle: 0
      }
    ];

    // Hub angle center-lines divide 360 deg into 3 equal sectors (at 30, 150, 270 deg)
    const hubRadius = 400;
    const academicHubAngleCenter = Math.PI / 6; // 30 deg
    const technicalHubAngleCenter = (5 * Math.PI) / 6; // 150 deg
    const vocationalHubAngleCenter = (3 * Math.PI) / 2; // 270 deg

    nodes.push({
      id: 'hub_intermediate',
      name: 'Academic Stream (85 Groups)',
      type: 'hub',
      x: cx + hubRadius * Math.cos(academicHubAngleCenter),
      y: cy + hubRadius * Math.sin(academicHubAngleCenter),
      category: 'Academic',
      originalData: null,
      angle: academicHubAngleCenter
    });

    nodes.push({
      id: 'hub_polytechnic',
      name: 'Polytechnic Stream (26 Diplomas)',
      type: 'hub',
      x: cx + hubRadius * Math.cos(technicalHubAngleCenter),
      y: cy + hubRadius * Math.sin(technicalHubAngleCenter),
      category: 'Technical',
      originalData: null,
      angle: technicalHubAngleCenter
    });

    nodes.push({
      id: 'hub_iti',
      name: 'ITI & Vocational (10 Trades)',
      type: 'hub',
      x: cx + hubRadius * Math.cos(vocationalHubAngleCenter),
      y: cy + hubRadius * Math.sin(vocationalHubAngleCenter),
      category: 'Vocational',
      originalData: null,
      angle: vocationalHubAngleCenter
    });

    // Outer options sector allocation to avoid overlap
    // Academic Sector: spanning from -10 to 110 degrees
    const numAcademic = INTERMEDIATE_GROUPS.length;
    INTERMEDIATE_GROUPS.forEach((g, idx) => {
      const startAngle = Math.PI / 18; // 10 deg
      const endAngle = (11 * Math.PI) / 18; // 110 deg
      const angle = startAngle + (idx / (numAcademic - 1 || 1)) * (endAngle - startAngle);
      
      const ringIndex = idx % 3;
      const radius = 800 + ringIndex * 155; 
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      nodes.push({
        id: `inter_${g.code}`,
        name: `${g.name} (${g.code})`,
        type: 'intermediate',
        x,
        y,
        category: 'Intermediate Group',
        originalData: g,
        angle: angle,
        hubId: 'hub_intermediate'
      });
    });

    // Technical Sector: spanning from 130 to 230 degrees
    const numTechnical = POLYTECHNIC_DIPLOMAS.length;
    POLYTECHNIC_DIPLOMAS.forEach((p, idx) => {
      const startAngle = (13 * Math.PI) / 18; // 130 deg
      const endAngle = (23 * Math.PI) / 18; // 230 deg
      const angle = startAngle + (idx / (numTechnical - 1 || 1)) * (endAngle - startAngle);

      const ringIndex = idx % 2;
      const radius = 800 + ringIndex * 155;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      nodes.push({
        id: p.id,
        name: p.name.startsWith('Diploma') ? p.name : `Diploma in ${p.name}`,
        type: 'polytechnic',
        x,
        y,
        category: p.isEngineering ? 'Engineering Diploma' : 'Non-Engineering Diploma',
        originalData: p,
        angle: angle,
        hubId: 'hub_polytechnic'
      });
    });

    // Vocational Sector: spanning from 250 to 350 degrees
    const numVocational = ITI_VOCATIONAL_TRADES.length;
    ITI_VOCATIONAL_TRADES.forEach((t, idx) => {
      const startAngle = (25 * Math.PI) / 18; // 250 deg
      const endAngle = (35 * Math.PI) / 18; // 350 deg
      const angle = startAngle + (idx / (numVocational - 1 || 1)) * (endAngle - startAngle);

      const ringIndex = idx % 2;
      const radius = 800 + ringIndex * 120;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const id = `iti_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

      nodes.push({
        id,
        name: t.name,
        type: 'iti',
        x,
        y,
        category: t.type,
        originalData: t,
        angle: angle,
        hubId: 'hub_iti'
      });
    });

    return nodes;
  };

  const handleSelectMapNode = (node: any) => {
    if (node.type === 'central' || node.type === 'hub') {
      return;
    }

    const o = node.originalData;
    let mappedPathway: AcademicPathway;

    if (node.type === 'intermediate') {
      let groupCategory: 'Science' | 'Commerce' | 'Arts' | 'Vocational' | 'Engineering' | 'Medical' | 'Specialized' = 'Arts';
      const nameUpper = (o.name || '').toUpperCase();
      if (nameUpper.includes('MPC') || nameUpper.includes('PHY') || nameUpper.includes('MAT')) {
        groupCategory = 'Science';
      } else if (nameUpper.includes('BPC') || nameUpper.includes('BIO') || nameUpper.includes('ZOO')) {
        groupCategory = 'Medical';
      } else if (nameUpper.includes('MEC') || nameUpper.includes('CEC') || nameUpper.includes('CO') || nameUpper.includes('ECO')) {
        groupCategory = 'Commerce';
      }

      mappedPathway = {
        id: `inter_${o.code}`,
        level: '10th',
        category: groupCategory,
        name: `Intermediate ${o.name} (Code: ${o.code})`,
        duration: '2 Years',
        eligibility: 'Completed Class 10/SSC from any recognized board',
        subjects: o.subjects.filter((s: string) => s !== '-'),
        estimatedFees: '₹12,000 - ₹55,000 per academic year',
        description: `This intermediate stream focuses on: ${o.subjects.filter((s: string) => s !== '-').join(', ')}. It is a standard 2-year bridge curriculum that prepares students for national and state-level higher education options.`,
        futureOpportunities: o.nextStudies,
        higherEducationOptions: o.nextStudies.map((s: string) => `${s} (after completing intermediate)`),
        careerOutcomes: [
          'Professional graduation entry',
          'Higher research fellowships',
          'Competitive Central/State exam pipelines'
        ],
        nodePosition: { x: node.x, y: node.y },
        alumniInsights: []
      };
    } else if (node.type === 'polytechnic') {
      mappedPathway = {
        id: o.id,
        level: '10th',
        category: o.isEngineering ? 'Engineering' : 'Specialized',
        name: o.name.startsWith('Diploma') ? o.name : `Diploma in ${o.name}`,
        duration: '3 Years',
        eligibility: 'Passed Class 10/SSC with science and mathematics focus',
        subjects: ['Applied Physics', 'Engineering Mathematics', 'Technical Drawing', 'Workshop Lab Practice', 'Industrial Internship'],
        estimatedFees: '₹15,000 - ₹48,000 per academic year',
        description: o.description,
        futureOpportunities: [
          'AP/TS ECET direct second-year lateral entry admissions',
          'Junior Engineer (JE) exams at railways and municipal boards',
          'Technical apprentice designations at major manufacturing divisions'
        ],
        higherEducationOptions: [
          o.lateralBTech,
          'Standard B.Tech (Lateral Entry)',
          'AMIE (Associate Member of Institution of Engineers)'
        ],
        careerOutcomes: [
          'Junior Site Supervisor',
          'Hardware Support Specialist',
          'Industrial Plant Technician',
          'Piping/Machinery Estimator'
        ],
        nodePosition: { x: node.x, y: node.y },
        alumniInsights: []
      };
    } else {
      mappedPathway = {
        id: node.id,
        level: '10th',
        category: 'Vocational',
        name: `Vocational Selection: ${o.name}`,
        duration: o.duration,
        eligibility: 'Passed Class 10 standard / school level',
        subjects: ['Trade Theory lectures', 'Practical Workshop training', 'Trade calculations and science', 'Employability skills'],
        estimatedFees: '₹5,000 - ₹18,000 total course fees',
        description: o.description,
        futureOpportunities: [
          o.careerPath,
          'National Apprenticeship Scheme (NATS/NAPS)',
          'Direct technical recruitment exams (Railways, Defense, ISRO, DRDO)'
        ],
        higherEducationOptions: [
          'Apprenticeship certifications (NAC)',
          'Diploma Lateral entry (direct second-year entry into polytechnics)'
        ],
        careerOutcomes: [
          o.careerPath,
          'Independent Registered Workshop Contractor',
          'Maintenance Staff specialist'
        ],
        nodePosition: { x: node.x, y: node.y },
        alumniInsights: []
      };
    }

    if (isComparing) {
      if (compareTargetSlot === 'A') {
        setComparePathAId(mappedPathway.id);
        setCompareTargetSlot('B');
      } else {
        setComparePathBId(mappedPathway.id);
        setCompareTargetSlot('A');
      }
      return;
    }

    setSelectedPathway(mappedPathway);
  };

  const renderMapCanvas = (isFullScreen: boolean) => {
    const searchLower = mapSearchQuery.toLowerCase();

    // 1. Data Filtering
    // 10th Level - Academic (Intermediate Groups)
    const filteredAcademic = INTERMEDIATE_GROUPS.filter(g => {
      if (mapCategoryFilter !== 'All' && mapCategoryFilter !== 'Academic') return false;
      if (!mapSearchQuery) return true;
      return g.name.toLowerCase().includes(searchLower) ||
             g.code.toLowerCase().includes(searchLower) ||
             g.subjects.some(sub => sub.toLowerCase().includes(searchLower)) ||
             g.nextStudies.some(n => n.toLowerCase().includes(searchLower));
    });

    // 10th Level - Technical (Polytechnic Diplomas)
    const filteredTechnical = POLYTECHNIC_DIPLOMAS.filter(p => {
      if (mapCategoryFilter !== 'All' && mapCategoryFilter !== 'Technical') return false;
      if (!mapSearchQuery) return true;
      return p.name.toLowerCase().includes(searchLower) ||
             p.description.toLowerCase().includes(searchLower) ||
             p.lateralBTech.toLowerCase().includes(searchLower);
    });

    // 10th Level - Vocational (ITI)
    const filteredVocational = ITI_VOCATIONAL_TRADES.filter(t => {
      if (mapCategoryFilter !== 'All' && mapCategoryFilter !== 'Vocational') return false;
      if (!mapSearchQuery) return true;
      return t.name.toLowerCase().includes(searchLower) ||
             t.description.toLowerCase().includes(searchLower) ||
             t.careerPath.toLowerCase().includes(searchLower) ||
             t.type.toLowerCase().includes(searchLower);
    });

    // 12th Level
    const list_12 = [...dynamicPathways].filter(p => p.level === '12th');
    const filtered12 = list_12.filter(p => {
      if (selected12thStream && !isPathwayEligibleForStream(p, selected12thStream)) return false;
      if (mapCategoryFilter !== 'All' && p.category !== mapCategoryFilter) return false;
      if (!mapSearchQuery) return true;
      return p.name.toLowerCase().includes(searchLower) ||
             (p.category && p.category.toLowerCase().includes(searchLower)) ||
             (p.description && p.description.toLowerCase().includes(searchLower)) ||
             (p.subjects && p.subjects.some(sub => sub.toLowerCase().includes(searchLower))) ||
             (p.careerOutcomes && p.careerOutcomes.some(c => c.toLowerCase().includes(searchLower)));
    });

    const categories12 = [
      { id: 'Engineering', name: 'Engineering Degrees', bg: 'bg-[#EEF2FF] hover:bg-[#E0E7FF] dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-900' },
      { id: 'Medical', name: 'Medical & Paramedical Admissions', bg: 'bg-[#ECFDF5] hover:bg-[#D1FAE5] dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900' },
      { id: 'Commerce', name: 'Commerce & Management', bg: 'bg-[#FDF2F8] hover:bg-[#FCE7F3] dark:bg-pink-950/20 text-pink-900 dark:text-pink-200 border-pink-200 dark:border-pink-900' },
      { id: 'Specialized', name: 'Specialized / Creative Streams', bg: 'bg-[#FAF5FF] hover:bg-[#F3E8FF] dark:bg-purple-950/20 text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-900' }
    ];

    const hasAny10th = filteredAcademic.length > 0 || filteredTechnical.length > 0 || filteredVocational.length > 0;
    const hasAny12th = filtered12.length > 0;

    return (
      <div className="flex flex-col gap-4 w-full">
        {/* Search Bar & Stream Filter Header */}
        <div id="grid-search-filter" className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 rounded-xl transition-colors ${
          isDarkMode 
            ? 'bg-zinc-900 border-zinc-850 text-zinc-100 shadow-[4px_4px_0px_0px_rgba(255,110,0,0.15)]' 
            : 'bg-white border-black text-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        }`}>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-cyan-400 tracking-wider font-mono block">
              // Search for a Course
            </span>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <input 
                type="text" 
                placeholder="Search for a course or stream..." 
                value={mapSearchQuery}
                onChange={(e) => setMapSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-1.5 border-2 text-xs font-semibold rounded focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                  isDarkMode 
                    ? 'bg-zinc-950 border-zinc-700 text-zinc-100 focus:bg-zinc-900 placeholder-zinc-500' 
                    : 'bg-white border-black text-[#1D2129] focus:bg-yellow-50 placeholder-gray-400'
                }`}
              />
              {mapSearchQuery && (
                <button 
                  onClick={() => setMapSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400 hover:text-black dark:hover:text-white font-extrabold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-cyan-400 tracking-wider font-mono block">
              // Choose stream you want to see
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 font-mono">Stream:</span>
              <select
                value={mapCategoryFilter}
                onChange={(e) => setMapCategoryFilter(e.target.value)}
                className={`w-full border-2 px-3 py-1.5 text-xs font-bold uppercase rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-zinc-950 border-zinc-700 text-zinc-100 focus:bg-zinc-900' 
                    : 'bg-white border-black text-black focus:bg-yellow-50'
                }`}
              >
                {activeLevel === '10th' ? (
                  <>
                    <option value="All">All Streams</option>
                    <option value="Academic">Academic Stream (Intermediate)</option>
                    <option value="Technical">Polytechnic Stream (Diplomas)</option>
                    <option value="Vocational">ITI & Vocational (Trades)</option>
                  </>
                ) : (
                  <>
                    <option value="All">All Categories</option>
                    <option value="Engineering">Engineering Degrees</option>
                    <option value="Medical">Medical & Paramedical</option>
                    <option value="Commerce">Commerce & Management</option>
                    <option value="Specialized">Specialized / Creative Streams</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Outer map canvas boundary wrapper (changed to responsive grid wrapper) */}
        <div className={`p-4 md:p-6 border-2 rounded-xl text-black dark:text-white ${
          isDarkMode ? 'bg-[#0f111a] border-zinc-800' : 'bg-stone-50 border-black'
        } min-h-[500px]`}>
          
          {/* Helper toolbar */}
          <div className="flex flex-wrap justify-between items-center pb-4 mb-6 border-b border-black/10 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-black text-white dark:bg-zinc-805 px-2 py-0.5 font-bold rounded uppercase tracking-wider text-[10px]">
                {activeLevel} PATHWAYS
              </span>
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold">Select a route card to view specific features, future studies, outcomes, and reviews.</p>
            </div>

            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              {isComparing && (
                <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 px-2 py-0.5 border border-orange-300 dark:border-orange-900 rounded text-[10px]">
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                  <span className="font-bold text-orange-850 dark:text-orange-300">
                    COMPARE ROADMAP (Target: Slot {compareTargetSlot})
                  </span>
                </div>
              )}
              
            </div>
          </div>

          {activeLevel === '10th' ? (
            <div className="space-y-8">
              {!hasAny10th ? (
                <div className="text-center py-16 border-2 border-dashed border-black/10 rounded-lg">
                  <p className="text-sm font-bold text-gray-500 dark:text-zinc-400">No pathways match your filter and query: "{mapSearchQuery}"</p>
                  <button 
                    onClick={() => { setMapSearchQuery(''); setMapCategoryFilter('All'); }}
                    className="mt-3 px-4 py-2 border-2 border-black bg-yellow-300 dark:bg-yellow-500 text-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Categorized Box 1: Academic Stream */}
                  {filteredAcademic.length > 0 && (
                    <div id="10th-academic-section" className="border border-sky-200 dark:border-sky-950 bg-sky-50/50 dark:bg-sky-950/10 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-sky-100 dark:border-sky-950">
                        <div>
                          <h4 className="text-sm md:text-base font-display font-black text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                            🏛️ Academic Stream (Intermediate General Groups)
                          </h4>
                          <p className="text-[11px] text-sky-800/70 dark:text-sky-400 leading-tight">Standard 2-year general bridging curriculum preparing students for state and national universities</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 border border-sky-200 dark:border-sky-900">
                          {filteredAcademic.length} Options
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredAcademic.map((g) => {
                          const pathwayId = `inter_${g.code}`;
                          const isSelected = selectedPathway?.id === pathwayId;
                          const isCompA = comparePathAId === pathwayId;
                          const isCompB = comparePathBId === pathwayId;

                          let activeCardStyle = isSelected
                            ? "bg-blue-600 border-4 border-blue-700 dark:bg-cyan-600 dark:border-cyan-700 ring-4 ring-yellow-400 shadow-md text-white dark:text-black hover:scale-105"
                            : (isCompA || isCompB)
                              ? "bg-orange-50 border-4 border-orange-500 text-black dark:text-white ring-2 ring-orange-300"
                              : "bg-white dark:bg-zinc-850 hover:bg-stone-50 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-700 text-black dark:text-white";

                          return (
                            <motion.div
                              key={pathwayId}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                handleSelectMapNode({
                                  id: pathwayId,
                                  type: 'intermediate',
                                  originalData: g
                                });
                              }}
                              className={`cursor-pointer p-4 rounded-lg flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] transition-all ${activeCardStyle}`}
                            >
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 ${
                                    isSelected 
                                      ? 'bg-blue-700 text-white border-blue-800 dark:bg-cyan-700 dark:text-black dark:border-cyan-800' 
                                      : 'bg-stone-100 dark:bg-zinc-900 border-black/20 text-zinc-900 dark:text-zinc-300 font-black'
                                  }`}>
                                    GROUP {g.code}
                                  </span>
                                  {isSelected && (
                                    <span className="text-[8px] font-black uppercase bg-yellow-300 text-black px-1.5 py-0.5 border border-black animate-pulse">
                                      Active
                                    </span>
                                  )}
                                  {(isCompA || isCompB) && (
                                    <span className="text-[8px] font-black uppercase bg-orange-600 text-white px-1.5 py-0.5 border border-black">
                                      Compare ({isCompA ? 'A' : 'B'})
                                    </span>
                                  )}
                                </div>

                                <h5 className={`text-sm font-display font-black leading-snug mb-2 ${
                                  isSelected ? 'text-white dark:text-black font-extrabold' : 'text-[#1A1A1A] dark:text-zinc-50 font-black'
                                }`}>
                                  Intermediate {g.name}
                                </h5>

                                <div className="flex flex-wrap gap-1 mb-2">
                                  {g.subjects.filter(s => s !== '-').map((sub, sIdx) => (
                                    <span 
                                      key={sIdx} 
                                      className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                                        isSelected 
                                          ? 'bg-blue-800 border-blue-900 text-white dark:bg-cyan-800 dark:border-cyan-900 dark:text-black font-extrabold' 
                                          : 'bg-sky-100 dark:bg-sky-950 text-zinc-900 dark:text-sky-200 border-sky-300 dark:border-sky-900 font-extrabold'
                                      }`}
                                    >
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className={`mt-3 pt-2 border-t border-dashed ${
                                isSelected ? 'border-white/20 dark:border-black/20' : 'border-black/10 dark:border-zinc-800'
                              }`}>
                                <span className={`text-[8px] font-black uppercase tracking-wider block font-mono ${
                                  isSelected ? 'text-white/60 dark:text-black/60' : 'text-zinc-900 dark:text-zinc-300'
                                }`}>Higher Admissions</span>
                                <p className={`text-[10px] font-sans font-extrabold leading-tight line-clamp-1 ${
                                  isSelected ? 'text-white/90 dark:text-black/90' : 'text-slate-900 dark:text-zinc-100 font-extrabold'
                                }`}>
                                  {g.nextStudies.join(', ')}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Categorized Box 2: Polytechnic Stream */}
                  {filteredTechnical.length > 0 && (
                    <div id="10th-polytechnic-section" className="border border-slate-200 dark:border-zinc-800 bg-slate-100/40 dark:bg-zinc-900/10 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-zinc-900">
                        <div>
                          <h4 className="text-sm md:text-base font-display font-black text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                            ⚙️ Polytechnic Stream (Engineering & Non-Engineering Diplomas)
                          </h4>
                          <p className="text-[11px] text-slate-600/90 dark:text-zinc-400 leading-tight">3-year practical industry diplomas with direct lateral admission to B.Tech Year 2</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 border border-slate-300 dark:border-zinc-700">
                          {filteredTechnical.length} Options
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTechnical.map((p, idx) => {
                          const pathwayId = p.id;
                          const isSelected = selectedPathway?.id === pathwayId;
                          const isCompA = comparePathAId === pathwayId;
                          const isCompB = comparePathBId === pathwayId;

                          let activeCardStyle = isSelected
                            ? "bg-blue-600 border-4 border-blue-700 dark:bg-cyan-600 dark:border-cyan-700 ring-4 ring-yellow-400 shadow-md text-white dark:text-black hover:scale-105"
                            : (isCompA || isCompB)
                              ? "bg-orange-50 border-4 border-orange-500 text-black dark:text-white ring-2 ring-orange-300"
                              : "bg-white dark:bg-zinc-850 hover:bg-stone-50 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-700 text-black dark:text-white";

                          return (
                            <motion.div
                              key={pathwayId}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                handleSelectMapNode({
                                  id: pathwayId,
                                  type: 'polytechnic',
                                  originalData: p
                                });
                              }}
                              style={idx === 4 ? { color: '#000000' } : {}}
                              className={`cursor-pointer p-4 rounded-lg flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] transition-all ${activeCardStyle}`}
                            >
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 border ${
                                    isSelected 
                                      ? 'bg-blue-800 text-white border-blue-900 dark:bg-cyan-800 dark:text-black dark:border-cyan-900' 
                                      : p.isEngineering 
                                        ? 'bg-violet-100 text-violet-950 dark:bg-violet-950/80 dark:text-violet-200 border-violet-300 dark:border-violet-905 font-black'
                                        : 'bg-teal-100 text-teal-950 dark:bg-teal-950/80 dark:text-teal-200 border-teal-300 dark:border-teal-905 font-black'
                                  }`}>
                                    {p.isEngineering ? 'Engineering' : 'Specialized'}
                                  </span>
                                  {isSelected && (
                                    <span className="text-[8px] font-black uppercase bg-yellow-300 text-black px-1 py-0.5 border border-black animate-pulse">
                                      Active
                                    </span>
                                  )}
                                  {(isCompA || isCompB) && (
                                    <span className="text-[8px] font-black uppercase bg-orange-600 text-white px-1 py-0.5 border border-black">
                                      Compare ({isCompA ? 'A' : 'B'})
                                    </span>
                                  )}
                                </div>

                                <h5 
                                  style={idx === 4 ? { borderColor: '#000000', color: '#000000' } : {}}
                                  className={`text-sm font-display font-black leading-snug mb-1 ${
                                    isSelected ? 'text-white dark:text-black font-extrabold' : 'text-[#1A1A1A] dark:text-zinc-50 font-black'
                                  }`}
                                >
                                  Diploma in {p.name}
                                </h5>

                                <p 
                                  style={idx === 4 ? { color: '#000000' } : {}}
                                  className={`text-[10.5px] leading-tight line-clamp-3 my-2 ${
                                    isSelected ? 'text-white/80 dark:text-black/80 font-semibold' : 'text-slate-900 dark:text-zinc-100 font-semibold'
                                  }`}
                                >
                                  {p.description}
                                </p>
                              </div>

                              <div className={`mt-3 pt-2 border-t border-dashed ${
                                isSelected ? 'border-white/20 dark:border-black/20' : 'border-black/10 dark:border-zinc-800'
                              }`}>
                                <span 
                                  style={idx === 4 ? { color: '#000000' } : {}}
                                  className={`text-[8px] font-black uppercase tracking-wider block font-mono ${
                                    isSelected ? 'text-white/60' : 'text-zinc-900 dark:text-zinc-300'
                                  }`}
                                >B.Tech Lateral Goal</span>
                                <p className={`text-[10.5px] font-extrabold leading-tight truncate mt-0.5 ${
                                  isSelected ? 'text-yellow-200 dark:text-indigo-950 font-black' : 'text-[#2563EB] dark:text-cyan-400 font-extrabold'
                                }`}>
                                  {p.lateralBTech}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Categorized Box 3: ITI & Vocational trades */}
                  {filteredVocational.length > 0 && (
                    <div id="10th-vocational-section" className="border border-amber-200 dark:border-amber-950 bg-amber-50/50 dark:bg-amber-950/10 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-100 dark:border-amber-950">
                        <div>
                          <h4 className="text-sm md:text-base font-display font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            🛠️ ITI & Vocational Stream (Direct Job Oriented Tech Trades)
                          </h4>
                          <p className="text-[11px] text-amber-800/70 dark:text-amber-400 leading-tight">Tactile diagnostic trades of 1-2 years leading directly to manufacturing apprenticeship placements</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 border border-amber-200 dark:border-amber-900">
                          {filteredVocational.length} Options
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredVocational.map((t) => {
                          const pathwayId = `iti_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
                          const isSelected = selectedPathway?.id === pathwayId;
                          const isCompA = comparePathAId === pathwayId;
                          const isCompB = comparePathBId === pathwayId;

                          let activeCardStyle = isSelected
                            ? "bg-blue-600 border-4 border-blue-700 dark:bg-cyan-600 dark:border-cyan-700 ring-4 ring-yellow-400 shadow-md text-white dark:text-black hover:scale-105"
                            : (isCompA || isCompB)
                              ? "bg-orange-50 border-4 border-orange-500 text-black dark:text-white ring-2 ring-orange-300"
                              : "bg-white dark:bg-zinc-850 hover:bg-stone-50 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-700 text-black dark:text-white";

                          return (
                            <motion.div
                              key={pathwayId}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                handleSelectMapNode({
                                  id: pathwayId,
                                  type: 'iti',
                                  originalData: t
                                });
                              }}
                              className={`cursor-pointer p-4 rounded-lg flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] transition-all ${activeCardStyle}`}
                            >
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex gap-1">
                                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 border ${
                                      isSelected
                                        ? 'bg-blue-700 border-blue-800 text-white dark:bg-cyan-800 dark:text-black dark:border-cyan-800 font-extrabold'
                                        : 'bg-amber-100 text-amber-950 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300 dark:border-amber-905 font-black'
                                    }`}>
                                      {t.type.replace('ITI - ', '')}
                                    </span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                                      isSelected ? 'bg-blue-800 text-white border-blue-900 dark:bg-cyan-900 dark:text-black' : 'bg-stone-100 dark:bg-zinc-900 border-black/20 text-zinc-950 dark:text-zinc-305 font-black'
                                    }`}>
                                      {t.duration}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <span className="text-[8px] font-black uppercase bg-yellow-300 text-black px-1.5 py-0.5 border border-black animate-pulse">
                                      Active
                                    </span>
                                  )}
                                  {(isCompA || isCompB) && (
                                    <span className="text-[8px] font-black uppercase bg-orange-600 text-white px-1 py-0.5 border border-black">
                                      Compare ({isCompA ? 'A' : 'B'})
                                    </span>
                                  )}
                                </div>

                                <h5 className={`text-sm font-display font-black leading-snug mb-1 ${
                                  isSelected ? 'text-white dark:text-black font-extrabold' : 'text-[#1A1A1A] dark:text-zinc-50 font-black'
                                }`}>
                                  {t.name}
                                </h5>

                                <p className={`text-[10.5px] leading-tight line-clamp-3 my-2 ${
                                  isSelected ? 'text-white/80 dark:text-black/80 font-semibold' : 'text-slate-900 dark:text-zinc-100 font-semibold'
                                }`}>
                                  {t.description}
                                </p>
                              </div>

                              <div className={`mt-3 pt-2 border-t border-dashed ${
                                isSelected ? 'border-white/20 dark:border-black/20' : 'border-black/10 dark:border-zinc-800'
                              }`}>
                                <span className={`text-[8px] font-black uppercase tracking-wider block font-mono ${
                                  isSelected ? 'text-white/60' : 'text-zinc-900 dark:text-zinc-300'
                                }`}>Guaranteed Trade Job</span>
                                <p className={`text-[10.5px] font-extrabold leading-tight truncate mt-0.5 ${
                                  isSelected ? 'text-yellow-250 dark:text-indigo-950 font-black' : 'text-emerald-800 dark:text-emerald-300 font-black'
                                }`}>
                                  {t.careerPath}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {!selected12thStream ? (
                <div className="border-2 border-black bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left space-y-6">
                  {selected12thType === null ? (
                    /* STEP 1: ROUTING QUESTION */
                    <div className="space-y-6">
                      <div className="border-b border-black/15 dark:border-zinc-850 pb-4">
                        <span className="text-[10px] font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 px-2.5 py-1 rounded uppercase tracking-wide">
                          // STEP 1: POST-10TH PATHWAY BRANCHING
                        </span>
                        <h3 className="text-2xl md:text-3xl font-display font-black uppercase text-gray-900 dark:text-zinc-50 mt-2.5">
                          What did you complete after 10th class?
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                          Select the educational pathway you completed after 10th Class (SSC) to filter eligible graduation courses and technical degree programs.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option 1: Intermediate */}
                        <div 
                          onClick={() => setSelected12thType('Intermediate')}
                          className="border-2 border-black p-6 bg-sky-50/50 hover:bg-sky-100/70 dark:bg-zinc-850 dark:hover:bg-zinc-800 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-mono font-black text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-900 px-2.5 py-0.5 uppercase tracking-wider rounded">
                                ACADEMIC STREAM (2 YEARS)
                              </span>
                              <span className="text-3xl">🏫</span>
                            </div>
                            <h4 className="text-xl font-display font-black uppercase text-stone-900 dark:text-zinc-50 mt-4">
                              Intermediate
                            </h4>
                            <p className="text-xs font-semibold text-stone-600 dark:text-zinc-400 mt-1">
                              General Higher Secondary Education (11th & 12th Class)
                            </p>
                            <p className="text-xs text-stone-600 dark:text-zinc-350 mt-3 leading-relaxed">
                              Standard 2-year junior college stream covering Science (MPC, BiPC) or Commerce & Arts (MEC, CEC) leading to standard university entrance exams and degrees.
                            </p>
                          </div>
                          <div className="mt-6 pt-3 border-t border-dashed border-sky-200 dark:border-zinc-800 text-xs font-mono font-black text-sky-700 dark:text-sky-400 uppercase flex items-center justify-between">
                            <span>Select Intermediate Stream ➔</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        {/* Option 2: Polytechnic */}
                        <div 
                          onClick={() => setSelected12thType('Polytechnic')}
                          className="border-2 border-black p-6 bg-violet-50/50 hover:bg-violet-100/70 dark:bg-zinc-850 dark:hover:bg-zinc-800 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-mono font-black text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-950 border border-violet-300 dark:border-violet-900 px-2.5 py-0.5 uppercase tracking-wider rounded">
                                TECHNICAL DIPLOMA (3 YEARS)
                              </span>
                              <span className="text-3xl">⚙️</span>
                            </div>
                            <h4 className="text-xl font-display font-black uppercase text-stone-900 dark:text-zinc-50 mt-4">
                              Polytechnic
                            </h4>
                            <p className="text-xs font-semibold text-stone-600 dark:text-zinc-400 mt-1">
                              Technical & Engineering Diploma Branches
                            </p>
                            <p className="text-xs text-stone-600 dark:text-zinc-350 mt-3 leading-relaxed">
                              3-year technical diploma program (Computer Engineering, ECE, Civil, Mechanical, EEE) unlocking direct 2nd Year Lateral Entry into B.Tech via ECET.
                            </p>
                          </div>
                          <div className="mt-6 pt-3 border-t border-dashed border-violet-200 dark:border-zinc-800 text-xs font-mono font-black text-violet-700 dark:text-violet-400 uppercase flex items-center justify-between">
                            <span>Select Polytechnic Branch ➔</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selected12thType === 'Intermediate' ? (
                    /* STEP 2A: DYNAMIC INTERMEDIATE STREAM OPTIONS (85 GROUPS) */
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/15 dark:border-zinc-850 pb-4">
                        <div>
                          <span className="text-[10px] font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 px-2.5 py-1 rounded uppercase tracking-wide">
                            // STEP 2: INTERMEDIATE GROUPS ({INTERMEDIATE_GROUPS.length} COURSES)
                          </span>
                          <h3 className="text-2xl font-display font-black uppercase text-gray-900 dark:text-zinc-50 mt-2">
                            Select your Intermediate Stream / Group
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                            Select the specific group combination completed in 11th & 12th class (SSC Higher Secondary) to filter eligible university degree admissions.
                          </p>
                        </div>
                        <button
                          onClick={() => setSelected12thType(null)}
                          className="px-3.5 py-1.5 border-2 border-black text-xs font-mono font-black bg-white dark:bg-zinc-800 hover:bg-stone-100 text-black dark:text-white uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 transition-all cursor-pointer shrink-0"
                        >
                          ← Back to Qualification Type
                        </button>
                      </div>

                      {/* Search & Category Filter Header for 85 Intermediate Groups */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 dark:bg-zinc-800/80 p-3 border-2 border-black">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={interSearchQuery}
                            onChange={(e) => setInterSearchQuery(e.target.value)}
                            placeholder="Search 85 Intermediate groups (e.g., MPC, MEC, BPC, CEC, HEC, Code 001, Telugu, Logic)..."
                            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white text-xs border-2 border-black focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium placeholder:text-stone-400"
                          />
                          <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
                          {interSearchQuery && (
                            <button
                              onClick={() => setInterSearchQuery('')}
                              className="absolute right-3 top-2 text-stone-400 hover:text-black dark:hover:text-white text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                          {(['All', 'Science', 'Commerce', 'Arts'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setInterCategoryFilter(cat)}
                              className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase border-2 transition-all cursor-pointer ${
                                interCategoryFilter === cat
                                  ? 'bg-black text-white dark:bg-white dark:text-black border-black'
                                  : 'bg-white text-black dark:bg-zinc-900 dark:text-zinc-300 border-stone-300 dark:border-zinc-700 hover:border-black'
                              }`}
                            >
                              {cat === 'All' ? `All Groups (${INTERMEDIATE_GROUPS.length})` : cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scrollable Mapped Intermediate Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[560px] overflow-y-auto p-1 pr-2 scrollbar-thin">
                        {INTERMEDIATE_GROUPS.filter(g => {
                          const query = interSearchQuery.toLowerCase().trim();
                          const matchesSearch = !query || 
                            g.name.toLowerCase().includes(query) ||
                            g.code.includes(query) ||
                            g.subjects.some(s => s.toLowerCase().includes(query)) ||
                            g.nextStudies.some(n => n.toLowerCase().includes(query));

                          if (!matchesSearch) return false;

                          if (interCategoryFilter === 'Science') {
                            return ['001', '003', '019', '020'].includes(g.code) || g.name.includes('MPC') || g.name.includes('BPC') || g.name.includes('PHY') || g.subjects.includes('Maths-A') || g.subjects.includes('Botany');
                          }
                          if (interCategoryFilter === 'Commerce') {
                            return g.subjects.includes('Commerce') || g.subjects.includes('Economics') || g.name.includes('MEC') || g.name.includes('CEC') || g.name.includes('ECH') || g.name.includes('ECG');
                          }
                          if (interCategoryFilter === 'Arts') {
                            return g.subjects.includes('History') || g.subjects.includes('Civics') || g.subjects.includes('Sociology') || g.subjects.includes('Psychology') || g.name.includes('HEC') || g.name.includes('HCML');
                          }
                          return true;
                        }).map((group) => {
                          let badgeStyle = "bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800";
                          let hoverBorder = "hover:border-sky-600";
                          let icon = "📚";

                          if (group.name.includes('MPC') || group.subjects.includes('Maths-A') || group.code === '001') {
                            badgeStyle = "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800";
                            hoverBorder = "hover:border-indigo-600";
                            icon = "📐";
                          } else if (group.name.includes('BPC') || group.subjects.includes('Botany') || group.code === '003') {
                            badgeStyle = "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800";
                            hoverBorder = "hover:border-emerald-600";
                            icon = "🧬";
                          } else if (group.name.includes('MEC') || group.name.includes('CEC') || group.subjects.includes('Commerce') || group.code === '002' || group.code === '004') {
                            badgeStyle = "bg-pink-100 text-pink-900 border-pink-300 dark:bg-pink-950 dark:text-pink-200 dark:border-pink-800";
                            hoverBorder = "hover:border-pink-600";
                            icon = "📊";
                          } else if (group.name.includes('HEC') || group.subjects.includes('History')) {
                            badgeStyle = "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800";
                            hoverBorder = "hover:border-amber-600";
                            icon = "🏛️";
                          }

                          const activeSubjects = group.subjects.filter(s => s && s !== '-');

                          return (
                            <div
                              key={group.code}
                              onClick={() => handleSelect12thStream(group.name, 'Intermediate', group)}
                              className={`border-2 border-black p-4 bg-white dark:bg-zinc-850 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${hoverBorder}`}
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <span className={`text-[9px] font-mono font-black border px-2 py-0.5 uppercase tracking-wider rounded ${badgeStyle}`}>
                                    Code: {group.code}
                                  </span>
                                  <span className="text-xl shrink-0">{icon}</span>
                                </div>

                                <h4 className="text-base font-display font-black uppercase text-stone-900 dark:text-zinc-50 mt-2.5">
                                  {group.name}
                                </h4>

                                <div className="flex flex-wrap gap-1 mt-2">
                                  {activeSubjects.map((sub, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[9.5px] font-mono font-extrabold bg-stone-100 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 px-1.5 py-0.5 border border-stone-200 dark:border-zinc-700 rounded"
                                    >
                                      {sub}
                                    </span>
                                  ))}
                                </div>

                                <p className="text-[11px] text-stone-600 dark:text-zinc-350 mt-3 leading-snug line-clamp-2">
                                  <span className="font-bold text-black dark:text-white">Unlocks: </span>
                                  {group.nextStudies.join(', ')}
                                </p>
                              </div>

                              <div className="mt-4 pt-2.5 border-t border-dashed border-stone-200 dark:border-zinc-800 text-[10px] font-mono font-black text-indigo-700 dark:text-indigo-400 uppercase flex items-center justify-between">
                                <span>Select {group.name} ➔</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* STEP 2B: DYNAMIC POLYTECHNIC DIPLOMA BRANCH OPTIONS (28 DIPLOMAS) */
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/15 dark:border-zinc-850 pb-4">
                        <div>
                          <span className="text-[10px] font-mono font-black text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 px-2.5 py-1 rounded uppercase tracking-wide">
                            // STEP 2: POLYTECHNIC / DIPLOMA BRANCHES ({POLYTECHNIC_DIPLOMAS.length} COURSES)
                          </span>
                          <h3 className="text-2xl font-display font-black uppercase text-gray-900 dark:text-zinc-50 mt-2">
                            Select your Polytechnic / Diploma Branch
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                            Choose your 3-year technical diploma program completed after 10th class (SSC) to explore direct B.Tech 2nd Year Lateral Entry (via ECET) and degree opportunities.
                          </p>
                        </div>
                        <button
                          onClick={() => setSelected12thType(null)}
                          className="px-3.5 py-1.5 border-2 border-black text-xs font-mono font-black bg-white dark:bg-zinc-800 hover:bg-stone-100 text-black dark:text-white uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 transition-all cursor-pointer shrink-0"
                        >
                          ← Back to Qualification Type
                        </button>
                      </div>

                      {/* Search & Category Filter Header for 28 Polytechnic Courses */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-purple-50/60 dark:bg-zinc-800/80 p-3 border-2 border-black">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={polySearchQuery}
                            onChange={(e) => setPolySearchQuery(e.target.value)}
                            placeholder="Search 28 Diploma branches (e.g., Computer, Civil, Mechanical, ECE, Fashion, Cosmetology)..."
                            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white text-xs border-2 border-black focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono font-medium placeholder:text-stone-400"
                          />
                          <span className="absolute left-3 top-2.5 text-stone-400 text-xs">⚙️</span>
                          {polySearchQuery && (
                            <button
                              onClick={() => setPolySearchQuery('')}
                              className="absolute right-3 top-2 text-stone-400 hover:text-black dark:hover:text-white text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                          {(['All', 'Engineering', 'Non-Engineering'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setPolyCategoryFilter(cat)}
                              className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase border-2 transition-all cursor-pointer ${
                                polyCategoryFilter === cat
                                  ? 'bg-purple-900 text-white dark:bg-purple-400 dark:text-black border-black'
                                  : 'bg-white text-black dark:bg-zinc-900 dark:text-zinc-300 border-stone-300 dark:border-zinc-700 hover:border-black'
                              }`}
                            >
                              {cat === 'All' ? `All Diplomas (${POLYTECHNIC_DIPLOMAS.length})` : cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scrollable Mapped Polytechnic Diploma Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[560px] overflow-y-auto p-1 pr-2 scrollbar-thin">
                        {POLYTECHNIC_DIPLOMAS.filter(p => {
                          const query = polySearchQuery.toLowerCase().trim();
                          const matchesSearch = !query ||
                            p.name.toLowerCase().includes(query) ||
                            p.description.toLowerCase().includes(query) ||
                            p.lateralBTech.toLowerCase().includes(query);

                          if (!matchesSearch) return false;

                          if (polyCategoryFilter === 'Engineering') return p.isEngineering;
                          if (polyCategoryFilter === 'Non-Engineering') return !p.isEngineering;
                          return true;
                        }).map((diploma) => {
                          const isEng = diploma.isEngineering;

                          return (
                            <div
                              key={diploma.id}
                              onClick={() => handleSelect12thStream(diploma.name, 'Polytechnic', diploma)}
                              className="border-2 border-black p-4 bg-white dark:bg-zinc-850 hover:bg-purple-50/40 dark:hover:bg-zinc-800 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <span className={`text-[9px] font-mono font-black border px-2 py-0.5 uppercase tracking-wider rounded ${
                                    isEng
                                      ? "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800"
                                      : "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800"
                                  }`}>
                                    {isEng ? "⚙️ ENGINEERING" : "🎨 DESIGN / SPECIAL"}
                                  </span>
                                  <span className="text-xl shrink-0">{isEng ? "🔧" : "🎨"}</span>
                                </div>

                                <h4 className="text-base font-display font-black uppercase text-stone-900 dark:text-zinc-50 mt-2.5">
                                  {diploma.name}
                                </h4>

                                <p className="text-[11.5px] text-stone-600 dark:text-zinc-350 mt-2 leading-relaxed">
                                  {diploma.description}
                                </p>

                                {diploma.lateralBTech && (
                                  <div className="mt-3 p-2 bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded">
                                    <span className="text-[9px] font-mono font-black text-purple-700 dark:text-purple-400 block uppercase">
                                      ⚡ Lateral B.Tech Pathway:
                                    </span>
                                    <p className="text-[10px] text-stone-600 dark:text-zinc-400 font-medium leading-tight mt-0.5">
                                      {diploma.lateralBTech}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 pt-2.5 border-t border-dashed border-stone-200 dark:border-zinc-800 text-[10px] font-mono font-black text-purple-700 dark:text-purple-400 uppercase flex items-center justify-between">
                                <span>Select {diploma.name} ➔</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : !hasAny12th ? (
                <div className="border-2 border-black p-6 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  {/* Show selected active filter block so user can reset even if list is empty */}
                  <div className="border-2 border-black p-4 bg-indigo-50 dark:bg-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="text-xs shrink-0 bg-indigo-600 text-white font-mono font-black px-2 py-1 rounded">
                        12TH STREAM: {selected12thStream}
                      </span>
                      <p className="text-xs text-stone-850 dark:text-zinc-200 font-bold uppercase tracking-tight">
                        No Matching Graduation Degrees Allowed for {selected12thStream}
                      </p>
                    </div>
                    <button
                      onClick={() => { setSelected12thStream(null); setSelected12thType(null); }}
                      className="px-3.5 py-1.5 border border-black text-[10px] font-mono font-extrabold bg-white dark:bg-zinc-700 dark:text-white hover:bg-stone-50 uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 transition-all cursor-pointer shrink-0"
                    >
                      🔄 Switch 12th Course Stream
                    </button>
                  </div>

                  <div className="text-center py-12 border-2 border-dashed border-black/10 rounded-lg">
                    <p className="text-sm font-bold text-gray-500 dark:text-zinc-400">No graduation degrees match your search / filter: "{mapSearchQuery}"</p>
                    <button 
                      onClick={() => { setMapSearchQuery(''); setMapCategoryFilter('All'); }}
                      className="mt-3 px-4 py-2 border-2 border-black bg-yellow-300 dark:bg-yellow-500 text-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* STREAM ELIGIBILITY HEADING BAR */}
                  <div className="border border-black p-4 bg-indigo-50 dark:bg-zinc-900 border-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="text-xs shrink-0 bg-indigo-600 text-white font-mono font-black px-2.5 py-1 rounded">
                        12TH STREAM: {selected12thStream}
                      </span>
                      <div>
                        <p className="text-xs text-stone-900 dark:text-zinc-100 font-black uppercase tracking-tight">
                          Showing Graduation Degrees Eligible for {selected12thStream === 'POLY' ? 'Polytechnic Diploma Holder' : `Intermediate ${selected12thStream}`}
                        </p>
                        <p className="text-[10px] text-stone-550 dark:text-zinc-400 mt-0.5">
                          Based on state & national admission eligibility boards (EAPCET/NEET/CA Foundation). Only compliant routes are visible.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelected12thStream(null); setSelected12thType(null); }}
                      className="px-3.5 py-1.5 border-2 border-black text-[10px] font-mono font-extrabold bg-white hover:bg-stone-100 text-black uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 transition-all cursor-pointer shrink-0"
                    >
                      🔄 Change 12th Stream
                    </button>
                  </div>

                  {categories12.map((cat) => {
                    const matchedPaths = filtered12.filter(p => p.category === cat.id);
                    if (matchedPaths.length === 0) return null;

                    return (
                      <div key={cat.id} className={`border border-black/15 ${cat.bg} p-5 rounded-xl`}>
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10 dark:border-zinc-900/40">
                          <div>
                            <h4 className="text-sm md:text-base font-display font-black uppercase">
                              🛡️ {cat.name}
                            </h4>
                            <p className="text-[11px] opacity-80 font-medium leading-tight">Inspecting professional career trajectories, subject focus domains and alumni ratings</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-white/50 dark:bg-black/30 px-2 py-0.5 border border-black/10">
                            {matchedPaths.length} Degrees
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {matchedPaths.map((p) => {
                            const isSelected = selectedPathway?.id === p.id;
                            const isCompA = comparePathAId === p.id;
                            const isCompB = comparePathBId === p.id;

                            let activeCardStyle = isSelected
                              ? "bg-blue-600 border-4 border-blue-700 dark:bg-cyan-600 dark:border-cyan-700 ring-4 ring-yellow-400 shadow-md text-white dark:text-black hover:scale-105"
                              : (isCompA || isCompB)
                                ? "bg-orange-50 border-4 border-orange-500 text-black dark:text-white ring-2 ring-orange-300"
                                : "bg-white dark:bg-zinc-850 hover:bg-stone-50 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-700 text-black dark:text-white";

                            return (
                              <motion.div
                                key={p.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => {
                                  if (isComparing) {
                                    if (compareTargetSlot === 'A') {
                                      setComparePathAId(p.id);
                                      setCompareTargetSlot('B');
                                    } else {
                                      setComparePathBId(p.id);
                                      setCompareTargetSlot('A');
                                    }
                                  } else {
                                    setSelectedPathway(p);
                                    const match = findMatchingGraduationDegree(p, selected12thStream);
                                    if (match) {
                                      setSelectedGraduationDegree(match);
                                      setIsGradFunnelActive(true);
                                    } else {
                                      setSelectedGraduationDegree({
                                        name: p.name,
                                        careers: p.careerOutcomes && p.careerOutcomes.length > 0 ? p.careerOutcomes : ["Specialist"],
                                        description: p.description,
                                        duration: p.duration || "4 Years"
                                      });
                                      setIsGradFunnelActive(true);
                                    }
                                  }
                                }}
                                className={`cursor-pointer p-4 rounded-lg flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] transition-all ${activeCardStyle}`}
                              >
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 ${
                                      isSelected ? 'bg-blue-800 border-blue-905 text-white dark:bg-cyan-800 dark:text-black' : 'bg-stone-100 dark:bg-zinc-900 border-black/10 text-gray-500'
                                    }`}>
                                      {p.duration || '3-4 Years'}
                                    </span>
                                    {isSelected && (
                                      <span className="text-[8px] font-black uppercase bg-yellow-300 text-black px-1.5 py-0.5 border border-black animate-pulse">
                                        Active
                                      </span>
                                    )}
                                    {(isCompA || isCompB) && (
                                      <span className="text-[8px] font-black uppercase bg-orange-600 text-white px-1.5 py-0.5 border border-black">
                                        Compare ({isCompA ? 'A' : 'B'})
                                      </span>
                                    )}
                                  </div>

                                  <h5 className={`text-sn font-display font-black leading-snug mb-1 ${
                                    isSelected ? 'text-white dark:text-black font-extrabold' : 'text-[#1A1A1A] dark:text-zinc-50'
                                  }`}>
                                    {p.name.replace(/Bachelor\sof\s/g, 'B. ')}
                                  </h5>

                                  <p className={`text-[10px] uppercase font-bold tracking-tight ${
                                    isSelected ? 'text-blue-105' : 'text-gray-400'
                                  }`}>
                                    Fees: {p.estimatedFees}
                                  </p>

                                  <p className={`text-[10.5px] leading-tight line-clamp-2 my-2 ${
                                    isSelected ? 'text-white/80 dark:text-black/80 font-semibold' : 'text-gray-500 dark:text-zinc-400 font-medium'
                                  }`}>
                                    {p.description || `Inspecting professional subjects like ${p.subjects.slice(0, 3).join(', ')}.`}
                                  </p>
                                </div>

                                <div className={`mt-3 pt-2 border-t border-dashed ${
                                  isSelected ? 'border-white/20 dark:border-black/20' : 'border-black/10 dark:border-zinc-800'
                                }`}>
                                  <div className="flex justify-between items-center text-[9px] font-mono font-bold leading-none">
                                    <span className="text-gray-400">BOARD RATING</span>
                                    <span className={`font-black ${
                                      isSelected ? 'text-yellow-200 dark:text-indigo-950 text-[10px]' : 'text-blue-600 dark:text-cyan-400'
                                    }`}>
                                      💬 {p.alumniInsights?.length || 0} REVIEWS
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Real-time Dynamic Stats calculated from state
  const totalStudents = registeredUsers.filter((u: any) => u.role === 'student').length;
  const totalAlumniMentors = registeredUsers.filter((u: any) => u.role === 'alumni').length;
  const totalContributedInsights = dynamicPathways.reduce((sum, p) => sum + (p.alumniInsights || []).length, 0);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-zinc-950 text-zinc-50' : 'bg-slate-50 text-[#0f172a]'} font-sans flex flex-col justify-between selection:bg-yellow-250`}>
      
      <AnimatePresence>
        {(initializingAuth || globalLoading || authLoading) && (
          <AppPageSkeleton isDarkMode={isDarkMode} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLandingAnimation && !initializingAuth && (
          <LandingAnimation onComplete={handleLandingAnimationComplete} />
        )}
      </AnimatePresence>

      {/* ================= HEADER SECTION ================= */}
      {currentView !== 'alumni-onboarding' && (
      <nav id="top-nav" className={`sticky top-0 z-40 h-20 border-b-2 flex items-center justify-between px-6 md:px-12 transition-colors duration-200 ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm' : 'bg-white border-black text-[#1A1A1A]'
      }`}>
        <div 
          onClick={() => {
            if (user) {
              setSelectedNav('home');
              setCurrentView('dashboard');
              setActiveLevel(null);
              setSearchMethod('none');
            } else {
              setCurrentView('landing');
            }
          }} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <DirpaLogo styleName={activeLogo} variant="full" size="md" />
        </div>

        {/* Desktop & Tablet Navigation Elements (md:flex) */}
        <div className="hidden md:flex items-center gap-3">
          {currentView !== 'landing' && (
            <LanguageSwitcher variant="header" isDarkMode={isDarkMode} />
          )}
          {user ? (
            <div className="flex items-center gap-6 md:gap-10">
              <ul className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
                <li 
                  onClick={() => { setSelectedNav('home'); setCurrentView('dashboard'); setActiveLevel(null); setSearchMethod('none'); }}
                  className={`cursor-pointer pb-1 transition-all ${
                    selectedNav === 'home' 
                      ? 'text-black border-b-2 border-black opacity-100' 
                      : 'text-gray-500 hover:text-black opacity-60'
                  }`}
                >
                  {t('nav.home', 'Home')}
                </li>
                <li 
                  onClick={handleOpenMessagesTab}
                  className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 ${
                    selectedNav === 'messages' 
                      ? 'text-black border-b-2 border-black opacity-100' 
                      : 'text-gray-500 hover:text-black opacity-60'
                  }`}
                >
                  {t('nav.messages', 'Messages')}
                  {totalUnreadMessages > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-600 text-white rounded-full text-[9px] font-black border border-black shadow-sm animate-pulse">
                      {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
                    </span>
                  )}
                </li>
                <li 
                  onClick={() => { setSelectedNav('bullets'); setCurrentView('bullets'); }}
                  className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 ${
                    selectedNav === 'bullets' 
                      ? 'text-black border-b-2 border-black opacity-100' 
                      : 'text-gray-500 hover:text-black opacity-60'
                  }`}
                  id="nav-bullets-desktop"
                >
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {t('nav.bullets', 'Bullets')}
                  </span>
                  <span className="px-1 py-0.2 text-[8px] font-black uppercase bg-red-600 text-white rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                    LIVE
                  </span>
                </li>
                <li 
                  onClick={() => { setSelectedNav('stuff'); setCurrentView('stuff'); }}
                  className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 ${
                    selectedNav === 'stuff' 
                      ? 'text-black border-b-2 border-black opacity-100' 
                      : 'text-gray-500 hover:text-black opacity-60'
                  }`}
                  id="nav-stuff-desktop"
                >
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    STUFF
                  </span>
                  <span className="px-1 py-0.2 text-[8px] font-black uppercase bg-amber-400 text-black rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                    NEW
                  </span>
                </li>
                <li 
                  onClick={() => { setSelectedNav('profile'); setCurrentView('profile'); }}
                  className={`cursor-pointer pb-1 transition-all ${
                    selectedNav === 'profile' 
                      ? 'text-black border-b-2 border-black opacity-100' 
                      : 'text-gray-500 hover:text-black opacity-60'
                  }`}
                >
                  {t('nav.profile', 'Profile')}
                </li>
              </ul>

              <div className="flex items-center gap-3">
                <div 
                  onClick={() => { setSelectedNav('profile'); setCurrentView('profile'); }}
                  className="cursor-pointer hover:rotate-3 transition-transform"
                  title={t('nav.profile', 'View Profile')}
                >
                  <AvatarDisplay avatar={user.avatar} name={user.name} className="w-10 h-10 rounded-full bg-yellow-105 border-2 border-black overflow-hidden flex items-center justify-center shrink-0" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 border-2 border-black bg-white hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg text-black cursor-pointer"
                  title={t('nav.signOut', 'Sign Out')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setSelectedNav('bullets'); setCurrentView('bullets'); }}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black border-2 border-black bg-white hover:bg-amber-100 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer"
                id="guest-bullets-btn"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Bullets</span>
                <span className="px-1 py-0.2 text-[8px] bg-red-600 text-white font-black rounded">LIVE</span>
              </button>
              <button 
                onClick={() => { setSelectedNav('stuff'); setCurrentView('stuff'); }}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black border-2 border-black bg-white hover:bg-amber-100 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer"
                id="guest-stuff-btn"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>STUFF</span>
                <span className="px-1 py-0.2 text-[8px] bg-amber-400 text-black font-black rounded">NEW</span>
              </button>
              <button 
                onClick={() => { setAuthMode('signin'); setCurrentView('auth'); }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity text-black border-2 border-black bg-amber-200 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                {t('nav.signIn', 'Sign In')}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Header Right: Hamburger Menu Button (☰) ONLY (md:hidden) */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            id="mobile-hamburger-btn"
            className={`p-2.5 rounded-xl border-2 border-black transition-all flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
              isDarkMode 
                ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' 
                : 'bg-amber-200 text-black hover:bg-amber-300'
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Menu className="w-6 h-6" />
                {totalUnreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
                )}
              </div>
            )}
          </button>
        </div>

      </nav>
      )}

      {/* ================= MOBILE SIDE NAVIGATION DRAWER (md:hidden) ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop: Clicking outside closes the panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Side Navigation Panel sliding from right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className={`absolute top-0 right-0 bottom-0 w-[85vw] max-w-sm h-full flex flex-col border-l-2 border-black shadow-[-6px_0px_0px_0px_rgba(0,0,0,0.2)] ${
                isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-[#FAFAF9] text-stone-900'
              }`}
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black bg-amber-200 shrink-0">
                <div className="flex items-center gap-2 select-none">
                  <DirpaLogo styleName={activeLogo} variant="full" size="sm" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-red-100 text-black transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card (if logged in) */}
              {user && (
                <div 
                  onClick={() => {
                    setSelectedNav('profile');
                    setCurrentView('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-5 py-3.5 border-b-2 border-black/15 flex items-center gap-3 cursor-pointer transition-colors shrink-0 ${
                    isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-amber-100/40'
                  }`}
                >
                  <AvatarDisplay avatar={user.avatar} name={user.name} className="w-11 h-11 rounded-full bg-amber-200 border-2 border-black overflow-hidden flex items-center justify-center shrink-0 shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate text-stone-900 dark:text-zinc-100">{user.name}</p>
                      <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-black text-white rounded">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">{user.email}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                </div>
              )}

              {/* Scrollable Navigation Options List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
                {/* 🏠 Home */}
                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      setSelectedNav('home');
                      setCurrentView('dashboard');
                      setActiveLevel(null);
                      setSearchMethod('none');
                    } else {
                      setSelectedNav('home');
                      setCurrentView('landing');
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                    selectedNav === 'home'
                      ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isDarkMode
                      ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                      : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>{t('nav.home', 'Home')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                {/* 🤖 AI Advisor (if student / general user) */}
                {user && user.role !== 'alumni' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNav('ai-advisor');
                      setCurrentView('ai-advisor');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                      selectedNav === 'ai-advisor'
                        ? 'bg-cyan-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : isDarkMode
                        ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                        : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-cyan-600" />
                      <span>{t('nav.aiAdvisor', 'AI Advisor')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                )}

                {/* 💬 Messages */}
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenMessagesTab();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                      selectedNav === 'messages'
                        ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : isDarkMode
                        ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                        : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>{t('nav.messages', 'Messages')}</span>
                    </div>
                    {totalUnreadMessages > 0 ? (
                      <span className="px-1.5 py-0.5 bg-red-600 text-white rounded-full text-[9px] font-black border border-black shadow-sm">
                        {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    )}
                  </button>
                )}

                {/* 🎯 Bullets (Live Feed) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNav('bullets');
                    setCurrentView('bullets');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                    selectedNav === 'bullets'
                      ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isDarkMode
                      ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                      : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                  }`}
                  id="mobile-drawer-bullets"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{t('nav.bullets', 'Bullets')}</span>
                  </div>
                  <span className="px-1.5 py-0.2 text-[8px] font-black uppercase bg-red-600 text-white rounded border border-black shadow-xs">
                    LIVE
                  </span>
                </button>

                {/* 📚 STUFF (Student-Powered Learning Discovery) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNav('stuff');
                    setCurrentView('stuff');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                    selectedNav === 'stuff'
                      ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isDarkMode
                      ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                      : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                  }`}
                  id="mobile-drawer-stuff"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>STUFF • Resources</span>
                  </div>
                  <span className="px-1.5 py-0.2 text-[8px] font-black uppercase bg-amber-400 text-black rounded border border-black shadow-xs">
                    NEW
                  </span>
                </button>

                {/* 🔖 Saved (if student / general user) */}
                {user && user.role !== 'alumni' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNav('saved');
                      setCurrentView('saved');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                      selectedNav === 'saved'
                        ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : isDarkMode
                        ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                        : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark className="w-4 h-4 text-emerald-600" />
                      <span>{t('nav.saved', 'Saved')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                )}

                {/* 👤 Profile */}
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNav('profile');
                      setCurrentView('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                      selectedNav === 'profile'
                        ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : isDarkMode
                        ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                        : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-purple-600" />
                      <span>{t('nav.profile', 'Profile')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                )}

                {/* Divider for More Discovery Tools */}
                <div className="pt-2 pb-1">
                  <div className="border-t border-black/15 dark:border-zinc-800"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2 px-1">
                    Explore & Career
                  </p>
                </div>

                {/* 🎓 Entrance Exams */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNav('entrance-exams');
                    setCurrentView('entrance-exams');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                    selectedNav === 'entrance-exams'
                      ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isDarkMode
                      ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                      : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-rose-600" />
                    <span>Entrance Exams</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                {/* 💰 Scholarships */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNav('scholarships');
                    setCurrentView('scholarships');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                    selectedNav === 'scholarships'
                      ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isDarkMode
                      ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                      : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>Scholarships</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                {/* 🏢 Companies */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNav('companies');
                    setCurrentView('companies');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                    selectedNav === 'companies'
                      ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isDarkMode
                      ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                      : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Companies</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                {/* ℹ️ About Us */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNav('about');
                    setCurrentView('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wide cursor-pointer ${
                    selectedNav === 'about'
                      ? 'bg-amber-100 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isDarkMode
                      ? 'border-transparent text-zinc-300 hover:bg-zinc-800'
                      : 'border-transparent text-stone-700 hover:bg-white hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>About Us</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                {/* Language Switcher inside Drawer */}
                <div className="pt-3 pb-2">
                  <div className="border-t border-black/15 dark:border-zinc-800 pt-3">
                    <LanguageSwitcher variant="mobile" isDarkMode={isDarkMode} />
                  </div>
                </div>
              </div>

              {/* Drawer Footer: Logout or Sign In */}
              <div className="p-4 border-t-2 border-black bg-white dark:bg-zinc-900 shrink-0">
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl border-2 border-black bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav.signOut', 'Sign Out')}</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setCurrentView('auth');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-amber-200 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      {t('nav.signIn', 'Sign In')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setCurrentView('auth');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-4 rounded-xl border-2 border-black bg-white hover:bg-stone-100 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center cursor-pointer"
                    >
                      Create Free Account
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= INCOMING MESSAGE TOAST NOTIFICATION ================= */}
      <AnimatePresence>
        {messageToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 right-4 md:right-8 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-96 bg-white border-2 border-black p-4 shadow-[6px_6px_0px_0px_#000] rounded-xl flex items-start gap-3 cursor-pointer hover:bg-amber-50 group"
            onClick={() => {
              setSelectedNav('messages');
              setCurrentView('messages');
              setActiveThreadId(messageToast.threadId);
              setMessageToast(null);
            }}
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-black flex items-center justify-center text-lg shrink-0 group-hover:rotate-6 transition-transform overflow-hidden">
              {messageToast.senderAvatar && (messageToast.senderAvatar.startsWith('http') || messageToast.senderAvatar.startsWith('data:image/')) ? (
                <img src={messageToast.senderAvatar} alt={messageToast.senderName} className="w-full h-full object-cover" />
              ) : (
                messageToast.senderAvatar || '💬'
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                <h4 className="text-xs font-black uppercase tracking-wider text-black truncate">
                  New message from {messageToast.senderName}
                </h4>
              </div>
              <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-snug">
                "{messageToast.text}"
              </p>
              <span className="inline-block mt-1.5 text-[10px] font-bold text-blue-600 group-hover:underline">
                Click to open chat ➔
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMessageToast(null);
              }}
              className="p-1 border border-black hover:bg-black hover:text-white transition-colors rounded text-black shrink-0"
              title="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= DELETE CONVERSATION CONFIRMATION MODAL ================= */}
      <AnimatePresence>
        {confirmDeleteModalThreadId && (() => {
          const targetThread = chatThreads.find(t => t.id === confirmDeleteModalThreadId);
          if (!targetThread) return null;

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                if (!isDeletingThread) setConfirmDeleteModalThreadId(null);
              }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_#000] max-w-md w-full rounded-2xl relative text-black overflow-hidden"
              >
                <button
                  type="button"
                  disabled={isDeletingThread}
                  onClick={() => setConfirmDeleteModalThreadId(null)}
                  className="absolute top-4 right-4 p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-black disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 border-2 border-black flex items-center justify-center text-red-600 shrink-0 shadow-[2px_2px_0px_0px_#000]">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="pr-4">
                    <h3 className="text-base font-black uppercase tracking-tight text-black leading-snug">
                      Are you sure you want to delete this conversation?
                    </h3>
                    <p className="text-xs text-gray-600 font-medium mt-1.5 leading-relaxed">
                      All message history with <span className="font-bold text-black underline">{targetThread.alumniName}</span> will be permanently removed.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl mb-6 text-[11px] text-amber-900 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span>Prevents accidental data loss. This action cannot be undone.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    disabled={isDeletingThread}
                    onClick={() => setConfirmDeleteModalThreadId(null)}
                    className="px-4 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-gray-100 bg-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer rounded-lg shadow-[2px_2px_0px_0px_#000]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeletingThread}
                    onClick={() => handleDeleteConversation(targetThread.id)}
                    className="px-5 py-2 border-2 border-black font-black uppercase text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer rounded-lg shadow-[2px_2px_0px_0px_#000]"
                  >
                    {isDeletingThread ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Yes, Delete Conversation</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ================= MAIN SITE ROUTING ================= */}
      <main className="flex-1 pb-10 md:pb-0">

        {/* 1. OFF-AUTHENTICATED LANDING PAGE */}
        {currentView === 'landing' && (
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center text-center">
            
            {/* Premium Stylized Heading (Multilingual Looping Headline) */}
            <motion.h1 
              id="landing-hero-heading"
              key={heroTitleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontStyle: 'normal',
                textDecorationLine: 'none',
                textAlign: 'center',
                borderWidth: '0px',
                borderRadius: '0px',
                borderStyle: 'none'
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black uppercase max-w-5xl mb-6 text-black dark:text-white leading-[1.05]"
            >
              {heroTitles[heroTitleIndex]}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg md:text-xl max-w-3xl leading-relaxed mb-10 text-stone-605 text-stone-600 dark:text-stone-300"
            >
              {t('landing.heroSubtitle', "DIRPA helps prospective 10th and 12th class students map engineering, medical, commercial and specialized diplomas. Review real roadmap nodes, query server-side AI advice, and chat directly with verified alumni.")}
            </motion.p>


            {/* Custom Google SSO Action Buttons removed per user request */}

            <div className="flex flex-wrap gap-4 justify-center items-center mb-10">
              <button 
                onClick={() => { setAuthMode('signup'); setCurrentView('auth'); }}
                className="px-6 py-3 border-2 border-black text-xs font-black uppercase tracking-widest transition-all bg-black hover:bg-stone-800 text-white shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
              >
                {t('landing.joinNetwork', "Join DIRPA Network →")}
              </button>
            </div>


            {/* Beautiful Neo-Brutalist Community Statistics Bar */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="border-2 border-black dark:border-zinc-700 p-6 bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,110,0,0.15)]">
                <p id="stat-active-students" className="text-4xl md:text-5xl font-display font-black text-rose-600 dark:text-rose-400 italic">{totalStudents}</p>
                <p className="text-xs uppercase font-bold tracking-widest text-gray-500 dark:text-zinc-400 mt-2">{t('landing.activeStudentsAssisted', 'Active Students Assisted')}</p>
              </div>
              <div className="border-2 border-black dark:border-zinc-700 p-6 bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,110,0,0.15)]">
                <p id="stat-verified-alumni" className="text-4xl md:text-5xl font-display font-black text-blue-600 dark:text-cyan-400 italic">{totalAlumniMentors}</p>
                <p className="text-xs uppercase font-bold tracking-widest text-gray-500 dark:text-zinc-400 mt-2">{t('landing.verifiedGraduateAlumni', 'Verified Graduate Alumni')}</p>
              </div>
              <div className="border-2 border-black dark:border-zinc-700 p-6 bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,110,0,0.15)]">
                <p id="stat-contributed-insights" className="text-4xl md:text-5xl font-display font-black text-amber-500 dark:text-amber-400 italic">{totalContributedInsights}</p>
                <p className="text-xs uppercase font-bold tracking-widest text-gray-500 dark:text-zinc-400 mt-2">{t('landing.contributedInsights', 'Contributed Insights / Paths')}</p>
              </div>
              <div className="border-2 border-black dark:border-zinc-700 p-6 bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,110,0,0.15)]">
                <p id="stat-success-rate" className="text-4xl md:text-5xl font-display font-black text-emerald-600 dark:text-emerald-400 italic">100%</p>
                <p className="text-xs uppercase font-bold tracking-widest text-gray-500 dark:text-zinc-400 mt-2">{t('landing.counselingSuccessRate', 'Counseling Success Rate')}</p>
              </div>
            </div>

            {/* Quick Informational Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-left w-full border-t-2 border-black pt-16">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-100 border-2 border-black flex items-center justify-center mb-4">
                  <Sliders className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">{t('landing.interactiveMappingTitle', 'Interactive Node Mapping')}</h3>
                <p className="text-gray-600 text-sm">{t('landing.interactiveMappingDesc', 'Visualize your life decisions via custom node trees with prerequisites, required subjects, examinations, and fee benchmarks.')}</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 border-2 border-black flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">{t('landing.alumniInsightsTitle', 'Authentic Alumni Insights')}</h3>
                <p className="text-gray-600 text-sm">{t('landing.alumniInsightsDesc', 'No random brochure descriptions. Read genuine lessons from engineers, doctors, designers, and accountants who cleared these exact paths.')}</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 border-2 border-black flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">{t('landing.dualCounselTitle', 'Dual Human + AI Counsel')}</h3>
                <p className="text-gray-600 text-sm">{t('landing.dualCounselDesc', 'Leverage modern AI models to customize roadmap structures alongside real peer chat and advice networks.')}</p>
              </div>
            </div>

          </div>
        )}

        {/* 2. AUTHENTICATION VIEW */}
        {currentView === 'auth' && (
          <div className="max-w-md mx-auto px-6 py-12 md:py-24">
            <div className={`border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors relative overflow-hidden ${
              isDarkMode ? 'bg-zinc-900 border-zinc-700 text-[#F3F4F6]' : 'bg-white text-black'
            }`}>
              
              <AnimatePresence>
                {authLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 bg-white/95 dark:bg-zinc-900/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[1px]"
                  >
                    <div className="flex flex-col items-center max-w-xs">
                      {/* Neo-brutalist rotating loader ring */}
                      <div className="relative w-16 h-16 mb-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-4 border-dashed border-black dark:border-amber-400"
                        />
                        <motion.div
                          animate={{ scale: [0.9, 1.1, 0.9] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-3 rounded-full bg-amber-400 border-2 border-black dark:border-amber-400 flex items-center justify-center font-black text-xs text-black"
                        >
                          🔑
                        </motion.div>
                      </div>

                      <h3 className="font-display font-black uppercase text-lg tracking-tight mb-2">
                        Securing Hub Connection
                      </h3>
                      
                      {/* Animated feedback text stream */}
                      <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400 animate-pulse">
                        {isForgotPassword ? 'Delivering reset dispatch...' :
                         authMode === 'signin' ? 'Verifying secure node credentials...' :
                         'Provisioning academic profile node...'}
                      </p>

                      {/* Retro tiny progress indicator */}
                      <div className="w-24 h-1 bg-stone-200 dark:bg-zinc-800 border border-black mt-4 overflow-hidden relative">
                        <motion.div 
                          animate={{ x: [-96, 96] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute top-0 bottom-0 left-0 w-24 bg-black dark:bg-amber-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center mb-6">
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-zinc-800 text-amber-800 dark:text-amber-400 font-sans font-bold text-[10px] uppercase tracking-wider border-2 border-black mb-3">
                  DIRPA Pathway Portal
                </span>
                <h2 className="text-3xl font-display font-black uppercase mt-1">
                  Portal Access
                </h2>
              </div>

              {/* CONDITIONAL RENDER: STANDARD LOGIN/SIGNUP */}
              <>
                  {/* TABS CONTAINER */}
                  <div className="flex border-2 border-black mb-6 bg-stone-100">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signin'); setIsForgotPassword(false); setAuthError(null); }}
                      className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider border-r-2 border-black transition-all cursor-pointer ${
                        authMode === 'signin' && !isForgotPassword
                          ? 'bg-amber-400 text-black font-extrabold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setIsForgotPassword(false); setAuthError(null); }}
                      className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        authMode === 'signup' && !isForgotPassword
                          ? 'bg-amber-400 text-black font-extrabold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {authError && (
                    <div id="auth-error-box" className="mb-6 p-4 border-2 border-red-500 bg-red-50 dark:bg-zinc-950 text-red-700 dark:text-red-400 font-mono text-[11px] leading-relaxed flex flex-col gap-1">
                      <span className="font-bold underline uppercase">System Notification:</span>
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* FORGOT PASSWORD SCREEN */}
                  {isForgotPassword ? (
                    <div className="space-y-5">
                      <div className="text-left mb-2">
                        <button
                          type="button"
                          onClick={() => { setIsForgotPassword(false); setAuthError(null); setPasswordResetSent(false); }}
                          className="text-[10px] font-black uppercase text-stone-600 hover:text-black hover:underline cursor-pointer bg-transparent border-0 p-0 flex items-center gap-1"
                        >
                          &larr; Back to Sign In
                        </button>
                      </div>

                      {passwordResetSent ? (
                        <div id="auth-success-box" className="p-4 border-2 border-emerald-500 bg-emerald-50 text-emerald-800 text-xs font-semibold text-center rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          Password reset link has been sent to your email address.
                        </div>
                      ) : (
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-left">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              className="w-full px-4 py-2 text-sm border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white"
                              placeholder="email@example.com"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full py-3 bg-black hover:bg-stone-800 text-white font-black uppercase text-xs tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:bg-stone-400 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center gap-2"
                          >
                            {authLoading ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
                                <span>Sending...</span>
                              </>
                            ) : (
                              'Send Reset Link'
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : authMode === 'signin' ? (
                    /* SIGN IN TAB CONTENT */
                    <div className="space-y-4">
                      <form onSubmit={handleEmailSignIn} className="space-y-4 text-left">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(e) => {
                              setAuthEmail(e.target.value);
                              if (authFieldErrors.email) setAuthFieldErrors(prev => ({ ...prev, email: '' }));
                            }}
                            className={`w-full px-4 py-2 text-sm border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white ${
                              authFieldErrors.email ? 'border-red-600 bg-red-50 dark:bg-red-950/40' : 'border-black'
                            }`}
                            placeholder="email@example.com"
                          />
                          {authFieldErrors.email && (
                            <p className="text-[10px] font-bold text-red-600 mt-1">⚠️ {authFieldErrors.email}</p>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                              Password *
                            </label>
                            <button
                              type="button"
                              onClick={() => { setIsForgotPassword(true); setAuthError(null); }}
                              className="text-[10px] font-bold uppercase text-blue-700 dark:text-cyan-400 hover:underline cursor-pointer bg-transparent border-0 p-0"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <input
                            type="password"
                            value={authPassword}
                            onChange={(e) => {
                              setAuthPassword(e.target.value);
                              if (authFieldErrors.password) setAuthFieldErrors(prev => ({ ...prev, password: '' }));
                            }}
                            className={`w-full px-4 py-2 text-sm border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white ${
                              authFieldErrors.password ? 'border-red-600 bg-red-50 dark:bg-red-950/40' : 'border-black'
                            }`}
                            placeholder="••••••••"
                          />
                          {authFieldErrors.password && (
                            <p className="text-[10px] font-bold text-red-600 mt-1">⚠️ {authFieldErrors.password}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full py-3 bg-black hover:bg-stone-800 text-white font-black uppercase text-xs tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:bg-stone-400 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center gap-2 mt-2"
                        >
                          {authLoading ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
                              <span>Signing In...</span>
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </button>
                      </form>

                      {/* DIVIDER */}
                      <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t-2 border-black/10 dark:border-zinc-800"></div>
                        </div>
                        <span className={`relative px-3 text-xs font-black uppercase tracking-widest font-mono ${
                          isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-white text-stone-500'
                        }`}>
                          OR
                        </span>
                      </div>

                      {/* GOOGLE ACTION BUTTON */}
                      <button
                        type="button"
                        onClick={handleGoogleSignInDirect}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-stone-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 border-2 border-black dark:border-zinc-700 text-black dark:text-white font-bold uppercase text-[11px] tracking-wide transition-all active:scale-[0.98] cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Continue with Google</span>
                      </button>

                      <p className="text-center text-[11px] font-black uppercase tracking-wider mt-4">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                          className="text-blue-700 dark:text-cyan-400 hover:underline font-black cursor-pointer bg-transparent border-0 p-0"
                        >
                          Create Account
                        </button>
                      </p>
                    </div>
                  ) : (
                    /* SIGN UP TAB CONTENT */
                    <div className="space-y-4">
                      <form onSubmit={handleEmailSignUp} className="space-y-4 text-left">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={authName}
                            onChange={(e) => {
                              setAuthName(e.target.value);
                              if (authFieldErrors.name) setAuthFieldErrors(prev => ({ ...prev, name: '' }));
                            }}
                            className={`w-full px-4 py-2 text-sm border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white ${
                              authFieldErrors.name ? 'border-red-600 bg-red-50 dark:bg-red-950/40' : 'border-black'
                            }`}
                            placeholder="Your Full Name"
                          />
                          {authFieldErrors.name && (
                            <p className="text-[10px] font-bold text-red-600 mt-1">⚠️ {authFieldErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(e) => {
                              setAuthEmail(e.target.value);
                              if (authFieldErrors.email) setAuthFieldErrors(prev => ({ ...prev, email: '' }));
                            }}
                            className={`w-full px-4 py-2 text-sm border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white ${
                              authFieldErrors.email ? 'border-red-600 bg-red-50 dark:bg-red-950/40' : 'border-black'
                            }`}
                            placeholder="email@example.com"
                          />
                          {authFieldErrors.email && (
                            <p className="text-[10px] font-bold text-red-600 mt-1">⚠️ {authFieldErrors.email}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Password *
                          </label>
                          <input
                            type="password"
                            value={authPassword}
                            onChange={(e) => {
                              setAuthPassword(e.target.value);
                              if (authFieldErrors.password) setAuthFieldErrors(prev => ({ ...prev, password: '' }));
                            }}
                            className={`w-full px-4 py-2 text-sm border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white ${
                              authFieldErrors.password ? 'border-red-600 bg-red-50 dark:bg-red-950/40' : 'border-black'
                            }`}
                            placeholder="••••••••"
                          />
                          {authFieldErrors.password && (
                            <p className="text-[10px] font-bold text-red-600 mt-1">⚠️ {authFieldErrors.password}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Confirm Password *
                          </label>
                          <input
                            type="password"
                            value={authConfirmPassword}
                            onChange={(e) => {
                              setAuthConfirmPassword(e.target.value);
                              if (authFieldErrors.confirmPassword) setAuthFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                            className={`w-full px-4 py-2 text-sm border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white ${
                              authFieldErrors.confirmPassword ? 'border-red-600 bg-red-50 dark:bg-red-950/40' : 'border-black'
                            }`}
                            placeholder="••••••••"
                          />
                          {authFieldErrors.confirmPassword && (
                            <p className="text-[10px] font-bold text-red-600 mt-1">⚠️ {authFieldErrors.confirmPassword}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full py-3 bg-black hover:bg-stone-800 text-white font-black uppercase text-xs tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:bg-stone-400 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center gap-2 mt-2"
                        >
                          {authLoading ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
                              <span>Creating Account...</span>
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </button>
                      </form>

                      {/* DIVIDER */}
                      <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t-2 border-black/10 dark:border-zinc-800"></div>
                        </div>
                        <span className={`relative px-3 text-xs font-black uppercase tracking-widest font-mono ${
                          isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-white text-stone-500'
                        }`}>
                          OR
                        </span>
                      </div>

                      {/* GOOGLE ACTION BUTTON */}
                      <button
                        type="button"
                        onClick={handleGoogleSignInDirect}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-stone-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 border-2 border-black dark:border-zinc-700 text-black dark:text-white font-bold uppercase text-[11px] tracking-wide transition-all active:scale-[0.98] cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Continue with Google</span>
                      </button>

                      <p className="text-center text-[11px] font-black uppercase tracking-wider mt-4">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                          className="text-blue-700 dark:text-cyan-400 hover:underline font-black cursor-pointer bg-transparent border-0 p-0"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  )}
                </>

              {/* Informational help note for users to enable Email/Password provider if they configure their own firebase */}
              <div className="mt-8 pt-4 border-t border-black/10 dark:border-zinc-800 text-center">
                <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest font-mono block">
                  // Dual Security Credentials Standard
                </span>
                <span className="text-[8px] text-zinc-400 tracking-normal font-sans block mt-1">
                  Ensure "Email/Password" is enabled in your Firebase console Auth providers.
                </span>
              </div>

            </div>
          </div>
        )}

        {/* 2.2. PASSWORD RESET VIEW */}
        {currentView === 'reset-password' && (
          <div className="max-w-md mx-auto px-6 py-12 md:py-24">
            <div className={`border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors relative overflow-hidden ${
              isDarkMode ? 'bg-zinc-900 border-zinc-700 text-[#F3F4F6]' : 'bg-white text-black'
            }`}>
              
              <div className="text-center mb-6">
                <span className="text-[10px] font-mono font-black text-amber-500 uppercase block tracking-widest mb-1">// SECURITY PORTAL RECOVERY //</span>
                <h2 className="text-2xl font-display font-black uppercase text-black dark:text-white leading-tight">Reset Password</h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                  {resetEmail ? `Account Node: ${resetEmail}` : "Verifying action dispatch..."}
                </p>
              </div>

              {resetVerifying ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-dashed border-amber-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-mono uppercase tracking-wider text-stone-500 animate-pulse">Verifying Security Recovery Token...</p>
                </div>
              ) : resetError ? (
                <div className="space-y-6">
                  <div className="p-4 border-2 border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-mono text-xs leading-relaxed">
                    <span className="font-bold uppercase block mb-1">Security Alert:</span>
                    <span>{resetError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('auth');
                      setAuthMode('signin');
                      setIsForgotPassword(false);
                      setResetError(null);
                    }}
                    className="w-full py-3 bg-black hover:bg-stone-800 text-white font-black uppercase text-xs tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center block"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : resetSuccess ? (
                <div className="space-y-6">
                  <div className="p-4 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 font-mono text-xs text-center">
                    <span className="font-bold uppercase block mb-1">🎉 Recovery Completed:</span>
                    <span>Password updated successfully.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('auth');
                      setAuthMode('signin');
                      setIsForgotPassword(false);
                      setResetSuccess(false);
                    }}
                    className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-wider transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center block"
                  >
                    Proceed to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-5 text-left">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white"
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all dark:bg-zinc-950 dark:text-white"
                      placeholder="Repeat new password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resettingPassword}
                    className="w-full py-3 bg-black hover:bg-stone-800 text-white font-black uppercase text-xs tracking-wider transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:bg-stone-400 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center gap-2"
                  >
                    {resettingPassword ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                  
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('auth');
                        setAuthMode('signin');
                        setIsForgotPassword(false);
                      }}
                      className="text-[10px] font-black uppercase text-stone-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      &larr; Cancel Recovery
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

        {/* 2.5. ROLE SELECTION VIEW */}
        {currentView === 'role-selection' && (
          <div className="max-w-md mx-auto px-6 py-12 md:py-24 animate-fade-in">
            <div className={`border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors ${
              isDarkMode ? 'bg-zinc-900 border-zinc-700 text-[#F3F4F6]' : 'bg-white text-black'
            }`}>
              
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-sans font-bold text-[10px] uppercase tracking-wider border-2 border-black mb-3">
                  Account Verified
                </span>
                <h2 className="text-2xl font-display font-black uppercase mt-1">
                  Identify Your Track
                </h2>
                <p className="text-gray-500 dark:text-zinc-400 text-xs mt-2 font-sans">
                  Welcome to DIRPA, <span className="font-bold text-black dark:text-white">{tempGoogleUser?.displayName || tempGoogleUser?.email || 'Scholar'}</span>. Please specify your primary track to initialize your personal advisor roadmap dashboard.
                </p>
              </div>

              {authError && (
                <div className="mb-6 p-4 border-2 border-red-500 bg-red-50 dark:bg-zinc-950 text-red-700 dark:text-red-450 font-mono text-[11px] leading-relaxed relative flex flex-col gap-1">
                  <span className="font-bold underline uppercase">SYSTEM NOTIFICATION:</span>
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* student option */}
                <button
                  type="button"
                  onClick={() => handleFinishRoleSetup('student')}
                  disabled={isFinishingRoleSetup}
                  className="w-full flex items-center justify-between p-4 border-2 border-black dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all duration-75 active:scale-[0.98] text-left cursor-pointer group"
                >
                  <div className="pr-4">
                    <span className="text-base font-black uppercase block group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                      👨‍🎓 Student Explorer
                    </span>
                    <span className="text-gray-500 dark:text-zinc-400 text-[10.5px] mt-1 block leading-relaxed font-sans">
                      Visualize interactive curriculum paths, course criteria, examine degree milestones, and seek expert graduate counseling.
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                </button>

                {/* alumni option */}
                <button
                  type="button"
                  onClick={() => handleFinishRoleSetup('alumni')}
                  disabled={isFinishingRoleSetup}
                  className="w-full flex items-center justify-between p-4 border-2 border-black dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all duration-75 active:scale-[0.98] text-left cursor-pointer group"
                >
                  <div className="pr-4">
                    <span className="text-base font-black uppercase block group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      💼 Alumni Mentor
                    </span>
                    <span className="text-gray-500 dark:text-zinc-400 text-[10.5px] mt-1 block leading-relaxed font-sans">
                      Contribute degree advice, verify qualification criteria, offer career benchmarks, and assist matching pipelines.
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {isFinishingRoleSetup && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-t-emerald-600 border-black rounded-full animate-spin"></div>
                  <span className="text-[9.5px] uppercase font-black tracking-widest font-mono">
                    Provisioning secure cloud collection...
                  </span>
                </div>
              )}

              <div className="mt-8 border-t border-black/10 dark:border-zinc-800 pt-4 text-center">
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-black dark:hover:text-zinc-200 underline font-extrabold cursor-pointer"
                >
                  Cancel & Logout
                </button>
              </div>

            </div>
          </div>
        )}
        
        {/* 2.6. ALUMNI ONBOARDING WIZARD VIEW */}
        {currentView === 'alumni-onboarding' && user && (
          <AlumniOnboardingWizard
            user={user}
            onComplete={handleCompleteAlumniOnboarding}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
          />
        )}

        {/* 3. CORE LOGGED-IN SYSTEM DASHBOARD */}
        {user && currentView === 'dashboard' && !selectedPathway && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`max-w-7xl mx-auto px-6 py-6 md:py-10 ${isComparing || searchMethod !== 'none' ? "w-full space-y-6" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}`}
          >
            
            {/* Left Area - 2 Columns (Main Hub / Interactive Explorer) - Expand to Full Width when comparing or searching */}
            <div className={isComparing || searchMethod !== 'none' ? "w-full space-y-6" : "lg:col-span-2 space-y-8"}>
              
              {/* User Custom Welcomer Card (HOME PAGE ONLY) */}
              {!isComparing && searchMethod === 'none' && (
                <div className="border-2 border-black p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
          
                </div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{t('home.guidanceBadge', 'DIRPA Personal Guidance')}</p>
                <h2 className="text-4xl md:text-5xl font-light font-serif italic not-italic leading-[1.1] mb-2 text-[#1A1A1A]">
                  {t('home.welcome', 'Welcome,')} <span className="font-sans font-black not-italic text-black">{user.name}</span>.
                </h2>
                <p className="text-sm text-gray-500 max-w-xl">
                  {user.role === 'student' 
                    ? t('home.studentWelcomeSubtitle', 'Explore real roadmaps matched to completed academic levels, submit preferences for dynamic AI recommendations, or chat with verified mentors.')
                    : t('home.alumniWelcomeSubtitle', 'Help steer the future of young students by sharing your institutional milestones or writing pathway guidance insights.')
                  }
                </p>

                {/* Instant personalized summary tags */}
                {user.role === 'student' && user.interests.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                    
                                      <button 
                      onClick={() => setAiModalOpen(true)}
                      className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-tight flex items-center ml-2"
                    >
                      <Sparkles className="w-3 h-3 mr-1 animate-pulse" /> {t('home.customize', 'Customize')}
                    </button>
                  </div>
                )}
              </div>
              )}

              {/* Primary Choices Grid or Specific Search Panel (Job Search vs Class Selection) */}
              {!isComparing && searchMethod === 'none' && user.role === 'alumni' && (
                <div className="space-y-6 text-[#1A1A1A]">
                  {/* STATS HEADER / INTRO */}
                  <div className="border-2 border-black p-6 bg-green-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#1A1A1A] dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
                    <span className="text-[10px] font-mono font-black text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/40 px-2 py-0.5 border border-green-200 dark:border-green-850 uppercase tracking-widest">// ALUMNI MENTOR WORKSPACE</span>
                    <h3 className="text-2xl font-display font-black uppercase mt-1">Alumni Contributor Workspace</h3>
                    <p className="text-xs text-stone-605 dark:text-zinc-400 mt-1 leading-relaxed font-semibold">
                      Manage your shared pathway feedback, and research courses to read and contribute your verified career comments.
                    </p>
                  </div>

                  {/* FEATURE 1: MANAGE MY COMMENTS */}
                  <div className="border-2 border-black p-6 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,110,0,0.15)] text-[#1A1A1A] dark:text-zinc-100">
                    <div className="border-b-2 border-dashed border-stone-250 dark:border-zinc-700 pb-3 mb-4">
                      <span className="text-[10px] font-mono font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-850 px-2 py-0.5 uppercase tracking-widest">// CONTRIBUTIONS LOG</span>
                      <h4 className="text-xl font-display font-black uppercase mt-1">Manage My Comments</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-450 mt-0.5">Edit or remove your published student counseling notes and survival advice.</p>
                    </div>

                    {(() => {
                      if (!user) return null;

                      const userFeedbacks = courseReviews.filter(f => 
                        f.userId === user.id || 
                        f.authorEmail === user.email || 
                        (f.name && user.name && f.name.toLowerCase() === user.name.toLowerCase())
                      );

                      const mapped = userFeedbacks.map(f => {
                        const matchedPath = getAllPossiblePathways().find(p => 
                          isCourseIdEquivalent(p.id, f.courseId) || 
                          isCourseIdEquivalent(p.name, f.courseId) ||
                          (f.courseName && isCourseIdEquivalent(p.name, f.courseName))
                        );

                        const levelTag = f.itemType 
                          ? f.itemType.toUpperCase() 
                          : (matchedPath?.level ? matchedPath.level.toUpperCase() : 'COURSE');

                        const itemName = f.courseName || f.itemName || matchedPath?.name || f.courseId || 'Pathway Review';

                        return {
                          id: f.feedbackId || f.id,
                          pathwayId: f.courseId || matchedPath?.id || 'general',
                          pathwayName: itemName,
                          pathwayLevel: levelTag,
                          itemType: f.itemType || 'course',
                          name: f.name || user.name,
                          rating: Number(f.overallRating || f.rating || 5),
                          experience: f.feedbackText || f.experience || '',
                          advice: f.advice || '',
                          userId: f.userId,
                          authorEmail: f.authorEmail,
                          createdAt: f.createdAt,
                          updatedAt: f.updatedAt
                        };
                      });

                      const seenIds = new Set<string>();
                      const seenItemKeys = new Set<string>();
                      const mentorComments: typeof mapped = [];

                      for (const item of mapped) {
                        const idKey = item.id;
                        const itemKey = `${item.itemType}_${item.pathwayName.toLowerCase().trim()}_${(item.userId || item.authorEmail || '').toLowerCase()}`;

                        if (!seenIds.has(idKey) && !seenItemKeys.has(itemKey)) {
                          seenIds.add(idKey);
                          seenItemKeys.add(itemKey);
                          mentorComments.push(item);
                        }
                      }

                      if (mentorComments.length === 0) {
                        return (
                          <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-950/30 border border-dashed border-black/15 dark:border-zinc-800 rounded">
                            <p className="text-xs font-mono font-black text-gray-400 dark:text-zinc-650">// NO REVIEWS REGISTERED YET</p>
                            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">Select a course, job, or entrance exam below to submit your valuable feedback!</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                          {mentorComments.map((comment, index) => {
                            const isCurrentlyEditing = editingCommentId === comment.id;
                            return (
                              <div key={`${comment.id || ""}_${index}`} className="border-2 border-black dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-950/50 p-4 relative space-y-3">
                                <div className="flex justify-between items-start gap-3">
                                  <div>
                                    <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-black/15 dark:border-zinc-700 px-1.5 py-0.5 uppercase">
                                      [{comment.pathwayLevel}] {comment.pathwayName}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs font-bold font-sans text-black dark:text-zinc-200">{comment.name}</span>
                                      <span className="text-[9px] text-amber-600 dark:text-yellow-500 font-bold">
                                        {"★".repeat(comment.rating || 5)}{"☆".repeat(5-(comment.rating || 5))}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    {!isCurrentlyEditing ? (
                                      <>
                                        <button 
                                          onClick={() => {
                                            setEditingCommentId(comment.id);
                                            setEditCommentText(comment.experience);
                                            setEditAdviceText(comment.advice || '');
                                            setEditRating(comment.rating || 5);
                                          }}
                                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-yellow-350 hover:bg-yellow-450 text-black border border-black transition-all cursor-pointer"
                                        >
                                          Modify / Edit
                                        </button>
                                        
                                        {commentIdBeingDeleted === comment.id ? (
                                          <div className="flex items-center gap-1">
                                            <button 
                                              onClick={() => {
                                                handleDeleteComment(comment.pathwayId, comment.id);
                                                setCommentIdBeingDeleted(null);
                                              }}
                                              className="px-2 py-1 text-[9px] font-mono font-black uppercase bg-red-600 text-white border border-black hover:bg-red-700 cursor-pointer"
                                            >
                                              Confirm
                                            </button>
                                            <button 
                                              onClick={() => setCommentIdBeingDeleted(null)}
                                              className="px-2 py-1 text-[9px] font-mono font-black uppercase bg-stone-200 text-black border border-black hover:bg-stone-300 cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        ) : (
                                          <button 
                                            onClick={() => setCommentIdBeingDeleted(comment.id)}
                                            className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-red-105 hover:bg-neutral-850 hover:text-red-500 text-red-800 border border-black transition-all cursor-pointer"
                                          >
                                            Delete
                                          </button>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-[9px] font-mono font-bold bg-yellow-101 border border-black px-1.5 py-0.5 text-black">Editing Mode</span>
                                    )}
                                  </div>
                                </div>

                                {isCurrentlyEditing ? (
                                  <div className="space-y-3 p-3 bg-white dark:bg-zinc-900 border border-black dark:border-zinc-700">
                                    <div>
                                      <label className="block text-[8px] font-black uppercase text-gray-500 mb-1">Modify Comment Experience *</label>
                                      <textarea 
                                        value={editCommentText}
                                        onChange={(e) => setEditCommentText(e.target.value)}
                                        rows={3}
                                        className="w-full border-2 border-black dark:border-zinc-750 p-2 text-xs font-medium focus:outline-none bg-stone-50 dark:bg-zinc-800 text-black dark:text-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[8px] font-black uppercase text-gray-500 mb-1">Modify Advice Quote</label>
                                      <textarea 
                                        value={editAdviceText}
                                        onChange={(e) => setEditAdviceText(e.target.value)}
                                        rows={2}
                                        className="w-full border-2 border-black dark:border-zinc-750 p-2 text-xs font-medium focus:outline-none bg-stone-50 dark:bg-zinc-800 text-black dark:text-white"
                                      />
                                    </div>
                                    <div className="flex justify-between items-center gap-4">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-bold">Rating:</span>
                                        <select 
                                          value={editRating}
                                          onChange={(e) => setEditRating(Number(e.target.value))}
                                          className="border border-black px-1.5 py-0.5 text-xs font-bold bg-white text-black dark:bg-zinc-800 dark:text-white"
                                        >
                                          <option value="5">⭐⭐⭐⭐⭐</option>
                                          <option value="4">⭐⭐⭐⭐</option>
                                          <option value="3">⭐⭐⭐</option>
                                          <option value="2">⭐⭐</option>
                                          <option value="1">⭐</option>
                                        </select>
                                      </div>
                                      <div className="flex gap-2">
                                        <button 
                                          type="button"
                                          onClick={() => setEditingCommentId(null)}
                                          className="px-2 py-1 text-[10px] font-bold text-gray-500 dark:text-zinc-400 bg-gray-150 dark:bg-zinc-850 border border-black dark:border-zinc-750 uppercase"
                                        >
                                          Cancel
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => handleUpdateComment(comment.pathwayId, comment.id)}
                                          className="px-3 py-1 text-[10px] font-bold text-white bg-blue-600 border border-black uppercase"
                                        >
                                          Save Changes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <p className="text-xs leading-relaxed text-stone-750 dark:text-zinc-300 font-semibold italic border-l-2 border-blue-500 dark:border-blue-450 pl-2">
                                      "{comment.experience}"
                                    </p>
                                    {comment.advice && (
                                      <p className="text-[11px] text-stone-605 dark:text-zinc-400">
                                        <strong className="text-[9px] uppercase tracking-wider font-mono text-gray-400 dark:text-zinc-550 block mb-0.5">// Advice to Juniors:</strong>
                                        "{comment.advice}"
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* FEATURE 2: GIVE YOUR VALUABLE FEEDBACK */}
                  <div className="border-2 border-black p-6 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,110,0,0.15)] text-[#1A1A1A] dark:text-zinc-100 text-left space-y-6">
                    {/* Header */}
                    <div className="border-b-2 border-dashed border-stone-250 dark:border-zinc-700 pb-3">
                      <span className="text-[10px] font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-850 px-2 py-0.5 uppercase tracking-widest">// ALUMNI MENTORSHIP FORUM</span>
                      <h4 className="text-xl font-display font-black uppercase mt-1">Give your valuable Feedback</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Share authentic advice, workload reality checks, and tips for courses, jobs, or entrance exams to help students succeed.</p>
                    </div>

                    {/* Step 1: Category Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-display font-black uppercase text-stone-900 dark:text-white">
                        What would you like to review?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackCategory('course');
                            setFeedbackSearchQuery('');
                            setSelectedFeedbackItem(null);
                          }}
                          className={`p-4 border-2 border-black text-left cursor-pointer transition-all ${
                            feedbackCategory === 'course'
                              ? 'bg-amber-300 dark:bg-amber-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold'
                              : 'bg-white dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 hover:bg-amber-50 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <div className="text-xl mb-1">📚</div>
                          <div className="text-xs font-black uppercase">Course</div>
                          <div className="text-[9px] opacity-80 font-mono mt-0.5">Degrees, Diplomas & Streams</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackCategory('job');
                            setFeedbackSearchQuery('');
                            setSelectedFeedbackItem(null);
                          }}
                          className={`p-4 border-2 border-black text-left cursor-pointer transition-all ${
                            feedbackCategory === 'job'
                              ? 'bg-sky-300 dark:bg-sky-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold'
                              : 'bg-white dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 hover:bg-sky-50 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <div className="text-xl mb-1">💼</div>
                          <div className="text-xs font-black uppercase">Job</div>
                          <div className="text-[9px] opacity-80 font-mono mt-0.5">Career Roles & Professions</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackCategory('entrance-exam');
                            setFeedbackSearchQuery('');
                            setSelectedFeedbackItem(null);
                          }}
                          className={`p-4 border-2 border-black text-left cursor-pointer transition-all ${
                            feedbackCategory === 'entrance-exam'
                              ? 'bg-purple-300 dark:bg-purple-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold'
                              : 'bg-white dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 hover:bg-purple-50 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <div className="text-xl mb-1">📝</div>
                          <div className="text-xs font-black uppercase">Entrance Exam</div>
                          <div className="text-[9px] opacity-80 font-mono mt-0.5">JEE, NEET, EAMCET, CAT...</div>
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Dynamic Search */}
                    <div className="space-y-3 pt-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-display font-black uppercase text-stone-900 dark:text-white">
                          Search & Select {feedbackCategory === 'course' ? 'Course' : feedbackCategory === 'job' ? 'Job' : 'Entrance Exam'}
                        </label>
                        {selectedFeedbackItem && (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 px-2 py-0.5 uppercase">
                            ✓ {selectedFeedbackItem.name}
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          value={feedbackSearchQuery}
                          onChange={(e) => setFeedbackSearchQuery(e.target.value)}
                          placeholder={
                            feedbackCategory === 'course'
                              ? "Type course name (e.g., Computer Science, B.Tech, MPC, Mechanical)..."
                              : feedbackCategory === 'job'
                              ? "Type job role (e.g., Software Engineer, Data Scientist, Doctor, CA)..."
                              : "Type entrance exam name (e.g., JEE Main, NEET UG, TS EAMCET, POLYCET)..."
                          }
                          className="w-full border-2 border-black p-3 text-xs bg-[#FAF9F5] dark:bg-zinc-800 text-black dark:text-white font-mono font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-900 pr-10"
                        />
                        <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3.5" />
                      </div>

                      {/* Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                        {getCategoryItems(feedbackCategory, feedbackSearchQuery).map((item) => {
                          const isSelected = selectedFeedbackItem?.id === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedFeedbackItem(item);
                                const existing = courseReviews.find(
                                  (f) =>
                                    (f.userId === user?.id || f.authorEmail === user?.email) &&
                                    (isCourseIdEquivalent(f.courseId, item.id) ||
                                      isCourseIdEquivalent(f.courseId, item.name) ||
                                      (f.courseName && f.courseName.toLowerCase() === item.name.toLowerCase()))
                                );
                                if (existing) {
                                  setFeedbackText(existing.feedbackText || existing.experience || '');
                                  setFeedbackAdvice(existing.advice || '');
                                  setFeedbackRating(Number(existing.overallRating || existing.rating || 5));
                                  setFeedbackInstitution(existing.institutionName || existing.company || '');
                                  setFeedbackYear(existing.completionYear || '2024');
                                } else {
                                  setFeedbackText('');
                                  setFeedbackAdvice('');
                                  setFeedbackRating(5);
                                  setFeedbackInstitution('');
                                  setFeedbackYear('2024');
                                }
                              }}
                              className={`border p-2.5 text-xs flex justify-between items-center cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-2 border-black bg-amber-200 dark:bg-zinc-700 font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                  : 'border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-850 text-stone-900 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <span className="text-[8px] font-mono uppercase bg-neutral-200 dark:bg-zinc-700 text-neutral-800 dark:text-zinc-200 px-1 py-0.5 mr-1.5 rounded text-[7px] font-bold">
                                  {item.level || feedbackCategory.toUpperCase()}
                                </span>
                                <span className="font-semibold">{item.name}</span>
                              </div>
                              {isSelected ? (
                                <span className="text-[10px] text-amber-900 dark:text-amber-300 font-black shrink-0">SELECTED</span>
                              ) : (
                                <span className="text-[10px] text-stone-400 font-mono shrink-0">+ Select</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 3: Feedback Form */}
                    {selectedFeedbackItem && (
                      <div className="border-2 border-black p-5 bg-amber-50/70 dark:bg-zinc-950/80 space-y-4 pt-4 text-left animate-fadeIn">
                        <div className="flex flex-wrap justify-between items-start border-b border-stone-300 dark:border-zinc-700 pb-3 gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono font-black text-amber-800 dark:text-amber-300 bg-amber-200 dark:bg-amber-950 border border-amber-400 px-2 py-0.5 uppercase">
                                [{feedbackCategory.toUpperCase()}] REVIEW FORM
                              </span>
                              {courseReviews.some(f => (f.userId === user?.id || f.authorEmail === user?.email) && (isCourseIdEquivalent(f.courseId, selectedFeedbackItem.id) || isCourseIdEquivalent(f.courseId, selectedFeedbackItem.name))) && (
                                <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 uppercase">
                                  ✎ Updating Previous Feedback
                                </span>
                              )}
                            </div>
                            <h5 className="text-base font-display font-black uppercase text-stone-900 dark:text-white mt-1">
                              Target: {selectedFeedbackItem.name}
                            </h5>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedFeedbackItem(null)}
                            className="text-xs font-mono font-bold text-stone-500 hover:text-black dark:hover:text-white uppercase"
                          >
                            Close Form
                          </button>
                        </div>

                        {/* Overall Rating */}
                        <div>
                          <label className="block text-[10px] font-mono font-black uppercase text-stone-700 dark:text-zinc-300 mb-1">
                            Overall Rating *
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFeedbackRating(star)}
                                className={`px-3 py-1.5 border-2 border-black text-xs font-black transition-all cursor-pointer ${
                                  feedbackRating >= star ? 'bg-amber-400 text-black' : 'bg-white dark:bg-zinc-800 text-stone-400'
                                }`}
                              >
                                ★ {star}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Feedback / Review Text */}
                        <div>
                          <label className="block text-[10px] font-mono font-black uppercase text-stone-700 dark:text-zinc-300 mb-1">
                            Your Honest Feedback / Review / Experience *
                          </label>
                          <textarea
                            rows={3}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={`Share authentic insights about ${selectedFeedbackItem.name} — workload, difficulty, real job applicability, preparation advice...`}
                            className="w-full border-2 border-black p-3 text-xs font-medium focus:outline-none bg-white dark:bg-zinc-800 text-black dark:text-white"
                          />
                        </div>

                        {/* Advice to Juniors */}
                        <div>
                          <label className="block text-[10px] font-mono font-black uppercase text-stone-700 dark:text-zinc-300 mb-1">
                            Key Advice or Survival Tip for Students
                          </label>
                          <textarea
                            rows={2}
                            value={feedbackAdvice}
                            onChange={(e) => setFeedbackAdvice(e.target.value)}
                            placeholder="e.g., Master coding fundamentals in year 1; solve 10 years past papers for entrance exams..."
                            className="w-full border-2 border-black p-3 text-xs font-medium focus:outline-none bg-white dark:bg-zinc-800 text-black dark:text-white"
                          />
                        </div>

                        {/* Optional Institution & Year */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono font-black uppercase text-stone-700 dark:text-zinc-300 mb-1">
                              Institution / Company Name (Optional)
                            </label>
                            <input
                              type="text"
                              value={feedbackInstitution}
                              onChange={(e) => setFeedbackInstitution(e.target.value)}
                              placeholder="e.g., IIT Hyderabad / Google / Osmania Univ"
                              className="w-full border-2 border-black p-2.5 text-xs font-medium bg-white dark:bg-zinc-800 text-black dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono font-black uppercase text-stone-700 dark:text-zinc-300 mb-1">
                              Graduation / Completion Year
                            </label>
                            <select
                              value={feedbackYear}
                              onChange={(e) => setFeedbackYear(e.target.value)}
                              className="w-full border-2 border-black p-2.5 text-xs font-bold bg-[#FAF9F5] dark:bg-zinc-800 text-black dark:text-white"
                            >
                              {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'].map(yr => (
                                <option key={yr} value={yr}>{yr}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Success Banner */}
                        {feedbackSubmitSuccess && (
                          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-600 text-emerald-900 dark:text-emerald-200 text-xs font-mono font-bold flex items-center gap-2">
                            <span>⚡ Success! Your valuable feedback has been saved to the database and is now live in the Student Explorer!</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedFeedbackItem(null)}
                            className="px-4 py-2 border-2 border-black text-xs font-mono font-bold uppercase bg-stone-200 text-stone-800 hover:bg-stone-300 cursor-pointer"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            disabled={isSubmittingFeedback}
                            onClick={handleSaveValuableFeedback}
                            className="px-6 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-mono font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2"
                          >
                            {isSubmittingFeedback ? (
                              <span>SUBMITTING...</span>
                            ) : (
                              <span>SUBMIT FEEDBACK →</span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {user.role !== 'alumni' && (
                <>
                  {!isComparing && (
                    <div className="space-y-6">
                  {/* SEARCH OPTIONS HOME SCREEN */}
                  {searchMethod === 'none' && (
                    <div className="space-y-6">
                      <div className="border-2 border-black p-6 bg-slate-50/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                        <div className="mb-4">
                          <span className="text-[10px] font-mono font-black text-blue-700 bg-blue-100 px-2 py-0.5 border border-blue-200 uppercase tracking-widest">{t('home.strategyTag', '// NAVIGATION STRATEGY SELECTION')}</span>
                          <h3 className="text-2xl font-display font-black uppercase mt-1">{t('home.exploreHeader', 'Explore Career Pathways Your Way')}</h3>
                          <p className="text-xs text-stone-500 mt-1">{t('home.exploreSubtitle', 'Choose how you want to discover educational routes and custom timelines.')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Option A: Search by Job Name */}
                          <div 
                            onClick={() => { setSearchMethod('job'); setJobQuery(''); }}
                            className="border-2 border-black p-6 bg-white hover:bg-slate-50 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                            id="explore-by-job"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-2 font-bold">
                                <span className="text-[10px] font-mono font-black tracking-widest text-[#CB5A07] bg-amber-50 border border-amber-200 px-2 py-0.5">01</span>
                                <span className="text-3xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">🔍</span>
                              </div>
                              <h4 className="text-xl font-display font-black uppercase text-stone-900 mt-2">{t('home.searchByJobTitle', 'Search by Job Name?')}</h4>
                              <p className="text-xs text-stone-600 mt-2 leading-relaxed font-semibold">
                                {t('home.searchByJobDesc', 'Type in your dream role, e.g., Software Engineer, Doctor, or Chartered Accountant to map backwards and find the qualifying courses and progression flowcharts.')}
                              </p>
                            </div>
                            
                            <div className="mt-6 text-[10px] font-black uppercase text-blue-600 flex items-center justify-between group-hover:translate-x-1 transition-transform border-t border-dashed border-stone-150 pt-3">
                              <span>{t('home.searchByJobBtn', 'Search Jobs & View Plans ➔')}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          {/* Option B: Search by Class */}
                          <div 
                            onClick={() => { setSearchMethod('class'); }}
                            className="border-2 border-black p-6 bg-white hover:bg-slate-50 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                            id="explore-by-class"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono font-black tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5">02</span>
                                <span className="text-3xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">🎓</span>
                              </div>
                              <h4 className="text-xl font-display font-black uppercase text-stone-900 mt-2">{t('home.searchByClassTitle', 'Search by Class?')}</h4>
                              <p className="text-xs text-stone-600 mt-2 leading-relaxed font-semibold">
                                {t('home.searchByClassDesc', 'Select pathways based on classes. Simply pick whether you completed Class 10th or Class 12th to explore educational maps.')}
                              </p>
                            </div>

                            <div className="mt-6 text-[10px] font-black uppercase text-emerald-600 flex items-center justify-between group-hover:translate-x-1 transition-transform border-t border-dashed border-stone-150 pt-3">
                              <span>{t('home.searchByClassBtn', 'Choose Grade Standard ➔')}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OPTION B SUB-SCREEN: CHOOSE CLASS (10th vs 12th) */}
                  {searchMethod === 'class' && (
                    <div className="border-2 border-black p-6 bg-amber-50/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-dashed border-stone-200">
                        <button 
                          onClick={() => { setSearchMethod('none'); setActiveLevel(null); setSelectedPathway(null); }}
                          className="px-3.5 py-2 border-2 border-black text-xs font-black uppercase bg-white hover:bg-stone-50 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1 cursor-pointer"
                        >
                          {t('home.backToSearchOptions', '← Back to Search Options')}
                        </button>
                        
                      </div>

                      <div>
                        <h3 className="text-2xl font-display font-black uppercase">{t('home.classSelectionTitle', 'Which class have you completed?')}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">{t('home.classSelectionSubtitle', 'Submit your academic standard to render the corresponding roadmap diagram.')}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* 10th Choice node trigger */}
                        <div 
                          onClick={() => { setActiveLevel('10th'); setSelectedPathway(null); setShowPost10thChoice(true); }}
                          className={`border-2 border-black p-6 bg-white transition-all cursor-pointer relative group shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none ${activeLevel === '10th' ? 'bg-amber-100 border-dashed ring-2 ring-black shadow-none translate-x-0.5 translate-y-0.5' : 'hover:bg-slate-50'}`}
                        >
                          <span className="absolute top-4 right-4 text-3xl opacity-15 font-serif italic font-bold">01</span>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600">{t('home.schoolLevel', 'School Level standard')}</p>
                          <h3 className="text-xl font-display font-black mt-1 uppercase">{t('home.completed10thTitle', 'Completed 10th')}</h3>
                          <p className="text-xs text-gray-500 mt-2 font-semibold">{t('home.completed10thDesc', 'Explore Intermediate groups Science (MPC/BiPC), Commerce (MEC/CEC), Polytechnique, and ITI Trades.')}</p>
                          <div className="mt-4 text-[10px] font-black uppercase text-blue-600 flex items-center justify-between group-hover:translate-x-1 transition-transform border-t border-stone-100 pt-3">
                            <span>{activeLevel === '10th' ? t('home.mapActive', '● Map Active') : t('home.viewNodeMap', 'View Courses')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* 12th Choice node trigger */}
                        <div 
                          onClick={() => { setActiveLevel('12th'); setSelectedPathway(null); setSelected12thType(null); setSelected12thStream(null); }}
                          className={`border-2 border-black p-6 bg-white transition-all cursor-pointer relative group shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none ${activeLevel === '12th' ? 'bg-indigo-50 border-dashed ring-2 ring-black shadow-none translate-x-0.5 translate-y-0.5' : 'hover:bg-slate-50'}`}
                        >
                          <span className="absolute top-4 right-4 text-3xl opacity-15 font-serif italic font-bold">02</span>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-600">{t('home.collegeLevel', 'College Level standard')}</p>
                          <h3 className="text-xl font-display font-black mt-1 uppercase">{t('home.completed12thTitle', 'Completed 12th')}</h3>
                          <p className="text-xs text-gray-500 mt-2 font-semibold">{t('home.completed12thDesc', 'Explore Engineering CSE/Mech/ECE, Medical MBBS/Dentistry, business BBA, CA auditing compliance, and law.')}</p>
                          <div className="mt-4 text-[10px] font-black uppercase text-blue-600 flex items-center justify-between group-hover:translate-x-1 transition-transform border-t border-stone-100 pt-3">
                            <span>{activeLevel === '12th' ? t('home.mapActive', '● Map Active') : t('home.viewNodeMap', 'View Courses')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* OPTION A SUB-SCREEN: 100% REVERSE-SEARCH BY JOB NAME (WITH BACK BUTTON AND INPUT) */}
                  {searchMethod === 'job' && (
                    <div className="border-2 border-black p-6 md:p-8 bg-sky-50/10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <button 
                          onClick={() => { setSearchMethod('none'); setJobQuery(''); }}
                          className="px-3.5 py-2 border-2 border-black text-xs font-black uppercase bg-white hover:bg-stone-50 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1 cursor-pointer"
                        >
                          {t('home.backToSearchOptions', '← Back to Search Options')}
                        </button>
                        
                      </div>

                      <div>
                        <h3 className="text-3xl font-display font-black uppercase text-stone-900">{t('home.reverseSearchTitle', '🔍 Career Pathway Reverse-Search')}</h3>
                        <p className="text-xs text-stone-500 mt-1">{t('home.reverseSearchSubtitle', 'Search for a job role or skill, and trace backwards to view its matching educational standard pathways and interactive progression flowchart.')}</p>
                      </div>

                      {/* Search Input and Badges */}
                      <div className="space-y-3 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <label className="text-[10px] font-mono font-black uppercase text-gray-500 tracking-wider block">// Target Profession Input Label</label>
                        <div className="relative">
                          <input 
                            type="text"
                            value={jobQuery}
                            onChange={(e) => setJobQuery(e.target.value)}
                            placeholder={t('home.searchPlaceholder', "Type any career or job role (e.g., Software, Doctor, Architect, Accountant, Pilot, CA, Nurse, Advocate)...")}
                            className="w-full border-2 border-black p-3.5 pl-4 pr-32 text-sm font-bold placeholder-stone-450 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-zinc-50 text-black text-left"
                            id="job-search-input"
                          />
                          <div className="absolute right-3 top-2.5 flex items-center gap-2">
                            {isCalculatingJobs && (
                              <div className="flex items-center gap-1 text-[10px] font-mono font-black text-blue-700 bg-blue-50 border border-blue-450 px-2 py-0.5 rounded">
                                <RefreshCw className="w-3 h-3 animate-spin text-blue-700" />
                                <span className="hidden sm:inline">ANALYZE..</span>
                              </div>
                            )}
                            {jobQuery && (
                              <button 
                                onClick={() => setJobQuery('')}
                                className="text-xs text-stone-755 font-bold hover:bg-stone-200 cursor-pointer bg-stone-100 border border-black px-2 py-0.5 transition-colors"
                              >
                                {t('home.clear', 'Clear')}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Popular Role Recommendations */}
                        <div className="pt-1">
                          <span className="text-[9px] font-mono font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">{t('home.popularSearches', '// Popular searches (Click to fill):')}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {["Software Engineer", "Doctor", "Chartered Accountant", "Lieutenant (Army)", "Architect", "Nurse", "Advocate", "Data Scientist", "Pilot"].map(s => (
                              <button 
                                key={s}
                                onClick={() => setJobQuery(s)}
                                className="text-[10px] font-mono font-bold bg-stone-100 hover:bg-yellow-200 text-stone-800 border border-black px-2.5 py-0.5 rounded transition-all hover:scale-105 cursor-pointer"
                              >
                                💼 {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Results list */}
                      <div className="space-y-4">
                        {isCalculatingJobs ? (
                          <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-zinc-800 border-2 border-black p-3.5 rounded flex items-center justify-between animate-pulse">
                              <span className="font-display font-black text-xs uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
                                {t('home.calculatingMatrix', 'DIRPA Calculating Pathway Matrix...')}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300">// RE-INDEXING NODES</span>
                            </div>
                            <PathwayCardSkeletonGrid count={2} />
                          </div>
                        ) : getEligibleRoutesForJob(jobQuery).length === 0 ? (
                          <div className="border-2 border-dashed border-stone-305 bg-white p-12 text-center text-stone-500">
                            <p className="text-sm font-black uppercase tracking-wider text-stone-750">
                              {jobQuery ? t('home.noPathwaysFound', 'No matching career pathways found.') : t('home.waitingInput', 'Waiting for Career Input')}
                            </p>
                            <p className="text-xs text-stone-400 mt-1">
                              {jobQuery 
                                ? "Try typing parts of the title like 'Software', 'Engineer', 'MBBS', 'Doctor', 'CA', 'Finance', 'Law', 'Nurse', 'Navy', or click a button above." 
                                : "Enter your dream job name above to trace back matching educational pathways instantly."}
                            </p>
                          </div>
                        ) : selectedFlowNode ? (
                          /* 100% FULL LAYOUT FOR CLICKED NODE CURRICULUM */
                          <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left space-y-6 animate-fade-in animate-once">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-dashed border-stone-200 pb-4">
                              <button 
                                onClick={() => setSelectedFlowNode(null)}
                                className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                              >
                                ← Back to Flowchart & Eligible Routes
                              </button>
                              <span className="text-[10px] font-mono font-black text-[#5B21B6] bg-purple-100 border border-purple-200 px-3 py-1 rounded">
                                // Node Focus Details: {selectedFlowNode.type.toUpperCase()}
                              </span>
                            </div>

                            {selectedFlowNode.type === 'intermediate' ? (() => {
                              const p = getPathwayById(selectedFlowNode.id);
                              if (!p) return <p className="text-xs text-red-500 font-mono">Failed to resolve intermediate details.</p>;
                              return (
                                <div className="space-y-6">
                                  {/* Intermediate Card */}
                                  <div className="bg-amber-50/50 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                      <div>
                                        <span className="text-[9px] font-mono uppercase font-black tracking-widest text-amber-700 block mb-1">
                                          // UPPER INTERMEDIATE STANDARD STREAM
                                        </span>
                                        <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-amber-950">
                                          🏫 {p.name}
                                        </h2>
                                        <p className="text-xs text-stone-600 mt-2 font-medium leading-relaxed max-w-3xl">
                                          {p.description}
                                        </p>
                                      </div>
                                      <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-auto">
                                        <span className="bg-[#8B5CF6] text-white text-[10px] font-mono font-black border border-black px-2.5 py-1.5 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                                          🕒 {p.duration} Bridge Program
                                        </span>
                                        <span className="bg-emerald-100 text-emerald-905 text-[10px] font-mono font-black border border-emerald-350 px-2.5 py-1.5 text-center uppercase">
                                          Est Fees: {p.estimatedFees.split(" per")[0]}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Subjects Group */}
                                    <div className="border-t border-dashed border-stone-300 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                        <h4 className="text-xs font-mono font-black uppercase text-stone-500 tracking-wider">
                                          📚 INCLUDED CORE CURRICULUM SUBJECTS:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {p.subjects.map((sub, sIdx) => (
                                            <span key={sub} className="text-xs font-mono font-bold uppercase tracking-wide bg-stone-100 border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                              📄 {sub}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <h4 className="text-xs font-mono font-black uppercase text-stone-500 tracking-wider">
                                          🚀 NEXT TARGET HIGHER EDUCATION PROGRAMS:
                                        </h4>
                                        <ul className="space-y-1.5 text-xs font-semibold text-stone-850">
                                          {p.futureOpportunities.slice(0, 5).map((opt, oIdx) => (
                                            <li key={oIdx} className="flex items-center gap-2">
                                              <span className="text-blue-600 font-black">➔</span> {opt}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Alumni Feedback advisors block */}
                                  <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                                    <h3 className="text-lg font-display font-black uppercase text-black flex items-center gap-2 border-b-2 border-dashed border-stone-200 pb-2">
                                      <MessageSquare className="w-5 h-5 text-indigo-600" /> 👥 Academic Board Advisory Board Insights
                                    </h3>
                                    <p className="text-xs text-neutral-500 font-mono italic">// Members advice about textbook frameworks, labs, and preparation milestones:</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {p.alumniInsights?.map((f, fIdx) => (
                                        <div key={fIdx} className="bg-stone-50 border-2 border-black p-4 text-xs font-semibold space-y-3 flex flex-col justify-between">
                                          <div className="space-y-2">
                                            <div className="flex justify-between items-start gap-2">
                                              <div>
                                                <span className="font-mono font-black text-sm text-black block">{f.name}</span>
                                                <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block mt-0.5">{f.role}</span>
                                              </div>
                                              <span className="bg-yellow-105 text-yellow-950 border border-yellow-250 font-mono text-[9px] font-black px-1.5 py-0.5 shrink-0">
                                                ★ Advice Rating: {f.rating || 5.0}/5.0
                                              </span>
                                            </div>
                                            <p className="text-neutral-600 leading-relaxed pt-2 border-t border-dashed border-stone-200 font-semibold italic">
                                              "{f.experience}"
                                            </p>
                                          </div>
                                          
                                          <button 
                                            onClick={() => setSelectedAlumni(f)}
                                            className="w-full py-2 border border-black bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                                          >
                                            💬 Live Chat with advisor {f.name.split(' ')[0]} ➔
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })() : (() => {
                              const degrees_list = [...(ELIGIBILITY_MATRIX.MPC || []), ...(ELIGIBILITY_MATRIX.BiPC || []), ...(ELIGIBILITY_MATRIX.MEC_CEC || []), ...(ELIGIBILITY_MATRIX.POLY || [])];
                              const deg = degrees_list.find(d => d.name === selectedFlowNode.id || d.name === selectedFlowNode.name);
                              if (!deg) return <p className="text-xs text-red-500 font-mono">Failed to resolve graduation degree details.</p>;
                              
                              const specializations = DEGREE_SPECIALIZATION_MAP[deg.name] || getFallbackSpecializations(deg.name);
                              
                              return (
                                <div className="space-y-8">
                                  {/* Degree Core Panel */}
                                  <div className="bg-purple-50/30 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                      <div>
                                        <span className="text-[9px] font-mono uppercase font-black tracking-widest text-purple-700 block mb-1">
                                          // REGULATION GRADUATION COLLEGE DEGREE
                                        </span>
                                        <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-purple-950">
                                          🎓 {deg.name}
                                        </h2>
                                        <p className="text-xs text-stone-600 mt-2 font-medium leading-relaxed max-w-2xl">
                                          {deg.description}
                                        </p>
                                      </div>
                                      <span className="bg-[#8B5CF6] text-white text-[10px] font-mono font-black border border-black px-3 py-1.5 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase shrink-0">
                                        🕒 {deg.duration} Duration
                                      </span>
                                    </div>
                                  </div>

                                  {/* Focus Specialization Branches accordion */}
                                  <div className="space-y-6">
                                    <div>
                                      <h3 className="text-xs font-mono font-black uppercase text-stone-500 tracking-wider">
                                        📋 ACADEMIC SPECIALIZATION BRANCHS IN THIS PATHWAY:
                                      </h3>
                                      <p className="text-xs text-stone-400 font-mono mt-0.5">// Expand any branch to inspect academic syllabi and linked employer career jobs:</p>
                                    </div>

                                    <div className="space-y-4">
                                      {specializations.map((spec, specIdx) => (
                                        <div key={spec.id || specIdx} className="border-2 border-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                          <div className="bg-stone-900 text-white p-4 font-mono uppercase font-black text-xs flex justify-between items-center border-b-2 border-black">
                                            <span>⚡ Branch: {spec.name} ({spec.code})</span>
                                            <span className="bg-yellow-340 text-black px-2 py-0.5 text-[9px] font-bold">Standard {spec.duration}</span>
                                          </div>
                                          <div className="p-5 text-left space-y-4">
                                            <p className="text-xs text-stone-600 font-semibold">{spec.description}</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-dashed border-stone-200">
                                              {/* Subjects */}
                                              <div className="space-y-2">
                                                <strong className="text-[10px] font-mono text-[#8B5CF6] block uppercase tracking-wider">// Specialization Focus Subjects:</strong>
                                                <div className="flex flex-wrap gap-1">
                                                  {spec.keyFocusAreas.map((area, aIdx) => (
                                                    <span key={aIdx} className="text-[10px] font-semibold bg-stone-50 border border-stone-200 px-2 py-1 rounded-sm text-stone-800">
                                                      📄 {area}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>

                                              {/* Student Comments */}
                                              <div className="space-y-2">
                                                <strong className="text-[10px] font-mono text-[#8B5CF6] block uppercase tracking-wider">// Graduate Sylabus Recommendations:</strong>
                                                <div className="space-y-2">
                                                  {spec.feedback.slice(0, 2).map((feed, feedIdx) => {
                                                    const alumniObj = resolveAlumniFromFeedback(feed);
                                                    return (
                                                      <div 
                                                        key={feedIdx} 
                                                        onClick={() => setSelectedAlumni(alumniObj)}
                                                        className="bg-stone-50 hover:bg-stone-100 p-2.5 border border-stone-200/60 rounded text-[11px] leading-tight font-semibold italic cursor-pointer group"
                                                      >
                                                        <p className="text-stone-700">"{feed.comment}"</p>
                                                        <div className="flex justify-between items-center border-t border-dashed border-stone-205 mt-2 pt-1 font-mono text-[9px] not-italic text-[#7C3AED]">
                                                          <span>💬 {feed.user} ({feed.role})</span>
                                                          <span className="group-hover:underline uppercase font-bold text-blue-600">Chat Advisor ➔</span>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Linked Jobs */}
                                            <div className="pt-4 border-t-2 border-black grid grid-cols-1 gap-4">
                                              <strong className="text-[10.5px] font-mono text-emerald-800 block uppercase tracking-wider">// Linked Employment Jobs You Can Apply For:</strong>
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {spec.jobs.map(specJob => (
                                                  <div 
                                                    key={specJob.id}
                                                    onClick={() => setSelectedJobDetail(specJob)}
                                                    className="cursor-pointer bg-white hover:bg-stone-50 border-2 border-black p-4 text-left shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex flex-col justify-between"
                                                  >
                                                    <div className="space-y-1">
                                                      <h6 className="font-display font-black text-sm uppercase text-gray-950 flex items-center gap-1.5 leading-none mb-1">
                                                        💼 {specJob.title}
                                                      </h6>
                                                      <p className="text-[10.5px] text-gray-500 font-mono">Starting Pay: {specJob.entryLevelSalary.split(" per")[0]}</p>
                                                      <p className="text-xs text-gray-600 font-semibold line-clamp-2 leading-tight pt-1">
                                                        {specJob.description}
                                                      </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 pt-2.5 mt-2 border-t border-dashed border-stone-200">
                                                      {specJob.skillsRequired.slice(0, 3).map((sk, sIdx) => (
                                                        <span key={sIdx} className="text-[9px] font-mono font-bold bg-neutral-100 border border-gray-200 px-1.5 py-0.5 text-stone-750">
                                                          🛠 {sk}
                                                        </span>
                                                      ))}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (() => {
                          const routesForJob = getEligibleRoutesForJob(jobQuery);
                          const uniqueStreams = Array.from(new Set(routesForJob.map(r => r.streamKey))).map(key => {
                            const match = routesForJob.find(r => r.streamKey === key);
                            return {
                              key,
                              id: match?.streamId || '',
                              name: match?.streamName || '',
                              duration: match?.streamDuration || '2 Years',
                              desc: match?.streamDescription || ''
                            };
                          });

                          const uniqueDegrees = Array.from(new Set(routesForJob.map(r => r.degreeName))).map(name => {
                            const match = routesForJob.find(r => r.degreeName === name);
                            return {
                              name,
                              duration: match?.degreeDuration || '3-4 Years',
                              desc: match?.degreeDescription || '',
                              streamKey: match?.streamKey,
                              careersList: match?.careersList || []
                            };
                          });

                          const firstRoute = routesForJob[0];
                          const fallbackSpecializations = firstRoute ? (DEGREE_SPECIALIZATION_MAP[firstRoute.degreeName] || getFallbackSpecializations(firstRoute.degreeName)) : [];
                          const firstSpecialization = fallbackSpecializations[0];
                          const representativeJob = firstSpecialization?.jobs[0];

                          const containerVariants = {
                            hidden: { opacity: 0 },
                            show: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.12,
                                delayChildren: 0.05
                              }
                            }
                          };

                          const itemVariants = {
                            hidden: { opacity: 0, y: 15 },
                            show: { 
                              opacity: 1, 
                              y: 0, 
                              transition: { 
                                type: "spring" as const, 
                                stiffness: 90, 
                                damping: 14 
                              } 
                            }
                          };

                          return (
                            <motion.div 
                              variants={containerVariants}
                              initial="hidden"
                              animate="show"
                              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4"
                            >
                              {/* Left Column: Flowchart representing ALL eligible routes side-by-side (Col-span-7) */}
                              <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
                                <div ref={careerFlowchartRef} className="border-2 border-black bg-stone-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left space-y-6 relative overflow-hidden">
                                  
                                  <div className="border-b border-black/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                      <span className="text-[10px] font-mono font-black text-blue-700 uppercase block mb-1">
                                        // DYNAMIC PATHWAY CONNECTOR CANVAS
                                      </span>
                                      <h4 className="text-xl font-display font-black uppercase text-black">
                                        🗺️ Educational Route Flowchart
                                      </h4>
                                      <p className="text-xs text-stone-500 mt-1">
                                        Follow the arrows to trace all combinations. Click on any box to view its full 100% course curriculum and advisory boards!
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => exportAcademicRoadmapPDF(careerFlowchartRef.current, `Route-${jobQuery || 'Flowchart'}`)}
                                      disabled={isExportingPDF}
                                      data-html2canvas-ignore="true"
                                      className="px-3.5 py-2 border-2 border-black text-[10px] font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-red-50 hover:text-red-700 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60 cursor-pointer flex items-center gap-1.5 bg-white shrink-0 rounded"
                                      title="Export Flowchart as High-Resolution PDF"
                                    >
                                      {isExportingPDF ? (
                                        <>
                                          <div className="w-3 h-3 border-2 border-t-red-600 border-transparent rounded-full animate-spin"></div>
                                          <span>Exporting...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Download className="w-3.5 h-3.5 text-red-600" />
                                          <span>Export PDF</span>
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  <div className="space-y-8 flex flex-col items-center">
                                    
                                    {/* Stage 1: SSC Completed */}
                                    <div className="relative flex flex-col items-center w-full max-w-sm">
                                      <div className="w-full bg-amber-100 border-2 border-black p-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-103 transition-transform">
                                        <span className="text-xs font-mono font-black text-amber-850 bg-amber-200/50 px-2 py-0.5 border border-amber-300 block mb-1 uppercase tracking-wider">
                                          BASE LEVEL STATION
                                        </span>
                                        <h5 className="font-display font-black text-base uppercase text-black">
                                          🎓 Completed 10th Class (SSC)
                                        </h5>
                                        <span className="text-[10px] text-gray-500 font-mono block mt-1">All standard routes start here</span>
                                      </div>
                                      
                                      {/* Connector arrow */}
                                      <div className="h-8 w-1 bg-black my-1"></div>
                                      <div className="w-3 h-3 border-b-2 border-r-2 border-black rotate-45 -mt-2"></div>
                                    </div>

                                    {/* Stage 2: Intermediate Stream Choices */}
                                    <div className="w-full">
                                      <span className="text-[10px] font-mono font-black text-gray-400 block pb-2 text-center uppercase tracking-wide">
                                        ⬇ STEP 1: CHOOSE PRE-COURSES (INTERMEDIATE / DIPLOMA)
                                      </span>
                                      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 w-full">
                                        {uniqueStreams.map(stream => (
                                          <div 
                                            key={stream.id}
                                            onClick={() => setSelectedFlowNode({ id: stream.id, type: 'intermediate', name: stream.name })}
                                            className="cursor-pointer bg-white border-2 border-black p-4 text-left shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all hover:bg-yellow-50 flex flex-col justify-between group w-full max-w-[280px] shrink-0"
                                          >
                                            <div>
                                              <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-mono font-black bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 uppercase">
                                                  {stream.duration}
                                                </span>
                                                <span className="text-[8.5px] font-mono text-blue-600 font-bold uppercase group-hover:underline">
                                                  View Details ➔
                                                </span>
                                              </div>
                                              <h6 className="font-display font-black text-sm uppercase text-gray-900 leading-tight">
                                                {stream.name}
                                              </h6>
                                              <p className="text-[11px] text-gray-500 leading-tight mt-1 line-clamp-2">
                                                {stream.desc}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Connecting to Stage 3 */}
                                    <div className="relative flex flex-col items-center">
                                      <div className="h-8 w-1 bg-black my-1"></div>
                                      <div className="w-3 h-3 border-b-2 border-r-2 border-black rotate-45 -mt-2"></div>
                                    </div>

                                    {/* Stage 3: Professional Graduation */}
                                    <div className="w-full">
                                      <span className="text-[10px] font-mono font-black text-gray-400 block pb-2 text-center uppercase tracking-wide">
                                        ⬇ STEP 2: FINISH RESPECTIVE GRADUATION PROGRAMS
                                      </span>
                                      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 w-full">
                                        {uniqueDegrees.map(deg => (
                                          <div 
                                            key={deg.name}
                                            onClick={() => setSelectedFlowNode({ id: deg.name, type: 'graduation', name: deg.name })}
                                            className="cursor-pointer bg-white border-2 border-black p-4 text-left shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all hover:bg-blue-50/10 flex flex-col justify-between group w-full max-w-[280px] shrink-0"
                                          >
                                            <div>
                                              <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-mono font-black bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 uppercase">
                                                  {deg.duration}
                                                </span>
                                                <span className="text-[8.5px] font-mono text-purple-600 font-bold uppercase group-hover:underline font-black">
                                                  View Details ➔
                                                </span>
                                              </div>
                                              <h6 className="font-display font-black text-sm uppercase text-gray-900 leading-tight">
                                                {deg.name}
                                              </h6>
                                              <p className="text-[11px] text-gray-500 leading-tight mt-1 line-clamp-2">
                                                {deg.desc || 'Comprehensive professional training curriculum focusing on career readiness.'}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Connecting to Goal */}
                                    <div className="relative flex flex-col items-center">
                                      <div className="h-8 w-1 bg-black my-1"></div>
                                      <div className="w-3 h-3 border-b-2 border-r-2 border-black rotate-45 -mt-2"></div>
                                    </div>

                                    {/* Stage 4: Ultimate Target Job */}
                                    <div className="w-full max-w-sm">
                                      <div className="bg-emerald-400 border-2 border-black p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-103 transition-all text-black">
                                        <span className="text-[9px] font-mono font-black bg-emerald-600 text-white px-2 py-0.5 border border-emerald-750 block mb-1.5 uppercase tracking-widest">
                                          GOAL TARGET PROFESSION
                                        </span>
                                        <h5 className="font-display font-black text-lg uppercase leading-tight">
                                          💼 {jobQuery}
                                        </h5>
                                        
                                        {/* Save Flowchart */}
                                        <button 
                                          onClick={() => {
                                            uniqueStreams.forEach(s => {
                                              if (!savedPathIds.includes(s.id)) {
                                                toggleSavePath(s.id);
                                              }
                                            });
                                            alert(`This entire career pathway flowchart has been saved! You can find the added intermediate/diploma course entries inside your 'Saved Paths' tab.`);
                                          }}
                                          className="mt-3.5 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-mono text-[10px] font-bold uppercase tracking-wider border border-black flex items-center gap-1 mx-auto shadow-[2px_2px_0px_0px_rgba(34,197,94,1)] cursor-pointer"
                                        >
                                          <Bookmark className="w-3.5 h-3.5" /> Save Flowchart to Portfolio
                                        </button>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </motion.div>

                              {/* Right Column: Career Overview Info desk (Col-span-5) */}
                              <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
                                <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left space-y-4">
                                  <div className="flex justify-between items-center pb-2 border-b-2 border-dashed border-stone-200">
                                    <h5 className="font-display font-black text-base uppercase text-gray-900 tracking-tight flex items-center gap-1.5">
                                      💎 Career Facts: {jobQuery}
                                    </h5>
                                    <span className="bg-emerald-100 text-emerald-950 text-[10px] font-mono font-black border border-emerald-300 px-2 py-0.5 rounded-sm">
                                      Highly Active
                                    </span>
                                  </div>

                                  {representativeJob ? (
                                    <div className="space-y-4">
                                      <div className="bg-emerald-50/40 p-3.5 border border-emerald-250/60 rounded">
                                        <span className="text-[9px] font-mono text-emerald-800 font-extrabold uppercase block mb-1">🎯 REVENUE SALARY METRIC APX:</span>
                                        <strong className="text-sm font-display text-emerald-950 uppercase block font-black leading-snug">
                                          🏷️ {representativeJob.salaryRange}
                                        </strong>
                                      </div>

                                      <div className="space-y-1 text-xs">
                                        <strong className="text-[10px] font-mono text-stone-500 uppercase block tracking-wider">// Job Overview Description:</strong>
                                        <p className="text-stone-605 font-medium leading-relaxed italic">
                                          "{representativeJob.description}"
                                        </p>
                                      </div>

                                      <div className="space-y-2 pt-1">
                                        <strong className="text-[10px] font-mono text-stone-500 uppercase block tracking-wider">// Skills Required:</strong>
                                        <div className="flex flex-wrap gap-1">
                                          {(representativeJob.skillsRequired || []).map(sk => (
                                            <span key={sk} className="text-[10px] bg-stone-100 border border-stone-200 px-2 py-0.5 font-bold font-mono text-stone-850">
                                              🛠 {sk}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="space-y-2 pt-2 border-t border-dashed border-stone-100">
                                        <strong className="text-[10px] font-mono text-stone-500 uppercase block tracking-wider">// Standard Chapters Day in the Life:</strong>
                                        <div className="space-y-1 pl-1">
                                          {(representativeJob.dayInLife || []).slice(0, 3).map((chapter, cIdx) => (
                                            <div key={cIdx} className="text-[11px] text-stone-700 leading-snug flex items-start gap-1">
                                              <span className="text-[#8B5CF6] font-bold">●</span>
                                              <span>{chapter}</span>
                                            </div>
                                          ))}
                                          {(representativeJob.dayInLife || []).length > 3 && (
                                            <span className="text-[9.5px] font-mono text-stone-400 block pt-0.5 font-bold">// Click any course to left to read final chapters</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                                        You entered the keyword: "{jobQuery}". There are {routesForJob.length} educational routes connecting to target degrees.
                                      </p>
                                      <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-900 font-mono text-[10.5px]">
                                        Please choose any Intermediate or Graduation degree box on the left map to explore complete curriculum details, student feedbacks, and workspace medias!
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="bg-indigo-600 border-2 border-black p-5 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left rounded-sm space-y-3">
                                  <span className="text-[9px] font-mono font-black text-indigo-200 uppercase block tracking-widest leading-none">
                                    // DIRPA ROADMAP ADVISING GUIDE
                                  </span>
                                  <h6 className="font-display font-black text-sm uppercase leading-tight">
                                    How to achieve {jobQuery || "Goal"}?
                                  </h6>
                                  <p className="text-[11px] text-indigo-100 leading-relaxed font-semibold">
                                    Our advising portal identifies {routesForJob.length} unique qualifications for this profession. To get started, complete Class 10/SSC, choose between standard Intermediate Science/Commerce groups or Polytechnic Diplomas, finish standard graduation, and initiate direct alumni connection chats to secure workplace guidance.
                                  </p>
                                </div>
                              </motion.div>
                            </motion.div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ROADMAP EXPLORER (NODE BASED VISUAL GRAPH SYSTEM) */}
              {activeLevel && !isComparing && (
                <div className="border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-black pb-4 mb-6">
                    <div>
                      
                      <h3 className="text-2xl font-display font-black uppercase">
                        Roadmap Explorer: {activeLevel} Standard Pathways
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveLevel(null)}
                      className="px-3 py-1.5 border border-black text-xs font-bold uppercase tracking-tight bg-gray-50 hover:bg-gray-100"
                    >
                      Close Map
                    </button>
                  </div>

                  {/* PROGRESS INDICATOR AT THE TOP OF THE ROADMAP CANVAS */}
                  {(() => {
                    const isStep1Completed = activeLevel === '12th' || (activeLevel === '10th' && selectedPathway);
                    const isStep1Active = activeLevel === '10th' && !selectedPathway;

                    const isStep2Completed = activeLevel === '12th' && selectedPathway;
                    const isStep2Active = (activeLevel === '10th' && selectedPathway) || (activeLevel === '12th' && !selectedPathway);

                    const isStep3Completed = false;
                    const isStep3Active = activeLevel === '12th' && selectedPathway;

                    return (
                      <div className="mb-6 border-2 border-black bg-stone-50 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                          
                          {/* Left: Detailed context description */}
                          <div className="space-y-1">
                            
                            <div className="text-sm font-display font-black text-black uppercase">
                              {activeLevel === '10th' && !selectedPathway && (
                                <span>Step 1: Foundational Options after 10th Standard</span>
                              )}
                              {activeLevel === '10th' && selectedPathway && (
                                <span>Step 2: Stream combination // {selectedPathway.name}</span>
                              )}
                              {activeLevel === '12th' && !selectedPathway && (
                                <span>Step 2: Choices after 12th {selected12thStream ? `(${selected12thStream})` : '/ Intermediate'}</span>
                              )}
                              {activeLevel === '12th' && selectedPathway && (
                                <span>Step 3: Professional Graduation // {selectedPathway.name}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-700">
                              {activeLevel === '10th' && !selectedPathway && "Select an Intermediate, Vocational or Polytechnic Node below to plan your next stage."}
                              {activeLevel === '10th' && selectedPathway && `Analyzing core features, fees, and career pathways mapped for ${selectedPathway.name}.`}
                              {activeLevel === '12th' && !selectedPathway && "Select a Bachelor Degree or professional pathway to assess standard career outcomes."}
                              {activeLevel === '12th' && selectedPathway && `Inspecting specific curricular domains, lateral guidelines, and alumni reviews for ${selectedPathway.name}.`}
                            </p>
                          </div>

                          {/* Right: The Stepper Sequence (10th -> Intermediate -> Graduation) */}
                          <div className="flex items-center gap-1.5 md:gap-3 flex-wrap">
                            
                            {/* Step 1: 10th Standard */}
                            <div className={`flex items-center gap-2 p-2 px-3 border-2 border-black transition-all text-[10px] md:text-xs font-bold uppercase shrink-0 ${
                              isStep1Active 
                                ? 'bg-yellow-300 dark:bg-amber-600 text-black dark:text-white font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-[-1px]' 
                                : isStep1Completed 
                                  ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 opacity-95' 
                                  : 'bg-stone-100 dark:bg-zinc-850 text-gray-400'
                            }`}>
                              <div className={`w-4 h-4 rounded-full border border-black flex items-center justify-center text-[10px] font-black shrink-0 ${
                                isStep1Active ? 'bg-black text-yellow-300' : isStep1Completed ? 'bg-green-600 text-white' : 'bg-gray-305'
                              }`}>
                                {isStep1Completed ? '✓' : '1'}
                              </div>
                              <span>10th Grade</span>
                            </div>

                            {/* Connector 1 */}
                            <span className="text-gray-400 font-bold font-mono">➔</span>

                            {/* Step 2: Intermediate / Diploma */}
                            <div className={`flex items-center gap-2 p-2 px-3 border-2 border-black transition-all text-[10px] md:text-xs font-bold uppercase shrink-0 ${
                              isStep2Active 
                                ? 'bg-yellow-300 dark:bg-amber-600 text-black dark:text-white font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-[-1px]' 
                                : isStep2Completed 
                                  ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 opacity-95' 
                                  : 'bg-stone-100 dark:bg-zinc-850 text-gray-400 font-medium'
                            }`}>
                              <div className={`w-4 h-4 rounded-full border border-black flex items-center justify-center text-[10px] font-black shrink-0 ${
                                isStep2Active ? 'bg-black text-yellow-300' : isStep2Completed ? 'bg-green-600 text-white' : 'bg-gray-305'
                              }`}>
                                {isStep2Completed ? '✓' : '2'}
                              </div>
                              <span>{activeLevel === '12th' && selected12thStream ? `12th (${selected12thStream})` : "Intermediate / Diploma"}</span>
                            </div>

                            {/* Connector 2 */}
                            <span className="text-gray-400 font-bold font-mono">➔</span>

                            {/* Step 3: Graduation */}
                            <div className={`flex items-center gap-2 p-2 px-3 border-2 border-black transition-all text-[10px] md:text-xs font-bold uppercase shrink-0 ${
                              isStep3Active 
                                ? 'bg-yellow-300 dark:bg-amber-600 text-black dark:text-white font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-[-1px]' 
                                : isStep3Completed
                                  ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 opacity-95'
                                  : 'bg-stone-100 dark:bg-zinc-850 text-gray-400 font-medium'
                            }`}>
                              <div className={`w-4 h-4 rounded-full border border-black flex items-center justify-center text-[10px] font-black shrink-0 ${
                                isStep3Active ? 'bg-black text-yellow-300' : 'bg-gray-305'
                              }`}>
                                3
                              </div>
                              <span>Graduation / Career</span>
                            </div>

                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  {/* Reusable circular radial map canvas renderer */}
                  {renderMapCanvas(false)}

                  {/* Absolute Full-Screen Map Portal Overlay */}
                  {isMapFullScreen && (
                    <div className="fixed inset-0 z-50 bg-white p-6 flex flex-col justify-between animate-fade-in text-black">
                      <div className="flex justify-between items-center pb-4 border-b border-black mb-4">
                        <div>
                          <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">// DIRPA Live Widescreen Map Explorer</span>
                          <h3 className="text-xl font-display font-black uppercase">Roadmap: Class {activeLevel === '10th' ? '10 (SSC)' : '12'} pathways spider-nest</h3>
                        </div>
                        <button
                          onClick={() => setIsMapFullScreen(false)}
                          className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                        >
                          ✕ Exit Map
                        </button>
                      </div>
                      
                      <div className="flex-1 relative">
                        {renderMapCanvas(true)}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* COMPLEMENTARY ROADMAP PATHWAY COMPARER MAIN PANEL */}
              {isComparing && (
                <div id="side-by-side-comparison-board" className="border-2 border-black bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-250 animate-fade-in text-[#1A1A1A] dark:text-white">
                  
                  {/* Top Bar Banner with Neo-Brutalist Colors */}
                  <div className="bg-orange-500 text-white p-6 border-b-2 border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Back button on top left to come to home page */}
                      <button
                        onClick={() => setIsComparing(false)}
                        className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {t('compare.backToHome', '← Back to Home Page')}
                      </button>
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest bg-black/30 text-yellow-300 px-2 py-0.5 rounded-sm">
                          {t('compare.panelTitle', 'Curriculum Advisor Panel')}
                        </span>
                        <h2 className="text-3xl font-display font-black uppercase mt-1">
                          {t('compare.boardTitle', '⚖️ Side-by-Side Advisor Board')}
                        </h2>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button 
                        onClick={() => {
                          const temp = comparePathAId;
                          setComparePathAId(comparePathBId);
                          setComparePathBId(temp);
                        }}
                        className="px-3 py-2 bg-black text-white hover:bg-white hover:text-black border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1.5"
                        title="Swap active paths"
                        disabled={!comparePathAId && !comparePathBId}
                      >
                        <ArrowLeftRight className="w-3 h-3" /> {t('compare.swap', 'Swap')}
                      </button>
                      <button 
                        onClick={() => {
                          setComparePathAId(null);
                          setComparePathBId(null);
                          setCompareTargetSlot('A');
                        }}
                        className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-black border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                      >
                        {t('compare.resetBoth', 'Reset both')}
                      </button>
                      <button 
                        onClick={() => setIsComparing(false)}
                        className="p-2.5 bg-red-600 border-2 border-black text-white text-xs font-black uppercase hover:bg-red-500"
                        title="Exit Comparison Mode"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Curricula Config Selectors Row (Active in Fullscreen Comparison View) */}
                  <div className="p-4 bg-stone-50 dark:bg-zinc-800 border-b-2 border-black grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
                    <div className="xl:col-span-2 text-xs font-black uppercase text-gray-500 flex items-center gap-1.5 dark:text-zinc-400">
                      <Sliders className="w-4 h-4 text-orange-500 animate-spin" /> CLUSTER CONFIGS:
                    </div>

                    {/* Slot A Setup */}
                    <div className="xl:col-span-4 flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => setCompareTargetSlot('A')}
                        className={`px-2 py-1 text-[10px] font-mono border border-black font-black shrink-0 transition-all ${compareTargetSlot === 'A' ? 'bg-orange-500 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-semibold' : 'bg-stone-200 text-gray-700 dark:bg-zinc-750 dark:text-zinc-300 border-stone-400'}`}
                        title="Set Slot A as map targeting slot"
                      >
                        Slot A {compareTargetSlot === 'A' ? "⭐" : ""}
                      </button>
                      <select
                        value={comparePathAId || ''}
                        onChange={(e) => {
                          setComparePathAId(e.target.value || null);
                          setCompareTargetSlot('B');
                        }}
                        className="flex-1 min-w-0 p-1 py-1.5 border border-black bg-white dark:bg-zinc-900 text-black dark:text-white text-xs font-mono font-bold focus:outline-none cursor-pointer truncate"
                      >
                        <option value="">-- Choose Slot A Node --</option>
                        {getAllSelectablePathways().map(p => (
                          <option key={`tp_a_${p.id}`} value={p.id}>
                            [{p.level}] {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Compare VS badge separator */}
                    <div className="xl:col-span-2 text-center text-xs font-black bg-stone-200 dark:bg-zinc-700 border border-black py-1 px-3 uppercase font-mono max-w-[80px] mx-auto rounded-sm text-[#0F172A] dark:text-gray-200">
                      VS
                    </div>

                    {/* Slot B Setup */}
                    <div className="xl:col-span-4 flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => setCompareTargetSlot('B')}
                        className={`px-2 py-1 text-[10px] font-mono border border-black font-black shrink-0 transition-all ${compareTargetSlot === 'B' ? 'bg-orange-500 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-semibold' : 'bg-stone-200 text-gray-700 dark:bg-zinc-750 dark:text-zinc-300 border-stone-400'}`}
                        title="Set Slot B as map targeting slot"
                      >
                        Slot B {compareTargetSlot === 'B' ? "⭐" : ""}
                      </button>
                      <select
                        value={comparePathBId || ''}
                        onChange={(e) => {
                          setComparePathBId(e.target.value || null);
                          setCompareTargetSlot('A');
                        }}
                        className="flex-1 min-w-0 p-1 py-1.5 border border-black bg-white dark:bg-zinc-900 text-black dark:text-white text-xs font-mono font-bold focus:outline-none cursor-pointer truncate"
                      >
                        <option value="">-- Choose Slot B Node --</option>
                        {getAllSelectablePathways().map(p => (
                          <option key={`tp_b_${p.id}`} value={p.id}>
                            [{p.level}] {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Body Block */}
                  {(() => {
                    const pathA = getPathwayForComparison(comparePathAId);
                    const pathB = getPathwayForComparison(comparePathBId);
                    const hasBoth = pathA && pathB;

                    if (!hasBoth) {
                      return (
                        <div className="p-8 text-center space-y-6 bg-slate-50 dark:bg-zinc-950 text-[#0F172A] dark:text-zinc-200">
                          <div className="mx-auto w-16 h-16 rounded-full border-2 border-black bg-orange-100 flex items-center justify-center">
                            <GitCompare className="w-8 h-8 text-orange-600" />
                          </div>
                          <div className="space-y-2 max-w-lg mx-auto">
                            <h3 className="text-xl font-display font-black uppercase text-black dark:text-white">Pending Pathway Selections</h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-normal">
                              To analyze subject loads, tuition offsets, and career disparities side-by-side, please link two educational tracks.
                            </p>
                          </div>

                          {/* Displays Two Blank/Partially filled slots in brutalist card style */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
                            {/* Slot A tracker */}
                            <div 
                              onClick={() => setCompareTargetSlot('A')}
                              className={`border-2 border-black p-5 cursor-pointer transition-all ${
                                pathA 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20' 
                                  : compareTargetSlot === 'A' 
                                    ? 'bg-amber-100 dark:bg-amber-950/20 ring-2 ring-black font-black animate-pulse' 
                                    : 'bg-white dark:bg-zinc-900 border-dashed'
                              }`}
                            >
                              <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 inline-block mb-2">Slot A Path</span>
                              {pathA ? (
                                <div className="text-left text-xs">
                                  <p className="font-extrabold text-black dark:text-white uppercase truncate">{pathA.name}</p>
                                  <p className="text-gray-500 dark:text-zinc-400 text-[10px]">{pathA.level} Level // {pathA.category}</p>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400 italic">
                                  {compareTargetSlot === 'A' ? "👉 CLICK ON MAP OR SELECT IN DROPDOWN TO ASSIGN" : "Click to activate slot selection"}
                                </p>
                              )}
                            </div>

                            {/* Slot B tracker */}
                            <div 
                              onClick={() => setCompareTargetSlot('B')}
                              className={`border-2 border-black p-5 cursor-pointer transition-all ${
                                pathB 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20' 
                                  : compareTargetSlot === 'B' 
                                    ? 'bg-amber-100 dark:bg-amber-950/20 ring-2 ring-black font-black animate-pulse' 
                                    : 'bg-white dark:bg-zinc-900 border-dashed'
                              }`}
                            >
                              <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 inline-block mb-2">Slot B Path</span>
                              {pathB ? (
                                <div className="text-left text-xs">
                                  <p className="font-extrabold text-black dark:text-white uppercase truncate">{pathB.name}</p>
                                  <p className="text-gray-500 dark:text-zinc-400 text-[10px]">{pathB.level} Level // {pathB.category}</p>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400 italic">
                                  {compareTargetSlot === 'B' ? "👉 CLICK ON MAP OR SELECT IN DROPDOWN TO ASSIGN" : "Click to activate slot selection"}
                                </p>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    }

                    // Calculate common / unique subjects for the curriculum comparison analytics!
                    const commonSubjects = pathA.subjects.filter(sa => 
                      pathB.subjects.some(sb => 
                        sb.toLowerCase().includes(sa.toLowerCase()) || 
                        sa.toLowerCase().includes(sb.toLowerCase())
                      )
                    );

                    const uniqueA = pathA.subjects.filter(sa => !commonSubjects.includes(sa));
                    const uniqueB = pathB.subjects.filter(sb => !commonSubjects.includes(sb));

                    return (
                      <div className="divide-y-2 divide-black bg-[#FBFCFD] dark:bg-zinc-900">
                        
                        {/* 1. At a Glance Top Header Card Dual layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
                          
                          {/* Path A Column */}
                          <div className="p-6 space-y-4 bg-blue-50/25 dark:bg-zinc-900">
                            <div>
                              <span className="text-[10px] font-mono font-extrabold uppercase bg-blue-600 text-white px-2 py-0.5 rounded-sm">Path A Selection</span>
                              <h3 className="text-2xl font-display font-black uppercase text-black dark:text-white mt-2 leading-[1.2]">{pathA.name}</h3>
                              <p className="text-xs text-blue-600 font-bold uppercase mt-1 tracking-wider">{pathA.level} Level // {pathA.category} Stream</p>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-sans">{pathA.description}</p>
                          </div>

                          {/* Path B Column */}
                          <div className="p-6 space-y-4 bg-amber-50/25 dark:bg-zinc-900">
                            <div>
                              <span className="text-[10px] font-mono font-extrabold uppercase bg-amber-600 text-white px-2 py-0.5 rounded-sm">Path B Selection</span>
                              <h3 className="text-2xl font-display font-black uppercase text-black dark:text-white mt-2 leading-[1.2]">{pathB.name}</h3>
                              <p className="text-xs text-amber-600 font-bold uppercase mt-1 tracking-wider">{pathB.level} Level // {pathB.category} Stream</p>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-sans">{pathB.description}</p>
                          </div>

                        </div>

                        {/* 2. Structured Comparison Metrics Grid */}
                        <div className="p-6 space-y-6">
                          <h4 className="text-xs font-mono uppercase bg-black text-white px-3 py-1 inline-block tracking-widest font-black mb-4">
                            🔍 Vital Structural Offsets
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Standard Duration Card */}
                            <div className="border-2 border-black p-4 bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#0F172A] dark:text-white">
                              <span className="text-[9px] uppercase font-bold text-gray-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 mr-1" /> Standard Duration
                              </span>
                              <div className="grid grid-cols-2 gap-2 mt-2 divide-x divide-gray-200">
                                <div className="pr-2">
                                  <p className="text-[10px] text-gray-500 uppercase">Pathway A</p>
                                  <p className="text-base font-black text-blue-600">{pathA.duration}</p>
                                </div>
                                <div className="pl-2">
                                  <p className="text-[10px] text-gray-500 uppercase">Pathway B</p>
                                  <p className="text-base font-black text-amber-600">{pathB.duration}</p>
                                </div>
                              </div>
                            </div>

                            {/* Estimated Tuition Cost Card */}
                            <div className="border-2 border-black p-4 bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#0F172A] dark:text-white">
                              <span className="text-[9px] uppercase font-bold text-gray-400 flex items-center gap-1">
                                <Coins className="w-3.5 h-3.5 mr-1" /> Tuition Fee Range
                              </span>
                              <div className="grid grid-cols-2 gap-2 mt-2 divide-x divide-gray-200">
                                <div className="pr-2">
                                  <p className="text-[10px] text-gray-500 uppercase">Pathway A</p>
                                  <p className="text-xs font-extrabold text-blue-600 line-clamp-2 truncate">{pathA.estimatedFees}</p>
                                </div>
                                <div className="pl-2">
                                  <p className="text-[10px] text-gray-500 uppercase">Pathway B</p>
                                  <p className="text-xs font-extrabold text-amber-600 line-clamp-2 truncate">{pathB.estimatedFees}</p>
                                </div>
                              </div>
                            </div>

                            {/* Entrance Eligibility Card */}
                            <div className="border-2 border-black p-4 bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#0F172A] dark:text-white">
                              <span className="text-[9px] uppercase font-bold text-gray-400 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 mr-1" /> Entry Prerequisites
                              </span>
                              <div className="grid grid-cols-2 gap-2 mt-2 divide-x divide-gray-200">
                                <div className="pr-2">
                                  <p className="text-[10px] text-gray-500 uppercase">Pathway A</p>
                                  <p className="text-[10px]/normal font-extrabold text-blue-600 whitespace-normal leading-tight h-10 overflow-hidden line-clamp-2">{pathA.eligibility}</p>
                                </div>
                                <div className="pl-2">
                                  <p className="text-[10px] text-gray-500 uppercase">Pathway B</p>
                                  <p className="text-[10px]/normal font-extrabold text-amber-600 whitespace-normal leading-tight h-10 overflow-hidden line-clamp-2">{pathB.eligibility}</p>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* 3. Visual Curricular Density / Subject Load comparison */}
                        <div className="p-6 space-y-6">
                          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                            <div>
                              <h4 className="text-xs font-mono uppercase bg-black text-white px-3 py-1 inline-block tracking-widest font-black">
                                📚 Subject-Load & Curricular Density
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">Comparing academic scope, class load, and trade theory density index.</p>
                            </div>

                            {/* visual progress breadth differences */}
                            <div className="flex items-center gap-3 bg-stone-100 dark:bg-zinc-850 border border-black p-2 rounded-sm text-[10px] text-black dark:text-white">
                              <span className="font-mono font-black uppercase text-gray-405">Relative breadth:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-blue-600">A ({pathA.subjects.length})</span>
                                <div className="w-28 sm:w-36 bg-gray-300 h-3.5 border border-black rounded-sm overflow-hidden flex">
                                  {(() => {
                                    const total = pathA.subjects.length + pathB.subjects.length || 1;
                                    const widthA = (pathA.subjects.length / total) * 100;
                                    const widthB = (pathB.subjects.length / total) * 100;
                                    return (
                                      <>
                                        <div className="bg-blue-500 h-full" style={{ width: `${widthA}%` }} />
                                        <div className="bg-amber-500 h-full" style={{ width: `${widthB}%` }} />
                                      </>
                                    );
                                  })()}
                                </div>
                                <span className="font-bold text-amber-600">B ({pathB.subjects.length})</span>
                              </div>
                            </div>
                          </div>

                          {/* Curricular List Breakdown columns */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

                            {/* Subjects of Selection A */}
                            <div className="space-y-3">
                              <h5 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center justify-between border-b pb-1">
                                <span>{pathA.name} curriculum</span>
                                <span className="bg-blue-100 text-blue-800 text-[9px] font-mono font-black px-2 py-0.5 border border-black">{pathA.subjects.length} Subjects</span>
                              </h5>
                              <ul className="space-y-2">
                                {pathA.subjects.map((s, idx) => {
                                  const isShared = commonSubjects.some(c => c.toLowerCase() === s.toLowerCase());
                                  return (
                                    <li key={`asub_${idx}`} className="flex items-start gap-2 text-xs">
                                      <span className={`w-4 h-4 rounded-full border border-black flex items-center justify-center text-[8px] font-black shrink-0 mt-0.5 ${isShared ? 'bg-emerald-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
                                        {isShared ? '✓' : '•'}
                                      </span>
                                      <span className={`${isShared ? 'font-semibold text-emerald-800 dark:text-emerald-400' : 'text-gray-700 dark:text-zinc-300'}`}>
                                        {s} {isShared && <span className="text-[8px] uppercase tracking-tighter bg-emerald-100 text-emerald-800 px-1 font-mono font-black inline-block ml-1">shared core</span>}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            {/* Subjects of Selection B */}
                            <div className="space-y-3">
                              <h5 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center justify-between border-b pb-1">
                                <span>{pathB.name} curriculum</span>
                                <span className="bg-amber-105 text-amber-800 text-[9px] font-mono font-black px-2 py-0.5 border border-black bg-amber-100">{pathB.subjects.length} Subjects</span>
                              </h5>
                              <ul className="space-y-2">
                                {pathB.subjects.map((s, idx) => {
                                  const isShared = commonSubjects.some(c => c.toLowerCase() === s.toLowerCase());
                                  return (
                                    <li key={`bsub_${idx}`} className="flex items-start gap-2 text-xs">
                                      <span className={`w-4 h-4 rounded-full border border-black flex items-center justify-center text-[8px] font-black shrink-0 mt-0.5 ${isShared ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-750'}`}>
                                        {isShared ? '✓' : '•'}
                                      </span>
                                      <span className={`${isShared ? 'font-semibold text-emerald-800 dark:text-emerald-400' : 'text-gray-700 dark:text-zinc-300'}`}>
                                        {s} {isShared && <span className="text-[8px] uppercase tracking-tighter bg-emerald-100 text-emerald-800 px-1 font-mono font-black inline-block ml-1">shared core</span>}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                          </div>
                        </div>

                        {/* 4. Career and professional placement disparity comparison */}
                        <div className="p-6 space-y-6">
                          <h4 className="text-xs font-mono uppercase bg-black text-white px-3 py-1 inline-block tracking-widest font-black">
                            💼 Career Placements & Occupational Outlets
                          </h4>
                          <p className="text-xs text-gray-500">Side-by-side analysis of where these paths lead in the corporate, defense, and public-sector labor markets.</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                            
                            {/* Career outcomes A */}
                            <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-black space-y-3">
                              <p className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Path A: Placements
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {pathA.careerOutcomes.map((o, idx) => (
                                  <span key={`outa_${idx}`} className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 border border-black px-2 py-0.5 text-blue-950 dark:text-white rounded-sm">
                                    {o}
                                  </span>
                                ))}
                              </div>
                              <div className="pt-2 space-y-1 text-xs">
                                <p className="font-extrabold uppercase tracking-tight text-gray-500">Graduation & Placement Velocity:</p>
                                <p className="leading-relaxed text-[11px] text-gray-600 dark:text-zinc-400">
                                  {pathA.level === '10th' && pathA.category === 'Vocational' && "Instant labor entrance (within 1 Year). Best suited for immediate technical shopfloor or contractor designation."}
                                  {pathA.level === '10th' && pathA.category === 'Engineering' && "Direct lateral admissions pathway setup. Qualifies users as Senior Apprentice supervisors in 3 years."}
                                  {pathA.level === '12th' && "Standard professional-scale placement bracket. Higher starting salaries, strategic executive pipelines, and administrative leadership scale tracks."}
                                  {pathA.level === '10th' && pathA.category === 'Science' && "Foundation track. Broadest choice selection for medical, pure science, or professional software tracks."}
                                </p>
                              </div>
                            </div>

                            {/* Career outcomes B */}
                            <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-black space-y-3">
                              <p className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-amber-600" /> Path B: Placements
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {pathB.careerOutcomes.map((o, idx) => (
                                  <span key={`outb_${idx}`} className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/20 border border-black px-2 py-0.5 text-amber-950 dark:text-white rounded-sm">
                                    {o}
                                  </span>
                                ))}
                              </div>
                              <div className="pt-2 space-y-1 text-xs">
                                <p className="font-extrabold uppercase tracking-tight text-gray-500">Graduation & Placement Velocity:</p>
                                <p className="leading-relaxed text-[11px] text-gray-600 dark:text-zinc-400">
                                  {pathB.level === '10th' && pathB.category === 'Vocational' && "Instant labor entrance (within 1 Year). Best suited for immediate technical shopfloor or contractor designation."}
                                  {pathB.level === '10th' && pathB.category === 'Engineering' && "Direct lateral admissions pathway setup. Qualifies users as Senior Apprentice supervisors in 3 years."}
                                  {pathB.level === '12th' && "Standard professional-scale placement bracket. Higher starting salaries, strategic executive pipelines, and administrative leadership scale tracks."}
                                  {pathB.level === '10th' && pathB.category === 'Science' && "Foundation track. Broadest choice selection for medical, pure science, or professional software tracks."}
                                </p>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* 5. Path Next-Step/Academic Continuity Comparison */}
                        <div className="p-6 space-y-6">
                          <h4 className="text-xs font-mono uppercase bg-black text-white px-3 py-1 inline-block tracking-widest font-black">
                            🪜 Educational Continuity & Lateral Tracks
                          </h4>
                          <p className="text-xs text-gray-500">Reviewing next-stage academic mobility, lateral bridge entries, and examinations pipelines.</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                            
                            {/* Higher Edu A */}
                            <div className="space-y-3">
                              <p className="text-xs font-black text-[#0F172A] dark:text-white uppercase tracking-tight border-b pb-1 border-gray-100">Path A Next Degrees & Bridges:</p>
                              <ul className="space-y-2">
                                {pathA.higherEducationOptions.slice(0, 3).map((e, idx) => (
                                  <li key={`eda_${idx}`} className="text-xs flex items-start gap-2 text-gray-600 dark:text-zinc-300">
                                    <span className="text-blue-500 font-extrabold shrink-0 mt-0.5">↗</span>
                                    <span>{e}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Higher Edu B */}
                            <div className="space-y-3">
                              <p className="text-xs font-black text-[#0F172A] dark:text-white uppercase tracking-tight border-b pb-1 border-gray-100">Path B Next Degrees & Bridges:</p>
                              <ul className="space-y-2">
                                {pathB.higherEducationOptions.slice(0, 3).map((e, idx) => (
                                  <li key={`edb_${idx}`} className="text-xs flex items-start gap-2 text-gray-600 dark:text-zinc-300">
                                    <span className="text-amber-500 font-extrabold shrink-0 mt-0.5">↗</span>
                                    <span>{e}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                          </div>
                        </div>

                        {/* 6. Advisor Verdict synthesis block */}
                        <div className="p-6 bg-slate-100 dark:bg-zinc-950/60 text-[#0F172A] dark:text-zinc-100 border-t border-black">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl mt-0.5">⚖️</span>
                            <div className="space-y-1">
                              <h5 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">Advisor Diagnostic Synthesis Verdict</h5>
                              <p className="text-[11px] leading-relaxed text-gray-600 dark:text-zinc-400 font-sans">
                                {(() => {
                                  if (pathA.level !== pathB.level) {
                                    return `Comparing pathways across distinct educational tiers (${pathA.level} vs ${pathB.level}). Pick ${pathA.name} to establish a foundational bridge early, or select ${pathB.name} if you are already looking at advanced collegiate specialized degrees.`;
                                  }

                                  if (pathA.category === 'Vocational' && pathB.category === 'Engineering') {
                                    return `This is a classic 'Vocational' vs 'Diploma' engineering spectrum comparison. Choose ${pathA.name} if you want ultra-rapid, tactile trade workshop qualifications for immediate labor entry in 1 year. Pick ${pathB.name} if you prefer a 3-year technical design diploma with direct B.Tech. second-year lateral entry admissions.`;
                                  }

                                  if (pathA.category === 'Engineering' && pathB.category === 'Vocational') {
                                    return `This is a classic 'Diploma' vs 'Vocational' spectrum comparison. Choose ${pathB.name} if you want ultra-rapid, tactile trade workshop qualifications for immediate labor entry in 1 year. Pick ${pathA.name} if you prefer a 3-year technical design diploma with direct B.Tech. second-year lateral entry admissions.`;
                                  }

                                  if (pathA.category === 'Science' && pathB.category === 'Medical') {
                                    return `Comparing high-rigor Math/Physical Sciences vs Biological medical tracks. ${pathA.name} builds computational/systems thinking, locking in engineering/analytical pipelines. ${pathB.name} focuses heavily on biology, diagnostics, memorization, and clinical healthcare workflows.`;
                                  }

                                  return `Comparing ${pathA.name} and ${pathB.name}. Both occupy similar academic niches. Check the fees details (Path A: ${pathA.estimatedFees} vs Path B: ${pathB.estimatedFees}) and subject curriculum load. Path A focuses on ${pathA.subjects.slice(0, 3).join(', ')}, whereas Path B offers intensive instruction in ${pathB.subjects.slice(0, 3).join(', ')}. Select based on your daily practical interest or higher collegiate plans.`;
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}

              {/* SELECTED PATHWAY DETAIL SECTION IS PREVENTED FROM RENDERING HERE SPLIT-PAGE. REDIRECTED TO STANDALONE FULL-SCREEN LAYOUT */}

              {/* ================= DATA-RICH SEARCHABLE DIRECTORIES (HIDDEN AS REQUESTED) ================= */}
              <div id="master-db-directories" className="hidden">
                
                {/* Header Block with high contrast banner */}
                <div className="bg-amber-100 dark:bg-amber-950 p-6 border-b-2 border-black">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#2563EB] dark:text-[#60A5FA] font-mono tracking-widest block mb-1">
                    [ // DIRECT INTERNET-ACCESSIBLE NATIONAL REGISTRIES ]
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-black uppercase mt-1 text-black dark:text-white">
                    Pathways Registry & Directories
                  </h3>
                  <p className="text-xs text-gray-705 dark:text-gray-300 mt-1.5 leading-relaxed">
                    Search and inspect direct legal combinations, subject streams, and professional lateral entrance pathways.
                  </p>
                </div>

                {/* Neo-brutalist directory tabs */}
                <div className="grid grid-cols-3 border-b-2 border-black bg-stone-50 text-center font-display font-black text-[10.5px] md:text-xs uppercase tracking-wider">
                  <button 
                    onClick={() => setDbActiveTab('intermediate')}
                    className={`py-4 border-r-2 border-black transition-all hover:bg-amber-50 dark:hover:bg-amber-900 ${dbActiveTab === 'intermediate' ? 'bg-amber-250 text-black dark:bg-amber-900 dark:text-white font-black' : 'text-gray-500 bg-white dark:bg-zinc-900'}`}
                  >
                    85 Inter Groups
                  </button>
                  <button 
                    onClick={() => setDbActiveTab('polytechnic')}
                    className={`py-4 border-r-2 border-black transition-all hover:bg-amber-50 dark:hover:bg-amber-900 ${dbActiveTab === 'polytechnic' ? 'bg-amber-250 text-black dark:bg-amber-900 dark:text-white font-black' : 'text-gray-500 bg-white dark:bg-zinc-900'}`}
                  >
                    28 Polytechnic Branches
                  </button>
                  <button 
                    onClick={() => setDbActiveTab('iti')}
                    className={`py-4 transition-all hover:bg-amber-50 dark:hover:bg-amber-900 ${dbActiveTab === 'iti' ? 'bg-amber-250 text-black dark:bg-amber-900 dark:text-white font-black' : 'text-gray-500 bg-white dark:bg-zinc-900'}`}
                  >
                    ITI & Vocational Trades
                  </button>
                </div>

                {/* Directory Workspace */}
                <div className="p-6">
                  
                  {/* SEARCH AREA */}
                  {dbActiveTab === 'intermediate' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="Search 85 Intermediate Streams by name, code, or subject (e.g. MPC, Economics, 005)..."
                          value={intermediateSearch}
                          onChange={(e) => setIntermediateSearch(e.target.value)}
                          className="w-full p-4 border-2 border-black bg-stone-50 dark:bg-zinc-900 rounded-none text-xs font-bold font-mono placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-1000 dark:text-white"
                        />
                        <div className="absolute top-4 right-4 text-gray-400">
                          <Search className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Info Overview in a beautiful note container */}
                      <div className="bg-blue-50 dark:bg-[#1E293B] border border-black p-4 text-xs text-blue-950 dark:text-blue-100 flex items-start gap-3">
                        <span className="text-xl">💡</span>
                        <div>
                          <p className="font-bold uppercase tracking-wide">About Intermediate Education in India</p>
                          <p className="mt-1 opacity-90 leading-relaxed">
                            It is a critical 2-year academic bridge between school (Class 10) and professional degrees (Classes 11 and 12).
                            Focusing on specialized combinations guides students toward careers like engineering (MPC), medicine (BiPC), accounting (CEC, MEC), or civil systems (HEC).
                          </p>
                        </div>
                      </div>

                      {/* Scrollable Results Registry */}
                      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                        {INTERMEDIATE_GROUPS.filter(g => {
                          const query = intermediateSearch.toLowerCase();
                          return g.code.includes(query) || 
                                 g.name.toLowerCase().includes(query) || 
                                 g.subjects.some(s => s.toLowerCase().includes(query)) ||
                                 g.nextStudies.some(n => n.toLowerCase().includes(query));
                        }).map(g => (
                          <div key={g.code} className="border-2 border-black bg-white dark:bg-zinc-900 p-4 transition-all hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-[10px] font-mono bg-black text-white px-1.5 py-0.5 uppercase font-bold">Group Code: {g.code}</span>
                                <h4 className="text-base font-display font-black text-black dark:text-white mt-1">{g.name}</h4>
                              </div>
                              <span className="text-[9px] uppercase font-bold text-gray-500 bg-gray-100 dark:bg-zinc-850 border border-gray-300 dark:border-zinc-800 px-2 py-0.5">Academic Option</span>
                            </div>
                            
                            {/* Subjects Badge */}
                            <div className="mb-3">
                              <span className="text-[9px] uppercase font-black text-gray-400 block mb-1">Studied Subjects:</span>
                              <div className="flex flex-wrap gap-1">
                                {g.subjects.filter(s => s !== '-').map((sub, i) => (
                                  <span key={i} className="text-[10px] font-bold bg-slate-50 dark:bg-zinc-800 border border-black px-2 py-0.5 text-slate-800 dark:text-gray-200">{sub}</span>
                                ))}
                              </div>
                            </div>

                            {/* Mapped next pathways badge */}
                            <div className="border-l-2 border-blue-500 pl-3">
                              <span className="text-[9px] uppercase font-black text-[#2563EB] dark:text-blue-400 block leading-tight">Eligible Higher Studies / Careers:</span>
                              <p className="text-xs text-gray-750 dark:text-gray-305 font-sans mt-0.5 italic leading-relaxed">
                                {g.nextStudies.join(', ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dbActiveTab === 'polytechnic' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="Search 28 Polytechnic branches (e.g. Civil, Computer, Applied Arts, ECE)..."
                          value={polytechnicSearch}
                          onChange={(e) => setPolytechnicSearch(e.target.value)}
                          className="w-full p-4 border-2 border-black bg-stone-50 dark:bg-zinc-900 rounded-none text-xs font-bold font-mono placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-1005 dark:text-white"
                        />
                        <div className="absolute top-4 right-4 text-gray-400">
                          <Search className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Info Overview in a beautiful note container */}
                      <div className="bg-amber-50 dark:bg-zinc-950/40 border border-black p-4 text-xs text-amber-950 dark:text-amber-100 flex items-start gap-4">
                        <span className="text-xl">⚙️</span>
                        <div>
                          <p className="font-bold uppercase tracking-wide">Polytechnic Diplomas (3-Year Programs)</p>
                          <p className="mt-1 opacity-90 leading-relaxed">
                            Practical, job-oriented, and highly technical. Aligns students with actual lab and hardware experiences.
                            Under state common guidelines, diploma branch holders are eligible for direct 2nd-year lateral entry B.Tech admissions through state entrance tests (AP ECET).
                          </p>
                        </div>
                      </div>

                      {/* Scrollable Results Registry */}
                      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                        {POLYTECHNIC_DIPLOMAS.filter(p => {
                          const query = polytechnicSearch.toLowerCase();
                          return p.name.toLowerCase().includes(query) || 
                                 p.description.toLowerCase().includes(query) || 
                                 p.lateralBTech.toLowerCase().includes(query);
                        }).map(p => (
                          <div key={p.id} className="border-2 border-black bg-white dark:bg-zinc-900 p-4 transition-all hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-base font-display font-black text-black dark:text-white">Diploma in {p.name}</h4>
                              <span className={`text-[9.5px] uppercase font-bold border px-2 py-0.5 ${p.isEngineering ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800 text-green-700 dark:text-green-350' : 'bg-orange-50 dark:bg-orange-950 border-orange-355 dark:border-orange-850 text-orange-700 dark:text-orange-350'}`}>
                                {p.isEngineering ? 'Engineering' : 'Vocational'}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-650 dark:text-gray-300 mb-3 leading-relaxed">{p.description}</p>

                            {/* Lateral Admission guidelines */}
                            <div className="border-t border-dashed border-black pt-2 bg-slate-50 dark:bg-zinc-800 p-3 border">
                              <span className="text-[9.5px] uppercase font-black text-[#2563EB] dark:text-blue-400 block">AP ECET Lateral Placement (Direct B.Tech Year 2)</span>
                              <p className="text-xs text-gray-800 dark:text-gray-200 font-mono mt-0.5 font-bold leading-relaxed">
                                {p.lateralBTech}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dbActiveTab === 'iti' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="Search ITI and Vocational careers by keyword, trade, certification..."
                          value={itiSearch}
                          onChange={(e) => setItiSearch(e.target.value)}
                          className="w-full p-4 border-2 border-black bg-stone-50 dark:bg-zinc-900 rounded-none text-xs font-bold font-mono placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-1006 dark:text-white"
                        />
                        <div className="absolute top-4 right-4 text-gray-400">
                          <Search className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Info Overview in a beautiful note container */}
                      <div className="bg-purple-50 dark:bg-zinc-950/40 border border-black p-4 text-xs text-purple-950 dark:text-purple-150 flex items-start gap-4">
                        <span className="text-xl">🛠️</span>
                        <div>
                          <p className="font-bold uppercase tracking-wide">ITI & Short Vocational Course Directories</p>
                          <p className="mt-1 opacity-90 leading-relaxed">
                            Focused entirely on immediate job-placement skillsets. Takes between 1 to 2 years after 10th class, conferring the National Trade Certificate (NTC) or vocational state diplomas (e.g. DMLT). It is highly suited for students looking for fast employment pipelines.
                          </p>
                        </div>
                      </div>

                      {/* Scrollable Results Registry */}
                      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                        {ITI_VOCATIONAL_TRADES.filter(t => {
                          const query = itiSearch.toLowerCase();
                          return t.name.toLowerCase().includes(query) || 
                                 t.type.toLowerCase().includes(query) || 
                                 t.certification.toLowerCase().includes(query) || 
                                 t.description.toLowerCase().includes(query) || 
                                 t.careerPath.toLowerCase().includes(query);
                        }).map((t, idx) => (
                          <div key={idx} className="border-2 border-black bg-white dark:bg-zinc-900 p-4 transition-all hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border border-indigo-205 dark:border-indigo-900 px-2 py-0.5 rounded-sm uppercase font-bold">{t.type}</span>
                                <h4 className="text-base font-display font-black text-black dark:text-white mt-1.5">{t.name}</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold block text-gray-500">Duration: {t.duration}</span>
                                <span className="text-[9px] font-mono text-gray-450 dark:text-gray-400 font-medium block mt-0.5">{t.certification}</span>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-650 dark:text-gray-305 mb-3 leading-relaxed">{t.description}</p>

                            {/* Typical placement roles */}
                            <div className="bg-stone-50 dark:bg-zinc-805 border border-black p-2.5 rounded-sm">
                              <span className="text-[9px] uppercase font-black text-amber-700 dark:text-amber-500 block leading-none">Typical Job Roles:</span>
                              <p className="text-xs font-bold text-stone-850 dark:text-gray-205 mt-1">
                                {t.careerPath}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Horizontal Engagement Statistics Banner */}
                  <div id="horizontal-engagement-stats-bar" className="w-full border-2 border-black bg-white dark:bg-zinc-900 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl mt-8 transition-all">
                    <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-display font-black uppercase tracking-wider text-black dark:text-white">
                          {t('telemetry.header', 'Engagement Statistics Overview')}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">{t('telemetry.badge', 'DIRPA Ecosystem Telemetry')}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-zinc-800">
                      <div className="pt-2 sm:pt-0 sm:px-4 text-center sm:text-left flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-black tracking-wider text-stone-500 block mb-1">
                          {t('telemetry.activeStudents', 'Active Students')}
                        </span>
                        <span id="stat-active-students-banner" className="text-2xl md:text-3xl font-display font-black text-black dark:text-white">
                          {totalStudents}
                        </span>
                      </div>

                      <div className="pt-2 sm:pt-0 sm:px-4 text-center sm:text-left flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-black tracking-wider text-stone-500 block mb-1">
                          {t('telemetry.verifiedAlumni', 'Verified Alumni Mentors')}
                        </span>
                        <span id="stat-verified-alumni-banner" className="text-2xl md:text-3xl font-display font-black text-emerald-600 dark:text-emerald-400">
                          {totalAlumniMentors}
                        </span>
                      </div>

                      <div className="pt-2 sm:pt-0 sm:px-4 text-center sm:text-left flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-black tracking-wider text-stone-500 block mb-1">
                          {t('telemetry.contributedInsights', 'Contributed Insights')}
                        </span>
                        <span id="stat-insights-banner" className="text-2xl md:text-3xl font-display font-black text-purple-600 dark:text-purple-400">
                          {totalContributedInsights}
                        </span>
                      </div>

                      <div className="pt-2 sm:pt-0 sm:px-4 text-center sm:text-left flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-black tracking-wider text-stone-500 block mb-1">
                          {t('telemetry.mentorshipMessages', 'Mentorship Messages')}
                        </span>
                        <span id="stat-messages-banner" className="text-2xl md:text-3xl font-display font-black text-blue-600 dark:text-blue-400">
                          {chatThreads.reduce((sum, t) => sum + (t.messages || []).length, 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </div>

            {/* Right Sidebar - 1 Column (HOME PAGE ONLY) */}
            {!isComparing && searchMethod === 'none' && (
              <div className="space-y-8">

              {/* COMPLEMENTARY ROADMAP DUAL-PATH COMPARER */}
              <div id="compare-paths-sidebar-panel" className="border-2 border-black bg-white dark:bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-[#0F172A] dark:text-white transition-all">
                <div className="p-4 bg-orange-500 text-white border-b-2 border-black flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitCompare className="w-5 h-5 text-white" />
                    <span className="text-xs tracking-wider uppercase font-black font-display text-white">{t('compare.toolTitle', 'Compare Paths Tool')}</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Big prominent neo-brutalist button launchers */}
                  <button
                    onClick={() => {
                      setIsComparing(true);
                      setCompareTargetSlot('A');
                    }}
                    className="w-full py-3.5 px-4 border-2 border-black bg-orange-500 hover:bg-black hover:text-white dark:bg-orange-600 dark:hover:bg-white dark:hover:text-black text-white font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer duration-150"
                  >
                    <GitCompare className="w-4 h-4 animate-pulse" /> {t('compare.compareBtn', 'Compare Pathways')}
                  </button>

                  <p className="text-xs text-stone-500 dark:text-zinc-400 leading-normal">
                    {t('compare.toolDesc', 'Evaluate and analyze subjects, tuition offsets, semester modules, and graduation placements side-by-side.')}
                  </p>
                </div>
              </div>

              
            </div>
            )}

            {/* MORE OPTIONS... SECTION - FULL WIDTH ALIGNED TO RIGHT END OF COMPARE PATHS TOOL (HOME PAGE ONLY) */}
            {!isComparing && searchMethod === 'none' && (
              <div className="lg:col-span-3 w-full space-y-4" id="more-options-hub">
                <div className="border-2 border-black p-5 md:p-6 bg-slate-50/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-dashed border-stone-300 pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-display font-black uppercase text-stone-900">
                        More Options...
                      </h3>
                    </div>
                    
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
                    {/* 🤖 Card 1: AI Advisor */}
                    <div 
                      onClick={() => { setSelectedNav('ai-advisor'); setCurrentView('ai-advisor'); }}
                      className="border-2 border-black p-5 bg-white hover:bg-amber-50/40 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                      id="quick-access-ai-advisor"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300 uppercase tracking-widest">
                            01
                          </span>
                          <span className="text-2xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">🤖</span>
                        </div>

                        <h3 className="text-lg font-display font-black uppercase text-stone-900 tracking-tight">
                          AI Advisor
                        </h3>

                        <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2">
                          Click here to access AI Advisor to get insights from AI, personalized academic roadmaps, and career suggestions.
                        </p>
                      </div>

                      <div>
                        <div className="w-full border-t-2 border-dashed border-blue-400 my-3"></div>

                        <div className="flex items-center justify-between text-[11px] font-black uppercase text-blue-600 group-hover:translate-x-0.5 transition-transform">
                          <span className="flex items-center gap-1">
                            OPEN AI ADVISOR →
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* 💼 Card 2: Job Info */}
                    <div 
                      onClick={() => { setSelectedNav('onet-careers'); setCurrentView('onet-careers'); }}
                      className="border-2 border-black p-5 bg-white hover:bg-sky-50/40 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                      id="quick-access-job-info"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-mono font-black text-sky-800 bg-sky-100 px-2 py-0.5 border border-sky-300 uppercase tracking-widest">
                            02
                          </span>
                          <span className="text-2xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">💼</span>
                        </div>

                        <h3 className="text-lg font-display font-black uppercase text-stone-900 tracking-tight">
                          Job Info
                        </h3>

                        <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2">
                          Click here to access Job Info to explore career profiles, salary insights, and market demand for various professions.
                        </p>
                      </div>

                      <div>
                        <div className="w-full border-t-2 border-dashed border-blue-400 my-3"></div>

                        <div className="flex items-center justify-between text-[11px] font-black uppercase text-blue-600 group-hover:translate-x-0.5 transition-transform">
                          <span className="flex items-center gap-1">
                            OPEN JOB INFO →
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* 🔖 Card 3: Saved Paths */}
                    <div 
                      onClick={() => { setSelectedNav('saved'); setCurrentView('saved'); }}
                      className="border-2 border-black p-5 bg-white hover:bg-emerald-50/40 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                      id="quick-access-saved-paths"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300 uppercase tracking-widest">
                            03
                          </span>
                          <span className="text-2xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">🔖</span>
                        </div>

                        <h3 className="text-lg font-display font-black uppercase text-stone-900 tracking-tight">
                          Saved Paths
                        </h3>

                        <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2">
                          Click here to access Saved Paths to view your bookmarked course roadmaps, saved pathways, and custom timelines.
                        </p>
                      </div>

                      <div>
                        <div className="w-full border-t-2 border-dashed border-blue-400 my-3"></div>

                        <div className="flex items-center justify-between text-[11px] font-black uppercase text-blue-600 group-hover:translate-x-0.5 transition-transform">
                          <span className="flex items-center gap-1">
                            OPEN SAVED PATHS →
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* 📝 Card 4: Entrance Exams Info */}
                    <div 
                      onClick={() => { setSelectedNav('entrance-exams'); setCurrentView('entrance-exams'); }}
                      className="border-2 border-black p-5 bg-white hover:bg-purple-50/40 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                      id="quick-access-entrance-exams-info"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-mono font-black text-purple-800 bg-purple-100 px-2 py-0.5 border border-purple-300 uppercase tracking-widest">
                            04
                          </span>
                          <span className="text-2xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">📝</span>
                        </div>

                        <h3 className="text-lg font-display font-black uppercase text-stone-900 tracking-tight">
                          Entrance Exams Info
                        </h3>

                        <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2">
                          Click here to explore complete details, syllabus, expected dates, fees, required documents, career options, alumni reviews.
                        </p>
                      </div>

                      <div>
                        <div className="w-full border-t-2 border-dashed border-purple-400 my-3"></div>

                        <div className="flex items-center justify-between text-[11px] font-black uppercase text-purple-600 group-hover:translate-x-0.5 transition-transform">
                          <span className="flex items-center gap-1">
                            OPEN EXAMS INFO →
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* 🎓 Card 5: Scholarships */}
                    <div 
                      onClick={() => { setSelectedNav('scholarships'); setCurrentView('scholarships'); }}
                      className="border-2 border-black p-5 bg-white hover:bg-emerald-50/40 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                      id="quick-access-scholarships"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300 uppercase tracking-widest">
                            05
                          </span>
                          <span className="text-2xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">🎓</span>
                        </div>

                        <h3 className="text-lg font-display font-black uppercase text-stone-900 tracking-tight">
                          Scholarships
                        </h3>

                        <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2">
                          Discover government & university scholarships tailored to your education level, income eligibility, and academic profile.
                        </p>
                      </div>

                      <div>
                        <div className="w-full border-t-2 border-dashed border-emerald-400 my-3"></div>

                        <div className="flex items-center justify-between text-[11px] font-black uppercase text-emerald-900 group-hover:translate-x-0.5 transition-transform">
                          <span className="flex items-center gap-1">
                            EXPLORE SCHOLARSHIPS →
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-900" />
                        </div>
                      </div>
                    </div>

                    {/* 🏢 Card 6: Companies */}
                    <div 
                      onClick={() => { setSelectedNav('companies'); setCurrentView('companies'); }}
                      className="border-2 border-black p-5 bg-white hover:bg-amber-50/40 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                      id="quick-access-companies"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-mono font-black text-amber-900 bg-amber-200 px-2 py-0.5 border border-amber-400 uppercase tracking-widest">
                            06
                          </span>
                          <div className="p-1 border border-black bg-stone-50 group-hover:bg-amber-100 transition-colors">
                            <Building2 className="w-5 h-5 text-stone-800 group-hover:text-amber-700 transition-colors" />
                          </div>
                        </div>

                        <h3 className="text-lg font-display font-black uppercase text-stone-900 tracking-tight">
                          Companies
                        </h3>

                        <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2">
                          Search top hiring companies, corporate & engineering roles, CTC salary ranges, hiring rounds, and authentic alumni feedback.
                        </p>
                      </div>

                      <div>
                        <div className="w-full border-t-2 border-dashed border-amber-400 my-3"></div>

                        <div className="flex items-center justify-between text-[11px] font-black uppercase text-amber-900 group-hover:translate-x-0.5 transition-transform">
                          <span className="flex items-center gap-1">
                            OPEN COMPANIES →
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-900" />
                        </div>
                      </div>
                    </div>

                    {/* 📚 Card 7: STUFF - Student-Powered Learning Discovery */}
                    <div 
                      onClick={() => { setSelectedNav('stuff'); setCurrentView('stuff'); }}
                      className="border-2 border-black p-5 bg-white hover:bg-amber-100/40 transition-all cursor-pointer relative group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                      id="quick-access-stuff"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-mono font-black text-amber-950 bg-amber-300 px-2 py-0.5 border border-black uppercase tracking-widest shadow-[1px_1px_0px_0px_#000]">
                            07 • NEW
                          </span>
                          <div className="p-1 border border-black bg-stone-50 group-hover:bg-amber-200 transition-colors">
                            <Sparkles className="w-5 h-5 text-stone-800 group-hover:text-amber-900 transition-colors" />
                          </div>
                        </div>

                        <h3 className="text-lg font-display font-black uppercase text-stone-900 tracking-tight">
                          STUFF • Learning Resources
                        </h3>

                        <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2">
                          Student-powered learning discovery. Search any subject or topic to find the best videos, tutorials, docs, and practice platforms ranked by real DIRPA students.
                        </p>
                      </div>

                      <div>
                        <div className="w-full border-t-2 border-dashed border-amber-400 my-3"></div>

                        <div className="flex items-center justify-between text-[11px] font-black uppercase text-amber-950 group-hover:translate-x-0.5 transition-transform">
                          <span className="flex items-center gap-1 font-mono">
                            EXPLORE STUFF →
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-950" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        )}

        {/* NEW STANDALONE DETAILED PATHWAY PAGE VIEW */}
        {user && currentView === 'dashboard' && selectedPathway && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-6 py-6 md:py-10 space-y-6"
          >
            {isGradFunnelActive ? (
              <div className="space-y-6">
                {selectedJobDetail ? (
                  /* LEVEL D: Specific Job Details & Work Media Visuals */
                  <div className="space-y-6">
                    {/* Back to Specialization button */}
                    <div className="flex justify-start mb-2 animate-fade-in">
                      <button 
                        onClick={() => setSelectedJobDetail(null)}
                        className="px-6 py-3 bg-[#0F172A] text-white hover:bg-black border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                      >
                        ← Back to {selectedSpecCourse?.name || 'Specialization Details'}
                      </button>
                    </div>

                    <div className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-fade-in">
                      {/* Standalone 100% full-screen title panel */}
                      <div className="bg-black text-white p-6 md:p-8 border-b-2 border-black text-left">
                        <span className="text-[10px] uppercase font-bold text-yellow-300 font-mono tracking-widest block mb-1">
                          Graduate Career Path // Reality Grounding Portal
                        </span>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h2 className="text-3xl md:text-4xl font-display font-black uppercase text-yellow-400">
                              💼 {selectedJobDetail.title}
                            </h2>
                            <p className="text-xs text-neutral-300 mt-2 font-mono font-bold uppercase tracking-wider">
                              Day in the Life, Practical Salaries, Practitioner Feedbacks, and Visual Media Simulation
                            </p>
                          </div>
                          <span className="bg-[#8B5CF6] text-white text-xs font-mono font-bold border border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide">
                            Career Profile Active
                          </span>
                        </div>
                      </div>

                      {/* 100% Width Immersive Grid Core details */}
                      <div className="p-6 md:p-8 space-y-8 text-left bg-stone-50">
                        {/* Summary & Core Desc card */}
                        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                          <h3 className="text-lg font-display font-black uppercase border-b-2 border-dashed border-stone-200 pb-2 text-black flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" /> Executive Role Summary
                          </h3>
                          <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
                            {selectedJobDetail.description}
                          </p>
                        </div>

                        {/* Salary Matrix - Highly scannable breakout metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-emerald-50 border-2 border-emerald-900 p-5 shadow-[4px_4px_0px_0px_#064e3b] relative overflow-hidden">
                            <span className="absolute -right-3 -top-3 text-7xl text-emerald-800/10 font-black font-display">$</span>
                            <span className="text-[9.5px] font-mono font-bold text-emerald-800 uppercase block tracking-wider">// Entry-Level Associate (0-2 Yrs)</span>
                            <h4 className="text-2xl font-display font-black text-emerald-950 mt-1 uppercase tracking-tight">
                              {selectedJobDetail.entryLevelSalary}
                            </h4>
                            <p className="text-[11px] font-mono text-emerald-800/80 mt-2 font-semibold">Typical compensation directly after college placement.</p>
                          </div>

                          <div className="bg-yellow-50 border-2 border-yellow-900 p-5 shadow-[4px_4px_0px_0px_#713f12] relative overflow-hidden">
                            <span className="absolute -right-3 -top-3 text-7xl text-yellow-800/10 font-black font-display">★</span>
                            <span className="text-[9.5px] font-mono font-bold text-yellow-800 uppercase block tracking-wider">// Industry Core Average (Mid-Career 3-6 Yrs)</span>
                            <h4 className="text-2xl font-display font-black text-yellow-950 mt-1 uppercase tracking-tight">
                              {selectedJobDetail.salaryRange}
                            </h4>
                            <p className="text-[11px] font-mono text-yellow-800/80 mt-2 font-semibold">Standard mid-level operations payroll, excluding performance variables.</p>
                          </div>

                          <div className="bg-purple-50 border-2 border-purple-900 p-5 shadow-[4px_4px_0px_0px_#581c87] relative overflow-hidden">
                            <span className="absolute -right-2 -top-2 text-6xl text-purple-800/10 font-black font-display">✨</span>
                            <span className="text-[9.5px] font-mono font-bold text-purple-900 uppercase block tracking-wider">// Senior Lead / Systems Architect (7-12+ Yrs)</span>
                            <h4 className="text-2xl font-display font-black text-purple-950 mt-1 uppercase tracking-tight">
                              {selectedJobDetail.seniorLevelSalary}
                            </h4>
                            <p className="text-[11px] font-mono text-purple-900/80 mt-2 font-semibold">Senior executive bracket, focusing on heavy team and system control.</p>
                          </div>
                        </div>

                        {/* Day in the Life Timeline & comparative Pros/Cons */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          {/* Day in Life - 7 cols */}
                          <div className="lg:col-span-7 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                            <h3 className="text-lg font-display font-black uppercase text-black flex items-center gap-2 border-b-2 border-dashed border-stone-200 pb-2">
                              <Clock className="w-5 h-5 text-purple-600" /> 🕒 Day in the Life (Typical Work Schedule)
                            </h3>
                            <p className="text-xs text-neutral-550 font-medium italic font-mono uppercase text-gray-500">
                              // Read this checklist of hourly routines to understand the actual daily operations.
                            </p>
                            <div className="space-y-4 mt-4 relative pl-2">
                              {selectedJobDetail.dayInLife.map((step, sIdx) => {
                                const parts = step.split(" - ");
                                const time = parts[0];
                                const desc = parts.slice(1).join(" - ");
                                return (
                                  <div key={sIdx} className="flex gap-4 items-start relative">
                                    <div className="w-[24px] h-[24px] rounded-full border-2 border-black bg-yellow-300 text-[10px] font-black font-mono flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-10 shrink-0 mt-0.5">
                                      {sIdx + 1}
                                    </div>
                                    <div className="bg-stone-50 border-2 border-black/10 p-3 rounded-sm flex-1 text-xs">
                                      <span className="font-mono font-black text-purple-800 bg-purple-100 text-[10px] px-2 py-0.5 border border-purple-250 mb-1 inline-block uppercase tracking-wide">
                                        ⏱ {time}
                                      </span>
                                      <p className="text-stone-700 font-semibold mt-1 leading-relaxed">
                                        {desc}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Skills Checklist & Pros/Cons - 5 cols */}
                          <div className="lg:col-span-5 space-y-6">
                            {/* Technical Skills Required */}
                            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                              <h3 className="text-base font-display font-black uppercase text-black flex items-center gap-2 border-b-2 border-dashed border-stone-200 pb-2">
                                <Briefcase className="w-5 h-5 text-emerald-600" /> Required Skill Inventory
                              </h3>
                              <p className="text-xs text-neutral-500 font-mono font-semibold">// Key tools you will use every day:</p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {selectedJobDetail.skillsRequired.map((skill) => (
                                  <span key={skill} className="text-xs font-mono font-black uppercase tracking-wide bg-stone-100 border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    🛠 {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Pros / Cons list */}
                            <div className="bg-white border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <div className="bg-neutral-900 text-white font-mono uppercase font-bold text-[10px] p-3 border-b-2 border-black flex items-center gap-2">
                                <ArrowLeftRight className="w-4 h-4 text-yellow-300" /> Career Reality Check
                              </div>
                              <div className="grid grid-cols-1 divide-y divide-black text-xs">
                                <div className="p-4 bg-emerald-50/40 text-emerald-950">
                                  <span className="font-mono font-black text-emerald-800 block mb-2 uppercase tracking-wide">👍 THE ADVANTAGES (PROS):</span>
                                  <ul className="space-y-1.5">
                                    {selectedJobDetail.pros.map((pro, i) => (
                                      <li key={i} className="flex items-start gap-1.5 font-semibold text-emerald-900">
                                        <span className="text-emerald-700 font-extrabold">[✔]</span> {pro}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="p-4 bg-rose-50/40 text-rose-950">
                                  <span className="font-mono font-black text-rose-800 block mb-2 uppercase tracking-wide">⚠️ THE DRAWBACKS (CONS):</span>
                                  <ul className="space-y-1.5">
                                    {selectedJobDetail.cons.map((con, i) => (
                                      <li key={i} className="flex items-start gap-1.5 font-semibold text-rose-900">
                                        <span className="text-rose-700 font-bold">[⚠]</span> {con}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* VIDEOS AND IMAGES GALLERY OF THE JOB - STUDENT VISUAL EMPOWERMENT */}
                        <div className="border-2 border-black bg-stone-900 text-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
                          <div className="border-b border-white/10 pb-4 text-left">
                            <span className="text-[10px] uppercase font-bold text-cyan-300 font-mono tracking-widest block mb-1">
                              // STUDENT VISUAL LEARNING STATION
                            </span>
                            <h3 className="text-2xl font-display font-black uppercase text-white flex items-center gap-2">
                              📸 Active Workplace Media Logs
                            </h3>
                            <p className="text-xs text-stone-400 mt-1 font-mono uppercase tracking-wide">
                              Explore actual physical workspace illustrations and guided videos of what they do, so you can know the job realities.
                            </p>
                          </div>

                          {/* Split: Left is Images, Right is Video Preview */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                            {/* Images Subsection */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-mono font-black uppercase text-cyan-300 border-b border-stone-800 pb-2 flex items-center gap-2">
                                🖼 WORKSPACE WORKFLOW CAPTURES
                              </h4>
                              <div className="grid grid-cols-1 gap-4">
                                {selectedJobDetail.images.map((img, iIdx) => (
                                  <div key={iIdx} className="border border-white/10 bg-black overflow-hidden shadow-lg group">
                                    <div className="relative aspect-video w-full overflow-hidden">
                                      <img 
                                        src={img.url} 
                                        alt={img.caption}
                                        referrerPolicy="no-referrer"
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                                      />
                                      <span className="absolute left-2 bottom-2 bg-black/85 backdrop-blur-sm border border-white/10 rounded-sm text-[8px] font-mono tracking-wider text-cyan-300 uppercase font-black px-2 py-0.5">
                                        Slide {iIdx + 1}
                                      </span>
                                    </div>
                                    <div className="p-3.5 space-y-2 bg-stone-950">
                                      <p className="text-xs text-stone-200 font-semibold leading-relaxed">
                                        {img.caption}
                                      </p>
                                      <div className="border-t border-dashed border-stone-800 pt-2">
                                        <span className="text-[8.5px] uppercase font-mono font-bold text-stone-400">// Tasks illustrated in this image:</span>
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                          {img.tasksIllustrated.map((task) => (
                                            <span key={task} className="text-[9px] font-mono font-medium text-stone-300 bg-stone-900 border border-white/5 px-2 py-0.5 rounded-sm">
                                              ● {task}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Videos Subsection */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-mono font-black uppercase text-cyan-300 border-b border-stone-800 pb-2 flex items-center gap-2">
                                📹 GUIDED PRACTITIONAL FILM
                              </h4>
                              {selectedJobDetail.videos.map((vid, vIdx) => (
                                <div key={vIdx} className="border border-white/10 bg-black overflow-hidden shadow-lg">
                                  <div className="relative aspect-video w-full bg-stone-950 overflow-hidden group flex items-center justify-center">
                                    <img 
                                      src={vid.thumbnailUrl} 
                                      alt={vid.title}
                                      referrerPolicy="no-referrer"
                                      className="absolute inset-0 object-cover w-full h-full opacity-40 group-hover:scale-105 transition-all duration-500"
                                    />
                                    {/* Simulated play overlay */}
                                    <div className="absolute z-10 w-[54px] h-[54px] rounded-full border-2 border-cyan-400 bg-cyan-950/80 group-hover:bg-cyan-500 hover:scale-110 flex items-center justify-center cursor-pointer shadow-[0_0_12px_#06b6d4] transition-all duration-305">
                                      <span className="text-white text-base font-serif pl-1">▶</span>
                                    </div>
                                    <span className="absolute right-2 bottom-2 bg-black text-[9px] font-mono border border-white/15 px-2 py-1 rounded-sm text-stone-400">
                                      🕒 {vid.duration}
                                    </span>
                                    <span className="absolute left-2 top-2 bg-stone-900/95 text-[8.5px] font-mono border border-white/15 px-2 py-0.5 rounded-sm text-cyan-300 font-bold uppercase tracking-wide">
                                      Channel: {vid.channel}
                                    </span>
                                  </div>
                                  
                                  <div className="p-4 space-y-3 bg-stone-950">
                                    <div>
                                      <h5 className="text-sm font-display font-black uppercase leading-tight text-white mb-1">
                                        {vid.title}
                                      </h5>
                                      <p className="text-xs text-stone-400 leading-relaxed">
                                        {vid.description}
                                      </p>
                                    </div>

                                    {/* Simulated Transcript Chapters */}
                                    <div className="border-t border-dashed border-stone-800 pt-3">
                                      <span className="text-[8.5px] uppercase font-mono font-black text-cyan-300 block mb-2 tracking-wide">// Video Chapters (Student Insights Breakdown):</span>
                                      <div className="space-y-1.5">
                                        {vid.simulationDetails.map((vStep, vsIdx) => (
                                          <div key={vsIdx} className="flex gap-2 items-center text-xs bg-stone-900/40 p-2 border border-stone-850">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                            <p className="text-stone-300 font-mono text-[10px] leading-tight">
                                              {vStep}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Practitioners Professional Feedback */}
                        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                          <h3 className="text-lg font-display font-black uppercase text-black flex items-center gap-2 border-b-2 border-dashed border-stone-200 pb-2">
                            <ThumbsUp className="w-5 h-5 text-indigo-600" /> 🗣️ Job Role Feedbacks (Reviews from actual practitioners)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedJobDetail.feedback.map((f, fIdx) => (
                              <div key={fIdx} className="bg-stone-50 border-2 border-black p-4 text-xs font-semibold space-y-3 flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-2">
                                    <div 
                                      onClick={() => setSelectedAlumni({
                                        id: `practitioner_${f.user.toLowerCase().replace(/\s+/g, '_')}`,
                                        name: f.user,
                                        avatar: "👨‍💼",
                                        role: `Software Employee at ${f.company}`,
                                        yearCompleted: "2023",
                                        institution: f.company,
                                        advice: "Keep refining your algorithmic logic and study previous question papers. Practical knowledge is indispensable.",
                                        experience: f.experience || "Senior Developer advising students on curriculum planning and career paths.",
                                        rating: 5,
                                        likes: 5,
                                        timeline: []
                                      })}
                                      className="cursor-pointer hover:opacity-85 group text-left"
                                      title="Click to view practitioner profile timeline"
                                    >
                                      <span className="font-mono font-black text-sm text-black block group-hover:underline group-hover:text-blue-700">{f.user} ➔</span>
                                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block mt-0.5">Verified practitioner at {f.company}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                      <span className="bg-[#8B5CF6] text-white font-mono text-[8.5px] font-black px-1.5 py-0.5 border border-[#7c3aed]">
                                        ★ Job Satisfaction: {f.satisfaction}/5.0
                                      </span>
                                      <span className="bg-cyan-100 text-cyan-950 border border-cyan-200 font-mono text-[8.5px] font-black px-1.5 py-0.5">
                                        🕒 Work-Life Balance: {f.workLifeBalance}/5.0
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-neutral-600 leading-relaxed pt-2 border-t border-dashed border-stone-200 font-semibold italic">
                                    "{f.experience}"
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedSpecCourse ? (
                  /* LEVEL C: Specialization Details, Course Feedbacks, Information about jobs */
                  <div className="space-y-6">
                    {/* Back to courses list */}
                    <div className="flex justify-start mb-2 animate-fade-in">
                      <button 
                        onClick={() => setSelectedSpecCourse(null)}
                        className="px-6 py-3 bg-[#0F172A] text-white hover:bg-black border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                      >
                        ← Back to branches of {selectedGraduationDegree?.name}
                      </button>
                    </div>

                    <div className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-fade-in">
                      {/* Course / Branch Header panel */}
                      <div className="bg-black text-white p-6 md:p-8 border-b-2 border-black text-left">
                        <span className="text-[10px] uppercase font-bold text-yellow-300 font-mono tracking-widest block mb-1">
                          Degree Focus Branch // Syllabus and People Feedbacks
                        </span>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h2 className="text-3xl md:text-4xl font-display font-black uppercase text-yellow-400 animate-fade-in">
                              🎓 {selectedSpecCourse.name} ({selectedSpecCourse.code})
                            </h2>
                            <p className="text-xs text-neutral-300 mt-2 font-mono font-bold uppercase tracking-wider max-w-3xl">
                              {selectedSpecCourse.description}
                            </p>
                          </div>
                          <span className="bg-[#8B5CF6] text-white text-[11px] font-mono font-black border border-black px-2.5 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                            🕒 {selectedSpecCourse.duration} Program
                          </span>
                        </div>
                      </div>

                      {/* Workspace Split */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black bg-stone-50">
                        {/* Left column - Specs & Student Reviews */}
                        <div className="lg:col-span-5 p-6 md:p-8 space-y-6 text-left">
                          {/* Course specs card */}
                          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                            <h3 className="text-base font-display font-black uppercase text-black border-b border-stone-200 pb-2 flex items-center gap-1.5">
                              📋 Course Academics Spec
                            </h3>
                            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                              <div className="bg-stone-50 p-2.5 border border-stone-200">
                                <span className="font-bold text-stone-550 block uppercase text-[8.5px] tracking-wider">DURATION</span>
                                <strong className="text-black text-sm">{selectedSpecCourse.duration}</strong>
                              </div>
                              <div className="bg-stone-50 p-2.5 border border-stone-200">
                                <span className="font-bold text-stone-550 block uppercase text-[8.5px] tracking-wider">COMPLEXITY DIFFICULTY</span>
                                <strong className="text-purple-600 font-extrabold text-sm uppercase">{selectedSpecCourse.difficulty}</strong>
                              </div>
                            </div>

                            <div className="space-y-2 pt-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Key Focus Academics Subjects:</span>
                              <div className="space-y-1.5 text-xs text-stone-700 font-semibold pl-1.5">
                                {selectedSpecCourse.keyFocusAreas.map((area, index) => (
                                  <div key={index} className="flex gap-2 items-center">
                                    <span className="text-purple-600 font-black">[✔]</span>
                                    <span>{area}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Course Feedback gave by the people */}
                          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                            <h3 className="text-base font-display font-black uppercase text-black border-b border-stone-200 pb-2 flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4 text-purple-600" /> Member Feedback (Course Insights)
                            </h3>
                            <p className="text-xs text-neutral-500 font-mono italic">Verified alumni and graduate feedbacks on the syllabus & pathway:</p>
                            
                            <div className="space-y-4">
                              {(() => {
                                if (feedbackLoading) {
                                  return <CommentSkeletonList count={2} />;
                                }
                                const matchedFeedbacks = dbFeedbacks.filter(f => isCourseIdEquivalent(f.courseId, selectedSpecCourse.id) || isCourseIdEquivalent(f.courseId, selectedSpecCourse.code));
                                if (matchedFeedbacks.length === 0) {
                                  return (
                                    <div className="text-center py-8">
                                      <span className="text-[10px] font-mono text-stone-400">No database insights submitted for this branch yet.</span>
                                    </div>
                                  );
                                }
                                return matchedFeedbacks.map((alumni, idx) => {
                                  const isAuthor = user && (user.id === alumni.userId || user.email === alumni.userId || alumni.id === user.id || (user as any).role === 'admin' || alumni.userId === "anonymous_alumni");
                                  const isEditing = editingFeedbackId === (alumni.feedbackId || alumni.id);
                                  return (
                                    <div 
                                      key={`${alumni.feedbackId || alumni.id || ""}_${idx}`} 
                                      onClick={() => {
                                        if (!isEditing) {
                                          setSelectedAlumni(alumni);
                                        }
                                      }}
                                      className="bg-stone-50 border-2 border-black/10 p-3.5 space-y-3 text-xs font-semibold cursor-pointer hover:border-black/50 hover:bg-stone-100 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all select-none group"
                                      title="Click to view full career journey timeline and advisor profile"
                                    >
                                      <div className="flex justify-between items-center gap-2">
                                        <div className="flex items-center gap-2">
                                          {(() => {
                                            const isAuthor = user && (user.id === alumni.userId || user.email === alumni.userId || user.email === alumni.authorEmail || user.email === alumni.userEmail || (user.name && alumni.name && alumni.name.toLowerCase() === user.name.toLowerCase()));
                                            const avatarVal = isAuthor && user?.avatar ? user.avatar : alumni.avatar;
                                            return <AvatarDisplay avatar={avatarVal} name={alumni.name || 'Alumni'} className="w-7 h-7 rounded-full bg-indigo-50 border border-black flex items-center justify-center shrink-0" />;
                                          })()}
                                          <div>
                                            <span className="font-extrabold text-stone-900 block text-[11px] leading-none mb-0.5 group-hover:text-blue-700 transition-colors">
                                              {alumni.name || 'Verified Alumni'}
                                            </span>
                                            <span className="text-[9px] text-gray-400 font-mono leading-none">Completed in {alumni.completionYear} • {alumni.institutionName}</span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded shrink-0">
                                          <span className="text-amber-600 font-mono text-[9px] font-black">★ {(alumni.overallRating || alumni.rating || 5).toFixed(1)}</span>
                                        </div>
                                      </div>
                                      
                                      {isEditing ? (
                                        <div className="space-y-2 mt-2 select-text" onClick={(e) => e.stopPropagation()}>
                                          <textarea
                                            value={editingFeedbackText}
                                            onChange={(e) => setEditingFeedbackText(e.target.value)}
                                            className="w-full border-2 border-black p-2 text-xs font-semibold bg-white text-black"
                                            rows={3}
                                            required
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={(e) => handleSaveEditedFeedback(alumni, e)}
                                              className="px-3 py-1 text-[10px] uppercase font-mono font-black border border-black bg-emerald-400 hover:bg-emerald-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingFeedbackId(null);
                                              }}
                                              className="px-3 py-1 text-[10px] uppercase font-mono font-black border border-black bg-stone-200 hover:bg-stone-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-neutral-600 leading-relaxed font-semibold italic">
                                          "{alumni.feedbackText || alumni.experience}"
                                        </p>
                                      )}

                                      <div className="flex justify-between items-center pt-2 border-t border-dashed border-stone-200 mt-1">
                                        <span className="text-[9.5px] text-blue-600 font-display font-black uppercase tracking-wider flex items-center gap-1">
                                          💬 View Full Journey & Career Advice ➔
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {isAuthor && !isEditing && (
                                            <div className="flex items-center gap-1.5 shrink-0 mr-2" onClick={(e) => e.stopPropagation()}>
                                              <button
                                                onClick={(e) => handleStartEditFeedback(alumni, e)}
                                                className="px-2 py-0.5 text-[8px] font-mono font-bold border border-black bg-white text-black uppercase hover:bg-yellow-250 cursor-pointer"
                                                title="Edit feedback content"
                                              >
                                                Edit
                                              </button>
                                              {feedbackIdBeingDeleted === (alumni.feedbackId || alumni.id) ? (
                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                  <button
                                                    onClick={(e) => {
                                                      handleDeleteFeedback(alumni, e);
                                                      setFeedbackIdBeingDeleted(null);
                                                    }}
                                                    className="px-1.5 py-0.5 text-[7.5px] font-mono font-bold border border-black bg-red-600 text-white uppercase hover:bg-red-700 cursor-pointer"
                                                    title="Confirm deletion"
                                                  >
                                                    Yes
                                                  </button>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setFeedbackIdBeingDeleted(null);
                                                    }}
                                                    className="px-1.5 py-0.5 text-[7.5px] font-mono font-bold border border-black bg-white text-black uppercase hover:bg-stone-250 cursor-pointer"
                                                    title="Cancel deletion"
                                                  >
                                                    No
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFeedbackIdBeingDeleted(alumni.feedbackId || alumni.id);
                                                  }}
                                                  className="px-2 py-0.5 text-[8px] font-mono font-bold border border-black bg-red-100 text-red-600 uppercase hover:bg-red-200 cursor-pointer"
                                                  title="Delete feedback entry"
                                                >
                                                  Delete
                                                </button>
                                              )}
                                            </div>
                                          )}
                                          <span className="text-[8.5px] text-stone-400 font-mono font-medium">Verified Alumni</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>

                            {/* Inline Alumni Feedback Form */}
                            {user?.role === 'alumni' && (
                              <div className="mt-6 border-t-2 border-black/15 pt-5 space-y-3">
                                <span className="text-[9.5px] font-mono font-black text-[#8B5CF6] uppercase block tracking-wider">alumni rapid insight desk</span>
                                <h4 className="text-xs font-black uppercase text-black">Submit Your Feedback for {selectedSpecCourse.name}</h4>
                                <p className="text-[10px] text-gray-400 font-mono italic">Your insight will be saved directly and linked to this specific course.</p>
                                
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-[8px] font-black uppercase text-gray-400 mb-1">Overall Rating *</label>
                                    <select 
                                      value={inlineRating}
                                      onChange={(e) => setInlineRating(parseInt(e.target.value))}
                                      className="border border-black px-2 py-1 text-xs font-bold bg-white text-black border-2"
                                    >
                                      <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                                      <option value="4">⭐⭐⭐⭐ (Good)</option>
                                      <option value="3">⭐⭐⭐ (Average)</option>
                                      <option value="2">⭐⭐ (Tough)</option>
                                      <option value="1">⭐ (Poor)</option>
                                    </select>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-[8px] font-black uppercase text-gray-400 mb-1">Your Comment / Course Experience *</label>
                                    <textarea 
                                      placeholder="Explain coursework, difficulty, campus readiness, or personal experiences..."
                                      rows={3}
                                      value={inlineFeedback}
                                      onChange={(e) => setInlineFeedback(e.target.value)}
                                      className="w-full border-2 border-black p-2 text-xs bg-white text-black font-semibold focus:outline-none"
                                      required
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-[8px] font-black uppercase text-gray-400 mb-1">Survival Advice Quote (Optional)</label>
                                    <input 
                                      type="text"
                                      value={inlineAdvice}
                                      onChange={(e) => setInlineAdvice(e.target.value)}
                                      placeholder="e.g., Focus heavily on hands-on coding from day 1!"
                                      className="w-full border-2 border-black p-2 text-xs bg-white text-black font-semibold focus:outline-none"
                                    />
                                  </div>
                                  
                                  <button 
                                    type="button"
                                    disabled={isSubmittingFeedback}
                                    onClick={() => handlePublishInlineFeedback(
                                      selectedSpecCourse.id || selectedSpecCourse.code,
                                      selectedSpecCourse.name,
                                      'Graduation'
                                    )}
                                    className="w-full py-2.5 bg-[#8B5CF6] hover:bg-purple-700 hover:text-white transition-all text-white border-2 border-black tracking-widest text-[10px] font-black uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isSubmittingFeedback ? 'Publishing...' : 'Publish Course Comment'}
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>

                        {/* Right column - Direct jobs map */}
                        <div className="lg:col-span-7 p-6 md:p-8 space-y-6 text-left">
                          <div className="bg-amber-50 border-2 border-black p-4 text-black text-xs space-y-1 rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span className="font-mono font-bold block uppercase mb-1 text-amber-800">💻 LINKED CAREERS TRACKER</span>
                            <p className="text-stone-700 font-semibold leading-relaxed">
                              Below is the information about the jobs you can get upon completing this course. Click on any job role to open a full 100% layout details containing exact pay structures, feedbacks and work illustrations!
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-xs font-mono font-black uppercase text-neutral-500 tracking-wider">
                              💼 JOBS YOU WILL GET FROM THIS STUDY FIELD:
                            </h3>

                            {selectedSpecCourse.jobs.map((job) => (
                              <div 
                                key={job.id}
                                onClick={() => setSelectedJobDetail(job)}
                                className="cursor-pointer bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all hover:bg-stone-50 text-left space-y-4 relative flex flex-col justify-between"
                              >
                                <div className="space-y-2">
                                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-2">
                                    <h4 className="font-display font-black text-base uppercase tracking-tight text-purple-950">
                                      💼 {job.title}
                                    </h4>
                                    <span className="bg-emerald-100 text-emerald-950 text-[9.5px] font-mono font-black border border-emerald-300 px-2 py-0.5 rounded-sm">
                                      Avg Pay: {job.salaryRange.split(" per")[0]}
                                    </span>
                                  </div>
                                  <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                                    {job.description}
                                  </p>
                                </div>

                                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-dashed border-stone-100">
                                  {job.skillsRequired.slice(0, 3).map((sk) => (
                                    <span key={sk} className="text-[9.5px] font-mono font-bold bg-stone-105 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-sm">
                                      🛠 {sk}
                                    </span>
                                  ))}
                                  {job.skillsRequired.length > 3 && (
                                    <span className="text-[9px] font-mono font-bold text-stone-400">+{job.skillsRequired.length - 3} more</span>
                                  )}
                                </div>

                                <div className="mt-2 bg-[#8B5CF6]/10 text-[#6d28d9] border border-[#8B5CF6]/20 font-display font-black text-xs uppercase tracking-wider p-2.5 text-center hover:bg-[#8B5CF6]/20 transition-all">
                                  Explore Job Salary, Day Routine & Media Walkthroughs ➔
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedGraduationDegree ? (
                  /* LEVEL B: Specialization Branches list inside selected Degree */
                  <div className="space-y-6 animate-fade-in">
                    {/* Back to paths grid */}
                    <div className="flex flex-wrap gap-2.5 justify-start mb-2">
                      <button 
                        onClick={() => setSelectedGraduationDegree(null)}
                        className="px-6 py-3 bg-[#0F172A] text-white hover:bg-black border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                      >
                        ← Back to Eligible Graduation Degrees grid
                      </button>
                      
                    </div>

                    <div className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                      {/* Title panel */}
                      <div className="bg-black text-white p-6 md:p-8 border-b-2 border-black text-left">
                        <span className="text-[10px] uppercase font-bold text-yellow-300 font-mono tracking-widest block mb-1">
                          Graduate Course Focus - Specialization Finder
                        </span>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h2 className="text-3xl md:text-4xl font-display font-black uppercase text-white animate-fade-in">
                              🎓 Specializations of {selectedGraduationDegree.name}
                            </h2>
                            <p className="text-xs text-neutral-400 mt-2 font-mono font-bold uppercase tracking-wider">
                              Explore sub-courses, verified feedbacks, study details, and direct career simulation pathways.
                            </p>
                          </div>
                          <span className="bg-[#8B5CF6] text-white text-xs font-mono font-bold border border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {selectedGraduationDegree.duration} Programme
                          </span>
                        </div>
                      </div>

                      {/* Split list */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black bg-stone-50">
                        {/* Branches List */}
                        <div className="lg:col-span-8 p-6 md:p-8 space-y-6 text-left">
                          <div className="bg-emerald-50 border-2 border-black p-4 text-black text-xs rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span className="font-mono font-bold block uppercase mb-1 text-emerald-800">SPECIALIZATION ROADMAPS AVAILABLE:</span>
                            Select a custom discipline below to review key academic subjects, student course feedback, and high payout salaries.
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(() => {
                              const list = DEGREE_SPECIALIZATION_MAP[selectedGraduationDegree.name] || getFallbackSpecializations(selectedGraduationDegree.name);
                              return list.map((course) => {
                                const avgRating = course.feedback.reduce((sum, item) => sum + item.rating, 0) / course.feedback.length;
                                return (
                                  <div
                                    key={course.id}
                                    onClick={() => setSelectedSpecCourse(course)}
                                    className="cursor-pointer bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none relative flex flex-col justify-between transition-all hover:bg-stone-50"
                                  >
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center gap-2">
                                        <span className="text-[9px] font-mono font-black border border-black bg-yellow-300 text-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                          🕒 {course.duration}
                                        </span>
                                        <span className={`text-[9.5px] font-mono font-bold border border-black/15 px-2 py-0.5 ${
                                          course.difficulty === 'Intense' ? 'bg-rose-100 text-rose-800' :
                                          course.difficulty === 'Hard' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                          Difficulty: {course.difficulty}
                                        </span>
                                      </div>
                                      
                                      <h4 className="font-display font-black uppercase text-base tracking-tight leading-tight text-purple-950">
                                        {course.name} ({course.code})
                                      </h4>
                                      <p className="text-xs leading-relaxed text-neutral-600 font-semibold line-clamp-3">
                                        {course.description}
                                      </p>
                                    </div>

                                    <div className="mt-5 border-t border-dashed border-stone-200 pt-4 space-y-3">
                                      <div>
                                        <span className="text-[8.5px] font-mono font-black block uppercase tracking-wider text-slate-500 mb-1">
                                          Focus subjects highlight:
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                          {course.keyFocusAreas.slice(0, 2).map((area, idx) => (
                                            <span key={idx} className="text-[9px] font-mono font-bold bg-stone-100 text-neutral-700 px-1.5 py-0.5 border border-black/10 rounded-sm">
                                              ● {area}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center text-xs border-t border-dashed border-stone-105 pt-2.5">
                                        <span className="text-yellow-605 font-mono font-bold text-[9.5px] flex items-center gap-1">
                                          ★ {avgRating.toFixed(1)} <span className="text-stone-400">({course.feedback.length} feedbacks)</span>
                                        </span>
                                        <span className="text-[9.5px] font-mono font-black text-[#8B5CF6] uppercase hover:underline">
                                          View Details & Jobs →
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>

                        {/* Right column (Flowchart overview) */}
                        <div className="lg:col-span-4 p-6 md:p-8 bg-amber-50/5 flex flex-col justify-between space-y-6 border-t-2 lg:border-t-0 border-black">
                          {renderFlowchart()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* LEVEL A: Eligible pathways grid (The original checklist) */
                  <div className="space-y-6 animate-fade-in">
                    {/* Top Back navigation */}
                    <div className="flex justify-start mb-2">
                      <button 
                        onClick={() => {
                          setIsGradFunnelActive(false);
                          setSelectedPathway(null);
                          setSelected12thStream(null);
                          setSelectedGraduationDegree(null);
                          setSelectedSpecCourse(null);
                          setSelectedJobDetail(null);
                        }}
                        className="px-6 py-3 bg-[#0F172A] text-white hover:bg-black border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                      >
                        ← Back to Stream / Group Selection
                      </button>
                    </div>

                    <div className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                      {/* Standalone 100% full-screen title panel */}
                      <div className="bg-black text-white p-6 md:p-8 border-b-2 border-black text-left">
                        <span className="text-[10px] uppercase font-bold text-yellow-300 font-mono tracking-widest block mb-1">
                          Graduation Path Funnel - Interactive Stream Link
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-black uppercase">
                          Eligible Graduation Pathways for {getStreamKey(selectedPathway.name) === 'MPC' ? 'MPC Standard' : getStreamKey(selectedPathway.name) === 'BiPC' ? 'BiPC Standard' : getStreamKey(selectedPathway.name) === 'MEC_CEC' ? 'CEC / MEC Accountancy' : getStreamKey(selectedPathway.name) === 'POLY' ? 'Polytechnic Engineering' : selectedPathway.name}
                        </h2>
                        <p className="text-xs text-neutral-400 mt-2 font-mono font-bold uppercase tracking-wider">
                          Select a graduation stream node on the left to reveal specialized branches, peer feedbacks, and explore target career media.
                        </p>
                      </div>

                      {/* 100% width workspace grid split */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black bg-white">
                        
                        {/* Left Workspace (Choices Grid - 8 cols) */}
                        <div className="lg:col-span-8 p-6 md:p-8 space-y-6 text-left">
                          <div className="bg-emerald-50 border-2 border-black p-4 text-black text-xs rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span className="font-mono font-bold block uppercase mb-1 text-emerald-800">ADVISOR ELIGIBILITY MAPPING RULE:</span>
                            These university courses are strictly verified and locked down based on your underlying foundation stream: <strong className="underline">{selectedPathway.name}</strong>.
                          </div>

                          {/* Highly scannable clean neo-brutalist grid of options */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(() => {
                              const sKey = getStreamKey(selectedPathway.name) || 'MPC';
                              const degrees = ELIGIBILITY_MATRIX[sKey] || [];
                              if (degrees.length === 0) {
                                return (
                                  <div className="md:col-span-2 text-center py-10 bg-stone-100 border-2 border-dashed border-black">
                                    <p className="text-xs uppercase font-mono font-black text-gray-400">No eligibility options coded for this stream.</p>
                                  </div>
                                );
                              }
                              return degrees.map((degree) => {
                                const isSelectedDegree = selectedGraduationDegree?.name === degree.name;
                                return (
                                  <div
                                    key={degree.name}
                                    onClick={() => setSelectedGraduationDegree(degree)}
                                    className={`cursor-pointer p-5 border-2 border-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none relative flex flex-col justify-between ${
                                      isSelectedDegree
                                        ? 'bg-[#8B5CF6] text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                        : 'bg-stone-50 hover:bg-stone-100 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                    }`}
                                  >
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center gap-2">
                                        <span className={`text-[9px] font-mono font-black border px-2 py-0.5 ${
                                          isSelectedDegree 
                                            ? 'bg-yellow-300 border-black text-black' 
                                            : 'bg-white border-black/10 text-gray-650'
                                        }`}>
                                          🕒 {degree.duration} PROGRAMME
                                        </span>
                                      </div>
                                      <h4 className="font-display font-black uppercase text-base tracking-tight leading-tight">
                                        {degree.name}
                                      </h4>
                                      <p className="text-xs leading-relaxed font-semibold text-neutral-600">
                                        {degree.description}
                                      </p>
                                    </div>

                                    <div className="mt-5 border-t border-dashed border-black/20 pt-4 space-y-3">
                                      <div>
                                        <span className="text-[8.5px] font-mono font-black block uppercase tracking-wider mb-2 text-slate-500">
                                          Target career job roles:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                          {degree.careers.map((career) => (
                                            <span
                                              key={career}
                                              className="text-[9.5px] font-mono font-black px-2 py-0.5 border bg-white border-black/10 text-neutral-750"
                                            >
                                              💼 {career}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="bg-[#8B5CF6] hover:bg-black text-white text-[10px] font-mono font-black uppercase tracking-wider border border-black p-2 text-center transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        Explore Focus Branches & Careers →
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>

                        {/* Right Workspace (Flowchart - 4 cols) */}
                        <div className="lg:col-span-4 p-6 md:p-8 bg-amber-50/5 flex flex-col justify-between space-y-6 border-t-2 lg:border-t-0 border-black">
                          {renderFlowchart()}
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top Back/Back navigation rail */}
                <div className="flex justify-start mb-2">
                  <button 
                    onClick={() => setSelectedPathway(null)}
                    className="px-6 py-3 bg-[#0F172A] text-white hover:bg-black border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  >
                    ← Back to Pathways Grid
                  </button>
                </div>

                <div className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  
                  {/* Top Bar Banner with dynamic metadata & actions */}
                  <div className="bg-black text-white p-6 md:p-8 border-b-2 border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-yellow-300 font-mono tracking-widest">
                        Selected Branch: {selectedPathway.level} Level - {selectedPathway.category}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-display font-black uppercase mt-1">
                        {selectedPathway.name}
                      </h2>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap md:flex-nowrap">
                      <button 
                        onClick={() => toggleSavePath(selectedPathway.id)}
                        className={`p-3 border-2 border-white text-xs font-bold uppercase transition-transform hover:scale-105 flex items-center ${savedPathIds.includes(selectedPathway.id) ? 'bg-yellow-300 text-black border-yellow-300 font-extrabold' : 'bg-transparent text-white'}`}
                        title="Save Pathways"
                      >
                        <Bookmark className="w-4 h-4 mr-1 fill-current" />
                        {savedPathIds.includes(selectedPathway.id) ? 'Bookmarked' : 'Save Path'}
                      </button>
                      <button 
                        onClick={() => setSelectedPathway(null)}
                        className="p-3 bg-red-600 border-2 border-black text-white text-xs font-black uppercase hover:bg-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* High-Visibility Graduation Trigger Banner */}
                  <div className="bg-amber-400 text-black p-5 border-b-2 border-black flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="bg-black text-white p-2 border border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                        STEP 03
                      </div>
                      <div>
                        <h3 className="font-display font-black uppercase text-sm md:text-base leading-tight">
                          Choose Your Collegiate Degree target
                        </h3>
                        <p className="text-[11px] font-bold text-zinc-950 leading-snug">
                          Your chosen pathway has high-compatibility degree avenues. Lock down your target graduation stream.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsGradFunnelActive(true)}
                      className="px-5 py-2.5 bg-black text-white hover:bg-neutral-900 font-extrabold font-display uppercase text-xs tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      Choose Your Graduation/Degree Track →
                    </button>
                  </div>

                  {/* Bento Grid: Left Facts Portions & Centre/Right Insights and Live Timeline Flowcharts */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-black bg-white">
                    
                    {/* Column 1: Academics Factsheet */}
                    <div className="p-6 md:p-8 space-y-6 text-left">
                      
                      {/* Duration & Eligibility details */}
                      <div className="border-2 border-black p-4 bg-zinc-50 text-black">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-3 font-mono">Duration & Eligibility</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border border-black p-3 bg-white">
                            <span className="text-[10px] uppercase font-bold tracking-tight text-zinc-700 font-mono">Duration</span>
                            <p className="text-sm font-black font-mono mt-1 text-black">{selectedPathway.duration}</p>
                          </div>
                          <div className="border border-black p-3 bg-white">
                            <span className="text-[10px] uppercase font-bold tracking-tight text-zinc-700 font-mono">Avg Fees</span>
                            <p className="text-sm font-black font-mono mt-1 text-black">{selectedPathway.estimatedFees}</p>
                          </div>
                        </div>
                        <div className="border border-black p-3 bg-white mt-3">
                          <span className="text-[10px] uppercase font-bold tracking-tight text-zinc-700 font-mono">Eligibility Criteria</span>
                          <p className="text-xs font-bold leading-relaxed mt-1 text-black">{selectedPathway.eligibility}</p>
                        </div>
                      </div>

                      {/* Highlighted Core Subjects */}
                      <div className="border-2 border-black p-4 bg-emerald-50/40 text-black">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-700 mb-3 font-mono">Highlighted Core Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPathway.subjects.map(subject => (
                            <span key={subject} className="text-xs font-bold px-3.5 py-1.5 bg-emerald-100/70 border border-black text-black">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Higher Education Pathways in Detail */}
                      <div className="border-2 border-black p-4 bg-amber-50/40 text-black">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-700 mb-2 font-mono">Higher Education Options</h4>
                        <ul className="space-y-1.5 text-xs">
                          {selectedPathway.higherEducationOptions.map((opt, i) => (
                            <li key={i} className="flex items-start gap-2 py-0.5">
                              <span className="text-amber-600 font-black shrink-0">▪</span> 
                              <span className="text-black font-bold">{opt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Rich descriptive summary layout */}
                      <div className="border-2 border-black bg-yellow-50 p-4 rounded text-black">
                        <h4 className="text-xs font-black uppercase mb-1.5 flex items-center gap-1.5 text-black">
                          <BookOpen className="w-4 h-4 text-black" /> Academic Overview
                        </h4>
                        <p className="text-xs text-zinc-950 font-semibold leading-relaxed font-sans">{selectedPathway.description}</p>
                      </div>

                    </div>

                    {/* Column 2: Alumni Insights & Discussion */}
                    <div className="p-6 md:p-8 bg-[#FAFAFA] flex flex-col justify-between text-left col-span-1">
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-black pb-3">
                          <h4 className="text-sm font-black uppercase tracking-tight text-black">
                            Alumni Insights ({dbFeedbacks.filter(f => isCourseIdEquivalent(f.courseId, selectedPathway.id)).length})
                          </h4>
                          <span className="text-[9px] font-mono bg-blue-100 text-blue-900 px-1.5 py-0.5 border border-black uppercase font-extrabold">Verified Mentors Only</span>
                        </div>

                        {feedbackLoading ? (
                          <CommentSkeletonList count={3} />
                        ) : dbFeedbacks.filter(f => isCourseIdEquivalent(f.courseId, selectedPathway.id)).length === 0 ? (
                          <div className="text-center py-12">
                            <GraduationCap className="w-12 h-12 stroke-1 text-zinc-400 mx-auto mb-2" />
                            <p className="text-xs text-black uppercase font-black tracking-widest">No alumni insights submitted yet.</p>
                            <p className="text-[10px] text-gray-500 mt-1">Be the first to share your post-degree insights!</p>
                          </div>
                        ) : (
                          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                            {dbFeedbacks.filter(f => isCourseIdEquivalent(f.courseId, selectedPathway.id)).map((alumni, idx) => (
                              <div 
                                key={`${alumni.feedbackId || alumni.id || ""}_${idx}`}
                                className="group border-2 border-black bg-white p-4 relative hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-black"
                                onClick={() => {
                                  const isEditing = editingFeedbackId === (alumni.feedbackId || alumni.id);
                                  if (!isEditing) {
                                    openAlumniProfile(alumni);
                                  }
                                }}
                              >
                                {(() => {
                                  const isAuthor = user && (user.id === alumni.userId || user.email === alumni.userId || alumni.id === user.id || (user as any).role === 'admin' || alumni.userId === "anonymous_alumni");
                                  const isEditing = editingFeedbackId === (alumni.feedbackId || alumni.id);
                                  return (
                                    <>
                                      <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                                        <div className="flex items-center text-yellow-600 font-mono text-xs">
                                          <Star className="w-3.5 h-3.5 fill-current" />
                                          <span className="ml-1 font-black">{(alumni.overallRating || alumni.rating || 5).toFixed(1)}</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3 mb-3 text-black">
                                        <AvatarDisplay avatar={isAuthor && user?.avatar ? user.avatar : alumni.avatar} name={alumni.name || "Alumni"} className="w-9 h-9 rounded-full bg-slate-100 border border-black flex items-center justify-center shrink-0" />
                                        <div>
                                          <h5 className="text-xs font-black uppercase group-hover:text-blue-600 text-black leading-tight">{alumni.name || 'Verified Alumni'}</h5>
                                          <span className="text-[9px] text-gray-500 font-mono block leading-none">{alumni.institutionName} • Completed {alumni.completionYear}</span>
                                        </div>
                                      </div>

                                      {isEditing ? (
                                        <div className="space-y-2 mt-2 select-text" onClick={(e) => e.stopPropagation()}>
                                          <textarea
                                            value={editingFeedbackText}
                                            onChange={(e) => setEditingFeedbackText(e.target.value)}
                                            className="w-full border-2 border-black p-2 text-xs font-semibold bg-white text-black"
                                            rows={3}
                                            required
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={(e) => handleSaveEditedFeedback(alumni, e)}
                                              className="px-3 py-1 text-[10px] uppercase font-mono font-black border border-black bg-emerald-400 hover:bg-emerald-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingFeedbackId(null);
                                              }}
                                              className="px-3 py-1 text-[10px] uppercase font-mono font-black border border-black bg-stone-200 hover:bg-stone-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-xs italic text-gray-850 font-sans leading-snug line-clamp-3 mb-2 font-semibold text-left">
                                          "{alumni.feedbackText || alumni.experience}"
                                        </p>
                                      )}

                                      {alumni.advice && (
                                        <p className="text-[11px] text-stone-600 line-clamp-2 mt-1 leading-snug text-left">
                                          💡 <span className="font-semibold">Advice: {alumni.advice}</span>
                                        </p>
                                      )}

                                      <div className="text-[10px] font-black uppercase tracking-tight text-blue-700 mt-2 flex items-center justify-between">
                                        <span>View Journey Timeline & Profile</span>
                                        <div className="flex items-center gap-2">
                                          {isAuthor && !isEditing && (
                                            <div className="flex items-center gap-1.5 shrink-0 mr-2" onClick={(e) => e.stopPropagation()}>
                                              <button
                                                onClick={(e) => handleStartEditFeedback(alumni, e)}
                                                className="px-2 py-0.5 text-[8px] font-mono font-bold border border-black bg-white text-black uppercase hover:bg-yellow-250 cursor-pointer"
                                                title="Edit feedback content"
                                              >
                                                Edit
                                              </button>
                                              {feedbackIdBeingDeleted === (alumni.feedbackId || alumni.id) ? (
                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                  <button
                                                    onClick={(e) => {
                                                      handleDeleteFeedback(alumni, e);
                                                      setFeedbackIdBeingDeleted(null);
                                                    }}
                                                    className="px-1.5 py-0.5 text-[7.5px] font-mono font-bold border border-black bg-red-600 text-white uppercase hover:bg-red-700 cursor-pointer"
                                                    title="Confirm deletion"
                                                  >
                                                    Yes
                                                  </button>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setFeedbackIdBeingDeleted(null);
                                                    }}
                                                    className="px-1.5 py-0.5 text-[7.5px] font-mono font-bold border border-black bg-white text-black uppercase hover:bg-stone-250 cursor-pointer"
                                                    title="Cancel deletion"
                                                  >
                                                    No
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFeedbackIdBeingDeleted(alumni.feedbackId || alumni.id);
                                                  }}
                                                  className="px-2 py-0.5 text-[8px] font-mono font-bold border border-black bg-red-100 text-red-650 uppercase hover:bg-red-250 cursor-pointer"
                                                  title="Delete feedback entry"
                                                >
                                                  Delete
                                                </button>
                                              )}
                                            </div>
                                          )}
                                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Inline Alumni Feedback Form for Pathway */}
                      {user?.role === 'alumni' && (
                        <div className="mt-8 border-2 border-black p-5 bg-amber-50/50 space-y-3 text-black">
                          <span className="text-[9.5px] font-mono font-black text-amber-700 uppercase block tracking-wider">// alumni rapid insight desk</span>
                          <h4 className="text-xs font-black uppercase text-black">Submit Your Feedback for {selectedPathway.name}</h4>
                          <p className="text-[10px] text-gray-500 font-mono italic">// Share your experience on this core intermediate pathway.</p>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[8px] font-black uppercase text-gray-500 mb-1">Overall Rating *</label>
                              <select 
                                value={inlineRating}
                                onChange={(e) => setInlineRating(parseInt(e.target.value))}
                                className="border border-black px-2 py-1 text-xs font-bold bg-white text-black border-2"
                              >
                                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                                <option value="4">⭐⭐⭐⭐ (Good)</option>
                                <option value="3">⭐⭐⭐ (Average)</option>
                                <option value="2">⭐⭐ (Tough)</option>
                                <option value="1">⭐ (Poor)</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-[8px] font-black uppercase text-gray-500 mb-1">Your Comment / Course Experience *</label>
                              <textarea 
                                placeholder="Comment on subjects depth, board examinations prep, or colleges..."
                                rows={3}
                                value={inlineFeedback}
                                onChange={(e) => setInlineFeedback(e.target.value)}
                                className="w-full border-2 border-black p-2 text-xs bg-white text-black font-semibold focus:outline-none border-2"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[8px] font-black uppercase text-gray-500 mb-1">Survival Advice Quote (Optional)</label>
                              <input 
                                type="text"
                                value={inlineAdvice}
                                onChange={(e) => setInlineAdvice(e.target.value)}
                                placeholder="e.g., Short revision cards are a life-saver for exams!"
                                className="w-full border-2 border-black p-2 text-xs bg-white text-black font-semibold focus:outline-none border-2"
                              />
                            </div>
                            
                            <button 
                              type="button"
                              disabled={isSubmittingFeedback}
                              onClick={() => handlePublishInlineFeedback(
                                selectedPathway.id,
                                selectedPathway.name,
                                selectedPathway.level === '10th' ? '10th' : '12th'
                              )}
                              className="w-full py-2.5 bg-black hover:bg-amber-600 hover:text-white transition-all text-white border-2 border-black tracking-widest text-[10px] font-black uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmittingFeedback ? 'Publishing...' : 'Publish Course Comment'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Mentorship Encourager Widget */}
                      <div className="mt-8 border-2 border-black bg-yellow-100 p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                        <h4 className="text-xs font-black uppercase tracking-tight text-black flex items-center gap-1.5 mb-1">
                          <MessageSquare className="w-4 h-4 text-black" /> Instant Guidance Support
                        </h4>
                        <p className="text-xs text-black leading-relaxed font-semibold">
                          Need structured advice? Click on any mentor above to inspect their education timeline and view full journey.
                        </p>
                      </div>

                    </div>

                    {/* Column 3: Progression Flowchart */}
                    <div className="p-6 md:p-8 bg-amber-50/10 flex flex-col justify-between space-y-6 text-black border-t-2 xl:border-t-0 border-black">
                      {renderFlowchart()}
                    </div>

                  </div>

                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* 4. SAVED PATHS BOARD VIEW */}
        {user && currentView === 'saved' && (
          <div className="max-w-7xl mx-auto px-6 py-10">
            <button 
              onClick={() => { setCurrentView('dashboard'); setSelectedNav('home'); }}
              className="px-3.5 py-2 border-2 border-black text-xs font-black uppercase bg-white hover:bg-stone-50 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1 cursor-pointer text-black mb-6"
              id="back-to-home-saved-paths"
            >
              ← Back to Home
            </button>
            <div className="border-2 border-black bg-white p-8 mb-10 shadow-[6px_6px_0px_0px_#000]">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">// Bookmarked Collections</span>
              <h1 className="text-4xl font-display font-black uppercase tracking-tight mt-1 mb-2">
                My Saved Pathways & Mentors
              </h1>
              <p className="text-sm text-gray-500">
                Keep track of your favored analytical modules, entrance tracks, and alumni cards for direct reachability-checks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Bookmarked Roadmaps */}
              <div className="space-y-6">
                <div className="border-b-2 border-black pb-2 flex justify-between items-center">
                  <h3 className="text-lg font-black uppercase">Saved Course Paths ({savedPathIds.length})</h3>
                  <Bookmark className="w-5 h-5 text-gray-500" />
                </div>

                {savedPathIds.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-400 p-8 text-center text-gray-500">
                    <p className="text-xs font-bold uppercase tracking-wider">No pathways bookmarked yet.</p>
                    <p className="text-[10px] text-gray-400 mt-1">Explore 10th & 12th roadmaps on the home screen to add items.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {savedPathIds
                      .map(id => getPathwayById(id))
                      .filter((p): p is AcademicPathway => p !== null)
                      .map(p => (
                        <div key={p.id} className="border-2 border-black bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[3px_3px_0px_0px_#000]">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-amber-600 font-mono">{p.level} LEVEL // {p.category}</span>
                            <h4 className="text-lg font-display font-black uppercase leading-tight mt-0.5">{p.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">Estimated duration: {p.duration} — {p.eligibility}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedPathway(p);
                                setActiveLevel(p.level);
                                setSelectedNav('home');
                                setCurrentView('dashboard');
                              }}
                              className="px-3 py-1.5 border border-black bg-black text-white hover:bg-gray-800 text-[10px] font-bold uppercase"
                            >
                              Explore
                            </button>
                            <button 
                              onClick={() => toggleSavePath(p.id)}
                              className="p-2 border border-red-200 text-red-600 hover:bg-red-50"
                              title="Delete bookmark"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Right Column: Bookmarked Alumni profiles */}
              <div className="space-y-6">
                <div className="border-b-2 border-black pb-2 flex justify-between items-center">
                  <h3 className="text-lg font-black uppercase">Saved Mentors ({savedAlumniIds.length})</h3>
                  <User className="w-5 h-5 text-gray-500" />
                </div>

                {savedAlumniIds.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-400 p-8 text-center text-gray-500">
                    <p className="text-xs font-bold uppercase tracking-wider">No mentor accounts saved.</p>
                    <p className="text-[10px] text-gray-400 mt-1">Visit alumni insights on individual paths to save profiles of interest.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {getAllPossiblePathways()
                      .flatMap(p => p.alumniInsights)
                      .filter((value, index, self) => self.findIndex(t => t.id === value.id) === index) // Unique
                      .filter(a => savedAlumniIds.includes(a.id))
                      .map(a => (
                        <div key={a.id} className="border-2 border-black bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[3px_3px_0px_0px_#000] w-full">
                          <div className="flex items-center gap-3">
                            <AvatarDisplay avatar={a.avatar} name={a.name} className="w-10 h-10 rounded-full bg-slate-100 border border-black flex items-center justify-center shrink-0" />
                            <div>
                              <h4 className="text-xs font-black uppercase leading-tight">{a.name}</h4>
                              <p className="text-[10px] text-gray-500">{a.role}</p>
                              <p className="text-[9px] text-[#2563EB] font-bold mt-1 font-mono">{a.institution}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => startMentorshipChat(a)}
                              className="px-3 py-1.5 border border-black bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold uppercase"
                            >
                              Chat
                            </button>
                            <button 
                              onClick={() => toggleSaveAlumni(a.id)}
                              className="p-2 border border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 5. MESSAGING SYSTEM / MENTOR CHAT WINDOW */}
        {user && currentView === 'messages' && (
          <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 flex flex-col gap-4">
            {/* Top Bar with Back to Home Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => { setCurrentView('dashboard'); setSelectedNav('home'); }}
                  className="px-3.5 py-2 border-2 border-black text-xs font-black uppercase bg-amber-200 hover:bg-amber-300 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1.5 cursor-pointer text-black"
                  id="messages-back-to-home"
                >
                  ← Back to Home
                </button>
                <div>
                  <h3 className="text-sm md:text-base font-display font-black uppercase text-stone-900 tracking-tight flex items-center gap-2">
                     Messages & Inbox
                  </h3>
                  
                </div>
              </div>

              {activeThreadId && (
                <button
                  type="button"
                  onClick={() => setActiveThreadId(null)}
                  className="px-3 py-1.5 border-2 border-black text-[11px] font-black uppercase bg-stone-100 hover:bg-stone-200 cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5"
                  title="Return to inbox channel list"
                >
                  View Inbox 
                </button>
              )}
            </div>

            <div className="h-[650px] flex flex-col md:flex-row border-2 border-black bg-white shadow-[8px_8px_0px_0px_#000] overflow-hidden">
            
            {/* Sidebar Threads list */}
            <div className={`w-full md:w-80 border-black md:border-r-2 flex flex-col h-full ${activeThreadId ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 bg-gray-50 border-b border-black flex justify-between items-center">
                <span className="text-xs uppercase font-black tracking-wider">Inbox</span>
                
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-black">
                {chatThreads.map(thread => {
                  const lastMessage = thread.messages[thread.messages.length - 1];
                  const hasUnread = thread.messages.some(m => !m.isRead && m.senderId !== user.id);
                  const isActive = activeThreadId === thread.id;

                  return (
                    <div
                      key={thread.id}
                      onClick={() => {
                        setActiveThreadId(thread.id);
                        // Mark all as read
                        setChatThreads(chatThreads.map(t => {
                          if (t.id === thread.id) {
                            return {
                              ...t,
                              messages: t.messages.map(m => ({ ...m, isRead: true }))
                            };
                          }
                          return t;
                        }));
                      }}
                      className={`p-4 cursor-pointer transition-colors flex items-center gap-3 relative group ${isActive ? 'bg-amber-100' : 'hover:bg-amber-50'} ${hasUnread ? 'font-bold' : ''}`}
                    >
                      <AvatarDisplay avatar={thread.alumniAvatar} name={thread.alumniName} className="w-9 h-9 rounded-full bg-slate-100 border border-black flex items-center justify-center shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h5 className="text-xs uppercase font-black truncate">{thread.alumniName}</h5>
                          {lastMessage && (
                            <span className="text-[8px] font-mono opacity-50">{lastMessage.timestamp}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium truncate mb-1">{thread.alumniRole}</p>
                        {lastMessage && (
                          <p className="text-xs text-gray-600 truncate">{lastMessage.text}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteModalThreadId(thread.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-red-600 rounded border border-transparent hover:border-red-300 transition-all shrink-0 cursor-pointer"
                        title="Delete Conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {hasUnread && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600 border border-black"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Private Message display area */}
            <div className={`flex-1 flex flex-col h-full bg-[#FCFBF7] ${activeThreadId ? 'flex' : 'hidden md:flex'}`}>
              {activeThreadId ? (
                <>
                  {/* Active Partner Header */}
                  {(() => {
                    const activeThread = chatThreads.find(t => t.id === activeThreadId);
                    if (!activeThread) return null;
                    const matchedAlumni = getAllPossiblePathways()
                      .flatMap(p => p.alumniInsights)
                      .find(a => a.id === activeThread.alumniId);

                    return (
                      <div className="p-4 bg-white border-b-2 border-black flex justify-between items-center md:px-6">
                        <div className="flex items-center gap-3">
                          {/* Back Button for Mobile */}
                          <button
                            onClick={() => setActiveThreadId(null)}
                            className="md:hidden p-1.5 border-2 border-black hover:bg-neutral-100 flex items-center justify-center cursor-pointer font-bold bg-white active:translate-y-0.5 select-none shrink-0"
                            title="Back to inbox"
                          >
                            <ChevronLeft className="w-4 h-4 text-black" />
                          </button>

                          <div 
                            onClick={() => {
                              if (matchedAlumni) {
                                setSelectedAlumni(matchedAlumni);
                              } else {
                                  setSelectedAlumni({
                                    id: activeThread.alumniId,
                                    name: activeThread.alumniName,
                                    avatar: activeThread.alumniAvatar,
                                    role: activeThread.alumniRole,
                                    yearCompleted: 'Verified',
                                    institution: 'DIRPA Counselor',
                                    advice: 'Please communicate directly for precise guidance.',
                                    experience: 'Registered professional advisor.',
                                    rating: 5,
                                    likes: 0,
                                    timeline: []
                                  });
                              }
                            }}
                            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 group"
                            title="View full 100% timeline profile"
                          >
                            <AvatarDisplay avatar={activeThread.alumniAvatar} name={activeThread.alumniName} className="w-10 h-10 rounded-full bg-slate-100 border border-black flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform" />
                            <div className="text-left select-none">
                              <h4 className="text-xs font-black uppercase leading-tight group-hover:underline">{activeThread.alumniName}</h4>
                              <p className="text-[9px] text-zinc-500 font-mono font-bold group-hover:text-blue-700">{activeThread.alumniRole}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {matchedAlumni && (
                            <button 
                              onClick={() => setSelectedAlumni(matchedAlumni)}
                              className="px-3 py-1.5 border border-black text-[10px] font-bold uppercase bg-stone-50 hover:bg-stone-100 cursor-pointer rounded"
                            >
                              Timeline
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteModalThreadId(activeThread.id)}
                            className="px-3 py-1.5 border border-red-500 text-[10px] font-black uppercase bg-red-50 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer flex items-center gap-1.5 rounded transition-all active:scale-95 shadow-sm"
                            title="Delete Conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Message History Scroller */}
                  <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                    {chatThreads
                      .find(t => t.id === activeThreadId)
                      ?.messages.map(msg => {
                        const isMe = msg.senderId === user.id;

                        return (
                          <div 
                            key={msg.id} 
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs md:max-w-md border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isMe ? 'bg-yellow-100 text-black' : 'bg-white text-black'}`}>
                              <div className="flex justify-between items-baseline mb-1 border-b border-black/10 pb-1">
                                <span className="text-[10px] font-black uppercase opacity-60 mr-4">
                                  {isMe ? 'You' : msg.senderName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-mono opacity-50 mr-2">{msg.timestamp}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(msg.text);
                                      alert("Message copied to clipboard.");
                                    }}
                                    className="p-0.5 hover:bg-stone-200/50 rounded text-stone-600 cursor-pointer"
                                    title="Copy Message"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  {isMe && (
                                    <button
                                      onClick={() => handleDeleteMessage(activeThreadId, msg.id)}
                                      className="p-0.5 hover:bg-red-50 rounded text-red-600 cursor-pointer"
                                      title="Delete Message"
                                    >
                                      <Trash className="w-3 h-3 text-red-600" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs leading-relaxed font-sans">{msg.text}</p>
                            </div>
                          </div>
                        );
                      })}

                    {activeTypingPartner && (
                      <div className="flex justify-start">
                        <div className="border border-black bg-stone-50 text-gray-500 text-xs px-4 py-2 italic flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0.2s]"></span>
                          <span>{activeTypingPartner} typing guidance message...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Messaging Text Input Bar */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t-2 border-black flex gap-3">
                    <input 
                      type="text"
                      placeholder="Ask the mentor about subject combinations, estimated fees, or study tips..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 border-2 border-black px-4 py-3 text-xs focus:outline-none focus:bg-amber-50"
                    />
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-black text-white hover:bg-blue-600 border-2 border-black font-bold uppercase text-xs tracking-wider"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  
                  {/* Preset Questions Helper row to speed up user experience */}
                  <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2 items-center">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Preset inquiries:</span>
                    <button 
                      type="button"
                      onClick={() => setMessageInput("Can you tell me about the required subjects and estimated annual fees involved?")}
                      className="text-[9px] bg-white hover:bg-amber-100 border border-gray-300 rounded px-2 py-0.5 font-medium"
                    >
                      "How are the fees & costs?"
                    </button>
                    <button 
                      type="button"
                      onClick={() => setMessageInput("Is the syllabus extremely difficult to pass? What is your advice?")}
                      className="text-[9px] bg-white hover:bg-amber-100 border border-gray-300 rounded px-2 py-0.5 font-medium"
                    >
                      "Is the curriculum hard?"
                    </button>
                    <button 
                      type="button"
                      onClick={() => setMessageInput("How long did it take you to prepare for the eligibility exams?")}
                      className="text-[9px] bg-white hover:bg-amber-100 border border-gray-300 rounded px-2 py-0.5 font-medium"
                    >
                      "How long to prepare?"
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                  <MessageSquare className="w-16 h-16 text-gray-400 stroke-1 mb-3" />
                  <h4 className="text-lg font-black uppercase">Start a Mentorship Conversation</h4>
                  <p className="text-xs text-gray-500 max-w-sm mt-1">
                    Select a conversation from the left inbox, or inspect alumni profiles inside individual branches of the Roadmap Explorer to message fresh experts.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
        )}

        {/* AI ADVISOR FULL PAGE PANEL */}
        {user && currentView === 'ai-advisor' && (
          <div className="max-w-7xl mx-auto px-6 py-10">
            <button 
              onClick={() => { setCurrentView('dashboard'); setSelectedNav('home'); }}
              className="px-3.5 py-2 border-2 border-black text-xs font-black uppercase bg-white hover:bg-stone-50 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1 cursor-pointer text-black mb-6"
              id="back-to-home-ai-advisor"
            >
              ← Back to Home
            </button>
            <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] mb-8">
              
              <h2 className="text-3xl font-display text-blue-600 font-black uppercase mt-1">DIRPA AI Advisor</h2>
              <p className="text-xs text-gray-500 mt-1">
                Tell our AI educational consultant about your interests, your completed class, and what you wanna become in life.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column Questionnaire */}
              <div className="lg:col-span-5 space-y-6">
                <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-black uppercase mb-6 pb-2 border-b-2 border-black text-black">Your Background Context</h3>
                  
                  <div className="space-y-4">
                    {/* Level Selection */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black">Academic Level Completed</label>
                      <select 
                        value={aiInputs.level}
                        onChange={(e) => setAiInputs({...aiInputs, level: e.target.value as any})}
                        className="w-full border-2 border-black px-3 py-2 text-xs bg-white font-bold focus:outline-none focus:bg-yellow-50 text-black"
                      >
                        <option value="10th">Finished Class 10 (SSC)</option>
                        <option value="12th">Finished Class 12 / Intermediate</option>
                        <option value="Graduation">Finished Graduation / Degree</option>
                      </select>
                    </div>

                    {/* Target Career Goal */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black">What you want to become? (Dream Career Goal)</label>
                      <input 
                        type="text"
                        placeholder="e.g., Software Innovator, Pediatric Surgeon, Business CA, UI Designer"
                        required
                        value={aiInputs.careerGoal}
                        onChange={(e) => setAiInputs({...aiInputs, careerGoal: e.target.value})}
                        className="w-full border-2 border-black px-3 py-2 text-xs focus:outline-none focus:bg-yellow-50 text-black placeholder-zinc-400 font-medium"
                      />
                    </div>

                    {/* Interests tags selection */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black">What subjects are of interest?</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Type a subject and hit Enter..."
                          value={subjectInput}
                          onChange={(e) => setSubjectInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = subjectInput.trim();
                              if (val && !aiInputs.interests.includes(val)) {
                                setAiInputs({ ...aiInputs, interests: [...aiInputs.interests, val] });
                                setSubjectInput('');
                              }
                            }
                          }}
                          className="w-full border-2 border-black px-3 py-2 text-xs focus:outline-none focus:bg-yellow-50 text-black placeholder-zinc-400 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = subjectInput.trim();
                            if (val && !aiInputs.interests.includes(val)) {
                              setAiInputs({ ...aiInputs, interests: [...aiInputs.interests, val] });
                              setSubjectInput('');
                            }
                          }}
                          className="px-3 py-2 bg-black text-white text-xs font-black uppercase border-2 border-black hover:bg-zinc-800 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      {aiInputs.interests.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {aiInputs.interests.map((interest) => (
                            <span
                              key={interest}
                              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 border-2 border-black bg-black text-yellow-300 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            >
                              <span>{interest}</span>
                              <button
                                type="button"
                                onClick={() => setAiInputs({ ...aiInputs, interests: aiInputs.interests.filter(i => i !== interest) })}
                                className="text-yellow-300 hover:text-white font-bold ml-0.5 cursor-pointer"
                                title="Remove subject"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Desired Duration */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black">Desired Course/Path Duration</label>
                      <input 
                        type="text"
                        placeholder="e.g., 2 Years or 3-4 Years"
                        value={aiInputs.durationPref}
                        onChange={(e) => setAiInputs({...aiInputs, durationPref: e.target.value})}
                        className="w-full border-2 border-black px-3 py-2 text-xs focus:outline-none focus:bg-yellow-50 text-black font-medium"
                      />
                    </div>

                    {/* Budget Constraint */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black">Estimated Budget Bracket</label>
                        <select 
                          value={aiInputs.budget}
                          onChange={(e) => setAiInputs({...aiInputs, budget: e.target.value as any})}
                          className="w-full border-2 border-black px-3 py-2 text-xs bg-white font-bold focus:outline-none focus:bg-yellow-50 text-black"
                        >
                          <option value="any">Flexible (No limit)</option>
                          <option value="low">Subsidized / Low Cost</option>
                          <option value="medium">Medium Standards</option>
                          <option value="high">Premium / High tier</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black">Your Key Personal Strength</label>
                        <input 
                          type="text"
                          placeholder="e.g., Analytical Rigor, Lateral thinking"
                          value={aiInputs.strengths.join(', ')}
                          onChange={(e) => setAiInputs({...aiInputs, strengths: e.target.value.split(',').map(s => s.trim())})}
                          className="w-full border-2 border-black px-3 py-2 text-xs focus:outline-none focus:bg-yellow-50 text-black font-medium"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleFetchAiRecommendation}
                      className="w-full py-4 mt-4 bg-orange-600 hover:bg-orange-700 text-white border-2 border-black text-xs font-black uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                      Submit
                    </button>
                  </div>

                </div>
              </div>

              {/* Right Column Planner Output */}
              <div className="lg:col-span-7">
                <div className="border-2 border-black p-6 md:p-8 bg-[#FDFBF7] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[500px]">
                  <span className="block text-xs font-mono font-black text-gray-500 uppercase tracking-widest mb-4">DIRPA Feedback</span>

                  {isAiLoading && (
                    <AiAdvisorSkeleton />
                  )}

                  {!isAiLoading && !aiResponse && (
                    <div className="flex flex-col justify-center items-center h-[350px] text-center">
                      <div className="w-16 h-16 bg-yellow-100 border-2 border-dashed border-black rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
                        💡
                      </div>
                      <h4 className="text-md font-black uppercase text-black">Ready For Academic Evaluation</h4>
                      <p className="text-xs text-gray-500 mt-2 max-w-sm">
                        Please fill out the details on the left sidebar page and hit submit. The counselor will give you structured roadmaps, duration, fee matrices, semester subjects, and next lateral entry steps.
                      </p>
                    </div>
                  )}

                  {!isAiLoading && aiResponse && (
                    <div className="space-y-5">
                      <div className="border-l-4 border-emerald-600 pl-3 py-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-black uppercase text-emerald-900 tracking-wider">Recommended Academic Courses:</h4>
                          <p className="text-[11px] text-stone-600 font-medium mt-0.5">Click any course name to open syllabus, alumni feedback & potential career jobs</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {aiResponse.recommendedPaths?.map((path: any, index: number) => (
                          <div 
                            key={index}
                            onClick={() => setSelectedCourseModal(getCourseDetailsWithDefaults(path))}
                            className="group border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-yellow-50/80 hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-900 border border-black">
                                  Option #{index + 1}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-stone-500">
                                  ⏱ {path.duration || '3-4 Years'} • 💰 {path.estimatedFees || 'Standard Tuition'}
                                </span>
                              </div>
                              <h4 className="text-base font-black uppercase text-black group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                <span>🎓 {path.name}</span>
                              </h4>
                              <p className="text-xs text-stone-600 line-clamp-1 italic">
                                "{path.description || path.whyFits}"
                              </p>
                            </div>

                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourseModal(getCourseDetailsWithDefaults(path));
                              }}
                              className="shrink-0 px-3.5 py-2 border-2 border-black bg-black text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              <span>Inspect Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Alternatives Display */}
                      {aiResponse.alternatives && aiResponse.alternatives.length > 0 && (
                        <div className="mt-6 pt-5 border-t-2 border-dashed border-stone-300 space-y-3">
                          <h5 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                            <span>💡 Alternative Academic Streams:</span>
                          </h5>
                          <div className="space-y-2.5">
                            {aiResponse.alternatives.map((alt: any, i: number) => (
                              <div 
                                key={i}
                                onClick={() => setSelectedCourseModal(getCourseDetailsWithDefaults(alt))}
                                className="group border-2 border-black bg-amber-50/90 p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-amber-100 hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center justify-between gap-3"
                              >
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-black uppercase text-amber-900">Alternative Option {i + 1}</span>
                                  <h5 className="text-sm font-black uppercase text-black group-hover:text-amber-900">🎓 {alt.name}</h5>
                                  <p className="text-xs text-stone-600 line-clamp-1">{alt.description || alt.whyAlternative}</p>
                                </div>
                                <button 
                                  type="button"
                                  className="shrink-0 text-xs font-black text-amber-950 underline uppercase tracking-tight flex items-center gap-1"
                                >
                                  <span>View Details →</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Counselor Empathy Advice */}
                      {aiResponse.generalAdvice && (
                        <div className="border-2 border-black bg-indigo-50 p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] leading-relaxed animate-fade-in mt-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-1">💬 Counselor Guidance Tip:</h4>
                          <p className="text-xs text-indigo-950 font-medium whitespace-pre-line">{aiResponse.generalAdvice}</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENTRANCE EXAMS INFO VIEW */}
        {user && currentView === 'entrance-exams' && (
          <EntranceExamsInfo 
            user={user}
            onStartChat={startMentorshipChat}
            onBackToHome={() => { setCurrentView('dashboard'); setSelectedNav('home'); }}
            registeredUsers={registeredUsers}
            dynamicPathways={dynamicPathways}
          />
        )}

        {/* SCHOLARSHIP RECOMMENDATION MODULE VIEW */}
        {user && currentView === 'scholarships' && (
          <ScholarshipModule
            user={user as any}
            onBackToDashboard={() => { setCurrentView('dashboard'); setSelectedNav('home'); }}
            onUpdateUserProfile={async (updatedFields) => {
              setUser(prev => prev ? { ...prev, ...updatedFields } : prev);
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* O*NET CAREER EXPLORER VIEW */}
        {user && currentView === 'onet-careers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <button 
              onClick={() => { setCurrentView('dashboard'); setSelectedNav('home'); }}
              className="px-3.5 py-2 border-2 border-black text-xs font-black uppercase bg-white hover:bg-stone-50 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1 cursor-pointer text-black mb-6"
              id="back-to-home-job-info"
            >
              ← Back to Home
            </button>
            <OnetCareerExplorer />
          </div>
        )}

        {/* COMPANIES EXPLORER VIEW */}
        {user && currentView === 'companies' && (
          <CompaniesExplorer 
            user={user as any}
            onStartChat={startMentorshipChat}
            onBackToHome={() => { setCurrentView('dashboard'); setSelectedNav('home'); }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* BULLETS REAL-TIME INTELLIGENCE FEED */}
        {currentView === 'bullets' && (
          <BulletsFeed 
            user={user as any}
            onBackToHome={() => { 
              if (user) {
                setCurrentView('dashboard');
                setSelectedNav('home');
              } else {
                setCurrentView('landing');
                setSelectedNav('home');
              }
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* STUFF: STUDENT-POWERED LEARNING RESOURCE DISCOVERY */}
        {currentView === 'stuff' && (
          <StuffLanding 
            user={user as any}
            onBackToHome={() => { 
              if (user) {
                setCurrentView('dashboard');
                setSelectedNav('home');
              } else {
                setCurrentView('landing');
                setSelectedNav('home');
              }
            }}
            onRequireAuth={() => {
              setAuthMode('signin');
              setCurrentView('auth');
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* 6. USER PROFILE / EXPERIENCE SUBMISSION BOARD */}
        {user && currentView === 'profile' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
              <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                
                <div className="text-center pb-6 border-b border-black">
                  {/* Interactive profile picture container */}
                  <div 
                    onClick={() => setShowPhotoModal(true)}
                    className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden group cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all select-none"
                    title="Click to change profile photo"
                    id="profile-picture-container-interactive"
                  >
                    <AvatarDisplay 
                      avatar={user.avatar} 
                      name={user.name} 
                      className="w-24 h-24 rounded-full bg-amber-100 border-2 border-black flex items-center justify-center overflow-hidden" 
                      textClassName="text-3xl font-black font-mono text-amber-950"
                    />
                    {/* Hover change photo overlay */}
                    {/* Hover change photo overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-center">Change Photo</span>
                    </div>
                  </div>

                  {/* Hidden file input for uploading profile picture */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="profile-picture-hidden-file-input"
                  />
                  {/* Hidden file input for camera capture */}
                  <input 
                    type="file"
                    ref={cameraInputRef}
                    accept="image/*"
                    capture="user"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="profile-picture-camera-file-input"
                  />

                  <h3 className="text-2xl font-display font-black uppercase mb-0.5">{user.name}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-blue-900 px-2 py-0.5 border border-black inline-block">
                    {user.role === 'alumni' ? 'Platform Academic Mentor' : 'Student Explorer'}
                  </span>
                  <p className="text-xs text-gray-500 mt-2 font-mono">{user.email}</p>
                  
                  {user.bio && (
                    <p className="text-xs italic text-gray-600 mt-3 font-medium bg-[#fcfbf9] p-2.5 border border-dashed border-black/10">
                      "{user.bio}"
                    </p>
                  )}
                </div>

                <div className="pt-6 space-y-4">
                  {isEditingProfile ? (
                    <div className="space-y-4 bg-gray-50 p-3 border border-black">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">// Editing Profile</span>
                      
                      {profileEditErrorBanner && (
                        <div className="p-2.5 bg-red-100 border border-red-500 text-red-900 text-[11px] font-bold">
                          ⚠️ {profileEditErrorBanner}
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Display Name *</label>
                        <input 
                          type="text" 
                          value={profileEditForm.name}
                          onChange={(e) => {
                            setProfileEditForm({...profileEditForm, name: e.target.value});
                            if (profileEditErrors.name) {
                              setProfileEditErrors(prev => ({ ...prev, name: '' }));
                            }
                          }}
                          className={`w-full border-2 px-2.5 py-1.5 text-xs bg-white focus:outline-none text-black font-semibold ${
                            profileEditErrors.name ? 'border-red-600 bg-red-50' : 'border-black'
                          }`}
                        />
                        {profileEditErrors.name && (
                          <p className="text-[10px] font-bold text-red-600 mt-1">⚠️ {profileEditErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Email Address *</label>
                        <input 
                          type="email" 
                          value={profileEditForm.email}
                          onChange={(e) => {
                            setProfileEditForm({...profileEditForm, email: e.target.value});
                            if (profileEditErrors.email) {
                              setProfileEditErrors(prev => ({ ...prev, email: '' }));
                            }
                          }}
                          className={`w-full border-2 px-2.5 py-1.5 text-xs bg-white focus:outline-none text-black font-medium ${
                            profileEditErrors.email ? 'border-red-600 bg-red-50' : 'border-black'
                          }`}
                        />
                        {profileEditErrors.email && (
                          <p className="text-[10px] font-bold text-red-600 mt-1">⚠️ {profileEditErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Account Description</label>
                        <textarea 
                          rows={2}
                          value={profileEditForm.bio}
                          onChange={(e) => setProfileEditForm({...profileEditForm, bio: e.target.value})}
                          className="w-full border-2 border-black px-2.5 py-1.5 text-xs bg-white focus:outline-none text-black font-medium"
                          placeholder="Tell students about your domain expertise or current targets..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={handleSaveProfileChanges}
                          className="flex-1 py-1.5 bg-black text-white hover:bg-stone-800 text-[10px] font-black uppercase border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={() => setIsEditingProfile(false)}
                          className="py-1.5 bg-white text-black hover:bg-stone-100 text-[10px] font-black uppercase border border-black cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button 
                        onClick={() => {
                          setProfileEditForm({
                            name: user.name,
                            email: user.email,
                            bio: user.bio || '',
                            avatar: user.avatar
                          });
                          setIsEditingProfile(true);
                        }}
                        className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black text-xs font-black uppercase tracking-wider transition-colors mb-4 cursor-pointer"
                      >
                        ✏️ Edit Profile Info
                      </button>

                      <div className="text-xs">
                        <span className="block uppercase font-black text-gray-400 tracking-wider mb-1">Account Role Scope</span>
                        <p className="font-bold">
                          {user.role === 'alumni' 
                            ? 'Authorized to share professional timeline milestones, write pathway advice logs, and review platform comments or replies.' 
                            : 'Permitted to explore educational standard nodes, save favorite pathways, and query generative AI counsel.'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 mt-4 pt-4 space-y-4">
                    <div className="flex justify-between items-center bg-gray-50 p-2 border border-black/10 rounded">
                      <span className="text-xs font-bold text-gray-500">Disconnect Session</span>
                      <button 
                        onClick={handleLogout}
                        className="px-3 py-1.5 bg-gray-800 text-white font-bold text-xs uppercase hover:bg-black transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-red-50 p-2 border border-red-200 rounded">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-red-600">Permanent Deletion</span>
                        <span className="text-[9px] text-gray-400 font-medium">Deletes your profile</span>
                      </div>
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-3 py-1.5 bg-red-600 border border-red-700 hover:bg-red-700 text-white font-black text-xs uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none cursor-pointer"
                      >
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              

              {/* Submit Feedback Component */}
              <div className="border-2 border-black p-6 bg-amber-50/60 dark:bg-zinc-850 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between border-b border-black/15 dark:border-zinc-700 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-black text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-300 dark:border-amber-800 uppercase tracking-wide rounded">
                      // SHARE YOUR EXPERIENCE
                    </span>
                    <h4 className="text-sm font-display font-black uppercase text-black dark:text-white mt-1">
                      Submit Platform Review & Feedback
                    </h4>
                  </div>
                  <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                </div>

                <p className="text-xs text-stone-600 dark:text-zinc-300 font-medium">
                  Your feedback will be featured directly on DIRPA's homepage testimonial marquee for fellow students and alumni!
                </p>

                {profileFeedbackSuccess && (
                  <div className="p-3 border-2 border-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 text-xs font-bold font-mono flex items-center gap-2">
                    <span>✅</span>
                    <span>Thank you! Your feedback has been published to the homepage marquee.</span>
                  </div>
                )}

                {profileFeedbackError && (
                  <div className="p-3 border-2 border-red-500 bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-200 text-xs font-bold font-mono flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{profileFeedbackError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitProfileFeedback} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-stone-600 dark:text-zinc-400 mb-1.5">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setProfileFeedbackRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= profileFeedbackRating
                                ? "fill-amber-400 text-amber-500"
                                : "text-stone-300 dark:text-zinc-600"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-400 ml-2">
                        {profileFeedbackRating}/5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-stone-600 dark:text-zinc-400 mb-1.5">
                      Your Review / Experience *
                    </label>
                    <textarea
                      rows={3}
                      value={profileFeedbackText}
                      onChange={(e) => {
                        setProfileFeedbackText(e.target.value);
                        if (profileFeedbackError) setProfileFeedbackError(null);
                      }}
                      placeholder="Share how DIRPA helped you navigate intermediate streams, polytechnic routes, or graduation options..."
                      className={`w-full p-3 border-2 text-xs focus:outline-none font-medium placeholder:text-stone-400 ${
                        profileFeedbackError
                          ? 'border-red-600 bg-red-50 dark:bg-red-950/50 text-black dark:text-white'
                          : 'border-black bg-white dark:bg-zinc-900 text-black dark:text-white'
                      }`}
                    />
                    {profileFeedbackError && (
                      <p className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1">⚠️ {profileFeedbackError}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingProfileFeedback}
                    className="w-full py-2.5 bg-black dark:bg-zinc-100 text-white dark:text-black hover:bg-stone-800 dark:hover:bg-white text-xs font-mono font-black uppercase tracking-wider border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSubmittingProfileFeedback ? 'Publishing Review...' : 'Submit Feedback 🚀'}</span>
                  </button>
                </form>
              </div>

              {/* Status checklist metrics */}
              <div className="border-2 border-black p-6 bg-slate-50">
                <h4 className="text-xs font-black uppercase mb-3">Guidance Statistics Summary</h4>
                <ul className="space-y-2 text-xs">
                  {user.role !== 'alumni' && (
                    <li className="flex justify-between font-mono border-b border-black/5 pb-1">
                      <span>Saved Paths Count:</span>
                      <span className="font-bold">{savedPathIds.length}</span>
                    </li>
                  )}
                  <li className="flex justify-between font-mono">
                    <span>Contacted Alumni:</span>
                    <span className="font-bold">{chatThreads.length}</span>
                  </li>
                  <li className="flex justify-between font-mono">
                    <span>Account Sync Status:</span>
                    <span className="text-emerald-600 font-bold">VERIFIED</span>
                  </li>
                </ul>
              </div>


          </div>
        )}

        {/* 7. ABOUT DIRPA DEDICATED VIEW */}
        {user && currentView === 'about' && (
          <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-fade-in transition-colors duration-150">
            
            {/* Header / Mission Hero Card */}
            <div className="border-2 border-black dark:border-zinc-700 bg-[#FCFBF8] dark:bg-zinc-900 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest block font-mono bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 border border-rose-200 dark:border-rose-900 rounded">DIRPA FOUNDATION & PLATFORM</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6] tracking-tight leading-none">
                  {t('about.title', 'About DIRPA Foundation')} <br/>
                  <span className="text-amber-600 dark:text-amber-400 text-3xl md:text-4xl">Discover Your Path</span>
                </h1>
                <p className="text-xs font-mono font-bold text-gray-500 dark:text-zinc-400 uppercase">
                  {t('about.subtitle', 'Dynamic Interactive Roadmap & Placement Advisor')}
                </p>
                <div className="h-0.5 bg-black dark:bg-zinc-700 w-24"></div>
                <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-semibold max-w-2xl">
                  {t('about.heroDesc', 'DIRPA is an all-in-one academic and career guidance platform engineered to empower students across 10th standard, 12th standard (MPC, BiPC, CEC, HEC), Polytechnic, and Higher Education. We bridge the information gap with verified scholarships, multilingual accessibility, real-time job market salary data, entrance exam hubs, and alumni mentorship.')}
                </p>
              </div>
              <div className="w-full md:w-1/3 border-2 border-black dark:border-zinc-700 p-6 bg-amber-50 dark:bg-zinc-800 text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-sm font-black uppercase mb-3 text-amber-900 dark:text-yellow-400 flex items-center gap-1.5 font-mono">
                  <span>{t('about.quickStats', '⚡ Platform Highlights')}</span>
                </h4>
                <ul className="space-y-2 text-xs font-mono">
                  <li className="flex justify-between border-b border-black/10 dark:border-white/10 pb-1">
                    <span>{t('about.activeBranches', 'Academic Branches:')}</span>
                    <span className="font-bold">48+ Streams</span>
                  </li>
                  <li className="flex justify-between border-b border-black/10 dark:border-white/10 pb-1">
                    <span>{t('nav.scholarships', 'Scholarships')}:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">Verified DB + AI</span>
                  </li>
                  <li className="flex justify-between border-b border-black/10 dark:border-white/10 pb-1">
                    <span>{t('nav.language', 'Language')}:</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">7+ Languages</span>
                  </li>
                  <li className="flex justify-between border-b border-black/10 dark:border-white/10 pb-1">
                    <span>{t('nav.jobInformation', 'Job Information')}:</span>
                    <span className="font-bold">Indian (₹) & US Data</span>
                  </li>
                  <li className="flex justify-between font-bold pt-1">
                    <span>{t('about.verifiedMentors', 'Verified Mentors:')}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">250+ Alumni</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Core Implemented Feature Pillars Grid */}
            <div className="space-y-4">
              <div className="border-b-2 border-black dark:border-zinc-700 pb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">// CORE INTEGRATED MODULES</span>
                  <h2 className="text-2xl font-display font-black uppercase text-black dark:text-white">What DIRPA Delivers</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Module 1: Scholarships */}
                <div className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/40 border-2 border-black dark:border-zinc-700 flex items-center justify-center text-amber-800 dark:text-amber-300 text-xl font-bold">
                      🎓
                    </div>
                    <h3 className="text-lg font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6]">{t('scholarships.title', 'Verified Scholarships Hub')}</h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      Comprehensive database of State, Central, and Private scholarships. Filter by family income cap, minimum percentage marks, and education level. Includes official NSP/ePASS links, required document checklists, and personalized AI scholarship guidance.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">
                    FINANCIAL ASSISTANCE ENGINE
                  </div>
                </div>

                {/* Module 2: Multilingual Support */}
                <div className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 border-2 border-black dark:border-zinc-700 flex items-center justify-center text-blue-800 dark:text-blue-300 text-xl font-bold">
                      🌐
                    </div>
                    <h3 className="text-lg font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6]">{t('nav.multilingual', 'Multilingual Accessibility')}</h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      Full internationalization across English, Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Marathi (మరాఠీ), and Bengali (బెంగాలీ). Ensures students and parents from diverse regional backgrounds can navigate career choices effortlessly.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 uppercase">
                    INCLUSIVE i18n LOCALIZATION
                  </div>
                </div>

                {/* Module 3: Job & Market Information */}
                <div className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 border-2 border-black dark:border-zinc-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 text-xl font-bold">
                      💼
                    </div>
                    <h3 className="text-lg font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6]">{t('nav.jobInformation', 'Job Market & Salary Explorer')}</h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      Dual market intelligence covering both the Indian Job Market (INR ₹ salary estimates, required skills, NCO qualification levels) and U.S. O*NET Department of Labor data with live search grounding and skill breakdowns.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    CAREER & SALARY INTELLIGENCE
                  </div>
                </div>

                {/* Module 4: Interactive Academic Roadmaps */}
                <div className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/40 border-2 border-black dark:border-zinc-700 flex items-center justify-center text-purple-800 dark:text-purple-300 text-xl font-bold">
                      🗺️
                    </div>
                    <h3 className="text-lg font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6]">{t('about.interactiveRoadmapsTitle', 'Interactive Academic Streams')}</h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      {t('about.interactiveRoadmapsDesc', 'Step-by-step guidance for 10th and 12th standards (MPC, BiPC, CEC, HEC), Polytechnic Diplomas, professional courses, and university degrees. Visual pathfinding matching student strengths to higher education outcomes.')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-purple-700 dark:text-purple-400 uppercase">
                    VISUAL DISCOVERY ENGINE
                  </div>
                </div>

                {/* Module 5: Entrance Exams Hub */}
                <div className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-900/40 border-2 border-black dark:border-zinc-700 flex items-center justify-center text-rose-800 dark:text-rose-300 text-xl font-bold">
                      ⚡
                    </div>
                    <h3 className="text-lg font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6]">{t('nav.entranceExams', 'Entrance Exams Info Center')}</h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      Dedicated portal for national and state entrance exams (JEE, NEET, EAMCET, CLAT, CUET, POLYCET). Access syllabus patterns, expected test dates, category fees, required documents, and accepting colleges.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase">
                    EXAM PREPARATION HUB
                  </div>
                </div>

                {/* Module 6: Alumni Network & AI Advisor */}
                <div className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 border-2 border-black dark:border-zinc-700 flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xl font-bold">
                      🤝
                    </div>
                    <h3 className="text-lg font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6]">{t('about.verifiedAlumniTitle', 'Alumni Network & AI Advisor')}</h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      {t('about.verifiedAlumniDesc', 'Connect with senior graduates for raw course reviews and direct 1-on-1 messaging. Complemented by our AI Career Advisor for personalized budget, location, and career goal recommendations.')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase">
                    MENTORSHIP & AI COUNSEL
                  </div>
                </div>

              </div>
            </div>

            {/* Meet the Co-founders Section */}
            <div className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b-2 border-black dark:border-zinc-700 pb-4 mb-8">
                <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest block font-mono">EXECUTIVE LEADERSHIP</span>
                <h2 className="text-3xl font-display font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6] mt-1.0">
                  {t('about.teamTitle', 'Meet Our Co-Founders')}
                </h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                  {t('about.teamSubtitle', "The executive minds and architects engineering DIRPA's student-alumni academic pathways.")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Founder 1: Yagna Narayana */}
                <div className="border-2 border-black dark:border-zinc-700 p-5 bg-[#FCFBF8] dark:bg-zinc-800 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-2xl border border-black font-semibold">
                      👨‍💻
                    </div>
                    <div>
                      <h4 className="text-md font-black text-[#1A1A1A] dark:text-[#F3F4F6] uppercase">Yagna Narayana</h4>
                      <p className="text-[9.5px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider font-mono">Co-Founder & Chief Product Officer</p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      Architects interactive visual designs, path mapping algorithms, and student experience pipelines.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-5 pt-3 border-t border-dashed border-black/10 dark:border-white/10">
                    <a 
                      href="https://www.linkedin.com/in/yagna-narayana-5b5046303/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black hover:bg-yellow-300 dark:hover:bg-yellow-600 py-1.5 text-[10px] font-mono font-black uppercase transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" /> Linkedin
                    </a>
                    <a 
                      href="https://www.instagram.com/this__is__yagna__/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black hover:bg-pink-300 dark:hover:bg-pink-600 py-1.5 text-[10px] font-mono font-black uppercase transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Instagram
                    </a>
                  </div>
                </div>

                {/* Founder 2: Harika */}
                <div className="border-2 border-black dark:border-zinc-700 p-5 bg-[#FCFBF8] dark:bg-zinc-800 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-2xl border border-black font-semibold">
                      👩‍💻
                    </div>
                    <div>
                      <h4 className="text-md font-black text-[#1A1A1A] dark:text-[#F3F4F6] uppercase">Harika</h4>
                      <p className="text-[9.5px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">Co-Founder & Chief Technology Officer</p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      Architects secure database structures, backend sync components, and cloud services scaling.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-5 pt-3 border-t border-dashed border-black/10 dark:border-white/10">
                    <a 
                      href="https://www.linkedin.com/in/harika-vankdoth-49791a351/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black hover:bg-yellow-300 dark:hover:bg-yellow-600 py-1.5 text-[10px] font-mono font-black uppercase transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" /> Linkedin
                    </a>
                    <a 
                      href="https://www.instagram.com/harikasrinivas_04/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black hover:bg-pink-300 dark:hover:bg-pink-600 py-1.5 text-[10px] font-mono font-black uppercase transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Instagram
                    </a>
                  </div>
                </div>

                {/* Founder 3: Sri Anjani */}
                <div className="border-2 border-black dark:border-zinc-700 p-5 bg-[#FCFBF8] dark:bg-zinc-800 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center text-2xl border border-black font-semibold">
                      👩‍💼
                    </div>
                    <div>
                      <h4 className="text-md font-black text-[#1A1A1A] dark:text-[#F3F4F6] uppercase">Sri Anjani</h4>
                      <p className="text-[9.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">Co-Founder & Head of Partnerships</p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      Coordinates corporate relationships, university alignments, and outreach to schools.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-5 pt-3 border-t border-dashed border-black/10 dark:border-white/10">
                    <button 
                      onClick={() => alert("LinkedIn link for Sri Anjani is coming soon!")}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-stone-100 dark:bg-zinc-800/50 text-gray-400 dark:text-zinc-500 border border-black/20 dark:border-white/5 py-1.5 text-[10px] font-mono font-black uppercase pointer-events-none select-none"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-gray-400" /> Soon
                    </button>
                    <a 
                      href="https://www.instagram.com/s_r_i_2005_/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black hover:bg-pink-300 dark:hover:bg-pink-600 py-1.5 text-[10px] font-mono font-black uppercase transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Instagram
                    </a>
                  </div>
                </div>

                {/* Founder 4: Nikhil */}
                <div className="border-2 border-black dark:border-zinc-700 p-5 bg-[#FCFBF8] dark:bg-zinc-800 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center text-2xl border border-black font-semibold">
                      👷
                    </div>
                    <div>
                      <h4 className="text-md font-black text-[#1A1A1A] dark:text-[#F3F4F6] uppercase">Nikhil</h4>
                      <p className="text-[9.5px] font-black text-rose-600 dark:text-rose-455 uppercase tracking-wider font-mono">Co-Founder & Lead Consultant</p>
                    </div>
                    <p className="text-xs text-gray-650 dark:text-zinc-300 leading-relaxed font-semibold">
                      Validates counseling frameworks, career placement data modeling, and advisory maps.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-5 pt-3 border-t border-dashed border-black/10 dark:border-white/10">
                    <a 
                      href="https://www.linkedin.com/in/nikhil-yendoti-998864326/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black hover:bg-yellow-300 dark:hover:bg-yellow-600 py-1.5 text-[10px] font-mono font-black uppercase transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" /> Linkedin
                    </a>
                    <a 
                      href="https://www.instagram.com/nikhil.yendoti/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black hover:bg-pink-300 dark:hover:bg-pink-600 py-1.5 text-[10px] font-mono font-black uppercase transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
        {/* DEDICATED ALUMNI REFLECTIONS & ENGAGEMENT HUB WORKSPACE */}
        {user && currentView === 'insights' && (
          <div className="max-w-7xl mx-auto px-6 py-10 transition-colors duration-150">
            {/* Header section with minimal & modern display style */}
            <div className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 md:p-8 mb-8">
              <span className="text-xs font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest block font-mono">FORUM & DISCUSSIONS</span>
              <h1 className="text-4xl font-display font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6] mt-1.5 flex items-center gap-3">
                <span>Alumni Global Comments Board</span>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 py-1 px-3 border border-emerald-600 text-emerald-700 dark:text-emerald-400 rounded-full font-mono uppercase font-black tracking-widest animate-pulse h-fit">Live Forum</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 max-w-3xl leading-relaxed font-semibold">
                Welcome to the open discussions center. Search, select, post, modify, like, and reply to course-specific comments and experiences. Share survival tips to direct current high school and university students toward the perfect career roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Publish Global Course Comment (Cols: 4) */}
              <div className="lg:col-span-4 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 bg-slate-50">
                <div className="border-b-2 border-black dark:border-zinc-700 pb-3 mb-5">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block font-mono">Share Your Experience</span>
                  <h2 className="text-xl font-display font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6] mt-1">Post a Comment</h2>
                </div>

                <form onSubmit={handleSubmitExperience} className="space-y-4 text-[#1A1A1A] dark:text-zinc-250">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-gray-500 dark:text-zinc-400 font-bold">Target Pathway Stream *</label>
                    <select 
                      value={newExperience.pathwayId}
                      onChange={(e) => setNewExperience({...newExperience, pathwayId: e.target.value})}
                      className="w-full border-2 border-black dark:border-zinc-700 px-3 py-2 text-xs bg-[#FAF9F5] dark:bg-zinc-800 text-black dark:text-zinc-100 font-bold uppercase focus:outline-none"
                      required
                    >
                      {getAllPossiblePathways().map(p => (
                        <option key={p.id} value={p.id}>[{p.level.toUpperCase()}] {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-gray-500 dark:text-zinc-400 font-bold">Review Rating (1-5 Stars) *</label>
                    <select 
                      value={newExperience.rating}
                      onChange={(e) => setNewExperience({...newExperience, rating: parseInt(e.target.value)})}
                      className="w-full border-2 border-black dark:border-zinc-700 px-3 py-2 text-xs bg-[#FAF9F5] dark:bg-zinc-800 text-black dark:text-zinc-100 font-bold focus:outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (Excellent / 5 Star)</option>
                      <option value="4">⭐⭐⭐⭐ (Good / 4 Star)</option>
                      <option value="3">⭐⭐⭐ (Average / 3 Star)</option>
                      <option value="2">⭐⭐ (Tough / 2 Star)</option>
                      <option value="1">⭐ (Not Recommended / 1 Star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-gray-500 dark:text-zinc-400 font-bold font-bold">Your Comment / Course Experience *</label>
                    <textarea 
                      placeholder="Share your raw experiences: courses studied, college environment, job opportunities, advice, etc..."
                      rows={4}
                      value={newExperience.experienceText}
                      onChange={(e) => setNewExperience({...newExperience, experienceText: e.target.value})}
                      className="w-full border-2 border-black dark:border-zinc-700 px-4 py-3 text-xs bg-[#FAF9F5] dark:bg-zinc-800 text-black dark:text-zinc-100 font-semibold focus:outline-none focus:bg-yellow-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-gray-500 dark:text-zinc-400 font-bold">Survival Advice Quote for Juniors (Optional)</label>
                    <textarea 
                      placeholder="One line of crucial advice..."
                      rows={2}
                      value={newExperience.adviceText}
                      onChange={(e) => setNewExperience({...newExperience, adviceText: e.target.value})}
                      className="w-full border-2 border-black dark:border-zinc-700 px-4 py-3 text-xs bg-[#FAF9F5] dark:bg-zinc-800 text-black dark:text-zinc-100 font-semibold focus:outline-none focus:bg-yellow-50"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-black text-xs font-black uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingFeedback ? 'Publishing...' : 'Publish Course Comment'}
                  </button>
                </form>
              </div>

              {/* Right Column: Dynamic Filtered Course Conversations (Cols: 8) */}
              <div className="lg:col-span-8 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
                <div className="border-b-2 border-black dark:border-zinc-700 pb-3 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest block font-mono">Conversations & Student Engagement</span>
                    <h2 className="text-xl font-display font-black uppercase text-[#1A1A1A] dark:text-[#F3F4F6] mt-1">Comments Feed</h2>
                  </div>
                  
                  {/* Real-time search and filtering controls */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={insightsFilterPathway}
                      onChange={(e) => setInsightsFilterPathway(e.target.value)}
                      className="border-2 border-black px-2 py-1.5 text-xs font-bold uppercase bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none"
                    >
                      <option value="all">📁 All Courses</option>
                      {getAllPossiblePathways().map(p => (
                        <option key={p.id} value={p.id}>[{p.level.toUpperCase()}] {p.name}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Search comments..."
                      value={insightsSearchQuery}
                      onChange={(e) => setInsightsSearchQuery(e.target.value)}
                      className="border-2 border-black px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {(() => {
                  if (feedbackLoading) {
                    return <CommentSkeletonList count={4} />;
                  }
                  const allComments = courseReviews.map(f => {
                    const matchedPath = getAllPossiblePathways().find(p => isCourseIdEquivalent(p.id, f.courseId));
                    const isCurrentUser = user && (
                      f.userId === user.id ||
                      f.userEmail === user.email ||
                      f.authorEmail === user.email ||
                      f.email === user.email ||
                      (user.name && f.name && f.name.toLowerCase() === user.name.toLowerCase())
                    );
                    const avatarToUse = isCurrentUser ? (user.avatar || f.avatar) : (f.avatar || f.photoURL || "🎓");
                    return {
                      id: f.feedbackId || f.id,
                      name: f.name || "Verified Alumni",
                      role: f.role || f.currentJobRole || ("Graduate " + (matchedPath?.name || f.courseName || "General Course")),
                      avatar: avatarToUse,
                      institution: f.institutionName || f.institution || "DIRPA Counseling Network",
                      yearCompleted: f.completionYear || "2024",
                      experience: f.feedbackText || "",
                      advice: f.advice || "",
                      rating: Number(f.overallRating || f.rating || 5),
                      authorEmail: f.userId || "",
                      pathwayId: f.courseId,
                      pathwayName: matchedPath?.name || f.courseName || "General Course / Pathway",
                      pathwayLevel: matchedPath?.level || f.educationalStage || "",
                      replies: f.replies || [],
                      likes: f.likes || 0
                    };
                  });

                  const filtered = allComments.filter(comment => {
                    const matchPath = insightsFilterPathway === 'all' || comment.pathwayId === insightsFilterPathway;
                    const textSearch = `${comment.name} ${comment.experience} ${comment.advice || ''} ${comment.pathwayName}`.toLowerCase();
                    const matchSearch = textSearch.includes(insightsSearchQuery.toLowerCase());
                    return matchPath && matchSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-16 bg-slate-50 dark:bg-zinc-950 border-2 border-dashed border-black/20 dark:border-zinc-850 rounded-lg">
                        <p className="text-xs font-mono font-black text-gray-500 uppercase tracking-wider">// No matching comments found</p>
                        <p className="text-xs text-gray-400 mt-1">Be the first to post a review or adjust your filters above.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      {filtered.map((comment, idx) => {
                        const isCurrentlyEditing = editingCommentId === comment.id;

                        return (
                          <div 
                            key={`${comment.id || ""}_${idx}`} 
                            className="p-5 border-2 border-black dark:border-zinc-700 bg-[#FCFBF8] dark:bg-zinc-950 relative transition-colors duration-100 text-black dark:text-zinc-200"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 select-none">
                              <div 
                                onClick={() => openAlumniProfile({
                                  id: comment.authorEmail || comment.id,
                                  name: comment.name,
                                  role: comment.role,
                                  avatar: comment.avatar,
                                  institution: comment.institution,
                                  yearCompleted: comment.yearCompleted,
                                  experience: comment.experience,
                                  advice: comment.advice,
                                  rating: comment.rating,
                                  feedbackId: comment.id
                                } as any)}
                                className="flex items-center gap-2 cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-800 p-1.5 border border-transparent hover:border-black/10 dark:hover:border-zinc-700/50 rounded transition"
                              >
                                <AvatarDisplay avatar={comment.avatar} name={comment.name} className="w-8 h-8 rounded-full bg-orange-100 dark:bg-zinc-800 border border-black flex items-center justify-center overflow-hidden shrink-0" />
                                <div>
                                  <span className="font-extrabold text-xs block text-[#1A1A1A] dark:text-[#F3F4F6]">{comment.name}</span>
                                  <span className="text-[9px] font-mono text-gray-400 uppercase">{comment.role || "Alumni Contributor"}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                                <span className="text-[9px] uppercase font-mono font-black px-2 py-0.5 bg-yellow-100 dark:bg-zinc-800 border border-black text-black dark:text-yellow-400">
                                  {comment.pathwayName}
                                </span>
                                
                                <span className="text-xs font-bold text-amber-500 font-mono">
                                  {"★".repeat(comment.rating || 5)}{"☆".repeat(5-(comment.rating || 5))}
                                </span>
                              </div>
                            </div>

                            {isCurrentlyEditing ? (
                              <div className="space-y-2 mb-3 bg-white dark:bg-zinc-900 border-2 border-black p-3 text-black">
                                <div>
                                  <label className="block text-[8px] font-black uppercase text-gray-400 mb-1">Edit Comment Content</label>
                                  <textarea 
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    rows={3}
                                    className="w-full border border-black px-3 py-2 text-xs font-semibold focus:outline-none text-black bg-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-[8px] font-black uppercase text-gray-400 mb-1">Edit Survival Quote</label>
                                  <input 
                                    type="text"
                                    value={editAdviceText}
                                    onChange={(e) => setEditAdviceText(e.target.value)}
                                    className="w-full border border-black px-3 py-1 text-xs font-semibold focus:outline-none text-black bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[8px] font-black uppercase text-gray-400 mb-1">Edit Rating</label>
                                  <select 
                                    value={editRating}
                                    onChange={(e) => setEditRating(parseInt(e.target.value))}
                                    className="border border-black px-2 py-1 text-xs focus:outline-none bg-white text-black font-extrabold"
                                  >
                                    <option value="5">⭐⭐⭐⭐⭐</option>
                                    <option value="4">⭐⭐⭐⭐</option>
                                    <option value="3">⭐⭐⭐</option>
                                    <option value="2">⭐⭐</option>
                                    <option value="1">⭐</option>
                                  </select>
                                </div>

                                <div className="flex gap-2 justify-end pt-1">
                                  <button 
                                    type="button"
                                    onClick={() => setEditingCommentId(null)}
                                    className="px-2 py-1 text-[10px] font-bold text-gray-400 bg-gray-100 border border-black uppercase"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => handleUpdateComment(comment.pathwayId, comment.id)}
                                    className="px-3 py-1 text-[10px] font-bold text-white bg-[#0066FF] border border-black uppercase"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs leading-relaxed text-gray-700 dark:text-zinc-300 font-semibold whitespace-pre-line border-l-2 border-blue-600 dark:border-cyan-400 pl-3">
                                {comment.experience}
                              </p>
                            )}

                            {comment.advice && !isCurrentlyEditing && (
                              <div className="mt-2 bg-yellow-50 dark:bg-zinc-900 border border-dashed border-yellow-300 dark:border-zinc-800 p-2.5 rounded">
                                <span className="text-[8px] font-black uppercase text-amber-600 block mb-0.5 font-mono">Survival Hack</span>
                                <p className="text-xs italic font-medium leading-relaxed">"{comment.advice}"</p>
                              </div>
                            )}

                            {/* Quick engagement actions bar */}
                            <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] justify-between text-gray-500 font-mono select-none">
                              <div className="flex items-center gap-2">
                                <button 
                                  type="button"
                                  onClick={() => handleLikeComment(comment.pathwayId, comment.id)}
                                  className="text-[10px] font-black uppercase text-blue-600 dark:text-cyan-400 flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-900 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-100 cursor-pointer active:translate-y-0.5 transition-all font-bold"
                                >
                                  👍 {comment.likes || 0} Likes
                                </button>
                              </div>

                              {user && (user.id === comment.authorEmail || user.email === comment.authorEmail || (user as any).role === 'admin' || comment.authorEmail === "anonymous_alumni") && (
                                <div className="flex items-center gap-2">
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setEditingCommentId(comment.id);
                                      setEditCommentText(comment.experience);
                                      setEditAdviceText(comment.advice || '');
                                      setEditRating(comment.rating || 5);
                                    }}
                                    className="text-xs hover:underline text-blue-700 dark:text-cyan-400 font-extrabold uppercase cursor-pointer"
                                  >
                                    ✏️ Edit
                                  </button>

                                  <span className="text-gray-300">|</span>

                                  <button 
                                    type="button"
                                    onClick={() => handleDeleteComment(comment.pathwayId, comment.id)}
                                    className="text-xs hover:underline text-red-600 font-extrabold uppercase cursor-pointer"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* QUERY REPLIES WORKBOARD */}
                            <div className="mt-4 pt-3 border-t border-dashed border-black/15 bg-white dark:bg-zinc-930 p-4 rounded-lg">
                              <span className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500 block tracking-wider mb-2 font-mono">// Thread Replies ({comment.replies?.length || 0})</span>
                              
                              {comment.replies && comment.replies.length > 0 ? (
                                <div className="space-y-2 mb-3 max-h-[200px] overflow-y-auto">
                                  {comment.replies.map((reply: any) => (
                                    <div key={reply.id} className="bg-[#FAF9F5] dark:bg-zinc-950 border border-black/10 dark:border-zinc-855 p-2 rounded flex items-start gap-2">
                                      <span className="text-md leading-none">{reply.avatar}</span>
                                      <div className="flex-1">
                                        <div className="flex justify-between items-center px-1.5 mb-1 text-[10px]">
                                          <span className="font-extrabold text-black dark:text-zinc-100">{reply.author}</span>
                                          <span className="text-gray-400 font-mono text-[9px]">{reply.timestamp || 'Just now'}</span>
                                        </div>
                                        <p className="text-xs text-gray-700 dark:text-zinc-300 font-medium pl-1">{reply.text}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[10px] font-mono text-gray-400 italic mb-3">No replies yet. Start the conversation!</p>
                              )}

                              {/* Respond Form */}
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Reply to this comment..."
                                  value={commentReplyInputs[comment.id] || ''}
                                  onChange={(e) => setCommentReplyInputs({...commentReplyInputs, [comment.id]: e.target.value})}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddCommentReply(comment.pathwayId, comment.id);
                                  }}
                                  className="flex-1 border-2 border-black dark:border-zinc-700 px-3 py-1 text-xs text-black dark:text-[#A1A1AA] font-medium focus:outline-none focus:bg-yellow-50 bg-white dark:bg-zinc-950"
                                />
                                <button 
                                  type="button"
                                  onClick={() => handleAddCommentReply(comment.pathwayId, comment.id)}
                                  className="px-3 bg-blue-600 border-2 border-black text-white hover:bg-blue-700 font-black text-[10px] uppercase cursor-pointer"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= POST-10TH STREAM DECISION MODAL ================= */}
      <AnimatePresence>
        {showPost10thChoice && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="border-4 border-black bg-white dark:bg-zinc-900 w-full max-w-xl overflow-hidden relative p-6 md:p-8 text-black dark:text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPost10thChoice(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold bg-white dark:bg-zinc-805 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-black dark:text-white cursor-pointer transition-colors"
              >
                ✕
              </button>

              <div className="text-left space-y-4">
                <span className="text-[10px] font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700 px-2 py-0.5 rounded tracking-wide uppercase">// Path Directive Decider</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-black uppercase text-black dark:text-white">Which stream are you interested in?</h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">Select a direction to scroll down directly to its course and stream list.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <button
                    onClick={() => {
                      setShowPost10thChoice(false);
                      setMapCategoryFilter('Academic');
                      // Scroll to academic section
                      setTimeout(() => {
                        const el = document.getElementById('10th-academic-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 200);
                    }}
                    className="w-full text-left border-2 border-black p-4 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all flex items-center gap-4 group cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]"
                  >
                    <div className="flex-1">
                      <span className="block text-xs font-black uppercase text-sky-800 dark:text-sky-400">Option A // General Studies</span>
                      <strong className="block text-sm font-display font-black uppercase text-black dark:text-white">Intermediate (Academic Groups)</strong>
                      <span className="block text-[11px] text-stone-500 dark:text-zinc-400 font-semibold">MPC (Science), BiPC (Medical), MEC/CEC (Commerce & Arts Groups).</span>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0 text-sky-800 dark:text-sky-300" />
                  </button>

                  <button
                    onClick={() => {
                      setShowPost10thChoice(false);
                      setMapCategoryFilter('Technical');
                      // Scroll to polytechnic section
                      setTimeout(() => {
                        const el = document.getElementById('10th-polytechnic-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 200);
                    }}
                    className="w-full text-left border-2 border-black p-4 bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all flex items-center gap-4 group cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]"
                  >
                    <div className="flex-1">
                      <span className="block text-xs font-black uppercase text-violet-850 dark:text-violet-400">Option B // Hands-on Engineering</span>
                      <strong className="block text-sm font-display font-black uppercase text-black dark:text-white">Polytechnic (Technical Diploma)</strong>
                      <span className="block text-[11px] text-stone-500 dark:text-zinc-400 font-semibold">3-year engineer branches (ECE, CSE, Civil, Mechanical) with Lateral Entry B.Tech.</span>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0 text-violet-850 dark:text-violet-300" />
                  </button>

                  <button
                    onClick={() => {
                      setShowPost10thChoice(false);
                      setMapCategoryFilter('Vocational');
                      // Scroll to jobs / trade section
                      setTimeout(() => {
                        const el = document.getElementById('10th-vocational-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 200);
                    }}
                    className="w-full text-left border-2 border-black p-4 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all flex items-center gap-4 group cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]"
                  >
                    <div className="flex-1">
                      <span className="block text-xs font-black uppercase text-amber-800 dark:text-amber-400">Option C // Direct Job Oriented</span>
                      <strong className="block text-sm font-display font-black uppercase text-black dark:text-white">ITI Trades / Direct Jobs</strong>
                      <span className="block text-[11px] text-stone-500 dark:text-zinc-400 font-semibold">1-2 years technical skill certification leading directly to industrial employment.</span>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0 text-amber-800 dark:text-amber-300" />
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      setShowPost10thChoice(false);
                      setMapCategoryFilter('All');
                    }}
                    className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
                  >
                    Or view all options simultaneously
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ALUMNI INSIGHT FULL BIO DIALOG ================= */}
      {selectedAlumni && (() => {
        const profile = selectedAlumniProfile;
        const journey = profile?.onboardingJourney;

        // Compile flow chart steps dynamically or fallback to default
        let flowChartSteps = [];
        if (profile?.timeline && Array.isArray(profile.timeline) && profile.timeline.length > 0) {
          flowChartSteps = profile.timeline.map((step: any) => ({
            label: step.label || (step.type === 'education' ? 'Academic' : (step.type === 'career' ? 'Career' : 'Milestone')),
            year: step.year,
            courseName: step.courseName || step.title || "",
            schoolName: step.schoolName || step.description || ""
          }));
        } else if (journey?.timeline && Array.isArray(journey.timeline) && journey.timeline.length > 0) {
          flowChartSteps = journey.timeline.map((step: any) => ({
            label: step.label || "Academic Node",
            year: step.year || "",
            courseName: step.courseName || step.description || "",
            schoolName: step.schoolName || ""
          }));
        } else {
          flowChartSteps = getAlumniTimelineSteps(selectedAlumni);
        }

        const fullName = profile?.name || selectedAlumni.name;
        const gradYear = journey?.latestEducation?.year || selectedAlumni.yearCompleted || "2024";
        const spec = journey?.latestEducation?.branch || (selectedAlumni as any).institutionName || "Engineering / Science Core";
        const currentRole = profile?.careerGoal || journey?.latestJob?.title || selectedAlumni.role;

        // Likes, followers, reported details from dynamically synced profile
        const likesVal = profile?.likesCount !== undefined ? profile.likesCount : (selectedAlumni.likes || 0);
        const followersVal = profile?.followersCount !== undefined ? profile.followersCount : 0;
        const hasLiked = user && Array.isArray(profile?.likedBy) && profile.likedBy.includes(user.id);
        const hasFollowed = user && Array.isArray(profile?.followedBy) && profile.followedBy.includes(user.id);
        const totalReports = profile?.reportsCount !== undefined ? profile.reportsCount : 0;

        return (
          <div className="fixed inset-0 z-50 bg-[#FCFBF7] text-neutral-900 flex flex-col md:flex-row h-screen overflow-hidden animate-fade-in font-sans">
            
            {/* Left Side: General Profile Summary Area */}
            <div className="w-full md:w-5/12 lg:w-4/12 flex-shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white p-6 md:p-8 overflow-y-auto flex flex-col justify-between select-none">
              <div className="space-y-6">
                
                {/* Header back navigation tab */}
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setSelectedAlumni(null)}
                    className="flex items-center gap-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-black bg-amber-50 px-3 py-1.5 border-2 border-black hover:bg-amber-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Close Profile
                  </button>
                  <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 uppercase tracking-wide">
                    Mentor ID: {selectedAlumni.id.slice(0, 8)}...
                  </span>
                </div>

                {/* Big Avatar Frame Container */}
                <div className="flex flex-col items-center text-center space-y-3 pt-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 relative flex items-center justify-center">
                    {(() => {
                      const isCurrentUserAlumni = user && (
                        user.id === selectedAlumni.id ||
                        user.id === (selectedAlumni as any).userId ||
                        (user.email && (user.email === selectedAlumni.id || user.email === (selectedAlumni as any).authorEmail || user.email === (selectedAlumni as any).userEmail)) ||
                        (user.name && selectedAlumni.name && user.name.toLowerCase() === selectedAlumni.name.toLowerCase())
                      );
                      const displayAvatar = isCurrentUserAlumni 
                        ? (user.avatar || selectedAlumniProfile?.avatar || selectedAlumni.avatar)
                        : (selectedAlumniProfile?.avatar || selectedAlumniProfile?.photoURL || selectedAlumni.avatar);

                      return (
                        <AvatarDisplay 
                          avatar={displayAvatar} 
                          name={fullName} 
                          className="w-32 h-32 rounded-full bg-stone-105 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden shrink-0" 
                          textClassName="text-4xl font-black font-mono text-amber-950"
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-widest bg-emerald-100 text-emerald-900 border border-black px-2 py-0.5 uppercase mb-1.5 inline-block">
                      Verified Advisory Partner
                    </span>
                    <h3 className="text-3xl font-display font-black uppercase text-black leading-none">{fullName}</h3>
                    <p className="text-xs font-mono font-extrabold text-blue-700 tracking-tight mt-1">{currentRole}</p>
                    <p className="text-[10px] text-gray-505 font-mono">@{selectedAlumni.institution || "DIRPA Counseling Matrix"}</p>
                  </div>
                </div>

                {/* Stats indicators grid: Likes and Followers */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 border-2 border-black bg-rose-50 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[8px] font-mono text-rose-800 uppercase block font-black tracking-widest">ALUMNI FAVORITES</span>
                    <span className="text-xl font-display font-black text-rose-700 block mt-0.5">{likesVal} Likes</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-blue-50 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[8px] font-mono text-blue-800 uppercase block font-black tracking-widest">ACTIVE AUDIENCE</span>
                    <span className="text-xl font-display font-black text-blue-700 block mt-0.5">{followersVal} Followers</span>
                  </div>
                </div>

                {/* Engagement Interactions block: Like, Follow, Report */}
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLikeAlumniProfile(selectedAlumni.id)}
                      className={`flex-1 py-2.5 border-2 border-black font-mono text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 transition-all text-center flex justify-center items-center gap-1.5 cursor-pointer ${
                        hasLiked ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-white hover:bg-neutral-50 text-black'
                      }`}
                    >
                      <span>{hasLiked ? 'Liked' : 'Like'}</span>
                    </button>

                    <button
                      onClick={() => handleFollowAlumniProfile(selectedAlumni.id)}
                      className={`flex-1 py-2.5 border-2 border-black font-mono text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 transition-all text-center flex justify-center items-center gap-1.5 cursor-pointer ${
                        hasFollowed ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white hover:bg-neutral-50 text-black'
                      }`}
                    >
                      <span>{hasFollowed ? 'Following' : 'Follow'}</span>
                    </button>
                  </div>

                  {/* Abuse reporting channel */}
                  <div className="border border-red-200 bg-red-50 p-2.5 text-center space-y-1.5">
                    <p className="text-[8.5px] text-red-700 font-mono">
                      Suspicious profile behavior? Help secure DIRPA guidelines. 3 public flags results in deletion. Current indicators: <span className="font-bold">({totalReports}/3)</span>
                    </p>
                    <button
                      onClick={() => handleReportAlumniProfile(selectedAlumni.id)}
                      className="px-3 py-1 border border-red-400 text-red-600 hover:text-white hover:bg-red-600 font-mono text-[8.5px] font-black uppercase tracking-wider cursor-pointer"
                    >
                      Flag / Report Account
                    </button>
                  </div>
                </div>

                {/* Distilled Strategic Advice Box */}
                <div className="p-4 bg-orange-50 border-2 border-black text-left relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[8px] font-mono font-black text-amber-800 bg-amber-100 border border-black px-1.5 py-0.5 uppercase tracking-wider block w-fit mb-2">
                    Distilled Advice
                  </span>
                  <p className="text-xs text-stone-800 italic leading-relaxed font-sans">
                    "{selectedAlumni.advice || "Focus on building a core foundational knowledge. Consistent hourly progress is far superior to intensive study sessions near deadlines."}"
                  </p>
                </div>

              </div>

              {/* Distilled Bio/Details and Graduation Info at the bottom of left side */}
              <div className="pt-4 border-t border-gray-100 mt-6 select-none space-y-2">
                <div className="text-[10px] text-gray-500 font-mono flex justify-between">
                  <span>GRADUATION STATUS:</span>
                  <span className="font-bold text-black uppercase">{gradYear}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono flex justify-between">
                  <span>DISCIPLINE / SPEC:</span>
                  <span className="font-bold text-black uppercase truncate max-w-[180px]">{spec}</span>
                </div>
              </div>

            </div>

            {/* Right Side: Professional Timeline, Journey Map & Direct Actions */}
            <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto flex flex-col justify-between bg-[#F7F5F0]">
              
              <div className="space-y-8 max-w-4xl text-left">
                
                {/* Right Side Header Section */}
                <div className="border-b-4 border-black pb-6 select-none space-y-6">
                  <div>
                    <span className="text-[10px] font-mono font-black text-[#2563EB] block tracking-widest uppercase">EDUCATION & CAREER HIGHWAYS</span>
                    <h2 className="text-4xl font-display font-black uppercase text-black italic">Interactive Professional Timeline</h2>
                    <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
                      Explore this advisor's custom career progression nodes, academic specializations, and real-life outcomes from high school to current market positioning.
                    </p>
                  </div>

                  {/* STYLIZED HIGH-CONTRAST NEOBRUTALIST DASHBOARD: LIKES & FOLLOWERS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Stat Card 1: Likes */}
                    <div className="relative border-4 border-black bg-rose-50 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex flex-col justify-between overflow-hidden">
                      <div className="absolute -bottom-2 -right-4 text-rose-500/10 pointer-events-none">
                        <Heart className="w-24 h-24 stroke-1 fill-rose-500/5" />
                      </div>
                      <div className="relative z-10">
                        <span className="text-[8px] font-mono font-black text-rose-800 bg-rose-100 border border-black px-2 py-0.5 uppercase tracking-wider block w-fit">
                          Total Endorsements
                        </span>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-4xl md:text-5xl font-display font-black italic text-rose-600 block leading-tight">
                            {likesVal}
                          </span>
                          <span className="text-sm font-mono text-neutral-800 font-extrabold uppercase">
                            Likes
                          </span>
                        </div>
                      </div>
                      <p className="text-[9.5px] text-stone-500 font-mono mt-3 border-t border-rose-200 pt-2 leading-snug relative z-10">
                        Students who saved this advisor profile as a top academic bookmark.
                      </p>
                    </div>

                    {/* Stat Card 2: Followers */}
                    <div className="relative border-4 border-black bg-blue-50 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex flex-col justify-between overflow-hidden">
                      <div className="absolute -bottom-2 -right-4 text-blue-500/10 pointer-events-none">
                        <Users className="w-24 h-24 stroke-1 fill-blue-500/5" />
                      </div>
                      <div className="relative z-10">
                        <span className="text-[8px] font-mono font-black text-blue-800 bg-blue-100 border border-black px-2 py-0.5 uppercase tracking-wider block w-fit">
                          Active Audience
                        </span>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-4xl md:text-5xl font-display font-black italic text-blue-600 block leading-tight">
                            {followersVal}
                          </span>
                          <span className="text-sm font-mono text-neutral-800 font-extrabold uppercase">
                            Followers
                          </span>
                        </div>
                      </div>
                      <p className="text-[9.5px] text-stone-500 font-mono mt-3 border-t border-blue-200 pt-2 leading-snug relative z-10">
                        Subscribed scholars receiving target career counseling insights.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Journey Text Paragraph */}
                <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                  <h4 className="text-[10px] font-mono font-black text-emerald-700 tracking-wider mb-2 uppercase flex justify-between items-center">
                    <span>// Dynamic Journey Overview</span>
                    <span className="text-[9px] text-gray-400 normal-case">({calculateReadingTime(selectedAlumni.experience)})</span>
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans whitespace-pre-line">
                    {selectedAlumni.experience}
                  </p>
                </div>

                {/* THE VERTICAL TIMELINE STACK WITH HIGHLIGHTED CONNECTIONS */}
                <div className="space-y-6 pt-2">
                  <h3 className="text-xs font-mono font-black uppercase text-orange-600 block tracking-widest">// COMPILATION OF HISTORIC STUDY MILESTONES</h3>
                  
                  <div className="relative border-l-4 border-black pl-6 ml-4 space-y-8 py-3 text-left">
                    {flowChartSteps.map((step, idx) => (
                      <div key={idx} className="relative">
                        
                        {/* Circle Indicator on vertical timeline line */}
                        <div className="absolute -left-[32px] top-1.5 w-4 h-4 rounded-full border-2 border-black bg-yellow-300 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                        </div>

                        {/* Step content card */}
                        <div className="border-2 border-black bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-[8px] font-mono font-black text-indigo-900 bg-indigo-100 border border-black px-2 py-0.5 uppercase tracking-wider block w-fit">
                              {step.label}
                            </span>
                            {step.year && (
                              <span className="text-[10px] font-mono font-black text-black bg-stone-100 border border-black px-1.5 py-0.5">
                                Ref Year: {step.year}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-black uppercase text-zinc-950 leading-tight">
                            {step.courseName}
                          </h4>
                          <p className="text-[11px] text-gray-500 font-mono mt-1 font-medium">
                            Institution: {step.schoolName}
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom actionable dashboard options */}
              <div className="border-t-4 border-black pt-6 mt-12 bg-white/75 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left select-none">
                  <h4 className="text-xs font-black uppercase text-black">// Interested in 1-on-1 counseling?</h4>
                  <p className="text-[10px] text-gray-500 font-mono">Establish a direct real-time message thread. It's completely free & verified.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedAlumni(null)}
                    className="px-4 py-2 text-stone-600 bg-white hover:bg-stone-50 border-2 border-black font-mono text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={() => startMentorshipChat(selectedAlumni)}
                    className="px-6 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold uppercase border-2 border-black text-[10px] tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    Message {fullName.split(' ')[0]} Now
                  </button>
                </div>
              </div>

            </div>

          </div>
        );
      })()}

      {/* ================= AI PERSONALIZER QUESTIONNAIRE DRAWER / MODAL ================= */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="border-4 border-black bg-white w-full max-w-3xl overflow-hidden relative">
            
            <button 
              onClick={() => setAiModalOpen(false)}
              className="absolute top-4 right-4 p-2 border-2 border-black bg-white hover:bg-red-50 text-red-600"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="p-6 border-b-2 border-black bg-indigo-50">
              <span className="text-[10px] uppercase font-bold text-indigo-600 font-mono tracking-widest">// Direct AI Core Integrator</span>
              <h3 className="text-3xl font-display font-black uppercase mt-1">Tailored Educational Advice</h3>
              <p className="text-xs text-gray-500">Provide user constraints to query standard server-side algorithms or select a rapid demo preset.</p>
            </div>

            {/* Content Container (Splitted Questionnaire Left, Live AI Results Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b-2 border-black max-h-[420px] overflow-y-auto">
              
              {/* Left Questionnaire Panel */}
              <div className="p-6 space-y-4">
                
                {/* Rapid Preset Selector */}
                <div>
                  <span className="block text-[10px] font-black uppercase text-[#2563EB] tracking-wider mb-2">⚡ RAPID PRESET FILLERS:</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => selectAiPreset('designer')}
                      className={`text-[9px] font-bold uppercase border border-black px-2 py-1 ${aiPresetSelected === 'designer' ? 'bg-[#2563EB] text-white' : 'bg-white hover:bg-gray-50'}`}
                    >
                      Design Tech Specialist
                    </button>
                    <button 
                      onClick={() => selectAiPreset('coder')}
                      className={`text-[9px] font-bold uppercase border border-black px-2 py-1 ${aiPresetSelected === 'coder' ? 'bg-[#2563EB] text-white' : 'bg-white hover:bg-gray-50'}`}
                    >
                      Analytical Coder
                    </button>
                    <button 
                      onClick={() => selectAiPreset('healer')}
                      className={`text-[9px] font-bold uppercase border border-black px-2 py-1 ${aiPresetSelected === 'healer' ? 'bg-[#2563EB] text-white' : 'bg-white hover:bg-gray-50'}`}
                    >
                      Medicine & Clinical
                    </button>
                    <button 
                      onClick={() => selectAiPreset('finance')}
                      className={`text-[9px] font-bold uppercase border border-black px-2 py-1 ${aiPresetSelected === 'finance' ? 'bg-[#2563EB] text-white' : 'bg-white hover:bg-gray-50'}`}
                    >
                      Tax & Commerce
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-2 border-b border-gray-100">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">Academic Level Completed</label>
                    <select 
                      value={aiInputs.level}
                      onChange={(e) => setAiInputs({...aiInputs, level: e.target.value as any})}
                      className="w-full border border-black px-3 py-1.5 text-xs bg-white focus:outline-none"
                    >
                      <option value="10th">Finished 10th Class</option>
                      <option value="12th">Finished 12th Class</option>
                      <option value="Graduation">Finished Graduation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">Desired Duration</label>
                    <input 
                      type="text"
                      placeholder="e.g., 3-4 Years"
                      value={aiInputs.durationPref}
                      onChange={(e) => setAiInputs({...aiInputs, durationPref: e.target.value})}
                      className="w-full border border-black px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">What subjects are of interest?</label>
                  <div className="flex gap-1.5 mb-2">
                    <input
                      type="text"
                      placeholder="Type a subject and hit Enter..."
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = subjectInput.trim();
                          if (val && !aiInputs.interests.includes(val)) {
                            setAiInputs({ ...aiInputs, interests: [...aiInputs.interests, val] });
                            setSubjectInput('');
                          }
                        }
                      }}
                      className="w-full border border-black px-2.5 py-1.5 text-xs focus:outline-none focus:bg-amber-50 text-black placeholder-zinc-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = subjectInput.trim();
                        if (val && !aiInputs.interests.includes(val)) {
                          setAiInputs({ ...aiInputs, interests: [...aiInputs.interests, val] });
                          setSubjectInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase border border-black hover:bg-zinc-800 transition-colors shrink-0"
                    >
                      Add
                    </button>
                  </div>
                  {aiInputs.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {aiInputs.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 border border-black bg-black text-yellow-300"
                        >
                          <span>{interest}</span>
                          <button
                            type="button"
                            onClick={() => setAiInputs({ ...aiInputs, interests: aiInputs.interests.filter(i => i !== interest) })}
                            className="text-yellow-300 hover:text-white font-bold ml-0.5 cursor-pointer"
                            title="Remove subject"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">Specific Career Goal or Dream Job</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., AI Expert, Pediatric Surgeon, Corporate CA"
                    value={aiInputs.careerGoal}
                    onChange={(e) => setAiInputs({...aiInputs, careerGoal: e.target.value})}
                    className="w-full border border-black px-3 py-2 text-xs focus:outline-none focus:bg-amber-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">Budget Bracket</label>
                    <select 
                      value={aiInputs.budget}
                      onChange={(e) => setAiInputs({...aiInputs, budget: e.target.value as any})}
                      className="w-full border border-black px-2 py-1.5 text-xs bg-white focus:outline-none"
                    >
                      <option value="any">Flexible (No limit)</option>
                      <option value="low">Subsidized / Low</option>
                      <option value="medium">Medium Standard</option>
                      <option value="high">Premium / High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">Key Personal Strength</label>
                    <input 
                      type="text"
                      placeholder="e.g., Creative Wireframing, Logic"
                      value={aiInputs.strengths.join(', ')}
                      onChange={(e) => setAiInputs({...aiInputs, strengths: e.target.value.split(',').map(s => s.trim())})}
                      className="w-full border border-black px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Right Live Advisor Panel (Render AI details or loading logs) */}
              <div className="p-6 bg-stone-50 overflow-y-auto">
                <span className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3">// Advisor Response Panel</span>

                {isAiLoading && (
                  <AiAdvisorSkeleton compact={true} />
                )}

                {!isAiLoading && !aiResponse && (
                  <div className="flex flex-col justify-center items-center h-64 text-center">
                    <Sparkles className="w-12 h-12 text-[#2563EB] mb-2 animate-bounce" />
                    <p className="text-xs uppercase font-black tracking-widest mt-1">Ready for counsel</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 max-w-xs">
                      Submit the parameters on the left to activate server-side calculations or select a preset to investigate pathways.
                    </p>
                  </div>
                )}

                {!isAiLoading && aiResponse && (
                  <div className="space-y-6">
                    
                    {/* Display Recommended Pathways */}
                    {aiResponse.recommendedPaths?.map((path: any, index: number) => (
                      <div key={index} className="border-2 border-black bg-white p-4">
                        <span className="text-[9px] uppercase font-black tracking-tight text-blue-600">Suggested stream Route {index + 1}</span>
                        <h4 className="text-sm font-black uppercase mt-0.5">{path.name}</h4>
                        <p className="text-[11px] text-stone-600 mt-1 leading-normal italic">Why it fits: "{path.whyFits}"</p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-1 text-[10px] text-gray-500">
                          <div>⏱ Duration: {path.duration || 'Flexible'}</div>
                          <div>💰 average Fees: {path.estimatedFees || 'Subsidized'}</div>
                        </div>

                        <div className="mt-2.5">
                          <span className="block text-[9px] font-black uppercase text-gray-450 mb-1">core study timeline milestone:</span>
                          <div className="space-y-1">
                            {path.timeline?.slice(0, 3).map((item: string, i: number) => (
                              <p key={i} className="text-[10px] text-gray-700 font-mono leading-tight flex items-start gap-1">
                                <span>✔</span> <span>{item}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Alternatives Display */}
                    {aiResponse.alternatives && aiResponse.alternatives.length > 0 && (
                      <div className="border border-black bg-indigo-50 p-4 rounded-xs">
                        <span className="text-[9px] font-black uppercase tracking-wider text-indigo-900 block mb-2">Alternative Paths:</span>
                        <div className="space-y-2.5">
                          {aiResponse.alternatives.map((alt: any, i: number) => (
                            <div key={i} className="text-[11px]">
                              <p className="font-bold underline uppercase">{alt.name}</p>
                              <p className="text-stone-700 leading-normal mt-0.5">{alt.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Master counselor advice */}
                    <div className="bg-yellow-105 border border-black p-4 text-xs italic text-gray-800 leading-relaxed rounded-xs">
                      <p className="font-bold uppercase tracking-tight not-italic text-black mb-1">Advisor Golden Rule:</p>
                      "{aiResponse.generalAdvice}"
                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 px-6">
              <p className="text-[10px] text-gray-400 font-medium">
                *The recommendations adapt server-side depending on professional market trends.
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setAiModalOpen(false)}
                  className="px-4 py-2 border border-black text-xs font-bold uppercase bg-white hover:bg-stone-100"
                >
                  Close Panel
                </button>
                <button 
                  onClick={handleFetchAiRecommendation}
                  className="px-5 py-2.5 bg-[#2563EB] text-white hover:bg-blue-600 border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]"
                >
                  Generate AI recommendations
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= GOOGLE SINGLE SIGN-ON OVERLAY SECURELY REMOVED AND DEACTIVATED ================= */}
      {false && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div 
            initial={{ scale: 0.9, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="border-4 border-black bg-white w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
          >
            {/* Header / Brand Title Row */}
            <div className="p-6 border-b-2 border-black bg-stone-50 relative flex flex-col items-center text-center">
              <button 
                onClick={() => setGoogleOverlayOpen(false)}
                className="absolute top-4 right-4 p-1.5 border border-black bg-white hover:bg-stone-200 text-black font-bold h-7 w-7 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* google colors lettering */}
              <div className="flex items-center gap-1 font-display font-black text-3xl tracking-tight mb-2 select-none">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              
              <h3 className="text-sm font-sans font-bold text-gray-800">
                {googleAuthMode === 'signin' ? "Sign In to DIRPA via Google Account" : "Register on DIRPA with Google"}
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-mono">// ACCOUNTS.GOOGLE.COM / SECURE HANDSHAKE</p>
            </div>

            {googleLoading ? (
              /* Loading Spinner / Secure Handshake animation state */
              <div className="p-10 flex flex-col items-center justify-center text-center min-h-[250px] space-y-6 bg-white">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-neutral-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#4285F4] border-t-transparent border-l-transparent rounded-full animate-spin"></div>
                  <span className="text-xl font-bold font-sans">🔑</span>
                </div>
                <div className="space-y-1.5">
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-black animate-pulse">Establishing handshake...</p>
                  <p className="text-[10.5px] text-gray-500 font-sans">Retrieving verified credential tokens from Google secure databases.</p>
                </div>
              </div>
            ) : (
              /* Chooser Lists */
              <div className="p-6 space-y-5 bg-white">
                
                {/* SELECT ACCOUNT HEADING */}
                <div>
                  <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Select a certified account:</span>
                  
                  {/* Account lists list options in premium card details */}
                  <div className="space-y-2.5">
                    
                    {/* OPTION 1: Personal Profile user email yagna996@gmail.com */}
                    <button 
                      onClick={() => {
                        setGoogleSelectedEmail('yagna996@gmail.com');
                        handleSubmitGoogleAuth('yagna996@gmail.com', 'Yagna Prasad');
                      }}
                      className="w-full flex items-center justify-between p-3.5 border-2 border-black bg-stone-50 hover:bg-neutral-50 hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 border border-black flex items-center justify-center font-display font-black text-sm text-[#4285F4]">
                          Y
                        </div>
                        <div>
                          <p className="text-xs font-black text-black group-hover:text-blue-600 transition-colors">Yagna Prasad</p>
                          <p className="text-[10.5px] font-mono text-gray-500 font-medium">yagna996@gmail.com</p>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-wider text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5">Approved</span>
                    </button>

                    {/* OPTION 2: Guest student default rahul */}
                    <button 
                      onClick={() => {
                        setGoogleSelectedEmail('rahul.studies@gmail.com');
                        handleSubmitGoogleAuth('rahul.studies@gmail.com', 'Rahul Sharma');
                      }}
                      className="w-full flex items-center justify-between p-3.5 border-2 border-black bg-stone-50 hover:bg-neutral-50 hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 border border-black flex items-center justify-center font-display font-black text-sm text-[#EA4335]">
                          R
                        </div>
                        <div>
                          <p className="text-xs font-black text-black">Rahul Sharma</p>
                          <p className="text-[10.5px] font-mono text-gray-500 font-medium">rahul.studies@gmail.com</p>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-gray-400">Available</span>
                    </button>

                    {/* OPTION 3: Custom Login Option fields */}
                    <div className="border-2 border-black p-3.5 bg-stone-50 space-y-3">
                      <span className="block text-[9.5px] font-black uppercase text-gray-500 tracking-wider">Use custom Google account</span>
                      
                      <div className="space-y-2">
                        <input 
                          type="email" 
                          placeholder="Your email (e.g. name@gmail.com)"
                          value={googleCustomEmail}
                          onChange={(e) => setGoogleCustomEmail(e.target.value)}
                          className="w-full p-2.5 border-2 border-black bg-white focus:outline-none text-xs font-mono font-medium dark:text-black placeholder-gray-400"
                        />
                        <input 
                          type="text" 
                          placeholder="Your display name"
                          value={googleCustomName}
                          onChange={(e) => setGoogleCustomName(e.target.value)}
                          className="w-full p-2.5 border-2 border-black bg-white focus:outline-none text-xs font-medium dark:text-black placeholder-gray-400"
                        />
                      </div>

                      <button 
                        onClick={() => {
                          if (googleCustomEmail) {
                            handleSubmitGoogleAuth(googleCustomEmail, googleCustomName);
                          }
                        }}
                        disabled={!googleCustomEmail}
                        className="w-full py-2.5 bg-black hover:bg-zinc-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white uppercase text-[10.5px] font-black tracking-wider transition-colors border border-black cursor-pointer"
                      >
                        Sign in with custom Google profile
                      </button>
                    </div>

                  </div>
                </div>

                {/* ROLE CONFIGURATION SELECTOR SECTOR */}
                <div className="border-t border-dashed border-black pt-4">
                  <span className="block text-[10.5px] font-black uppercase text-gray-750 tracking-wider mb-2">Configure DIRPA Role Designation:</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setGoogleRole('student')}
                      className={`p-3 border-2 border-black text-left cursor-pointer transition-all ${googleRole === 'student' ? 'bg-indigo-50 border-indigo-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold uppercase text-black">Student</span>
                      </div>
                      <p className="text-[9px] text-gray-500 font-medium mt-1 leading-normal">For Class 10/12 exploring degree roadmaps & professional scopes.</p>
                    </button>

                    <button 
                      onClick={() => setGoogleRole('alumni')}
                      className={`p-3 border-2 border-black text-left cursor-pointer transition-all ${googleRole === 'alumni' ? 'bg-amber-50 border-amber-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold uppercase text-black">Mentor</span>
                      </div>
                      <p className="text-[9px] text-gray-500 font-medium mt-1 leading-normal">For graduates or working alumni giving mentorship & paths.</p>
                    </button>
                  </div>
                </div>

                {/* Secure policy statement */}
                <p className="text-[8.5px] text-center text-gray-400 font-normal leading-relaxed">
                  By signing in through the secure Google Simulation Layer, you agree to access pre-verified data nodes, curriculum criteria, and dynamic alumni chatrooms under standard telemetry norms.
                </p>

              </div>
            )}

          </motion.div>
        </div>
      )}

      {/* ================= BOTH CUSTOM POPUPS / MODALS ================= */}
      {/* Instagram-style Photo Action Sheet Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" id="photo-customization-modal">
          <div className="bg-white border-2 border-black w-full max-w-sm rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-6 text-center border-b border-black bg-amber-50">
              <h3 className="text-lg font-display font-black uppercase text-black">Change Profile Photo</h3>
              <p className="text-xs text-gray-600 mt-1">Select an image from gallery, take a photo with camera, or remove photo.</p>
            </div>
            
            <div className="flex flex-col font-sans">
              <button
                type="button"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                  setShowPhotoModal(false);
                }}
                className="py-3.5 px-4 text-xs font-black uppercase tracking-wider text-blue-700 hover:bg-blue-50 border-b border-black transition-colors focus:outline-none cursor-pointer text-center flex items-center justify-center gap-2"
              >
                🖼️ From gallery
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPhotoModal(false);
                  setShowCameraModal(true);
                }}
                className="py-3.5 px-4 text-xs font-black uppercase tracking-wider text-emerald-700 hover:bg-emerald-50 border-b border-black transition-colors focus:outline-none cursor-pointer text-center flex items-center justify-center gap-2"
              >
                📷 Take photo
              </button>

              <button
                type="button"
                onClick={handleRemovePhoto}
                className="py-3.5 px-4 text-xs font-bold text-red-600 hover:bg-red-50 border-b border-black transition-colors focus:outline-none cursor-pointer text-center flex items-center justify-center gap-2"
              >
                🗑️ Remove photo
              </button>

              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="py-3.5 px-4 text-xs font-black uppercase text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={(dataUrl) => {
          handleUpdateAvatarDirectly(dataUrl);
        }}
      />

      {/* Custom Confirmation Modal for Delete Account */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" id="delete-account-confirmation-modal">
          <div className="bg-white border-2 border-black w-full max-w-sm rounded-xl overflow-hidden">
            <div className="p-6 text-center border-b border-black bg-red-50">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600 border border-red-200 flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-display font-black uppercase text-red-600">Delete Account</h3>
              <p className="text-xs text-gray-700 font-bold mt-2 leading-relaxed">
                Are you sure you want to permanently delete your account? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex font-sans border-t border-black">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-4 text-xs font-black uppercase text-red-600 hover:bg-red-50 border-r border-black transition-colors focus:outline-none cursor-pointer text-center"
                id="confirm-delete-action-button"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 text-xs font-black uppercase text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer text-center"
                id="cancel-delete-action-button"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Report Account Dialog Popup */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" id="report-account-modal">
          <div className="bg-white border-4 border-black w-full max-w-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-sans">
            {/* Header */}
            <div className="p-4 bg-amber-50 border-b-4 border-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-black flex items-center justify-center text-amber-950 font-bold shrink-0 text-xl">
                ⚠️
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black uppercase text-black tracking-wider">Flag Mentor Account</h3>
                <p className="text-[10px] text-stone-600 font-mono">DIRPA Guidelines & Abuse reporting channel</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-5 space-y-4 text-left">
              <p className="text-[11px] text-stone-700 leading-relaxed font-mono">
                Submit a flag against this advisor's profile for suspicious, harmful, or misleading behavior. Accounts receiving three reports are automatically deleted and banned.
              </p>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-700 tracking-wider mb-1.5 font-mono">
                  Report Category:
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 border-2 border-black font-mono text-xs focus:bg-amber-50 outline-none bg-white rounded-none cursor-pointer"
                >
                  <option value="Spam or Advertising">Spam or Advertising</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Misleading or Fake Profile">Misleading or Fake Profile</option>
                  <option value="Abusive Language or Harassment">Abusive Language or Harassment</option>
                  <option value="Other Policy Violation">Other Policy Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-700 tracking-wider mb-1.5 font-mono">
                  Detailed Explanation:
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Please state the specific reasons, violations, or discrepancies you observed on this mentor's profile..."
                  rows={4}
                  className="w-full p-2.5 border-2 border-black font-mono text-xs focus:bg-amber-50 outline-none bg-white rounded-none placeholder-gray-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex border-t-2 border-black">
              <button
                type="button"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportingAlumniId(null);
                }}
                className="flex-1 py-3 text-xs font-black uppercase text-gray-700 hover:bg-neutral-100 border-r-2 border-black transition-colors focus:outline-none cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitAlumniProfileReport}
                className="flex-1 py-3 text-xs font-black uppercase bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none cursor-pointer text-center"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 100% FULL-PAGE VIEW 1: COURSE SYLLABUS, FEEDBACK & POTENTIAL JOBS ================= */}
      {selectedCourseModal && !selectedJobModal && (
        <div className="fixed inset-0 z-[120] bg-[#FDFBF7] text-black overflow-y-auto flex flex-col min-h-screen w-full animate-fade-in select-text">
          {/* Top Full-Width Sticky Navigation Header */}
          <header className="bg-black text-white p-5 md:p-6 border-b-4 border-black sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedCourseModal(null)}
                    className="px-3 py-1.5 text-xs font-mono font-black uppercase bg-stone-800 hover:bg-stone-700 text-white border border-stone-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                  >
                    ← Back to Main Dashboard
                  </button>
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-emerald-500 text-black px-2.5 py-1">
                    Course Syllabus Page
                  </span>
                  <span className="text-[10px] font-mono text-stone-300">
                    ⏱ {selectedCourseModal.duration} • 💰 {selectedCourseModal.estimatedFees}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-display font-black uppercase text-white tracking-wide">
                  🎓 {selectedCourseModal.name}
                </h1>
              </div>
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white border-2 border-black font-display font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer shrink-0"
              >
                Exit View ✕
              </button>
            </div>
          </header>

          {/* Full Page Content */}
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8 flex-1">
            
            {/* Overview & Fit explanation */}
            <div className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Course Overview & Academic Scope
              </h2>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {selectedCourseModal.description}
              </p>
              {selectedCourseModal.whyFits && (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-4 text-xs text-emerald-950 font-semibold italic">
                  <strong>Why it fits your profile:</strong> "{selectedCourseModal.whyFits}"
                </div>
              )}
            </div>

            {/* 1. Course Syllabus & Curriculum */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-display font-black uppercase text-black">
                  1. Detailed Course Syllabus & Curriculum
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCourseModal.syllabus?.map((sem: any, idx: number) => (
                  <div key={idx} className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <span className="text-[10px] font-mono font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-1 border border-blue-200 inline-block">
                      {sem.semesterOrYear || `Phase ${idx + 1}`}
                    </span>
                    <h3 className="text-base font-black uppercase text-black">
                      {sem.title}
                    </h3>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-500 uppercase block">Core Topics & Modules:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {sem.topics?.map((topic: string, tIdx: number) => (
                          <span key={tIdx} className="text-xs font-semibold bg-stone-100 border border-stone-300 px-2.5 py-0.5 text-stone-800">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    {sem.learningOutcome && (
                      <p className="text-xs text-stone-700 font-medium italic border-t border-dashed border-stone-200 pt-3 mt-2">
                        🎯 <strong>Outcome:</strong> {sem.learningOutcome}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Genuine Alumni Reviews & Student Insights */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-display font-black uppercase text-black">
                  2. Genuine Alumni Reviews & Student Insights
                </h2>
              </div>

              {(() => {
                const realCourseFeedbacks = courseReviews.filter(f =>
                  isCourseIdEquivalent(f.courseId, selectedCourseModal.id) ||
                  isCourseIdEquivalent(f.courseId, selectedCourseModal.code) ||
                  isCourseIdEquivalent(f.courseId, selectedCourseModal.name)
                );
                if (realCourseFeedbacks.length === 0) {
                  return (
                    <div className="border-2 border-dashed border-stone-300 bg-white p-8 text-center space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <MessageSquare className="w-8 h-8 text-stone-400 mx-auto" />
                      <p className="text-xs font-black uppercase tracking-wider text-stone-700">No Genuine Database Reviews Yet</p>
                      <p className="text-xs text-stone-500 font-medium max-w-md mx-auto">
                        There are currently no user-submitted reviews for this course in the database.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {realCourseFeedbacks.map((fb: any, fbIdx: number) => (
                      <div key={fbIdx} className="border-2 border-black bg-amber-50/90 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <h3 className="text-sm font-black uppercase text-black">{fb.name || fb.authorEmail || "Verified Student/Alumni"}</h3>
                            <p className="text-xs font-mono text-stone-600">{fb.institutionName || fb.company || "Alumni Contributor"}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-300 border-2 border-black px-2 py-0.5 text-xs font-black">
                            <span>⭐ {(fb.overallRating || fb.rating || 5).toFixed(1)} / 5</span>
                          </div>
                        </div>
                        <div className="border-t border-dashed border-stone-300 pt-2">
                          <TranslatableText text={fb.feedbackText || fb.experience || ""} className="text-xs text-stone-800 leading-relaxed italic font-medium" />
                        </div>
                        {fb.advice && (
                          <p className="text-[11px] font-bold text-amber-950 bg-amber-200/80 p-2.5 border border-amber-400">
                            💡 Pro Tip: {fb.advice}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* 3. Potential Jobs & Career Pathways */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <Briefcase className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-display font-black uppercase text-black">
                  3. Potential Jobs & Career Opportunities
                </h2>
              </div>
              <p className="text-xs text-stone-600 font-medium">
                Click on any job role below to navigate to its 100% full-page job specification!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCourseModal.jobs?.map((job: any, jIdx: number) => (
                  <div 
                    key={jIdx}
                    onClick={() => setSelectedJobModal(job)}
                    className="group border-2 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-purple-50 hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-mono font-black uppercase bg-purple-100 text-purple-900 border border-black px-2.5 py-0.5">
                          Career Post #{jIdx + 1}
                        </span>
                        <span className="text-xs font-black text-purple-700 group-hover:translate-x-1 transition-transform">
                          Open Full Page →
                        </span>
                      </div>
                      <h3 className="text-lg font-black uppercase text-black mt-2 group-hover:text-purple-800">
                        💼 {job.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed mt-1 line-clamp-3 font-medium">
                        {job.shortDescription || job.fullOverview}
                      </p>
                    </div>

                    <div className="border-t border-dashed border-stone-300 pt-3 flex flex-wrap justify-between items-center text-xs font-mono font-bold text-stone-600">
                      <span>💰 Salary: <strong className="text-emerald-700">{job.salaryRange?.entry || 'Competitive'}</strong></span>
                      <span className="text-purple-700 underline font-black uppercase text-xs">View Specification →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>

          {/* Full Page Footer */}
          <footer className="p-6 bg-stone-100 border-t-2 border-black flex justify-between items-center text-xs font-mono shrink-0">
            <span className="text-stone-500 font-medium">DIRPA Academic Knowledge Engine — Full Page Course View</span>
            <button
              onClick={() => setSelectedCourseModal(null)}
              className="px-5 py-2 border-2 border-black bg-black text-white font-black uppercase hover:bg-stone-800 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              ← Back to Main Dashboard
            </button>
          </footer>
        </div>
      )}

      {/* ================= 100% FULL-PAGE VIEW 2: FULL DETAILED JOB SPECIFICATION ================= */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-[130] bg-stone-50 text-black overflow-y-auto flex flex-col min-h-screen w-full animate-fade-in select-text">
          {/* Top Full-Width Sticky Navigation Header */}
          <header className="bg-purple-950 text-white p-5 md:p-6 border-b-4 border-black sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedJobModal(null)}
                    className="px-3 py-1.5 text-xs font-mono font-black uppercase bg-purple-800 hover:bg-purple-700 text-white border border-purple-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                  >
                    ← Back to Course Details
                  </button>
                  <span className="text-[10px] font-mono font-black uppercase text-amber-300 bg-purple-900 border border-purple-700 px-2.5 py-1">
                    Job Specification Page
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-display font-black uppercase text-white tracking-wide">
                  💼 {selectedJobModal.title}
                </h1>
              </div>
              <button
                onClick={() => {
                  setSelectedJobModal(null);
                  setSelectedCourseModal(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white border-2 border-black font-display font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer shrink-0"
              >
                Exit to Main Dashboard ✕
              </button>
            </div>
          </header>

          {/* Full Page Content */}
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8 flex-1">
            
            {/* Role Overview */}
            <div className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-purple-900 border-b-2 border-black pb-2">
                📌 Comprehensive Role Overview
              </h2>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {selectedJobModal.fullOverview || selectedJobModal.shortDescription}
              </p>
            </div>

            {/* Responsibilities */}
            {selectedJobModal.responsibilities && selectedJobModal.responsibilities.length > 0 && (
              <div className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-purple-900 border-b-2 border-black pb-2">
                  🛠️ Primary Day-to-Day Responsibilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedJobModal.responsibilities.map((resp: string, rIdx: number) => (
                    <div key={rIdx} className="bg-stone-50 border border-black/20 p-3 text-xs text-stone-800 flex items-start gap-2 leading-relaxed font-medium">
                      <span className="text-purple-700 font-black">▶</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Skills */}
            {selectedJobModal.requiredSkills && selectedJobModal.requiredSkills.length > 0 && (
              <div className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-purple-900 border-b-2 border-black pb-2">
                  ⚡ Key Required Skills & Competencies
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {selectedJobModal.requiredSkills.map((skill: string, sIdx: number) => (
                    <span key={sIdx} className="text-xs font-bold bg-purple-100 border-2 border-black px-3.5 py-1.5 text-purple-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Salary Matrix */}
            {selectedJobModal.salaryRange && (
              <div className="border-2 border-black bg-emerald-50 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b-2 border-black pb-2">
                  💵 Market Salary Benchmarks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white border-2 border-black p-4 space-y-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">Entry Level (0-2 Yrs)</span>
                    <p className="text-base font-black text-emerald-800">{selectedJobModal.salaryRange.entry || '₹5L - ₹9L PA'}</p>
                  </div>
                  <div className="bg-white border-2 border-black p-4 space-y-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">Mid Level (3-6 Yrs)</span>
                    <p className="text-base font-black text-emerald-800">{selectedJobModal.salaryRange.mid || '₹12L - ₹20L PA'}</p>
                  </div>
                  <div className="bg-white border-2 border-black p-4 space-y-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">Senior / Lead (7+ Yrs)</span>
                    <p className="text-base font-black text-emerald-800">{selectedJobModal.salaryRange.senior || '₹25L - ₹50L+ PA'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Growth Scope & Top Recruiters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedJobModal.growthScope && (
                <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                  <h3 className="text-xs font-black uppercase text-black">📈 Career Trajectory & Growth Scope</h3>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">{selectedJobModal.growthScope}</p>
                </div>
              )}

              {selectedJobModal.topRecruiters && selectedJobModal.topRecruiters.length > 0 && (
                <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                  <h3 className="text-xs font-black uppercase text-black">🏢 Top Hiring Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobModal.topRecruiters.map((rec: string, rIdx: number) => (
                      <span key={rIdx} className="text-xs font-mono font-bold bg-stone-100 border border-black px-2.5 py-1 text-stone-900">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Certifications */}
            {selectedJobModal.recommendedCertifications && selectedJobModal.recommendedCertifications.length > 0 && (
              <div className="border-2 border-black bg-blue-50 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <h3 className="text-xs font-black uppercase text-blue-900">🎓 Recommended Industry Certifications</h3>
                <div className="space-y-1.5">
                  {selectedJobModal.recommendedCertifications.map((cert: string, cIdx: number) => (
                    <p key={cIdx} className="text-xs text-blue-950 font-medium flex items-center gap-2">
                      <span className="text-blue-700 font-bold">✔</span> <span>{cert}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Genuine Practitioner Reviews from Database */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <MessageSquare className="w-6 h-6 text-purple-700" />
                <h2 className="text-xl font-display font-black uppercase text-black">
                  Practitioner Reviews & Verified Feedback
                </h2>
              </div>

              {(() => {
                const realJobFeedbacks = courseReviews.filter(f =>
                  isCourseIdEquivalent(f.courseId, selectedJobModal.id) ||
                  isCourseIdEquivalent(f.courseId, selectedJobModal.title)
                );
                if (realJobFeedbacks.length === 0) {
                  return (
                    <div className="border-2 border-dashed border-stone-300 bg-white p-8 text-center space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <MessageSquare className="w-8 h-8 text-stone-400 mx-auto" />
                      <p className="text-xs font-black uppercase tracking-wider text-stone-700">No Genuine Database Reviews Yet</p>
                      <p className="text-xs text-stone-500 font-medium max-w-md mx-auto">
                        There are currently no user-submitted practitioner reviews for this job role in the database.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {realJobFeedbacks.map((f: any, fIdx: number) => (
                      <div key={fIdx} className="bg-stone-50 border-2 border-black p-5 text-xs font-semibold space-y-3 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="font-mono font-black text-sm text-black block">{f.name || f.user || "Verified Practitioner"}</span>
                              <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block mt-0.5">{f.company || f.institutionName || "Industry Contributor"}</span>
                            </div>
                            <span className="bg-[#8B5CF6] text-white font-mono text-[9px] font-black px-2 py-0.5 border border-[#7c3aed]">
                              ★ Rating: {(f.overallRating || f.rating || 5).toFixed(1)} / 5.0
                            </span>
                          </div>
                          <div className="pt-2 border-t border-dashed border-stone-200">
                            <TranslatableText text={f.feedbackText || f.experience || ""} className="text-neutral-700 leading-relaxed font-medium italic" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </main>

          {/* Job Footer */}
          <footer className="p-6 bg-purple-950 border-t-2 border-black flex justify-between items-center text-xs text-white font-mono shrink-0">
            <button
              onClick={() => setSelectedJobModal(null)}
              className="px-4 py-2 border border-purple-400 bg-purple-900 hover:bg-purple-800 text-white font-bold uppercase transition-all cursor-pointer"
            >
              ← Back to Course Details
            </button>
            <button
              onClick={() => {
                setSelectedJobModal(null);
                setSelectedCourseModal(null);
              }}
              className="px-5 py-2 border-2 border-black bg-white text-black font-black uppercase hover:bg-stone-200 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              Back to Main Dashboard
            </button>
          </footer>
        </div>
      )}

      {/* ================= DELAYED USER FEEDBACK PROMPT MODAL / TOAST ================= */}
      <AnimatePresence>
        {showDelayedFeedbackPrompt && user && !user.hasSubmittedPlatformFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-4 sm:right-8 z-[120] max-w-md w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 border-2 border-black p-5 md:p-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl relative text-black dark:text-white"
          >
            <button
              type="button"
              onClick={handleDismissPromptFeedback}
              className="absolute top-3.5 right-3.5 p-1 text-stone-500 hover:text-black dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-black cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {promptFeedbackSuccess ? (
              <div className="py-4 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 border-2 border-black rounded-full flex items-center justify-center mx-auto text-2xl">
                  🌟
                </div>
                <h4 className="text-base font-display font-black uppercase text-black dark:text-white">
                  Thank You for Your Review!
                </h4>
                <p className="text-xs text-stone-600 dark:text-zinc-300 font-medium">
                  Your feedback helps DIRPA empower thousands of students across their career roadmaps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPromptFeedback} className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-black flex items-center justify-center text-amber-900 font-black text-lg shrink-0">
                    💬
                  </div>
                  <div className="pr-4">
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      DIRPA User Review
                    </span>
                    <h3 className="text-sm md:text-base font-display font-black uppercase text-black dark:text-white leading-tight">
                      How is your experience with DIRPA so far? Leave a review!
                    </h3>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-xs font-bold text-stone-600 dark:text-zinc-300 mr-2">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserPromptFeedbackRating(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= userPromptFeedbackRating
                            ? "fill-amber-400 text-amber-500"
                            : "text-stone-300 dark:text-zinc-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Text area */}
                <div>
                  <textarea
                    rows={3}
                    value={userPromptFeedbackComment}
                    onChange={(e) => setUserPromptFeedbackComment(e.target.value)}
                    placeholder="Tell us what you think or how DIRPA helped your career journey..."
                    className="w-full p-3 text-xs font-sans border-2 border-black bg-stone-50 dark:bg-zinc-800 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-zinc-900 text-black dark:text-white placeholder-stone-400"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDismissPromptFeedback}
                    className="px-3.5 py-2 border border-stone-300 dark:border-zinc-700 hover:border-black text-[11px] font-bold uppercase text-stone-600 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Maybe Later
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPromptFeedback || !userPromptFeedbackComment.trim()}
                    className="px-4 py-2 bg-black hover:bg-stone-800 text-yellow-300 font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmittingPromptFeedback ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-300" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= INFINITE SCROLLING TESTIMONIAL MARQUEE (Home Page Only) ================= */}
      {((currentView === 'landing') || (currentView === 'dashboard' && !selectedPathway && searchMethod === 'none')) && (
        <section id="testimonial-marquee-section" className="w-full bg-[#f8fafc] dark:bg-zinc-950 py-10 border-t-2 border-black overflow-hidden relative select-none mt-auto">
          <div className="max-w-7xl mx-auto px-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              
              <h3 className="text-xl md:text-2xl font-display font-black uppercase text-black dark:text-white">
                {t('reviews.header', 'What DIRPA Users Say')}
              </h3>
            </div>
            
          </div>

          {/* Marquee Track Container */}
          <div className="w-full overflow-hidden relative py-2">
            {/* Subtle gradient edges for smooth fading */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#f8fafc] dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#f8fafc] dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

            {(() => {
              const dbItems = platformReviews.map(f => {
                const isCurrentUser = user && (
                  f.userId === user.id ||
                  f.userEmail === user.email ||
                  f.authorEmail === user.email ||
                  f.email === user.email ||
                  (user.name && f.name && f.name.toLowerCase() === user.name.toLowerCase())
                );
                const avatarToUse = isCurrentUser ? (user.avatar || f.avatar) : f.avatar;
                return {
                  id: f.id || f.feedbackId,
                  name: f.name || 'DIRPA Student',
                  role: f.role || f.educationalStage || 'Student Reviewer',
                  feedbackText: f.feedbackText || f.comment || f.experience || 'Great platform for academic career navigation!',
                  avatar: avatarToUse || '',
                  overallRating: f.overallRating || 5
                };
              });

              if (dbItems.length === 0) {
                return (
                  <div className="max-w-xl mx-auto my-4 p-6 border-2 border-dashed border-stone-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-center space-y-2">
                    <Quote className="w-8 h-8 text-amber-500 mx-auto opacity-80" />
                    <p className="text-sm font-bold text-black dark:text-white uppercase tracking-tight">
                      {t('reviews.noReviews', 'No Community Feedbacks Yet')}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-zinc-400">
                      {t('reviews.noReviewsDesc', 'Be the first student or alumni mentor to share your review! Head to your Profile section to submit feedback.')}
                    </p>
                  </div>
                );
              }

              let marqueeList = dbItems;
              if (dbItems.length < 6) {
                while (marqueeList.length < 12) {
                  marqueeList = [...marqueeList, ...dbItems];
                }
              } else {
                marqueeList = [...dbItems, ...dbItems];
              }

              return (
                <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] py-2">
                  {marqueeList.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="w-[300px] sm:w-[360px] shrink-0 bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <AvatarDisplay 
                              avatar={item.avatar} 
                              name={item.name} 
                              className="w-10 h-10 rounded-full border border-stone-200 dark:border-zinc-700 bg-amber-100 flex items-center justify-center shrink-0" 
                            />
                            <div className="min-w-0 pr-2">
                              <h4 className="font-bold text-sm text-black dark:text-white truncate">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-stone-500 dark:text-zinc-400 font-medium truncate">
                                {item.role}
                              </p>
                            </div>
                          </div>

                          {/* Subtle grey quotation mark icon */}
                          <Quote className="w-6 h-6 text-stone-300 dark:text-zinc-600 shrink-0 transform rotate-180" />
                        </div>

                        {/* Card Body */}
                        <p className="text-xs md:text-sm text-stone-600 dark:text-zinc-300 font-sans leading-relaxed line-clamp-4">
                          "{item.feedbackText}"
                        </p>
                      </div>

                      {/* Rating footer */}
                      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (item.overallRating || 5)
                                ? "fill-amber-400 text-amber-400"
                                : "text-stone-200 dark:text-zinc-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ================= AGENCY-STYLE CONTACT & FOOTER SECTION (Home Page Only) ================= */}
      {((!user && currentView === 'landing') || (user && currentView === 'dashboard' && !selectedPathway && searchMethod === 'none')) && (
        <div className="w-full bg-white dark:bg-zinc-950 border-t-2 border-black text-left mt-12 font-sans shrink-0">
        {/* TOP BANNER SECTION (White / Light Background with Lime/Yellow Circle Arrow Button) */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-2 border-black relative">
          
          {/* Left Sub-eyebrow + Main Heading */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-mono font-black uppercase text-stone-700 dark:text-zinc-300 tracking-wider">
                HEARD ENOUGH? →
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase">
                ⚡ Direct Connect
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black uppercase text-black dark:text-white tracking-tight leading-none">
              Contact <span className="relative inline-block border-b-4 border-lime-400 dark:border-lime-400 pb-0.5">us</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 font-medium max-w-lg leading-relaxed">
              Got questions about streams, entrance exams, or scholarships? Reach out directly to our advisory team or drop us a message anytime!
            </p>
          </div>

          {/* Right Neon Yellow Circular Button */}
          <div className="flex items-center gap-4 shrink-0">
            <a 
              href="mailto:dirpa@ai.gmail.com"
              className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-lime-400 hover:bg-lime-300 dark:bg-lime-400 dark:hover:bg-lime-300 text-black rounded-full border-2 sm:border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Send Email to DIRPA"
            >
              <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 text-black transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>

        {/* BOTTOM MAIN FOOTER BLOCK (Black / Dark Slate Background) */}
        <div className="bg-stone-900 dark:bg-black text-stone-100 py-12 md:py-16 px-6 sm:px-12 md:px-16 border-b-2 border-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8">
            
            {/* COLUMN 1: BRAND STATEMENT (Lg: col-span-4) */}
            <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-4">
              <div className="flex items-center gap-2">
                <DirpaLogo styleName={activeLogo} variant="icon" size="md" />
                <span className="text-sm font-mono font-black tracking-widest text-lime-400 uppercase">
                  DIRPA PLATFORM
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white leading-tight">
                The platform for ambitious minds®
              </h3>

              <p className="text-xs sm:text-sm text-stone-400 font-medium leading-relaxed">
                Empowering Indian students across 10th, 12th, Polytechnic, and Higher Education with AI-driven academic roadmaps, entrance exam insights, and verified scholarship matches.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono uppercase">
                <span className="bg-stone-800 border border-stone-700 text-stone-300 px-2.5 py-1 rounded"> AI Career Compass</span>
                <span className="bg-stone-800 border border-stone-700 text-stone-300 px-2.5 py-1 rounded"> Verified Scholarships</span>
                <span className="bg-stone-800 border border-stone-700 text-stone-300 px-2.5 py-1 rounded"> Alumni Mentorship</span>
              </div>
            </div>

            {/* COLUMN 2: HEADQUARTERS & DIRECT CONTACT (Lg: col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="border-b border-stone-800 pb-2">
                <span className="text-[11px] font-mono font-bold tracking-widest text-stone-400 uppercase block">
                  DIRECT REACH
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                {/* Email */}
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Official Email</span>
                  <a 
                    href="mailto:dirpa@ai.gmail.com" 
                    className="text-white hover:text-lime-300 font-mono font-bold underline transition-colors break-all flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                    dirpa@ai.gmail.com
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Helpline / WhatsApp</span>
                  <a 
                    href="tel:6301599660" 
                    className="text-white hover:text-lime-300 font-mono font-bold underline transition-colors flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                    +91 63015 99660
                  </a>
                </div>

                {/* Location */}
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Office Location</span>
                  <p className="text-stone-300 text-xs font-medium leading-normal mt-0.5">
                    VIT AP University, Amaravathi, Andhra Pradesh, India
                  </p>
                </div>

                {/* Quick links */}
                <div className="pt-1 flex flex-col gap-1.5 items-start">
                  <button 
                    onClick={() => { setSelectedNav('about'); setCurrentView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-xs font-mono font-bold uppercase text-white hover:text-lime-300 underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    ABOUT US ➔
                  </button>
                  <button 
                    onClick={() => { setSelectedNav('ai-advisor'); setCurrentView('ai-advisor'); }}
                    className="text-xs font-mono font-bold uppercase text-lime-400 hover:text-lime-300 underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    CHAT WITH AI ADVISOR ↗
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 3: STUDENT SUPPORT & HOURS (Lg: col-span-2) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="border-b border-stone-800 pb-2">
                <span className="text-[11px] font-mono font-bold tracking-widest text-stone-400 uppercase block">
                  STUDENT SUPPORT
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Advisory Desk</span>
                  <span className="text-stone-200 font-medium text-xs block mt-0.5">
                    Free Academic Mentorship for 10th, 12th & College Students
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Working Hours</span>
                  <span className="text-stone-300 font-mono text-xs block mt-0.5">
                    Mon – Sat: 9:00 AM – 8:00 PM IST
                  </span>
                </div>

                <div className="p-2.5 bg-stone-800/80 border border-stone-700/80 rounded text-[11px] text-stone-300 italic">
                  “Because no career question should wait until Monday morning!”
                </div>

                <div className="pt-1">
                  <button 
                    onClick={() => { setSelectedNav('scholarships'); setCurrentView('scholarships'); }}
                    className="text-xs font-mono font-bold uppercase text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    EXPLORE SCHOLARSHIPS ↗
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 4: NEWSLETTER & SOCIALS (Lg: col-span-3) */}
            <div className="lg:col-span-3 space-y-5">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-stone-400 uppercase block mb-1">
                  WANT TO BE THE SMARTEST IN YOUR CLASS?
                </span>

                {/* Interactive Newsletter Form */}
                <NewsletterSignupForm />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-stone-400 uppercase block mb-2">
                  FOLLOW OUR JOURNEY
                </span>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 hover:text-lime-300 transition-colors rounded"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 hover:text-pink-400 transition-colors rounded"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a 
                    href="mailto:dirpa@ai.gmail.com" 
                    className="p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 hover:text-amber-300 transition-colors rounded"
                    title="Email Us"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* SUB-FOOTER COPYRIGHT BAR */}
          <div className="max-w-7xl mx-auto border-t border-stone-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-stone-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>© 2026 DIRPA GUIDANCE SERVICES • ALL RIGHTS RESERVED</span>
            </div>

          </div>
        </div>
      </div>
      )}

    </div>
  );
}
