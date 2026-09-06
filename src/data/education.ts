export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  period: string;
  status: string;
  description: string;
}

export const education: EducationItem[] = [
  {
    id: 'mca',
    degree: 'Master of Computer Applications (MCA)',
    field: 'Computer Science & Software Engineering',
    institution: 'Amity University',
    period: 'Jul 2025 – Present',
    status: 'Pursuing',
    description: 'Advanced computing curriculum emphasizing distributed systems, algorithmic data analysis, cloud architectures, and machine intelligence.'
  },
  {
    id: 'pgdm',
    degree: 'Post Graduate Diploma in Management (PGDM)',
    field: 'Marketing & Finance',
    institution: 'Institute of Management and Information Science, Bhubaneswar',
    period: 'Completed',
    status: 'Graduated',
    description: 'Rigorous business management grounding focusing on quantitative financial analytics, business development strategy, market economics, and operational leadership.'
  },
  {
    id: 'bcom',
    degree: 'Bachelor of Commerce (B.Com)',
    field: 'Marketing & Finance',
    institution: 'J.R.N. Rajasthan Vidyapeeth University',
    period: 'Completed',
    status: 'Graduated',
    description: 'Core foundation in corporate accounting, statistical analysis, economic modeling, commercial contracts, and business mathematics.'
  }
];
