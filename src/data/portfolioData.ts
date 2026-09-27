import profileJson from '../../portfolio-data/profile.json';
import internshipsJson from '../../portfolio-data/internships.json';
import experienceJson from '../../portfolio-data/experience.json';
import educationJson from '../../portfolio-data/education.json';
import certificationsJson from '../../portfolio-data/certifications.json';
import skillsJson from '../../portfolio-data/skills.json';
import projectsJson from '../../portfolio-data/projects.json';
import githubProjectsJson from '../../portfolio-data/github-projects.json';

export interface ProfileData {
  name: string;
  identityCode: string;
  systemTitle: string;
  headline: string;
  supportingTitle: string;
  summary: string;
  location: string;
  workplaceStatus: string;
  availability: string;
  workMode: string;
  timezone: string;
  email: string;
  linkedin: string;
  github: string;
  heroImage?: string;
  profileImage: string;
  profileCutout?: string;
  profileImageFallback: string;
  journeyImage?: string;
  careerImage?: string;
  contactImage?: string;
  cinematic: {
    video: string;
    poster: string;
    videoFallback: string;
  };
  corePillars: Array<{
    title: string;
    subtitle: string;
    description: string;
  }>;
}

export interface InternshipItem {
  id: string;
  organization: string;
  program?: string;
  platform?: string;
  role: string;
  mode?: string;
  duration?: string;
  startDate: string;
  endDate: string;
  period: string;
  status?: string;
  location: string;
  domain: string;
  description: string;
  responsibilities: string[];
  currentlyLearning?: string[];
  skills: string[];
  outcomes?: string;
}

export interface ExperienceNode {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  domain: string;
  highlightMetric?: string;
  responsibilities: string[];
  businessImpact: string;
  skills: string[];
}

export interface ImpactMetric {
  id: string;
  value: string;
  label: string;
  sublabel: string;
}

export interface ExperienceData {
  impactMetrics: ImpactMetric[];
  experiences: ExperienceNode[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  dates: string;
  location: string;
  relevantSubjects: string[];
  currentStatus: string;
  verifiedAcademicInfo: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  certificateImage?: string | null;
  verificationUrl?: string | null;
  status: 'Completed' | 'In Progress';
  category: string;
}

export interface CoreExpertiseCluster {
  id: string;
  category: string;
  tagline: string;
  clusters: string[];
}

export interface TechnicalSkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface SkillsData {
  coreExpertise: CoreExpertiseCluster[];
  technicalCategories: TechnicalSkillCategory[];
}

export interface CuratedProject {
  repo: string;
  featured: boolean;
  priority: number;
  displayTitle: string;
  category: string;
  customDescription: string;
  technologyTags: string[];
  demoUrl?: string | null;
  repositoryUrl?: string | null;
  image?: string | null;
  video?: string | null;
  caseStudyUrl?: string | null;
  verifiedMetrics?: string;
}

export interface GithubProject {
  name: string;
  fullName: string;
  description: string;
  githubUrl: string;
  homepage?: string | null;
  language?: string | null;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  pushedAt?: string;
  isArchived?: boolean;
}

export interface MergedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
  image?: string | null;
  video?: string | null;
  caseStudyUrl?: string | null;
  metrics: string;
  stars: number;
  forks: number;
  featured: boolean;
  priority: number;
  updatedAt?: string;
  source: 'curated' | 'github' | 'merged';
}

export const profileData: ProfileData = profileJson as ProfileData;
export const internshipsData: InternshipItem[] = internshipsJson as InternshipItem[];
export const experienceData: ExperienceData = experienceJson as ExperienceData;
export const educationData: EducationItem[] = educationJson as EducationItem[];
export const certificationsData: CertificationItem[] = certificationsJson as CertificationItem[];
export const skillsData: SkillsData = skillsJson as SkillsData;
export const curatedProjectsData: CuratedProject[] = projectsJson as CuratedProject[];
export const githubProjectsData: GithubProject[] = githubProjectsJson as GithubProject[];

/**
 * Merge manually curated portfolio metadata with automatically synchronized GitHub repositories.
 */
export function getMergedProjects(): MergedProject[] {
  const mergedMap = new Map<string, MergedProject>();
  const normalizeKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Ingest curated projects
  curatedProjectsData.forEach((curated) => {
    mergedMap.set(normalizeKey(curated.repo), {
      id: curated.repo,
      title: curated.displayTitle,
      category: curated.category,
      description: curated.customDescription,
      technologies: curated.technologyTags,
      demoUrl: curated.demoUrl,
      githubUrl: curated.repositoryUrl,
      image: curated.image,
      video: curated.video,
      caseStudyUrl: curated.caseStudyUrl,
      metrics: curated.verifiedMetrics || 'Verified Deployed System',
      stars: 0,
      forks: 0,
      featured: curated.featured,
      priority: curated.priority,
      source: 'curated'
    });
  });

  // 2. Merge GitHub projects (excluding old portfolio and user profile repos)
  githubProjectsData.forEach((gh) => {
    if (gh.name.endsWith('.github.io') || gh.name === 'badalsahu200ns-png') {
      return; // Skip obsolete portfolio repo and profile readme repo
    }
    const key = normalizeKey(gh.name);
    const existing = mergedMap.get(key);

    if (existing) {
      existing.stars = gh.stars;
      existing.forks = gh.forks;
      existing.updatedAt = gh.updatedAt;
      if (!existing.githubUrl && gh.githubUrl) {
        existing.githubUrl = gh.githubUrl;
      }
      if (!existing.demoUrl && gh.homepage) {
        existing.demoUrl = gh.homepage;
      }
      existing.source = 'merged';
    } else {
      // Uncurated public github repo
      mergedMap.set(key, {
        id: gh.name,
        title: gh.name.replace(/[-_]/g, ' '),
        category: 'Public Repository',
        description: gh.description || 'Public open-source repository.',
        technologies: gh.language ? [gh.language, ...gh.topics.slice(0, 3)] : gh.topics.slice(0, 4),
        demoUrl: gh.homepage,
        githubUrl: gh.githubUrl,
        image: null,
        video: null,
        caseStudyUrl: null,
        metrics: `${gh.stars} Stars · ${gh.forks} Forks`,
        stars: gh.stars,
        forks: gh.forks,
        featured: false,
        priority: 99,
        updatedAt: gh.updatedAt,
        source: 'github'
      });
    }
  });

  return Array.from(mergedMap.values()).sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return (b.stars || 0) - (a.stars || 0);
  });
}
