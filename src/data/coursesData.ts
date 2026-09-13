import { AcademicPathway, AlumniInsight } from '../types';

export interface IntermediateGroup {
  code: string;
  name: string;
  subjects: string[];
  nextStudies: string[];
}

export interface PolytechnicDiploma {
  id: string;
  name: string;
  isEngineering: boolean;
  lateralBTech: string;
  description: string;
}

export interface ITIVocationalTrade {
  name: string;
  type: 'ITI - Engineering' | 'ITI - Non-Engineering' | 'Vocational';
  duration: string;
  certification: string;
  description: string;
  careerPath: string;
}

// 85 Intermediate groups parsed from the direct real Andhra Pradesh / national list
export const INTERMEDIATE_GROUPS: IntermediateGroup[] = [
  { code: '001', name: 'MPC', subjects: ['Maths-A', 'Maths-B', 'Physics', 'Chemistry'], nextStudies: ['B.Tech', 'B.E', 'B.Arch', 'BCA', 'B.Sc (Maths/Physics/Chemistry/CS)', 'B.Stat', 'BBA', 'B.Com', 'NDA', 'Merchant Navy', 'CA', 'CS', 'CMA'] },
  { code: '002', name: 'MEC', subjects: ['Maths-A', 'Maths-B', 'Economics', 'Commerce'], nextStudies: ['B.Com', 'BBA', 'BMS', 'BBM', 'BCA', 'B.Sc Statistics', 'Economics', 'Data Science', 'CA', 'CS', 'CMA', 'Law'] },
  { code: '003', name: 'BPC', subjects: ['Botany', 'Zoology', 'Physics', 'Chemistry'], nextStudies: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'BUMS', 'BPT', 'B.Pharm', 'Pharm.D', 'B.Sc Nursing', 'Agriculture', 'Veterinary', 'Biotechnology', 'Microbiology', 'Forensic Science', 'CA', 'CS', 'CMA'] },
  { code: '004', name: 'CEC', subjects: ['Economics', 'Commerce', 'Civics', '-'], nextStudies: ['B.Com', 'BBA', 'BMS', 'BBM', 'BA', 'BSW', 'Journalism', 'Hotel Management', 'CA', 'CS', 'CMA', 'Law'] },
  { code: '005', name: 'HEC', subjects: ['Economics', 'History', 'Civics', '-'], nextStudies: ['BA', 'BSW', 'Journalism', 'Psychology', 'Political Science', 'History', 'Public Administration', 'Law', 'Hotel Management'] },
  { code: '006', name: 'ECH', subjects: ['Economics', 'Commerce', 'History', '-'], nextStudies: ['B.Com', 'BBA', 'BA Economics', 'CA', 'CS', 'CMA', 'Law'] },
  { code: '007', name: 'ECG', subjects: ['Economics', 'Commerce', 'Geography', '-'], nextStudies: ['BA Geography', 'Economics', 'BBA', 'B.Com', 'Tourism', 'Civil Services preparation', 'Law'] },
  { code: '008', name: 'HCML(TEL)', subjects: ['History', 'Civics', 'ML-Telugu', '-'], nextStudies: ['BA History', 'ML-Telugu Literature', 'Law', 'Civil Services'] },
  { code: '009', name: 'HCML(U)', subjects: ['History', 'Civics', 'ML-Urdu', '-'], nextStudies: ['BA Urdu', 'History', 'Social Work'] },
  { code: '010', name: 'HCML(H)', subjects: ['History', 'Civics', 'ML-Hindi', '-'], nextStudies: ['BA Hindi Literature', 'Journalism', 'Civil Services'] },
  { code: '011', name: 'HCML(TA)', subjects: ['History', 'Civics', 'ML-Tamil', '-'], nextStudies: ['BA Tamil', 'History', 'Law'] },
  { code: '012', name: 'HCML(M)', subjects: ['History', 'Civics', 'ML-Marathi', '-'], nextStudies: ['BA Marathi', 'History', 'Social Work'] },
  { code: '013', name: 'HCML(K)', subjects: ['History', 'Civics', 'ML-Kannada', '-'], nextStudies: ['BA Kannada', 'Public Administration', 'Law'] },
  { code: '014', name: 'HCML(O)', subjects: ['History', 'Civics', 'ML-Oriya', '-'], nextStudies: ['BA Oriya', 'Social Sciences'] },
  { code: '015', name: 'HCML(E)', subjects: ['History', 'Civics', 'ML-English', '-'], nextStudies: ['BA English Literature', 'Journalism', 'Mass Communication'] },
  { code: '016', name: 'EC SOCIO', subjects: ['Economics', 'Civics', 'Sociology', '-'], nextStudies: ['BA Sociology', 'Social Work', 'Psychology', 'Public Administration', 'Law'] },
  { code: '017', name: 'HC SOCIO', subjects: ['History', 'Civics', 'Sociology', '-'], nextStudies: ['BA Sociology', 'History', 'Political Science', 'Social Work', 'Law'] },
  { code: '018', name: 'ME LO', subjects: ['Maths-A', 'Maths-B', 'Economics', 'Logic'], nextStudies: ['B.Com', 'BBA', 'BCA', 'Statistics', 'Economics', 'Data Science', 'CA', 'CS', 'CMA'] },
  { code: '019', name: 'GO PHY CHE', subjects: ['Geology', 'Physics', 'Chemistry', '-'], nextStudies: ['Geology', 'Earth Sciences', 'Mining Engineering', 'Environmental Science', 'B.Sc Geology'] },
  { code: '020', name: 'PHY CHE HO SCI', subjects: ['Physics', 'Chemistry', 'Home Science', '-'], nextStudies: ['Home Science', 'Nutrition', 'Food Technology', 'Fashion Technology', 'B.Sc Chemistry'] },
  { code: '021', name: 'ECO LO CO', subjects: ['Economics', 'Logic', 'Commerce', '-'], nextStudies: ['B.Com', 'BBA', 'Law', 'CA', 'CS', 'CMA'] },
  { code: '022', name: 'ECO LO HIS', subjects: ['Economics', 'Logic', 'History', '-'], nextStudies: ['BA History', 'Law', 'Public Administration', 'Civil Services'] },
  { code: '023', name: 'ECO CO PUB', subjects: ['Economics', 'Commerce', 'Public Admn', '-'], nextStudies: ['B.Com', 'BBA', 'Public Administration', 'CA', 'CS'] },
  { code: '024', name: 'ECO CO ML-TEL', subjects: ['Economics', 'Commerce', 'ML-Telugu', '-'], nextStudies: ['B.Com', 'BA Telugu', 'Journalism'] },
  { code: '025', name: 'ECML(U)', subjects: ['Economics', 'Commerce', 'ML-Urdu', '-'], nextStudies: ['B.Com', 'BA Urdu', 'Translation'] },
  { code: '026', name: 'ECML(H)', subjects: ['Economics', 'Commerce', 'ML-Hindi', '-'], nextStudies: ['B.Com', 'BA Hindi', 'Translation'] },
  { code: '027', name: 'ECML(T)', subjects: ['Economics', 'Commerce', 'ML-Tamil', '-'], nextStudies: ['B.Com', 'BA Tamil', 'Law'] },
  { code: '028', name: 'ECML(M)', subjects: ['Economics', 'Commerce', 'ML-Marathi', '-'], nextStudies: ['B.Com', 'BA Marathi', 'Civil Services'] },
  { code: '029', name: 'ECML(K)', subjects: ['Economics', 'Commerce', 'ML-Kannada', '-'], nextStudies: ['B.Com', 'BA Kannada', 'Public Relations'] },
  { code: '030', name: 'ECML(O)', subjects: ['Economics', 'Commerce', 'ML-Oriya', '-'], nextStudies: ['B.Com', 'BA Oriya', 'Social Work'] },
  { code: '031', name: 'ECO ML-ENG', subjects: ['Economics', 'Commerce', 'ML-English', '-'], nextStudies: ['BA English', 'BBA', 'Journalism', 'Corporate Relations'] },
  { code: '032', name: 'ECO HIS SOC', subjects: ['Economics', 'History', 'Sociology', '-'], nextStudies: ['Sociology', 'Social Work', 'Psychology', 'BA Economics'] },
  { code: '033', name: 'ECO HIS GEO', subjects: ['Economics', 'History', 'Geography', '-'], nextStudies: ['Geography', 'Economics', 'Tourism', 'Urban Planning'] },
  { code: '034', name: 'GHML(TEL)', subjects: ['Economics', 'History', 'ML-Telugu', '-'], nextStudies: ['BA Telugu', 'History', 'Social Work'] },
  { code: '035', name: 'GHML(U)', subjects: ['Economics', 'History', 'ML-Urdu', '-'], nextStudies: ['BA Urdu', 'History', 'Journalism'] },
  { code: '036', name: 'GHML(H)', subjects: ['Economics', 'History', 'ML-Hindi', '-'], nextStudies: ['BA Hindi', 'History', 'Teaching'] },
  { code: '037', name: 'GHML(T)', subjects: ['Economics', 'History', 'ML-Tamil', '-'], nextStudies: ['BA Tamil', 'History', 'Tourism'] },
  { code: '038', name: 'GHML(M)', subjects: ['Economics', 'History', 'ML-Marathi', '-'], nextStudies: ['BA Marathi', 'History', 'Archival Science'] },
  { code: '039', name: 'GHML(K)', subjects: ['Economics', 'History', 'ML-Kannada', '-'], nextStudies: ['BA Kannada', 'History', 'Social Welfare'] },
  { code: '040', name: 'GHML(O)', subjects: ['Economics', 'History', 'ML-Oriya', '-'], nextStudies: ['BA Oriya', 'History'] },
  { code: '041', name: 'GHML(E)', subjects: ['Economics', 'History', 'ML-English', '-'], nextStudies: ['BA English', 'History', 'Media & Arts'] },
  { code: '042', name: 'ECO HIS MUS', subjects: ['Economics', 'History', 'Music', '-'], nextStudies: ['Music', 'Performing Arts', 'Fine Arts', 'BA'] },
  { code: '043', name: 'ECO CIV PUB', subjects: ['Economics', 'Civics', 'History', 'Public Admn'], nextStudies: ['Public Administration', 'Political Science', 'Law', 'Civil Services'] },
  { code: '044', name: 'LO HIS CIV', subjects: ['Logic', 'History', 'Civics', '-'], nextStudies: ['Law', 'Public Administration', 'History', 'Political Science'] },
  { code: '045', name: 'CO CIV PUB', subjects: ['Commerce', 'Commerce', 'Public Admn', '-'], nextStudies: ['B.Com', 'BBA', 'Public Administration', 'CA', 'CS'] },
  { code: '046', name: 'HIS CIV GEO', subjects: ['History', 'Civics', 'Geography', '-'], nextStudies: ['Geography', 'Urban Planning', 'Archaeology', 'Tourism'] },
  { code: '047', name: 'HIS CIV PUB', subjects: ['History', 'Civics', 'Public Admn', '-'], nextStudies: ['Political Science', 'Public Administration', 'Law'] },
  { code: '048', name: 'HIS CIV CL-SAN', subjects: ['History', 'Civics', 'CL-Sanskrit', '-'], nextStudies: ['BA Sanskrit', 'History', 'Teaching', 'Linguistics'] },
  { code: '049', name: 'HIS CIV CL PER', subjects: ['History', 'Civics', 'CL-Persian', '-'], nextStudies: ['BA Persian', 'Archival history', 'Civil services'] },
  { code: '050', name: 'HIS CIV ARA', subjects: ['History', 'Civics', 'CL-Arabic', '-'], nextStudies: ['BA Arabic', 'Islamic history', 'Interpretation'] },
  { code: '051', name: 'HIS CIV MUS', subjects: ['History', 'Civics', 'Music', '-'], nextStudies: ['BA Music', 'Fine arts', 'Performing arts'] },
  { code: '052', name: 'HIS ML-TEL CL-SAN', subjects: ['History', 'ML-Telugu', 'CL-Sanskrit', '-'], nextStudies: ['BA Telugu/Sanskrit', 'History', 'Journalism'] },
  { code: '053', name: 'HIS ML-TEL CL-PER', subjects: ['History', 'ML-Telugu', 'CL-Persian', '-'], nextStudies: ['BA Telugu', 'Linguistics'] },
  { code: '054', name: 'HIS ML-TEL CL-ARA', subjects: ['History', 'ML-Telugu', 'CL-Arabic', '-'], nextStudies: ['BA Telugu', 'Linguistics'] },
  { code: '055', name: 'HIS ML-TEL MUS', subjects: ['History', 'ML-Telugu', 'Music', '-'], nextStudies: ['Musicology', 'BA performing arts', 'Teaching'] },
  { code: '056', name: 'HIS ML-U CL-SAN', subjects: ['History', 'ML-Urdu', 'CL-Sanskrit', '-'], nextStudies: ['BA Urdu', 'Linguistics', 'Sanskrit'] },
  { code: '057', name: 'HIS ML-U CL-PER', subjects: ['History', 'ML-Urdu', 'CL-Persian', '-'], nextStudies: ['BA Urdu', 'Persian literature', 'Translation studies'] },
  { code: '058', name: 'HIS ML-U CL-ARA', subjects: ['History', 'ML-Urdu', 'CL-Arabic', '-'], nextStudies: ['BA Urdu/Arabic', 'Islamic History', 'Linguistics'] },
  { code: '059', name: 'HIS ML-U MUS', subjects: ['History', 'ML-Urdu', 'Music', '-'], nextStudies: ['BA Music', 'Cultural history'] },
  { code: '060', name: 'HIS ML-H CL-SAN', subjects: ['History', 'ML-Urdu', 'CL-Sanskrit', '-'], nextStudies: ['BA Hindi/Sanskrit', 'Education'] },
  { code: '061', name: 'HIS ML-H CL-PER', subjects: ['History', 'ML-Hindi', 'CL-Persian', '-'], nextStudies: ['BA Hindi', 'Persian literature'] },
  { code: '062', name: 'HIS ML-H CL-ARA', subjects: ['History', 'ML-Hindi', 'CL-Arabic', '-'], nextStudies: ['BA Hindi', 'Translation'] },
  { code: '063', name: 'HIS ML-H MUS', subjects: ['History', 'ML-Hindi', 'CL-Arabic', '-'], nextStudies: ['BA Music', 'Teaching', 'Performing arts'] },
  { code: '064', name: 'HIS ML-T CL-SAN', subjects: ['History', 'ML-Tamil', 'CL-Sanskrit', '-'], nextStudies: ['BA Tamil/Sanskrit', 'History'] },
  { code: '065', name: 'HIS ML-T CL-PER', subjects: ['History', 'ML-Tamil', 'CL-Persian', '-'], nextStudies: ['BA Tamil', 'Translation'] },
  { code: '066', name: 'HIS ML-T CL-ARA', subjects: ['History', 'ML-Tamil', 'CL-Arabic', '-'], nextStudies: ['BA Tamil', 'Islamic studies'] },
  { code: '067', name: 'HIS ML-T MUS', subjects: ['History', 'ML-Tamil', 'Music', '-'], nextStudies: ['Carnatic Music', 'BA Tamil', 'Musicology'] },
  { code: '068', name: 'HIS ML-M CL-SAN', subjects: ['History', 'ML-Marathi', 'CL-Sanskrit', '-'], nextStudies: ['BA Marathi', 'Sanskrit'] },
  { code: '069', name: 'HIS ML-M CL-PER', subjects: ['History', 'ML-Marathi', 'CL-Persian', '-'], nextStudies: ['BA Marathi', 'History'] },
  { code: '070', name: 'HIS ML-CL-ARA', subjects: ['History', 'ML-Marathi', 'CL-Arabic', '-'], nextStudies: ['BA Marathi', 'Translation'] },
  { code: '071', name: 'HIS ML-M CL MUS', subjects: ['History', 'ML-Marathi', 'Music', '-'], nextStudies: ['BA Music', 'Teaching'] },
  { code: '072', name: 'HIS ML-K CL-SAN', subjects: ['History', 'ML-Kannada', 'CL-Sanskrit', '-'], nextStudies: ['BA Kannada/Sanskrit', 'History'] },
  { code: '073', name: 'HIS ML-K CL-PER', subjects: ['History', 'ML-Kannada', 'CL-Persian', '-'], nextStudies: ['BA Kannada', 'Translation'] },
  { code: '074', name: 'HIS ML-K CL-ARA', subjects: ['History', 'ML-Kannada', 'CL-Arabic', '-'], nextStudies: ['BA Kannada', 'Linguistics'] },
  { code: '075', name: 'HIS ML-K MUS', subjects: ['History', 'ML-Kannada', 'CL-Music', '-'], nextStudies: ['Carnatic Music', 'BA Kannada'] },
  { code: '076', name: 'HIS ML-O CL-SAN', subjects: ['History', 'ML-Oriya', 'CL-Sanskrit', '-'], nextStudies: ['BA Oriya/Sanskrit', 'Education'] },
  { code: '077', name: 'HIS ML-O CL-PER', subjects: ['History', 'ML-Oriya', 'CL-Persian', '-'], nextStudies: ['BA Oriya', 'History'] },
  { code: '078', name: 'HIS ML-O CL-ARA', subjects: ['History', 'ML-Oriya', 'CL-Arabic', '-'], nextStudies: ['BA Oriya', 'Interpretation'] },
  { code: '079', name: 'HIS ML-O MUS', subjects: ['History', 'ML-Oriya', 'CL-Music', '-'], nextStudies: ['Odissi Music', 'BA Oriya'] },
  { code: '080', name: 'HIS ML-E CL-SAN', subjects: ['History', 'ML-English', 'CL-Sanskrit', '-'], nextStudies: ['BA English/Sanskrit', 'Teaching'] },
  { code: '081', name: 'HIS ML-E CL-PER', subjects: ['History', 'ML-English', 'CL-Persian', '-'], nextStudies: ['BA English', 'Publishing'] },
  { code: '082', name: 'HIS ML-E CL-ARA', subjects: ['History', 'ML-English', 'CL-Arabic', '-'], nextStudies: ['BA English', 'Translation'] },
  { code: '083', name: 'HIS ML-E MUS', subjects: ['History', 'ML-English', 'Music', '-'], nextStudies: ['BA English', 'Fine arts', 'Performing arts'] },
  { code: '084', name: 'CIV SOC PUB', subjects: ['Civics', 'Sociology', 'Public Admn', '-'], nextStudies: ['Sociology', 'Public Administration', 'Social Work'] },
  { code: '085', name: 'PSY ECO HIS', subjects: ['Psychology', 'Economics', 'History', '-'], nextStudies: ['Psychology', 'Counselling', 'Social Work', 'HR', 'BA Economics'] }
];

// All 26 unique polytechnic engineering and non-engineering courses
export const POLYTECHNIC_DIPLOMAS: PolytechnicDiploma[] = [
  { id: 'poly_applied_art', name: 'Applied Art (Commercial Art)', isEngineering: false, lateralBTech: 'Creative fields (BFA, Bachelor of Design); no direct B.Tech lateral path.', description: 'Focuses on visual communication, advertisement, graphic layout, vector illustration, and promotional typography.' },
  { id: 'poly_arch', name: 'Architectural Assistantship', isEngineering: true, lateralBTech: 'Eligible for direct lateral entry into B.Arch (where criteria permit) or civil-related courses.', description: 'Practical drafting, CAD rendering, scale modeling, structural design theory, and building estimation.' },
  { id: 'poly_art_draw', name: 'Art for Drawing Teachers', isEngineering: false, lateralBTech: 'No direct B.Tech lateral path; aligns with fine arts teaching courses.', description: 'Pedagogy of visual drawings, design compositions, oil paints, standard sketches, and curriculum development.' },
  { id: 'poly_automobile', name: 'Automobile Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Mechanical Engineering (as per AP ECET rules).', description: 'Internal combustion engines, automotive transmissions, braking systems, electric vehicles (EV), and workshop maintenance.' },
  { id: 'poly_cosmetology', name: 'Cosmetology & Health', isEngineering: false, lateralBTech: 'No direct B.Tech lateral path; connects to vocational healthcare or hospitality degrees.', description: 'Dermatological basics, hair structure styling, nutrition science, therapeutic cosmetology, and wellness management.' },
  { id: 'poly_chemical', name: 'Chemical Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Chemical Engineering or Biotechnology.', description: 'Mass and heat transfer, thermodynamics, fluid flow operations, reaction dynamics, and petrochemical pipeline systems.' },
  { id: 'poly_civil', name: 'Civil Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Civil Engineering.', description: 'Structural drafting, concrete tech, surveying, soil mechanics, environmental engineering, and site surveillance.' },
  { id: 'poly_civil_const', name: 'Civil Engineering (Construction Engineering)', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Civil Engineering.', description: 'Sub-variant specializing in construction schedules, concrete mixers, contract files, and safety audits.' },
  { id: 'poly_civil_ph', name: 'Civil Engineering (Public Health & Environmental)', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Civil Engineering.', description: 'Specialized focus on water purification setups, drainage layout design, ecological sanitation, and civic planning.' },
  { id: 'poly_computer', name: 'Computer Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Computer Science & Engineering (and related computing branches).', description: 'Data structures, computer architectures, web programming, relational databases, software design, and system diagnostics.' },
  { id: 'poly_digital_elec', name: 'Digital Electronics', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Electronics & Communication Engineering (ECE).', description: 'Microprocessors, logic circuit systems, operational amplifiers, communication arrays, and digital filter arrays.' },
  { id: 'poly_electrical', name: 'Electrical Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Electrical and Electronics Engineering (EEE).', description: 'AC/DC machinery, transformer operations, electrical power grid generation, circuit analysis, and plant wiring safety.' },
  { id: 'poly_ece', name: 'Electronics & Communication Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Electronics & Communication Engineering.', description: 'Signal modulation, integrated circuits, optical fiber routing, microwave engineering, and satellite networks.' },
  { id: 'poly_fashion', name: 'Fashion Design', isEngineering: false, lateralBTech: 'No direct lateral path; qualifies for Bachelor of Design (B.Des) or related creative streams.', description: 'Pattern grading, illustration, history of costumes, textile properties, boutique management, and garment construction.' },
  { id: 'poly_garment', name: 'Garment Fabrication Technology', isEngineering: false, lateralBTech: 'No direct B.Tech lateral path; connects with textile design or industrial tailoring.', description: 'Apparel machinery automation, quality inspection, fabric cutting algorithms, and production layout management.' },
  { id: 'poly_itesm', name: 'Information Technology Enabled Services & Management (ITES&M)', isEngineering: false, lateralBTech: 'No direct B.Tech lateral path (or connects to BCA / B.Sc IT).', description: 'Voice process protocols, customer service automation, desktop layouts, network administration, and corporate desk CRM.' },
  { id: 'poly_ic', name: 'Instrumentation & Control Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Electronics & Instrumentation Engineering.', description: 'Transducers, automated controls, bio-medical probes, industrial PLCs, and SCADA data measurement systems.' },
  { id: 'poly_interior_design', name: 'Interior Design', isEngineering: false, lateralBTech: 'Creative field; no direct B.Tech lateral path. Leads to B.Des (Interior) or B.Arch with separate entrance.', description: 'Spatial layouts, furniture ergonomics, acoustical boards, light fixture plans, material pricing, and 3D interior renders.' },
  { id: 'poly_library', name: 'Library & Information Science', isEngineering: false, lateralBTech: 'No direct B.Tech lateral path; leads to Bachelor of Library Science (B.Lib.I.Sc).', description: 'Classification systems (Dewey/Colon), digital catalog cards, query retrieval protocols, and archive management.' },
  { id: 'poly_mechanical', name: 'Mechanical Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Mechanical Engineering and related specialties.', description: 'Thermodynamics, fluid mechanics, industrial CAD/CAM, workshop tooling, power generators, and material kinetics.' },
  { id: 'poly_mechanical_maint', name: 'Mechanical Engineering (Maintenance Engineering)', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Mechanical Engineering.', description: 'Focused on plant predictive failures, lubrication cycles, machine overhaul, vibration metrics, and breakdown protocols.' },
  { id: 'poly_med_elec', name: 'Medical Electronics', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Electronics & Communication Engineering or Bio-Medical Engineering.', description: 'Diagnostic rigs (ECG, EEG, Ultrasound), surgical diathermy protocols, physiological sensor boards, and hospital safety regulations.' },
  { id: 'poly_mlt', name: 'Medical Laboratory Technology', isEngineering: false, lateralBTech: 'Healthcare diploma; no direct B.Tech lateral path. Connects to B.Sc MLT degree streams.', description: 'Pathological culture cells, biochemical testing, hematology lab slides, clinical immunology, and toxicological assays.' },
  { id: 'poly_polymer', name: 'Polymer Technology', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Chemical Engineering or Polymer Science.', description: 'Polyester syntheses, extrusion machinery parameters, compound matrices, rubber vulcanization, and plastic testing.' },
  { id: 'poly_printing', name: 'Printing Technology', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Mechanical Engineering (as per AP ECET rules under Production specialization).', description: 'Flexographic plates, newsprint machinery operation, digital printer metrics, color matching arrays, and post-press layout bindings.' },
  { id: 'poly_production', name: 'Production Engineering', isEngineering: true, lateralBTech: 'Eligible for direct 2nd-year admission into B.Tech in Mechanical Engineering / Production Engineering.', description: 'Metal casting, CNC lathe programming, supply-chain quality metrics, optimization theory, and factory floor layouts.' },
  { id: 'poly_textile_design', name: 'Textile Design', isEngineering: false, lateralBTech: 'Creative design stream; no direct B.Tech lateral path.', description: 'Weaving loom matrices, organic yarn dyeing, block printing, jacquard mechanics, and fashion apparel sketching.' },
  { id: 'poly_tool_die', name: 'Tool & Die Making', isEngineering: false, lateralBTech: 'Qualifies under manufacturing; lateral paths to Mechanical production where colleges specify.', description: 'Precision mold fabrication, jig and fixture layout, micrometers calibration, CNC milling setups, and heavy press dies.' }
];

// ITI & Vocational trades
export const ITI_VOCATIONAL_TRADES: ITIVocationalTrade[] = [
  { name: 'Electrician', type: 'ITI - Engineering', duration: '2 Years', certification: 'NTC (National Trade Certificate)', description: 'Practical domestic, industrial and power-grid wiring. Motors, alternators, transformers and generator wiring setups.', careerPath: 'Junior Lineman, Electrical Maintenance technician, Railway maintenance officer, self-employed contractor.' },
  { name: 'Fitter', type: 'ITI - Engineering', duration: '2 Years', certification: 'NTC (National Trade Certificate)', description: 'Precision machining, metal filing, pipeline fittings, heavy manufacturing assembly, and welding principles.', careerPath: 'CNC Operator, Assembler in automotive factories, Railway Coach mechanic, Defense weapon plant supervisor.' },
  { name: 'Mechanic (Motor Vehicle)', type: 'ITI - Engineering', duration: '2 Years', certification: 'NTC (National Trade Certificate)', description: 'Specialized repair, assembly, and tuning of diesel engines, direct injection pumps, gearboxes, and suspension frames.', careerPath: 'Service Engineer, Depot Mechanic, Road Transport supervisor, Automotive service dealer.' },
  { name: 'COPA (Computer Operator and Programming Assistant)', type: 'ITI - Non-Engineering', duration: '1 Year', certification: 'NTC (National Trade Certificate)', description: 'Operating computing systems, relational databases (SQL), typing speed, sheet templates, basic scripting (HTML/CSS), and networking.', careerPath: 'Office Assistant, Data Entry specialist, Customer Service executive, Junior System support.' },
  { name: 'Refrigeration and Air Conditioning (RAC)', type: 'ITI - Engineering', duration: '2 Years', certification: 'NTC (National Trade Certificate)', description: 'Compressor cycles, refrigerant thermodynamics, centralized duct layouts, air filter units, and home refrigerator cooling grids.', careerPath: 'AC Plant technician, HVAC maintenance officer, Cold storage engineer, Home appliance specialist.' },
  { name: 'DMLT (Medical Laboratory Technology)', type: 'Vocational', duration: '2 Years (Post-10th)', certification: 'Vocational Diploma', description: 'Healthcare training on diagnostic specimen preparation, blood grouping, cellular slide stains, and chemical reagent balances.', careerPath: 'Lab Assistant in diagnostics centers, Clinical pathology reader, blood bank custodian.' },
  { name: 'Hotel Management & Catering', type: 'Vocational', duration: '1 - 2 Years', certification: 'Vocational Certificate / Diploma', description: 'Front office etiquette, food production, bakery tools, culinary safety, and guest service logistics.', careerPath: 'Sous Chef, Cruise liner host, Banquets operations trainee, Restaurant manager.' },
  { name: 'Graphic Designing & Web layouts', type: 'Vocational', duration: '6 Months - 1 Year', certification: 'Vocational Diploma', description: 'Visual styling in Photoshop/Illustrator, UI prototyping, wireframes, basic frontend responsive layouts.', careerPath: 'Junior Graphic Designer, Brand coordinator, Frontend design trainee.' },
  { name: 'Fashion Design & Ornamentation', type: 'Vocational', duration: '1 - 2 Years', certification: 'Vocational Diploma', description: 'Pattern layout templates, embroidery machines, traditional block printing, and local boutique management.', careerPath: 'Boutique Stylist, Costume supervisor, independent designer.' },
  { name: 'Agriculture & Smart Farming', type: 'Vocational', duration: '2 Years', certification: 'Vocational Diploma', description: 'Drip irrigation layouts, soil health metrics, seed breeding genetics, organic composting, and pesticide drone controllers.', careerPath: 'Agricultural field coordinator, smart nursery manager, seed quality manager.' }
];

export const ACADEMIC_PATHWAYS: AcademicPathway[] = [
  // 10th Class Pathways
  {
    id: 'mpc',
    level: '10th',
    category: 'Science',
    name: 'Intermediate MPC (Maths, Physics, Chemistry)',
    duration: '2 Years',
    eligibility: 'Pass 10th Class standard with Science / Maths focus',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Sanskrit/Second Language'],
    estimatedFees: '₹15,000 - ₹65,000 per year',
    description: 'The MPC stream is the premier choice for students aspiring to pursue careers in Engineering, Information Technology, physical sciences, architecture, and advanced analytical fields. It establishes strong mathematical and analytical problem-solving credentials.',
    futureOpportunities: [
      'B.Tech / B.E. (All Engineering disciplines)',
      'B.Sc. in Physics, Chemistry, Maths, or Computer Science',
      'Integrated M.Sc courses',
      'National Defence Academy (NDA) / Armed Forces Services',
      'Bachelor of Architecture (B.Arch)'
    ],
    higherEducationOptions: [
      'JEE Main & Advanced for IITs/NITs',
      'State-level Engineering Common Entrance Tests (EAMCET, MHTCET, etc.)',
      'BITSAT for BITS Pilani',
      'NATA for Architecture'
    ],
    careerOutcomes: [
      'Software Engineer / Architect',
      'Data Scientist',
      'Aerospace Engineer',
      'Construction Manager / Architect',
      'Defense Officer'
    ],
    nodePosition: { x: 25, y: 22 },
    alumniInsights: []
  },
  {
    id: 'bipc',
    level: '10th',
    category: 'Science',
    name: 'Intermediate BiPC (Biology, Physics, Chemistry)',
    duration: '2 Years',
    eligibility: 'Finished 10th Standard with Biology/Science focus',
    subjects: ['Botany', 'Zoology', 'Physics', 'Chemistry', 'English', 'Second Language'],
    estimatedFees: '₹20,000 - ₹85,000 per year',
    description: 'BiPC is the gateway path for medical, healthcare, veterinary, agricultural, and biological sciences. This stream opens up highly impactful careers dedicated to human anatomy, pharmaceuticals, research, and ecology.',
    futureOpportunities: [
      'MBBS (Medicine & Surgery) / BDS (Dental Surgery)',
      'B.Pharm (Pharmacy)',
      'B.Sc in Agriculture or Forestry',
      'BPT (Physiotherapy)',
      'B.Sc in Biotechnology / Genetics / Microbiology'
    ],
    higherEducationOptions: [
      'NEET-UG (National Eligibility cum Entrance Test) for medical entry',
      'AIIMS B.Sc nursing / paramedical entrance exams',
      'Agricultural entrance tests (ICAR AIEEA)'
    ],
    careerOutcomes: [
      'Doctor (Physician / Surgeon / Pediatrician)',
      'Clinical Research Scientist',
      'Pharmacist / Drug Inspector',
      'Agricultural Scientist',
      'Veterinary Doctor'
    ],
    nodePosition: { x: 25, y: 38 },
    alumniInsights: []
  },
  {
    id: 'cec',
    level: '10th',
    category: 'Commerce',
    name: 'Intermediate CEC (Civics, Economics, Commerce)',
    duration: '2 Years',
    eligibility: 'Passed 10th Class from any board',
    subjects: ['Commerce', 'Economics', 'Civics', 'Accountancy', 'English', 'Second Language'],
    estimatedFees: '₹12,000 - ₹35,000 per year',
    description: 'CEC is ideal for students who are intrigued by business operations, finance management, taxation, national economics, and local governance. It has a high curriculum overlap with commercial laws, accounting, and public policy.',
    futureOpportunities: [
      'B.Com (General, Computers, or Honours)',
      'Chartered Accountancy (CA Foundation path)',
      'Company Secretary (CS path)',
      'BBA (Bachelor of Business Administration)',
      'Integrated Law (BA LLB / B.Com LLB)'
    ],
    higherEducationOptions: [
      'CA Foundation exam entry directly after 12th',
      'DU ET / CUET (Central Universities Common Entrance Test)',
      'CLAT (Common Law Admission Test) for National Law Universities'
    ],
    careerOutcomes: [
      'Chartered Accountant',
      'Corporate Financial Analyst',
      'Investment Banker',
      'Corporate Legal Counsel',
      'Economic Advisor'
    ],
    nodePosition: { x: 25, y: 55 },
    alumniInsights: []
  },
  {
    id: 'polytechnic',
    level: '10th',
    category: 'Vocational',
    name: 'Polytechnic Engineering Diploma',
    duration: '3 Years',
    eligibility: 'Passed 10th Class (qualifying POLYCET)',
    subjects: ['Applied Physics', 'Engineering Mathematics', 'Branch Specific Labs (Mechanical/Computer/ECE)', 'Industrial Training'],
    estimatedFees: '₹8,000 - ₹35,000 per year',
    description: 'A structural hands-on technical pathway. Students learn real-world engineering skills in workshops rather than dry board exams. A massive advantage is the AP ECET lateral program, allowing direct jump to 2nd year B.Tech.',
    futureOpportunities: [
      'Direct admission to 2nd year B.Tech via Lateral Entry (ECET)',
      'Associate Engineer roles in public sectors (Railway, ISRO, state power grids)',
      'Merchant Navy training entry'
    ],
    higherEducationOptions: [
      'ECET (Engineering Common Entrance Test) for lateral B.Tech entry'
    ],
    careerOutcomes: [
      'Junior Engineer (JE) in State/Central Gov',
      'Production Supervisor',
      'Technical Support Specialist',
      'CAD / CAM Designer'
    ],
    nodePosition: { x: 25, y: 72 },
    alumniInsights: []
  },

  // 12th Class Pathways
  {
    id: 'btech_cs',
    level: '12th',
    category: 'Engineering',
    name: 'B.Tech Computer Science & Engineering (CSE)',
    duration: '4 Years',
    eligibility: 'Finished 12th with Maths, Physics, Chemistry (MPC) / Diploma lateral',
    subjects: ['Data Structures & Algorithms', 'Operating Systems', 'Database Systems', 'Compiler Design', 'Artificial Intelligence', 'Software Architecture'],
    estimatedFees: '₹40,000 (Govt) - ₹2,00,000 per year',
    description: 'The premier technical undergraduate degree globally. CS Engineering teaches the logical construct, design, optimization, and scaling of software applications, cyber infrastructure, intelligence databases, and neural models.',
    futureOpportunities: [
      'M.S / M.Tech in Specialized AI / Cybersecurity',
      'Direct placement in global product tech giants',
      'Founder / Tech Entrepreneurship',
      'MBA in Systems or Operations'
    ],
    higherEducationOptions: [
      'GATE Examination for IIT/IISc Masters',
      'GRE & TOEFL for global MS options',
      'CAT/GMAT for MBA entry'
    ],
    careerOutcomes: [
      'Full Stack Developer',
      'Machine Learning Engineer',
      'Database Administrator',
      'Cloud Architect',
      'Cybersecurity Analyst'
    ],
    nodePosition: { x: 75, y: 22 },
    alumniInsights: []
  },
  {
    id: 'medicine_mbbs',
    level: '12th',
    category: 'Medical',
    name: 'Bachelor of Medicine & Bachelor of Surgery (MBBS)',
    duration: '5.5 Years (including Internship)',
    eligibility: 'Finished 12th with Biology, Physics, Chemistry (BiPC) & Cleared NEET-UG with high percentile',
    subjects: ['Human Anatomy', 'Physiology', 'Biochemistry', 'Pharmacology', 'Pathology', 'General Surgery', 'Pediatrics'],
    estimatedFees: '₹12,00,000 per year',
    description: 'The elite healthcare pathway. Prepares students academically and clinically to care for patients, run surgical suites, diagnose rare clinical trends, and handle public health crises. High dedication and empathetic resilience required.',
    futureOpportunities: [
      'Master of Surgery (MS)',
      'Doctor of Medicine (MD)',
      'Clinical Health Administration (MHA)',
      'Global fellowships & PhD in clinical science'
    ],
    higherEducationOptions: [
      'NEET-PG for specialization MD/MS selection',
      'USMLE (United States Medical Licensing Examination)',
      'PLAB (UK Medical practicing licensure)'
    ],
    careerOutcomes: [
      'Specialist Doctor',
      'Healthcare Consultant',
      'Surgeon',
      'Medical Director / Superintendent',
      'Clinical Trial Lead'
    ],
    nodePosition: { x: 75, y: 38 },
    alumniInsights: []
  },
  {
    id: 'chartered_accountant',
    level: '12th',
    category: 'Specialized',
    name: 'Chartered Accountancy (CA)',
    duration: '4 - 5 Years',
    eligibility: 'Passed 12th in any stream (Commerce preferred with MEC/CEC)',
    subjects: ['Advanced Accounting', 'Corporate Laws', 'Strategic Financial Management', 'Indirect Taxes', 'Direct Taxation', 'Auditing & Assurance'],
    estimatedFees: '₹40,000 - ₹80,000 (total ICAI training and books)',
    description: 'The highest tier accounting qualification in the country. Governed by the ICAI, CA includes multiple rigorous exams (Foundation, Intermediate, Final) and a mandatory 3-year articleship handling live corporate audits and taxation.',
    futureOpportunities: [
      'Setting up an exclusive CA firm',
      'Chief Financial Officer (CFO) pathways',
      'Compliance & Legal Board Directors',
      'Strategic Financial Consulting'
    ],
    higherEducationOptions: [
      'Direct Ph.D. pathways in State Commerce departments',
      'Corporate Finance MBA programs (GMAT)',
      'DISA / ISA Information Systems audit qualification'
    ],
    careerOutcomes: [
      'Auditor & Taxation Advisor',
      'Chief Financial Officer (CFO)',
      'Investment Consultant',
      'Management Consultant',
      'Tax Practitioner'
    ],
    nodePosition: { x: 75, y: 55 },
    alumniInsights: []
  },
  {
    id: 'bba_management',
    level: '12th',
    category: 'Commerce',
    name: 'Bachelor of Business Administration (BBA)',
    duration: '3 Years',
    eligibility: 'Completed 12th in any stream (Commerce / Science)',
    subjects: ['Principles of Management', 'Marketing Management', 'Human Resource Management', 'Business Analytics', 'Consumer Behavior', 'Financial Institutions'],
    estimatedFees: '₹30,000 - ₹1,50,050 per year',
    description: 'BBA introduces students to administrative frameworks, marketing philosophies, HR dynamics, market analytics, and organization coordination. Highly action-oriented and suited for future leaders and startup builders.',
    futureOpportunities: [
      'Corporate Management Trainee program',
      'Sales and Marketing Lead',
      'Retail Operations Manager',
      'Product Management pathways'
    ],
    higherEducationOptions: [
      'CAT / GMAT / XAT / SNAP for top business schools (IIM, ISB, etc.)',
      'MS in Management globally'
    ],
    careerOutcomes: [
      'Marketing Manager',
      'HR Specialist',
      'Operations Associate',
      'Business Consultant',
      'Brand Strategist'
    ],
    nodePosition: { x: 75, y: 68 },
    alumniInsights: []
  },
  {
    id: 'btech_mechanical',
    level: '12th',
    category: 'Engineering',
    name: 'B.Tech Mechanical Engineering (ME)',
    duration: '4 Years',
    eligibility: 'Completed 12th with MPC (Maths, Physics, Chemistry)',
    subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'CAD/CAM', 'Robotics and Automation', 'Material Science'],
    estimatedFees: '₹35,000 - ₹1,80,000 per year',
    description: 'The core discipline of engineering. ME teaches mechanical forces, fluid dynamics, energy conversion systems, automatic robotic controllers, thermodynamic calculators, and machine designing.',
    futureOpportunities: [
      'Public Sector Undertakings (PSU) via GATE recruitment',
      'Automotive R&D Systems',
      'Aerospace propulsion research',
      'Robotics & Industrial Automation developer'
    ],
    higherEducationOptions: [
      'GATE Exam for M.Tech admissions at IISc/IITs',
      'MS in Automotive / Mechanics in Germany'
    ],
    careerOutcomes: [
      'Design Engineer',
      'Plant Systems Manager',
      'Robotics Automation Planner',
      'HVAC Systems Engineer'
    ],
    nodePosition: { x: 80, y: 15 },
    alumniInsights: []
  },
  {
    id: 'btech_ece',
    level: '12th',
    category: 'Engineering',
    name: 'B.Tech Electronics & Communication Engineering (ECE)',
    duration: '4 Years',
    eligibility: 'Completed 12th with MPC (Maths, Physics, Chemistry)',
    subjects: ['Analog Networks', 'Microcontrollers & IoT', 'Digital Signal Processing', 'VLSI Design', 'Electromagnetics & Waves', 'Embedded OS firmware'],
    estimatedFees: '₹40,000 - ₹2,10,000 per year',
    description: 'ECE connects raw semiconductor hardware to software systems. Encompasses microprocessor design, radio frequency signal propagation, automated IoT sensor networks, and advanced VLSI silicon chips.',
    futureOpportunities: [
      'VLSI Chip design and manufacturing sector',
      'Embedded Software & Device Driver programing',
      'Telecom Wave infrastructure engineering'
    ],
    higherEducationOptions: [
      'M.Tech in VLSI System Design at Indian Institutes',
      'MS in Telecommunications / Signal Processing globally'
    ],
    careerOutcomes: [
      'Silicon Layout Engineer',
      'Embedded Firmware Developer',
      'Telecom Signals Officer',
      'Hardware Systems Architect'
    ],
    nodePosition: { x: 80, y: 30 },
    alumniInsights: []
  },
  {
    id: 'medicine_bds',
    level: '12th',
    category: 'Medical',
    name: 'Bachelor of Dental Surgery (BDS)',
    duration: '5 Years (including Internship)',
    eligibility: 'Finished 12th with BiPC & qualified NEET-UG with good score',
    subjects: ['Oral Histology & Pathology', 'Dental Material Sciences', 'Prosthodontics', 'Oral & Maxillofacial Surgery', 'Orthodontic Alignments', 'Pedodontia'],
    estimatedFees: '₹45,000 - ₹4,80,000 per year',
    description: 'The standard pathways for certified dental doctors. Focuses on oral cavity health, periodontal operations, facial bone alignments, dental crowns, root canals, and orthodontic devices.',
    futureOpportunities: [
      'Master of Dental Surgery (MDS) specialisation',
      'Establishing Independent Private Dental Clinics',
      'Public dental health officer designations'
    ],
    higherEducationOptions: [
      'NEET-MDS Specialization Exam',
      'Cosmetic Dentistry and Implantology Fellowscopes'
    ],
    careerOutcomes: [
      'Professional Dentist',
      'Maxillofacial Surgeon Specialist',
      'Dental Clinic Director',
      'Public Dental Researcher'
    ],
    nodePosition: { x: 85, y: 45 },
    alumniInsights: []
  },
  {
    id: 'b_pharmacy',
    level: '12th',
    category: 'Medical',
    name: 'Bachelor of Pharmacy (B.Pharm)',
    duration: '4 Years',
    eligibility: 'Passed 12th with BiPC or MPC subjects',
    subjects: ['Pharmaceutics & Dose Systems', 'Medicinal Chemistry', 'Pharmacology & Therapeutics', 'Pharmacognosy (Herbal drugs)', 'Pharmaceutical analysis'],
    estimatedFees: '₹30,500 - ₹1,20,000 per year',
    description: 'Studies chemical compounds, medicine formulas, clinical dosage levels, biological testing, and legal pharmaceutical laws. Prepares pharmacists to research, formulate, test, or distribute public drug lines.',
    futureOpportunities: [
      'Master of Pharmacy (M.Pharm) R&D specialization',
      'Drug Safety Officer in Govt boards',
      'Industrial Formulation Planning manager'
    ],
    higherEducationOptions: [
      'GPAT Entrance for NIPER Masters',
      'MBA in Pharmaceutical Management systems'
    ],
    careerOutcomes: [
      'Clinical Drug Scientist',
      'Assistant Drug Inspector',
      'Quality Control Analyst',
      'Clinical Trials Supervisor'
    ],
    nodePosition: { x: 80, y: 50 },
    alumniInsights: []
  },
  {
    id: 'bsc_agriculture',
    level: '12th',
    category: 'Medical',
    name: 'B.Sc Honours in Agriculture',
    duration: '4 Years',
    eligibility: 'Finished 12th with Science (BiPC / MPC)',
    subjects: ['Agronomy & Soil Chemistry', 'Crop Genetics & Breeding', 'Plant Pathology & Entomology', 'Agricultural Economics', 'Horticulture & Forestry', 'Extension Education'],
    estimatedFees: '₹15,000 - ₹80,000 per year',
    description: 'An expansive science program covering crop genetics, field soil chemical balances, food economics, eco-friendly pest control, and smart farming equipment. Combines laboratory research with extensive field work.',
    futureOpportunities: [
      'Agricultural Officer (AO) Recruitment Exams',
      'NABARD and commercial Bank Field officers',
      'M.Sc. research in Agronomy or Genetics'
    ],
    higherEducationOptions: [
      'ICAR AIEEA Entrance for premier university Masters',
      'MBA in Agri-Business Management'
    ],
    careerOutcomes: [
      'Agricultural Extension Officer',
      'Seed Development Expert',
      'Soil Quality Analyst',
      'Agri-Business Planner'
    ],
    nodePosition: { x: 70, y: 45 },
    alumniInsights: []
  },
  {
    id: 'bca_applications',
    level: '12th',
    category: 'Commerce',
    name: 'Bachelor of Computer Applications (BCA)',
    duration: '3 Years',
    eligibility: 'Finished 12th with any stream (Maths not compulsory in many institutes)',
    subjects: ['Web Designing', 'Java Programming', 'Database Operations', 'Python Scripting', 'Software Engineering Core', 'Digital Web Commerce'],
    estimatedFees: '₹25,000 - ₹1,10,000 per year',
    description: 'A 3-year professional bridge into software development. Covers programming languages, relational databases, web scripting, and IT systems administration. Highly functional and faster to complete than B.Tech.',
    futureOpportunities: [
      'Master of Computer Applications (MCA) for full engineering equivalency',
      'Direct developer hiring in mid/top tier services IT firms',
      'IT Database Support operations analyst'
    ],
    higherEducationOptions: [
      'NIMCET Exam for top NIT MCA admissions',
      'MS in Information Systems or Computing globally'
    ],
    careerOutcomes: [
      'Frontend / UI Web Developer',
      'Database Operations Associate',
      'Computer Network Administrator',
      'Software Testing Engineer'
    ],
    nodePosition: { x: 80, y: 70 },
    alumniInsights: []
  },
  {
    id: 'integrated_law',
    level: '12th',
    category: 'Specialized',
    name: 'Integrated BA LLB / BBA LLB (Law)',
    duration: '5 Years',
    eligibility: 'Finished 12th in any stream & Cleared CLAT/LSAT exam',
    subjects: ['Constitutional Law', 'Criminal Jurisprudence', 'Corporate Mergers & Acquisitions', 'Intellectual Property Rights', 'Family Law & Mediation', 'Moot Court Practice'],
    estimatedFees: '₹35,000 (Govt) - ₹2,50,050 per year',
    description: 'A double graduation program blending social sciences/business with comprehensive legal studies. Trains candidates in judiciary drafts, consumer litigation, constitutional interpretations, and corporate board representation.',
    futureOpportunities: [
      'Corporate Law Associate in global advisory firms',
      'State Judicial Services recruitment (Magistrate)',
      'Independent Litigator or Public Advocate'
    ],
    higherEducationOptions: [
      'Master of Laws (LLM) at premier judicial academic centers',
      'Civil Services and IPS training routes'
    ],
    careerOutcomes: [
      'Corporate Legal Advisor',
      'State Magistrate / Judge Officer',
      'Litigation Advocate',
      'IP & Copyright Specialist'
    ],
    nodePosition: { x: 60, y: 60 },
    alumniInsights: []
  },
  {
    id: 'nda_defence',
    level: '12th',
    category: 'Specialized',
    name: 'National Defence Academy (NDA)',
    duration: '3 Years Academic + 1 Year Specialization',
    eligibility: 'Unmarried Male/Female candidates completed 12th (MPC required for Navy/AirForce)',
    subjects: ['Military Strategy & History', 'Ballistics & Weapon Mechanics', 'Naval Systems navigation', 'Aerospace mechanics', 'Leadership Ethics & Physical Drills'],
    estimatedFees: 'Fully sponsored by Govt of India (with stipend)',
    description: 'The elite training pipeline for officers in the Indian Army, Navy, and Air Force. Emphasizes strict leadership, strategic ballistics, defense politics, survival skills, and physical coordination.',
    futureOpportunities: [
      'Officer designation in Army, Navy, or Air Force',
      'Special Operations commands',
      'Military strategic attaches'
    ],
    higherEducationOptions: [
      'Joint defence staff college programs',
      'Strategic warfare specialized diplomas'
    ],
    careerOutcomes: [
      'Lieutenant / Flying Officer / Sub-Lieutenant',
      'Strategic Planning Officer',
      'Defense intelligence Analyst'
    ],
    nodePosition: { x: 55, y: 45 },
    alumniInsights: []
  },
  {
    id: 'b_design',
    level: '12th',
    category: 'Specialized',
    name: 'Bachelor of Design (B.Des)',
    duration: '4 Years',
    eligibility: 'Passed 12th in any stream & Cleared UCEED / NID entrance',
    subjects: ['Visual Communication', 'User Experience (UX) Architecture', 'Fashion Illustration & Textiles', 'Industrial Product Modelling', '3D UI prototyping', 'Design Theory'],
    estimatedFees: '₹50,000 - ₹2,50,000 per year',
    description: 'Prepares creative students for product packaging, mobile app layouts, visual marketing campaigns, fashion clothing lines, and physical vehicle ergonomics. Focuses heavily on user empathy, composition, and layout.',
    futureOpportunities: [
      'UX Designer in top tech teams',
      'Fashion Brand consultant',
      'Industrial packaging strategist'
    ],
    higherEducationOptions: [
      'M.Des (Master of Design)',
      'Human-Computer Interaction MS'
    ],
    careerOutcomes: [
      'UI/UX Architect',
      'Lead Fashion Designer',
      'Automotive Ergonomics Planner',
      'Creative Director'
    ],
    nodePosition: { x: 55, y: 70 },
    alumniInsights: []
  },
  {
    id: 'bfa_fine_arts',
    level: '12th',
    category: 'Specialized',
    name: 'Bachelor of Fine Arts (BFA)',
    duration: '4 Years',
    eligibility: 'Passed 12th in any stream & cleared university drawing portfolio round',
    subjects: ['Classical Painting & Composition', 'Creative Sculpting & Moulding', 'Graphic arts & Printmaking', 'Visual History & Aesthetics', 'Digital Illustration', 'Exhibition Curating'],
    estimatedFees: '₹10,500 - ₹50,000 per year',
    description: 'An immersive fine-arts experience. Highlights classical oil compositions, heavy-metal sculpting, manual screen printing, modern graphic communication, and digital vector illustration. Teaches the conceptualization of deep visual stories.',
    futureOpportunities: [
      'Fine Arts Studio Curator',
      'Digital Comic and Concept Artist',
      'Video Game Asset Illustrator'
    ],
    higherEducationOptions: [
      'MFA (Master of Fine Arts)',
      'Art Curation Fellowships'
    ],
    careerOutcomes: [
      'Concept Illustrator',
      'Classical Painter',
      'Art Curator',
      'Digital Storyboard Artist'
    ],
    nodePosition: { x: 50, y: 80 },
    alumniInsights: []
  },
  {
    id: 'b_com_hons',
    level: '12th',
    category: 'Commerce',
    name: 'Bachelor of Commerce (B.Com Hons)',
    duration: '3 Years',
    eligibility: 'Completed 12th with Commerce/Science (MEC/CEC/MPC)',
    subjects: ['Corporate Accounting & Audit', 'Business Mathematics', 'Micro & Macro Economics', 'Corporate Laws', 'Banking & Insurance', 'Financial Portfolio Analysis'],
    estimatedFees: '₹15,000 - ₹85,000 per year',
    description: 'The standard commercial qualification. Covers ledger balancing, banking rules, market supply-demand economics, stock market portfolio structures, and commercial laws. Suitable for students aiming for finance operations.',
    futureOpportunities: [
      'M.Com graduation',
      'Corporate Financial Analysts',
      'Government Bank recruitment'
    ],
    higherEducationOptions: [
      'CAT for Business School MBA',
      'ICAI Chartered Accountancy (CA) direct entry'
    ],
    careerOutcomes: [
      'Credit Analyst',
      'Investment Portfolio Associate',
      'Internal Corporate Auditor',
      'Commercial Officer'
    ],
    nodePosition: { x: 75, y: 75 },
    alumniInsights: []
  },
  {
    id: 'merchant_navy',
    level: '12th',
    category: 'Specialized',
    name: 'B.Sc Nautical Science (Merchant Navy)',
    duration: '3 Years Academic + 1 Year Sea Internship',
    eligibility: 'Passed 12th MPC with minimum 60% and cleared IMU-CET exam & strict eye/medical standards',
    subjects: ['Ship Navigation & Chartwork', 'Marine Zoology & Oceanography', 'Ship cargo stability', 'Navigational electronics (radar, GPS)', 'Maritime Law & Sea Safety'],
    estimatedFees: '₹1,50,000 - ₹3,50,000 per year',
    description: 'A physically adventurous pathways. Nautical science teaches ocean coordinates, heavy cargo balancing, marine radio logs, international sea border rules, and ship operations management across global travel maps.',
    futureOpportunities: [
      'Deck cadet designations',
      'Ocean cargo operations planner',
      'Port scheduler'
    ],
    higherEducationOptions: [
      'Captain Certification exams globally',
      'Marine Administration MBA'
    ],
    careerOutcomes: [
      'Deck Officer (third mate)',
      'Marine Cargo Supervisor',
      'Harbour Pilot / Coordinator',
      'Ship Superintendent'
    ],
    nodePosition: { x: 70, y: 30 },
    alumniInsights: []
  },
  {
    id: 'bsc_nursing',
    level: '12th',
    category: 'Medical',
    name: 'B.Sc Nursing',
    duration: '4 Years',
    eligibility: 'Completed 12th with BiPC (Biology, Physics, Chemistry)',
    subjects: ['Anatomy & Physiology', 'Nutrition & Dietetics', 'Medical-Surgical Nursing', 'Community Health Nursing', 'Child Health & Pediatrics', 'Obstetrical Nursing'],
    estimatedFees: '₹20,500 - ₹1,10,000 per year',
    description: 'Prepares professional nurses to deliver hospital ward care, assist surgical suites, monitor ICU patient recovery, run emergency trauma logistics, and participate in global public health programs.',
    futureOpportunities: [
      'M.Sc Nursing Specialization',
      'Global hospital networks (UK/US licensure)',
      'Nursing Superintendent'
    ],
    higherEducationOptions: [
      'M.Sc Nursing programs',
      'Global NCLEX-RN exam for USA clinical practice'
    ],
    careerOutcomes: [
      'Clinical Nurse Specialist',
      'Critical Care Practitioner',
      'Nurse Tutor/Educator',
      'Health Advisor'
    ],
    nodePosition: { x: 65, y: 50 },
    alumniInsights: []
  }
];

export const GENERAL_STATISTICS = {
  activeStudents: '14,200+',
  verifiedAlumni: '12 MENTORS',
  academicJourneys: '110+ GROUPS',
  mentorshipMessages: '24,500+',
  satisfactionRate: '99.1%'
};
