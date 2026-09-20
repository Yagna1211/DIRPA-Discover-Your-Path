import { 
  SpecializationCourse, 
  DEGREE_SPECIALIZATION_MAP 
} from './specializations';

export interface StreamCategory {
  id: string;
  name: string;
  code: string;
  icon: string;
  tagline: string;
  description: string;
  eligibilityBadge: string;
  keyDegrees: string[];
  entranceExams: string[];
  typicalDuration: string;
  courses: SpecializationCourse[];
}

// -------------------------------------------------------------
// MPC STREAMS & COURSES
// -------------------------------------------------------------

const BTECH_SPECS = DEGREE_SPECIALIZATION_MAP["B.Tech/B.E (All Engineering Branches)"] || [];
const CSE_COURSE = BTECH_SPECS.find(c => c.id === 'btech_cse') || BTECH_SPECS[0];
const ECE_COURSE = BTECH_SPECS.find(c => c.id === 'btech_ece') || BTECH_SPECS[1];
const EEE_COURSE = BTECH_SPECS.find(c => c.id === 'btech_eee') || BTECH_SPECS[2];
const MECH_COURSE = BTECH_SPECS.find(c => c.id === 'btech_mech') || BTECH_SPECS[3];

export const CIVIL_COURSE: SpecializationCourse = {
  id: "btech_civil",
  name: "Civil Engineering & Smart Infrastructure (Civil)",
  code: "CIVIL",
  description: "Structural engineering design, smart city transportation networks, concrete technology, geotechnical foundation analysis, seismic resistance, and BIM 3D infrastructure modeling.",
  duration: "4 Years",
  difficulty: "Medium",
  keyFocusAreas: ["Structural Analysis & RCC Design", "Surveying & Geomatics (Total Station/GIS)", "Building Information Modeling (BIM/Revit)", "Environmental & Water Resource Systems"],
  feedback: [],
  jobs: [
    {
      id: "job_structural_engineer",
      title: "Structural & Infrastructure Design Engineer",
      description: "Analyze structural loads, calculate wind & seismic forces, model reinforced concrete frames on ETABS/STAAD.Pro, and certify building safety for urban transit & metro networks.",
      salaryRange: "₹6,00,000 - ₹18,00,000 per annum",
      entryLevelSalary: "₹4,20,000 - ₹6,50,000 per annum",
      seniorLevelSalary: "₹14,00,000 - ₹30,00,000 per annum",
      skillsRequired: ["AutoCAD & Civil 3D", "ETABS / STAAD.Pro", "RCC & Steel Design Codes (IS 456/IS 800)", "Project Cost Estimation (BOQ)", "BIM Coordination"],
      dayInLife: [
        "08:30 AM - Site Inspection: Inspect foundation reinforcement cages before concrete pouring on metro pier works.",
        "11:00 AM - Design Analysis: Run 3D finite-element wind load calculations in ETABS for a 30-story commercial tower.",
        "02:00 PM - Client Coordination: Meet with municipal architects to align structural columns with basement parking grids.",
        "04:00 PM - Material Quality Audit: Verify compressive strength test cube results from third-party certified testing labs.",
        "05:30 PM - BIM Clash Detection: Audit Revit MEP overlays to ensure HVAC ducts do not pierce primary load-bearing beams."
      ],
      pros: [
        "Create tangible, monumental physical landmarks that last for centuries",
        "Continuous national demand in public works, highway expansions, and green smart cities",
        "Vast government career opportunities (IES, CPWD, NHAI, Metro Rail Corporations)"
      ],
      cons: [
        "Frequent exposure to harsh on-site environmental conditions and dust",
        "High legal accountability for life-safety structural integrity",
        "Project delivery cycles depend heavily on contractor and material schedules"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
          caption: "Civil engineers analyzing structural blue-prints on active metro viaduct works.",
          tasksIllustrated: ["Reviewing structural layout sheets", "Conducting laser leveling audits", "Checking rebar placement"]
        }
      ],
      videos: [
        {
          title: "Megastructures: How Civil Engineers Build Metro Systems",
          description: "Follow structural project leads building underground tunnels, elevated viaducts, and earthquake-resistant foundations across urban centers.",
          duration: "12:15 mins",
          channel: "Mega Engineering Documentaries",
          thumbnailUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Operating laser theodolite surveying systems",
            "Analyzing stress-strain graphs on computer simulations",
            "Inspecting pre-cast bridge segment launch gantries"
          ]
        }
      ]
    }
  ]
};

export const AIML_COURSE: SpecializationCourse = {
  id: "btech_aiml",
  name: "Artificial Intelligence & Data Engineering (AI/ML)",
  code: "AI & ML",
  description: "Deep learning neural architectures, natural language processing (LLMs), computer vision models, scalable big data pipelines, distributed GPU training, and MLOps deployment.",
  duration: "4 Years",
  difficulty: "Intense",
  keyFocusAreas: ["Deep Neural Networks & Transformers", "Computer Vision & Autonomous Systems", "Big Data Streaming (Kafka/Spark)", "Cloud MLOps & Vector Databases"],
  feedback: [],
  jobs: [
    {
      id: "job_ai_architect",
      title: "Lead AI Systems & Machine Learning Engineer",
      description: "Build custom generative AI models, optimize latency on GPU clusters, fine-tune transformer foundations, and design autonomous reasoning pipelines for enterprise software.",
      salaryRange: "₹12,00,000 - ₹35,00,000 per annum",
      entryLevelSalary: "₹7,50,000 - ₹12,00,000 per annum",
      seniorLevelSalary: "₹25,00,000 - ₹60,00,000+ per annum",
      skillsRequired: ["PyTorch / JAX", "Transformers & HuggingFace", "Distributed Training (DeepSpeed)", "Vector Search & Embeddings", "FastAPI & Triton Inference"],
      dayInLife: [
        "09:30 AM - Research Brief: Review latest research preprint papers on attention mechanism speedups.",
        "10:45 AM - Model Training: Monitor multi-GPU loss divergence on cloud cluster nodes.",
        "02:00 PM - Evaluation Run: Evaluate benchmark perplexity and hallucinations on test validation datasets.",
        "03:45 PM - Inference Quantization: Quantize float32 model weights down to 4-bit INT4 for edge mobile deployment.",
        "05:15 PM - Product Sync: Demo interactive automated visual document extraction to engineering leadership."
      ],
      pros: [
        "Highest global compensation packages in modern tech sectors",
        "Massive intellectual autonomy solving bleeding-edge frontier puzzles",
        "Widespread remote work flexibility across international frontier labs"
      ],
      cons: [
        "Extreme competition requiring continuous self-learning every few months",
        "High compute resource bottlenecks and GPU cluster costs",
        "Frequent experimental dead-ends where trained models fail to converge"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80",
          caption: "AI engineer evaluating tensor graphs and training loss on high-performance dual-display workstations.",
          tasksIllustrated: ["Analyzing neural attention maps", "Monitoring GPU cluster telemetry", "Debugging embedding clusters"]
        }
      ],
      videos: [
        {
          title: "Inside Modern Generative AI Laboratories",
          description: "See how machine learning engineers build conversational agents, train vision encoders, and run high-throughput API endpoints.",
          duration: "10:30 mins",
          channel: "AI Frontier Agency",
          thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Visualizing latent space vectors in 3D plots",
            "Running benchmark tests on reasoning prompts",
            "Deploying Docker containers to cloud servers"
          ]
        }
      ]
    }
  ]
};

// Architecture courses
export const BARCH_COURSE: SpecializationCourse = {
  id: "arch_barch",
  name: "Bachelor of Architecture (B.Arch)",
  code: "B.Arch",
  description: "Spatial design, environmental climatology, structural aesthetics, vernacular sustainable construction, architectural acoustics, building bylaws, and professional studio drafting.",
  duration: "5 Years",
  difficulty: "Hard",
  keyFocusAreas: ["Architectural Design Studio", "Climatic & Sustainable Design", "Parametric Modeling (Rhino/Grasshopper)", "Building Construction & Material Science"],
  feedback: [],
  jobs: [
    {
      id: "job_licensed_architect",
      title: "Licensed Principal Architect",
      description: "Conceive iconic spatial layouts, draft municipal approval drawings, blend aesthetic beauty with structural physics, and supervise building construction from foundation to finishing.",
      salaryRange: "₹6,50,000 - ₹22,00,000 per annum",
      entryLevelSalary: "₹4,00,000 - ₹7,00,000 per annum",
      seniorLevelSalary: "₹15,00,000 - ₹40,00,000+ per annum",
      skillsRequired: ["AutoCAD / Revit Architecture", "Rhino 3D & Grasshopper", "Physical Scale Model Making", "Climatic Sun-Path Analysis", "Council of Architecture (COA) Compliance"],
      dayInLife: [
        "09:00 AM - Design Studio: Hand-sketch facade shading louvers to optimize passive natural cooling.",
        "11:30 AM - 3D Render Review: Walkthrough virtual Lumion photorealistic renders with residential villa clients.",
        "02:00 PM - Structural Sync: Review column layout coordinates with civil structural engineers.",
        "03:45 PM - Material Selection: Choose natural local stones, terracotta tiles, and low-VOC timber finishes.",
        "05:15 PM - Site Inspection: Inspect skylight waterproofing and daylight penetration on site."
      ],
      pros: [
        "Fulfill artistic creativity while creating living spaces inhabited by generations",
        "High autonomy with ability to launch an independent architecture firm",
        "Respected profession regulated by statutory national boards (COA)"
      ],
      cons: [
        "Intense 5-year academic studio grind with frequent late-night submission crunches",
        "Initial junior designer starting pay can be conservative in private studios",
        "Requires balancing demanding client whims with municipal zoning constraints"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
          caption: "Architect detailing physical scale models and structural blueprints in a creative design studio.",
          tasksIllustrated: ["Drafting floor plans on CAD", "Building balsa wood physical models", "Reviewing solar daylight simulations"]
        }
      ],
      videos: [
        {
          title: "Day in the Life of a Contemporary Indian Architect",
          description: "Experience the creative studio routine: hand sketching, 3D modeling, material sampling, and client walkthroughs.",
          duration: "9:45 mins",
          channel: "Architecture & Design Hub",
          thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating parametric facade generation on software",
            "Presenting mood boards to real estate developers",
            "Inspecting formwork finishes on construction sites"
          ]
        }
      ]
    }
  ]
};

export const BPLAN_COURSE: SpecializationCourse = {
  id: "arch_bplan",
  name: "Bachelor of Planning (B.Plan)",
  code: "B.Plan",
  description: "Urban development policy, GIS geospatial mapping, smart city transportation networks, land-use zoning, housing economics, and environmental impact assessments.",
  duration: "4 Years",
  difficulty: "Medium",
  keyFocusAreas: ["Urban & Regional Spatial Planning", "GIS & Remote Sensing (ArcGIS/QGIS)", "Transit-Oriented Development (TOD)", "Public Infrastructure Finance"],
  feedback: [],
  jobs: [
    {
      id: "job_urban_planner",
      title: "Urban & Regional City Planner",
      description: "Design master plans for expanding metropolitan regions, route public bus rapid transit (BRT) lines, and evaluate sustainable land-use zoning for government urban bodies.",
      salaryRange: "₹6,00,000 - ₹16,00,000 per annum",
      entryLevelSalary: "₹4,20,000 - ₹6,50,000 per annum",
      seniorLevelSalary: "₹12,00,000 - ₹28,00,000 per annum",
      skillsRequired: ["ArcGIS / QGIS Spatial Analytics", "Urban Demographic Forecasting", "Master Plan Drafting", "Transit Network Simulation", "Environmental Regulations"],
      dayInLife: [
        "09:15 AM - Geospatial Query: Map population density changes across suburban transit corridors using QGIS.",
        "11:00 AM - Public Stakeholder Sync: Attend town hall consultation regarding proposed ring road green belts.",
        "02:00 PM - Policy Drafting: Prepare guidelines for electric bus charging terminal locations.",
        "04:00 PM - Satellite Data Analysis: Process drone topographic scans to assess monsoon storm flood risk zones.",
        "05:15 PM - Cabinet Presentation: Finalize slide deck for metropolitan development authority commissioners."
      ],
      pros: [
        "Directly shape how millions live, commute, and breathe across major cities",
        "Strong government and international NGO opportunities (Smart Cities Mission, World Bank, UN-Habitat)",
        "Combines sociology, technology, economics, and environmental sustainability"
      ],
      cons: [
        "Slow bureaucratic turnaround for master plan approvals",
        "Complex political and real-estate lobbying dynamics",
        "Requires deep patience as city master plans take 10-20 years to fully materialize"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80",
          caption: "Urban planners analyzing regional GIS transport maps and satellite land cover records.",
          tasksIllustrated: ["Analyzing transit density maps", "Evaluating demographic growth models", "Drafting municipal zoning plans"]
        }
      ],
      videos: [
        {
          title: "How Urban Planners Design Future Smart Cities",
          description: "See how modern city planners use big data, satellite GIS, and traffic flow sensors to design liveable communities.",
          duration: "11:20 mins",
          channel: "City Planning Review",
          thumbnailUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating transit GIS layer maps",
            "Simulating peak traffic hour congestion",
            "Explaining green space buffer ratios"
          ]
        }
      ]
    }
  ]
};

// Pure Science & Research courses
export const BSMS_COURSE: SpecializationCourse = {
  id: "sci_bsms",
  name: "BS-MS Dual Degree in Natural Sciences (IISER / NISER / IITs)",
  code: "BS-MS",
  description: "Rigorous integrated scientific research program across fundamental Physics, Mathematics, Chemical Sciences, and Computational Biology with full laboratory immersive fellowships.",
  duration: "5 Years",
  difficulty: "Intense",
  keyFocusAreas: ["Quantum Mechanics & Electrodynamics", "Abstract Algebra & Complex Analysis", "Theoretical & Experimental Chemistry", "Computational Data Modeling"],
  feedback: [],
  jobs: [
    {
      id: "job_research_scientist",
      title: "Scientific Research Officer / Quantum Researcher",
      description: "Conduct cutting-edge experimental and theoretical research, operate synchrotron beamlines, write research papers for Nature/Science, and pioneer technological patents.",
      salaryRange: "₹8,00,000 - ₹24,00,000 per annum",
      entryLevelSalary: "₹5,50,000 - ₹9,00,000 per annum",
      seniorLevelSalary: "₹18,00,000 - ₹45,00,000 per annum",
      skillsRequired: ["Python / Mathematica / MATLAB", "Cryogenic Lab Instrument Operations", "Statistical Mechanics & Quantum Modeling", "Scientific Paper Writing & Peer Review", "Patent Drafting"],
      dayInLife: [
        "09:00 AM - Cryogenic Lab: Check liquid nitrogen levels on superconducting quantum magnet coils.",
        "11:00 AM - Mathematical Modeling: Solve non-linear differential equations using Python SciPy libraries.",
        "02:00 PM - Spectroscopy Run: Fire laser pulses onto nanostructured semiconductor thin films to record decay spectra.",
        "04:00 PM - Research Collab: Video conference with international research groups in Munich and Geneva.",
        "05:30 PM - Grant Proposal: Draft proposal section for national scientific research funding grants."
      ],
      pros: [
        "Push the boundaries of human scientific knowledge and invent new paradigms",
        "Direct track to prestigious fully funded PhD fellowships in MIT, Stanford, Max Planck, or Cambridge",
        "Access to advanced national laboratories (ISRO, DRDO, TIFR, BARC)"
      ],
      cons: [
        "Lengthy career runway requiring PhD and PostDoc for senior scientific roles",
        "Academic funding cycles can involve bureaucratic delays",
        "Requires deep intellectual patience when hypotheses require months to prove"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
          caption: "Scientists conducting laser optics experiments on precision pneumatic isolation tables.",
          tasksIllustrated: ["Aligning precision beam splitters", "Recording oscilloscope signal waveforms", "Writing statistical physics models"]
        }
      ],
      videos: [
        {
          title: "Inside IISER & NISER Research Laboratories",
          description: "Tour world-class Indian research institutes where undergraduate students work alongside senior scientists on quantum materials.",
          duration: "13:00 mins",
          channel: "Science Frontier India",
          thumbnailUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating cleanroom particle filters",
            "Running high-vacuum chamber pumps",
            "Analyzing diffraction crystallographic patterns"
          ]
        }
      ]
    }
  ]
};

export const BSC_MATH_COMPUTING: SpecializationCourse = {
  id: "sci_math_comp",
  name: "B.Sc (Hons) Mathematics & Computing",
  code: "Math & Comp",
  description: "Blends pure mathematical theory with computational algorithms, modern cryptography, stochastic calculus, linear algebra for machine learning, and algorithmic trading models.",
  duration: "3-4 Years",
  difficulty: "Intense",
  keyFocusAreas: ["Algorithmic Number Theory & Cryptography", "Linear Algebra & Tensor Analysis", "Stochastic Calculus & Financial Math", "High-Performance C++ Computing"],
  feedback: [],
  jobs: [
    {
      id: "job_quant_analyst",
      title: "Quantitative Trading & Risk Analyst",
      description: "Develop mathematical algorithms that analyze market microstructures, price complex derivative contracts, and execute automated high-frequency trading strategies.",
      salaryRange: "₹14,00,000 - ₹45,00,000 per annum",
      entryLevelSalary: "₹9,00,000 - ₹16,00,000 per annum",
      seniorLevelSalary: "₹30,00,000 - ₹90,00,000+ per annum",
      skillsRequired: ["Advanced C++ & Python", "Stochastic Differential Equations", "Monte Carlo Simulations", "Time-Series Econometrics", "Statistical Arbitrage Models"],
      dayInLife: [
        "08:30 AM - Market Open Brief: Review global overnight currency index shifts and volatility spikes.",
        "10:00 AM - Model Backtesting: Backtest mean-reversion algorithmic strategies on tick-by-tick orderbook data.",
        "01:30 PM - Code Optimization: Optimize order routing logic down to microsecond execution latencies in C++.",
        "03:30 PM - Risk Assessment: Calculate Value-at-Risk (VaR) exposures across open derivative positions.",
        "05:00 PM - Research Debrief: Meet with algorithmic portfolio managers to discuss alpha decay metrics."
      ],
      pros: [
        "Among the absolute highest compensation packages across all undergraduate degrees",
        "Pure meritocratic evaluation based on quantitative model performance",
        "Extremely transferable mathematical skills across hedge funds, tech firms, and fintech"
      ],
      cons: [
        "High-stakes, high-pressure environment during turbulent financial market days",
        "Intense continuous mental fatigue solving complex probability theorems",
        "Steep initial learning curve requiring mastery of both abstract math and low-level code"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
          caption: "Quantitative analyst evaluating algorithmic volatility curves and statistical arbitrage indicators.",
          tasksIllustrated: ["Analyzing high-frequency tick data", "Writing low-latency C++ algorithms", "Testing Monte Carlo risk simulations"]
        }
      ],
      videos: [
        {
          title: "What Do Quantitative Traders & Mathematicians Do?",
          description: "See how quantitative analysts use stochastic calculus, probability theory, and programming to solve high-frequency market equations.",
          duration: "10:15 mins",
          channel: "Quant Finance Academy",
          thumbnailUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating orderbook depth visualizers",
            "Explaining volatility smile models",
            "Running Monte Carlo probability graphs"
          ]
        }
      ]
    }
  ]
};

// Defense & Maritime Forces
export const NDA_COURSE: SpecializationCourse = {
  id: "def_nda",
  name: "National Defence Academy (NDA - Army, Navy, Air Force)",
  code: "NDA",
  description: "Premier tri-services military training academy combining an accredited university degree (B.Sc/B.Tech) with intense military tactical leadership, weapon training, aviation, and drills.",
  duration: "3-4 Years",
  difficulty: "Intense",
  keyFocusAreas: ["Military Tactics & Weapon Systems", "Strategic Geopolitics & Military History", "Physical Combat & Endurance Training", "Aviation & Navigational Sciences"],
  feedback: [],
  jobs: [
    {
      id: "job_commissioned_officer",
      title: "Commissioned Military Officer (Lieutenant / Sub-Lieutenant / Flying Officer)",
      description: "Lead troops in frontline operational theaters, command armored infantry platoons, pilot combat fighter aircraft, or command warship navigation bridges for the Indian Armed Forces.",
      salaryRange: "₹11,00,000 - ₹26,00,000 per annum + Defense Allowances",
      entryLevelSalary: "₹8,50,000 - ₹12,00,000 per annum",
      seniorLevelSalary: "₹20,00,000 - ₹38,00,000 per annum",
      skillsRequired: ["Officer Like Qualities (OLQ)", "Tactical Leadership Under High Stress", "Combat Navigation & Map Reading", "Physical Stamina & Combat Fitness", "Strategic Operational Planning"],
      dayInLife: [
        "05:30 AM - Morning Muster: Physical training endurance run followed by tactical parade ground inspection.",
        "08:30 AM - Operational Briefing: Review perimeter defense radar reports and surveillance drone sweeps.",
        "11:00 AM - Troop Training: Conduct firing range drills and verify heavy weaponry maintenance status.",
        "02:00 PM - Logistics & Administration: Audit ammunition inventories, ration stores, and personnel welfare files.",
        "06:30 PM - Tactical Sand-Model Exercise: Conduct simulated combat counter-insurgency tabletop maneuvers with team leads."
      ],
      pros: [
        "Unmatched honor, societal prestige, and direct service defending the sovereign nation",
        "Comprehensive lifelong medical care (ECHS), government accommodations, and pension benefits",
        "World-class physical fitness, adventure sports (mountaineering, scuba, skydiving), and leadership mastery"
      ],
      cons: [
        "Direct physical danger and risk to life during armed combat and counter-terror deployments",
        "Frequent postings to extreme, remote geographical terrains (high altitude snow, deserts, deep sea)",
        "Extended periods of separation from immediate family and civilian comforts"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
          caption: "Military officers planning tactical logistics and frontline troop positioning on regional topographic maps.",
          tasksIllustrated: ["Analyzing topographic contour maps", "Inspecting squad combat gear", "Coordinating communications protocols"]
        }
      ],
      videos: [
        {
          title: "Life Inside the National Defence Academy (Khadakwasla)",
          description: "Experience the rigorous training regimen of NDA cadets: horse riding, assault courses, high-altitude drills, and graduation parades.",
          duration: "15:30 mins",
          channel: "Indian Armed Forces Official",
          thumbnailUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Cadets completing grueling obstacle assault courses",
            "Classroom sessions on international military treaties",
            "Ceremonial passing out parade at the Khetarpal Ground"
          ]
        }
      ]
    }
  ]
};

export const MERCHANT_NAVY_COURSE: SpecializationCourse = {
  id: "def_merchant_navy",
  name: "Merchant Navy (B.Sc Nautical Science / Marine Engineering)",
  code: "Merchant Navy",
  description: "Commercial ocean shipping, cargo tanker operations, deep-sea global navigation, marine radar systems, celestial navigation, and international maritime safety laws (STCW/DG Shipping).",
  duration: "3-4 Years",
  difficulty: "Hard",
  keyFocusAreas: ["Deep Sea Navigation & Radar (ARPA/ECDIS)", "Ship Stability & Cargo Tanker Management", "Marine Diesel Propulsion Turbines", "Maritime Safety (SOLAS/MARPOL)"],
  feedback: [],
  jobs: [
    {
      id: "job_deck_officer",
      title: "Navigational Deck Officer / Chief Marine Engineer",
      description: "Navigate ocean container mega-vessels across international shipping lanes, pilot ships through tight straits, manage ballast operations, and oversee massive cargo loading.",
      salaryRange: "₹12,00,000 - ₹38,00,000 per annum (Tax-Free NRI Status at Sea)",
      entryLevelSalary: "₹6,00,000 - ₹12,00,000 per annum",
      seniorLevelSalary: "₹24,00,000 - ₹60,00,000+ per annum",
      skillsRequired: ["ECDIS & Radar Navigation", "Celestial Fix Computations", "Ship Stability Calculations", "Bridge Team Management", "Emergency Sea Survival Protocols"],
      dayInLife: [
        "04:00 AM - Bridge Watch: Maintain 4-hour navigation lookout, monitoring radar targets and steering heading through the Singapore Strait.",
        "09:00 AM - Cargo Deck Operations: Inspect lashings on 15,000 shipping containers, checking refrigerated unit temperatures.",
        "01:00 PM - Fire & Boat Drill: Lead crew emergency fire response and lifeboat launching simulation drill.",
        "04:00 PM - Ballast Water Calculations: Calculate trim and stability parameters on the loading computer for port arrival.",
        "08:00 PM - Evening Navigation Watch: Track celestial stars with a sextant to cross-verify electronic GPS positions."
      ],
      pros: [
        "Exceptional tax-free international currency compensation early in life (NRI status)",
        "Travel the world touching dozens of international global ports annually",
        "Generous vacation time (often 3-4 months of continuous uninterrupted paid leave between voyages)"
      ],
      cons: [
        "Prolonged isolation at sea for 4 to 6 months at a stretch with limited cellular internet",
        "Extreme ocean weather including typhoons, heavy rolling swells, and gale winds",
        "Strict maritime safety regulations with heavy personal accountability"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
          caption: "Navigational officer monitoring radar targets and digital charts on a modern container ship bridge.",
          tasksIllustrated: ["Plotting navigational courses on ECDIS", "Operating radar target tracking systems", "Monitoring ocean swell forecasts"]
        }
      ],
      videos: [
        {
          title: "Life at Sea: Day on an Ultra-Large Container Ship",
          description: "Follow a third officer navigating through international shipping lanes, managing cargo stability, and docking with tug assistance.",
          duration: "11:45 mins",
          channel: "Maritime World Explorer",
          thumbnailUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating bridge engine telegraph controls",
            "Showing engine room turbine maintenance checks",
            "Mooring operations at automated container terminals"
          ]
        }
      ]
    }
  ]
};

// Aviation & Pilot Training
export const CPL_COURSE: SpecializationCourse = {
  id: "av_cpl",
  name: "Commercial Pilot Training (CPL with Multi-Engine & Instrument Rating)",
  code: "CPL Pilot",
  description: "DGCA-accredited flying cadet training covering flight aerodynamics, instrument navigation, meteorology, air regulations, and 200+ hours of logged solo & multi-engine flight time.",
  duration: "18-24 Months",
  difficulty: "Intense",
  keyFocusAreas: ["Aviation Meteorology & Weather Radar", "Air Navigation & Radio Aids (VOR/ILS)", "Multi-Engine Aircraft Aerodynamics", "Cockpit Resource Management (CRM)"],
  feedback: [],
  jobs: [
    {
      id: "job_airline_pilot",
      title: "Commercial Airline First Officer / Pilot",
      description: "Operate modern twin-engine commercial jet aircraft (Airbus A320 / Boeing 737), execute high-precision instrument landings in dense fog, and transport passengers safely across domestic and global routes.",
      salaryRange: "₹18,00,000 - ₹48,00,000 per annum",
      entryLevelSalary: "₹14,00,000 - ₹22,00,000 per annum",
      seniorLevelSalary: "₹36,00,000 - ₹80,00,000+ per annum (Captain)",
      skillsRequired: ["Multi-Engine Flight Proficiency", "Instrument Flight Rules (IFR)", "Cockpit Cross-Check Discipline", "Emergency Recovery Procedures", "DGCA Class 1 Medical Fitness"],
      dayInLife: [
        "05:30 AM - Flight Dispatch Briefing: Review meteorological NOTAMs, jet stream headwinds, and alternate diversion airports.",
        "06:30 AM - Pre-Flight Walkaround: Inspect jet turbines, pitot static tubes, landing gear hydraulic struts, and control surfaces.",
        "07:30 AM - Takeoff & Climb: Execute coordinated takeoff roll, configure autopilot climb profile to cruising altitude Flight Level 360.",
        "10:00 AM - Instrument Approach: Intercept Instrument Landing System (ILS) localizer and glide path in rainy monsoon weather.",
        "11:30 AM - Post-Flight Log: Sign technical aircraft maintenance logs and file journey report with airline operations."
      ],
      pros: [
        "One of the most glamorous, high-earning, and exciting careers in the world",
        "Every single work day provides panoramic views of sunrises from 38,000 feet",
        "High international demand as Indian domestic and global airline fleets expand rapidly"
      ],
      cons: [
        "High initial investment cost for flying school training and aircraft type ratings (₹40L - ₹75L)",
        "Irregular shift hours, early morning call-outs, and circadian jetlag fatigue",
        "Mandatory strict annual Class 1 medical evaluations and rigorous simulator check-rides"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
          caption: "Airline pilots conducting pre-flight cockpit safety checklists on modern digital glass cockpits.",
          tasksIllustrated: ["Programming the Flight Management System (FMS)", "Cross-checking altimeter settings", "Communicating with Air Traffic Control"]
        }
      ],
      videos: [
        {
          title: "From Flying School to Commercial Airline Cockpit",
          description: "See the exact path from single-engine Cessna flight training to piloting an Airbus A320 commercial jet for a major airline.",
          duration: "12:50 mins",
          channel: "Aviation Life Chronicles",
          thumbnailUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating glass cockpit primary flight displays",
            "Practicing crosswind landings in full-motion simulators",
            "Explaining engine failure emergency procedures"
          ]
        }
      ]
    }
  ]
};

export const AME_COURSE: SpecializationCourse = {
  id: "av_ame",
  name: "Aircraft Maintenance Engineering (AME)",
  code: "AME",
  description: "DGCA-certified technical maintenance of commercial aircraft: jet turbine overhauls, avionics radar circuits, hydraulic landing systems, and aircraft airworthiness safety certification.",
  duration: "3 Years",
  difficulty: "Hard",
  keyFocusAreas: ["Jet Turbine Engine Overhaul", "Avionics & Flight Control Electronics", "Aircraft Composite Material Structures", "DGCA CAR 66 Regulatory Framework"],
  feedback: [],
  jobs: [
    {
      id: "job_ame_engineer",
      title: "DGCA Certified Aircraft Maintenance Engineer (B1/B2)",
      description: "Inspect commercial aircraft during overnight maintenance halts, troubleshoot turbine anomalies, replace avionics modules, and sign statutory Certificates of Release to Service (CRS).",
      salaryRange: "₹6,50,000 - ₹22,00,000 per annum",
      entryLevelSalary: "₹3,80,000 - ₹6,50,000 per annum",
      seniorLevelSalary: "₹15,00,000 - ₹35,00,000 per annum",
      skillsRequired: ["DGCA Module Exams (CAR 66)", "Jet Engine Boroscopic Inspection", "Avionics Bus Diagnostics", "Structural NDT Testing", "Aviation Safety Protocol Compliance"],
      dayInLife: [
        "08:00 PM - Night Shift Handover: Review incoming pilot defect logs on an A320 aircraft arriving at the hangar.",
        "10:30 PM - Boroscope Inspection: Insert flexible fiber-optic camera into turbine combustion chambers to check for thermal cracks.",
        "01:30 AM - Avionics Fault Troubleshooting: Diagnostic test weather radar transceivers using automated flight test rigs.",
        "03:30 AM - Hydraulic Line Servicing: Flush and bleed main landing gear hydraulic brake actuators.",
        "05:30 AM - CRS Sign-Off: Certify that the aircraft meets all airworthiness directives and release it for morning passenger flights."
      ],
      pros: [
        "Direct hands-on engineering on the most complex machines built by humanity",
        "Critical legal authority: no aircraft in the world can fly without an AME signature",
        "Global career mobility with international maintenance, repair, and overhaul (MRO) facilities"
      ],
      cons: [
        "Heavy night shifts in aircraft hangars and on airport aprons under tight flight turnaround clocks",
        "Severe legal and criminal liability for aviation safety compliance",
        "Requires passing rigorous multiple DGCA licensing module exams"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          caption: "Aircraft maintenance engineers performing boroscopic camera inspection inside a high-bypass turbofan jet engine.",
          tasksIllustrated: ["Inspecting turbine blade edges", "Calibrating fly-by-wire servo sensors", "Testing hydraulic fluid pressure"]
        }
      ],
      videos: [
        {
          title: "Inside the Aircraft Maintenance Hangar",
          description: "Watch certified AME engineers overhaul jet engines, replace landing gears, and run full-power ground engine runs.",
          duration: "10:35 mins",
          channel: "AeroTech Maintenance Review",
          thumbnailUrl: "https://images.unsplash.com/photo-1517976487502-5c918a5eb67f?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating jet engine intake inspections",
            "Testing cockpit autopilot actuators",
            "Running avionics diagnostic test computers"
          ]
        }
      ]
    }
  ]
};

// BCA Course from specializations
const BCA_COURSE = (DEGREE_SPECIALIZATION_MAP["BCA"] && DEGREE_SPECIALIZATION_MAP["BCA"][0]) || {
  id: "bca_software",
  name: "Bachelor of Computer Applications (BCA)",
  code: "BCA",
  description: "Practical software development pipelines, database query design, lightweight coding frameworks, mobile app architectures, and system diagnostics.",
  duration: "3 Years",
  difficulty: "Medium" as const,
  keyFocusAreas: ["Object Oriented Programming (Java/Python)", "Relational Databases & SQL", "Full-Stack Web Technologies", "Cloud Application Basics"],
  feedback: [],
  jobs: []
};

// -------------------------------------------------------------
// STREAM CLASSIFIERS DEFINITION
// -------------------------------------------------------------

export const MPC_STREAMS: StreamCategory[] = [
  {
    id: "mpc_eng",
    name: "Engineering & Technology (B.Tech / B.E)",
    code: "ENG_TECH",
    icon: "⚙️",
    tagline: "Core technical, computing, and cutting-edge engineering disciplines",
    description: "The premier 4-year degree pathway for MPC students. Covers computer software, silicon electronics, electrical power grids, mechanical robotics, civil infrastructure, and artificial intelligence.",
    eligibilityBadge: "MPC Eligible (10+2 with Math, Physics, Chemistry)",
    keyDegrees: ["B.Tech (CSE)", "B.Tech (ECE)", "B.Tech (EEE)", "B.Tech (ME)", "B.Tech (Civil)", "B.Tech (AI/ML)"],
    entranceExams: ["JEE Main & Advanced", "State EAPCET / CET", "BITSAT", "VITEEE"],
    typicalDuration: "4 Years",
    courses: [
      CSE_COURSE,
      AIML_COURSE,
      ECE_COURSE,
      EEE_COURSE,
      MECH_COURSE,
      CIVIL_COURSE
    ]
  },
  {
    id: "mpc_arch",
    name: "Architecture & Urban Planning",
    code: "ARCH_PLAN",
    icon: "🏛️",
    tagline: "Building design, smart city master plans, and spatial infrastructure",
    description: "Creative spatial engineering combining architectural design aesthetics, climatic building science, municipal zoning laws, and GIS-driven smart city urban transportation master planning.",
    eligibilityBadge: "MPC with min 50% & Math compulsory",
    keyDegrees: ["B.Arch (Bachelor of Architecture)", "B.Plan (Bachelor of Planning)", "Spatial Design"],
    entranceExams: ["NATA (National Aptitude Test in Architecture)", "JEE Main Paper 2 (B.Arch/B.Plan)"],
    typicalDuration: "4 - 5 Years",
    courses: [
      BARCH_COURSE,
      BPLAN_COURSE
    ]
  },
  {
    id: "mpc_sci",
    name: "Pure Science & Fundamental Research (B.Sc, BS-MS)",
    code: "PURE_SCI",
    icon: "🔬",
    tagline: "Deep theoretical physics, advanced mathematics, and research institutes",
    description: "For students passionate about fundamental scientific discoveries, mathematical modeling, quantum systems, and scientific research careers in premier national labs (IISER, NISER, IITs, ISI).",
    eligibilityBadge: "MPC with high aptitude in Math & Physics",
    keyDegrees: ["BS-MS Dual Degree", "B.Sc (Hons) Math & Computing", "B.Stat / B.Math (ISI)", "B.Sc Physics"],
    entranceExams: ["IAT (IISER Aptitude Test)", "NEST (NISER)", "ISI Admission Test", "CUET-UG"],
    typicalDuration: "3 - 5 Years",
    courses: [
      BSMS_COURSE,
      BSC_MATH_COMPUTING
    ]
  },
  {
    id: "mpc_def",
    name: "Defense & Maritime Forces (NDA & Navy)",
    code: "DEF_MARITIME",
    icon: "🛡️",
    tagline: "Frontline military leadership, warship navigation, and ocean shipping",
    description: "Join the prestigious armed forces as a commissioned military officer through the National Defence Academy or navigate global commercial merchant vessels as an ocean navigational officer.",
    eligibilityBadge: "10+2 MPC with Physics & Math (Unmarried candidates)",
    keyDegrees: ["NDA (Tri-Services Cadet)", "Indian Naval Academy 10+2 B.Tech", "B.Sc Nautical Science"],
    entranceExams: ["UPSC NDA & NA Examination", "Indian Navy 10+2 B.Tech Cadet Entry", "IMU-CET (Merchant Navy)"],
    typicalDuration: "3 - 4 Years",
    courses: [
      NDA_COURSE,
      MERCHANT_NAVY_COURSE
    ]
  },
  {
    id: "mpc_av",
    name: "Aviation & Commercial Pilot Training",
    code: "AVIATION",
    icon: "✈️",
    tagline: "Cockpit flying careers, airline operations, and aircraft engineering",
    description: "Fly commercial twin-engine airliners across international routes as a licensed airline pilot, manage airport air traffic control operations, or inspect and certify aircraft airworthiness.",
    eligibilityBadge: "10+2 with Physics & Math + Class 1 DGCA Medical",
    keyDegrees: ["Commercial Pilot License (CPL)", "Aircraft Maintenance Engineering (AME)", "B.Sc Aviation"],
    entranceExams: ["DGCA Flying Cadet Entrance Tests", "IGRUA Entrance Exam", "AME CET"],
    typicalDuration: "18 Months - 3 Years",
    courses: [
      CPL_COURSE,
      AME_COURSE
    ]
  },
  {
    id: "mpc_comm",
    name: "Commerce, Computing & Business Analytics",
    code: "MGMT_TECH",
    icon: "📊",
    tagline: "Computer applications, software systems, data analytics, and management",
    description: "MPC students excel in tech applications, data analytics, and management consulting. Bridge computer software, financial algorithms, and business strategy with shorter degree runways.",
    eligibilityBadge: "10+2 MPC eligible for all computing & commerce tracks",
    keyDegrees: ["BCA (Computer Applications)", "B.Sc Data Science", "Integrated IPM (IIMs)"],
    entranceExams: ["IPMAT (IIM Indore/Rohtak)", "CUET-UG", "University BCA Entrance"],
    typicalDuration: "3 - 5 Years",
    courses: [
      BCA_COURSE
    ]
  }
];

// -------------------------------------------------------------
// BIPC STREAMS
// -------------------------------------------------------------

const MBBS_COURSE = (DEGREE_SPECIALIZATION_MAP["MBBS"] && DEGREE_SPECIALIZATION_MAP["MBBS"][0]) || {
  id: "mbbs_gen",
  name: "General Medicine & Clinical Surgery (MBBS)",
  code: "MBBS",
  description: "Foundational clinical surgery, pharmaceutical medicine, physical diagnosis, anatomical dissection, emergency care, and holistic healthcare operations.",
  duration: "5.5 Years",
  difficulty: "Intense" as const,
  keyFocusAreas: ["Human Anatomy & Physiology", "Pathology & Microbiology", "Pharmacology & Drug Dosage", "Internal Medicine & Surgery Clinicals"],
  feedback: [],
  jobs: []
};

export const BPHARM_COURSE: SpecializationCourse = {
  id: "bipc_pharm",
  name: "Bachelor of Pharmacy (B.Pharmacy / Pharm.D)",
  code: "B.Pharm",
  description: "Pharmaceutical chemistry, drug formulation synthesis, clinical trial pharmacology, pharmaceutical biotechnology, regulatory drug affairs, and industrial medication manufacturing.",
  duration: "4 - 6 Years",
  difficulty: "Hard",
  keyFocusAreas: ["Medicinal Chemistry & Drug Synthesis", "Pharmaceutics & Formulation Science", "Pharmacology & Toxicology", "Biopharmaceutics & Quality Control"],
  feedback: [],
  jobs: [
    {
      id: "job_drug_formulation",
      title: "Pharmaceutical Formulation & Quality Specialist",
      description: "Develop new drug formulations, conduct bio-equivalence studies, ensure strict FDA/GMP compliance, and direct pharmaceutical production batches.",
      salaryRange: "₹5,50,000 - ₹16,00,000 per annum",
      entryLevelSalary: "₹3,80,000 - ₹5,50,000 per annum",
      seniorLevelSalary: "₹12,00,000 - ₹28,00,000 per annum",
      skillsRequired: ["HPLC / Gas Chromatography", "GMP / US-FDA Regulations", "Drug Formulation Chemistry", "Clinical Trial Documentation", "Pharmacovigilance"],
      dayInLife: [
        "09:00 AM - Lab Testing: Run high-performance liquid chromatography (HPLC) to test purity of an antibiotic batch.",
        "11:30 AM - Formulation Trial: Test dissolution rate of sustained-release capsule polymer coatings.",
        "02:00 PM - FDA Compliance Audit: Review sterile cleanroom air particulate filtration logs.",
        "04:00 PM - Research Debrief: Meet with medicinal chemists to analyze bioavailability uptake curves.",
        "05:15 PM - Documentation: Sign batch manufacturing production certificates."
      ],
      pros: [
        "Immense global pharma industry footprint in India (the pharmacy of the world)",
        "Diverse career options across drug discovery, clinical trials, and regulatory affairs",
        "License to operate independent pharmacies and pharmaceutical manufacturing units"
      ],
      cons: [
        "Requires handling potent active pharmaceutical ingredients under strict safety protocols",
        "Rigorous regulatory paperwork with severe penalties for audit discrepancies",
        "Initial industrial production roles often involve rotating factory shifts"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
          caption: "Pharmaceutical researchers running automated spectrometry testing on tablet formulations.",
          tasksIllustrated: ["Analyzing HPLC chromatograms", "Testing dissolution bath vessels", "Verifying formulation purity"]
        }
      ],
      videos: [
        {
          title: "Inside a High-Tech Pharmaceutical Research Facility",
          description: "See how scientists formulate life-saving medicines, test compound bioavailability, and operate automated sterile packaging lines.",
          duration: "9:20 mins",
          channel: "Pharma Science World",
          thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating tablet compression machines",
            "Inspecting sterile cleanroom procedures",
            "Explaining molecular bioavailability testing"
          ]
        }
      ]
    }
  ]
};

export const BSC_AGRI_COURSE: SpecializationCourse = {
  id: "bipc_agri",
  name: "B.Sc (Hons) Agriculture & Agri-Tech",
  code: "B.Sc Agri",
  description: "Agronomy crop science, genetic plant breeding, soil chemistry, drone precision farming, organic agriculture, pest pathology, and agribusiness economics.",
  duration: "4 Years",
  difficulty: "Medium",
  keyFocusAreas: ["Agronomy & Crop Physiology", "Genetics & Plant Breeding", "Soil Science & Nutrient Management", "Precision Agri-Tech & Smart Irrigation"],
  feedback: [],
  jobs: [
    {
      id: "job_agri_officer",
      title: "Agricultural Development Officer / Agri-Tech Consultant",
      description: "Advise on hybrid crop cultivation, introduce IoT soil sensors and precision irrigation, evaluate crop credit loans for banks, or direct agribusiness supply chain operations.",
      salaryRange: "₹5,00,000 - ₹15,00,000 per annum",
      entryLevelSalary: "₹3,60,000 - ₹5,50,000 per annum",
      seniorLevelSalary: "₹12,00,000 - ₹24,00,000 per annum",
      skillsRequired: ["Soil Chemistry Diagnostics", "Integrated Pest Management (IPM)", "Drone Precision Spraying", "Agri-Finance & Crop Insurance", "Supply Chain Logistics"],
      dayInLife: [
        "08:30 AM - Field Survey: Inspect experimental hybrid seed trial plots for pest resistance.",
        "11:00 AM - Soil Lab Testing: Measure nitrogen-phosphorus-potassium (NPK) ratios on farmer soil samples.",
        "02:00 PM - Drone Demo: Coordinate autonomous agricultural drone spraying for micro-nutrient application.",
        "04:00 PM - Banking Sync: Audit crop yield risk assessments for rural development credit approvals.",
        "05:30 PM - Community Workshop: Guide progressive farmers on drip irrigation scheduling under water scarcity."
      ],
      pros: [
        "High job security with abundant government sector opportunities (NABARD, FCI, State Agri Depts)",
        "Rapidly growing agri-tech startup ecosystem leveraging IoT, AI, and smart logistics",
        "Direct positive social impact uplifting rural livelihoods and ensuring national food security"
      ],
      cons: [
        "Substantial fieldwork in rural outdoor settings under hot sun and varying weather",
        "Seasonal workload variations aligned with harvest and sowing cycles",
        "Government administrative roles can involve transfers across rural districts"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
          caption: "Agricultural scientist evaluating hydroponic crop health and automated irrigation sensors.",
          tasksIllustrated: ["Measuring soil moisture readings", "Inspecting leaf tissue samples", "Calibrating precision drip valves"]
        }
      ],
      videos: [
        {
          title: "The Modern Agri-Tech Revolution in India",
          description: "See how agricultural graduates use satellite imaging, drones, and hydroponics to modernize farming across the country.",
          duration: "10:10 mins",
          channel: "AgriTech Frontier",
          thumbnailUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating drone multispectral crop health maps",
            "Testing soil acidity with digital pH meters",
            "Explaining climate-resilient hybrid seeds"
          ]
        }
      ]
    }
  ]
};

export const BPT_COURSE: SpecializationCourse = {
  id: "bipc_bpt",
  name: "Bachelor of Physiotherapy (BPT) & Allied Health",
  code: "BPT",
  description: "Musculoskeletal rehabilitation, neurological physical therapy, sports traumatology, orthopedic biomechanics, cardiopulmonary exercise recovery, and post-operative mobility restoration.",
  duration: "4.5 Years",
  difficulty: "Hard",
  keyFocusAreas: ["Human Anatomy & Biomechanics", "Neurological Rehabilitation", "Sports Physical Therapy & Injury Prevention", "Electrotherapy & Manual Therapy"],
  feedback: [],
  jobs: [
    {
      id: "job_physiotherapist",
      title: "Consultant Physiotherapist / Sports Physio",
      description: "Diagnose movement disorders, rehabilitate orthopedic trauma patients, design injury recovery protocols for athletes, and operate independent physical therapy clinics.",
      salaryRange: "₹5,00,000 - ₹15,00,000 per annum",
      entryLevelSalary: "₹3,50,000 - ₹5,50,000 per annum",
      seniorLevelSalary: "₹10,00,000 - ₹25,00,000+ per annum (Private Practice)",
      skillsRequired: ["Manual Therapy Techniques", "Gait & Postural Analysis", "Electrotherapy Modalities", "Sports Rehabilitation Protocols", "Patient Empathy & Motivation"],
      dayInLife: [
        "09:00 AM - Inpatient Ward: Guide post-knee replacement surgery patients through initial weight-bearing steps.",
        "11:00 AM - Neuro Rehabilitation: Work with stroke recovery patients on balance and neuromotor coordination.",
        "02:00 PM - Sports Clinic: Treat a professional cricket player's rotator cuff tendon strain using ultrasound therapy.",
        "04:00 PM - Ergonomic Consult: Advise corporate software workers on postural correction and spine decompression exercises.",
        "05:30 PM - Exercise Prescription: Update customized home recovery workout charts for rehabilitation clients."
      ],
      pros: [
        "Rewarding clinical healthcare profession without prescribing synthetic medications or performing surgeries",
        "High autonomy to establish thriving private clinics or work with elite sports teams",
        "Surging demand due to aging demographics, sedentary corporate lifestyles, and sports fitness culture"
      ],
      cons: [
        "High physical exertion performing manual joint mobilization and patient transfers daily",
        "Requires patient patience as neurological and orthopedic recovery spans several months",
        "Building a lucrative independent private client base takes a few years of word-of-mouth trust"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
          caption: "Physiotherapist guiding a patient through rehabilitative mobility exercises on specialized biomechanics equipment.",
          tasksIllustrated: ["Assessing joint range of motion", "Demonstrating resistance band exercises", "Applying ultrasound electrotherapy"]
        }
      ],
      videos: [
        {
          title: "Day in the Life of a Sports Physiotherapist",
          description: "Follow a rehabilitation therapist working with athletes in training centers and hospital orthopedic wards.",
          duration: "8:40 mins",
          channel: "Healthcare Careers Network",
          thumbnailUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Demonstrating postural grid analysis",
            "Treating muscle sprains with manual therapy",
            "Testing balance on wobble boards"
          ]
        }
      ]
    }
  ]
};

export const BIPC_STREAMS: StreamCategory[] = [
  {
    id: "bipc_med",
    name: "Medicine & Clinical Healthcare (MBBS / BDS / AYUSH)",
    code: "MEDICINE",
    icon: "🩺",
    tagline: "Physician doctor, dental surgery, and traditional medicinal sciences",
    description: "The apex clinical medical pathway for BiPC students. Lead emergency medicine wards, diagnose diseases, perform surgical procedures, and practice curative healthcare.",
    eligibilityBadge: "10+2 with Biology, Physics, Chemistry (NEET qualified)",
    keyDegrees: ["MBBS (5.5 Years)", "BDS (Dental - 5 Years)", "BAMS (Ayurveda)", "BHMS (Homeopathy)"],
    entranceExams: ["NEET-UG (National Eligibility cum Entrance Test)"],
    typicalDuration: "5 - 5.5 Years",
    courses: [
      MBBS_COURSE
    ]
  },
  {
    id: "bipc_pharm",
    name: "Pharmacy & Pharmaceutical Sciences",
    code: "PHARMACY",
    icon: "💊",
    tagline: "Drug formulation synthesis, clinical pharmacology, and research",
    description: "Formulate life-saving medications, direct clinical trials, synthesize active compounds, and ensure FDA-compliant manufacturing across India's booming pharmaceutical corridor.",
    eligibilityBadge: "10+2 with Biology or Math + Physics, Chemistry",
    keyDegrees: ["B.Pharmacy (4 Years)", "Pharm.D (Doctor of Pharmacy - 6 Years)"],
    entranceExams: ["State EAPCET / CET", "NEET-UG", "GPAT (for higher studies)"],
    typicalDuration: "4 - 6 Years",
    courses: [
      BPHARM_COURSE
    ]
  },
  {
    id: "bipc_agri",
    name: "Agricultural & Veterinary Sciences",
    code: "AGRI_VET",
    icon: "🌾",
    tagline: "Agronomy, genetic crop breeding, veterinary medicine, and horticulture",
    description: "Scientific food production, hybrid plant genetics, animal veterinary surgery, precision drone agriculture, and soil ecosystems for modern sustainability.",
    eligibilityBadge: "10+2 BiPC (State ICAR / Agri EAPCET norms)",
    keyDegrees: ["B.Sc (Hons) Agriculture", "B.V.Sc & A.H (Veterinary Doctor)", "B.Sc Horticulture"],
    entranceExams: ["ICAR AIEEA", "State EAPCET Agriculture Stream", "NEET (for Veterinary)"],
    typicalDuration: "4 - 5.5 Years",
    courses: [
      BSC_AGRI_COURSE
    ]
  },
  {
    id: "bipc_allied",
    name: "Allied Health & Paramedical Sciences",
    code: "ALLIED_HEALTH",
    icon: "🏥",
    tagline: "Physical rehabilitation, nursing care, and diagnostic radiology",
    description: "Hands-on clinical healthcare restored without surgery. Master physical therapy, critical care nursing, medical lab diagnostics, and radiology imaging.",
    eligibilityBadge: "10+2 with Biology, Physics, Chemistry",
    keyDegrees: ["BPT (Physiotherapy)", "B.Sc Nursing", "B.Sc Medical Lab Tech (MLT)"],
    entranceExams: ["State Paramedical Admissions", "NEET-UG (for selected Nursing)", "AIIMS Paramedical"],
    typicalDuration: "3 - 4.5 Years",
    courses: [
      BPT_COURSE
    ]
  }
];

// -------------------------------------------------------------
// COMMERCE & HUMANITIES (MEC, CEC, HEC) STREAMS
// -------------------------------------------------------------

const BCOM_COURSE = (DEGREE_SPECIALIZATION_MAP["B.Com (Honors)"] && DEGREE_SPECIALIZATION_MAP["B.Com (Honors)"][0]) || {
  id: "bcom_finance",
  name: "B.Com (Honors) & Corporate Finance",
  code: "B.Com",
  description: "Advanced accounting ledger auditing, direct tax planning laws, risk modeling architectures, corporate portfolio valuations, and stock-market computations.",
  duration: "3 Years",
  difficulty: "Medium" as const,
  keyFocusAreas: ["Corporate Accounting Ledger", "Statutory Taxation Laws", "Financial Risk Modeling", "Auditing Foundations"],
  feedback: [],
  jobs: []
};

export const CA_COURSE: SpecializationCourse = {
  id: "comm_ca",
  name: "Chartered Accountancy (CA - Foundation, Inter, Final)",
  code: "CA",
  description: "The gold standard of corporate financial auditing, taxation law, corporate governance, statutory accounting, mergers & acquisitions, and international financial reporting (IFRS).",
  duration: "4.5 - 5 Years",
  difficulty: "Intense",
  keyFocusAreas: ["Statutory Auditing & Assurance", "Direct & Indirect Tax Laws (GST)", "Corporate & Economic Laws", "Strategic Financial Management (SFM)"],
  feedback: [],
  jobs: [
    {
      id: "job_chartered_accountant",
      title: "Practicing Chartered Accountant / Corporate Tax Director",
      description: "Certify corporate balance sheets, represent multinational corporations before tax appellate tribunals, structure mergers & acquisitions, and provide CFO advisory services.",
      salaryRange: "₹9,00,000 - ₹30,00,000 per annum",
      entryLevelSalary: "₹7,50,000 - ₹12,00,000 per annum",
      seniorLevelSalary: "₹25,00,000 - ₹75,00,000+ per annum",
      skillsRequired: ["ICAI Statutory Auditing Standards", "Income Tax & GST Litigation", "Financial Statement Restatement (Ind-AS/IFRS)", "Corporate Valuations", "Forensic Accounting"],
      dayInLife: [
        "09:00 AM - Audit Planning: Coordinate the statutory audit team for a publicly listed manufacturing client.",
        "11:30 AM - Tax Strategy: Draft defense submissions for a complex cross-border transfer pricing audit notice.",
        "02:00 PM - Board Audit Committee: Present internal control audit findings to independent directors.",
        "04:00 PM - M&A Due Diligence: Analyze undisclosed tax liabilities of a prospective acquisition target.",
        "05:30 PM - Sign-Off: Issue independent auditor's report certifying a true and fair view of financial statements."
      ],
      pros: [
        "Among the most respected and authoritative corporate credentials in the country",
        "Statutory monopoly on signing and certifying company audit balance sheets",
        "Unlimited earning potential through private practice, consulting, or corporate CFO executive suites"
      ],
      cons: [
        "Extremely rigorous examination pass percentage (often 10-15%) requiring exceptional discipline",
        "Demanding 2-year mandatory articleship training alongside professional exams",
        "Heavy seasonal workload crunches during tax filing and annual corporate closing quarters"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          caption: "Chartered Accountant reviewing audited financial balance sheets and corporate tax submissions.",
          tasksIllustrated: ["Analyzing audited profit and loss books", "Verifying GST reconciliation sheets", "Preparing board audit presentations"]
        }
      ],
      videos: [
        {
          title: "Journey to Becoming a Chartered Accountant in India",
          description: "Follow the path from CA Foundation through the articleship grind at top accounting firms to qualifying as a Chartered Accountant.",
          duration: "11:10 mins",
          channel: "ICAI Career Insights",
          thumbnailUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Articleship students working on real audit files",
            "Explaining corporate statutory balance sheets",
            "Demonstrating forensic audit tools"
          ]
        }
      ]
    }
  ]
};

export const BBA_IPM_COURSE: SpecializationCourse = {
  id: "comm_ipm",
  name: "Integrated Programme in Management (IPM - IIM Indore/Rohtak) / BBA",
  code: "IPM / BBA",
  description: "Elite 5-year integrated management education direct from 12th class into top Indian Institutes of Management (IIMs). Blends liberal arts, mathematics, corporate strategy, marketing, and leadership.",
  duration: "3 - 5 Years",
  difficulty: "Hard",
  keyFocusAreas: ["Strategic Management & Leadership", "Marketing Analytics & Consumer Behavior", "Corporate Finance & Valuation", "Supply Chain & Operations"],
  feedback: [],
  jobs: [
    {
      id: "job_management_consultant",
      title: "Management Consultant / Strategy Lead",
      description: "Advise Fortune 500 CEOs on corporate turnaround, market entry strategies, digital transformation, and operational cost efficiency.",
      salaryRange: "₹12,00,000 - ₹35,00,000 per annum",
      entryLevelSalary: "₹9,00,000 - ₹16,00,000 per annum",
      seniorLevelSalary: "₹28,00,000 - ₹65,00,000+ per annum",
      skillsRequired: ["Structured Problem Solving", "Financial & Operational Modeling", "Executive Storytelling & Presentation", "Market Sizing Analysis", "Stakeholder Management"],
      dayInLife: [
        "09:00 AM - Client Interview: Interview regional sales directors to identify distribution bottleneck causes.",
        "11:00 AM - Data Modeling: Build revenue sensitivity scenarios on market expansion across tier-2 cities.",
        "02:00 PM - Strategy Deck Workshop: Structure hypothesis-driven slide presentation for board of directors.",
        "04:00 PM - Pilot Implementation: Oversee rollout of a new digital inventory tracker at warehouse hubs.",
        "05:30 PM - Team Debrief: Align with consulting engagement partners on deliverables for the week."
      ],
      pros: [
        "Fast-track to top IIM MBA degree without writing the post-graduation CAT exam",
        "Accelerated career progression into elite strategy consulting and global investment banks",
        "Broad interdisciplinary education combining psychology, economics, philosophy, and business"
      ],
      cons: [
        "Highly competitive IPMAT entrance exams with high cutoffs across limited seats",
        "Higher tuition fees compared to standard undergraduate university degrees",
        "Demanding presentation schedules and high expectations from day one"
      ],
      feedback: [],
      images: [
        {
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
          caption: "Management consultants presenting business turnaround strategies in an executive corporate boardroom.",
          tasksIllustrated: ["Analyzing market growth charts", "Facilitating client strategy workshops", "Building corporate financial decks"]
        }
      ],
      videos: [
        {
          title: "Life at IIM Indore IPM: Direct Entry After 12th",
          description: "See what campus life, case study competitions, and corporate placements look like for students entering IIMs directly after higher secondary school.",
          duration: "10:45 mins",
          channel: "Management Life Review",
          thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
          simulationDetails: [
            "Harvard Business School case study discussions",
            "Student leadership committee meetings",
            "Summer internship placement debriefs"
          ]
        }
      ]
    }
  ]
};

export const COMMERCE_STREAMS: StreamCategory[] = [
  {
    id: "comm_fin",
    name: "Finance, Accounting & Professional Auditing (CA Track)",
    code: "FIN_AUDIT",
    icon: "📈",
    tagline: "Chartered Accountancy, corporate tax law, and financial auditing",
    description: "The gold standard finance track. Master statutory corporate audits, direct tax laws, international reporting, and corporate balance sheet advisory.",
    eligibilityBadge: "10+2 with Commerce, Math, or Humanities",
    keyDegrees: ["Chartered Accountancy (CA)", "B.Com (Honors)", "CMA (Cost Accounting)", "CS"],
    entranceExams: ["ICAI CA Foundation", "ICMAI CMA Foundation", "CUET-UG B.Com (Hons)"],
    typicalDuration: "3 - 5 Years",
    courses: [
      CA_COURSE,
      BCOM_COURSE
    ]
  },
  {
    id: "comm_mgmt",
    name: "Business Management, Leadership & IPM (IIMs)",
    code: "MGMT_LEAD",
    icon: "🏢",
    tagline: "Integrated management degrees at IIMs, strategy consulting, and BBA",
    description: "Accelerate directly into premier Indian Institutes of Management (IIMs) after 12th class. Master corporate strategy, marketing, finance, and organizational leadership.",
    eligibilityBadge: "10+2 with min 60% marks in any stream",
    keyDegrees: ["Integrated IPM (IIM Indore/Rohtak - 5 Yrs)", "BBA", "BMS"],
    entranceExams: ["IPMAT (IIM Indore & Rohtak)", "JIPMAT", "CUET-UG", "SET"],
    typicalDuration: "3 - 5 Years",
    courses: [
      BBA_IPM_COURSE
    ]
  },
  {
    id: "comm_tech",
    name: "Computer Applications & FinTech Analytics",
    code: "COMP_ANALYTICS",
    icon: "💻",
    tagline: "Software programming, mobile development, and financial technologies",
    description: "MEC/CEC students can directly enter software development and tech product management through modern computer application degree routes.",
    eligibilityBadge: "10+2 with Mathematics / Computer / Statistics",
    keyDegrees: ["BCA (Computer Applications)", "B.Sc Data Analytics in Finance"],
    entranceExams: ["University BCA Entrance", "CUET-UG"],
    typicalDuration: "3 Years",
    courses: [
      BCA_COURSE
    ]
  }
];

// -------------------------------------------------------------
// POLYTECHNIC STREAMS
// -------------------------------------------------------------

export const POLY_STREAMS: StreamCategory[] = [
  {
    id: "poly_lateral",
    name: "Engineering Lateral Entry (Direct 2nd Year B.Tech via ECET)",
    code: "LATERAL_BTECH",
    icon: "⚙️",
    tagline: "Skip 1st year B.Tech and enter directly into 2nd year engineering",
    description: "Polytechnic diploma holders get guaranteed lateral entry into top engineering colleges through state ECET. Graduate with a full 4-year B.Tech degree in just 3 additional years.",
    eligibilityBadge: "Completed 3-Year Polytechnic Diploma with min 50%",
    keyDegrees: ["B.Tech Lateral Entry (CSE)", "B.Tech Lateral (ECE)", "B.Tech Lateral (EEE)", "B.Tech Lateral (Mechanical)", "B.Tech Lateral (Civil)"],
    entranceExams: ["State ECET (Engineering Common Entrance Test)"],
    typicalDuration: "3 Years (Direct 2nd Year Entry)",
    courses: [
      CSE_COURSE,
      AIML_COURSE,
      ECE_COURSE,
      EEE_COURSE,
      MECH_COURSE,
      CIVIL_COURSE
    ]
  },
  {
    id: "poly_amie",
    name: "Advanced Technical Certifications & AMIE",
    code: "TECH_CERT",
    icon: "🛠️",
    tagline: "Chartered engineer status, robotics, and industrial automation",
    description: "Achieve chartered engineering status recognized equivalent to B.Tech by the Government of India through the Institution of Engineers while working in industry.",
    eligibilityBadge: "Completed 3-Year Diploma in any engineering discipline",
    keyDegrees: ["AMIE (Chartered Licensed Engineer)", "Post-Diploma in Robotics", "Advanced CNC Automation"],
    entranceExams: ["Institution of Engineers (India) AMIE Exams"],
    typicalDuration: "2 - 3 Years",
    courses: [
      MECH_COURSE,
      EEE_COURSE
    ]
  }
];

// -------------------------------------------------------------
// RESOLUTION HELPER
// -------------------------------------------------------------

export function getStreamsForGroup(groupNameOrCode: string): StreamCategory[] {
  if (!groupNameOrCode) return MPC_STREAMS;
  const upper = groupNameOrCode.toUpperCase();

  // Check for Polytechnic
  if (upper.includes('POLY') || upper.includes('DIPLOMA') || upper.includes('DME') || upper.includes('DECE') || upper.includes('DCSE') || upper.includes('DEEE')) {
    return POLY_STREAMS;
  }

  // Check for BiPC
  if (upper.includes('BIPC') || upper.includes('BIOLOGY') || upper.includes('BOTANY') || upper.includes('ZOOLOGY') || upper.includes('B.P.C') || upper.includes('MBIPC')) {
    return BIPC_STREAMS;
  }

  // Check for Commerce (MEC, CEC, HEC)
  if (upper.includes('MEC') || upper.includes('CEC') || upper.includes('COMMERCE') || upper.includes('ACCOUNTS') || upper.includes('HEC') || upper.includes('ARTS') || upper.includes('HUMANITIES')) {
    return COMMERCE_STREAMS;
  }

  // Default to MPC (Math, Physics, Chemistry)
  return MPC_STREAMS;
}
