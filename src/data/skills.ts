export interface SkillCategory {
  id: string;
  name: string;
  tagline: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'data-analytics',
    name: 'DATA & ANALYTICS',
    tagline: 'Transforming raw telemetry into statistical conviction and executive clarity.',
    skills: [
      'SQL',
      'Power BI',
      'Tableau',
      'Advanced Excel',
      'Python',
      'Pandas',
      'Matplotlib'
    ]
  },
  {
    id: 'genai',
    name: 'AI / GENERATIVE AI',
    tagline: 'Orchestrating foundation models, vector search, and multi-agent reasoning.',
    skills: [
      'Gemini',
      'Generative AI',
      'Prompt Engineering',
      'RAG',
      'AI Agents'
    ]
  },
  {
    id: 'google-cloud',
    name: 'GOOGLE CLOUD',
    tagline: 'Deploying scalable serverless data architectures and LLM microservices.',
    skills: [
      'BigQuery',
      'Firestore',
      'Cloud Run',
      'Google AI Studio'
    ]
  },
  {
    id: 'product',
    name: 'PRODUCT & STRATEGY',
    tagline: 'Bridging technical capabilities with commercial viability and user behavior.',
    skills: [
      'Product Discovery',
      'Requirement Gathering',
      'User Stories',
      'Feature Prioritization',
      'Product Analytics',
      'Roadmapping',
      'Stakeholder Management'
    ]
  },
  {
    id: 'development',
    name: 'DEVELOPMENT',
    tagline: 'Building high-performance interactive interfaces and prototype backends.',
    skills: [
      'React',
      'TypeScript',
      'JavaScript',
      'GitHub',
      'Streamlit'
    ]
  }
];

export interface ProcessStep {
  step: string;
  name: string;
  phase: string;
  description: string;
  deliverable: string;
}

export const problemSolvingFlow: ProcessStep[] = [
  {
    step: '01',
    name: 'BUSINESS PROBLEM',
    phase: 'ALIGNMENT',
    description: 'Diagnosing core bottlenecks, market friction, revenue leakages, or user pain points with stakeholders.',
    deliverable: 'Problem Definition & Success Metrics'
  },
  {
    step: '02',
    name: 'DISCOVERY',
    phase: 'MAPPING',
    description: 'Deconstructing workflow constraints, existing data availability, user personas, and regulatory boundaries.',
    deliverable: 'Scope Matrix & User Journey Map'
  },
  {
    step: '03',
    name: 'DATA',
    phase: 'INGESTION',
    description: 'Consolidating transactional logs, behavioral events, and system databases into clean, structured stores.',
    deliverable: 'Data Dictionary & Validated Schemas'
  },
  {
    step: '04',
    name: 'ANALYSIS',
    phase: 'MODELING',
    description: 'Conducting exploratory data analysis (EDA), hypothesis testing, cohort segmentation, and variance tracking.',
    deliverable: 'Statistical Findings & EDA Models'
  },
  {
    step: '05',
    name: 'INSIGHT',
    phase: 'SYNTHESIS',
    description: 'Converting raw analytical correlations into actionable, executive-level strategic decisions and levers.',
    deliverable: 'Executive Decision Brief'
  },
  {
    step: '06',
    name: 'AI / PRODUCT SOLUTION',
    phase: 'EXECUTION',
    description: 'Designing autonomous GenAI workflows, intelligent agents, interactive dashboards, or streamlined features.',
    deliverable: 'Production Prototype / Agent System'
  },
  {
    step: '07',
    name: 'BUSINESS IMPACT',
    phase: 'VALIDATION',
    description: 'Continuous KPI monitoring, A/B evaluation, retention lift measurement, and commercial ROI realization.',
    deliverable: 'Verified ROI & Performance Report'
  }
];
