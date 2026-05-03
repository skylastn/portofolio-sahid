"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { AchievementService } from "@/features/core/application/achievement_service";
import { PortofolioService } from "@/features/core/application/portofolio_service";
import { WorkService } from "@/features/core/application/work_service";
import { AchievementResponse } from "@/features/core/domain/model/response/achievement_response";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { EitherType } from "@/shared/utils/utility/either";

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
    { label: "Portofolio", href: "#projects" },
    { label: "Work", href: "#work" },
    { label: "Achievements", href: "#achievement" },
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

export interface PublicContentState {
  portofolios: PortofolioResponse.Data[];
  works: WorkResponse.Data[];
  achievements: AchievementResponse.Data[];
  isLoading: boolean;
  errorMessage?: string;
}

export function usePublicContent(limit = 3) {
  const portofolioService = useMemo(() => new PortofolioService(), []);
  const workService = useMemo(() => new WorkService(), []);
  const achievementService = useMemo(() => new AchievementService(), []);
  const [state, setState] = useState<PublicContentState>({
    portofolios: [],
    works: [],
    achievements: [],
    isLoading: true,
  });

  const fetchContent = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, errorMessage: undefined }));

    const [portofolioResult, workResult, achievementResult] = await Promise.all([
      portofolioService.fetchPortofolios({ page: 1, perPage: limit }),
      workService.fetchWorks({ page: 1, perPage: limit }),
      achievementService.fetchAchievements({ page: 1, perPage: limit }),
    ]);

    const errorMessage =
      portofolioResult.tag === EitherType.Left
        ? portofolioResult.left.message
        : workResult.tag === EitherType.Left
          ? workResult.left.message
          : achievementResult.tag === EitherType.Left
            ? achievementResult.left.message
            : undefined;

    setState({
      portofolios:
        portofolioResult.tag === EitherType.Right
          ? (portofolioResult.right.data ?? [])
          : [],
      works: workResult.tag === EitherType.Right ? (workResult.right.data ?? []) : [],
      achievements:
        achievementResult.tag === EitherType.Right
          ? (achievementResult.right.data ?? [])
          : [],
      isLoading: false,
      errorMessage,
    });
  }, [achievementService, limit, portofolioService, workService]);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  return state;
}

export function formatDisplayDate(value?: string | Date | null) {
  if (!value) return "Present";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en", {
    month: "short",
    year: "numeric",
  });
}