"use client";

import { createContext, useContext } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
}

interface SkillGroup {
  title: string;
  items: string[];
}

interface ExperienceItem {
  period: string;
  title: string;
  company: string;
  description: string;
}

interface ProjectItem {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
}

interface HeroStat {
  title: string;
  value: string;
}

interface HomeContextProps {
  navItems: NavItem[];
  socialLinks: SocialLink[];
  skillGroups: SkillGroup[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  achievements: string[];
  blogs: string[];
  heroStats: HeroStat[];
}

const homeContent: HomeContextProps = {
  navItems: [
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Achievements", href: "#achievements" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Email", href: "mailto:hello@example.com" },
    { label: "Resume", href: "#" },
  ],
  skillGroups: [
    {
      title: "Frontend",
      items: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Responsive UI",
      ],
    },
    {
      title: "Backend",
      items: ["Node.js", "REST API", "Clean Architecture", "Auth Flow"],
    },
    {
      title: "Workflow",
      items: ["Git", "CI/CD", "Docker", "Agile Delivery", "System Design"],
    },
  ],
  experiences: [
    {
      period: "2024 - Now",
      title: "Frontend Engineer",
      company: "Independent Contributor",
      description:
        "Building polished web interfaces, dashboard flows, and reusable UI architecture for product teams and personal products.",
    },
    {
      period: "2022 - 2024",
      title: "Full Stack Developer",
      company: "Digital Product Studio",
      description:
        "Delivered internal tools, marketing sites, and API integrations with a focus on performance, maintainability, and smooth collaboration.",
    },
    {
      period: "2020 - 2022",
      title: "Software Developer",
      company: "Freelance Projects",
      description:
        "Helped clients turn ideas into production-ready websites, from discovery and design handoff to deployment and iteration.",
    },
  ],
  projects: [
    {
      title: "Developer Portfolio",
      subtitle: "Personal brand website",
      description:
        "A bold one-page portfolio inspired by DeveloperFolio with fast loading, strong hierarchy, and clear storytelling.",
      stack: ["Next.js", "TypeScript", "Tailwind"],
    },
    {
      title: "Auth Starter Kit",
      subtitle: "Reusable application module",
      description:
        "Authentication flow with login, register, local persistence, and service-oriented architecture for quick project setup.",
      stack: ["React", "Clean Architecture", "Axios"],
    },
    {
      title: "Design System Blocks",
      subtitle: "UI foundation",
      description:
        "Reusable cards, buttons, sections, and layout utilities for consistent product delivery across multiple pages.",
      stack: ["Tailwind", "Component Patterns", "Accessibility"],
    },
  ],
  achievements: [
    "Shipped responsive web experiences across landing pages, product modules, and internal dashboards.",
    "Built maintainable app structures using feature-based folders and service/repository separation.",
    "Focused on performance and developer experience with reusable UI patterns and cleaner page composition.",
  ],
  blogs: [
    "How I structure scalable frontend features in Next.js",
    "Building better landing pages with stronger visual rhythm",
    "Practical Clean Architecture for frontend apps",
  ],
  heroStats: [
    { title: "3+", value: "Years building web products" },
    { title: "Focus", value: "React, Next.js, TypeScript" },
    { title: "Style", value: "Clean architecture, reusable UI" },
    { title: "Goal", value: "Useful software with sharp design" },
  ],
};

const HomeLogic = createContext<HomeContextProps | undefined>(undefined);

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  return <HomeLogic.Provider value={homeContent}>{children}</HomeLogic.Provider>;
};

export const useHomeLogic = () => {
  const context = useContext(HomeLogic);
  if (!context) {
    throw new Error("useHomeLogic must be used within HomeProvider");
  }
  return context;
};
