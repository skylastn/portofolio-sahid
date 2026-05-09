"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AchievementService } from "@/features/core/application/achievement_service";
import { PortofolioService } from "@/features/core/application/portofolio_service";
import { WorkService } from "@/features/core/application/work_service";
import { GeneralService } from "@/features/core/application/general_service";
import { FrameworkService } from "@/features/core/application/framework_service";
import { CodeLanguageService } from "@/features/core/application/code_language_service";
import { AchievementResponse } from "@/features/core/domain/model/response/achievement_response";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { GeneralResponse } from "@/features/core/domain/model/response/general_response";
import { FrameworkResponse } from "@/features/core/domain/model/response/framework_response";
import { CodeLanguageResponse } from "@/features/core/domain/model/response/code_language_response";
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

interface HeroStat {
  title: string;
  value: string;
}

interface HomeProfile {
  title: string;
  subtitle: string;
  description: string;
  email: string;
  socialLinks: SocialLink[];
}

interface HomeContentState {
  navItems: NavItem[];
  profile: HomeProfile | null;
  skillGroups: SkillGroup[];
  heroStats: HeroStat[];
  portofolios: PortofolioResponse.Data[];
  works: WorkResponse.Data[];
  achievements: AchievementResponse.Data[];
  isLoading: boolean;
  errorMessage?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Skills", href: "#skills" },
  { label: "Portofolio", href: "#portofolio" },
  { label: "Work", href: "#work" },
  { label: "Achievements", href: "#achievement" },
  { label: "Contact", href: "#contact" },
];

const defaultHeroStats: HeroStat[] = [
  { title: "Projects", value: "Completed" },
  { title: "Experience", value: "Years" },
  { title: "Technologies", value: "Mastered" },
  { title: "Clients", value: "Served" },
];

export function useHomeData() {
  const [state, setState] = useState<HomeContentState>({
    navItems: defaultNavItems,
    profile: null,
    skillGroups: [],
    heroStats: defaultHeroStats,
    portofolios: [],
    works: [],
    achievements: [],
    isLoading: true,
    errorMessage: undefined,
  });

  const fetchHomeData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, errorMessage: undefined }));

    const generalService = new GeneralService();
    const frameworkService = new FrameworkService();
    const codeLanguageService = new CodeLanguageService();
    const portofolioService = new PortofolioService();
    const workService = new WorkService();
    const achievementService = new AchievementService();

    const [
      generalResult,
      frameworkResult,
      codeLanguageResult,
      portofolioResult,
      workResult,
      achievementResult,
    ] = await Promise.all([
      generalService.fetchGenerals(),
      frameworkService.fetchFrameworks({ page: 1, perPage: 50 }),
      codeLanguageService.fetchCodeLanguages({ page: 1, perPage: 50 }),
      portofolioService.fetchPortofolios({ page: 1, perPage: 6 }),
      workService.fetchWorks({ page: 1, perPage: 6 }),
      achievementService.fetchAchievements({ page: 1, perPage: 6 }),
    ]);

    // Build profile from general data
    let profile: HomeProfile | null = null;
    if (
      generalResult.tag === EitherType.Right &&
      generalResult.right &&
      generalResult.right.length > 0
    ) {
      const general = generalResult.right[0];
      const socialLinks: SocialLink[] = [];
      if (general.github_url)
        socialLinks.push({ label: "GitHub", href: general.github_url });
      if (general.linkedin_url)
        socialLinks.push({ label: "LinkedIn", href: general.linkedin_url });
      if (general.gitlab_url)
        socialLinks.push({ label: "GitLab", href: general.gitlab_url });
      if (general.thread_url)
        socialLinks.push({ label: "Threads", href: general.thread_url });
      if (general.tiktok_url)
        socialLinks.push({ label: "TikTok", href: general.tiktok_url });
      if (general.email)
        socialLinks.push({ label: "Email", href: `mailto:${general.email}` });

      profile = {
        title: general.title || "Software Engineer",
        subtitle: "Building digital experiences",
        description: general.description || "",
        email: general.email || "",
        socialLinks,
      };
    }

    // Build skill groups from frameworks and code languages
    const skillGroups: SkillGroup[] = [];
    if (
      frameworkResult.tag === EitherType.Right &&
      frameworkResult.right.data
    ) {
      const frameworks = frameworkResult.right.data
        .map((f) => f.title)
        .filter((t): t is string => !!t);
      if (frameworks.length > 0) {
        skillGroups.push({ title: "Frameworks", items: frameworks });
      }
    }
    if (
      codeLanguageResult.tag === EitherType.Right &&
      codeLanguageResult.right.data
    ) {
      const languages = codeLanguageResult.right.data
        .map((l) => l.title)
        .filter((t): t is string => !!t);
      if (languages.length > 0) {
        skillGroups.push({ title: "Languages", items: languages });
      }
    }

    // Collect error messages
    const errors: string[] = [];
    if (portofolioResult.tag === EitherType.Left)
      errors.push(portofolioResult.left.message ?? "");
    if (workResult.tag === EitherType.Left)
      errors.push(workResult.left.message ?? "");
    if (achievementResult.tag === EitherType.Left)
      errors.push(achievementResult.left.message ?? "");

    setState({
      navItems: defaultNavItems,
      profile,
      skillGroups:
        skillGroups.length > 0 ? skillGroups : getDefaultSkillGroups(),
      heroStats: defaultHeroStats,
      portofolios:
        portofolioResult.tag === EitherType.Right
          ? (portofolioResult.right.data ?? [])
          : [],
      works:
        workResult.tag === EitherType.Right
          ? (workResult.right.data ?? [])
          : [],
      achievements:
        achievementResult.tag === EitherType.Right
          ? (achievementResult.right.data ?? [])
          : [],
      isLoading: false,
      errorMessage: errors.length > 0 ? errors.join("; ") : undefined,
    });
  }, []);

  useEffect(() => {
    void fetchHomeData();
  }, [fetchHomeData]);

  return state;
}

function getDefaultSkillGroups(): SkillGroup[] {
  return [
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
      items: ["Node.js", "NestJS", "REST API", "Clean Architecture", "TypeORM"],
    },
    {
      title: "Tools & DevOps",
      items: ["Git", "Docker", "CI/CD", "PostgreSQL", "Redis"],
    },
  ];
}

export interface PublicContentState {
  portofolios: PortofolioResponse.Data[];
  works: WorkResponse.Data[];
  achievements: AchievementResponse.Data[];
  isLoading: boolean;
  errorMessage?: string;
}

export function usePublicContent(limit = 6) {
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

    const [portofolioResult, workResult, achievementResult] = await Promise.all(
      [
        portofolioService.fetchPortofolios({ page: 1, perPage: limit }),
        workService.fetchWorks({ page: 1, perPage: limit }),
        achievementService.fetchAchievements({ page: 1, perPage: limit }),
      ],
    );

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
      works:
        workResult.tag === EitherType.Right
          ? (workResult.right.data ?? [])
          : [],
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

// Legacy context-based exports for backward compatibility
interface HomeContextProps {
  navItems: NavItem[];
  socialLinks: SocialLink[];
  skillGroups: SkillGroup[];
  heroStats: HeroStat[];
}

const homeContent: HomeContextProps = {
  navItems: defaultNavItems,
  socialLinks: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Email", href: "mailto:hello@example.com" },
    { label: "Resume", href: "#" },
  ],
  skillGroups: getDefaultSkillGroups(),
  heroStats: defaultHeroStats,
};

const HomeLogic = createContext<HomeContextProps | undefined>(undefined);

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <HomeLogic.Provider value={homeContent}>{children}</HomeLogic.Provider>
  );
};

export const useHomeLogic = () => {
  const context = useContext(HomeLogic);
  if (!context) {
    throw new Error("useHomeLogic must be used within HomeProvider");
  }
  return context;
};
