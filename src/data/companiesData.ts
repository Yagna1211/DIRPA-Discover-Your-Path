import { Company } from '../types';

export const COMPANIES_DATA: Company[] = [
  {
    id: 'google',
    name: 'Google (Alphabet)',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    brandColor: '#4285F4',
    tagline: 'Organizing the world’s information and making it universally accessible and useful.',
    industry: 'Tech & Product',
    companyType: 'Product MNC',
    headquarters: 'Mountain View, California, USA (India hubs: Hyderabad, Bengaluru, Gurugram, Mumbai, Pune)',
    foundedYear: '1998',
    employeeCount: '180,000+ Worldwide',
    description: 'Google is a global technological pioneer leading innovation across search algorithms, cloud computing (Google Cloud Platform), mobile operating systems (Android), artificial intelligence (Gemini, DeepMind), YouTube, and workspace productivity ecosystems.',
    aboutCulture: 'Renowned for high engineering autonomy, psychological safety, open-source contribution culture, 20% innovation project time, world-class campuses, peer-reviewed technical ladders, and generous health and wellness benefits.',
    website: 'https://about.google',
    careersUrl: 'https://careers.google.com',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. / M.Tech / MS / MCA in Computer Science, IT, Electrical, Mathematics & Computing, or related engineering branches. Open to exceptional self-taught coders and competitive programming achievers.',
      acceptedStreams: ['B.Tech Computer Science / AI / IT', 'B.Tech ECE / EEE', 'M.Tech / Dual Degree CSE', 'BSc / BCA / MCA with strong DSA', 'Polytechnic Diploma (Hardware / Datacenter tech roles)'],
      standardSelectionProcess: [
        'Online Assessment / Google Online Challenge (2-3 DSA & Algorithm problems in 60-90 mins)',
        'Technical Phone Screen (45 mins DSA, Problem Solving & Time Complexity)',
        'Onsite / Virtual Loop (3 Technical DSA rounds + 1 Googleyness & Leadership round)',
        'Hiring Committee Review & Offer Generation'
      ],
      fresherHiringPrograms: ['Google STEP Internship (for 1st/2nd year undergrads)', 'Google Summer of Code (GSoC)', 'Google Kick Start / Code Jam alumni channels', 'Early Career Campus Recruitment (L3 SDE)'],
      internshipOpportunities: 'Summer internships (10-12 weeks) with monthly stipend ranging ₹1,10,000 - ₹1,40,000/month + housing and travel allowance.'
    },
    salaryOverview: {
      fresherMedian: '₹28,00,000 - ₹38,00,000 CTC (Base: ₹16-20 LPA + Stock Units + Bonus)',
      range: '₹25 LPA - ₹65+ LPA across L3 to L5 engineering roles',
      benefits: ['Free gourmet breakfast, lunch, and dinner', 'Comprehensive medical insurance for family', 'Annual equity grants (GSUs)', 'Wellness & fitness reimbursement', 'Hybrid flexibility with 4 remote weeks/year']
    },
    keyHighlights: [
      'Top-tier compensation package and global mobility opportunities',
      'Work on systems serving over 2 billion daily active users',
      'Direct access to industry-defining AI infrastructure and TPUs',
      'Extensive mentorship programs and technical sabbatical support'
    ],
    roles: [
      {
        id: 'google-sde',
        title: 'Software Development Engineer I (L3)',
        department: 'Core Engineering / Google Cloud / Search / Android',
        targetEligibility: ['B.Tech CSE/IT/ECE', 'M.Tech CSE', 'MCA'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹30 - 42 LPA CTC',
        description: 'Design, develop, test, deploy, maintain, and enhance large-scale distributed software solutions across Google products.',
        keyResponsibilities: [
          'Write clean, robust, and unit-tested code in C++, Java, Go, or Python',
          'Participate in architecture reviews and design scalable microservices',
          'Optimize algorithmic time/space complexities on high-throughput backend pipelines',
          'Collaborate with Product Managers and UX designers to ship features'
        ],
        requiredSkills: ['Data Structures & Algorithms', 'C++ / Java / Python / Go', 'System Design fundamentals', 'Operating Systems & Concurrency', 'Distributed Computing concepts'],
        hiringStages: ['Google Online Challenge', 'Tech Round 1 (Trees/Graphs)', 'Tech Round 2 (DP/Arrays)', 'Googleyness & Leadership']
      },
      {
        id: 'google-cse',
        title: 'Cloud Support Engineer / Technical Solutions Associate',
        department: 'Google Cloud Platform (GCP)',
        targetEligibility: ['B.Tech all branches', 'BCA/MCA', 'BSc Computer Science'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹14 - 22 LPA CTC',
        description: 'Troubleshoot complex enterprise technical incidents on GCP services including Kubernetes (GKE), BigQuery, Cloud Storage, and VPC Networking.',
        keyResponsibilities: [
          'Diagnose root cause of production incidents on GCP infrastructure',
          'Write automation scripts in Python/Bash to streamline diagnostics',
          'Guide enterprise architects on best practices for cloud migrations',
          'Author knowledge base articles and internal runbooks'
        ],
        requiredSkills: ['Linux System Administration', 'Networking (TCP/IP, DNS, VPN)', 'Cloud Architecture (GCP/AWS/Azure)', 'Python/Bash Scripting', 'SQL & Databases'],
        hiringStages: ['Online MCQ & Coding', 'Linux & Networking Technical Interview', 'Scenario Troubleshooting Round', 'Behavioral Interview']
      },
      {
        id: 'google-data-analyst',
        title: 'Associate Data & Analytics Specialist',
        department: 'Business Operations / Ads Measurement / Trust & Safety',
        targetEligibility: ['B.Tech', 'B.Sc Statistics/Maths', 'B.Com / Economics with Analytics'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹16 - 24 LPA CTC',
        description: 'Transform complex user behavioral data into actionable operational strategies and automated dashboard pipelines.',
        keyResponsibilities: [
          'Build and maintain ETL pipelines using SQL, BigQuery, and Python',
          'Design interactive dashboards in Looker and Google Data Studio',
          'Conduct statistical hypothesis testing and A/B test analysis',
          'Present analytical findings to senior leadership'
        ],
        requiredSkills: ['Advanced SQL', 'Python (Pandas, NumPy)', 'Data Visualization (Looker/Tableau)', 'Statistics & Probability', 'A/B Testing'],
        hiringStages: ['SQL & Analytical Assessment', 'Data Modeling Technical Round', 'Business Case Analysis Round', 'Googleyness']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'g-fb-1',
        authorName: 'Aditya Sharma',
        authorRole: 'Software Engineer II @ Google Cloud',
        authorAvatar: 'aditya',
        collegeOrBatch: 'NIT Warangal (B.Tech CSE \'21)',
        rating: 5,
        workLifeBalanceRating: 5,
        careerGrowthRating: 5,
        feedbackText: 'Google offers unparalleled engineering standards. The code review culture is stringent yet extraordinarily educational—you learn how to write production code that survives billions of calls per second. The campus food, work-life flexibility, and collaborative peer attitude make it an exceptional workplace.',
        interviewExperience: 'Focus on LeetCode Medium/Hard DSA, specifically Dynamic Programming, Graph Traversals (BFS/DFS/Dijkstra), and Segment Trees. During interviews, always explain your brute-force logic first before optimizing.',
        adviceForFreshers: 'Do not just memorize solutions. Understand why a particular data structure is chosen and practice writing code on a clean whiteboard or Google Docs without syntax highlighting.',
        likes: 48,
        timestamp: '2 weeks ago',
        isVerifiedAlumni: true
      },
      {
        id: 'g-fb-2',
        authorName: 'Sneha Reddy',
        authorRole: 'Technical Solutions Engineer @ Google',
        authorAvatar: 'sneha',
        collegeOrBatch: 'JNTU Hyderabad (B.Tech ECE \'22)',
        rating: 4.8,
        workLifeBalanceRating: 4.5,
        careerGrowthRating: 5,
        feedbackText: 'Joined through the campus hiring initiative. Google Cloud is growing exponentially in India. The team gave me 3 months of comprehensive ramp-up training on Kubernetes, Linux internals, and networking before putting me on live production tickets.',
        interviewExperience: 'Prepare OSI layers, TCP handshake, Subnetting, Linux terminal troubleshooting commands (top, netstat, strace, curl), and basic Python scripting.',
        adviceForFreshers: 'Earn the Google Associate Cloud Engineer (ACE) certification during your 3rd or 4th year—it gives you a tremendous edge in the resume screening phase.',
        likes: 31,
        timestamp: '1 month ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    brandColor: '#00A4EF',
    tagline: 'Empowering every person and every organization on the planet to achieve more.',
    industry: 'Tech & Product',
    companyType: 'Product MNC',
    headquarters: 'Redmond, Washington, USA (India hubs: Hyderabad, Bengaluru, Noida)',
    foundedYear: '1975',
    employeeCount: '220,000+ Worldwide',
    description: 'Microsoft is one of the world’s most influential technology enterprises, powering cloud infrastructure (Microsoft Azure), desktop productivity (Windows, Office 365), developer tools (GitHub, VS Code), gaming (Xbox), and pioneering generative AI (OpenAI partnership, Copilot).',
    aboutCulture: 'Centred on a "Growth Mindset" philosophy, high emphasis on learning and adaptability, extensive family benefits, generous parental leave, hackathons (annual Global Hackathon), and hybrid work schedules.',
    website: 'https://www.microsoft.com',
    careersUrl: 'https://careers.microsoft.com',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. / Dual Degree / M.Tech in Computer Science, IT, Mathematics, Electrical or related disciplines. Minimum 7.0 CGPA / 70% aggregate with no active backlogs.',
      acceptedStreams: ['B.Tech CSE / IT / Data Science', 'B.Tech ECE / EEE', 'M.Tech Software Engineering', 'MCA / MSc IT'],
      standardSelectionProcess: [
        'Online Assessment on Codility / HackerEarth (3 DSA & Algorithm problems in 90 mins)',
        'Technical Round 1 (Data Structures, Strings, Arrays, Recursion)',
        'Technical Round 2 (Trees, Graphs, Object Oriented Design, Concurrency)',
        'AA (As Appropriate) / Managerial Round with Senior Director'
      ],
      fresherHiringPrograms: ['Microsoft Engage Mentorship & Hackathon', 'Microsoft Codess (for women in tech)', 'Explore Microsoft Internship (for 1st/2nd year students)', 'University Campus Placement Drive'],
      internshipOpportunities: '2-month summer internship with ₹1,00,000 - ₹1,25,000/month stipend and high pre-placement offer (PPO) conversion rates (>80%).'
    },
    salaryOverview: {
      fresherMedian: '₹26,00,000 - ₹34,00,000 CTC (Base: ₹15-18 LPA + Stocks + Joining Bonus)',
      range: '₹22 LPA - ₹55+ LPA for SDE 1 to SDE 2',
      benefits: ['Medical insurance with outpatient OPD coverage', 'Annual stock awards (RSUs)', 'Free transport / cab facility in Hyderabad and Bengaluru', 'Wellness allowance (gym, sports equipment)', 'Education tuition reimbursement']
    },
    keyHighlights: [
      'Leader in Generative AI via Copilot and OpenAI integrations',
      'Massive scale enterprise cloud engineering on Microsoft Azure',
      'Exceptional work-life balance with structured 9-to-5 working boundaries',
      'Strong culture of internal mobility across global teams'
    ],
    roles: [
      {
        id: 'msft-sde',
        title: 'Software Engineer (Level 59/60)',
        department: 'Azure / Office 365 / Windows / Developer Division (GitHub)',
        targetEligibility: ['B.Tech CSE/IT', 'M.Tech CSE', 'MCA'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹26 - 36 LPA CTC',
        description: 'Build mission-critical cloud services, developer productivity tools, and AI copilot experiences used by Fortune 500 enterprises.',
        keyResponsibilities: [
          'Design and implement reliable APIs in C#, C++, Java, or TypeScript',
          'Deploy high-availability services across multi-region Azure clusters',
          'Implement CI/CD automation pipelines with automated unit and stress testing',
          'Collaborate with telemetry and monitoring teams to ensure 99.99% service uptime'
        ],
        requiredSkills: ['C# / C++ / Java / Python', 'Data Structures & Algorithms', 'Object-Oriented Design (SOLID principles)', 'REST APIs & Cloud Services', 'SQL / NoSQL (Cosmos DB)'],
        hiringStages: ['Online Codility Test', 'Data Structures & Algorithm Interview', 'System Design & Code Quality Round', 'AA / Leadership Round']
      },
      {
        id: 'msft-support-engineer',
        title: 'Support Escalation Engineer (Azure Cloud)',
        department: 'Customer Success / Azure Infrastructure',
        targetEligibility: ['B.Tech (All Streams)', 'MCA', 'BSc CS/IT'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹12 - 18 LPA CTC',
        description: 'Provide deep technical debugging and architectural resolution for mission-critical Azure enterprise cloud deployments.',
        keyResponsibilities: [
          'Debug live memory dumps, network traces (Wireshark), and event logs',
          'Work with product engineering teams to patch critical kernel and cloud bugs',
          'Provide architectural guidance for cloud high-availability disaster recovery',
          'Write technical whitepapers and sample code snippets for customers'
        ],
        requiredSkills: ['Azure Cloud Services', 'Windows Server / Linux OS Internals', 'Networking & Firewalls', 'PowerShell / Python', 'Debugging & Troubleshooting'],
        hiringStages: ['Aptitude & Technical MCQ', 'OS & Networking Deep Dive', 'Live Troubleshooting Scenario', 'HR & Managerial']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'ms-fb-1',
        authorName: 'Kavya Ramanathan',
        authorRole: 'Software Engineer @ Azure Core',
        authorAvatar: 'kavya',
        collegeOrBatch: 'IIT Madras (B.Tech CSE \'22)',
        rating: 5,
        workLifeBalanceRating: 4.8,
        careerGrowthRating: 5,
        feedbackText: 'Microsoft is one of the best places to start your software engineering career. The mentorship is top-notch, you get assigned a dedicated "buddy" for the first 6 months, and you are trusted with impactful projects right from day one.',
        interviewExperience: 'They focus heavily on clean object-oriented code and edge cases. In the AA round, be prepared to speak about your personal projects, teamwork challenges, and how you learn from failures.',
        adviceForFreshers: 'Master Low-Level Design (LLD) and Design Patterns (Factory, Singleton, Observer, Strategy) along with standard LeetCode problems.',
        likes: 42,
        timestamp: '3 weeks ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'tcs',
    name: 'Tata Consultancy Services (TCS)',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    brandColor: '#002D62',
    tagline: 'Building on belief. Empowering digital transformation across global enterprises.',
    industry: 'IT Services & Consulting',
    companyType: 'IT Services MNC',
    headquarters: 'Mumbai, Maharashtra, India (Operating in 50+ countries with 150+ delivery centres)',
    foundedYear: '1968',
    employeeCount: '600,000+ Worldwide (India’s largest private employer)',
    description: 'TCS is India’s premier multinational information technology and business consulting firm under the Tata Group. It delivers IT services, banking software (TCS BaNCS), cloud computing, AI, cognitive business operations, and cybersecurity to top global banks, retail giants, and airlines.',
    aboutCulture: 'Strong job stability, Tata ethical governance, extensive upskilling platforms (TCS Elevate, Wings 1/2), campus-like delivery centres, pan-India posting options, and transparent career advancement hierarchies.',
    website: 'https://www.tcs.com',
    careersUrl: 'https://www.tcs.com/careers',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. / M.Tech / MCA / MSc / BCA / BSc in any academic discipline. Minimum 60% or 6.0 CGPA across 10th, 12th/Diploma, and Degree. Maximum 1 active backlog permitted during assessment.',
      acceptedStreams: ['B.Tech (All Engineering Branches: CSE, ECE, EEE, Mech, Civil, Chem, Biotech)', 'Polytechnic Diploma holders (via TCS Smart Hiring)', 'BSc / BCA (TCS Ignite / Smart Hiring)', 'Intermediate + ITI for support functions'],
      standardSelectionProcess: [
        'National Qualifier Test (TCS NQT) - Foundation Section (Numerical, Verbal, Reasoning)',
        'Advanced Section (Advanced Quantitative & 2 Coding Questions in C/Java/Python)',
        'Technical & Managerial Interview (Project discussion, Core Subject basics)',
        'HR Interview (Relocation, shifts, Tata Code of Conduct)'
      ],
      fresherHiringPrograms: [
        'TCS Ninja (Entry Tier: ₹3.36 - 3.6 LPA)',
        'TCS Digital (Elite Tier: ₹7.0 - 7.5 LPA)',
        'TCS Prime / Innovator (R&D & High-Tech Tier: ₹9.0 - 11.5 LPA)',
        'TCS Smart Hiring & Ignite (for BCA / BSc / Diploma graduates)'
      ],
      internshipOpportunities: 'TCS Remote Internships & academic project partnerships for pre-final year students.'
    },
    salaryOverview: {
      fresherMedian: '₹3.60 LPA (Ninja) | ₹7.20 LPA (Digital) | ₹9.50 LPA (Prime)',
      range: '₹3.36 LPA - ₹12 LPA for freshers to 3 years experienced',
      benefits: ['Medical insurance for employee and dependents', 'Performance incentive bonuses via TCS Wings exams', 'Tata Group discounts (Tata Motors, Croma, Taj, Air India)', 'Gratuity and superannuation pension benefits', 'Higher education support (M.Tech via BITS Pilani / SASTRA)']
    },
    keyHighlights: [
      'Massive campus recruitment across tier 1, tier 2, and tier 3 colleges',
      'Accelerated promotion pipeline to double your salary via Wings 1 exams within 1 year',
      'Opportunities for onsite client deployment to USA, UK, Europe, Japan, and Singapore',
      'Job security backed by the legendary Tata Group ethical standard'
    ],
    roles: [
      {
        id: 'tcs-prime',
        title: 'Software Developer (TCS Prime / Innovator)',
        department: 'TCS Research & Innovation / Cloud Platforms / AI & Analytics',
        targetEligibility: ['B.Tech CSE/IT/ECE/Data Science', 'M.Tech CSE'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹9.0 - 11.5 LPA CTC',
        description: 'Work on cutting-edge research prototypes, AI/ML models, enterprise cloud modernizations, and patented industrial solutions.',
        keyResponsibilities: [
          'Develop full-stack web and cloud microservices in Spring Boot, React, and Python',
          'Implement machine learning algorithms for predictive maintenance and fraud analytics',
          'Write high-performance backend modules adhering to secure coding standards',
          'Participate in enterprise architecture hackathons and patent filing'
        ],
        requiredSkills: ['Data Structures & Algorithms', 'Python / Java / C++', 'Cloud Basics (AWS/Azure/GCP)', 'Machine Learning / GenAI concepts', 'REST APIs & Microservices'],
        hiringStages: ['TCS NQT Advanced Score > 85%', 'Advanced Coding Round', 'Technical Deep-Dive Interview', 'MR & HR']
      },
      {
        id: 'tcs-digital',
        title: 'Systems Engineer (TCS Digital)',
        department: 'Digital Transformation / Banking & Financial Services (BFSI) / Retail',
        targetEligibility: ['B.Tech (All Branches)', 'MCA', 'M.Tech'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹7.0 - 7.5 LPA CTC',
        description: 'Build enterprise digital applications, mobile banking interfaces, and automated cloud pipelines for global Fortune 500 clients.',
        keyResponsibilities: [
          'Develop frontend and backend modules using Java, Node.js, Angular/React',
          'Write database stored procedures and optimize SQL queries in PostgreSQL/Oracle',
          'Configure CI/CD pipelines using Jenkins and Docker',
          'Collaborate directly with global clients during Agile sprint ceremonies'
        ],
        requiredSkills: ['Java / C# / Python', 'DBMS & SQL', 'Web Technologies (HTML5/CSS/JavaScript)', 'Object-Oriented Programming (OOP)', 'Git Version Control'],
        hiringStages: ['TCS NQT Digital Cutoff', 'Technical Interview (Core Java, DBMS, Projects)', 'Managerial & HR Round']
      },
      {
        id: 'tcs-ninja',
        title: 'Assistant System Engineer Trainee (TCS Ninja)',
        department: 'IT Infrastructure / Application Maintenance / Quality Engineering',
        targetEligibility: ['B.Tech (All Branches)', 'MCA', 'BSc/BCA', 'Diploma via Smart Hiring'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹3.36 - 3.60 LPA CTC',
        description: 'Support enterprise application lifecycle, monitor server infrastructure, write automation scripts, and test software modules.',
        keyResponsibilities: [
          'Perform manual and automated testing using Selenium and Postman',
          'Monitor production application health and resolve level-2 support tickets',
          'Execute database data verification scripts and batch jobs',
          'Upskill through the TCS Xplore training curriculum during onboarding'
        ],
        requiredSkills: ['Basic Programming (C/Java/Python)', 'SQL queries', 'Operating System basics', 'Good Communication & Problem Solving', 'Manual Testing fundamentals'],
        hiringStages: ['TCS NQT Foundation Test', 'Unified Technical + HR Interview']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'tcs-fb-1',
        authorName: 'Ravi Teja Goud',
        authorRole: 'Digital Specialist Engineer @ TCS',
        authorAvatar: 'ravi',
        collegeOrBatch: 'Osmania University (B.Tech ECE \'22)',
        rating: 4.5,
        workLifeBalanceRating: 4.6,
        careerGrowthRating: 4.3,
        feedbackText: 'I cleared TCS NQT and was offered the Digital cadre. TCS gives immense opportunities to switch domains—I was placed in the BFSI unit and learned full-stack Java development. With Wings 1 exams, I boosted my annual incentives significantly in year 1.',
        interviewExperience: 'Ensure your final year project is crystal clear—they grilled me on the architecture, database schema, and my exact individual contribution.',
        adviceForFreshers: 'Practice standard NQT aptitude topics (Time & Work, Profit/Loss, Syllogisms) and master basic DSA like strings, matrices, and recursion.',
        likes: 38,
        timestamp: '1 month ago',
        isVerifiedAlumni: true
      },
      {
        id: 'tcs-fb-2',
        authorName: 'Pooja Deshmukh',
        authorRole: 'System Engineer @ TCS Pune',
        authorAvatar: 'pooja',
        collegeOrBatch: 'Government Polytechnic Pune (Diploma) + B.Tech Lateral Entry',
        rating: 4.2,
        workLifeBalanceRating: 4.5,
        careerGrowthRating: 4.0,
        feedbackText: 'TCS is extremely welcoming to diploma lateral entry students. The initial ILP (Initial Learning Program) training in Trivandrum or Chennai is like a second college experience with amazing labs and friendly instructors.',
        interviewExperience: 'They asked basic C program outputs, pointers, loops, and differences between primary key and foreign key in SQL.',
        adviceForFreshers: 'Be confident and fluent in your self-introduction. Tata interviewers value honesty, discipline, and willingness to learn new technologies.',
        likes: 24,
        timestamp: '2 months ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'infosys',
    name: 'Infosys',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
    brandColor: '#007CC3',
    tagline: 'Navigate your next. Human-centric digital transformation for global enterprises.',
    industry: 'IT Services & Consulting',
    companyType: 'IT Services MNC',
    headquarters: 'Bengaluru, Karnataka, India (Iconic Mysore Global Training Centre)',
    foundedYear: '1981',
    employeeCount: '320,000+ Worldwide',
    description: 'Infosys is a global leader in next-generation digital services and consulting. It enables clients in more than 56 countries to navigate their digital transformation powered by cloud computing (Infosys Cobalt), AI (Infosys Topaz), enterprise ERP, and financial software (Finacle).',
    aboutCulture: 'World-famous Mysore training campus (the largest corporate university in the world), vibrant tech communities, strong focus on continuous learning (Lex learning portal), and meritocratic reward pipelines.',
    website: 'https://www.infosys.com',
    careersUrl: 'https://www.infosys.com/careers',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. / M.Tech / MCA / MSc / BCA / BSc in any branch with minimum 60% or 6.0 CGPA throughout 10th, 12th, and Degree.',
      acceptedStreams: ['B.Tech (CSE, ECE, EEE, Mechanical, Civil, Chemical, Instrumentation)', 'BSc / BCA (via Infosys Operations Executive)', 'Polytechnic Diploma (via Special Diploma Hiring Drives)', 'MCA & MSc Computer Science'],
      standardSelectionProcess: [
        'Infosys Online Placement Test (Mathematical Ability, Reasoning, Verbal, Pseudocode, Puzzle Solving)',
        'HackWithInfy / InfyTQ Certification for Elite Roles (Competitive Coding in Java/Python)',
        'Technical Interview (OOPs concepts, DBMS, Project, Data Structures)',
        'HR Interview (Communication skills, location preferences)'
      ],
      fresherHiringPrograms: [
        'Specialist Programmer (SP: ₹9.5 - 11.0 LPA)',
        'Digital Specialist Engineer (DSE: ₹6.25 - 6.5 LPA)',
        'Systems Engineer (SE: ₹3.6 - 4.0 LPA)',
        'Operations Executive (for BSc / BCA: ₹2.22 - 2.8 LPA)'
      ],
      internshipOpportunities: 'Infosys InStep Internship Program (rated world’s #1 corporate internship program for international and domestic students).'
    },
    salaryOverview: {
      fresherMedian: '₹3.60 LPA (SE) | ₹6.25 LPA (DSE) | ₹9.50 LPA (SP)',
      range: '₹3.6 LPA - ₹11.0 LPA for university graduates',
      benefits: ['Free accommodation & world-class sports facilities during Mysore training', 'Health & term life insurance', 'Subsidized transport and food courts across all development centres', 'Lex learning bonuses and certifications sponsorships']
    },
    keyHighlights: [
      'Legendary Mysore training program known globally for exceptional curriculum quality',
      'Direct entry to high-paying Specialist Programmer roles through HackWithInfy competition',
      'Finacle banking platform powers top central banks across 100+ nations',
      'Flexible internal redeployment and certifications reward structure'
    ],
    roles: [
      {
        id: 'infy-sp',
        title: 'Specialist Programmer (SP)',
        department: 'Infosys Topaz (AI) / Cloud Modernization / Advanced Engineering',
        targetEligibility: ['B.Tech CSE/IT/ECE', 'M.Tech CSE', 'MCA'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹9.5 - 11.0 LPA CTC',
        description: 'Architect and develop high-complexity algorithmic engines, AI pipelines, and distributed cloud applications for global Fortune 50 clients.',
        keyResponsibilities: [
          'Develop high-performance microservices in Python, Java, or Node.js',
          'Deploy Generative AI and Machine Learning models into enterprise systems',
          'Optimize database queries and cache layers (Redis, ElasticSearch)',
          'Lead technical prototyping and hackathons'
        ],
        requiredSkills: ['Advanced Data Structures & Algorithms', 'Dynamic Programming', 'Graph Theory', 'Python / Java / C++', 'Object Oriented Design'],
        hiringStages: ['HackWithInfy Coding Rounds', 'Technical Architect Interview', 'HR Interview']
      },
      {
        id: 'infy-dse',
        title: 'Digital Specialist Engineer (DSE)',
        department: 'Cloud, Big Data, Full Stack & Cybersecurity Units',
        targetEligibility: ['B.Tech (All Engineering Streams)', 'MCA'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹6.25 - 6.50 LPA CTC',
        description: 'Build enterprise web applications, full-stack microservices, and automated DevOps cloud pipelines.',
        keyResponsibilities: [
          'Build responsive web interfaces in React/Angular and backend services in Spring Boot/Django',
          'Write database models and queries in PostgreSQL/MySQL/MongoDB',
          'Automate deployment pipelines using Git, Docker, and AWS/Azure',
          'Participate in sprint planning and client code reviews'
        ],
        requiredSkills: ['Full Stack Development (Java/Python/JS)', 'DBMS & SQL', 'Data Structures basics', 'REST APIs', 'Cloud Fundamentals'],
        hiringStages: ['InfyTQ / HackWithInfy Tier 2', 'Technical Interview', 'HR Round']
      },
      {
        id: 'infy-se',
        title: 'Systems Engineer (SE)',
        department: 'Enterprise Application Services / Quality Engineering / Cloud Support',
        targetEligibility: ['B.Tech (All Branches)', 'MCA', 'MSc'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹3.60 - 4.0 LPA CTC',
        description: 'Undergo 3-4 months of intensive Mysore training in software engineering, and deploy into client delivery projects worldwide.',
        keyResponsibilities: [
          'Complete hands-on Java/Python/Cloud training modules and assessments at Mysore',
          'Write modular software code and automated test scripts',
          'Support legacy modernization and cloud migration workflows',
          'Collaborate with project leads on client delivery deliverables'
        ],
        requiredSkills: ['Problem Solving & Analytical Thinking', 'Basic C/Java/Python', 'SQL & Relational Databases', 'Good English Communication'],
        hiringStages: ['Infosys Online Assessment', 'Technical + HR Interview']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'infy-fb-1',
        authorName: 'Siddharth Varma',
        authorRole: 'Specialist Programmer @ Infosys Topaz',
        authorAvatar: 'siddharth',
        collegeOrBatch: 'CBIT Hyderabad (B.Tech CSE \'22)',
        rating: 4.6,
        workLifeBalanceRating: 4.4,
        careerGrowthRating: 4.8,
        feedbackText: 'Cracked the Specialist Programmer role through HackWithInfy. The compensation is great for a fresher, and you get allocated to core innovation teams rather than routine support projects. The Mysore campus training is an unforgettable experience with world-class facilities.',
        interviewExperience: 'During HackWithInfy, speed and edge-case handling in competitive programming are essential. In the interview, I was asked to implement a Trie and explain the Knapsack problem with memoization.',
        adviceForFreshers: 'Participate actively in HackWithInfy and InfyTQ certifications starting from your 3rd year. It bypasses the standard aptitude rounds entirely.',
        likes: 34,
        timestamp: '3 weeks ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon (AWS)',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    brandColor: '#FF9900',
    tagline: 'Work hard. Have fun. Make history. Earth’s most customer-centric company.',
    industry: 'Tech & Product',
    companyType: 'Product MNC',
    headquarters: 'Seattle, Washington, USA (India hubs: Hyderabad - Amazon’s largest global campus, Bengaluru, Chennai, Gurugram, Pune)',
    foundedYear: '1994',
    employeeCount: '1,500,000+ Worldwide',
    description: 'Amazon is a global technology powerhouse dominating e-commerce, cloud infrastructure (Amazon Web Services - AWS), digital streaming (Prime Video), smart devices (Alexa, Kindle), and automated robotics fulfillment logistics.',
    aboutCulture: 'Deeply driven by the famous 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action, Dive Deep, Invent and Simplify). High accountability, fast-paced delivery, and data-driven meritocracy.',
    website: 'https://www.aboutamazon.in',
    careersUrl: 'https://www.amazon.jobs',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. / M.Tech / MCA in Computer Science, Information Technology, Electronics, or related fields. Minimum 6.5 CGPA or 65% aggregate.',
      acceptedStreams: ['B.Tech CSE / IT / AI / Data Science', 'B.Tech ECE / EEE', 'M.Tech CSE / Software Engineering', 'MCA / MSc IT'],
      standardSelectionProcess: [
        'Amazon Online Assessment (OA) on HackerRank (2 Coding Questions + Work Styles Assessment)',
        'Technical Interview 1 (Data Structures, Algorithms, Time Complexity)',
        'Technical Interview 2 (Advanced Data Structures, Problem Solving, Space Complexity)',
        'Bar Raiser Round (High-Level Problem Solving + Rigorous Leadership Principles Evaluation)'
      ],
      fresherHiringPrograms: [
        'Amazon WOW (Women in Technology Internship and Full-Time Hiring)',
        'Amazon ML Summer School (Machine Learning & AI training for students)',
        'Amazon Future Engineer Program',
        'Campus Placement Drives across Tier 1 & Tier 2 institutions'
      ],
      internshipOpportunities: '6-month and 2-month SDE Internships with monthly stipend of ₹80,000 - ₹1,10,000/month + relocation benefits.'
    },
    salaryOverview: {
      fresherMedian: '₹28,00,000 - ₹44,00,000 CTC (Base: ₹15.5-18 LPA + First & Second Year Signing Bonuses + RSUs)',
      range: '₹25 LPA - ₹60+ LPA across SDE 1 to SDE 2',
      benefits: ['Medical insurance covering employee, spouse, children, and parents', 'Amazon Restricted Stock Units (RSUs)', 'Cab reimbursement and night shift allowances', 'Employee discount on Amazon retail platform', 'Relocation allowance and temporary corporate housing']
    },
    keyHighlights: [
      'Huge career springboard—Amazon engineering experience is respected globally',
      'Work on AWS cloud systems powering a massive portion of the global internet',
      'The 16 Leadership Principles provide a clear framework for high-impact decision making',
      'State-of-the-art global headquarters in Hyderabad with world-class facilities'
    ],
    roles: [
      {
        id: 'amazon-sde1',
        title: 'Software Development Engineer I (SDE 1)',
        department: 'Amazon Web Services (AWS) / Retail Systems / Prime / Alexa / Payments',
        targetEligibility: ['B.Tech CSE/IT/ECE', 'M.Tech CSE', 'MCA'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹30 - 45 LPA CTC',
        description: 'Build hyper-scalable distributed services, database engines, payment gateways, and cloud microservices processing millions of transactions per second.',
        keyResponsibilities: [
          'Design, write, and deploy production software in Java, C++, Python, or Rust',
          'Build fault-tolerant, low-latency microservices on AWS (Lambda, DynamoDB, ECS, SQS)',
          'Participate in on-call operational support and resolve high-severity production tickets',
          'Write comprehensive unit, integration, and stress test suites'
        ],
        requiredSkills: ['Data Structures & Algorithms', 'Java / C++ / Python', 'Object Oriented Programming', 'Operating Systems & Concurrency', 'Database Design (SQL/NoSQL)'],
        hiringStages: ['Online Assessment (Coding + Behavioral)', 'Technical Round 1', 'Technical Round 2', 'Bar Raiser Round']
      },
      {
        id: 'amazon-csa',
        title: 'Cloud Support Associate (AWS)',
        department: 'AWS Premium Support (Compute, Storage, Big Data, Networking)',
        targetEligibility: ['B.Tech (All Branches)', 'BCA/MCA', 'BSc CS'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹14 - 20 LPA CTC',
        description: 'Provide tier-3 architectural debugging, troubleshooting, and configuration support for enterprise AWS cloud customers.',
        keyResponsibilities: [
          'Debug complex cloud infrastructure issues on EC2, S3, RDS, CloudFront, and IAM',
          'Analyze network packet captures, DNS resolutions, and TLS handshakes',
          'Write Python and Bash scripts to automate diagnostics and resource cleanup',
          'Publish technical troubleshooting articles on AWS Knowledge Center'
        ],
        requiredSkills: ['Linux/Unix System Administration', 'Networking (TCP/IP, Routing, DNS)', 'AWS Cloud Core Services', 'Python / Bash Scripting', 'Troubleshooting Mindset'],
        hiringStages: ['Online MCQ & Coding', 'OS & Networking Deep Dive', 'Scenario-based Debugging Round', 'Bar Raiser / LP Round']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'amz-fb-1',
        authorName: 'Manish Verma',
        authorRole: 'SDE 1 @ AWS DynamoDB',
        authorAvatar: 'manish',
        collegeOrBatch: 'VNIT Nagpur (B.Tech CSE \'23)',
        rating: 4.8,
        workLifeBalanceRating: 4.0,
        careerGrowthRating: 5,
        feedbackText: 'Amazon is an incredible place for engineers who love high-scale architecture and ownership. You do not just write code; you deploy it to production and monitor its telemetry. The Bar Raiser round is genuine—they test whether you truly represent their Leadership Principles.',
        interviewExperience: 'Prepare standard DSA on LeetCode (Trees, Graphs, Heaps, Sliding Window, DP). For the behavioral questions, prepare 5-6 real stories using the STAR format (Situation, Task, Action, Result) mapped to Leadership Principles.',
        adviceForFreshers: 'Customer Obsession and Ownership are not just buzzwords. In your behavioral answers, focus on what YOU did, how you measured the metric, and what lessons you learned.',
        likes: 52,
        timestamp: '2 weeks ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'tata-motors',
    name: 'Tata Motors',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg',
    brandColor: '#00539B',
    tagline: 'Connecting aspirations. Pioneering India’s electric vehicle revolution and commercial engineering.',
    industry: 'Automotive & Core Engineering',
    companyType: 'Automotive Leader',
    headquarters: 'Mumbai, Maharashtra, India (R&D & Plants: Pune, Jamshedpur, Sanand, Lucknow, Pantnagar, Dharwad)',
    foundedYear: '1945',
    employeeCount: '78,000+ Worldwide (including Jaguar Land Rover)',
    description: 'Tata Motors is India’s undisputed automotive leader in passenger electric vehicles (Nexon EV, Punch EV, Curvv) and commercial heavy transport. A $44 billion organization, it pioneers zero-emission mobility, battery pack engineering, autonomous vehicle telemetry, and defense combat vehicles.',
    aboutCulture: 'High pride in building India’s indigenous engineering marvels, rigorous safety protocols, world-class testing tracks at Pune, strong shop-floor mentorship, and progressive gender-diversity initiatives in manufacturing.',
    website: 'https://www.tatamotors.com',
    careersUrl: 'https://www.tatamotors.com/careers',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. / Polytechnic Diploma in Mechanical, Automobile, Electrical, Electronics, Mechatronics, or Production Engineering. Minimum 60% aggregate with no standing backlogs.',
      acceptedStreams: [
        'B.Tech Mechanical / Automobile / Production',
        'B.Tech Electrical & Electronics / Mechatronics',
        'Polytechnic Diploma in Mechanical / Automobile / Electrical (Diploma Engineer Trainee)',
        'ITI in Fitter, Turner, Electrician, Machinist (via Apprentice Training School)'
      ],
      standardSelectionProcess: [
        'National Level Aptitude & Domain Engineering Assessment (Mechanical/Electrical core subjects)',
        'Group Discussion (GD) or Technical Presentation on Automotive / EV trends',
        'Technical Interview with Senior Plant & R&D Chiefs',
        'HR & Medical Fitness Verification'
      ],
      fresherHiringPrograms: [
        'Graduate Engineer Trainee (GET: ₹6.5 - 8.5 LPA)',
        'Diploma Engineer Trainee (DET: ₹3.2 - 4.2 LPA)',
        'Post Graduate Engineer Trainee (PGET for M.Tech: ₹8.5 - 11 LPA)',
        'Tata Motors Kaushalya Apprenticeship (for 10th/12th/ITI candidates)'
      ],
      internshipOpportunities: 'Summer internships for core mechanical and electrical engineering students at Pune and Sanand R&D facilities.'
    },
    salaryOverview: {
      fresherMedian: '₹7.0 LPA (GET) | ₹3.6 LPA (DET)',
      range: '₹3.5 LPA - ₹12 LPA for core engineering talent',
      benefits: ['Subsidized company leased car / EV purchase discounts', 'Comprehensive medical cover for entire family', 'Plant township accommodation / subsidized quarters', 'Tata employee discounts across retail and hospitality', 'Pension, gratuity, and generous leave encashment']
    },
    keyHighlights: [
      'Market leader with >70% market share in India’s Passenger Electric Vehicles (EV)',
      'Hands-on engineering on live assembly lines, wind tunnels, and crash test facilities',
      'Strong hiring pathways for Polytechnic Diploma and ITI candidates alongside B.Techs',
      'Pioneer in hydrogen fuel cell, hybrid powertrains, and autonomous driving telemetry'
    ],
    roles: [
      {
        id: 'tm-get',
        title: 'Graduate Engineer Trainee (GET - EV & Powertrain)',
        department: 'Electric Vehicle R&D / Powertrain Design / Vehicle Integration',
        targetEligibility: ['B.Tech Mechanical', 'B.Tech Electrical / EEE', 'B.Tech Mechatronics / Automobile'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹6.5 - 8.5 LPA CTC',
        description: 'Design, simulate, and validate electric powertrain modules, battery thermal management systems, and vehicle chassis components.',
        keyResponsibilities: [
          'Perform 3D CAD modeling and FEA simulation in CATIA and ANSYS',
          'Test battery management system (BMS) telemetry and motor controller inverters',
          'Conduct vehicle crash test simulations and homologation checks under ARAI norms',
          'Optimize assembly line manufacturing cycle time and component fitment'
        ],
        requiredSkills: ['Thermodynamics & IC Engines / EV Powertrains', 'CAD / CATIA / SolidWorks', 'FEA / ANSYS simulation', 'MATLAB / Simulink', 'Manufacturing Processes & Materials'],
        hiringStages: ['Domain Engineering Online Test', 'Technical Presentation Round', 'Technical Interview', 'HR Round']
      },
      {
        id: 'tm-det',
        title: 'Diploma Engineer Trainee (DET - Production & Quality)',
        department: 'Manufacturing Operations / Body-in-White (BIW) / Quality Assurance',
        targetEligibility: ['Polytechnic Diploma in Mechanical / Automobile / Electrical'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹3.2 - 4.2 LPA CTC',
        description: 'Supervise automated robotic weld lines, vehicle paint shops, final assembly testing, and quality audit inspections.',
        keyResponsibilities: [
          'Monitor robotic spot welding lines and programmable logic controllers (PLC)',
          'Conduct quality gate audits using Coordinate Measuring Machines (CMM) and micrometers',
          'Implement Kaizen, 5S, and Lean Manufacturing standards on the plant shop-floor',
          'Troubleshoot pneumatic and hydraulic line breakdowns alongside senior technicians'
        ],
        requiredSkills: ['Engineering Drawing reading', 'Quality Tools (7 QC Tools, SPC, FMEA)', 'PLC & Industrial Automation basics', 'Hands-on Mechanical aptitude', 'Safety & 5S compliance'],
        hiringStages: ['Diploma Technical MCQ', 'Plant Supervisor Interview', 'Medical Fitness Round']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'tm-fb-1',
        authorName: 'Vikas Patil',
        authorRole: 'Senior Design Engineer @ Tata Motors EV Division',
        authorAvatar: 'vikas',
        collegeOrBatch: 'COEP Technological University Pune (B.Tech Mechanical \'21)',
        rating: 4.8,
        workLifeBalanceRating: 4.2,
        careerGrowthRating: 4.9,
        feedbackText: 'If you are passionate about core mechanical and electrical engineering, Tata Motors is the holy grail in India. Working on the Nexon EV battery pack design taught me more real engineering in 2 years than 4 years of college textbooks. The Pune plant test track is world-class.',
        interviewExperience: 'Revise SOM (Strength of Materials), Thermodynamics, Machine Design, and basics of EV battery chemistry (LFP vs NMC cells). They asked me to draw the Shear Force Diagram (SFD) for an overhanging beam.',
        adviceForFreshers: 'Build solid hands-on experience in SAE BAJA, Formula Student, or electric vehicle collegiate competitions. It is the #1 thing Tata Motors recruiters look for.',
        likes: 41,
        timestamp: '1 month ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'lnt',
    name: 'Larsen & Toubro (L&T)',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/L%26T.png',
    brandColor: '#004B87',
    tagline: 'It’s all about Imagineering. Engineering the nation’s infrastructure and technology frontiers.',
    industry: 'Automotive & Core Engineering',
    companyType: 'Core Engineering Giant',
    headquarters: 'Mumbai, Maharashtra, India (Projects across 50+ countries: India, Middle East, Southeast Asia)',
    foundedYear: '1938',
    employeeCount: '55,000+ Core / 250,000+ Group Worldwide',
    description: 'Larsen & Toubro is a $27 billion multinational conglomerate recognized globally for engineering, procurement, and construction (EPC) mega-infrastructure (high-speed bullet train corridors, nuclear reactors, metro systems, underwater tunnels), heavy manufacturing, defense, and power grids.',
    aboutCulture: 'Unrivalled execution discipline, high safety culture, merit-driven leadership promotion pipelines, prestigious L&T Institute of Project Management (IPM), and rich nation-building heritage.',
    website: 'https://www.larsentoubro.com',
    careersUrl: 'https://www.larsentoubro.com/corporate/careers',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. in Civil, Mechanical, Electrical, Instrumentation, or Chemical Engineering with minimum 65% or 6.75 CGPA without active backlogs.',
      acceptedStreams: [
        'B.Tech Civil Engineering (L&T Construction)',
        'B.Tech Mechanical / Production Engineering (L&T Heavy Engineering)',
        'B.Tech Electrical & Electronics / Power Systems',
        'Polytechnic Diploma in Civil, Mechanical, Electrical (via DET drives)',
        'ITI in Surveying, Draftsman, Welding for site supervisory cadre'
      ],
      standardSelectionProcess: [
        'L&T National Engineering Aptitude & Technical Test (NEAT / Core Subject exam)',
        'Group Discussion (Extempore or Infrastructure Case Study)',
        'Technical Interview by Chief Project Managers & Lead Engineers',
        'HR & Rigorous Occupational Medical Examination'
      ],
      fresherHiringPrograms: [
        'Graduate Engineer Trainee (GET: ₹6.0 - 7.5 LPA)',
        'Diploma Engineer Trainee (DET: ₹3.0 - 3.8 LPA)',
        'Post Graduate Trainee / Build India Scholarship (M.Tech at IIT Madras / NIT Trichy sponsored 100% by L&T with stipend)'
      ],
      internshipOpportunities: 'L&T Summer Internships across signature mega-infrastructure project sites (Metros, Bridges, Expressways, Ports).'
    },
    salaryOverview: {
      fresherMedian: '₹6.50 LPA (GET) | ₹3.50 LPA (DET)',
      range: '₹3.5 LPA - ₹10 LPA for campus recruits',
      benefits: ['Free bachelor accommodation and site mess food at project sites', 'Site hardship and remote project allowances (up to 25% of basic pay)', 'Full M.Tech sponsorship at IITs via Build India Scholarship', 'Comprehensive group medical & accident insurance', 'Tata/L&T executive pension & gratuity']
    },
    keyHighlights: [
      'Build India Scholarship (BIS): 100% free M.Tech at IIT Madras / NIT Surathkal with guaranteed L&T employment',
      'Build iconic monuments and mega-projects (Statue of Unity, Mumbai Trans Harbour Link, Bullet Train)',
      'High demand for Civil, Mechanical, and Electrical diploma & degree engineers',
      'Direct opportunities for international deployment across Middle East (UAE, Saudi Arabia, Qatar, Oman)'
    ],
    roles: [
      {
        id: 'lnt-civil-get',
        title: 'Graduate Engineer Trainee (GET - Civil Construction)',
        department: 'Heavy Civil Infrastructure / Transportation / Buildings & Factories',
        targetEligibility: ['B.Tech Civil Engineering'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹6.0 - 7.5 LPA CTC + Site Allowances',
        description: 'Oversee structural execution, concrete mix design, reinforcement quality, bar bending schedules, and project planning for bridges, tunnels, and metro viaducts.',
        keyResponsibilities: [
          'Interpret structural drawings, AutoCAD blueprints, and BIM 3D models',
          'Supervise concrete pouring, shuttering, post-tensioning, and piling operations',
          'Calculate daily material reconciliation and contractor measurement billings',
          'Enforce strict zero-harm safety standards and environmental site compliances'
        ],
        requiredSkills: ['Structural Analysis & RCC Design', 'Surveying (Total Station, GPS)', 'AutoCAD & Primavera / MS Project', 'Concrete Technology & Soil Mechanics', 'Site Leadership & Communication'],
        hiringStages: ['Civil Engineering Technical Test', 'Group Discussion', 'Technical Interview', 'HR & Medical']
      },
      {
        id: 'lnt-mech-get',
        title: 'Graduate Engineer Trainee (GET - Mechanical & Heavy Engineering)',
        department: 'Power & Heavy Engineering / Hydrocarbon / Defense Equipment',
        targetEligibility: ['B.Tech Mechanical / Production'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹6.2 - 7.6 LPA CTC',
        description: 'Manage erection of heavy industrial boilers, gas turbines, piping networks, cryogenic pressure vessels, and defense combat equipment.',
        keyResponsibilities: [
          'Supervise precision alignment of rotating machinery (turbines, generators, compressors)',
          'Perform non-destructive testing (NDT: Ultrasonic, Radiography, Magnetic Particle)',
          'Manage plant piping isometric drawings and hydrostatic pressure testing',
          'Coordinate heavy crane lifting plans and rigging safety protocols'
        ],
        requiredSkills: ['Fluid Mechanics & Turbo Machinery', 'Welding Technology & Metallurgy', 'NDT Standards (ASME codes)', 'Piping & Instrumentation Diagrams (P&ID)', 'Safety Regulations'],
        hiringStages: ['Technical Assessment', 'Panel Interview', 'HR Round']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'lnt-fb-1',
        authorName: 'Aniket Kulkarni',
        authorRole: 'Assistant Construction Manager @ L&T Heavy Civil',
        authorAvatar: 'aniket',
        collegeOrBatch: 'VJTI Mumbai (B.Tech Civil \'21)',
        rating: 4.7,
        workLifeBalanceRating: 3.8,
        careerGrowthRating: 5,
        feedbackText: 'L&T is the undisputed king of civil and infrastructure engineering. If you work on a mega-bridge or high-speed rail project, your technical confidence sky-rockets. Site life is demanding, but the learning curve is 10x faster than any office job.',
        interviewExperience: 'Prepare basics of concrete grades (M25, M40, M60), slump test, water-cement ratio, shear reinforcement, and standard surveying calculations.',
        adviceForFreshers: 'Apply for the L&T Build India Scholarship (BIS) in your final year. If selected, L&T pays your entire M.Tech fee at IIT Madras/NIT Trichy, pays you a monthly stipend of ₹13,400, and absorbs you as Senior Engineer directly!',
        likes: 47,
        timestamp: '1 month ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'isro',
    name: 'ISRO (Indian Space Research Organisation)',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg',
    brandColor: '#F47920',
    tagline: 'Space technology in the service of humankind. Pride of the nation.',
    industry: 'Aerospace & Defence / PSU',
    companyType: 'Government / PSU',
    headquarters: 'Bengaluru, Karnataka, India (Major Centres: VSSC Thiruvananthapuram, SDSC Sriharikota, SAC Ahmedabad, URSC Bengaluru, LPSC Valiamala)',
    foundedYear: '1969',
    employeeCount: '17,000+ Scientists & Technicians',
    description: 'ISRO is the premier space exploration agency of the Government of India. Operating under the Department of Space, ISRO has earned global acclaim for historic interplanetary missions including Chandrayaan-3 (first nation to soft-land near Moon’s south pole), Aditya-L1 (Solar mission), Mars Orbiter Mission (Mangalyaan), PSLV/LVM3 launch vehicles, and the upcoming Gaganyaan human spaceflight mission.',
    aboutCulture: 'Highest scientific prestige, immense national pride, zero-defect engineering culture, rigorous peer review, research publication encouragement, serene residential space townships, and full central government gazetted officer perks.',
    website: 'https://www.isro.gov.in',
    careersUrl: 'https://www.isro.gov.in/Careers.html',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. in Mechanical, ECE, CSE, Electrical, Aerospace with minimum 65% or 6.84 CGPA. Direct entry via ICRB exam or GATE score. Polytechnic Diploma holders enter via Technical Assistant recruitment. ITI certificate holders enter via Technician \'B\' exam.',
      acceptedStreams: [
        'B.Tech Mechanical / Aerospace / Thermal Engineering',
        'B.Tech Electronics & Communication (ECE) / Avionics',
        'B.Tech Computer Science / Information Technology',
        'B.Tech Electrical & Electronics (EEE)',
        'Polytechnic Diploma in Mechanical / ECE / Civil / Photography (Technical Assistant)',
        'ITI in Fitter, Machinist, Electronic Mechanic, Turner (Technician B)'
      ],
      standardSelectionProcess: [
        'ISRO Centralised Recruitment Board (ICRB) Written Exam (80 questions on core engineering discipline, +3 for correct, -0.75 for incorrect)',
        'Direct Technical Interview by a panel of 5-8 Senior ISRO Scientists and Mission Directors (Interview carries 100% weightage for final merit list)',
        'Document verification & Gazetted Officer Medical Fitness certification'
      ],
      fresherHiringPrograms: [
        'Scientist / Engineer \'SC\' (Group \'A\' Gazetted Officer - Level 10 Pay Matrix: ₹56,100 Basic + DA + HRA ~ ₹90,000 - ₹1,05,000/month)',
        'Technical Assistant (Group \'B\' Non-Gazetted - Level 7 Pay Matrix for Diploma holders: ~ ₹55,000 - ₹65,000/month)',
        'Technician \'B\' / Draughtsman \'B\' (Level 3 Pay Matrix for ITI holders: ~ ₹30,000 - ₹38,000/month)',
        'IIST Thiruvananthapuram Direct Absorption (B.Tech students from IIST with >7.5 CGPA get directly appointed as ISRO Scientists)'
      ],
      internshipOpportunities: 'ISRO Student Project Trainee programs (B.Tech/M.Tech final year thesis projects) at VSSC, URSC, and SAC.'
    },
    salaryOverview: {
      fresherMedian: '₹12.50 - 14.50 LPA (CTC equivalent for Scientist/Engineer \'SC\') | ₹7.5 LPA for Technical Assistant',
      range: '₹4.5 LPA (Technician ITI) - ₹15+ LPA (Scientist SC) + Govt pension & residential quarters',
      benefits: ['Free or highly subsidized central government housing in space townships', 'Free medical treatment under CHSS (Contributory Health Service Scheme) at top hospitals', 'Transport / vehicle allowance or dedicated department bus fleet', 'LTC (Leave Travel Concession) for air travel across India for family', 'Higher qualification incentives (Ph.D. sponsorship at IITs/IISc with full salary)']
    },
    keyHighlights: [
      'Be a part of world-historic space missions (Gaganyaan human spaceflight, Chandrayaan, Shukrayaan)',
      'Government job security with 7th Central Pay Commission perks and gazetted rank',
      'Recruitment open across all academic tiers: B.Tech (Scientist), Polytechnic Diploma (Tech Assistant), and ITI (Technician B)',
      'Direct admission pathway through IIST (Indian Institute of Space Science and Technology) via JEE Advanced'
    ],
    roles: [
      {
        id: 'isro-scientist-sc',
        title: 'Scientist / Engineer \'SC\' (Group A Gazetted)',
        department: 'Propulsion / Avionics / Satellite Structures / Mission Flight Dynamics',
        targetEligibility: ['B.Tech ECE', 'B.Tech Mechanical / Aerospace', 'B.Tech CSE', 'B.Tech EEE'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹12.5 - 14.5 LPA CTC (Level 10 Pay Matrix)',
        description: 'Design rocket stage engines, satellite transponders, guidance control systems, and mission telemetry software for satellite launch vehicles.',
        keyResponsibilities: [
          'Design cryogenic/semi-cryogenic propellant rocket engines or solid rocket boosters',
          'Develop embedded real-time flight control algorithms and fault-tolerant computing boards',
          'Conduct space simulation vacuum and thermal vibration tests on flight payloads',
          'Participate in live countdown launch vehicle operations at Sriharikota spaceport'
        ],
        requiredSkills: ['Deep Core Engineering fundamentals (GATE syllabus level)', 'Control Systems / Signals & Systems (ECE)', 'Thermodynamics / Fluid Mechanics / FEM (Mechanical)', 'Data Structures / C & C++ / RTOS (CSE)', 'Analytical Mathematical modeling'],
        hiringStages: ['ICRB Written Exam (80 Technical Qs)', 'Panel Technical Interview (45-60 mins depth)', 'Document & Medical Verification']
      },
      {
        id: 'isro-tech-assistant',
        title: 'Technical Assistant (Level 7 Pay Matrix)',
        department: 'Rocket Fabrication / Cleanroom Assembly / Payload Testing',
        targetEligibility: ['Polytechnic Diploma in Mechanical / Electronics / Electrical / Computer Science'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹7.0 - 8.5 LPA CTC (Level 7 Pay Matrix)',
        description: 'Execute precision fabrication, PCB surface-mount soldering, electronic testing, and cleanroom integration of space hardware.',
        keyResponsibilities: [
          'Operate high-precision 5-axis CNC machining centers for rocket nozzle components',
          'Perform spectrum analysis, RF testing, and oscilloscopy on satellite transponders',
          'Maintain environmental cleanroom standards (Class 10,000 / Class 100) during satellite integration',
          'Assemble pneumatic and hydraulic pressure systems on launch gantries'
        ],
        requiredSkills: ['Diploma Core Technical Knowledge', 'Electronic Circuit Testing & Multimeter / DSO', 'Machining & Engineering Drawing Reading', 'Precision Measurement instruments', 'Safety & Cleanroom protocols'],
        hiringStages: ['Written Test (Discipline Specific)', 'Skill / Practical Trade Test (Go/No-Go qualifying)', 'Final Merit List']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'isro-fb-1',
        authorName: 'Dr. Rajesh Nair',
        authorRole: 'Scientist/Engineer \'SD\' @ Vikram Sarabhai Space Centre (VSSC)',
        authorAvatar: 'rajesh',
        collegeOrBatch: 'College of Engineering Trivandrum (B.Tech Mechanical \'19) + M.Tech IITB',
        rating: 5,
        workLifeBalanceRating: 4.7,
        careerGrowthRating: 5,
        feedbackText: 'Nothing in the corporate world compares to the feeling of standing in the Mission Control Centre at Sriharikota and watching a rocket you helped build pierce the atmosphere. The work culture among scientists is humble, deeply patriotic, and intellectually stimulating.',
        interviewExperience: 'The ICRB interview does not test memorized formulas; they will give you a chalk and blackboard and ask you to derive equations from fundamental physics principles. Revise standard GATE textbooks.',
        adviceForFreshers: 'Solve previous 10 years of ICRB question papers. Ensure your conceptual basics in Engineering Mathematics and 2nd/3rd year core subjects are bulletproof.',
        likes: 65,
        timestamp: '1 month ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
    brandColor: '#86BC25',
    tagline: 'Making an impact that matters. World’s largest professional services and tech consulting network.',
    industry: 'Finance & Fintech',
    companyType: 'Product MNC',
    headquarters: 'London, UK (Deloitte US-India hubs: Hyderabad - largest facility, Bengaluru, Mumbai, Gurugram, Chennai, Kolkata)',
    foundedYear: '1845',
    employeeCount: '450,000+ Worldwide',
    description: 'Deloitte is the world’s largest "Big 4" professional services network, leading corporate consulting, cloud advisory, cybersecurity, risk management, financial tax audit, artificial intelligence strategy, and enterprise SAP/Salesforce implementations.',
    aboutCulture: 'High-energy consulting atmosphere, world-class training programs (Deloitte University), rapid career ladder (Analyst -> Consultant -> Senior Consultant -> Manager), and rich global client exposure.',
    website: 'https://www.deloitte.com',
    careersUrl: 'https://www2.deloitte.com/in/en/careers.html',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. (all branches), B.Com, BBA, BSc, BCA, MBA, CA, MCA with minimum 60% or 6.5 CGPA throughout academics with no standing backlogs.',
      acceptedStreams: ['B.Tech (CSE, IT, ECE, EEE, Mechanical, Civil)', 'B.Com / BBA / Economics (Financial Advisory)', 'BCA / BSc Computer Science', 'MBA / PGDM (Strategy & Operations)'],
      standardSelectionProcess: [
        'Deloitte Online Assessment on AMCAT / CoCubes (Quantitative Aptitude, Logical Reasoning, Verbal Ability, Computer Fundamentals)',
        'Group Discussion / Case Study Presentation (Analyzing business problem in teams)',
        'Technical & Business Consulting Interview (Project discussion, Tech concepts, Business acumen)',
        'HR / Leadership Fitment Interview'
      ],
      fresherHiringPrograms: [
        'Associate Analyst / Technology Analyst (B.Tech: ₹7.6 - 8.5 LPA)',
        'Cyber Security Associate (₹6.5 - 7.5 LPA)',
        'Tax & Financial Advisory Analyst (B.Com/BBA: ₹4.5 - 5.5 LPA)',
        'Deloitte Collegiate Hackathon & Campus Maverick'
      ],
      internshipOpportunities: 'Summer internships for pre-final year engineering and commerce students with monthly stipends of ₹35,000 - ₹50,000/month.'
    },
    salaryOverview: {
      fresherMedian: '₹7.60 - 8.50 LPA (Tech Consulting) | ₹4.50 - 5.50 LPA (Financial Advisory)',
      range: '₹4.5 LPA - ₹14 LPA across Analyst to Senior Consultant roles',
      benefits: ['Medical insurance covering employee, spouse, children, and parents', 'Annual performance incentive bonuses (10-25% of annual CTC)', 'Work from home wellness and ergonomic equipment reimbursement', 'Sponsorship for professional certifications (AWS, Azure, CISSP, PMP, CFA)', 'Corporate gym memberships and transport services']
    },
    keyHighlights: [
      'Top-brand consulting resume value respected across global tech and finance hubs',
      'Dual pathways for both Engineering (Tech Consulting) and Commerce/Arts (Financial & Risk Advisory)',
      'Direct client-facing consulting role from year one with international deployment opportunities',
      'Fast-track promotion cycle with performance-driven appraisals every 12 months'
    ],
    roles: [
      {
        id: 'deloitte-tech-analyst',
        title: 'Technology Analyst (Cloud & Digital)',
        department: 'Deloitte Digital / Cloud Engineering / Enterprise Technology',
        targetEligibility: ['B.Tech (All Branches)', 'MCA', 'M.Sc CS/IT'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹7.6 - 8.5 LPA CTC',
        description: 'Design and implement cloud microservices, enterprise integrations (Salesforce, SAP, ServiceNow), and custom web architectures for global corporate clients.',
        keyResponsibilities: [
          'Develop full-stack web applications and REST APIs in Java, Python, or JavaScript',
          'Configure cloud infrastructure on AWS/Azure/GCP following security frameworks',
          'Participate in business requirements gathering sessions with international clients',
          'Create technical architecture documentation and automated test test-cases'
        ],
        requiredSkills: ['Object Oriented Programming (Java/Python)', 'SQL & Database Design', 'Cloud Basics (AWS/Azure)', 'Web Technologies (HTML, CSS, JS)', 'Structured Business Problem Solving'],
        hiringStages: ['Aptitude & Coding Assessment', 'Group Discussion / Case Analysis', 'Technical Interview', 'Partner / Leadership Round']
      },
      {
        id: 'deloitte-cyber-analyst',
        title: 'Cyber Security & Risk Advisory Analyst',
        department: 'Risk Advisory / Cyber Threat Intelligence / Identity & Access Management',
        targetEligibility: ['B.Tech (All Branches)', 'BCA', 'BSc IT'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹6.5 - 7.5 LPA CTC',
        description: 'Conduct vulnerability assessments, penetration testing (VAPT), security audit compliance (ISO 27001, SOC 2), and threat mitigation for Fortune 500 banks and healthcare clients.',
        keyResponsibilities: [
          'Perform vulnerability scanning using Nessus, Burp Suite, and Wireshark',
          'Analyze security logs and security operations center (SOC) SIEM alerts',
          'Review cloud infrastructure configurations against CIS security benchmarks',
          'Draft risk assessment executive summaries for corporate boards'
        ],
        requiredSkills: ['Networking & Security Protocols (TCP/IP, SSL/TLS, Firewalls)', 'Linux/Windows OS Security', 'Basic Cryptography & Ethical Hacking', 'Python / Bash Scripting', 'Analytical Reporting'],
        hiringStages: ['Cyber Security & Aptitude Assessment', 'Scenario Case Interview', 'Technical Interview', 'HR Round']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'deloitte-fb-1',
        authorName: 'Snehalatha Rao',
        authorRole: 'Consultant @ Deloitte Digital',
        authorAvatar: 'snehalatha',
        collegeOrBatch: 'Gokaraju Rangaraju Institute of Engineering (B.Tech CSE \'22)',
        rating: 4.7,
        workLifeBalanceRating: 4.1,
        careerGrowthRating: 4.9,
        feedbackText: 'Deloitte grooms you to be both an engineer and a business consultant. The Hyderabad campus at Hitec City is gorgeous. In your very first year, you present sprint demos directly to US clients, which builds incredible professional confidence.',
        interviewExperience: 'During the group case discussion, do not interrupt others. Listen actively, summarize team consensus, and structure your points logically using bullet points.',
        adviceForFreshers: 'Work on your articulation, business communication, and basic cloud/data skills. Deloitte values candidates who can explain complex technical concepts in plain, crisp English.',
        likes: 39,
        timestamp: '3 weeks ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'qualcomm',
    name: 'Qualcomm',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Qualcomm_logo.svg',
    brandColor: '#3253DC',
    tagline: 'Enabling a world where everyone and everything is intelligently connected.',
    industry: 'Tech & Product',
    companyType: 'Product MNC',
    headquarters: 'San Diego, California, USA (India R&D hubs: Hyderabad, Bengaluru, Chennai, Noida)',
    foundedYear: '1985',
    employeeCount: '50,000+ Worldwide',
    description: 'Qualcomm is the world’s leading wireless technology innovator, pioneering 5G, Snapdragon mobile processors, modem RF systems, artificial intelligence silicon (NPU), automotive digital chassis, and Bluetooth audio platforms.',
    aboutCulture: 'Elite semiconductor engineering culture, heavy patent generation incentives, dedicated state-of-the-art silicon testing labs, flexible working hours, and strong collaborative teamwork with US hardware design teams.',
    website: 'https://www.qualcomm.com',
    careersUrl: 'https://www.qualcomm.com/company/careers',
    hiringOverview: {
      minimumEligibility: 'B.Tech / M.Tech in Electronics & Communication (ECE), Electrical Engineering (EEE), Computer Science (CSE), or VLSI Design with minimum 7.0 CGPA.',
      acceptedStreams: ['B.Tech ECE / EEE / Instrumentation', 'B.Tech CSE / IT (for Embedded Software)', 'M.Tech VLSI Design / Microelectronics', 'M.Tech Embedded Systems / DSP'],
      standardSelectionProcess: [
        'Qualcomm Online Technical Assessment on HackerEarth / SHL (C Programming, Digital Electronics, Microprocessors, Verilog/VHDL, DSA)',
        'Technical Round 1 (Digital Electronics, C/Pointers, Bitwise Operations, Static Timing Analysis)',
        'Technical Round 2 (VLSI Design / Embedded RTOS / Computer Architecture)',
        'Managerial & HR Interview'
      ],
      fresherHiringPrograms: [
        'Associate Hardware Engineer / Associate Systems Engineer (₹18 - 25 LPA CTC)',
        'Associate Embedded Software Engineer (₹18 - 26 LPA CTC)',
        'Qualcomm Women in Tech Mentorship (QWE)',
        'Campus Placement across IITs, NITs, BITS, and premier engineering institutions'
      ],
      internshipOpportunities: 'Summer and 6-month internships with monthly stipend of ₹45,000 - ₹75,000/month + housing support.'
    },
    salaryOverview: {
      fresherMedian: '₹19,00,000 - ₹26,00,000 CTC (Base: ₹13-16 LPA + RSUs + Joining Bonus)',
      range: '₹18 LPA - ₹45+ LPA for Associate to Staff Engineer',
      benefits: ['Substantial cash patent filing awards (₹50,000 - ₹2,00,000 per patent)', 'Restricted Stock Units (RSUs) in Qualcomm Inc (NASDAQ: QCOM)', 'Comprehensive family healthcare and dental coverage', 'Onsite wellness centers and gymnasiums', 'Hybrid work policy with flexible working hours']
    },
    keyHighlights: [
      'The #1 dream company in India for Electronics (ECE) & Electrical (EEE) core graduates',
      'Design Snapdragon chips that power over 2 billion smartphones worldwide',
      'Exceptional patent culture with direct financial bonuses for inventions',
      'Pioneer in On-Device Generative AI and 6G telecommunication research'
    ],
    roles: [
      {
        id: 'qc-embedded-sde',
        title: 'Associate Embedded Software Engineer',
        department: 'Snapdragon Modem / Android BSP / Camera & GPU Drivers',
        targetEligibility: ['B.Tech ECE/EEE/CSE', 'M.Tech Embedded Systems'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹18 - 25 LPA CTC',
        description: 'Develop low-level device drivers, Linux kernel modules, bootloaders, and firmware for Snapdragon processors and 5G baseband modems.',
        keyResponsibilities: [
          'Write high-performance embedded C and assembly code for ARM Cortex processors',
          'Debug board support packages (BSP) using JTAG hardware debuggers and oscilloscopes',
          'Optimize memory management, cache coherency, and power consumption of SoC chips',
          'Implement RTOS kernel primitives, interrupts, and device drivers (I2C, SPI, UART, PCIe)'
        ],
        requiredSkills: ['Embedded C & C++', 'Bitwise Manipulation & Pointers', 'Computer Architecture & ARM processors', 'Real-Time Operating Systems (RTOS / FreeRTOS)', 'Linux Kernel Internals & Device Drivers'],
        hiringStages: ['Technical Assessment (C + Electronics)', 'Technical Interview 1 (Pointers & Data Structures in C)', 'Technical Interview 2 (OS & Microprocessors)', 'HR Round']
      },
      {
        id: 'qc-vlsi-engineer',
        title: 'Associate Hardware Engineer (VLSI / ASIC Verification)',
        department: 'SoC Design Verification / Physical Design / Digital ASIC',
        targetEligibility: ['B.Tech ECE/EEE', 'M.Tech VLSI / Microelectronics'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹19 - 26 LPA CTC',
        description: 'Verify and validate multi-million gate System-on-Chip (SoC) digital designs before tape-out using SystemVerilog and UVM frameworks.',
        keyResponsibilities: [
          'Develop UVM (Universal Verification Methodology) testbenches and assertions',
          'Write functional verification test suites in SystemVerilog and C',
          'Perform code coverage, functional coverage, and formal verification analysis',
          'Debug RTL logic failures alongside ASIC design and synthesis teams'
        ],
        requiredSkills: ['Digital Electronics & Boolean Logic', 'Verilog / SystemVerilog & UVM', 'Static Timing Analysis (STA)', 'CMOS Fundamentals & Setup/Hold times', 'Python/Perl Scripting'],
        hiringStages: ['VLSI Domain Online Exam', 'Digital Electronics Deep Dive', 'Verilog Coding & Timing Analysis Round', 'Managerial Round']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'qc-fb-1',
        authorName: 'Harish Reddy',
        authorRole: 'Senior Hardware Engineer @ Qualcomm SoC Verification',
        authorAvatar: 'harish',
        collegeOrBatch: 'NIT Warangal (B.Tech ECE \'21)',
        rating: 4.9,
        workLifeBalanceRating: 4.6,
        careerGrowthRating: 5,
        feedbackText: 'For ECE students, Qualcomm is paradise. You get to work on the world’s most advanced 3nm Snapdragon silicon. The management encourages you to file patents, and there is a direct cash reward for every patent accepted. Work-life balance is surprisingly great.',
        interviewExperience: 'Master Digital Electronics by Morris Mano, Static Timing Analysis (Setup & Hold Time violations, Metastability), and pointer arithmetic in C. They will ask you to draw timing diagrams for D-Flip Flops.',
        adviceForFreshers: 'Do not ignore hardware description languages (Verilog/SystemVerilog). Build a mini-project like a RISC-V processor or FIFO memory buffer and simulate it on ModelSim.',
        likes: 49,
        timestamp: '2 weeks ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'reliance-jio',
    name: 'Reliance Jio / Industries',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Reliance_Jio_Logo_%28October_2015%29.svg',
    brandColor: '#0A2885',
    tagline: 'Digital India ka Digital Life. Connecting 450+ million Indians with 5G and AI.',
    industry: 'Tech & Product',
    companyType: 'Indian Tech Giant',
    headquarters: 'Navi Mumbai (Reliance Corporate Park - RCP), Maharashtra, India',
    foundedYear: '2007 (Jio Infocomm)',
    employeeCount: '95,000+ Worldwide',
    description: 'Reliance Jio revolutionized India’s telecom and digital economy, building the world’s largest standalone 5G network, JioCinema, JioCloud, JioPay, JioFiber, and cloud AI infrastructure across telecom, retail, and digital media.',
    aboutCulture: 'High-speed execution, massive scale, massive campuses at Reliance Corporate Park with sports complexes and medical centres, competitive entry-level packages, and central role in national digital transformation.',
    website: 'https://www.jio.com',
    careersUrl: 'https://careers.jio.com',
    hiringOverview: {
      minimumEligibility: 'B.Tech / B.E. / Polytechnic Diploma / MCA / BCA / BSc in Computer Science, IT, ECE, EEE, Mechanical with minimum 60% aggregate.',
      acceptedStreams: [
        'B.Tech CSE / IT / AI / Data Science (Jio Digital Platforms)',
        'B.Tech ECE / EEE / Telecom (Jio 5G Network & RF Engineering)',
        'Polytechnic Diploma in ECE, Electrical, Computer Engineering (Jio Associate Engineer)',
        'ITI in Electronics, Telecom, Wireman for JioFiber fiber-optics field deployment'
      ],
      standardSelectionProcess: [
        'Jio Online Aptitude & Technical Test (Quantitative, Logical, Domain MCQs, Coding)',
        'Technical Interview with System / Telecom Architects',
        'HR & Cultural Alignment Round'
      ],
      fresherHiringPrograms: [
        'Graduate Engineer Trainee (GET: ₹5.5 - 7.5 LPA)',
        'Diploma Engineer Trainee / Associate Engineer (₹3.0 - 4.0 LPA)',
        'Jio Talent Hunt Campus Drives across all states'
      ],
      internshipOpportunities: 'Summer internships for engineering students on 5G cloud networks and web media platforms.'
    },
    salaryOverview: {
      fresherMedian: '₹6.0 LPA (GET) | ₹3.2 LPA (DET)',
      range: '₹3.0 LPA - ₹12 LPA for technical talent',
      benefits: ['Free Jio Fiber connection and mobile telecom benefits', 'Comprehensive health and term insurance', 'Subsidized Reliance Retail and Trends discounts', 'Employee transport fleet across Mumbai, Bengaluru, Hyderabad', 'Gratuity and performance bonuses']
    },
    keyHighlights: [
      'Work on software and networks serving over 450 million active daily users',
      'Pioneer in indigenous 5G Standalone (SA) stack and Cloud-Native Core networks',
      'Massive career opportunities for both Degree and Polytechnic Diploma graduates',
      'Rapidly expanding into Enterprise Cloud, AI models, and Cloud Gaming'
    ],
    roles: [
      {
        id: 'jio-sde',
        title: 'Software Development Engineer (Jio Platforms)',
        department: 'JioCinema / JioCloud / JioPay / JioFiber Core',
        targetEligibility: ['B.Tech CSE/IT/ECE', 'MCA'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹5.5 - 7.5 LPA CTC',
        description: 'Develop high-concurrency microservices, video streaming pipelines, and billing gateways capable of handling millions of concurrent cricket & media streams.',
        keyResponsibilities: [
          'Develop backend microservices in Golang, Java Spring Boot, and Python',
          'Optimize video transcode caching and Content Delivery Network (CDN) edge routing',
          'Write database models in MongoDB, Cassandra, and Redis',
          'Build automated regression testing and monitoring suites in Prometheus/Grafana'
        ],
        requiredSkills: ['Data Structures & Algorithms', 'Java / Golang / Python / React', 'RESTful APIs & Microservices', 'NoSQL & Redis Caching', 'Linux System fundamentals'],
        hiringStages: ['Online Coding & MCQ Test', 'Technical Interview', 'HR Round']
      },
      {
        id: 'jio-5g-network-eng',
        title: '5G Radio & Core Network Engineer',
        department: 'Jio 5G Wireless / Optical Transport Network (OTN) / NOC',
        targetEligibility: ['B.Tech ECE/EEE', 'Polytechnic Diploma ECE'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹4.5 - 6.0 LPA CTC',
        description: 'Plan, configure, optimize, and monitor 5G gNodeB base stations, Massive MIMO antennas, and fiber optic backhaul rings.',
        keyResponsibilities: [
          'Monitor real-time Network Operations Center (NOC) KPIs (throughput, latency, packet drop)',
          'Configure 5G Standalone Core network functions (AMF, SMF, UPF) on OpenStack cloud',
          'Perform RF drive tests and spectrum optimization in urban clusters',
          'Coordinate optical fiber cut restoration with ground field engineers'
        ],
        requiredSkills: ['Wireless Communication & 5G/4G Architecture', 'TCP/IP & Optical Networking (DWDM)', 'Linux CLI & Scripting', 'RF Optimization principles', 'Network Troubleshooting'],
        hiringStages: ['Domain MCQ Test', 'Technical Panel Interview', 'HR Round']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'jio-fb-1',
        authorName: 'Deepak Chawla',
        authorRole: 'Software Engineer @ JioCinema Media Tech',
        authorAvatar: 'deepak',
        collegeOrBatch: 'Thapar Institute of Engineering (B.Tech CSE \'22)',
        rating: 4.4,
        workLifeBalanceRating: 4.0,
        careerGrowthRating: 4.7,
        feedbackText: 'The sheer scale at Jio is unmatched in India. When IPL or major cricket matches stream on JioCinema, you handle 30+ million concurrent users simultaneously. You learn deep backend optimization, Redis sharding, and CDN edge caching at unprecedented scale.',
        interviewExperience: 'Prepare concurrency concepts, caching mechanisms, basic Golang/Java, and standard DSA. They asked me to design a high-throughput rate limiter.',
        adviceForFreshers: 'Build projects that handle real-time streaming (WebSockets, WebRTC, Kafka queues). It immediately catches the attention of Jio interviewers.',
        likes: 31,
        timestamp: '1 month ago',
        isVerifiedAlumni: true
      }
    ]
  },
  {
    id: 'dr-reddys',
    name: 'Dr. Reddy’s Laboratories',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Dr._Reddy%27s_Laboratories_logo.svg',
    brandColor: '#662D91',
    tagline: 'Good Health Can’t Wait. Leading global pharmaceutical and biotech healthcare.',
    industry: 'Healthcare & Pharma',
    companyType: 'Pharma Leader',
    headquarters: 'Hyderabad, Telangana, India (Global presence in 66+ countries: USA, Europe, Russia, CIS)',
    foundedYear: '1984',
    employeeCount: '25,000+ Worldwide',
    description: 'Dr. Reddy’s Laboratories is one of India’s foremost multinational pharmaceutical powerhouses, manufacturing Active Pharmaceutical Ingredients (APIs), generic medicines, biosimilars, oncology therapies, and proprietary healthcare products.',
    aboutCulture: 'Deep commitment to global human health, world-class research laboratories (IPDO Hyderabad), rigorous US FDA quality compliance standards, ethical work environment, and progressive continuous development programs.',
    website: 'https://www.drreddys.com',
    careersUrl: 'https://careers.drreddys.com',
    hiringOverview: {
      minimumEligibility: 'B.Pharm, M.Pharm, B.Tech Chemical / Biotechnology / Mechanical / Electrical, BSc / MSc Chemistry / Microbiology / Biochemistry with minimum 60% marks.',
      acceptedStreams: [
        'B.Pharm & M.Pharm (Formulation, Quality Control, Regulatory Affairs)',
        'B.Tech Chemical Engineering (API synthesis & Plant manufacturing)',
        'B.Tech Biotechnology / Biomedical Engineering',
        'B.Tech Mechanical & Electrical (Pharmaceutical Plant Automation & HVAC)',
        'Polytechnic Diploma in Chemical / Mechanical / Electrical (Plant Operations Trainee)'
      ],
      standardSelectionProcess: [
        'Pharma Domain Aptitude & Subject MCQ Assessment (Medicinal Chemistry, Pharmacology, cGMP, Analytics)',
        'Technical Interview with R&D Team Leads and Quality Directors',
        'HR & Safety / Compliance Evaluation'
      ],
      fresherHiringPrograms: [
        'Graduate Trainee / Technical Trainee (B.Pharm / B.Tech: ₹4.5 - 6.0 LPA)',
        'Management Trainee / Scientist Trainee (M.Pharm / M.Tech / MSc: ₹6.0 - 8.0 LPA)',
        'Diploma Trainee (Chemical & Production: ₹2.8 - 3.8 LPA)'
      ],
      internshipOpportunities: 'Summer project internships for pharmacy and biotechnology students at Bachupally and IPDO R&D centres.'
    },
    salaryOverview: {
      fresherMedian: '₹5.0 LPA (B.Tech/B.Pharm) | ₹7.0 LPA (M.Pharm/M.Tech)',
      range: '₹3.0 LPA - ₹10 LPA for campus graduates',
      benefits: ['Medical insurance covering employee, spouse, children, and parents', 'Annual performance bonuses and production incentives', 'Free plant transport fleet across Hyderabad & Visakhapatnam', 'Subsidized health meals at company cafeterias', 'Education sponsorship for advanced MS / Ph.D. degrees']
    },
    keyHighlights: [
      'Top-tier destination for BiPC students, Pharmacy graduates, and Chemical/Biotech engineers',
      'Pioneer in biosimilars, cancer therapies, and COVID-19 vaccine manufacturing',
      'US FDA approved sterile manufacturing facilities with robotics & automation',
      'Strong international mobility opportunities across North America and Europe'
    ],
    roles: [
      {
        id: 'dr-formulation-scientist',
        title: 'Associate Scientist (Formulation R&D / Analytical Development)',
        department: 'Integrated Product Development Organization (IPDO)',
        targetEligibility: ['B.Pharm / M.Pharm', 'M.Sc Chemistry / Analytical Chemistry', 'B.Tech Biotechnology'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹5.0 - 7.5 LPA CTC',
        description: 'Formulate oral solid dosage forms, sterile injectables, and develop High-Performance Liquid Chromatography (HPLC) analytical testing methods.',
        keyResponsibilities: [
          'Formulate generic tablet, capsule, and injectable drug prototypes',
          'Conduct stability studies and dissolution rate testing under ICH guidelines',
          'Operate advanced analytical instruments (HPLC, GC, UV-Vis Spectrophotometer, FTIR)',
          'Prepare Drug Master Files (DMF) and Common Technical Documents (CTD) for US FDA submissions'
        ],
        requiredSkills: ['Pharmaceutics & Formulation design', 'HPLC / Gas Chromatography (GC)', 'c-GMP (Current Good Manufacturing Practices)', 'ICH Quality Guidelines', 'Analytical Chemistry & Drug Stability'],
        hiringStages: ['Pharma Domain Assessment', 'Technical R&D Interview', 'HR Round']
      },
      {
        id: 'dr-process-eng',
        title: 'Process Chemical Engineer (API Manufacturing)',
        department: 'Active Pharmaceutical Ingredients (API) / Chemical Operations',
        targetEligibility: ['B.Tech Chemical Engineering', 'Polytechnic Diploma Chemical'],
        experienceLevel: 'Entry-Level / Fresher',
        packageRange: '₹4.5 - 6.2 LPA CTC',
        description: 'Scale up chemical synthesis reactions from laboratory bench to multi-ton plant reactors, distillation columns, and cleanroom dryers.',
        keyResponsibilities: [
          'Monitor chemical reaction stoichiometry, temperature profiles, and agitation kinetics',
          'Operate fluid bed dryers, centrifuges, glass-lined reactors, and vacuum distillation units',
          'Ensure strict compliance with Process Safety Management (PSM) and environmental norms',
          'Optimize batch cycle times and minimize organic solvent waste generation'
        ],
        requiredSkills: ['Chemical Reaction Engineering', 'Mass Transfer & Distillation', 'Plant Safety & Hazardous Chemicals handling', 'P&ID / Process Flow Diagrams (PFD)', 'cGMP cleanroom compliance'],
        hiringStages: ['Chemical Engineering Test', 'Plant Operations Interview', 'HR Round']
      }
    ],
    alumniFeedbacks: [
      {
        id: 'dr-fb-1',
        authorName: 'Dr. Sai Praneeth',
        authorRole: 'Senior Research Associate @ Dr. Reddy’s IPDO',
        authorAvatar: 'sai',
        collegeOrBatch: 'NIPER Hyderabad (M.Pharm Pharmaceutics \'21)',
        rating: 4.8,
        workLifeBalanceRating: 4.5,
        careerGrowthRating: 4.8,
        feedbackText: 'Dr. Reddy’s IPDO campus at Bachupally is equivalent to a premier American research university. You get hands-on access to top-of-the-line HPLC, LC-MS, and automated tablet compression machines. The emphasis on ethical research and patient safety is inspiring.',
        interviewExperience: 'Revise BCS classification, dissolution testing, HPLC column chemistry (C18 reverse phase), and fundamentals of pharmacokinetics.',
        adviceForFreshers: 'BiPC and Pharmacy students should develop a strong understanding of US FDA 21 CFR regulations and electronic data integrity. It will put you in the top 5% of candidates.',
        likes: 37,
        timestamp: '3 weeks ago',
        isVerifiedAlumni: true
      }
    ]
  }
];
