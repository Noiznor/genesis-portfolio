import { achievements as fallbackAchievements } from "@/data/achievements";
import { certifications as fallbackCertifications } from "@/data/certifications";
import { experiences as fallbackExperiences } from "@/data/experience";
import { projects as fallbackProjects } from "@/data/projects";
import { siteConfig as fallbackSiteConfig } from "@/data/site";
import { skillCategories as fallbackSkillCategories } from "@/data/skills";
import { createClient } from "@/lib/supabase/server";
import type {
  Achievement,
  Certification,
  Experience,
  Project,
  SkillCategory
} from "@/types";

export type SiteProfile = {
  ownerName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutBody: string;
  email: string;
  location: string;
  resumePath: string;
  personalGithub: string;
  sphrGithub: string;
  linkedin: string;
};

export type PortfolioData = {
  siteConfig: typeof fallbackSiteConfig;
  siteProfile: SiteProfile;
  projects: Project[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  achievements: Achievement[];
  certifications: Certification[];
};

type SupabaseSiteProfile = {
  owner_name: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  about_title: string;
  about_body: string;
  email: string;
  location: string;
  resume_path: string;
  personal_github: string;
  sphr_github: string;
  linkedin: string;
};

type SupabaseProject = {
  slug: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  tech_stack: string[];
  overview: string;
  problem_solved: string;
  role: string;
  tools_used: string[];
  technical_work: string[];
  result: string;
  github_url: string;
  documentation_url: string | null;
  sort_order: number;
};

type SupabaseSkillCategory = {
  slug: string;
  title: string;
  description: string;
  skills: string[];
  sort_order: number;
};

type SupabaseExperience = {
  slug: string;
  title: string;
  organization: string;
  location: string | null;
  period: string | null;
  description: string;
  highlights: string[];
  sort_order: number;
};

type SupabaseAchievement = {
  slug: string;
  title: string;
  description: string;
  sort_order: number;
};

type SupabaseCertification = {
  slug: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  certificate_image_url: string | null;
  description: string;
  sort_order: number;
};

const fallbackSiteProfile: SiteProfile = {
  ownerName: fallbackSiteConfig.name,
  heroEyebrow: "Cybersecurity • Embedded Systems • AI Edge Intelligence",
  heroTitle: "Hi, I'm Genesis I. Polotan",
  heroSubtitle:
    "Computer Engineering Graduate | Cybersecurity • Automotive CAN/AGL • AI Edge Intelligence • Embedded Systems",
  heroDescription:
    "I build practical systems that connect software, hardware, security, and real-world engineering — from Automotive Grade Linux dashboards and CAN bus analysis to AI-based localization, embedded prototypes, and cybersecurity-focused applications.",
  aboutTitle:
    "Hands-on computer engineering across software, hardware, AI, and security.",
  aboutBody:
    "I am a Computer Engineering graduate from the University of San Carlos with a strong interest in cybersecurity, electric vehicle systems, AI-driven edge intelligence, embedded systems, and robotics. I am also the founder and technical lead of SPHR Tech Solutions.",
  email: fallbackSiteConfig.email,
  location: fallbackSiteConfig.location,
  resumePath: fallbackSiteConfig.resumePath,
  personalGithub: fallbackSiteConfig.personalGithub,
  sphrGithub: fallbackSiteConfig.sphrGithub,
  linkedin: fallbackSiteConfig.linkedin
};

function mapSiteProfile(profile: SupabaseSiteProfile): SiteProfile {
  return {
    ownerName: profile.owner_name,
    heroEyebrow: profile.hero_eyebrow,
    heroTitle: profile.hero_title,
    heroSubtitle: profile.hero_subtitle,
    heroDescription: profile.hero_description,
    aboutTitle: profile.about_title,
    aboutBody: profile.about_body,
    email: profile.email,
    location: profile.location,
    resumePath: profile.resume_path,
    personalGithub: profile.personal_github,
    sphrGithub: profile.sphr_github,
    linkedin: profile.linkedin
  };
}

function mapProject(project: SupabaseProject): Project {
  const documentationUrl = project.documentation_url?.trim();

  return {
    id: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    highlights: project.highlights ?? [],
    techStack: project.tech_stack ?? [],
    overview: project.overview,
    problemSolved: project.problem_solved,
    role: project.role,
    toolsUsed: project.tools_used ?? [],
    technicalWork: project.technical_work ?? [],
    result: project.result,
    links: [
      {
        label: "GitHub",
        href: project.github_url
      },
      {
        label: "Documentation",
        href:
          documentationUrl && documentationUrl.length > 0
            ? documentationUrl
            : "#",
        isPlaceholder: !documentationUrl || documentationUrl.length === 0
      }
    ]
  };
}

function mapSkillCategory(category: SupabaseSkillCategory): SkillCategory {
  return {
    id: category.slug,
    title: category.title,
    description: category.description,
    skills: (category.skills ?? []).map((skill) => ({ name: skill }))
  };
}

function mapExperience(experience: SupabaseExperience): Experience {
  return {
    id: experience.slug,
    title: experience.title,
    organization: experience.organization,
    location: experience.location ?? undefined,
    period: experience.period ?? undefined,
    description: experience.description,
    highlights: experience.highlights ?? []
  };
}

function mapAchievement(achievement: SupabaseAchievement): Achievement {
  return {
    id: achievement.slug,
    title: achievement.title,
    description: achievement.description
  };
}

function mapCertification(certification: SupabaseCertification): Certification {
  return {
    id: certification.slug,
    title: certification.title,
    issuer: certification.issuer,
    issueDate: certification.issue_date ?? undefined,
    credentialId: certification.credential_id ?? undefined,
    credentialUrl: certification.credential_url ?? undefined,
    certificateImageUrl: certification.certificate_image_url ?? undefined,
    description: certification.description
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const supabase = await createClient();

    const [
      siteProfileResponse,
      projectsResponse,
      skillsResponse,
      experiencesResponse,
      achievementsResponse,
      certificationsResponse
    ] = await Promise.all([
      supabase
        .from("site_profile")
        .select(
          "owner_name,hero_eyebrow,hero_title,hero_subtitle,hero_description,about_title,about_body,email,location,resume_path,personal_github,sphr_github,linkedin"
        )
        .eq("id", "main")
        .single(),
      supabase
        .from("projects")
        .select(
          "slug,title,category,description,highlights,tech_stack,overview,problem_solved,role,tools_used,technical_work,result,github_url,documentation_url,sort_order"
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("skill_categories")
        .select("slug,title,description,skills,sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("experiences")
        .select(
          "slug,title,organization,location,period,description,highlights,sort_order"
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("achievements")
        .select("slug,title,description,sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("certifications")
        .select(
          "slug,title,issuer,issue_date,credential_id,credential_url,certificate_image_url,description,sort_order"
        )
        .order("sort_order", { ascending: true })
    ]);

    if (
      siteProfileResponse.error ||
      projectsResponse.error ||
      skillsResponse.error ||
      experiencesResponse.error ||
      achievementsResponse.error ||
      certificationsResponse.error
    ) {
      throw new Error("Failed to load one or more Supabase portfolio tables.");
    }

    const siteProfile = mapSiteProfile(
      siteProfileResponse.data as SupabaseSiteProfile
    );

    return {
      siteProfile,
      siteConfig: {
        ...fallbackSiteConfig,
        name: siteProfile.ownerName,
        email: siteProfile.email,
        location: siteProfile.location,
        resumePath: siteProfile.resumePath,
        personalGithub: siteProfile.personalGithub,
        sphrGithub: siteProfile.sphrGithub,
        linkedin: siteProfile.linkedin
      },
      projects: ((projectsResponse.data ?? []) as SupabaseProject[]).map(
        mapProject
      ),
      skillCategories: (
        (skillsResponse.data ?? []) as SupabaseSkillCategory[]
      ).map(mapSkillCategory),
      experiences: (
        (experiencesResponse.data ?? []) as SupabaseExperience[]
      ).map(mapExperience),
      achievements: (
        (achievementsResponse.data ?? []) as SupabaseAchievement[]
      ).map(mapAchievement),
      certifications: (
        (certificationsResponse.data ?? []) as SupabaseCertification[]
      ).map(mapCertification)
    };
  } catch {
    return {
      siteConfig: fallbackSiteConfig,
      siteProfile: fallbackSiteProfile,
      projects: fallbackProjects,
      skillCategories: fallbackSkillCategories,
      experiences: fallbackExperiences,
      achievements: fallbackAchievements,
      certifications: fallbackCertifications
    };
  }
}
