import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, Calendar, DollarSign, FileCheck, Award, 
  ExternalLink, MessageSquare, Sparkles, ArrowLeft, CheckCircle2, 
  HelpCircle, ChevronRight, ShieldCheck, GraduationCap, Clock, AlertCircle, RefreshCw,
  Star, Plus, Trash2, Edit3, User, Send, X
} from 'lucide-react';
import Markdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AlumniInsight } from '../types';
import { ExamReportSkeleton } from './SkeletonLayouts';

export interface EntranceExamDetails {
  id: string;
  name: string;
  fullForm: string;
  category: 'Engineering' | 'Medical' | 'Management' | 'Law' | 'Design' | 'Defense' | 'General' | 'Civil Services';
  conductingBody: string;
  examFrequency: string;
  mode: string;
  duration: string;
  structureAndFormat: string;
  eligibility: string;
  syllabusOverview: string[];
  expectedDates2026: {
    regWindow: string;
    admitCardDate: string;
    examDates: string;
    resultDate: string;
  };
  fees: {
    generalMale: string;
    generalFemale: string;
    reservedCategory: string;
    international?: string;
  };
  documentsRequired: string[];
  applicationSteps: string[];
  coursesUnlocked: string[];
  topAcceptingColleges: string[];
  careerUseAndOutcome: string;
  officialLinks: { title: string; url: string }[];
}

// Preset comprehensive entrance exam database
const PRESET_ENTRANCE_EXAMS: EntranceExamDetails[] = [
  {
    id: 'jee-main',
    name: 'JEE Main 2026',
    fullForm: 'Joint Entrance Examination (Main)',
    category: 'Engineering',
    conductingBody: 'National Testing Agency (NTA)',
    examFrequency: 'Twice a year (Session 1 & Session 2)',
    mode: 'Computer Based Test (CBT)',
    duration: '3 Hours (180 minutes) / 4 Hours for PwD',
    structureAndFormat: 'Paper 1 (B.E./B.Tech): Physics, Chemistry, Mathematics. 90 total questions (attempt 75). Section A: 20 MCQs (+4 for correct, -1 for incorrect). Section B: 10 Numerical questions (attempt any 5, +4/-1). Maximum 300 Marks.',
    eligibility: 'Passed Class 12 or appearing in 2026 with Physics, Mathematics, and Chemistry/Biotechnology/Technical Vocational. No upper age limit. Maximum 3 consecutive years of attempts allowed after 12th.',
    syllabusOverview: [
      'Physics: Mechanics, Thermodynamics, Electromagnetism, Modern Physics, Optics, Kinematics',
      'Chemistry: Physical Chemistry (Equilibrium, Electrochemistry), Organic (Reaction Mechanisms), Inorganic (P-block, Coordination Compounds)',
      'Mathematics: Calculus (Integration/Differentiation), Algebra (Matrices, Vectors, 3D Geometry), Coordinate Geometry, Probability'
    ],
    expectedDates2026: {
      regWindow: 'Nov 2025 - Dec 2025 (Session 1) & Feb 2026 (Session 2)',
      admitCardDate: '3 days prior to exam session',
      examDates: 'Session 1: Jan 22 - Jan 31, 2026 | Session 2: April 1 - April 15, 2026',
      resultDate: 'Session 1: Feb 12, 2026 | Session 2: April 25, 2026'
    },
    fees: {
      generalMale: '₹1,000',
      generalFemale: '₹800',
      reservedCategory: '₹500 (SC/ST/PwD/Transgender)',
      international: '₹5,000 (Outside India candidates)'
    },
    documentsRequired: [
      'Scanned Passport Photograph (10KB to 200KB, clear white background, 80% face visible)',
      'Scanned Candidate Signature (4KB to 30KB on white paper with black ink)',
      'Class 10 Certificate / Marksheet (for DOB verification)',
      'Category Certificate (SC/ST/OBC-NCL/Gen-EWS issued after April 1 of financial year)',
      'PwD Certificate (if applicable, in prescribed NTA format)',
      'Valid Govt Identity Card (Aadhaar Card with updated photo / Passport / Voter ID / PAN)'
    ],
    applicationSteps: [
      'Step 1: Visit official NTA portal (jeemain.nta.nic.in) and click "New Registration".',
      'Step 2: Authenticate via Aadhaar / Digilocker / Passport to generate Application Number.',
      'Step 3: Fill personal details, academic qualifications, exam center preferences (4 choices), and medium of paper.',
      'Step 4: Upload photograph, signature, and category certificates adhering strictly to format limits.',
      'Step 5: Pay application fee online via NetBanking, Credit/Debit Card, or UPI.',
      'Step 6: Save and download the Confirmation Page (keep minimum 3 printed copies for counseling).'
    ],
    coursesUnlocked: [
      'B.Tech / B.E. (Bachelor of Technology in CSE, AI/ML, ECE, Mechanical, Civil, Aerospace)',
      'B.Arch (Bachelor of Architecture via Paper 2A)',
      'B.Planning (Bachelor of Planning via Paper 2B)',
      'Dual Degree B.Tech + M.Tech (5-Year Integrated Programs)'
    ],
    topAcceptingColleges: [
      '31 National Institutes of Technology (NIT Trichy, Surathkal, Warangal, Calicut, etc.)',
      '26 Indian Institutes of Information Technology (IIIT Hyderabad, Allahabad, Delhi, Lucknow)',
      '38 Centrally Funded Technical Institutes (GFTIs like PEC Chandigarh, BIT Mesra)',
      'Top 2,50,000 rankers qualify for JEE Advanced (admission path to 23 IITs)'
    ],
    careerUseAndOutcome: 'Unlocks top-tier engineering education across India. Leads to high-demand careers like Software Development Engineer (SDE), Data Scientist, Robotics Specialist, VLSI Engineer, and Product Manager with starting salaries ranging from ₹8 LPA to ₹45+ LPA.',
    officialLinks: [
      { title: 'NTA Official JEE Main Portal', url: 'https://jeemain.nta.nic.in' },
      { title: 'National Testing Agency (NTA)', url: 'https://nta.ac.in' },
      { title: 'JEE Advanced Official Portal', url: 'https://jeeadv.ac.in' }
    ]
  },
  {
    id: 'ap-eapcet',
    name: 'AP EAPCET 2026',
    fullForm: 'Andhra Pradesh Engineering, Agriculture & Pharmacy Common Entrance Test',
    category: 'Engineering',
    conductingBody: 'JNTU Kakinada on behalf of APSCHE',
    examFrequency: 'Once a year (May)',
    mode: 'Computer Based Test (CBT)',
    duration: '3 Hours (180 minutes)',
    structureAndFormat: '160 MCQs (+1 for correct, NO negative marking!). MPC Stream: Math (80 Qs), Physics (40 Qs), Chemistry (40 Qs). BiPC Stream: Botany (40 Qs), Zoology (40 Qs), Physics (40 Qs), Chemistry (40 Qs). Maximum 160 Marks.',
    eligibility: 'Passed Class 12 / Intermediate (10+2) with Physics, Math/Biology, Chemistry. Local/Domicile in Andhra Pradesh or Telangana. Minimum 45% aggregate (40% reserved).',
    syllabusOverview: [
      'Mathematics / Biology: Intermediate 1st & 2nd Year AP Board Syllabus (Calculus, Vectors, Probability / Botany, Zoology)',
      'Physics: Mechanics, Waves, Thermodynamics, Optics, Electricity, Magnetism, Modern Physics',
      'Chemistry: Physical Chemistry, Organic Reaction Mechanisms, Inorganic Chemistry'
    ],
    expectedDates2026: {
      regWindow: 'March 2026 - April 2026',
      admitCardDate: 'First week of May 2026',
      examDates: 'May 12 - May 20, 2026',
      resultDate: 'First week of June 2026'
    },
    fees: {
      generalMale: '₹600 (Engineering) / ₹1,200 (Both E & A)',
      generalFemale: '₹600 (Engineering) / ₹1,200 (Both E & A)',
      reservedCategory: '₹500 (SC/ST) / ₹550 (BC candidates)',
      international: 'N/A'
    },
    documentsRequired: [
      'Scanned Passport Photograph & Signature',
      'Class 10 SSC Marksheet & Intermediate 12th Hall Ticket Number',
      'AP Local Domicile Certificate & Caste/Category Certificate',
      'Income Certificate (for Jagananna Vidya Deevena Full Fee Reimbursement)',
      'Aadhaar Card'
    ],
    applicationSteps: [
      'Step 1: Visit cets.apsche.ap.gov.in and click AP EAPCET 2026.',
      'Step 2: Pay registration fee online via Credit Card / Debit Card / NetBanking.',
      'Step 3: Fill personal details, category, and hall ticket credentials.',
      'Step 4: Upload photograph and signature scan.',
      'Step 5: Select 3 test city preferences and submit application.'
    ],
    coursesUnlocked: [
      'B.Tech / B.E. (Computer Science, AI & ML, Data Science, ECE, EEE, Mechanical, Civil)',
      'B.Pharm (Pharmacy) & Pharm.D (Doctor of Pharmacy)',
      'B.Sc Agriculture (Hons), B.Sc Horticulture, B.V.Sc (Veterinary)'
    ],
    topAcceptingColleges: [
      'Andhra University College of Engineering (AU Visakhapatnam)',
      'JNTU Kakinada (JNTUK) & JNTU Anantapur (JNTUA)',
      'Sri Venkateswara University College of Engineering (SVU Tirupati)',
      'Gayatri Vidya Parishad (GVP), RVR & JC Guntur, VR Siddhartha Vijayawada'
    ],
    careerUseAndOutcome: 'Primary state engineering portal in AP with full government fee reimbursement for eligible students. Unlocks top SDE and Core Engineering careers with packages up to ₹18+ LPA.',
    officialLinks: [
      { title: 'APSCHE Official EAPCET Portal', url: 'https://cets.apsche.ap.gov.in' }
    ]
  },
  {
    id: 'ts-eapcet',
    name: 'TS EAPSET 2026',
    fullForm: 'Telangana State Engineering, Agriculture & Pharmacy Common Entrance Test',
    category: 'Engineering',
    conductingBody: 'JNTU Hyderabad on behalf of TSCHE',
    examFrequency: 'Once a year (May)',
    mode: 'Computer Based Test (CBT)',
    duration: '3 Hours (180 minutes)',
    structureAndFormat: '160 MCQs (+1 for correct, NO negative marking!). Math (80 Qs), Physics (40 Qs), Chemistry (40 Qs). Total 160 Marks.',
    eligibility: 'Passed Class 12 / Intermediate (10+2) with Physics, Math/Biology, Chemistry. Local status in Telangana / AP.',
    syllabusOverview: [
      'Mathematics / Biology: Intermediate 1st & 2nd Year Telangana Board Syllabus',
      'Physics: Mechanics, Electricity, Magnetism, Optics, Thermodynamics',
      'Chemistry: Physical, Organic & Inorganic Chemistry'
    ],
    expectedDates2026: {
      regWindow: 'March 2026 - April 2026',
      admitCardDate: 'First week of May 2026',
      examDates: 'May 9 - May 15, 2026',
      resultDate: 'Late May 2026'
    },
    fees: {
      generalMale: '₹900 (Engineering) / ₹1,800 (Both)',
      generalFemale: '₹900 (Engineering)',
      reservedCategory: '₹500 (SC/ST/PH candidates)',
      international: 'N/A'
    },
    documentsRequired: [
      'Passport size Photo & Signature',
      'Intermediate 12th Hall Ticket & SSC 10th Certificate',
      'TS Residence / Local Certificate & Income Certificate (for TS ePASS Fee Reimbursement)',
      'Aadhaar Card'
    ],
    applicationSteps: [
      'Step 1: Visit eapcet.tsche.ac.in and pay application fee.',
      'Step 2: Fill online form with stream, personal info, and academic credentials.',
      'Step 3: Select test centers across Telangana & AP.',
      'Step 4: Upload photo and signature, then submit.'
    ],
    coursesUnlocked: [
      'B.Tech / B.E. (Computer Science, AI & ML, ECE, EEE, Civil, Mechanical)',
      'B.Pharm & Pharm.D',
      'B.Sc Agriculture & Veterinary'
    ],
    topAcceptingColleges: [
      'JNTU College of Engineering Hyderabad (JNTUH)',
      'Osmania University College of Engineering (OU Hyderabad)',
      'Chaitanya Bharathi Institute of Technology (CBIT Hyderabad)',
      'Vasavi College of Engineering, VNR VJIET, BVRIT Hyderabad'
    ],
    careerUseAndOutcome: 'Top state engineering entrance test in Telangana unlocking TS ePASS fee reimbursement and software roles in Hyderabad IT hubs with packages up to ₹20+ LPA.',
    officialLinks: [
      { title: 'TSCHE Official EAPSET Portal', url: 'https://eapcet.tsche.ac.in' }
    ]
  },
  {
    id: 'neet-ug',
    name: 'NEET UG 2026',
    fullForm: 'National Eligibility cum Entrance Test (Undergraduate)',
    category: 'Medical',
    conductingBody: 'National Testing Agency (NTA)',
    examFrequency: 'Once a year (Usually First Sunday of May)',
    mode: 'Pen and Paper Based Test (OMR Sheet)',
    duration: '3 Hours 20 Minutes (200 minutes)',
    structureAndFormat: '720 total marks across Physics (180), Chemistry (180), and Biology (Botany 180 + Zoology 180). 200 MCQs total (attempt 180). Section A: 35 mandatory MCQs (+4/-1). Section B: 15 MCQs (attempt any 10, +4/-1).',
    eligibility: 'Passed Class 12 with Physics, Chemistry, Biology/Biotechnology and English. Minimum 50% aggregate marks in PCB for General (40% for SC/ST/OBC). Minimum age of 17 years by Dec 31 of admission year. No upper age limit.',
    syllabusOverview: [
      'Biology (50% weightage): Genetics & Evolution, Human Physiology, Plant Physiology, Cell Biology, Ecology, Reproduction',
      'Chemistry: Organic Chemistry (Hydrocarbons, Biomolecules), Physical (Thermodynamics, Equilibrium), Inorganic (D&F block, P-block)',
      'Physics: Mechanics, Current Electricity, Magnetism, Optics, Modern Physics, Thermodynamics'
    ],
    expectedDates2026: {
      regWindow: 'February 2026 - March 2026',
      admitCardDate: 'Last week of April 2026',
      examDates: 'May 3, 2026 (Sunday, 2:00 PM to 5:20 PM)',
      resultDate: 'First week of June 2026'
    },
    fees: {
      generalMale: '₹1,700',
      generalFemale: '₹1,700',
      reservedCategory: '₹1,000 (SC/ST/PwD/Transgender) | ₹1,600 (General-EWS/OBC-NCL)',
      international: '₹9,500 (Outside India exam centers)'
    },
    documentsRequired: [
      'Postcard Size Photograph (4"x6") & Passport Size Photo (white background, name & date printed)',
      'Left and Right Thumb & Finger Impressions (clear blue/black ink on white paper)',
      'Candidate Signature in running handwriting (Not in CAPITAL letters)',
      'Class 10 Passing Certificate & Marksheet (PDF format)',
      'Category Certificate & PwD Certificate (if applicable)',
      'Valid Govt Identity Proof (Aadhaar Card / E-Aadhaar / Passport)'
    ],
    applicationSteps: [
      'Step 1: Access neet.nta.nic.in and click "NEET (UG) Registration".',
      'Step 2: Generate login credentials using Aadhaar or Digilocker identity verification.',
      'Step 3: Enter demographic, contact, and academic details for Class 10, 11, and 12.',
      'Step 4: Upload Passport photo, Postcard photo, fingerprints, signature, and 10th certificate.',
      'Step 5: Select 4 exam city choices and pay application fee through online gateway.',
      'Step 6: Print out confirmation page and verify transaction status.'
    ],
    coursesUnlocked: [
      'MBBS (Bachelor of Medicine and Bachelor of Surgery)',
      'BDS (Bachelor of Dental Surgery)',
      'BAMS (Bachelor of Ayurvedic Medicine & Surgery)',
      'BHMS (Bachelor of Homeopathic Medicine & Surgery)',
      'BUMS / BSMS (Unani & Siddha Medicine)',
      'B.Sc Nursing / B.Sc Veterinary Science & Animal Husbandry (BVSc & AH)'
    ],
    topAcceptingColleges: [
      'AIIMS New Delhi & 19 AIIMS across India (Bhubaneswar, Jodhpur, Bhopal, Rishikesh)',
      'JIPMER Puducherry & Karaikal',
      'King George Medical University (KGMU Lucknow), MMC Chennai, Grant Medical College Mumbai',
      'All Govt and Private Medical & Dental Colleges nationwide via MCC counseling'
    ],
    careerUseAndOutcome: 'Mandatory single entrance test for medical admissions in India. Clears path to becoming a licensed Medical Doctor, Surgeon, Pediatrician, Cardiologist, Medical Researcher, or Healthcare Officer with lifetime stability and immense prestige.',
    officialLinks: [
      { title: 'NTA Official NEET Portal', url: 'https://neet.nta.nic.in' },
      { title: 'Medical Counselling Committee (MCC)', url: 'https://mcc.nic.in' }
    ]
  },
  {
    id: 'cat-exam',
    name: 'CAT 2026',
    fullForm: 'Common Admission Test',
    category: 'Management',
    conductingBody: 'Indian Institutes of Management (IIMs on rotation - e.g. IIM Kozhikode/Calcutta)',
    examFrequency: 'Once a year (Last Sunday of November)',
    mode: 'Computer Based Test (CBT across 160+ cities)',
    duration: '2 Hours (120 minutes) - 40 minutes per sectional timer',
    structureAndFormat: '66 total questions across 3 sections: VARC (24 Qs), DILR (20 Qs), QA (22 Qs). Combination of MCQs (+3/-1) and Non-MCQ TIPA questions (+3/No negative mark). Total 198 Marks.',
    eligibility: 'Bachelor’s degree with minimum 50% marks (45% for SC/ST/PwD) from a recognized university. Final year graduation students are also eligible to apply.',
    syllabusOverview: [
      'VARC (Verbal Ability & Reading Comprehension): RC Passages, Para-jumbles, Summary completion, Odd sentence out',
      'DILR (Data Interpretation & Logical Reasoning): Caselets, Bar graphs, Matrices, Seating arrangement, Puzzles, Venn diagrams',
      'QA (Quantitative Aptitude): Arithmetic (Percentages, Profit/Loss, Time-Speed), Algebra, Geometry, Modern Math, Number System'
    ],
    expectedDates2026: {
      regWindow: 'August 2026 - September 2026',
      admitCardDate: 'Fourth week of October 2026',
      examDates: 'November 29, 2026 (Sunday - 3 Slots)',
      resultDate: 'Second week of January 2027'
    },
    fees: {
      generalMale: '₹2,500',
      generalFemale: '₹2,500',
      reservedCategory: '₹1,250 (SC/ST/PwD candidates)',
      international: 'N/A (GMAT accepted for foreign nationals)'
    },
    documentsRequired: [
      'Passport size photograph (35mm x 45mm, white background)',
      'Scanned Signature (black ink on white paper)',
      '10th, 12th, and Graduation Marksheets & Degree Certificates',
      'Category / NC-OBC / EWS / SC / ST Certificate (if applicable)',
      'Work Experience Certificates & Payslips (if claiming work ex points)',
      'Valid Govt Photo ID (Aadhaar / Voter ID / Passport / Driving License)'
    ],
    applicationSteps: [
      'Step 1: Register on iimcat.ac.in using name, DOB, email, and mobile number.',
      'Step 2: Fill personal details, academic scores (10th, 12th, UG, PG), and work experience months.',
      'Step 3: Select preferred IIM programs and interview locations (included in registration fee).',
      'Step 4: Select 6 preferred exam city preferences.',
      'Step 5: Upload photo, signature, and category documents.',
      'Step 6: Pay ₹2,500 fee online and print confirmation receipt.'
    ],
    coursesUnlocked: [
      'MBA (Master of Business Administration)',
      'PGDM (Post Graduate Diploma in Management)',
      'Executive MBA (for experienced professionals)',
      'Ph.D. / FPM in Management Studies'
    ],
    topAcceptingColleges: [
      '21 IIMs (IIM Ahmedabad, Bangalore, Calcutta, Lucknow, Kozhikode, Indore, Shillong)',
      'FMS Delhi, SPJIMR Mumbai, MDI Gurgaon, IIT Bombay (SJMSOM), IIT Delhi (DMS)',
      '100+ premier non-IIM B-Schools across India'
    ],
    careerUseAndOutcome: 'The gateway to India’s top leadership, strategy, consulting, and finance roles. Unlocks placements at McKinsey, BCG, Goldman Sachs, Google, Amazon, and Tata, with average packages at top IIMs ranging from ₹25 LPA to ₹35+ LPA.',
    officialLinks: [
      { title: 'IIM CAT Official Portal', url: 'https://iimcat.ac.in' }
    ]
  },
  {
    id: 'clat-exam',
    name: 'CLAT 2026',
    fullForm: 'Common Law Admission Test',
    category: 'Law',
    conductingBody: 'Consortium of National Law Universities (NLUs)',
    examFrequency: 'Once a year (Usually First week of December)',
    mode: 'Offline Pen and Paper (OMR Sheet)',
    duration: '2 Hours (120 minutes)',
    structureAndFormat: '120 passage-based MCQs (+1 for correct, -0.25 for incorrect). 5 Sections: English Language (22-26 Qs), Current Affairs & GK (28-32 Qs), Legal Reasoning (28-32 Qs), Logical Reasoning (22-26 Qs), Quantitative Techniques (10-14 Qs). Total 120 Marks.',
    eligibility: 'For UG: Passed Class 12 or appearing with minimum 45% aggregate marks (40% for SC/ST). No upper age limit.',
    syllabusOverview: [
      'Legal Reasoning: Constitutional law principles, Contracts, Torts, Criminal Law scenarios, Environmental law',
      'Current Affairs & GK: National news, International treaties, Supreme Court judgments, Legal updates, Economics',
      'English & Logical Reasoning: Comprehension passages, critical reasoning, arguments, inferences, vocabulary'
    ],
    expectedDates2026: {
      regWindow: 'July 2026 - November 2026',
      admitCardDate: 'Late November 2026',
      examDates: 'December 6, 2026 (Sunday)',
      resultDate: 'Mid-December 2026'
    },
    fees: {
      generalMale: '₹4,000',
      generalFemale: '₹4,000',
      reservedCategory: '₹3,500 (SC/ST/PwD/BPL candidates)',
      international: '₹4,000'
    },
    documentsRequired: [
      'Frontal Passport Photograph (clear background)',
      'Scanned Signature of Candidate',
      'Class 10 & 12 Marksheets / Certificates',
      'Category Certificate (SC/ST/OBC) / Domicile Certificate for state quotas',
      'BPL Certificate (if claiming fee concession)'
    ],
    applicationSteps: [
      'Step 1: Register on consortiumofnlus.ac.in using mobile number and email ID.',
      'Step 2: Fill personal info, academic qualifications, and category details.',
      'Step 3: Select preference order for all 24 National Law Universities.',
      'Step 4: Upload signature, photo, and domicile certificates.',
      'Step 5: Pay application fee online and download registration receipt.'
    ],
    coursesUnlocked: [
      '5-Year Integrated BA LLB (Hons)',
      '5-Year Integrated BBA LLB (Hons)',
      '5-Year Integrated B.Sc LLB / B.Com LLB (Hons)',
      'LLM (for CLAT PG candidates)'
    ],
    topAcceptingColleges: [
      '24 National Law Universities (NLSIU Bengaluru, NALSAR Hyderabad, WBNUJS Kolkata, NLU Jodhpur, GNLU Gandhinagar)',
      'Top private law schools (Jindal Global Law School, Symbiosis Law School, NIRMA)'
    ],
    careerUseAndOutcome: 'Direct portal into prestigious corporate law firms (Amarchand, Khaitan & Co, Trilegal), judicial services, civil litigation, international arbitration, and corporate legal counsel roles with packages starting at ₹12 LPA to ₹22+ LPA.',
    officialLinks: [
      { title: 'Consortium of NLUs Official Portal', url: 'https://consortiumofnlus.ac.in' }
    ]
  },
  {
    id: 'bitsat',
    name: 'BITSAT 2026',
    fullForm: 'Birla Institute of Technology and Science Admission Test',
    category: 'Engineering',
    conductingBody: 'BITS Pilani',
    examFrequency: 'Twice a year (Session 1 & Session 2)',
    mode: 'Computer Based Test (CBT)',
    duration: '3 Hours (180 minutes)',
    structureAndFormat: '130 MCQs across 4 parts: Part I Physics (30 Qs), Part II Chemistry (30 Qs), Part III English Proficiency (10 Qs) & Logical Reasoning (20 Qs), Part IV Mathematics/Biology (40 Qs). +3 for correct, -1 for incorrect. Bonus 12 questions available if candidate completes all 130 questions!',
    eligibility: 'Passed Class 12 in 2025 or 2026 with Physics, Chemistry, and Mathematics (or Biology for B.Pharm) with aggregate minimum 75% marks in PCM/PCB, and at least 60% in each subject.',
    syllabusOverview: [
      'Physics: Mechanics, Waves, Modern Physics, Optics, Electromagnetics',
      'Chemistry: Organic, Physical, Inorganic Chemistry (Class 11 & 12 NCERT syllabus)',
      'Mathematics: Algebra, Trigonometry, Coordinate Geometry, Calculus, Probability',
      'English & Logical Reasoning: Grammar, Synonyms/Antonyms, Series, Analogies, Deductions'
    ],
    expectedDates2026: {
      regWindow: 'Jan 2026 - April 2026 (Session 1) & May 2026 (Session 2)',
      admitCardDate: 'May 15, 2026',
      examDates: 'Session 1: May 20 - May 24, 2026 | Session 2: June 22 - June 26, 2026',
      resultDate: 'Immediate score displayed on screen after test completion!'
    },
    fees: {
      generalMale: '₹3,400 (Single session) / ₹5,400 (Both sessions)',
      generalFemale: '₹2,900 (Single session) / ₹4,400 (Both sessions)',
      reservedCategory: 'Same as general (No category reservation at BITS)',
      international: '$70 USD (Dubai exam center candidates)'
    },
    documentsRequired: [
      'Recent Passport Photograph & Candidate Signature',
      'Class 10 Marksheet & Class 12 Marksheet with PCM percentage proof',
      'Valid Photo ID proof (Aadhaar Card / Passport)'
    ],
    applicationSteps: [
      'Step 1: Visit bitsadmission.com and register.',
      'Step 2: Fill personal profile and Class 12 board marks details.',
      'Step 3: Choose whether applying for Session 1, Session 2, or Both.',
      'Step 4: Upload photo and signature.',
      'Step 5: Pay application fee online.',
      'Step 6: Reserve your specific exam slot and test center during slot booking window.'
    ],
    coursesUnlocked: [
      'B.E. (Hons) in Computer Science, Electrical & Electronics, ECE, Mechanical, Chemical, Civil',
      'M.Sc (Hons) Dual Degree in Economics, Mathematics, Physics, Chemistry, Biological Sciences',
      'B.Pharm (Bachelor of Pharmacy)'
    ],
    topAcceptingColleges: [
      'BITS Pilani (Main Campus, Rajasthan)',
      'BITS Pilani - K.K. Birla Goa Campus',
      'BITS Pilani - Hyderabad Campus',
      'BITS Pilani - Dubai Campus'
    ],
    careerUseAndOutcome: 'BITS Pilani is widely considered equivalent to top 5 IITs with zero quota reservation, excellent global alumni network, and zero attendance policy. Average placements for CSE exceed ₹30+ LPA.',
    officialLinks: [
      { title: 'BITS Admission Official Portal', url: 'https://www.bitsadmission.com' }
    ]
  },
  {
    id: 'cuet-ug',
    name: 'CUET UG 2026',
    fullForm: 'Common University Entrance Test (Undergraduate)',
    category: 'General',
    conductingBody: 'National Testing Agency (NTA)',
    examFrequency: 'Once a year (May - June)',
    mode: 'Hybrid Mode (CBT + OMR for high-registration papers)',
    duration: '45 to 60 Minutes per domain subject test',
    structureAndFormat: 'Section IA & IB: Languages (13 & 20 languages). Section II: 27 Domain Subjects (e.g. Physics, Accountancy, Economics, History, Psychology). Section III: General Test (GK, Reasoning, Quant). MCQs (+5 for correct, -1 for incorrect). Candidates can choose up to 6 test papers.',
    eligibility: 'Passed Class 12 or appearing from any recognized board. Specific subject combination requirements vary per target university.',
    syllabusOverview: [
      'Domain Subjects: Class 12 NCERT curriculum strictly',
      'General Test: General Knowledge, Current Affairs, Mental Ability, Numerical Ability, Basic Algebra & Geometry',
      'Language Tests: Reading comprehension, literary aptitude, vocabulary'
    ],
    expectedDates2026: {
      regWindow: 'February 2026 - March 2026',
      admitCardDate: 'Second week of May 2026',
      examDates: 'May 15 - May 31, 2026',
      resultDate: 'Third week of June 2026'
    },
    fees: {
      generalMale: '₹1,000 (Up to 3 subjects) + ₹400 per extra subject',
      generalFemale: '₹1,000 (Up to 3 subjects) + ₹400 per extra subject',
      reservedCategory: '₹900 (OBC-NCL/EWS) | ₹800 (SC/ST/PwD)',
      international: '₹4,500'
    },
    documentsRequired: [
      'Passport size Photo & Signature',
      'Class 10 & Class 12 Marksheet',
      'Category Certificate (EWS/OBC-NCL/SC/ST)',
      'Aadhaar / Passport ID proof'
    ],
    applicationSteps: [
      'Step 1: Register at cuetug.ntaonline.in.',
      'Step 2: Fill profile and select target Universities and corresponding Degree Courses.',
      'Step 3: Select domain subject papers based on university eligibility criteria.',
      'Step 4: Upload required documents and photo.',
      'Step 5: Pay fee online and print confirmation.'
    ],
    coursesUnlocked: [
      'B.A. (Hons), B.Sc (Hons), B.Com (Hons)',
      'BBA, BMS, B.Voc, Integrated Master Degrees'
    ],
    topAcceptingColleges: [
      'University of Delhi (DU - St. Stephen’s, SRCC, Hindu College, LSR)',
      'Banaras Hindu University (BHU), Jawaharlal Nehru University (JNU), Jamia Millia Islamia',
      '250+ Central, State, Deemed, and Private Universities'
    ],
    careerUseAndOutcome: 'Single entrance gateway for India’s top central university arts, commerce, and science programs. Opens doors to UPSC, corporate management, financial analytics, policy research, and media careers.',
    officialLinks: [
      { title: 'CUET UG NTA Official Portal', url: 'https://cuetug.ntaonline.in' }
    ]
  },
  {
    id: 'upsc-cse',
    name: 'UPSC CSE 2026',
    fullForm: 'Civil Services Examination',
    category: 'Civil Services',
    conductingBody: 'Union Public Service Commission (UPSC)',
    examFrequency: 'Once a year (Prelims in May/June)',
    mode: 'Offline Pen-Paper (Prelims MCQs & Mains Descriptive)',
    duration: 'Prelims: 2 Papers (2 Hrs each) | Mains: 9 Papers (3 Hrs each) | Interview',
    structureAndFormat: 'Stage 1: Prelims GS Paper 1 (200 marks) & CSAT (200 marks, qualifying 33%). Stage 2: Mains (9 papers, 1750 marks total). Stage 3: Personality Test / Interview (275 marks). Grand Total: 2025 Marks.',
    eligibility: 'Graduate degree in any discipline from a recognized university. Age limit: 21 to 32 years (Relaxation: 3 yrs for OBC, 5 yrs for SC/ST). Attempts: General 6, OBC 9, SC/ST Unlimited.',
    syllabusOverview: [
      'Prelims GS1: Indian History, Polity & Governance, Geography, Economy, Environment & Ecology, Science & Tech',
      'CSAT: Quantitative Aptitude, Logical Reasoning, Comprehension',
      'Mains: Essay, GS I (History & Culture), GS II (Governance & Polity), GS III (Economy & Tech), GS IV (Ethics & Integrity), Optional Subject (2 papers)'
    ],
    expectedDates2026: {
      regWindow: 'February 2026 - March 2026',
      admitCardDate: 'First week of May 2026',
      examDates: 'Prelims: May 24, 2026 | Mains: September 18, 2026',
      resultDate: 'Prelims: June 2026 | Final Result: April 2027'
    },
    fees: {
      generalMale: '₹100',
      generalFemale: '₹0 (Exempted for all female candidates)',
      reservedCategory: '₹0 (Exempted for SC/ST/PwD candidates)',
      international: 'N/A'
    },
    documentsRequired: [
      'Govt Photo ID Card (Aadhaar / Voter ID / Passport / Driving License)',
      'Scanned Photo & Signature',
      'Graduation Degree Certificate / Marksheet',
      'Community / Caste Certificate (if claiming age/attempt relaxation)'
    ],
    applicationSteps: [
      'Step 1: One Time Registration (OTR) on upsc.gov.in.',
      'Step 2: Fill Part 1 Application for Civil Services (Prelims).',
      'Step 3: Upload photo, signature, and Govt ID card.',
      'Step 4: Pay ₹100 fee online (if applicable) and select Prelims exam center.',
      'Step 5: Print confirmation receipt.'
    ],
    coursesUnlocked: [
      'IAS (Indian Administrative Service)',
      'IPS (Indian Police Service)',
      'IFS (Indian Foreign Service)',
      'IRS (Indian Revenue Service - IT / Custom & Excise)'
    ],
    topAcceptingColleges: [
      'LBSNAA (Lal Bahadur Shastri National Academy of Administration, Mussoorie)',
      'SVPNPA (Sardar Vallabhbhai Patel National Police Academy, Hyderabad)'
    ],
    careerUseAndOutcome: 'The highest administrative decision-making positions in Indian governance. Leads to District Magistrate (Collector), Ambassador to foreign nations, Police Commissioner, and Cabinet Secretary roles.',
    officialLinks: [
      { title: 'UPSC Official Portal', url: 'https://upsc.gov.in' }
    ]
  }
];

interface Props {
  user: any;
  onStartChat: (alumni: AlumniInsight) => void;
  onBackToHome: () => void;
  registeredUsers?: any[];
  dynamicPathways?: any[];
}

export const EntranceExamsInfo: React.FC<Props> = ({
  user,
  onStartChat,
  onBackToHome,
  registeredUsers = [],
  dynamicPathways = []
}) => {
  const { t, i18n } = useTranslation();
  const [activeExamId, setActiveExamId] = useState<string>('jee-main');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'dates' | 'application' | 'courses' | 'alumni' | 'links'>('overview');
  
  // Dynamic Gemini AI Live Search state
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiCitations, setAiCitations] = useState<{ title: string; url: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [customExamQuery, setCustomExamQuery] = useState<string>('');

  // Firestore Real-Time Database Feedbacks state
  const [realDbFeedbacks, setRealDbFeedbacks] = useState<any[]>([]);
  const [isFeedbacksLoading, setIsFeedbacksLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewRole, setReviewRole] = useState<string>('');
  const [reviewCollege, setReviewCollege] = useState<string>('');
  const [reviewScore, setReviewScore] = useState<string>('');
  const [reviewFeedback, setReviewFeedback] = useState<string>('');
  const [reviewAdvice, setReviewAdvice] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewActionMsg, setReviewActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentExam = PRESET_ENTRANCE_EXAMS.find(e => e.id === activeExamId) || PRESET_ENTRANCE_EXAMS[0];

  // Subscribe to real-time user-submitted reviews from Firestore
  useEffect(() => {
    setIsFeedbacksLoading(true);
    const feedbacksRef = collection(db, 'feedbacks');
    const unsubscribe = onSnapshot(
      feedbacksRef,
      (snapshot) => {
        const items: any[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        // Sort newest first
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setRealDbFeedbacks(items);
        setIsFeedbacksLoading(false);
      },
      (err) => {
        console.error('Error fetching database feedbacks in EntranceExamsInfo:', err);
        setIsFeedbacksLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter reviews matching current active exam
  const currentExamReviews = realDbFeedbacks.filter((item) => {
    const targetId = String(item.courseId || item.examId || item.pathwayId || '').toLowerCase().trim();
    const targetName = String(item.courseName || item.itemName || item.examName || '').toLowerCase().trim();
    const examId = currentExam.id.toLowerCase().trim();
    const examName = currentExam.name.toLowerCase().trim();
    const fullForm = currentExam.fullForm.toLowerCase().trim();

    return (
      targetId === examId ||
      targetId === examName ||
      targetName === examName ||
      targetName === examId ||
      targetName === fullForm ||
      (item.itemType === 'entrance-exam' && (
        targetName.includes(examId) ||
        targetId.includes(examId) ||
        targetName.includes(examName.replace(/ \d{4}$/, ''))
      )) ||
      (item.type === 'entrance-exam' && (targetId === examId || targetName === examName))
    );
  });

  const handleOpenNewReview = () => {
    setEditingReviewId(null);
    setReviewRating(5);
    setReviewRole(user?.role || 'Aspirant / Candidate');
    setReviewCollege('');
    setReviewScore('');
    setReviewFeedback('');
    setReviewAdvice('');
    setReviewActionMsg(null);
    setShowReviewModal(true);
  };

  const handleEditReview = (rev: any) => {
    setEditingReviewId(rev.id);
    setReviewRating(rev.overallRating || rev.rating || 5);
    setReviewRole(rev.userRole || rev.role || '');
    setReviewCollege(rev.collegeJoined || rev.institution || '');
    setReviewScore(rev.examScore || rev.score || rev.rank || '');
    setReviewFeedback(rev.feedbackText || rev.feedback || rev.tip || '');
    setReviewAdvice(rev.preparationAdvice || rev.advice || '');
    setReviewActionMsg(null);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm(t('common.confirmDelete', 'Are you sure you want to delete your feedback?'))) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'feedbacks', reviewId));
      setReviewActionMsg({ type: 'success', text: t('common.deletedSuccess', 'Feedback successfully removed from database.') });
      setTimeout(() => setReviewActionMsg(null), 3000);
    } catch (err: any) {
      console.error('Failed to delete review:', err);
      setReviewActionMsg({ type: 'error', text: 'Failed to delete review. Please check database permissions.' });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFeedback.trim()) return;

    setIsSubmittingReview(true);
    setReviewActionMsg(null);

    const reviewId = editingReviewId || `exam_feedback_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newDoc = {
      courseId: currentExam.id,
      courseName: currentExam.name,
      itemName: currentExam.name,
      itemType: 'entrance-exam',
      type: 'entrance-exam',
      overallRating: Number(reviewRating),
      rating: Number(reviewRating),
      feedbackText: reviewFeedback.trim(),
      tip: reviewFeedback.trim(),
      preparationAdvice: reviewAdvice.trim(),
      userRole: reviewRole.trim() || 'Aspirant',
      role: reviewRole.trim() || 'Aspirant',
      collegeJoined: reviewCollege.trim() || 'N/A',
      institution: reviewCollege.trim() || 'N/A',
      examScore: reviewScore.trim() || 'N/A',
      userName: user?.name || user?.email?.split('@')[0] || 'Verified Student',
      userEmail: user?.email || '',
      userId: user?.id || user?.email || 'guest_user',
      avatar: user?.avatar || '🎓',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'feedbacks', reviewId), newDoc, { merge: true });
      setIsSubmittingReview(false);
      setShowReviewModal(false);
      setReviewActionMsg({ type: 'success', text: t('common.submittedSuccess', 'Feedback saved to database successfully!') });
      setTimeout(() => setReviewActionMsg(null), 4000);
    } catch (err: any) {
      console.error('Error submitting exam feedback:', err);
      setIsSubmittingReview(false);
      setReviewActionMsg({ type: 'error', text: 'Error saving feedback to database. Please retry.' });
    }
  };

  // Trigger Gemini AI Search for a specific query
  const handleFetchAiExamReport = async (targetExamName: string) => {
    if (!targetExamName.trim()) return;
    setIsAiLoading(true);
    setAiError(null);
    setAiReport(null);
    setAiCitations([]);

    try {
      const response = await fetch('/api/entrance-exams-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examQuery: targetExamName,
          lang: i18n.language || 'en'
        })
      });

      const data = await response.json();
      if (data.answer) {
        setAiReport(data.answer);
        setAiCitations(data.citations || []);
      } else {
        setAiError("Could not retrieve AI report for this query. Displaying pre-verified structural details below.");
      }
    } catch (err: any) {
      console.error("Failed to query entrance exam AI:", err);
      setAiError("AI Search service temporarily busy. You can view structured verified details below.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter exams by search query
  const filteredExams = PRESET_ENTRANCE_EXAMS.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.fullForm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.conductingBody.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans text-stone-900">
      
      {/* HEADER BAR */}
      <div className="border-2 border-black p-6 bg-amber-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-black uppercase text-black bg-white px-3 py-1 border-2 border-black hover:bg-stone-100 mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" /> {t('common.backToHome', 'Back to Home')}
          </button>
          <h1 className="text-2xl sm:text-4xl font-display font-black uppercase mt-1 tracking-tight text-stone-900">
            {t('nav.entranceExams', 'Entrance Exams Info Center')}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-800 mt-1">
            {t('entranceExams.hubSubtitle', 'Complete end-to-end details: exam format, syllabus, expected 2026 dates, fees, required documents, career scope, and direct mentor messaging.')}
          </p>
        </div>

      </div>

      {/* SEARCH AND LIVE AI QUERY BAR */}
      <div className="border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              value={customExamQuery}
              onChange={(e) => setCustomExamQuery(e.target.value)}
              placeholder={t('entranceExams.searchPlaceholder', 'Type ANY entrance exam (e.g. JEE Main, NEET, CAT, CLAT, BITSAT, NDA, SAT, GRE, KCET, MHT-CET)...')}
              className="w-full pl-11 pr-4 py-3 border-2 border-black text-sm font-semibold text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customExamQuery.trim()) {
                  handleFetchAiExamReport(customExamQuery);
                }
              }}
            />
          </div>

          <button 
            onClick={() => handleFetchAiExamReport(customExamQuery || currentExam.name)}
            disabled={isAiLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono font-black text-xs uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {t('entranceExams.searchingAi', 'Searching Web with AI...')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                {t('entranceExams.generateReport', 'Get Details ➔')}
              </>
            )}
          </button>
        </div>

        {/* QUICK SELECTION PRESETS */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-stone-250">
          <span className="text-[11px] font-mono font-black text-stone-500 uppercase shrink-0">
            {t('entranceExams.popularExams', 'POPULAR EXAMS:')}
          </span>
          {PRESET_ENTRANCE_EXAMS.map((exam) => (
            <button
              key={exam.id}
              onClick={() => {
                setActiveExamId(exam.id);
                setCustomExamQuery(exam.name);
                setAiReport(null); // Reset AI report when switching to preset
              }}
              className={`px-3 py-1 text-xs font-mono font-bold border border-black transition-all ${
                activeExamId === exam.id && !aiReport
                  ? 'bg-amber-400 text-stone-900 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {exam.name}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC AI GENERATED REPORT (IF AVAILABLE) */}
      {isAiLoading && (
        <ExamReportSkeleton />
      )}

      {aiReport && !isAiLoading && (
        <div className="border-2 border-black p-6 sm:p-8 bg-amber-50/50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-black pb-4">
            <div>
              <h2 className="text-2xl font-display font-black uppercase mt-1">
                {customExamQuery || currentExam.name} - Information
              </h2>
            </div>
            <button 
              onClick={() => setAiReport(null)}
              className="text-xs font-mono font-black text-stone-600 hover:text-black underline"
            >
              Close AI Report & View Preset Tabs ✕
            </button>
          </div>

          <div className="prose prose-stone max-w-none text-xs sm:text-sm font-medium leading-relaxed bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Markdown>{aiReport}</Markdown>
          </div>

          {aiCitations.length > 0 && (
            <div className="border-t-2 border-dashed border-black pt-4">
              <span className="text-xs font-mono font-black uppercase text-stone-700 block mb-2">
                🔗 VERIFIED REFERENCES:
              </span>
              <div className="flex flex-wrap gap-2">
                {aiCitations.map((cite, idx) => (
                  <a
                    key={idx}
                    href={cite.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-black text-xs font-mono font-bold text-blue-600 hover:underline shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {cite.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXAM DETAIL MASTER PANEL */}
      {!aiReport && (
        <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          
          {/* EXAM TOP BANNER */}
          <div className="p-6 sm:p-8 bg-slate-900 text-white border-b-2 border-black relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase bg-amber-400 text-black px-2.5 py-0.5 border border-black">
                    {currentExam.category}
                  </span>
                  <span className="text-[10px] font-mono font-black uppercase bg-stone-800 text-stone-300 px-2.5 py-0.5 border border-stone-700">
                    {currentExam.conductingBody}
                  </span>
                </div>
                
                <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white">
                  {currentExam.name}
                </h2>
                <p className="text-sm font-semibold text-stone-300">
                  {currentExam.fullForm}
                </p>
              </div>

              {/* QUICK KEY STATS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
                <div className="bg-stone-800 border border-stone-700 p-3 text-left">
                  <span className="text-[9px] font-mono text-stone-400 uppercase block font-bold">MODE</span>
                  <span className="text-xs font-black text-amber-400 block mt-0.5">{currentExam.mode}</span>
                </div>

                <div className="bg-stone-800 border border-stone-700 p-3 text-left">
                  <span className="text-[9px] font-mono text-stone-400 uppercase block font-bold">DURATION</span>
                  <span className="text-xs font-black text-amber-400 block mt-0.5">{currentExam.duration}</span>
                </div>

                <div className="bg-stone-800 border border-stone-700 p-3 text-left col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-mono text-stone-400 uppercase block font-bold">FREQUENCY</span>
                  <span className="text-xs font-black text-emerald-400 block mt-0.5">{currentExam.examFrequency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION HEADER */}
          <div className="flex flex-wrap border-b-2 border-black bg-stone-100 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-3.5 text-xs font-mono font-black uppercase border-r-2 border-black transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'overview' ? 'bg-amber-400 text-black' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <BookOpen className="w-4 h-4" /> 1. {t('entranceExams.tabFormat', 'Format & Structure')}
            </button>

            <button
              onClick={() => setActiveTab('eligibility')}
              className={`px-5 py-3.5 text-xs font-mono font-black uppercase border-r-2 border-black transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'eligibility' ? 'bg-amber-400 text-black' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> 2. {t('entranceExams.tabEligibility', 'Eligibility & Syllabus')}
            </button>

            <button
              onClick={() => setActiveTab('dates')}
              className={`px-5 py-3.5 text-xs font-mono font-black uppercase border-r-2 border-black transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'dates' ? 'bg-amber-400 text-black' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Calendar className="w-4 h-4" /> 3. {t('entranceExams.tabDates', 'Dates & Fees (2026)')}
            </button>

            <button
              onClick={() => setActiveTab('application')}
              className={`px-5 py-3.5 text-xs font-mono font-black uppercase border-r-2 border-black transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'application' ? 'bg-amber-400 text-black' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <FileCheck className="w-4 h-4" /> 4. {t('entranceExams.tabApplication', 'Application & Documents')}
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`px-5 py-3.5 text-xs font-mono font-black uppercase border-r-2 border-black transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'courses' ? 'bg-amber-400 text-black' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Award className="w-4 h-4" /> 5. {t('entranceExams.tabCareer', 'Career & Course Scope')}
            </button>

            <button
              onClick={() => setActiveTab('alumni')}
              className={`px-5 py-3.5 text-xs font-mono font-black uppercase border-r-2 border-black transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'alumni' ? 'bg-amber-400 text-black' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> 6. {t('entranceExams.tabAlumni', 'Alumni Feedback & Mentors')}
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className={`px-5 py-3.5 text-xs font-mono font-black uppercase transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'links' ? 'bg-amber-400 text-black' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <ExternalLink className="w-4 h-4" /> 7. {t('entranceExams.tabPortals', 'Official Portals')}
            </button>
          </div>

          {/* TAB CONTENT BODY */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* TAB 1: OVERVIEW & STRUCTURE */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="border-2 border-black p-6 bg-amber-50/40 text-left space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 uppercase tracking-wider">
                    ⚡ EXAM PATTERN & MARKING SCHEME
                  </span>
                  <h3 className="text-xl font-display font-black uppercase">
                    How the Exam is Conducted
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                    {currentExam.structureAndFormat}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                    <span className="text-[10px] font-mono font-black text-stone-500 uppercase">// CONDUCTING AGENCY</span>
                    <h4 className="text-base font-display font-black uppercase text-stone-900">{currentExam.conductingBody}</h4>
                    <p className="text-xs text-stone-600 font-medium">Official statutory testing organization responsible for test administration, admit card issue, and score normalization.</p>
                  </div>

                  <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                    <span className="text-[10px] font-mono font-black text-stone-500 uppercase">// EXAM FREQUENCY & MODE</span>
                    <h4 className="text-base font-display font-black uppercase text-stone-900">{currentExam.examFrequency}</h4>
                    <p className="text-xs text-stone-600 font-medium">Delivered via {currentExam.mode} across national test centers.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ELIGIBILITY & SYLLABUS */}
            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                <div className="border-2 border-black p-6 bg-emerald-50/40 text-left space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 uppercase tracking-wider">
                    🎓 QUALIFYING CRITERIA
                  </span>
                  <h3 className="text-xl font-display font-black uppercase">
                    Eligibility Requirements
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed">
                    {currentExam.eligibility}
                  </p>
                </div>

                <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <span className="text-[10px] font-mono font-black text-stone-500 uppercase block">
                    📚 CORE SYLLABUS & HIGH-WEIGHTAGE SUBJECTS
                  </span>
                  <div className="space-y-3">
                    {currentExam.syllabusOverview.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-stone-50 border border-stone-250">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-stone-800 font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DATES & FEES (2026) */}
            {activeTab === 'dates' && (
              <div className="space-y-6">
                <div className="border-2 border-black p-6 bg-sky-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-700" />
                    <h3 className="text-xl font-display font-black uppercase text-stone-900">
                      Expected Timeline & Key Dates (2026)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border-2 border-black p-4 text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-[9px] font-mono font-black text-stone-500 uppercase block">REGISTRATION WINDOW</span>
                      <span className="text-xs font-black text-stone-900 block mt-1">{currentExam.expectedDates2026.regWindow}</span>
                    </div>

                    <div className="bg-white border-2 border-black p-4 text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-[9px] font-mono font-black text-stone-500 uppercase block">ADMIT CARD RELEASE</span>
                      <span className="text-xs font-black text-stone-900 block mt-1">{currentExam.expectedDates2026.admitCardDate}</span>
                    </div>

                    <div className="bg-white border-2 border-black p-4 text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-[9px] font-mono font-black text-blue-700 uppercase block">EXPECTED EXAM DATES</span>
                      <span className="text-xs font-black text-blue-700 block mt-1">{currentExam.expectedDates2026.examDates}</span>
                    </div>

                    <div className="bg-white border-2 border-black p-4 text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-[9px] font-mono font-black text-emerald-700 uppercase block">RESULT ANNOUNCEMENT</span>
                      <span className="text-xs font-black text-emerald-700 block mt-1">{currentExam.expectedDates2026.resultDate}</span>
                    </div>
                  </div>
                </div>

                {/* APPLICATION FEES TABLE */}
                <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                    <h3 className="text-xl font-display font-black uppercase text-stone-900">
                      Category-Wise Application Fees
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-stone-50 border border-black text-center">
                      <span className="text-[10px] font-mono font-black text-stone-500 uppercase block">GENERAL / OBC (MALE)</span>
                      <span className="text-lg font-display font-black text-stone-900 mt-1 block">{currentExam.fees.generalMale}</span>
                    </div>

                    <div className="p-4 bg-stone-50 border border-black text-center">
                      <span className="text-[10px] font-mono font-black text-stone-500 uppercase block">GENERAL / OBC (FEMALE)</span>
                      <span className="text-lg font-display font-black text-stone-900 mt-1 block">{currentExam.fees.generalFemale}</span>
                    </div>

                    <div className="p-4 bg-stone-50 border border-black text-center">
                      <span className="text-[10px] font-mono font-black text-stone-500 uppercase block">RESERVED (SC/ST/PwD)</span>
                      <span className="text-lg font-display font-black text-emerald-700 mt-1 block">{currentExam.fees.reservedCategory}</span>
                    </div>

                    {currentExam.fees.international && (
                      <div className="p-4 bg-stone-50 border border-black text-center">
                        <span className="text-[10px] font-mono font-black text-stone-500 uppercase block">INTERNATIONAL / OUTSIDE INDIA</span>
                        <span className="text-lg font-display font-black text-blue-700 mt-1 block">{currentExam.fees.international}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: APPLICATION & DOCUMENTS */}
            {activeTab === 'application' && (
              <div className="space-y-6">
                {/* APPLICATION PROCESS STEPS */}
                <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <span className="text-[10px] font-mono font-black text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 uppercase tracking-wider">
                    📝 STEP-BY-STEP APPLICATION PROCESS
                  </span>
                  <div className="space-y-3">
                    {currentExam.applicationSteps.map((step, idx) => (
                      <div key={idx} className="p-3.5 bg-stone-50 border border-stone-300 font-semibold text-xs sm:text-sm text-stone-800">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* MANDATORY DOCUMENTS CHECKLIST */}
                <div className="border-2 border-black p-6 bg-amber-50/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-800" />
                    <h3 className="text-xl font-display font-black uppercase text-stone-900">
                      Mandatory Documents Required Checklist
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentExam.documentsRequired.map((docItem, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 bg-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-stone-800">{docItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CAREER & COURSE SCOPE */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="border-2 border-black p-6 bg-purple-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                  <span className="text-[10px] font-mono font-black text-purple-800 bg-purple-100 border border-purple-300 px-2 py-0.5 uppercase tracking-wider">
                    🎯 WHAT IS THE USE AFTER WRITING THIS EXAM?
                  </span>
                  <h3 className="text-xl font-display font-black uppercase text-stone-900">
                    Career Opportunities & Professional Outcomes
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed">
                    {currentExam.careerUseAndOutcome}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* COURSES UNLOCKED */}
                  <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <h4 className="text-base font-display font-black uppercase text-stone-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" /> Courses & Degrees Unlocked
                    </h4>
                    <ul className="space-y-2 text-xs font-semibold text-stone-700">
                      {currentExam.coursesUnlocked.map((course, idx) => (
                        <li key={idx} className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200">
                          <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* TOP ACCEPTING COLLEGES */}
                  <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <h4 className="text-base font-display font-black uppercase text-stone-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" /> Top Accepting Universities & Institutes
                    </h4>
                    <ul className="space-y-2 text-xs font-semibold text-stone-700">
                      {currentExam.topAcceptingColleges.map((college, idx) => (
                        <li key={idx} className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{college}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ALUMNI & STUDENT USER-SUBMITTED FEEDBACK & MENTORS */}
            {activeTab === 'alumni' && (
              <div className="space-y-6">
                {/* STATUS MESSAGE BANNER */}
                {reviewActionMsg && (
                  <div className={`p-4 border-2 border-black font-semibold text-xs flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                    reviewActionMsg.type === 'success' ? 'bg-emerald-100 text-emerald-900 border-emerald-950' : 'bg-rose-100 text-rose-900 border-rose-950'
                  }`}>
                    <span>{reviewActionMsg.text}</span>
                    <button onClick={() => setReviewActionMsg(null)} className="text-stone-500 hover:text-black">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="border-2 border-black p-6 bg-amber-50/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 uppercase tracking-wider">
                      💬 LIVE DATABASE REVIEWS & MENTORSHIP
                    </span>
                    <h3 className="text-xl font-display font-black uppercase text-stone-900">
                      User Reviews for {currentExam.name}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium max-w-2xl">
                      Real reviews, exam scores, and preparation advice submitted directly by candidates and alumni. Connect directly with mentors in 1-on-1 private messaging!
                    </p>
                  </div>

                  <button
                    onClick={handleOpenNewReview}
                    className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-black font-mono font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    {t('entranceExams.addReviewBtn', 'Add Your Review / Advice')}
                  </button>
                </div>

                {/* REAL DATABASE REVIEWS LIST */}
                {isFeedbacksLoading ? (
                  <div className="border-2 border-black p-12 bg-white text-center space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-500 mx-auto" />
                    <p className="text-xs font-mono font-bold uppercase text-stone-600">
                      Loading user feedback from database...
                    </p>
                  </div>
                ) : currentExamReviews.length === 0 ? (
                  <div className="border-2 border-dashed border-stone-400 p-10 bg-white text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <div className="w-12 h-12 bg-amber-100 border-2 border-black rounded-full flex items-center justify-center mx-auto text-xl">
                      📝
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="text-base font-display font-black uppercase text-stone-900">
                        No User Feedback Yet for {currentExam.name}
                      </h4>
                      <p className="text-xs text-stone-600 font-medium">
                        Be the first student, mentor, or alumni to share your experience, rank/score, and preparation tips with the community!
                      </p>
                    </div>
                    <button
                      onClick={handleOpenNewReview}
                      className="px-5 py-2.5 bg-black text-white hover:bg-stone-800 font-mono font-black text-xs uppercase border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      Write the First Review ➔
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentExamReviews.map((item, idx) => {
                      const isOwner = user && (user.email === item.userEmail || user.id === item.userId || user.name === item.userName);
                      const ratingVal = item.overallRating || item.rating || 5;

                      return (
                        <div key={item.id || idx} className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-5">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl p-2 bg-stone-100 border border-stone-300">
                                  {item.avatar || '🎓'}
                                </span>
                                <div>
                                  <h4 className="text-base font-display font-black uppercase text-stone-900">
                                    {item.userName || 'Verified Candidate'}
                                  </h4>
                                  <p className="text-xs font-bold text-blue-700">
                                    {item.userRole || item.role || 'Aspirant'}
                                  </p>
                                  {(item.collegeJoined || item.institution) && (
                                    <p className="text-[11px] text-stone-500 font-medium">
                                      🏛️ {item.collegeJoined || item.institution}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-right flex flex-col items-end gap-1">
                                {(item.examScore || item.score || item.rank) && (
                                  <span className="text-[10px] font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 shrink-0">
                                    {item.examScore || item.score || item.rank}
                                  </span>
                                )}
                                <div className="flex items-center gap-0.5 text-amber-400">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3.5 h-3.5 ${
                                        star <= ratingVal ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* REVIEW TEXT */}
                            <div className="p-3.5 bg-stone-50 border-l-4 border-amber-400 text-xs font-semibold text-stone-800 leading-relaxed">
                              "{item.feedbackText || item.feedback || item.tip}"
                            </div>

                            {/* PREPARATION ADVICE IF PROVIDED */}
                            {(item.preparationAdvice || item.advice) && (
                              <div className="p-3 bg-blue-50 border border-blue-200 text-xs font-medium text-stone-700">
                                <span className="font-bold text-blue-800 block text-[10px] uppercase font-mono mb-0.5">
                                  💡 Preparation Strategy:
                                </span>
                                {item.preparationAdvice || item.advice}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 pt-1">
                              <span>📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                              {item.userEmail && (
                                <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 border border-stone-200">
                                  Verified Student
                                </span>
                              )}
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="space-y-2 pt-2 border-t border-stone-200">
                            <button
                              onClick={() => {
                                const mentorAlumni: AlumniInsight = {
                                  id: item.userId || item.id || `mentor_${idx}`,
                                  name: item.userName || 'Mentor',
                                  role: item.userRole || item.role || 'Exam Mentor',
                                  avatar: item.avatar || '🎓',
                                  institution: item.collegeJoined || item.institution || currentExam.name,
                                  yearCompleted: '2026',
                                  experience: item.examScore || item.score || 'Cleared',
                                  advice: item.feedbackText || item.tip || '',
                                  rating: ratingVal,
                                  timeline: []
                                };
                                onStartChat(mentorAlumni);
                              }}
                              className="w-full py-2.5 bg-black text-white hover:bg-stone-800 font-mono font-black text-xs uppercase border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                            >
                              <MessageSquare className="w-4 h-4 text-amber-400" />
                              Message {item.userName || 'Mentor'} Directly ➔
                            </button>

                            {isOwner && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditReview(item)}
                                  className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-black font-mono font-bold text-[10px] uppercase flex items-center justify-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3 text-stone-600" />
                                  Edit Review
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(item.id)}
                                  className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-400 font-mono font-bold text-[10px] uppercase flex items-center justify-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3 text-rose-600" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: OFFICIAL PORTALS & LINKS */}
            {activeTab === 'links' && (
              <div className="space-y-6">
                <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-display font-black uppercase text-stone-900">
                      Verified Official Application Portals & Links
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {currentExam.officialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-stone-50 hover:bg-amber-50 border-2 border-black transition-all group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div className="flex items-center gap-3">
                          <ExternalLink className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="text-sm font-display font-black uppercase text-stone-900 block">{link.title}</span>
                            <span className="text-xs font-mono text-stone-500">{link.url}</span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-black text-blue-600 uppercase group-hover:translate-x-1 transition-transform">
                          VISIT OFFICIAL PORTAL ➔
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* MODAL: SUBMIT / EDIT EXAM REVIEW */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start border-b-2 border-black pb-4">
              <div>
                <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 uppercase tracking-wider">
                  {currentExam.name}
                </span>
                <h3 className="text-xl font-display font-black uppercase text-stone-900 mt-1">
                  {editingReviewId ? 'Edit Your Feedback' : 'Share Authentic Feedback & Tips'}
                </h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 border border-black hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                  Overall Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1.5 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-stone-600 ml-2">
                    {reviewRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                    Your Role / Title
                  </label>
                  <input
                    type="text"
                    value={reviewRole}
                    onChange={(e) => setReviewRole(e.target.value)}
                    placeholder="e.g. SDE at Microsoft / 1st Year MBBS"
                    className="w-full p-2.5 border-2 border-black text-xs font-medium bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                    Score / Rank / Percentile
                  </label>
                  <input
                    type="text"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(e.target.value)}
                    placeholder="e.g. AIR 1420 / 99.8 Percentile / 680"
                    className="w-full p-2.5 border-2 border-black text-xs font-medium bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                  College Joined / Current Institution
                </label>
                <input
                  type="text"
                  value={reviewCollege}
                  onChange={(e) => setReviewCollege(e.target.value)}
                  placeholder="e.g. NIT Trichy (CSE), AIIMS New Delhi, IIM Ahmedabad"
                  className="w-full p-2.5 border-2 border-black text-xs font-medium bg-stone-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                  Exam Experience & Key Tips (Required) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Share what worked best during the exam, subject weightage, or common pitfalls to avoid..."
                  className="w-full p-2.5 border-2 border-black text-xs font-medium bg-stone-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1">
                  Recommended Strategy / Resources (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reviewAdvice}
                  onChange={(e) => setReviewAdvice(e.target.value)}
                  placeholder="e.g. Solve 10 years of past papers, focus on NCERT Chemistry, manage sectional time strictly..."
                  className="w-full p-2.5 border-2 border-black text-xs font-medium bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono font-bold text-xs uppercase border border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewFeedback.trim()}
                  className="px-6 py-2.5 bg-black text-white hover:bg-stone-800 font-mono font-black text-xs uppercase border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmittingReview ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      {editingReviewId ? 'Update Feedback' : 'Submit Review to Database'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
