export interface ProjectLink {
  label: string;
  href: string;
  isPlaceholder?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  overview: string;
  problemSolved: string;
  role: string;
  toolsUsed: string[];
  technicalWork: string[];
  result: string;
  links: ProjectLink[];
}

export interface Skill {
  name: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  location?: string;
  period?: string;
  description: string;
  highlights: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}
