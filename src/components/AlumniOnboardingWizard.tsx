import React, { useState } from 'react';
import {
  School,
  GraduationCap,
  Briefcase,
  Heart,
  ChevronRight,
  ChevronLeft,
  Award,
  ThumbsUp,
  BookOpen,
  LineChart,
  User,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  AlertTriangle,
  Lightbulb,
  X,
  FileCheck,
  Info
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

interface StageTimelineItem {
  label: string;
  year: string;
  courseName: string;
  schoolName: string;
  description: string;
  type: 'education' | 'milestone' | 'job';
}

interface SetupWizardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  onComplete: (journeyData: any) => Promise<void>;
  onLogout: () => void;
  isDarkMode: boolean;
}

export default function AlumniOnboardingWizard({
  user,
  onComplete,
  onLogout,
  isDarkMode
}: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [stepErrorBanner, setStepErrorBanner] = useState<string | null>(null);

  // --- WIZARD FORM STATE ---
  
  // Custom Persona / Avatar details for Directory Live Card
  const [nickName, setNickName] = useState<string>(user.name || '');
  const [userAvatar, setUserAvatar] = useState<string>(user.avatar || '🎓');

  // STEP 1: 10th Class Data
  const [schoolName10, setSchoolName10] = useState<string>('');
  const [schoolLocation10, setSchoolLocation10] = useState<string>('');
  const [yearPassed10, setYearPassed10] = useState<string>('2018');
  const [gpa10, setGpa10] = useState<string>('');
  const [educationalPathway, setEducationalPathway] = useState<'intermediate' | 'polytechnic' | 'iti'>('intermediate');

  // STEP 2A: Intermediate Data
  const [collegeNameInter, setCollegeNameInter] = useState<string>('');
  const [interGroup, setInterGroup] = useState<string>('MPC');
  const [yearPassedInter, setYearPassedInter] = useState<string>('2020');
  const [feedbackInter, setFeedbackInter] = useState<string>('');
  const [skillsInter, setSkillsInter] = useState<string>('');
  const [challengesInter, setChallengesInter] = useState<string>('');
  const [adviceInter, setAdviceInter] = useState<string>('');

  // STEP 2B: Polytechnic Data
  const [polyName, setPolyName] = useState<string>('');
  const [polyCourse, setPolyCourse] = useState<string>('Diploma in Computer Science Engineering');
  const [yearPassedPoly, setYearPassedPoly] = useState<string>('2021');
  const [feedbackPoly, setFeedbackPoly] = useState<string>('');
  const [skillsPoly, setSkillsPoly] = useState<string>('');
  const [challengesPoly, setChallengesPoly] = useState<string>('');
  const [lateralEntry, setLateralEntry] = useState<'Yes' | 'No'>('No');

  // STEP 2C: ITI / Vocational Data
  const [itiName, setItiName] = useState<string>('');
  const [itiCourse, setItiCourse] = useState<string>('Electrician Trade');
  const [yearPassedITI, setYearPassedITI] = useState<string>('2020');
  const [feedbackITI, setFeedbackITI] = useState<string>('');
  const [skillsITI, setSkillsITI] = useState<string>('');
  const [adviceITI, setAdviceITI] = useState<string>('');

  // STEP 3: Graduation Status
  const [gradStatus, setGradStatus] = useState<'Currently Studying' | 'Completed Graduation' | 'Did Not Pursue Graduation'>('Completed Graduation');
  
  // 3.1: Currently Studying
  const [studyingCollege, setStudyingCollege] = useState<string>('');
  const [studyingDegree, setStudyingDegree] = useState<string>('B.Tech in Computer Science');
  const [studyingYear, setStudyingYear] = useState<string>('3rd Year');
  const [expectedGradYear, setExpectedGradYear] = useState<string>('2026');
  const [studyingFeedback, setStudyingFeedback] = useState<string>('');
  const [studyingSkills, setStudyingSkills] = useState<string>('');

  // 3.2: Completed Graduation
  const [compCollege, setCompCollege] = useState<string>('');
  const [compDegree, setCompDegree] = useState<string>('B.Tech in Mechanical Engineering');
  const [compYear, setCompYear] = useState<string>('2024');
  const [compFeedback, setCompFeedback] = useState<string>('');
  const [compSkills, setCompSkills] = useState<string>('');
  const [compProjects, setCompProjects] = useState<string>('');

  // STEP 4: Career Status
  const [careerStatus, setCareerStatus] = useState<'Employed' | 'Business Owner' | 'Self Employed / Freelancer' | 'Higher Studies' | 'Unemployed'>('Employed');

  // 4.1: Employed
  const [empCompany, setEmpCompany] = useState<string>('');
  const [empTitle, setEmpTitle] = useState<string>('');
  const [empDesc, setEmpDesc] = useState<string>('');
  const [empIndustry, setEmpIndustry] = useState<string>('');
  const [empSalary, setEmpSalary] = useState<string>('₹4,001 - ₹10,000 / month');
  const [empExp, setEmpExp] = useState<string>('1 Year');
  const [empPlacement, setEmpPlacement] = useState<'Campus Placement' | 'Off Campus Placement' | 'Referral' | 'Internship Conversion' | 'Other'>('Campus Placement');
  const [empEducationFeedback, setEmpEducationFeedback] = useState<string>('');

  // 4.2: Business Owner
  const [bizName, setBizName] = useState<string>('');
  const [bizIndustry, setBizIndustry] = useState<string>('');
  const [bizYears, setBizYears] = useState<string>('');
  const [bizTeam, setBizTeam] = useState<string>('');
  const [bizDesc, setBizDesc] = useState<string>('');
  const [bizRevenue, setBizRevenue] = useState<string>('');
  const [bizEducationFeedback, setBizEducationFeedback] = useState<string>('');

  // 4.3: Self Employed / Freelancer
  const [selfProfession, setSelfProfession] = useState<string>('');
  const [selfExp, setSelfExp] = useState<string>('');
  const [selfSkills, setSelfSkills] = useState<string>('');
  const [selfIncome, setSelfIncome] = useState<string>('');
  const [selfEducationFeedback, setSelfEducationFeedback] = useState<string>('');

  // 4.4: Higher Studies
  const [studiesProgram, setStudiesProgram] = useState<string>('');
  const [studiesInstitution, setStudiesInstitution] = useState<string>('');
  const [studiesSpeciality, setStudiesSpeciality] = useState<string>('');
  const [studiesGradYear, setStudiesGradYear] = useState<string>('2026');
  const [studiesEducationFeedback, setStudiesEducationFeedback] = useState<string>('');

  // 4.5: Unemployed
  const [unempActivities, setUnempActivities] = useState<string>('');
  const [unempGoals, setUnempGoals] = useState<string>('');
  const [unempCertifications, setUnempCertifications] = useState<string>('');
  const [unempAspirations, setUnempAspirations] = useState<string>('');

  // STEP 5: Final Advice
  const [adviceFinalCareer, setAdviceFinalCareer] = useState<string>('');
  const [adviceFinalCourse, setAdviceFinalCourse] = useState<string>('');
  const [adviceFinalMistakes, setAdviceFinalMistakes] = useState<string>('');
  const [adviceFinalTips, setAdviceFinalTips] = useState<string>('');

  // --- AVATAR EMOJI PALETTE ---
  const emojis = ['🎓', '💼', '👨‍💻', '👩‍💻', '🚀', '🌟', '🧠', '🛠️', '👨‍🔬', '👩‍🔬', '📈', '🤝', '🌍'];

  // --- DYNAMIC STEPS LIST ---
  // When 'Currently Studying' is selected, Career Outcomes is omitted since active students are not asked for job profile details.
  type StepId = 'class10' | 'pathway' | 'graduation' | 'career' | 'mentorship';

  const steps: { id: StepId; title: string; desc: string }[] = [
    { id: 'class10', title: "Class 10 Journey", desc: "Foundational secondary details" },
    { id: 'pathway', title: "Pathway Transition", desc: "Intermediate, Polytechnic, or ITI details" },
    { id: 'graduation', title: "Academic Graduation", desc: gradStatus === 'Currently Studying' ? "Active undergraduate study details" : "Undergraduate stream and college info" },
    ...(gradStatus === 'Currently Studying' ? [] : [
      { id: 'career' as StepId, title: "Career Outcomes", desc: "Current occupation and industry benchmarks" }
    ]),
    { id: 'mentorship', title: "Strategic Mentorship", desc: "Distilled tips and final guidelines" }
  ];

  const safeStepIndex = Math.min(currentStep, steps.length - 1);
  const activeStep = steps[safeStepIndex] || steps[0];
  const activeStepId = activeStep.id;

  // --- GET ACTIVE PATHWAY CODES AND NAMES FOR MAPPING ---
  const getMappedPathwayIdsAndNames = () => {
    // Generates precise course IDs compatible with `CLEANED_ACADEMIC_PATHWAYS` equivalent checks
    const target = {
      interId: `inter_${interGroup.toLowerCase()}`,
      interName: `Intermediate - ${interGroup}`,
      polyId: `poly_${polyCourse.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      polyName: polyCourse,
      itiId: `iti_${itiCourse.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      itiName: itiCourse,
      gradId: `grad_${(gradStatus === 'Currently Studying' ? studyingDegree : compDegree).toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      gradName: gradStatus === 'Currently Studying' ? studyingDegree : compDegree,
    };
    return target;
  };

  // --- LIVE CARD PREVIEW DATA GENERATOR ---
  const getLivePreviewStats = () => {
    // Default Role Title
    let displayRole = 'Verified Contributor';
    if (gradStatus === 'Currently Studying') {
      displayRole = studyingDegree ? `${studyingDegree} Student (${studyingYear || 'Active'})` : 'Undergraduate Scholar';
    } else if (careerStatus === 'Employed') {
      displayRole = empTitle ? `${empTitle} at ${empCompany || 'Corporate Firm'}` : 'Corporate Analyst';
    } else if (careerStatus === 'Business Owner') {
      displayRole = bizName ? `Founder, ${bizName}` : 'Independent Business Owner';
    } else if (careerStatus === 'Self Employed / Freelancer') {
      displayRole = selfProfession ? `${selfProfession} Specialist` : 'Self-Employed Consultant';
    } else if (careerStatus === 'Higher Studies') {
      displayRole = studiesProgram ? `Pursuing ${studiesProgram}` : 'Academic Researcher';
    } else {
      displayRole = 'Graduate Advisory Lead';
    }

    // Default Primary Experience String
    let displayExperience = 'Completed board foundation and currently contributing verified curriculum advice via DIRPA.';
    if (educationalPathway === 'intermediate' && feedbackInter) displayExperience = feedbackInter;
    else if (educationalPathway === 'polytechnic' && feedbackPoly) displayExperience = feedbackPoly;
    else if (educationalPathway === 'iti' && feedbackITI) displayExperience = feedbackITI;
    
    if (gradStatus === 'Completed Graduation' && compFeedback) {
      displayExperience = compFeedback;
    } else if (gradStatus === 'Currently Studying' && studyingFeedback) {
      displayExperience = studyingFeedback;
    }

    // Default Primary Advice
    let displayAdvice = adviceFinalCareer || adviceInter || adviceITI || 'Stay consistent, focus heavily on fundamental building blocks, and solve practical laboratories!';

    let institution = collegeNameInter || 'Local Junior College';
    let year = educationalPathway === 'intermediate' ? yearPassedInter : yearPassedPoly;

    if (gradStatus === 'Completed Graduation') {
      institution = compCollege || 'State Engineering College';
      year = compYear ? `Passed ${compYear}` : 'Graduate';
    } else if (gradStatus === 'Currently Studying') {
      institution = studyingCollege || 'Active Campus University';
      year = `${studyingYear} (Expected ${expectedGradYear})`;
    }

    return {
      role: displayRole,
      experience: displayExperience,
      advice: displayAdvice,
      institution,
      year
    };
  };

  // --- GENERATING THE FULL DYNAMIC FEEDBACKS LIST ---
  const compileFeedbacksList = () => {
    const paths = getMappedPathwayIdsAndNames();
    const list: any[] = [];

    // Stage 1: 10th Class Feedback
    list.push({
      stage: '10th',
      courseId: 'school_class_10',
      courseName: 'Secondary School Certification (Class 10)',
      educationalStage: '10th Class',
      institutionName: schoolName10 || 'Zilla Parishad High School',
      completionYear: yearPassed10,
      feedbackText: `Completed Class 10 at ${schoolName10 || 'high school'}. Set up strong foundation for ${educationalPathway.toUpperCase()} stream study blocks.`,
      difficultyRating: 3,
      overallRating: 5,
      skillsLearned: 'Mathematics, General Sciences, Social Logic',
      challengesFaced: 'Board exam preparation pressure, adapting to standard formulas',
      careerOutcome: `Progressed directly into ${educationalPathway}`,
      advice: 'Ensure you completely clear all fundamental mathematics concepts, and take revision tests.'
    });

    // Stage 2: Post-10th Pathway Feedback (Intermediate / Polytechnic / ITI)
    if (educationalPathway === 'intermediate') {
      list.push({
        stage: 'intermediate',
        courseId: paths.interId,
        courseName: paths.interName,
        educationalStage: 'Intermediate',
        institutionName: collegeNameInter || 'Model Junior College',
        completionYear: yearPassedInter,
        feedbackText: feedbackInter || `Completed intermediate group ${interGroup}. Solid core syllabus preparation.`,
        difficultyRating: interGroup === 'MPC' || interGroup === 'MEC' ? 4 : 3,
        overallRating: 5,
        skillsLearned: skillsInter || 'Logical problem solving, subjects formulas, discipline',
        challengesFaced: challengesInter || 'In-depth physics laboratories and double-syllabus limits',
        careerOutcome: gradStatus === 'Did Not Pursue Graduation' ? 'Direct career launch' : 'Secured graduation admission',
        advice: adviceInter || 'Consistently prepare short micro-notes for all formulae!'
      });
    } else if (educationalPathway === 'polytechnic') {
      list.push({
        stage: 'polytechnic',
        courseId: paths.polyId,
        courseName: paths.polyName,
        educationalStage: 'Polytechnic',
        institutionName: polyName || 'Government Polytechnic Institute',
        completionYear: yearPassedPoly,
        feedbackText: feedbackPoly || `Completed technical diploma ${polyCourse}. High hands-on laboratory value.`,
        difficultyRating: 3,
        overallRating: 5,
        skillsLearned: skillsPoly || 'Engineering diagnostics, workshop fabrication, drawing',
        challengesFaced: challengesPoly || 'Internship shifts and detailed mechanical drawings',
        careerOutcome: lateralEntry === 'Yes' ? 'Direct graduation second year lateral entry' : 'Technical job support tier',
        advice: 'Laboratory sessions are much more critical than textbook papers! Pay heavy attention to workshops.'
      });
    } else if (educationalPathway === 'iti') {
      list.push({
        stage: 'iti',
        courseId: paths.itiId,
        courseName: paths.itiName,
        educationalStage: 'ITI / Vocational',
        institutionName: itiName || 'Industrial Training Institute',
        completionYear: yearPassedITI,
        feedbackText: feedbackITI || `Completed ITI/Vocational stream ${itiCourse}. Strong practical trade setups.`,
        difficultyRating: 2,
        overallRating: 5,
        skillsLearned: skillsITI || 'Industrial safety protocols, hand tooling, wiring layouts',
        challengesFaced: 'Initial mechanical shop practice hours',
        careerOutcome: 'Core technician placement eligibility',
        advice: adviceITI || 'Trade safety is the highest priority! Make sure to master equipment handle guidelines.'
      });
    }

    // Stage 3: Graduation Feedback (if applicable)
    if (gradStatus === 'Completed Graduation') {
      list.push({
        stage: 'graduation_completed',
        courseId: paths.gradId,
        courseName: paths.gradName,
        educationalStage: 'Graduation',
        institutionName: compCollege || 'Affiliated Graduation College',
        completionYear: compYear,
        feedbackText: compFeedback || `Pursued degree in ${compDegree}. Structured projects and technical domains.`,
        difficultyRating: 4,
        overallRating: 5,
        skillsLearned: compSkills || 'Specialized algorithms, core operations, research',
        challengesFaced: 'Final semester research projects',
        careerOutcome: careerStatus === 'Employed' ? `Placed successfully at ${empCompany}` : 'Graduate certification qualifications',
        advice: `${adviceFinalCareer || 'Form micro-study networks early with peers!'} Focus heavily on: ${compProjects || 'major projects'}`
      });
    } else if (gradStatus === 'Currently Studying') {
      list.push({
        stage: 'graduation_studying',
        courseId: paths.gradId,
        courseName: paths.gradName,
        educationalStage: 'Graduation',
        institutionName: studyingCollege || 'Active Campus University',
        completionYear: expectedGradYear,
        feedbackText: studyingFeedback || `Currently studying ${studyingDegree} (${studyingYear}). Highly interactive curriculum.`,
        difficultyRating: 3.5,
        overallRating: 4,
        skillsLearned: studyingSkills || 'Current concepts, lecture note taking, coding',
        challengesFaced: 'Balancing sessionals and extra-curricular clubs',
        careerOutcome: 'Continuing academic trajectory',
        advice: 'Start internship checkouts from second year itself!'
      });
    }

    return list;
  };

  // --- GENERATING TIMELINE STAGE BLOCKS ---
  const compileTimelineSteps = (): StageTimelineItem[] => {
    const list: StageTimelineItem[] = [];

    // Stage 1: 10th class
    list.push({
      label: '10th Class',
      year: yearPassed10,
      courseName: 'Secondary Education Board',
      schoolName: schoolName10 || 'Zilla Parishad High School',
      description: `Passed with ${gpa10 ? `CGPA/Percentage of ${gpa10}` : 'High Distinction'}`,
      type: 'education'
    });

    // Stage 2: Post-10th
    if (educationalPathway === 'intermediate') {
      list.push({
        label: 'Intermediate',
        year: yearPassedInter,
        courseName: `Intermediate Board (Group: ${interGroup})`,
        schoolName: collegeNameInter || 'Model Junior College',
        description: `Studied logical science streams`,
        type: 'education'
      });
    } else if (educationalPathway === 'polytechnic') {
      list.push({
        label: 'Polytechnic',
        year: yearPassedPoly,
        courseName: polyCourse,
        schoolName: polyName || 'Government Polytechnic Institute',
        description: `Hands-on training diploma (${lateralEntry === 'Yes' ? 'Lateral Eligible' : 'Standard Trainee'})`,
        type: 'education'
      });
    } else if (educationalPathway === 'iti') {
      list.push({
        label: 'ITI / Vocational',
        year: yearPassedITI,
        courseName: itiCourse,
        schoolName: itiName || 'Vocational College',
        description: `Specialized core technical trade specialization`,
        type: 'education'
      });
    }

    // Stage 3: Graduation
    if (gradStatus === 'Completed Graduation') {
      list.push({
        label: 'Graduation',
        year: compYear,
        courseName: compDegree,
        schoolName: compCollege || 'State Graduation University',
        description: 'Successfully completed degree program.',
        type: 'milestone'
      });
    } else if (gradStatus === 'Currently Studying') {
      list.push({
        label: 'Current Studies',
        year: `${studyingYear}`,
        courseName: `${studyingDegree} (Active)`,
        schoolName: studyingCollege || 'Active Campus University',
        description: `Expected Completion: ${expectedGradYear}`,
        type: 'milestone'
      });
    }

    // Stage 4: Professional Timeline Item (ONLY for Completed Graduation or Did Not Pursue Graduation)
    if (gradStatus !== 'Currently Studying') {
      let professionalTitle = 'Advisory Graduate Coordinator';
      let professionalPlace = 'Education Industry';
      
      if (careerStatus === 'Employed') {
        professionalTitle = empTitle || 'Professional Analyst';
        professionalPlace = empCompany || 'Corporate Firm';
      } else if (careerStatus === 'Business Owner') {
        professionalTitle = 'Founder / Business Lead';
        professionalPlace = bizName || 'Startup Venture';
      } else if (careerStatus === 'Self Employed / Freelancer') {
        professionalTitle = selfProfession || 'Specialist Architect';
        professionalPlace = 'Self-Employed';
      } else if (careerStatus === 'Higher Studies') {
        professionalTitle = studiesProgram || 'Advanced Scholar';
        professionalPlace = studiesInstitution || 'Graduate Academy';
      } else if (careerStatus === 'Unemployed') {
        professionalTitle = 'Competitive Exam Aspirant';
        professionalPlace = unempGoals || 'Career Preparation';
      }

      list.push({
        label: 'Job / Professional',
        year: 'Present',
        courseName: professionalTitle,
        schoolName: professionalPlace,
        description: 'Actively guiding academic queries and stream mapping on DIRPA.',
        type: 'job'
      });
    }

    return list;
  };

  // --- SUBMIT COMPLETED FORM ---
  const handleSubmitJourney = async () => {
    // Form Validations before committing:
    const errs: Record<string, string> = {};
    if (!schoolName10.trim()) {
      errs.schoolName10 = "High school name is required.";
    }
    if (educationalPathway === 'intermediate' && !collegeNameInter.trim()) {
      errs.collegeNameInter = "Intermediate Junior College name is required.";
    }
    if (educationalPathway === 'polytechnic' && !polyName.trim()) {
      errs.polyName = "Polytechnic College name is required.";
    }
    if (educationalPathway === 'iti' && !itiName.trim()) {
      errs.itiName = "ITI Institution name is required.";
    }
    if (gradStatus === 'Currently Studying') {
      if (!studyingCollege.trim()) errs.studyingCollege = "Active College/University is required.";
      if (!studyingDegree.trim()) errs.studyingDegree = "Degree & Specialization is required.";
    } else if (gradStatus === 'Completed Graduation') {
      if (!compCollege.trim()) errs.compCollege = "Degree College name is required.";
      if (!compDegree.trim()) errs.compDegree = "Degree name is required.";
    }

    if (Object.keys(errs).length > 0) {
      setStepErrors(errs);
      setStepErrorBanner("Please fill in all mandatory fields before publishing your alumni journey.");
      if (errs.schoolName10) setCurrentStep(0);
      else if (errs.collegeNameInter || errs.polyName || errs.itiName) setCurrentStep(1);
      else if (errs.studyingCollege || errs.studyingDegree || errs.compCollege || errs.compDegree) setCurrentStep(2);
      return;
    }

    setSubmitting(true);
    try {
      const liveStats = getLivePreviewStats();
      const feedbacks = compileFeedbacksList();
      const timeline = compileTimelineSteps();

      // Bundle all collected answers:
      const processedData = {
        name: nickName || user.name || 'Alumni Contributor',
        avatar: userAvatar,
        gradStatus,
        timeline,
        feedbacks,
        latestJob: gradStatus === 'Currently Studying'
          ? {
              jobTitle: `${studyingDegree} Student`,
              companyName: studyingCollege || 'Active Campus University',
              yearsOfExperience: studyingYear || 'Enrolled'
            }
          : {
              jobTitle: liveStats.role,
              companyName: careerStatus === 'Employed' ? (empCompany || liveStats.institution) : (careerStatus === 'Business Owner' ? (bizName || 'Independent Venture') : liveStats.institution),
              yearsOfExperience: careerStatus === 'Employed' ? empExp : (careerStatus === 'Self Employed / Freelancer' ? selfExp : 'N/A')
            },
        latestEducation: {
          degree: gradStatus === 'Completed Graduation' ? compDegree : (gradStatus === 'Currently Studying' ? studyingDegree : 'Intermediate Path'),
          college: gradStatus === 'Completed Graduation' ? (compCollege || liveStats.institution) : (gradStatus === 'Currently Studying' ? (studyingCollege || liveStats.institution) : collegeNameInter),
          yearCompleted: gradStatus === 'Completed Graduation' ? compYear : (gradStatus === 'Currently Studying' ? expectedGradYear : yearPassedInter)
        },
        finalAdvice: {
          careerAdvice: adviceFinalCareer || 'Stay focused, build continuous portfolios!',
          courseRecommendation: adviceFinalCourse,
          mistakesToAvoid: adviceFinalMistakes,
          successTips: adviceFinalTips
        },
        rawInputs: {
          twelfthStageType: educationalPathway,
          gpaClass10: gpa10,
          gradStatus,
          placementMode: gradStatus === 'Currently Studying' ? 'N/A (Active Student)' : empPlacement,
          salaryCategory: gradStatus === 'Currently Studying' ? 'N/A (Active Student)' : empSalary,
          intermediateGroup: interGroup,
          lateralEntry: lateralEntry
        }
      };

      await onComplete(processedData);
    } catch (e: any) {
      console.error(e);
      alert("Error saving onboarding details: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDERING PROGRESS BAR ---
  const renderProgressBar = () => {
    return (
      <div className="flex justify-between items-center mb-8 border-2 border-black bg-stone-105 p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black rounded-sm">
        {steps.map((step, idx) => {
          const isCompleted = safeStepIndex > idx;
          const isActive = safeStepIndex === idx;
          return (
            <React.Fragment key={step.id}>
              <div 
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  isActive ? 'text-blue-600 scale-102 font-bold' : (isCompleted ? 'text-green-600' : 'text-gray-400')
                }`}
                onClick={() => {
                  // Only allow jumping back or to next if previous completed
                  if (idx <= safeStepIndex || (idx === safeStepIndex + 1 && schoolName10)) {
                    setCurrentStep(idx);
                  }
                }}
              >
                <div 
                  className={`w-7 h-7 rounded-sm border-2 border-black flex items-center justify-center text-xs font-mono font-black ${
                    isActive 
                      ? 'bg-yellow-250' 
                      : (isCompleted ? 'bg-green-150 text-black' : 'bg-white')
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="hidden lg:block text-left leading-tight">
                  <p className="text-[10px] uppercase font-bold tracking-tight m-0 leading-none">{step.title}</p>
                  <p className="text-[9px] text-gray-500 font-sans tracking-wide m-0 leading-none mt-0.5">{step.desc}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 border-t-2 border-dashed mx-2 ${
                  safeStepIndex > idx ? 'border-green-500' : 'border-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const currentStats = getLivePreviewStats();
  const currentTimeline = compileTimelineSteps();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 text-black transition-colors duration-100">
      
      {/* HEADER BAR */}
      <div className="border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 rounded-sm">
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-indigo-100 border border-indigo-300 text-indigo-800 font-mono font-black text-[9px] uppercase tracking-wider mb-2">
            MANDATORY GRADUATING ALUMNI CHECK-IN
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-black tracking-tight leading-none">
            Alumni Journey Setup Wizard
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Setup your verified academic timeline and link core counseling feedbacks to populate student advisors roadmap.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 border-2 border-black hover:bg-red-50 text-xs font-mono font-black uppercase tracking-tight cursor-pointer active:scale-95 transition-transform"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* METRIC PROGRESS */}
      {renderProgressBar()}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE STEP FORM CONTROLS (8 COLS) */}
        <div className="xl:col-span-8 bg-white border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-sm text-black">
          
          {stepErrorBanner && (
            <div className="p-3 bg-red-100 border-2 border-red-600 text-red-900 text-xs font-bold font-mono mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{stepErrorBanner}</span>
            </div>
          )}

          {/* STEP 1: CLASS 10 DETAILS */}
          {activeStepId === 'class10' && (
            <div className="space-y-6">
              <div className="border-b border-black pb-3">
                <span className="text-[10px] font-mono font-black text-blue-600 block mb-0.5">// STEP 01 OF 0{steps.length} — SECONDARY FOUNDATION</span>
                <h2 className="text-xl font-display font-black uppercase">Class 10th Education & Transition Pathway</h2>
                <p className="text-xs text-gray-400">Provide details about your secondary school years passed, and your selected terminal pathway choice.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-tight text-gray-700 flex items-center gap-1">
                    <School className="w-3.5 h-3.5" /> High School Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZPHS School, Government High School"
                    value={schoolName10}
                    onChange={(e) => {
                      setSchoolName10(e.target.value);
                      if (stepErrors.schoolName10) {
                        setStepErrors(prev => ({ ...prev, schoolName10: '' }));
                      }
                    }}
                    className={`w-full border-2 p-2 font-sans text-xs focus:bg-white ${
                      stepErrors.schoolName10 ? 'border-red-600 bg-red-50/50' : 'border-black bg-stone-50'
                    }`}
                  />
                  {stepErrors.schoolName10 && (
                    <p className="text-[11px] font-bold text-red-600">⚠️ {stepErrors.schoolName10}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-tight text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> School Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Tirupathi, Karimnagar"
                    value={schoolLocation10}
                    onChange={(e) => setSchoolLocation10(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-tight text-gray-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Year Completed *
                  </label>
                  <select
                    value={yearPassed10}
                    onChange={(e) => {
                      setYearPassed10(e.target.value);
                      // Proactively increment following years
                      const num = parseInt(e.target.value);
                      setYearPassedInter(String(num + 2));
                      setYearPassedPoly(String(num + 3));
                      setYearPassedITI(String(num + 2));
                      setCompYear(String(num + 6));
                    }}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-mono text-xs focus:bg-white"
                  >
                    {Array.from({ length: 20 }, (_, i) => String(2025 - i)).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-tight text-gray-700">
                    Percentage / CGPA (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9.8 CGPA, 92%"
                    value={gpa10}
                    onChange={(e) => setGpa10(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                  />
                </div>
              </div>

              {/* Pathway Question */}
              <div className="border-t-2 border-dashed border-black pt-5 mt-5 space-y-4">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What did you do next after completing your 10th class?
                  </h4>
                  <p className="text-[10.5px] text-gray-400 font-sans mt-0.5">Please choose your terminal secondary academic group. This directs Step 2 questions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Option 1 */}
                  <label 
                    onClick={() => setEducationalPathway('intermediate')}
                    className={`border-2 border-black p-4 select-none cursor-pointer hover:bg-stone-50 flex flex-col justify-between h-24 relative transition-all ${
                      educationalPathway === 'intermediate' ? 'bg-indigo-50 border-indigo-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase block leading-tight">Intermediate Pathway</span>
                      <span className="text-[9.5px] text-gray-500 font-sans block mt-1">General XI & XII standards under BIE (MPC, BiPC, CEC).</span>
                    </div>
                    {educationalPathway === 'intermediate' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-indigo-600 border border-black flex items-center justify-center text-[8px] text-white">✓</span>
                    )}
                  </label>

                  {/* Option 2 */}
                  <label 
                    onClick={() => setEducationalPathway('polytechnic')}
                    className={`border-2 border-black p-4 select-none cursor-pointer hover:bg-stone-50 flex flex-col justify-between h-24 relative transition-all ${
                      educationalPathway === 'polytechnic' ? 'bg-amber-50 border-amber-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase block leading-tight">Polytechnic Diploma</span>
                      <span className="text-[9.5px] text-gray-500 font-sans block mt-1">3-Year hands-on technical Engineering diploma paths.</span>
                    </div>
                    {educationalPathway === 'polytechnic' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-amber-600 border border-black flex items-center justify-center text-[8px] text-white">✓</span>
                    )}
                  </label>

                  {/* Option 3 */}
                  <label 
                    onClick={() => setEducationalPathway('iti')}
                    className={`border-2 border-black p-4 select-none cursor-pointer hover:bg-stone-50 flex flex-col justify-between h-24 relative transition-all ${
                      educationalPathway === 'iti' ? 'bg-emerald-50 border-emerald-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase block leading-tight">ITI / Vocational trade</span>
                      <span className="text-[9.5px] text-gray-500 font-sans block mt-1">1-2 year fast-track practical trade certifications.</span>
                    </div>
                    {educationalPathway === 'iti' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-600 border border-black flex items-center justify-center text-[8px] text-white">✓</span>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2A: INTERMEDIATE */}
          {activeStepId === 'pathway' && educationalPathway === 'intermediate' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-black pb-3">
                <span className="text-[10px] font-mono font-black text-blue-600 block mb-0.5">// STEP 02 OF 0{steps.length} — INTERMEDIATE TRACK</span>
                <h2 className="text-xl font-display font-black uppercase">Intermediate Group & College Information</h2>
                <p className="text-xs text-gray-400">Describe your Junior College learning experience and board parameters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-xs font-black uppercase text-gray-700">Junior College Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Narayana Junior College, Government Junior College"
                    value={collegeNameInter}
                    onChange={(e) => {
                      setCollegeNameInter(e.target.value);
                      if (stepErrors.collegeNameInter) {
                        setStepErrors(prev => ({ ...prev, collegeNameInter: '' }));
                      }
                    }}
                    className={`w-full border-2 p-2 font-sans text-xs focus:bg-white ${
                      stepErrors.collegeNameInter ? 'border-red-600 bg-red-50/50' : 'border-black bg-stone-50'
                    }`}
                  />
                  {stepErrors.collegeNameInter && (
                    <p className="text-[11px] font-bold text-red-600">⚠️ {stepErrors.collegeNameInter}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Selected Intermediate Group *</label>
                  <select
                    value={interGroup}
                    onChange={(e) => setInterGroup(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-mono text-xs focus:bg-white"
                  >
                    <option value="MPC">MPC (Mathematics, Physics, Chemistry)</option>
                    <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
                    <option value="MEC">MEC (Mathematics, Economics, Commerce)</option>
                    <option value="CEC">CEC (Civics, Economics, Commerce)</option>
                    <option value="HEC">HEC (History, Economics, Civics)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Year Completed *</label>
                  <select
                    value={yearPassedInter}
                    onChange={(e) => {
                      setYearPassedInter(e.target.value);
                      const num = parseInt(e.target.value);
                      setCompYear(String(num + 4));
                    }}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-mono text-xs focus:bg-white"
                  >
                    {Array.from({ length: 20 }, (_, i) => String(2027 - i)).map(y => {
                      if (parseInt(y) > parseInt(yearPassed10)) return (
                        <option key={y} value={y}>{y}</option>
                      );
                      return null;
                    })}
                  </select>
                </div>
              </div>

              {/* Feedback questions */}
              <div className="border-t border-black pt-4 grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700 block gap-1">
                    📖 Describe Your Intermediate Feedback & Learning Experience *
                  </label>
                  <p className="text-[10px] text-gray-400 font-sans leading-none">// Multi-line textbook frameworks, labs, and syllabus reflection</p>
                  <textarea
                    required
                    rows={4}
                    placeholder="We completed MPC Board Exams. What was your feedback about the courses, difficulty level, and laboratory facilities? Speak your mind to make this helpful!"
                    value={feedbackInter}
                    onChange={(e) => setFeedbackInter(e.target.value)}
                    className="w-full border-2 border-black p-2.5 bg-stone-50 font-sans text-xs focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Skills Learned</label>
                    <input
                      type="text"
                      placeholder="e.g. Calculus, Mechanics, Accounting"
                      value={skillsInter}
                      onChange={(e) => setSkillsInter(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Challenges Faced</label>
                    <input
                      type="text"
                      placeholder="e.g. Chemistry compounds, heavy formulas"
                      value={challengesInter}
                      onChange={(e) => setChallengesInter(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Advice for Board Exams</label>
                    <input
                      type="text"
                      placeholder="e.g. Practice questions, revise notes"
                      value={adviceInter}
                      onChange={(e) => setAdviceInter(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2B: POLYTECHNIC */}
          {activeStepId === 'pathway' && educationalPathway === 'polytechnic' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-black pb-3">
                <span className="text-[10px] font-mono font-black text-blue-600 block mb-0.5">// STEP 02 OF 0{steps.length} — POLYTECHNIC TRACK</span>
                <h2 className="text-xl font-display font-black uppercase">Polytechnic Diploma Information</h2>
                <p className="text-xs text-gray-400">Tell us about your hands-on Technical Diploma and structural practical skills.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-xs font-black uppercase text-gray-700">Polytechnic College Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Government Polytechnic, Hyderabad"
                    value={polyName}
                    onChange={(e) => setPolyName(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Diploma Course Name *</label>
                  <select
                    value={polyCourse}
                    onChange={(e) => setPolyCourse(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                  >
                    <option value="Diploma in Computer Science Engineering">Diploma in CSE</option>
                    <option value="Diploma in Electronics and Communication Engineering">Diploma in ECE</option>
                    <option value="Diploma in Electrical and Electronics Engineering">Diploma in EEE</option>
                    <option value="Diploma in Mechanical Engineering">Diploma in Mechanical</option>
                    <option value="Diploma in Civil Engineering">Diploma in Civil Engineering</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Year Completed *</label>
                  <select
                    value={yearPassedPoly}
                    onChange={(e) => {
                      setYearPassedPoly(e.target.value);
                      const num = parseInt(e.target.value);
                      setCompYear(String(num + 3)); // Lateral takes 3 additional years
                    }}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-mono text-xs focus:bg-white"
                  >
                    {Array.from({ length: 20 }, (_, i) => String(2027 - i)).map(y => {
                      if (parseInt(y) > parseInt(yearPassed10)) return (
                        <option key={y} value={y}>{y}</option>
                      );
                      return null;
                    })}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-black pt-4">
                <label className="text-xs font-black uppercase text-gray-700">Feedback About Polytechnic Stream *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How was your technical drawing, workshop lab practice, and internship? What feedback would you share?"
                  value={feedbackPoly}
                  onChange={(e) => setFeedbackPoly(e.target.value)}
                  className="w-full border-2 border-black p-2.5 bg-stone-50 font-sans text-xs focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Core Hands-On Skills</label>
                  <input
                    type="text"
                    placeholder="e.g. AutoCAD, Circuit Diagnostics, Repairing"
                    value={skillsPoly}
                    onChange={(e) => setSkillsPoly(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Major Challenges Faced</label>
                  <input
                    type="text"
                    placeholder="e.g. Drawing sheets grading, mechanical workshops"
                    value={challengesPoly}
                    onChange={(e) => setChallengesPoly(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                  />
                </div>
              </div>

              <div className="border-t-2 border-dashed border-black pt-4 mt-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> After Polytechnic, did you join a Degree Program through Lateral Entry?
                </h4>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setLateralEntry('Yes');
                      setGradStatus('Completed Graduation');
                    }}
                    className={`flex-1 border-2 border-black p-2 font-mono text-xs uppercase font-extrabold cursor-pointer transition-all ${
                      lateralEntry === 'Yes' ? 'bg-amber-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                    }`}
                  >
                    Yes (Continuous B.Tech Engineering)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLateralEntry('No');
                    }}
                    className={`flex-1 border-2 border-black p-2 font-mono text-xs uppercase font-extrabold cursor-pointer transition-all ${
                      lateralEntry === 'No' ? 'bg-amber-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                    }`}
                  >
                    No (Direct Tech placements)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2C: ITI / VOCATIONAL */}
          {activeStepId === 'pathway' && educationalPathway === 'iti' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-black pb-3">
                <span className="text-[10px] font-mono font-black text-blue-600 block mb-0.5">// STEP 02 OF 0{steps.length} — ITI TRACK</span>
                <h2 className="text-xl font-display font-black uppercase">ITI / Vocational Trade Information</h2>
                <p className="text-xs text-gray-400">Tell us about your trade certification, practical safety shops, and core specialization.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-xs font-black uppercase text-gray-700">ITI / Vocational Trade Institution Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Government Industrial Training Institute"
                    value={itiName}
                    onChange={(e) => setItiName(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Trade Specialty Name *</label>
                  <select
                    value={itiCourse}
                    onChange={(e) => setItiCourse(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                  >
                    <option value="Electrician Trainee Certification">Electrician Trade</option>
                    <option value="Fitter & Machinist Certification">Fitter / Mechanist Trade</option>
                    <option value="Electronics Repair Technician">Electronics Mechanics</option>
                    <option value="Welding & Foundry Specialist">Welder & Smithy Trade</option>
                    <option value="Diesel Mechanic & HVAC Trade">Automotive & Diesel Mechanic</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Year Completed *</label>
                  <select
                    value={yearPassedITI}
                    onChange={(e) => {
                      setYearPassedITI(e.target.value);
                      const num = parseInt(e.target.value);
                      setCompYear(String(num + 4));
                    }}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-mono text-xs focus:bg-white"
                  >
                    {Array.from({ length: 20 }, (_, i) => String(2027 - i)).map(y => {
                      if (parseInt(y) > parseInt(yearPassed10)) return (
                        <option key={y} value={y}>{y}</option>
                      );
                      return null;
                    })}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-black pt-4">
                <label className="text-xs font-black uppercase text-gray-700">Feedback and Practical Workshop Review *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How was your hands-on wire tooling or machine operations? Briefly review the difficulty metric."
                  value={feedbackITI}
                  onChange={(e) => setFeedbackITI(e.target.value)}
                  className="w-full border-2 border-black p-2.5 bg-stone-50 font-sans text-xs focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Key Trade Skills</label>
                  <input
                    type="text"
                    placeholder="e.g. Wiring layouts, machine tooling, welding safety"
                    value={skillsITI}
                    onChange={(e) => setSkillsITI(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Trade Advice For Trainees</label>
                  <input
                    type="text"
                    placeholder="e.g. Wear protection gears, maintain tools"
                    value={adviceITI}
                    onChange={(e) => setAdviceITI(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GRADUATION STATUS */}
          {activeStepId === 'graduation' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-black pb-3">
                <span className="text-[10px] font-mono font-black text-blue-600 block mb-0.5">// STEP 03 OF 0{steps.length} — ACADEMIC GRADUATION</span>
                <h2 className="text-xl font-display font-black uppercase">Graduation status & Degree course</h2>
                <p className="text-xs text-gray-400">Specify whether you are currently studying or completed an undergraduate / technical degree program.</p>
              </div>

              {/* Status Question */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-gray-700 block">
                  🎓 What is your current graduation status?
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                  {['Currently Studying', 'Completed Graduation', 'Did Not Pursue Graduation'].map((stat) => (
                    <button
                      key={stat}
                      type="button"
                      onClick={() => setGradStatus(stat as any)}
                      className={`flex-1 border-2 border-black p-3.5 font-sans text-xs uppercase font-extrabold cursor-pointer transition-all ${
                        gradStatus === stat 
                          ? 'bg-blue-100 border-blue-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[#1E3A8A]' 
                          : 'bg-white hover:bg-stone-50'
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>

                {/* DYNAMIC PROMPT & WORKFLOW GUIDANCE */}
                {gradStatus === 'Currently Studying' && (
                  <div className="p-3.5 bg-blue-50 border-2 border-blue-600 text-blue-950 text-xs rounded-sm flex items-start gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
                    <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono font-black uppercase text-[10.5px] text-blue-900 leading-tight">ACTIVE STUDENT TRAJECTORY CONFIGURED</p>
                      <p className="text-[11px] text-blue-900 mt-1 leading-snug">
                        Since you are <strong>Currently Studying</strong>, employment & job profile details will not be requested. You will proceed directly to providing mentorship advice for juniors.
                      </p>
                    </div>
                  </div>
                )}

                {gradStatus === 'Completed Graduation' && (
                  <div className="p-3.5 bg-emerald-50 border-2 border-emerald-600 text-emerald-950 text-xs rounded-sm flex items-start gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono font-black uppercase text-[10.5px] text-emerald-900 leading-tight">GRADUATE ALUMNI PROFILE CONFIGURED</p>
                      <p className="text-[11px] text-emerald-900 mt-1 leading-snug">
                        Since you have <strong>Completed Graduation</strong>, the next stage (Career Outcomes) will request your employment/industry background to benchmark placement packages and domain tracks.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SUBFLOW A: CURRENTLY STUDYING */}
              {gradStatus === 'Currently Studying' && (
                <div className="border-t border-black pt-4 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-1 md:col-span-2">
                      <label className="text-xs font-black uppercase text-gray-700">Active College/University *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. JNTU Engineering College, Osmania University Campus"
                        value={studyingCollege}
                        onChange={(e) => setStudyingCollege(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Degree & Specialization Course *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B.Tech in Computer Science, B.Sc in Electronics"
                        value={studyingDegree}
                        onChange={(e) => setStudyingDegree(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Current Study Year *</label>
                      <select
                        value={studyingYear}
                        onChange={(e) => setStudyingYear(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Post-Graduate Block">Post-Graduate Block</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Expected Graduation Year *</label>
                      <select
                        value={expectedGradYear}
                        onChange={(e) => setExpectedGradYear(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-mono text-xs"
                      >
                        {Array.from({ length: 5 }, (_, i) => String(2025 + i)).map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Feedback About Degree Course & Quality *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your practical thoughts on syllabus quality, seminar panels, and midterms."
                      value={studyingFeedback}
                      onChange={(e) => setStudyingFeedback(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Skills Gained / Labs Learned</label>
                    <input
                      type="text"
                      placeholder="e.g. Java programming, microprocessor labs, project building"
                      value={studyingSkills}
                      onChange={(e) => setStudyingSkills(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>
                </div>
              )}

              {/* SUBFLOW B: COMPLETED GRADUATION */}
              {gradStatus === 'Completed Graduation' && (
                <div className="border-t border-black pt-4 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-1 md:col-span-2">
                      <label className="text-xs font-black uppercase text-gray-700">Degree College/University Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. JNTU College of Engineering Hyderabad"
                        value={compCollege}
                        onChange={(e) => setCompCollege(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Degree & Specialization *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B.Tech in CSE, MCA, B.Sc Electronics"
                        value={compDegree}
                        onChange={(e) => setCompDegree(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Year Completed *</label>
                      <select
                        value={compYear}
                        onChange={(e) => setCompYear(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-mono text-xs focus:bg-white"
                      >
                        {Array.from({ length: 15 }, (_, i) => String(2025 - i)).map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Detailed Degree Course & College Feedback *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Comment on coursework depth, faculty guides, project labs, and competitive campus drives."
                      value={compFeedback}
                      onChange={(e) => setCompFeedback(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Specialized Skills / Domains Mastered</label>
                      <input
                        type="text"
                        placeholder="e.g. Full-Stack Web, Embedded Systems, Mechatronics"
                        value={compSkills}
                        onChange={(e) => setCompSkills(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Major Major Capstone Project Description</label>
                      <input
                        type="text"
                        placeholder="e.g. IoT Smart Home Node, PLC Automation plant"
                        value={compProjects}
                        onChange={(e) => setCompProjects(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBFLOW C: NO GRADUATION */}
              {gradStatus === 'Did Not Pursue Graduation' && (
                <div className="border-t-2 border-dashed border-red-200 p-4 bg-red-50 text-red-800 text-xs font-semibold leading-relaxed space-y-1 rounded-sm">
                  <p className="font-mono flex items-center gap-1 uppercase tracking-wider text-red-900 border-b border-red-150 pb-1 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" /> SYSTEM ARCHITECTURE CLASSIFICATION
                  </p>
                  <p>Graduation section has been flagged as skipped based on your transition track.</p>
                  <p>Students will see your direct timeline transition from 10th/Diploma directly into technical placement benchmarks.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CAREER STATUS */}
          {activeStepId === 'career' && (
            <div className="space-y-6 animate-fade-in text-black">
              <div className="border-b border-black pb-3">
                <span className="text-[10px] font-mono font-black text-blue-600 block mb-0.5">// STEP 04 OF 0{steps.length} — CAREER & WORK COALESCE</span>
                <h2 className="text-xl font-display font-black uppercase">Professional career status & details</h2>
                <p className="text-xs text-gray-400">Share your active employment roles, business startups, or freelancer parameters.</p>
              </div>

              {/* Career Option Select */}
              <div className="space-y-3 font-semibold">
                <label className="text-xs font-black uppercase text-gray-700">💼 What is your current professional status?</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { key: 'Employed', emoji: '🧑‍💼' },
                    { key: 'Business Owner', emoji: '🚀' },
                    { key: 'Self Employed / Freelancer', emoji: '🛠️' },
                    { key: 'Higher Studies', emoji: '📚' },
                    { key: 'Unemployed', emoji: '⏳' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCareerStatus(item.key as any)}
                      className={`border-2 border-black p-2.5 font-sans text-xs uppercase font-extrabold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        careerStatus === item.key 
                          ? 'bg-amber-100 border-amber-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                          : 'bg-white hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-[9.5px] tracking-tight">{item.key}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4.1: EMPLOYED DETAIL FORM */}
              {careerStatus === 'Employed' && (
                <div className="border-t border-black pt-4 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tata Consultancy Services, Capgemini, BHEL"
                        value={empCompany}
                        onChange={(e) => setEmpCompany(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Job Title / Designation *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Software Engineer, Assistant Manager, Apprentice"
                        value={empTitle}
                        onChange={(e) => setEmpTitle(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Core Industry *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. IT Services, Electrical Manufacturing, Steel Division"
                        value={empIndustry}
                        onChange={(e) => setEmpIndustry(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700 font-sans">Placement Route *</label>
                      <select
                        value={empPlacement}
                        onChange={(e) => setEmpPlacement(e.target.value as any)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      >
                        <option value="Campus Placement">Campus Placement (College Drive)</option>
                        <option value="Off Campus Placement">Off Campus Placement</option>
                        <option value="Referral">Alumni Referral / Recommendation</option>
                        <option value="Internship Conversion">Pre-Placement Internship Conversion</option>
                        <option value="Other">Other Selection Board</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Starting Salary Band</label>
                      <select
                        value={empSalary}
                        onChange={(e) => setEmpSalary(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      >
                        <option value="Under ₹4,000 / month">Under ₹4,000 / month</option>
                        <option value="₹4,001 - ₹10,000 / month">₹4,001 - ₹10,000 / month</option>
                        <option value="₹10,001 - ₹25,000 / month">₹10,001 - ₹25,000 / month</option>
                        <option value="₹25,001 - ₹50,000 / month">₹25,001 - ₹50,000 / month</option>
                        <option value="Above ₹50,000 / month">Above ₹50,000 / month</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Years of Experience</label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Years, 6 Months"
                        value={empExp}
                        onChange={(e) => setEmpExp(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Key Role & Duties Description</label>
                    <textarea
                      rows={2}
                      placeholder="Briefly mention what technological modules, workshop tools, or operations you handle at the company."
                      value={empDesc}
                      onChange={(e) => setEmpDesc(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">How much did your educational pathway help in your current job? *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Did your 10th/Intermediate/Diploma curriculum lay down valuable logical blocks? Share honest reflections."
                      value={empEducationFeedback}
                      onChange={(e) => setEmpEducationFeedback(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* 4.2: BUSINESS OWNER DETAIL FORM */}
              {careerStatus === 'Business Owner' && (
                <div className="border-t border-black pt-4 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Business / Venture Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TechEdge Solutions, Sri Sai Electrical Services"
                        value={bizName}
                        onChange={(e) => setBizName(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Venture Industry *</label>
                      <input
                        type="text"
                        placeholder="e.g. Renewable Energy, Software Contracting"
                        value={bizIndustry}
                        onChange={(e) => setBizIndustry(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Years Active</label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Years, Started 2022"
                        value={bizYears}
                        onChange={(e) => setBizYears(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700 font-sans">Team Capacity Size</label>
                      <input
                        type="text"
                        placeholder="e.g. 5 members, 12 experts"
                        value={bizTeam}
                        onChange={(e) => setBizTeam(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Venture Operations Description</label>
                    <textarea
                      rows={2}
                      placeholder="Comment on your customer offerings and market focus."
                      value={bizDesc}
                      onChange={(e) => setBizDesc(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">How did your early academic education support your business launch? *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Did the calculations, board projects, or peer labs help lay down organizational principles?"
                      value={bizEducationFeedback}
                      onChange={(e) => setBizEducationFeedback(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* 4.3: SELF EMPLOYED / FREELANCER DETAIL FORM */}
              {careerStatus === 'Self Employed / Freelancer' && (
                <div className="border-t border-black pt-4 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Functional Profession *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CNC Lathe Contractor, Full-Stack Freelance dev"
                        value={selfProfession}
                        onChange={(e) => setSelfProfession(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Active Years of Experience *</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Years, 5 Years"
                        value={selfExp}
                        onChange={(e) => setSelfExp(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Major Operations & Tools Used</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Figma wireframing, SolidWorks CAD fabrication"
                      value={selfSkills}
                      onChange={(e) => setSelfSkills(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">How did your DIRPA school path setup your freelancing operations? *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Did standard math curriculum or workshop tools provide functional independence?"
                      value={selfEducationFeedback}
                      onChange={(e) => setSelfEducationFeedback(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* 4.4: HIGHER STUDIES DETAIL FORM */}
              {careerStatus === 'Higher Studies' && (
                <div className="border-t border-black pt-4 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Active Higher Study Program *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. M.Tech in Power Electronics, MBA in Operations"
                        value={studiesProgram}
                        onChange={(e) => setStudiesProgram(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-gray-700">Institution Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Indian Institute of Technology, Madras"
                        value={studiesInstitution}
                        onChange={(e) => setStudiesInstitution(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Active Specialization Focus</label>
                    <input
                      type="text"
                      placeholder="e.g. Deep learning networks, High voltage welding mechanics"
                      value={studiesSpeciality}
                      onChange={(e) => setStudiesSpeciality(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">How did your early school/intermediate paths set up your higher education? *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Did Junior College MPC or Polytechnic labs lay down the fundamental calculations?"
                      value={studiesEducationFeedback}
                      onChange={(e) => setStudiesEducationFeedback(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* 4.5: UNEMPLOYED */}
              {careerStatus === 'Unemployed' && (
                <div className="border-t border-black pt-4 space-y-4 animate-fade-in text-black">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Current Preparatory Activities *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Preparing for GATE Exam, studying software coding, appearing for government junior engineer tests"
                      value={unempActivities}
                      onChange={(e) => setUnempActivities(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Specific Additional Certifications Gained</label>
                    <input
                      type="text"
                      placeholder="e.g. AWS Solutions Architect, CNC shop workshop certificate"
                      value={unempCertifications}
                      onChange={(e) => setUnempCertifications(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Core Career Aspirations</label>
                    <textarea
                      rows={2}
                      placeholder="What is your desired professional target roll in the upcoming calendar year?"
                      value={unempAspirations}
                      onChange={(e) => setUnempAspirations(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: FINAL ADVICE */}
          {activeStepId === 'mentorship' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-black pb-3">
                <span className="text-[10px] font-mono font-black text-blue-600 block mb-0.5">// STEP 0{steps.length} OF 0{steps.length} — STRATEGIC COUNSEL</span>
                <h2 className="text-xl font-display font-black uppercase">Distilled Mentorship Advice & Profile Preview</h2>
                <p className="text-xs text-gray-400">Wrap up your onboarding journey by providing highly tailored wisdom parameters to scholars study paths.</p>
              </div>

              {/* Distilled details */}
              <div className="space-y-4 text-black">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-750 block">
                    🌟 Direct Career Advice for Scholars *
                  </label>
                  <p className="text-[10px] text-gray-400 font-sans m-0 leading-none">// Practical steps for students taking this exact track</p>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide your highly recommended career steps. e.g. 'Master data structures early, build GitHub repositories, apply for off-campus internships rather than just waiting for general college events...'"
                    value={adviceFinalCareer}
                    onChange={(e) => setAdviceFinalCareer(e.target.value)}
                    className="w-full border-2 border-black p-2.5 bg-stone-50 font-sans text-xs focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Course Recommendation</label>
                    <input
                      type="text"
                      placeholder="e.g. Master Applied Mathematics, study CAD modeling"
                      value={adviceFinalCourse}
                      onChange={(e) => setAdviceFinalCourse(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Common Academic Mistakes to Avoid</label>
                    <input
                      type="text"
                      placeholder="e.g. Overlooking laboratory marks, rote-learning formulas"
                      value={adviceFinalMistakes}
                      onChange={(e) => setAdviceFinalMistakes(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Primary Core Success Tips</label>
                  <input
                    type="text"
                    placeholder="e.g. Stay curious, solve questions weekly, build strong networks"
                    value={adviceFinalTips}
                    onChange={(e) => setAdviceFinalTips(e.target.value)}
                    className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs"
                  />
                </div>
              </div>

              {/* PROFILE DESIGN CUSTOMIZER */}
              <div className="border-t-2 border-black pt-5 mt-5 space-y-4">
                <span className="text-xs font-mono font-black text-rose-600 block uppercase tracking-wider">// CUSTOMIZE VISUAL ADVISOR AVATAR</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-750">Directory Nickname</label>
                    <input
                      type="text"
                      placeholder="Specify display name"
                      value={nickName}
                      onChange={(e) => setNickName(e.target.value)}
                      className="w-full border-2 border-black p-2 bg-stone-50 font-sans text-xs focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700 block">Choose Advisor Avatar</label>
                    <div className="flex flex-wrap gap-1.5">
                      {emojis.map(e => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setUserAvatar(e)}
                          className={`w-7 h-7 rounded border-2 border-black flex items-center justify-center text-sm cursor-pointer transition-all ${
                            userAvatar === e ? 'bg-indigo-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ring-2 ring-indigo-500' : 'bg-white hover:bg-stone-50'
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM NAVIGATION ACTIONS */}
          <div className="flex justify-between items-center border-t border-black pt-6 mt-8">
            <button
              type="button"
              disabled={safeStepIndex === 0 || submitting}
              onClick={() => setCurrentStep(Math.max(0, safeStepIndex - 1))}
              className="flex items-center gap-1 px-4 py-2 border-2 border-black bg-white hover:bg-stone-50 text-xs font-mono font-black uppercase tracking-tight disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back Stage
            </button>

            {safeStepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setStepErrorBanner(null);
                  if (activeStepId === 'class10') {
                    if (!schoolName10.trim()) {
                      setStepErrors(prev => ({ ...prev, schoolName10: "High school name is required." }));
                      setStepErrorBanner("Please specify your High School Name to proceed.");
                      return;
                    }
                  }
                  if (activeStepId === 'pathway') {
                    if (educationalPathway === 'intermediate' && !collegeNameInter.trim()) {
                      setStepErrors(prev => ({ ...prev, collegeNameInter: "Intermediate College name is required." }));
                      setStepErrorBanner("Please specify your Intermediate Junior College name.");
                      return;
                    }
                    if (educationalPathway === 'polytechnic' && !polyName.trim()) {
                      setStepErrors(prev => ({ ...prev, polyName: "Government Polytechnic name is required." }));
                      setStepErrorBanner("Please specify your Government Polytechnic College name.");
                      return;
                    }
                    if (educationalPathway === 'iti' && !itiName.trim()) {
                      setStepErrors(prev => ({ ...prev, itiName: "ITI institution name is required." }));
                      setStepErrorBanner("Please specify your ITI Institution name.");
                      return;
                    }
                  }
                  if (activeStepId === 'graduation') {
                    if (gradStatus === 'Currently Studying') {
                      if (!studyingCollege.trim() || !studyingDegree.trim()) {
                        setStepErrorBanner("Please specify your current college and active degree program.");
                        return;
                      }
                    } else if (gradStatus === 'Completed Graduation') {
                      if (!compCollege.trim() || !compDegree.trim()) {
                        setStepErrorBanner("Please specify your degree college and completed degree name.");
                        return;
                      }
                    }
                  }
                  if (activeStepId === 'career') {
                    if (careerStatus === 'Employed' && (!empCompany.trim() || !empTitle.trim())) {
                      setStepErrorBanner("Please specify your employer company and professional designation.");
                      return;
                    }
                  }
                  setStepErrors({});
                  setStepErrorBanner(null);
                  setCurrentStep(safeStepIndex + 1);
                }}
                className="flex items-center gap-1 px-5 py-2 border-2 border-black bg-yellow-250 hover:bg-yellow-300 text-xs font-mono font-black uppercase tracking-tight cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
              >
                Next Stage <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitJourney}
                className="flex items-center gap-1.5 px-6 py-2 border-2 border-black bg-emerald-400 hover:bg-emerald-500 text-xs font-mono font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,01)] transition-all"
              >
                <FileCheck className="w-4 h-4" /> {submitting ? "Publishing Profile..." : "Verify & Complete Setup"}
              </button>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: RELEVANT REAL-TIME DISPLAY PREVIEWS (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* 1. INTERACTIVE PATH TIMELINE GRAPH */}
          <div className="border-2 border-black bg-stone-900 border-zinc-700 text-zinc-100 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm">
            <span className="text-[9px] font-mono font-black text-amber-500 uppercase block mb-1 tracking-widest">// ALUMNI TIMELINE MAP</span>
            <h3 className="text-sm font-display font-black uppercase text-white mb-4 border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" /> My Academic Milestones
            </h3>

            <div className="relative border-l-2 border-zinc-700 pl-4 space-y-5 py-1 text-xs">
              {currentTimeline.map((item, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <span className={`absolute -left-[22.5px] top-1 w-2 h-2 rounded-full border border-zinc-900 ${
                    item.type === 'job' 
                      ? 'bg-blue-400' 
                      : (item.type === 'milestone' ? 'bg-amber-400' : 'bg-zinc-400')
                  }`} />

                  <div className="flex items-center gap-2 mb-0.5 select-none leading-none">
                    <span className="text-[8px] font-mono bg-zinc-800 text-zinc-300 font-black px-1.5 py-0.5 border border-zinc-700 leading-none">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-zinc-500">
                      {item.year}
                    </span>
                  </div>

                  <p className="font-sans font-extrabold text-zinc-100 uppercase tracking-tight text-[10.5px] m-0 leading-tight">
                    {item.courseName}
                  </p>
                  <p className="text-[9.5px] text-zinc-400 font-mono m-0 mt-0.5 leading-tight">
                    {item.schoolName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. REALTIME ADVISORY CARD PREVIEW */}
          <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm text-black relative">
            <div className="absolute top-4 right-4 flex items-center text-yellow-600 font-mono text-[10px]">
              <ThumbsUp className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-black">5.0</span>
            </div>

            <span className="text-[9px] font-mono font-black text-rose-600 uppercase block mb-1 tracking-widest">// ALUMNI DIRECTORY CARD</span>
            <h3 className="text-sm font-display font-black uppercase text-black mb-4 border-b border-black pb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-rose-500" /> Card Live Preview
            </h3>

            <div className="flex items-center gap-3 mb-3 text-black">
              <div className="shrink-0">
                <AvatarDisplay
                  avatar={userAvatar || user.avatar}
                  name={nickName || user.name || 'Scholar'}
                  className="w-10 h-10 rounded-full border border-black shadow-sm"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-black uppercase text-black leading-snug truncate">
                  {nickName || user.name || 'Scholar Contributor'}
                </h5>
                <span className="text-[9.5px] text-gray-600 font-mono block leading-snug truncate mt-0.5">
                  {currentStats.institution} • {currentStats.year}
                </span>
              </div>
            </div>

            <div className="bg-stone-50 border border-black/10 p-3 mb-3">
              <span className="text-[9px] font-mono text-gray-500 block mb-1 uppercase tracking-wider">// LEARNING EXPERIENCES</span>
              <p className="text-[10.5px] italic text-zinc-800 font-sans leading-snug line-clamp-3 m-0">
                "{currentStats.experience}"
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-amber-700 font-bold block uppercase tracking-wider">// ADVISOR INSIGHTS</span>
              <p className="text-[10px] text-gray-600 font-semibold leading-snug line-clamp-2 m-0">
                💡 Advice: {currentStats.advice}
              </p>
            </div>

            {/* Profile pill */}
            <div className="mt-4 border-t border-dashed border-black pt-3 flex items-center justify-between gap-2">
              <span className="text-[9.5px] font-mono bg-indigo-50 border border-indigo-200 text-indigo-800 font-black px-2 py-0.5 uppercase truncate shrink-0">
                {currentStats.role}
              </span>
              <span className="text-[8.5px] text-gray-500 font-mono shrink-0">
                Verified Mentor Contributor
              </span>
            </div>
          </div>

          {/* 3. VERIFIED MENTOR ENCOURAGER */}
          <div className="border-2 border-black bg-blue-50 text-[#1E3A8A] p-4 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] tracking-normal rounded-sm">
            <h4 className="text-xs font-black uppercase tracking-tight text-blue-900 flex items-center gap-1.5 mb-1.5 font-display">
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-300" /> Platform Impact Metrics
            </h4>
            <p className="text-[11px] text-[#1E3A8A] leading-relaxed font-semibold m-0">
              When you publish, your feedbacks are mapped across standard student roadmaps. Junior students will see your reviews and experience directly under relevant course tabs to inspect criteria or clear doubts. Thank you for your support!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
