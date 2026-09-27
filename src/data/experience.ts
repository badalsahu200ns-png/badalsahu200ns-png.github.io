export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  domain: string;
  highlightMetric?: string;
  achievements: string[];
  skills: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: 'edunet-vodafone',
    role: 'Data Analytics Intern',
    company: 'Edunet Foundation / Vodafone Idea Foundation',
    period: 'Aug 2026 – Present',
    location: 'Remote',
    domain: 'Telecom & CSR Analytics',
    highlightMetric: 'Telecom Big Data',
    achievements: [
      'Engineered structured data pipelines and exploratory analytics models for telecom impact assessment.',
      'Formulated dashboards tracking regional digital literacy initiatives and student engagement trends.',
      'Applied predictive analysis on telemetry indicators to boost retention rates across community programs.'
    ],
    skills: ['SQL', 'Python', 'Power BI', 'Data Cleaning', 'Statistical Modeling']
  },
  {
    id: 'neo-skillz',
    role: 'Data Analytics Training & Internship Program',
    company: 'Neo Skillz',
    period: 'Aug 2026 – Present',
    location: 'Remote',
    domain: 'Analytics & GenAI Systems',
    highlightMetric: 'AI-Driven BI',
    achievements: [
      'Spearheading modern analytics implementations with focus on end-to-end data transformation pipelines.',
      'Synthesized custom business intelligence reports and machine learning-powered analytical dashboards.',
      'Pioneering automated prompt engineering workflows for business insight extraction.'
    ],
    skills: ['Generative AI', 'Pandas', 'EDA', 'Tableau', 'Business Intelligence']
  },
  {
    id: 'magicbricks',
    role: 'Business Manager',
    company: 'Magicbricks',
    period: '2025',
    location: 'India',
    domain: 'PropTech & Marketplace',
    highlightMetric: '30% Business Growth',
    achievements: [
      'Drove 30% business growth across real estate developer portfolios by identifying market liquidity pockets.',
      'Managed cross-functional stakeholder alignments between digital product teams and tier-1 enterprise clients.',
      'Utilized property search telemetry and churn indicators to design personalized retention campaigns.'
    ],
    skills: ['Product Discovery', 'Revenue Growth', 'Marketplace Analytics', 'Account Expansion']
  },
  {
    id: 'redbus',
    role: 'Key Account Manager',
    company: 'redBus India Pvt Ltd',
    period: 'Mar 2024 – Mar 2025',
    location: 'India',
    domain: 'Travel-Tech & Mobility',
    highlightMetric: '130% KPI Achievement',
    achievements: [
      'Achieved 130% KPI performance by optimizing inventory availability and route pricing strategies.',
      'Led demand forecasting analysis across major intercity transit corridors during seasonal spikes.',
      'Negotiated high-value strategic partnerships with enterprise bus fleet operators.'
    ],
    skills: ['Key Account Management', 'Inventory Optimization', 'Pricing Intelligence', 'Stakeholder Management']
  },
  {
    id: 'reliance-ppm',
    role: 'JBA Sales Manager',
    company: 'Reliance PPM Services Ltd',
    period: 'Feb 2022 – Feb 2024',
    location: 'India',
    domain: 'Enterprise Business & Distribution',
    highlightMetric: '20+ Team Members Led',
    achievements: [
      'Led and mentored high-performing sales force of 20+ professionals, driving sustained market penetration.',
      'Established disciplined performance tracking frameworks using sales data and pipeline conversion metrics.',
      'Expanded enterprise channel footprint and structured scalable onboarding playbooks.'
    ],
    skills: ['Team Leadership', 'Sales Pipeline Analytics', 'Operational Strategy', 'Enterprise Sales']
  },
  {
    id: 'icici-pru',
    role: 'Business Trainee – IndusInd Bank Partnership',
    company: 'ICICI Prudential Life Insurance',
    period: 'Sep 2020 – Jan 2022',
    location: 'India',
    domain: 'BFSI & Bancassurance',
    highlightMetric: '91% Renewal Collection',
    achievements: [
      'Achieved remarkable 91% renewal collection improvement through structured customer engagement workflows.',
      'Collaborated closely with IndusInd Bank retail branch leaders to drive wealth protection penetration.',
      'Analyzed customer portfolio risk categories to match customized insurance solutions.'
    ],
    skills: ['BFSI', 'Bancassurance', 'Portfolio Risk Analysis', 'Retention Optimization']
  }
];

export const impactStats = [
  {
    id: 'exp',
    value: 5,
    suffix: '+',
    label: 'Years Experience',
    sublabel: 'Across High-Growth Industries'
  },
  {
    id: 'growth',
    value: 30,
    suffix: '%',
    label: 'Business Growth',
    sublabel: 'Delivered at Magicbricks'
  },
  {
    id: 'team',
    value: 20,
    suffix: '+',
    label: 'Team Members Led',
    sublabel: 'Coached to Peak Performance'
  },
  {
    id: 'kpi',
    value: 130,
    suffix: '%',
    label: 'KPI Achievement',
    sublabel: 'Sustained at redBus India'
  },
  {
    id: 'renewal',
    value: 91,
    suffix: '%',
    label: 'Renewal Collection',
    sublabel: 'Improvement at ICICI Pru'
  }
];
