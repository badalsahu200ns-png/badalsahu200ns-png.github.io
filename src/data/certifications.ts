export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  category: 'Cloud & AI' | 'Data & Analytics' | 'Consulting & Strategy' | 'Foundations';
  status?: 'In Progress' | 'Completed';
  year?: string;
  badgeCode?: string;
}

export const certifications: CertificationItem[] = [
  {
    id: 'gcp-data-analytics',
    title: 'Google Cloud Data Analytics Certificate',
    issuer: 'Google Cloud',
    category: 'Cloud & AI',
    status: 'In Progress',
    badgeCode: 'GCP-DA'
  },
  {
    id: 'oracle-python',
    title: 'Oracle Python Certified Foundations Associate',
    issuer: 'Oracle',
    category: 'Foundations',
    status: 'Completed',
    badgeCode: '1Z0-811'
  },
  {
    id: 'oracle-agentic-ai',
    title: 'Oracle Agentic AI Certified Foundations Associate',
    issuer: 'Oracle',
    category: 'Cloud & AI',
    status: 'Completed',
    badgeCode: 'ORA-AAI'
  },
  {
    id: 'cisco-cybersecurity',
    title: 'Cisco Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    category: 'Foundations',
    status: 'Completed',
    badgeCode: 'CSCO-SEC'
  },
  {
    id: 'oneroadmap-da',
    title: 'OneRoadmap Data Analyst Certification',
    issuer: 'OneRoadmap',
    category: 'Data & Analytics',
    status: 'Completed',
    badgeCode: '1RM-DA'
  },
  {
    id: 'oneroadmap-excel',
    title: 'OneRoadmap Excel Certification',
    issuer: 'OneRoadmap',
    category: 'Data & Analytics',
    status: 'Completed',
    badgeCode: '1RM-XLS'
  },
  {
    id: 'tata-forage',
    title: 'Data Analytics Job Simulation',
    issuer: 'Tata Group / Forage',
    category: 'Data & Analytics',
    status: 'Completed',
    badgeCode: 'FORAGE-TATA'
  },
  {
    id: 'deloitte-forage',
    title: 'Consulting Job Simulations',
    issuer: 'Deloitte Australia / Forage',
    category: 'Consulting & Strategy',
    status: 'Completed',
    badgeCode: 'FORAGE-DTT'
  },
  {
    id: 'accenture-forage',
    title: 'Consulting Job Simulation',
    issuer: 'Accenture UK / Forage',
    category: 'Consulting & Strategy',
    status: 'Completed',
    badgeCode: 'FORAGE-ACN'
  },
  {
    id: 'bcg-forage',
    title: 'Consulting Job Simulation',
    issuer: 'BCG / Forage',
    category: 'Consulting & Strategy',
    status: 'Completed',
    badgeCode: 'FORAGE-BCG'
  },
  {
    id: 'pwc-forage',
    title: 'Consulting Job Simulation',
    issuer: 'PwC US / Forage',
    category: 'Consulting & Strategy',
    status: 'Completed',
    badgeCode: 'FORAGE-PWC'
  },
  {
    id: 'mastercard-forage',
    title: 'Introduction to Artificial Intelligence',
    issuer: 'Mastercard / Forage',
    category: 'Cloud & AI',
    status: 'Completed',
    badgeCode: 'FORAGE-MA'
  },
  {
    id: 'customer-analytics',
    title: 'Customer Analytics',
    issuer: 'Coursera',
    category: 'Data & Analytics',
    status: 'Completed',
    badgeCode: 'COURSERA-CA'
  },
  {
    id: 'marketing-analytics',
    title: 'Marketing Analytics',
    issuer: 'Coursera',
    category: 'Data & Analytics',
    status: 'Completed',
    badgeCode: 'COURSERA-MA'
  },
  {
    id: 'google-digital-marketing',
    title: 'Google Digital Marketing Certification',
    issuer: 'Google',
    category: 'Consulting & Strategy',
    status: 'Completed',
    badgeCode: 'GOOGLE-DM'
  }
];
