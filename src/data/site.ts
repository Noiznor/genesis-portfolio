import type { NavItem, SocialLink } from "@/types";

export const siteConfig = {
  name: "Genesis I. Polotan",
  title: "Genesis I. Polotan | Computer Engineering Portfolio",
  description:
    "Portfolio of Genesis I. Polotan, a Computer Engineering graduate focused on cybersecurity, Automotive Grade Linux, CAN bus analysis, AI edge intelligence, embedded systems, robotics, and software-hardware integration.",
  email: "gpolotan.tech@gmail.com",
  location: "Cebu City, Philippines",
  resumePath: "/Genesis_Polotan_Resume.pdf",
  personalGithub: "https://github.com/GenesisIPolotan",
  sphrGithub: "https://github.com/SPHR-ph",
  linkedin: "#"
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" }
];

export const socialLinks: SocialLink[] = [
  {
    label: "Email",
    href: "mailto:gpolotan.tech@gmail.com"
  },
  {
    label: "Personal GitHub",
    href: "https://github.com/GenesisIPolotan"
  },
  {
    label: "SPHR GitHub Organization",
    href: "https://github.com/SPHR-ph"
  },
  {
    label: "LinkedIn",
    href: "#"
  }
];
