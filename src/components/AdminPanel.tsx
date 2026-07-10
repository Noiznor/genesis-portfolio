"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import type { SiteProfile } from "@/lib/portfolio-data";
import type { Achievement, Certification, Experience, Project, SkillCategory } from "@/types";

type AdminPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  siteProfile: SiteProfile;
  projects: Project[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  achievements: Achievement[];
  certifications: Certification[];
  adminPassword: string;
};

type SaveStatus = "idle" | "saving" | "success" | "error";
type ActiveTab = "site" | "projects" | "skills" | "experiences" | "achievements" | "certifications";

type ProjectFormData = {
  slug: string;
  title: string;
  category: string;
  description: string;
  highlightsText: string;
  techStackText: string;
  overview: string;
  problemSolved: string;
  role: string;
  toolsUsedText: string;
  technicalWorkText: string;
  result: string;
  githubUrl: string;
  documentationUrl: string;
  featuredImageUrl: string;
  sortOrder: number;
};

type SkillCategoryFormData = {
  slug: string;
  title: string;
  description: string;
  skillsText: string;
  sortOrder: number;
};

type ExperienceFormData = {
  slug: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  highlightsText: string;
  featuredImageUrl: string;
  sortOrder: number;
};

type AchievementFormData = {
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
};

type CertificationFormData = {
  slug: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  certificateImageUrl: string;
  description: string;
  sortOrder: number;
};

const emptyProjectForm: ProjectFormData = {
  slug: "",
  title: "",
  category: "",
  description: "",
  highlightsText: "",
  techStackText: "",
  overview: "",
  problemSolved: "",
  role: "",
  toolsUsedText: "",
  technicalWorkText: "",
  result: "",
  githubUrl: "",
  documentationUrl: "",
  featuredImageUrl: "",
  sortOrder: 1
};

const emptySkillCategoryForm: SkillCategoryFormData = {
  slug: "",
  title: "",
  description: "",
  skillsText: "",
  sortOrder: 1
};

const emptyExperienceForm: ExperienceFormData = {
  slug: "",
  title: "",
  organization: "",
  location: "",
  period: "",
  description: "",
  highlightsText: "",
  featuredImageUrl: "",
  sortOrder: 1
};

const emptyAchievementForm: AchievementFormData = {
  slug: "",
  title: "",
  description: "",
  sortOrder: 1
};

const emptyCertificationForm: CertificationFormData = {
  slug: "",
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  certificateImageUrl: "",
  description: "",
  sortOrder: 1
};

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToText(value: string[]) {
  return value.join("\n");
}

function skillsToText(value: SkillCategory["skills"]) {
  return value.map((skill) => skill.name).join("\n");
}

function getProjectLink(project: Project, label: string) {
  return (
    project.links.find(
      (link) => link.label.toLowerCase() === label.toLowerCase()
    )?.href ?? ""
  );
}

function mapProjectToForm(project: Project, index: number): ProjectFormData {
  const documentationUrl = getProjectLink(project, "Documentation");

  return {
    slug: project.id,
    title: project.title,
    category: project.category,
    description: project.description,
    highlightsText: arrayToText(project.highlights),
    techStackText: arrayToText(project.techStack),
    overview: project.overview,
    problemSolved: project.problemSolved,
    role: project.role,
    toolsUsedText: arrayToText(project.toolsUsed),
    technicalWorkText: arrayToText(project.technicalWork),
    result: project.result,
    githubUrl: getProjectLink(project, "GitHub"),
    documentationUrl: documentationUrl === "#" ? "" : documentationUrl,
    featuredImageUrl: project.featuredImageUrl ?? "",
    sortOrder: index + 1
  };
}

function mapSkillCategoryToForm(
  skillCategory: SkillCategory,
  index: number
): SkillCategoryFormData {
  return {
    slug: skillCategory.id,
    title: skillCategory.title,
    description: skillCategory.description,
    skillsText: skillsToText(skillCategory.skills),
    sortOrder: index + 1
  };
}

function mapExperienceToForm(
  experience: Experience,
  index: number
): ExperienceFormData {
  return {
    slug: experience.id,
    title: experience.title,
    organization: experience.organization,
    location: experience.location ?? "",
    period: experience.period ?? "",
    description: experience.description,
    featuredImageUrl: experience.featuredImageUrl ?? "",
    highlightsText: arrayToText(experience.highlights),
    sortOrder: index + 1
  };
}

function mapAchievementToForm(
  achievement: Achievement,
  index: number
): AchievementFormData {
  return {
    slug: achievement.id,
    title: achievement.title,
    description: achievement.description,
    sortOrder: index + 1
  };
}

function mapCertificationToForm(
  certification: Certification,
  index: number
): CertificationFormData {
  return {
    slug: certification.id,
    title: certification.title,
    issuer: certification.issuer,
    issueDate: certification.issueDate ?? "",
    credentialId: certification.credentialId ?? "",
    credentialUrl: certification.credentialUrl ?? "",
    certificateImageUrl: certification.certificateImageUrl ?? "",
    description: certification.description,
    sortOrder: index + 1
  };
}

export function AdminPanel({
  isOpen,
  onClose,
  siteProfile,
  projects,
  skillCategories,
  experiences,
  achievements,
  certifications,
  adminPassword
}: AdminPanelProps) {
  const router = useRouter();
  const hasInitializedOpenPanel = useRef(false);

  const projectForms = useMemo(
    () => projects.map((project, index) => mapProjectToForm(project, index)),
    [projects]
  );

  const skillCategoryForms = useMemo(
    () =>
      skillCategories.map((skillCategory, index) =>
        mapSkillCategoryToForm(skillCategory, index)
      ),
    [skillCategories]
  );

  const experienceForms = useMemo(
    () =>
      experiences.map((experience, index) =>
        mapExperienceToForm(experience, index)
      ),
    [experiences]
  );

  const achievementForms = useMemo(
    () =>
      achievements.map((achievement, index) =>
        mapAchievementToForm(achievement, index)
      ),
    [achievements]
  );

  const certificationForms = useMemo(
    () =>
      certifications.map((certification, index) =>
        mapCertificationToForm(certification, index)
      ),
    [certifications]
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("site");
  const [siteFormData, setSiteFormData] = useState<SiteProfile>(siteProfile);

  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [projectFormData, setProjectFormData] =
    useState<ProjectFormData>(emptyProjectForm);

  const [selectedSkillCategoryIndex, setSelectedSkillCategoryIndex] =
    useState(0);
  const [skillCategoryFormData, setSkillCategoryFormData] =
    useState<SkillCategoryFormData>(emptySkillCategoryForm);

  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);
  const [experienceFormData, setExperienceFormData] =
    useState<ExperienceFormData>(emptyExperienceForm);

  const [selectedAchievementIndex, setSelectedAchievementIndex] = useState(0);
  const [achievementFormData, setAchievementFormData] =
    useState<AchievementFormData>(emptyAchievementForm);

  const [selectedCertificationIndex, setSelectedCertificationIndex] = useState(0);
  const [certificationFormData, setCertificationFormData] =
    useState<CertificationFormData>(emptyCertificationForm);

  const [siteSaveStatus, setSiteSaveStatus] = useState<SaveStatus>("idle");
  const [siteStatusMessage, setSiteStatusMessage] = useState("");

  const [projectSaveStatus, setProjectSaveStatus] =
    useState<SaveStatus>("idle");
  const [projectStatusMessage, setProjectStatusMessage] = useState("");

  const [skillSaveStatus, setSkillSaveStatus] = useState<SaveStatus>("idle");
  const [skillStatusMessage, setSkillStatusMessage] = useState("");

  const [experienceSaveStatus, setExperienceSaveStatus] =
    useState<SaveStatus>("idle");
  const [experienceStatusMessage, setExperienceStatusMessage] = useState("");

  const [achievementSaveStatus, setAchievementSaveStatus] =
    useState<SaveStatus>("idle");
  const [achievementStatusMessage, setAchievementStatusMessage] = useState("");

  const [certificationSaveStatus, setCertificationSaveStatus] =
    useState<SaveStatus>("idle");
  const [certificationStatusMessage, setCertificationStatusMessage] =
    useState("");

  useEffect(() => {
    if (!isOpen) {
      hasInitializedOpenPanel.current = false;
      return;
    }

    setSiteFormData(siteProfile);

    if (!hasInitializedOpenPanel.current) {
      hasInitializedOpenPanel.current = true;
      setActiveTab("site");

      setSelectedProjectIndex(0);
      setProjectFormData(projectForms[0] ?? emptyProjectForm);

      setSelectedSkillCategoryIndex(0);
      setSkillCategoryFormData(
        skillCategoryForms[0] ?? emptySkillCategoryForm
      );

      setSelectedExperienceIndex(0);
      setExperienceFormData(experienceForms[0] ?? emptyExperienceForm);

      setSelectedAchievementIndex(0);
      setAchievementFormData(achievementForms[0] ?? emptyAchievementForm);

      setSelectedCertificationIndex(0);
      setCertificationFormData(certificationForms[0] ?? emptyCertificationForm);

      setSiteSaveStatus("idle");
      setSiteStatusMessage("");
      setProjectSaveStatus("idle");
      setProjectStatusMessage("");
      setSkillSaveStatus("idle");
      setSkillStatusMessage("");
      setExperienceSaveStatus("idle");
      setExperienceStatusMessage("");
      setAchievementSaveStatus("idle");
      setAchievementStatusMessage("");
      setCertificationSaveStatus("idle");
      setCertificationStatusMessage("");
    }
  }, [
    isOpen,
    siteProfile,
    projectForms,
    skillCategoryForms,
    experienceForms,
    achievementForms
  ]);

  useEffect(() => {
    setProjectFormData(projectForms[selectedProjectIndex] ?? emptyProjectForm);
    setProjectSaveStatus("idle");
    setProjectStatusMessage("");
  }, [selectedProjectIndex, projectForms]);

  useEffect(() => {
    setSkillCategoryFormData(
      skillCategoryForms[selectedSkillCategoryIndex] ?? emptySkillCategoryForm
    );
    setSkillSaveStatus("idle");
    setSkillStatusMessage("");
  }, [selectedSkillCategoryIndex, skillCategoryForms]);

  useEffect(() => {
    setExperienceFormData(
      experienceForms[selectedExperienceIndex] ?? emptyExperienceForm
    );
    setExperienceSaveStatus("idle");
    setExperienceStatusMessage("");
  }, [selectedExperienceIndex, experienceForms]);

  useEffect(() => {
    setAchievementFormData(
      achievementForms[selectedAchievementIndex] ?? emptyAchievementForm
    );
    setAchievementSaveStatus("idle");
    setAchievementStatusMessage("");
  }, [selectedAchievementIndex, achievementForms]);

  useEffect(() => {
    setCertificationFormData(
      certificationForms[selectedCertificationIndex] ?? emptyCertificationForm
    );
    setCertificationSaveStatus("idle");
    setCertificationStatusMessage("");
  }, [selectedCertificationIndex, certificationForms]);

  if (!isOpen) return null;

  async function uploadAdminImage(
    event: ChangeEvent<HTMLInputElement>,
    folder: "projects" | "experiences" | "certifications",
    setImageUrl: (url: string) => void,
    setStatus: (status: SaveStatus) => void,
    setMessage: (message: string) => void
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setStatus("saving");
    setMessage("Uploading image to Supabase Storage...");

    try {
      const formData = new FormData();
      formData.append("password", adminPassword);
      formData.append("folder", folder);
      formData.append("file", file);

      const response = await fetch("/api/admin/images", {
        method: "POST",
        body: formData
      });

      const result = (await response.json()) as {
        publicUrl?: string;
        error?: string;
      };

      if (!response.ok || !result.publicUrl) {
        throw new Error(result.error || "Failed to upload image.");
      }

      setImageUrl(result.publicUrl);
      setStatus("success");
      setMessage("Image uploaded. Click Save to store this image URL.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while uploading image."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function deleteAdminImage(
    publicUrl: string,
    setImageUrl: (url: string) => void,
    setStatus: (status: SaveStatus) => void,
    setMessage: (message: string) => void
  ) {
    const cleanUrl = publicUrl.trim();

    if (!cleanUrl) {
      setStatus("error");
      setMessage("There is no image URL to delete or clear.");
      return;
    }

    const confirmed = window.confirm(
      "Delete/clear this image URL? If it was uploaded to Supabase Storage, the file will also be deleted."
    );

    if (!confirmed) return;

    const isSupabaseStorageImage = cleanUrl.includes(
      "/storage/v1/object/public/portfolio-images/"
    );

    setStatus("saving");
    setMessage(
      isSupabaseStorageImage
        ? "Deleting image from Supabase Storage..."
        : "Clearing external image URL..."
    );

    try {
      if (isSupabaseStorageImage) {
        const response = await fetch("/api/admin/images", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password: adminPassword,
            publicUrl: cleanUrl
          })
        });

        const result = (await response.json()) as {
          message?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(result.error || "Failed to delete image.");
        }
      }

      setImageUrl("");
      setStatus("success");
      setMessage("Image URL cleared. Click Save to store the change.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while deleting image."
      );
    }
  }

  async function uploadResumePdf(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSiteSaveStatus("saving");
    setSiteStatusMessage("Uploading resume PDF to Supabase Storage...");

    try {
      const formData = new FormData();
      formData.append("password", adminPassword);
      formData.append("file", file);

      const response = await fetch("/api/admin/resume", {
        method: "POST",
        body: formData
      });

      const result = (await response.json()) as {
        publicUrl?: string;
        path?: string;
        error?: string;
      };

      if (!response.ok || !result.publicUrl || !result.path) {
        throw new Error(result.error || "Failed to upload resume PDF.");
      }

      setSiteFormData((current) => ({
        ...current,
        resumePdfUrl: result.publicUrl,
        resumePdfPath: result.path
      }));

      setSiteSaveStatus("success");
      setSiteStatusMessage("Resume PDF uploaded. Click Save Site Profile to publish it.");
    } catch (error) {
      setSiteSaveStatus("error");
      setSiteStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while uploading resume PDF."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function deleteResumePdf() {
    const resumePdfUrl = siteFormData.resumePdfUrl?.trim() ?? "";
    const resumePdfPath = siteFormData.resumePdfPath?.trim() ?? "";

    if (!resumePdfUrl && !resumePdfPath) {
      setSiteSaveStatus("error");
      setSiteStatusMessage("There is no uploaded resume PDF to delete or clear.");
      return;
    }

    const confirmed = window.confirm(
      "Delete/clear the uploaded resume PDF? If it was uploaded to Supabase Storage, the file will also be deleted."
    );

    if (!confirmed) return;

    setSiteSaveStatus("saving");
    setSiteStatusMessage("Deleting resume PDF from Supabase Storage...");

    try {
      const response = await fetch("/api/admin/resume", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          path: resumePdfPath,
          publicUrl: resumePdfUrl
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete resume PDF.");
      }

      setSiteFormData((current) => ({
        ...current,
        resumePdfUrl: "",
        resumePdfPath: ""
      }));

      setSiteSaveStatus("success");
      setSiteStatusMessage("Resume PDF cleared. Click Save Site Profile to store the change.");
    } catch (error) {
      setSiteSaveStatus("error");
      setSiteStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while deleting resume PDF."
      );
    }
  }

  function updateSiteField(
    field: keyof SiteProfile,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSiteFormData((current) => ({
      ...current,
      [field]: event.target.value
    }));
  }

  function updateProjectField(
    field: keyof ProjectFormData,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value =
      field === "sortOrder" ? Number(event.target.value) : event.target.value;

    setProjectFormData((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateSkillCategoryField(
    field: keyof SkillCategoryFormData,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value =
      field === "sortOrder" ? Number(event.target.value) : event.target.value;

    setSkillCategoryFormData((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateExperienceField(
    field: keyof ExperienceFormData,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value =
      field === "sortOrder" ? Number(event.target.value) : event.target.value;

    setExperienceFormData((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateAchievementField(
    field: keyof AchievementFormData,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value =
      field === "sortOrder" ? Number(event.target.value) : event.target.value;

    setAchievementFormData((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateCertificationField(
    field: keyof CertificationFormData,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value =
      field === "sortOrder" ? Number(event.target.value) : event.target.value;

    setCertificationFormData((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSiteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSiteSaveStatus("saving");
    setSiteStatusMessage("Saving site profile to Supabase...");

    try {
      const response = await fetch("/api/admin/site-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          siteProfile: siteFormData
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to save site profile.");
      }

      setSiteSaveStatus("success");
      setSiteStatusMessage("Site profile saved successfully.");
      router.refresh();
    } catch (error) {
      setSiteSaveStatus("error");
      setSiteStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while saving site profile."
      );
    }
  }

  function createProjectDraft() {
    setProjectFormData({
      ...emptyProjectForm,
      slug: `new-project-${Date.now()}`,
      title: "New Project",
      category: "Project Category",
      description: "Short project description.",
      highlightsText: "First project highlight\nSecond project highlight",
      techStackText: "Next.js\nTypeScript\nSupabase",
      overview: "Write the full project overview here.",
      problemSolved: "Describe the problem this project solves.",
      role: "Describe Genesis' role in this project.",
      toolsUsedText: "Tool 1\nTool 2\nTool 3",
      technicalWorkText: "Technical work item 1\nTechnical work item 2",
      result: "Describe the project result or outcome.",
      githubUrl: "",
      documentationUrl: "",
      featuredImageUrl: "",
      sortOrder: projectForms.length + 1
    });

    setProjectSaveStatus("success");
    setProjectStatusMessage(
      "New project draft created. Fill in the details, then click Save Selected Project."
    );
  }

  async function handleProjectDelete() {
    const slug = projectFormData.slug.trim();

    if (!slug) {
      setProjectSaveStatus("error");
      setProjectStatusMessage("Cannot delete a project without a slug.");
      return;
    }

    const confirmed = window.confirm(
      `Delete project "${projectFormData.title || slug}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setProjectSaveStatus("saving");
    setProjectStatusMessage("Deleting project from Supabase...");

    try {
      const response = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          slug
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete project.");
      }

      setSelectedProjectIndex(0);
      setProjectFormData(projectForms[0] ?? emptyProjectForm);
      setProjectSaveStatus("success");
      setProjectStatusMessage("Project deleted successfully.");
      router.refresh();
    } catch (error) {
      setProjectSaveStatus("error");
      setProjectStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while deleting project."
      );
    }
  }

  async function handleProjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setProjectSaveStatus("saving");
    setProjectStatusMessage("Saving project to Supabase...");

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          project: {
            slug: projectFormData.slug,
            title: projectFormData.title,
            category: projectFormData.category,
            description: projectFormData.description,
            highlights: linesToArray(projectFormData.highlightsText),
            techStack: linesToArray(projectFormData.techStackText),
            overview: projectFormData.overview,
            problemSolved: projectFormData.problemSolved,
            role: projectFormData.role,
            toolsUsed: linesToArray(projectFormData.toolsUsedText),
            technicalWork: linesToArray(projectFormData.technicalWorkText),
            result: projectFormData.result,
            githubUrl: projectFormData.githubUrl,
            documentationUrl: projectFormData.documentationUrl,
            featuredImageUrl: projectFormData.featuredImageUrl,
            sortOrder: projectFormData.sortOrder
          }
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to save project.");
      }

      setProjectSaveStatus("success");
      setProjectStatusMessage("Project saved successfully.");
      router.refresh();
    } catch (error) {
      setProjectSaveStatus("error");
      setProjectStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while saving project."
      );
    }
  }

  function createSkillCategoryDraft() {
    setSkillCategoryFormData({
      ...emptySkillCategoryForm,
      slug: `new-skill-category-${Date.now()}`,
      title: "New Skill Category",
      description: "Write the skill category description here.",
      skillsText: "Skill One\nSkill Two\nSkill Three",
      sortOrder: skillCategoryForms.length + 1
    });

    setSkillSaveStatus("success");
    setSkillStatusMessage(
      "New skill category draft created. Fill in the details, then click Save Skill Category."
    );
  }

  async function handleSkillCategoryDelete() {
    const slug = skillCategoryFormData.slug.trim();

    if (!slug) {
      setSkillSaveStatus("error");
      setSkillStatusMessage("Cannot delete a skill category without a slug.");
      return;
    }

    const confirmed = window.confirm(
      `Delete skill category "${skillCategoryFormData.title || slug}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setSkillSaveStatus("saving");
    setSkillStatusMessage("Deleting skill category from Supabase...");

    try {
      const response = await fetch("/api/admin/skill-categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          slug
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete skill category.");
      }

      setSelectedSkillCategoryIndex(0);
      setSkillCategoryFormData(skillCategoryForms[0] ?? emptySkillCategoryForm);
      setSkillSaveStatus("success");
      setSkillStatusMessage("Skill category deleted successfully.");
      router.refresh();
    } catch (error) {
      setSkillSaveStatus("error");
      setSkillStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while deleting skill category."
      );
    }
  }

  async function handleSkillCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSkillSaveStatus("saving");
    setSkillStatusMessage("Saving skill category to Supabase...");

    try {
      const response = await fetch("/api/admin/skill-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          skillCategory: {
            slug: skillCategoryFormData.slug,
            title: skillCategoryFormData.title,
            description: skillCategoryFormData.description,
            skills: linesToArray(skillCategoryFormData.skillsText),
            sortOrder: skillCategoryFormData.sortOrder
          }
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to save skill category.");
      }

      setSkillSaveStatus("success");
      setSkillStatusMessage("Skill category saved successfully.");
      router.refresh();
    } catch (error) {
      setSkillSaveStatus("error");
      setSkillStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while saving skill category."
      );
    }
  }

  function createExperienceDraft() {
    setExperienceFormData({
      ...emptyExperienceForm,
      slug: `new-experience-${Date.now()}`,
      title: "New Experience",
      organization: "Organization Name",
      location: "",
      period: "",
      description: "Write the experience description here.",
      featuredImageUrl: "",
      highlightsText: "First experience highlight\nSecond experience highlight",
      sortOrder: experienceForms.length + 1
    });

    setExperienceSaveStatus("success");
    setExperienceStatusMessage(
      "New experience draft created. Fill in the details, then click Save Experience."
    );
  }

  async function handleExperienceDelete() {
    const slug = experienceFormData.slug.trim();

    if (!slug) {
      setExperienceSaveStatus("error");
      setExperienceStatusMessage("Cannot delete an experience without a slug.");
      return;
    }

    const confirmed = window.confirm(
      `Delete experience "${experienceFormData.title || slug}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setExperienceSaveStatus("saving");
    setExperienceStatusMessage("Deleting experience from Supabase...");

    try {
      const response = await fetch("/api/admin/experiences", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          slug
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete experience.");
      }

      setSelectedExperienceIndex(0);
      setExperienceFormData(experienceForms[0] ?? emptyExperienceForm);
      setExperienceSaveStatus("success");
      setExperienceStatusMessage("Experience deleted successfully.");
      router.refresh();
    } catch (error) {
      setExperienceSaveStatus("error");
      setExperienceStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while deleting experience."
      );
    }
  }

  async function handleExperienceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setExperienceSaveStatus("saving");
    setExperienceStatusMessage("Saving experience to Supabase...");

    try {
      const response = await fetch("/api/admin/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          experience: {
            slug: experienceFormData.slug,
            title: experienceFormData.title,
            organization: experienceFormData.organization,
            location: experienceFormData.location,
            period: experienceFormData.period,
            description: experienceFormData.description,
            highlights: linesToArray(experienceFormData.highlightsText),
            featuredImageUrl: experienceFormData.featuredImageUrl,
            sortOrder: experienceFormData.sortOrder
          }
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to save experience.");
      }

      setExperienceSaveStatus("success");
      setExperienceStatusMessage("Experience saved successfully.");
      router.refresh();
    } catch (error) {
      setExperienceSaveStatus("error");
      setExperienceStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while saving experience."
      );
    }
  }

  function createAchievementDraft() {
    setAchievementFormData({
      ...emptyAchievementForm,
      slug: `new-achievement-${Date.now()}`,
      title: "New Achievement",
      description: "Write the achievement description here.",
      sortOrder: achievementForms.length + 1
    });

    setAchievementSaveStatus("success");
    setAchievementStatusMessage(
      "New achievement draft created. Fill in the details, then click Save Achievement."
    );
  }

  async function handleAchievementDelete() {
    const slug = achievementFormData.slug.trim();

    if (!slug) {
      setAchievementSaveStatus("error");
      setAchievementStatusMessage("Cannot delete an achievement without a slug.");
      return;
    }

    const confirmed = window.confirm(
      `Delete achievement "${achievementFormData.title || slug}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setAchievementSaveStatus("saving");
    setAchievementStatusMessage("Deleting achievement from Supabase...");

    try {
      const response = await fetch("/api/admin/achievements", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          slug
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete achievement.");
      }

      setSelectedAchievementIndex(0);
      setAchievementFormData(achievementForms[0] ?? emptyAchievementForm);
      setAchievementSaveStatus("success");
      setAchievementStatusMessage("Achievement deleted successfully.");
      router.refresh();
    } catch (error) {
      setAchievementSaveStatus("error");
      setAchievementStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while deleting achievement."
      );
    }
  }

  async function handleAchievementSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAchievementSaveStatus("saving");
    setAchievementStatusMessage("Saving achievement to Supabase...");

    try {
      const response = await fetch("/api/admin/achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          achievement: {
            slug: achievementFormData.slug,
            title: achievementFormData.title,
            description: achievementFormData.description,
            sortOrder: achievementFormData.sortOrder
          }
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to save achievement.");
      }

      setAchievementSaveStatus("success");
      setAchievementStatusMessage("Achievement saved successfully.");
      router.refresh();
    } catch (error) {
      setAchievementSaveStatus("error");
      setAchievementStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while saving achievement."
      );
    }
  }

  function createCertificationDraft() {
    setCertificationFormData({
      ...emptyCertificationForm,
      slug: `new-certification-${Date.now()}`,
      title: "New Certification",
      issuer: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
      certificateImageUrl: "",
      description: "Write the certification description here.",
      sortOrder: certificationForms.length + 1
    });

    setCertificationSaveStatus("success");
    setCertificationStatusMessage(
      "New certification draft created. Fill in the details, then click Save Certification."
    );
  }

  async function handleCertificationDelete() {
    const slug = certificationFormData.slug.trim();

    if (!slug) {
      setCertificationSaveStatus("error");
      setCertificationStatusMessage("Cannot delete a certification without a slug.");
      return;
    }

    const confirmed = window.confirm(
      `Delete certification "${certificationFormData.title || slug}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setCertificationSaveStatus("saving");
    setCertificationStatusMessage("Deleting certification from Supabase...");

    try {
      const response = await fetch("/api/admin/certifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          slug
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete certification.");
      }

      setSelectedCertificationIndex(0);
      setCertificationFormData(certificationForms[0] ?? emptyCertificationForm);
      setCertificationSaveStatus("success");
      setCertificationStatusMessage("Certification deleted successfully.");
      router.refresh();
    } catch (error) {
      setCertificationSaveStatus("error");
      setCertificationStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while deleting certification."
      );
    }
  }

  async function handleCertificationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCertificationSaveStatus("saving");
    setCertificationStatusMessage("Saving certification to Supabase...");

    try {
      const response = await fetch("/api/admin/certifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: adminPassword,
          certification: certificationFormData
        })
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to save certification.");
      }

      setCertificationSaveStatus("success");
      setCertificationStatusMessage("Certification saved successfully.");
      router.refresh();
    } catch (error) {
      setCertificationSaveStatus("error");
      setCertificationStatusMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while saving certification."
      );
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20";

  const labelClass =
    "text-xs font-bold uppercase tracking-[0.16em] text-slate-400";

  const tabClass = (tab: ActiveTab) =>
    `rounded-xl px-4 py-2 text-sm font-bold transition ${
      activeTab === tab
        ? "bg-emerald-400 text-slate-950"
        : "border border-slate-700 text-slate-300 hover:border-emerald-400/50 hover:text-emerald-200"
    }`;

  const statusClass = (status: SaveStatus) =>
    `rounded-xl border px-4 py-3 text-sm ${
      status === "success"
        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
        : status === "error"
          ? "border-red-400/30 bg-red-400/10 text-red-200"
          : "border-sky-400/30 bg-sky-400/10 text-sky-200"
    }`;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/85 px-4 py-8 backdrop-blur">
      <div className="mx-auto max-w-6xl rounded-2xl border border-emerald-400/20 bg-slate-950 shadow-2xl shadow-emerald-500/10">
        <div className="flex flex-col gap-4 border-b border-emerald-400/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
              Admin Editor
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-50">
              Portfolio Content Editor
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Saves go directly to Supabase using protected server API routes.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-red-400/60 hover:bg-red-400/10 hover:text-red-200"
          >
            Close
          </button>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-emerald-400/10 p-6">
          <button type="button" onClick={() => setActiveTab("site")} className={tabClass("site")}>
            Site Profile
          </button>

          <button type="button" onClick={() => setActiveTab("projects")} className={tabClass("projects")}>
            Projects
          </button>

          <button type="button" onClick={() => setActiveTab("skills")} className={tabClass("skills")}>
            Skills
          </button>

          <button type="button" onClick={() => setActiveTab("experiences")} className={tabClass("experiences")}>
            Experiences
          </button>

          <button type="button" onClick={() => setActiveTab("achievements")} className={tabClass("achievements")}>
            Achievements
          </button>

          <button type="button" onClick={() => setActiveTab("certifications")} className={tabClass("certifications")}>
            Certifications
          </button>
        </div>

        {activeTab === "site" ? (
          <form onSubmit={handleSiteSubmit} className="space-y-8 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="ownerName" className={labelClass}>Owner Name</label>
                <input id="ownerName" value={siteFormData.ownerName} onChange={(event) => updateSiteField("ownerName", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input id="email" type="email" value={siteFormData.email} onChange={(event) => updateSiteField("email", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>Location</label>
                <input id="location" value={siteFormData.location} onChange={(event) => updateSiteField("location", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="resumePath" className={labelClass}>Resume Fallback Path</label>
                <input id="resumePath" value={siteFormData.resumePath} onChange={(event) => updateSiteField("resumePath", event)} className={inputClass} required />
                <p className="mt-2 text-xs text-slate-500">
                  Used only when no Supabase resume PDF is uploaded.
                </p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="resumePdfUrl" className={labelClass}>Uploaded Resume PDF URL</label>
                <input id="resumePdfUrl" value={siteFormData.resumePdfUrl ?? ""} onChange={(event) => updateSiteField("resumePdfUrl", event)} placeholder="Upload a PDF or paste a public PDF URL" className={inputClass} />

                <input type="hidden" value={siteFormData.resumePdfPath ?? ""} readOnly />

                <div className="mt-3 flex flex-wrap gap-3">
                  <label htmlFor="resumePdfUpload" className="inline-flex cursor-pointer rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-2 text-xs font-bold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10">
                    Upload Resume PDF
                    <input id="resumePdfUpload" type="file" accept="application/pdf" className="hidden" onChange={uploadResumePdf} />
                  </label>

                  <button type="button" onClick={deleteResumePdf} className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-2 text-xs font-bold text-red-200 transition hover:border-red-300 hover:bg-red-400/10">
                    Delete / Clear Resume PDF
                  </button>

                  {(siteFormData.resumePdfUrl || siteFormData.resumePath) ? (
                    <a href={siteFormData.resumePdfUrl || siteFormData.resumePath} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-600 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200">
                      Preview Current Resume
                    </a>
                  ) : null}
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  After uploading or clearing the PDF, click Save Site Profile to publish the change.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-5">
              <h3 className="text-lg font-bold text-slate-100">Hero Section</h3>

              <div className="mt-5 space-y-5">
                <div>
                  <label htmlFor="heroEyebrow" className={labelClass}>Hero Eyebrow</label>
                  <input id="heroEyebrow" value={siteFormData.heroEyebrow} onChange={(event) => updateSiteField("heroEyebrow", event)} className={inputClass} required />
                </div>

                <div>
                  <label htmlFor="heroTitle" className={labelClass}>Hero Title</label>
                  <input id="heroTitle" value={siteFormData.heroTitle} onChange={(event) => updateSiteField("heroTitle", event)} className={inputClass} required />
                </div>

                <div>
                  <label htmlFor="heroSubtitle" className={labelClass}>Hero Subtitle</label>
                  <textarea id="heroSubtitle" value={siteFormData.heroSubtitle} onChange={(event) => updateSiteField("heroSubtitle", event)} rows={2} className={inputClass} required />
                </div>

                <div>
                  <label htmlFor="heroDescription" className={labelClass}>Hero Description</label>
                  <textarea id="heroDescription" value={siteFormData.heroDescription} onChange={(event) => updateSiteField("heroDescription", event)} rows={4} className={inputClass} required />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-5">
              <h3 className="text-lg font-bold text-slate-100">About Section</h3>

              <div className="mt-5 space-y-5">
                <div>
                  <label htmlFor="aboutTitle" className={labelClass}>About Title</label>
                  <input id="aboutTitle" value={siteFormData.aboutTitle} onChange={(event) => updateSiteField("aboutTitle", event)} className={inputClass} required />
                </div>

                <div>
                  <label htmlFor="aboutBody" className={labelClass}>About Body</label>
                  <textarea id="aboutBody" value={siteFormData.aboutBody} onChange={(event) => updateSiteField("aboutBody", event)} rows={5} className={inputClass} required />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-5">
              <h3 className="text-lg font-bold text-slate-100">Links</h3>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div>
                  <label htmlFor="personalGithub" className={labelClass}>Personal GitHub</label>
                  <input id="personalGithub" value={siteFormData.personalGithub} onChange={(event) => updateSiteField("personalGithub", event)} className={inputClass} required />
                </div>

                <div>
                  <label htmlFor="sphrGithub" className={labelClass}>SPHR GitHub</label>
                  <input id="sphrGithub" value={siteFormData.sphrGithub} onChange={(event) => updateSiteField("sphrGithub", event)} className={inputClass} required />
                </div>

                <div>
                  <label htmlFor="linkedin" className={labelClass}>LinkedIn</label>
                  <input id="linkedin" value={siteFormData.linkedin} onChange={(event) => updateSiteField("linkedin", event)} className={inputClass} required />
                </div>
              </div>
            </div>

            {siteStatusMessage ? <div className={statusClass(siteSaveStatus)}>{siteStatusMessage}</div> : null}

            <div className="flex flex-col gap-3 border-t border-emerald-400/10 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-5 text-slate-500">This tab updates the main site profile content.</p>
              <button type="submit" disabled={siteSaveStatus === "saving"} className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
                {siteSaveStatus === "saving" ? "Saving..." : "Save Site Profile"}
              </button>
            </div>
          </form>
        ) : activeTab === "projects" ? (
          <form onSubmit={handleProjectSubmit} className="space-y-8 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <label htmlFor="projectSelect" className={labelClass}>Select Project</label>
                <select id="projectSelect" value={selectedProjectIndex} onChange={(event) => setSelectedProjectIndex(Number(event.target.value))} className={inputClass}>
                  {projectForms.map((project, index) => (
                    <option key={project.slug} value={index}>
                      {project.sortOrder}. {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={createProjectDraft} className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400/10">
                New Project
              </button>

              <button type="button" onClick={handleProjectDelete} disabled={projectSaveStatus === "saving" || projectFormData.slug.trim().length === 0} className="rounded-xl border border-red-400/30 bg-red-400/5 px-5 py-3 text-sm font-bold text-red-200 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                Delete Selected
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="projectSlug" className={labelClass}>Slug</label>
                <input id="projectSlug" value={projectFormData.slug} onChange={(event) => updateProjectField("slug", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="projectSortOrder" className={labelClass}>Sort Order</label>
                <input id="projectSortOrder" type="number" min={1} value={projectFormData.sortOrder} onChange={(event) => updateProjectField("sortOrder", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="projectTitle" className={labelClass}>Title</label>
                <input id="projectTitle" value={projectFormData.title} onChange={(event) => updateProjectField("title", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="projectCategory" className={labelClass}>Category</label>
                <input id="projectCategory" value={projectFormData.category} onChange={(event) => updateProjectField("category", event)} className={inputClass} required />
              </div>
            </div>

            <div>
              <label htmlFor="projectDescription" className={labelClass}>Card Description</label>
              <textarea id="projectDescription" value={projectFormData.description} onChange={(event) => updateProjectField("description", event)} rows={3} className={inputClass} required />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="projectHighlights" className={labelClass}>Highlights — one per line</label>
                <textarea id="projectHighlights" value={projectFormData.highlightsText} onChange={(event) => updateProjectField("highlightsText", event)} rows={6} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="projectTechStack" className={labelClass}>Tech Stack — one per line</label>
                <textarea id="projectTechStack" value={projectFormData.techStackText} onChange={(event) => updateProjectField("techStackText", event)} rows={6} className={inputClass} required />
              </div>
            </div>

            <div>
              <label htmlFor="projectOverview" className={labelClass}>Modal Overview</label>
              <textarea id="projectOverview" value={projectFormData.overview} onChange={(event) => updateProjectField("overview", event)} rows={4} className={inputClass} required />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="projectProblemSolved" className={labelClass}>Problem Solved</label>
                <textarea id="projectProblemSolved" value={projectFormData.problemSolved} onChange={(event) => updateProjectField("problemSolved", event)} rows={4} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="projectRole" className={labelClass}>My Role</label>
                <textarea id="projectRole" value={projectFormData.role} onChange={(event) => updateProjectField("role", event)} rows={4} className={inputClass} required />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="projectToolsUsed" className={labelClass}>Tools Used — one per line</label>
                <textarea id="projectToolsUsed" value={projectFormData.toolsUsedText} onChange={(event) => updateProjectField("toolsUsedText", event)} rows={6} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="projectTechnicalWork" className={labelClass}>Technical Work — one per line</label>
                <textarea id="projectTechnicalWork" value={projectFormData.technicalWorkText} onChange={(event) => updateProjectField("technicalWorkText", event)} rows={6} className={inputClass} required />
              </div>
            </div>

            <div>
              <label htmlFor="projectResult" className={labelClass}>Result / Learning Outcome</label>
              <textarea id="projectResult" value={projectFormData.result} onChange={(event) => updateProjectField("result", event)} rows={4} className={inputClass} required />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="projectGithubUrl" className={labelClass}>GitHub URL</label>
                <input id="projectGithubUrl" value={projectFormData.githubUrl} onChange={(event) => updateProjectField("githubUrl", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="projectDocumentationUrl" className={labelClass}>Documentation URL</label>
                <input id="projectDocumentationUrl" value={projectFormData.documentationUrl} onChange={(event) => updateProjectField("documentationUrl", event)} placeholder="Leave blank to disable documentation button" className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="projectFeaturedImageUrl" className={labelClass}>Featured Image URL</label>
                <input id="projectFeaturedImageUrl" value={projectFormData.featuredImageUrl} onChange={(event) => updateProjectField("featuredImageUrl", event)} placeholder="Optional public image URL for project card" className={inputClass} />

                <div className="mt-3 flex flex-wrap gap-3">
                  <label htmlFor="projectImageUpload" className="inline-flex cursor-pointer rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-2 text-xs font-bold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10">
                    Upload Image
                    <input id="projectImageUpload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => uploadAdminImage(event, "projects", (url) => setProjectFormData((current) => ({ ...current, featuredImageUrl: url })), setProjectSaveStatus, setProjectStatusMessage)} />
                  </label>

                  <button type="button" onClick={() => deleteAdminImage(projectFormData.featuredImageUrl, (url) => setProjectFormData((current) => ({ ...current, featuredImageUrl: url })), setProjectSaveStatus, setProjectStatusMessage)} className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-2 text-xs font-bold text-red-200 transition hover:border-red-300 hover:bg-red-400/10">
                    Delete / Clear Image
                  </button>
                </div>
              </div>
            </div>

            {projectStatusMessage ? <div className={statusClass(projectSaveStatus)}>{projectStatusMessage}</div> : null}

            <div className="flex flex-col gap-3 border-t border-emerald-400/10 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-5 text-slate-500">This tab can create, update, and delete projects.</p>
              <button type="submit" disabled={projectSaveStatus === "saving"} className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
                {projectSaveStatus === "saving" ? "Saving..." : "Save Selected Project"}
              </button>
            </div>
          </form>
        ) : activeTab === "skills" ? (
          <form onSubmit={handleSkillCategorySubmit} className="space-y-8 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <label htmlFor="skillSelect" className={labelClass}>Select Skill Category</label>
                <select id="skillSelect" value={selectedSkillCategoryIndex} onChange={(event) => setSelectedSkillCategoryIndex(Number(event.target.value))} className={inputClass}>
                  {skillCategoryForms.map((skillCategory, index) => (
                    <option key={skillCategory.slug} value={index}>
                      {skillCategory.sortOrder}. {skillCategory.title}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={createSkillCategoryDraft} className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400/10">
                New Skill Category
              </button>

              <button type="button" onClick={handleSkillCategoryDelete} disabled={skillSaveStatus === "saving" || skillCategoryFormData.slug.trim().length === 0} className="rounded-xl border border-red-400/30 bg-red-400/5 px-5 py-3 text-sm font-bold text-red-200 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                Delete Selected
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="skillSlug" className={labelClass}>Slug</label>
                <input id="skillSlug" value={skillCategoryFormData.slug} onChange={(event) => updateSkillCategoryField("slug", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="skillSortOrder" className={labelClass}>Sort Order</label>
                <input id="skillSortOrder" type="number" min={1} value={skillCategoryFormData.sortOrder} onChange={(event) => updateSkillCategoryField("sortOrder", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="skillTitle" className={labelClass}>Title</label>
                <input id="skillTitle" value={skillCategoryFormData.title} onChange={(event) => updateSkillCategoryField("title", event)} className={inputClass} required />
              </div>
            </div>

            <div>
              <label htmlFor="skillDescription" className={labelClass}>Description</label>
              <textarea id="skillDescription" value={skillCategoryFormData.description} onChange={(event) => updateSkillCategoryField("description", event)} rows={4} className={inputClass} required />
            </div>

            <div>
              <label htmlFor="skillList" className={labelClass}>Skills — one per line</label>
              <textarea id="skillList" value={skillCategoryFormData.skillsText} onChange={(event) => updateSkillCategoryField("skillsText", event)} rows={10} className={inputClass} required />
            </div>

            {skillStatusMessage ? <div className={statusClass(skillSaveStatus)}>{skillStatusMessage}</div> : null}

            <div className="flex flex-col gap-3 border-t border-emerald-400/10 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-5 text-slate-500">This tab can create, update, and delete skill categories.</p>
              <button type="submit" disabled={skillSaveStatus === "saving"} className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
                {skillSaveStatus === "saving" ? "Saving..." : "Save Skill Category"}
              </button>
            </div>
          </form>
        ) : activeTab === "experiences" ? (
          <form onSubmit={handleExperienceSubmit} className="space-y-8 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <label htmlFor="experienceSelect" className={labelClass}>Select Experience</label>
                <select id="experienceSelect" value={selectedExperienceIndex} onChange={(event) => setSelectedExperienceIndex(Number(event.target.value))} className={inputClass}>
                  {experienceForms.map((experience, index) => (
                    <option key={experience.slug} value={index}>
                      {experience.sortOrder}. {experience.title}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={createExperienceDraft} className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400/10">
                New Experience
              </button>

              <button type="button" onClick={handleExperienceDelete} disabled={experienceSaveStatus === "saving" || experienceFormData.slug.trim().length === 0} className="rounded-xl border border-red-400/30 bg-red-400/5 px-5 py-3 text-sm font-bold text-red-200 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                Delete Selected
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="experienceSlug" className={labelClass}>Slug</label>
                <input id="experienceSlug" value={experienceFormData.slug} onChange={(event) => updateExperienceField("slug", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="experienceSortOrder" className={labelClass}>Sort Order</label>
                <input id="experienceSortOrder" type="number" min={1} value={experienceFormData.sortOrder} onChange={(event) => updateExperienceField("sortOrder", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="experienceTitle" className={labelClass}>Title</label>
                <input id="experienceTitle" value={experienceFormData.title} onChange={(event) => updateExperienceField("title", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="experienceOrganization" className={labelClass}>Organization</label>
                <input id="experienceOrganization" value={experienceFormData.organization} onChange={(event) => updateExperienceField("organization", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="experienceLocation" className={labelClass}>Location</label>
                <input id="experienceLocation" value={experienceFormData.location} onChange={(event) => updateExperienceField("location", event)} className={inputClass} />
              </div>

              <div>
                <label htmlFor="experiencePeriod" className={labelClass}>Period</label>
                <input id="experiencePeriod" value={experienceFormData.period} onChange={(event) => updateExperienceField("period", event)} className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="experienceDescription" className={labelClass}>Description</label>
              <textarea id="experienceDescription" value={experienceFormData.description} onChange={(event) => updateExperienceField("description", event)} rows={4} className={inputClass} required />
            </div>

            <div>
              <label htmlFor="experienceFeaturedImageUrl" className={labelClass}>Featured Image URL</label>
              <input id="experienceFeaturedImageUrl" value={experienceFormData.featuredImageUrl} onChange={(event) => updateExperienceField("featuredImageUrl", event)} placeholder="Optional public image URL for experience card" className={inputClass} />

              <div className="mt-3 flex flex-wrap gap-3">
                <label htmlFor="experienceImageUpload" className="inline-flex cursor-pointer rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-2 text-xs font-bold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10">
                  Upload Image
                  <input id="experienceImageUpload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => uploadAdminImage(event, "experiences", (url) => setExperienceFormData((current) => ({ ...current, featuredImageUrl: url })), setExperienceSaveStatus, setExperienceStatusMessage)} />
                </label>

                <button type="button" onClick={() => deleteAdminImage(experienceFormData.featuredImageUrl, (url) => setExperienceFormData((current) => ({ ...current, featuredImageUrl: url })), setExperienceSaveStatus, setExperienceStatusMessage)} className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-2 text-xs font-bold text-red-200 transition hover:border-red-300 hover:bg-red-400/10">
                  Delete / Clear Image
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="experienceHighlights" className={labelClass}>Highlights — one per line</label>
              <textarea id="experienceHighlights" value={experienceFormData.highlightsText} onChange={(event) => updateExperienceField("highlightsText", event)} rows={8} className={inputClass} required />
            </div>

            {experienceStatusMessage ? <div className={statusClass(experienceSaveStatus)}>{experienceStatusMessage}</div> : null}

            <div className="flex flex-col gap-3 border-t border-emerald-400/10 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-5 text-slate-500">This tab can create, update, and delete experiences.</p>
              <button type="submit" disabled={experienceSaveStatus === "saving"} className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
                {experienceSaveStatus === "saving" ? "Saving..." : "Save Experience"}
              </button>
            </div>
          </form>
        ) : activeTab === "achievements" ? (
          <form onSubmit={handleAchievementSubmit} className="space-y-8 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <label htmlFor="achievementSelect" className={labelClass}>Select Achievement</label>
                <select id="achievementSelect" value={selectedAchievementIndex} onChange={(event) => setSelectedAchievementIndex(Number(event.target.value))} className={inputClass}>
                  {achievementForms.map((achievement, index) => (
                    <option key={achievement.slug} value={index}>
                      {achievement.sortOrder}. {achievement.title}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={createAchievementDraft} className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400/10">
                New Achievement
              </button>

              <button type="button" onClick={handleAchievementDelete} disabled={achievementSaveStatus === "saving" || achievementFormData.slug.trim().length === 0} className="rounded-xl border border-red-400/30 bg-red-400/5 px-5 py-3 text-sm font-bold text-red-200 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                Delete Selected
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="achievementSlug" className={labelClass}>Slug</label>
                <input id="achievementSlug" value={achievementFormData.slug} onChange={(event) => updateAchievementField("slug", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="achievementSortOrder" className={labelClass}>Sort Order</label>
                <input id="achievementSortOrder" type="number" min={1} value={achievementFormData.sortOrder} onChange={(event) => updateAchievementField("sortOrder", event)} className={inputClass} required />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="achievementTitle" className={labelClass}>Title</label>
                <input id="achievementTitle" value={achievementFormData.title} onChange={(event) => updateAchievementField("title", event)} className={inputClass} required />
              </div>
            </div>

            <div>
              <label htmlFor="achievementDescription" className={labelClass}>Description</label>
              <textarea id="achievementDescription" value={achievementFormData.description} onChange={(event) => updateAchievementField("description", event)} rows={5} className={inputClass} required />
            </div>

            {achievementStatusMessage ? <div className={statusClass(achievementSaveStatus)}>{achievementStatusMessage}</div> : null}

            <div className="flex flex-col gap-3 border-t border-emerald-400/10 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-5 text-slate-500">This tab can create, update, and delete achievements.</p>
              <button type="submit" disabled={achievementSaveStatus === "saving"} className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
                {achievementSaveStatus === "saving" ? "Saving..." : "Save Achievement"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCertificationSubmit} className="space-y-8 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <label htmlFor="certificationSelect" className={labelClass}>Select Certification</label>
                <select id="certificationSelect" value={selectedCertificationIndex} onChange={(event) => setSelectedCertificationIndex(Number(event.target.value))} className={inputClass}>
                  {certificationForms.map((certification, index) => (
                    <option key={certification.slug} value={index}>
                      {certification.sortOrder}. {certification.title}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={createCertificationDraft} className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400/10">
                New Certification
              </button>

              <button type="button" onClick={handleCertificationDelete} disabled={certificationSaveStatus === "saving" || certificationFormData.slug.trim().length === 0} className="rounded-xl border border-red-400/30 bg-red-400/5 px-5 py-3 text-sm font-bold text-red-200 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                Delete Selected
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="certificationSlug" className={labelClass}>Slug</label>
                <input id="certificationSlug" value={certificationFormData.slug} onChange={(event) => updateCertificationField("slug", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="certificationSortOrder" className={labelClass}>Sort Order</label>
                <input id="certificationSortOrder" type="number" min={1} value={certificationFormData.sortOrder} onChange={(event) => updateCertificationField("sortOrder", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="certificationTitle" className={labelClass}>Title</label>
                <input id="certificationTitle" value={certificationFormData.title} onChange={(event) => updateCertificationField("title", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="certificationIssuer" className={labelClass}>Issuer</label>
                <input id="certificationIssuer" value={certificationFormData.issuer} onChange={(event) => updateCertificationField("issuer", event)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="certificationIssueDate" className={labelClass}>Issue Date</label>
                <input id="certificationIssueDate" value={certificationFormData.issueDate} onChange={(event) => updateCertificationField("issueDate", event)} placeholder="Example: 2025 or June 2025" className={inputClass} />
              </div>

              <div>
                <label htmlFor="certificationCredentialId" className={labelClass}>Credential ID</label>
                <input id="certificationCredentialId" value={certificationFormData.credentialId} onChange={(event) => updateCertificationField("credentialId", event)} placeholder="Optional" className={inputClass} />
              </div>

              <div>
                <label htmlFor="certificationCredentialUrl" className={labelClass}>Credential URL</label>
                <input id="certificationCredentialUrl" value={certificationFormData.credentialUrl} onChange={(event) => updateCertificationField("credentialUrl", event)} placeholder="Optional verification link" className={inputClass} />
              </div>

              <div>
                <label htmlFor="certificationImageUrl" className={labelClass}>Certificate Image URL</label>
                <input id="certificationImageUrl" value={certificationFormData.certificateImageUrl} onChange={(event) => updateCertificationField("certificateImageUrl", event)} placeholder="Optional image URL for now" className={inputClass} />

                <div className="mt-3 flex flex-wrap gap-3">
                  <label htmlFor="certificationImageUpload" className="inline-flex cursor-pointer rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-2 text-xs font-bold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10">
                    Upload Image
                    <input id="certificationImageUpload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => uploadAdminImage(event, "certifications", (url) => setCertificationFormData((current) => ({ ...current, certificateImageUrl: url })), setCertificationSaveStatus, setCertificationStatusMessage)} />
                  </label>

                  <button type="button" onClick={() => deleteAdminImage(certificationFormData.certificateImageUrl, (url) => setCertificationFormData((current) => ({ ...current, certificateImageUrl: url })), setCertificationSaveStatus, setCertificationStatusMessage)} className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-2 text-xs font-bold text-red-200 transition hover:border-red-300 hover:bg-red-400/10">
                    Delete / Clear Image
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="certificationDescription" className={labelClass}>Description</label>
              <textarea id="certificationDescription" value={certificationFormData.description} onChange={(event) => updateCertificationField("description", event)} rows={5} className={inputClass} required />
            </div>

            {certificationStatusMessage ? <div className={statusClass(certificationSaveStatus)}>{certificationStatusMessage}</div> : null}

            <div className="flex flex-col gap-3 border-t border-emerald-400/10 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-5 text-slate-500">This tab can create, update, and delete certifications. Image upload will be added later using Supabase Storage.</p>
              <button type="submit" disabled={certificationSaveStatus === "saving"} className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
                {certificationSaveStatus === "saving" ? "Saving..." : "Save Certification"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
