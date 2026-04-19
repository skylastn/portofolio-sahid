"use client";

import { createContext, useContext } from "react";

interface OverviewStat {
  label: string;
  value: string;
  change: string;
  note: string;
}

interface ShortcutItem {
  title: string;
  description: string;
  href: string;
}

interface ActivityItem {
  title: string;
  detail: string;
  time: string;
}

interface TaskItem {
  title: string;
  status: string;
  due: string;
}

interface TeamMember {
  name: string;
  role: string;
  status: string;
}

export interface TableColumn {
  label: string;
  key: string;
}

export interface TableRow {
  [key: string]: string;
}

export interface TableView {
  title: string;
  description: string;
  columns: TableColumn[];
  rows: TableRow[];
}

export interface PortfolioSection {
  portfolio: TableView;
  category: TableView;
}

interface AdminContextProps {
  overviewStats: OverviewStat[];
  shortcutItems: ShortcutItem[];
  activityFeed: ActivityItem[];
  taskList: TaskItem[];
  teamMembers: TeamMember[];
  navigationItems: { label: string; href: string }[];
  mainTabs: { label: string; value: AdminTabKey }[];
  portfolioTabs: { label: string; value: PortfolioTabKey }[];
  tableViews: Record<AdminTabKey, TableView | PortfolioSection>;
}

export interface AdminNavigationItem {
  label: string;
  href: string;
  key: AdminTabKey | "dashboard";
  children?: { label: string; href: string; key: PortfolioTabKey }[];
}

export type AdminTabKey =
  | "portfolio"
  | "achievement"
  | "work"
  | "code_language"
  | "framework"
  | "general";

export type PortfolioTabKey = "portfolio" | "category";

function makeTableView(
  title: string,
  description: string,
  columns: TableColumn[],
  rows: TableRow[],
): TableView {
  return { title, description, columns, rows };
}

const adminContent: AdminContextProps = {
  overviewStats: [
    {
      label: "Live Visitors",
      value: "2.8K",
      change: "+18.4%",
      note: "Compared with yesterday",
    },
    {
      label: "Messages",
      value: "14",
      change: "3 unread",
      note: "New contact requests",
    },
    {
      label: "Projects",
      value: "09",
      change: "+2 this month",
      note: "In active production",
    },
    {
      label: "Conversion",
      value: "6.2%",
      change: "+1.1%",
      note: "From portfolio contact flow",
    },
  ],
  shortcutItems: [
    {
      title: "Publish a case study",
      description: "Add a new featured project to the portfolio experience.",
      href: "#projects",
    },
    {
      title: "Review new messages",
      description: "Respond to incoming contact requests and collaboration leads.",
      href: "#inbox",
    },
    {
      title: "Update hero copy",
      description: "Tune the headline, intro, and CTA for the latest positioning.",
      href: "#hero",
    },
  ],
  activityFeed: [
    {
      title: "Homepage content refreshed",
      detail: "Updated hero metrics and project ordering for stronger positioning.",
      time: "12 min ago",
    },
    {
      title: "New lead received",
      detail: "A product team asked for a dashboard redesign and frontend support.",
      time: "34 min ago",
    },
    {
      title: "Deployment completed",
      detail: "The latest portfolio build was pushed successfully to production.",
      time: "2 hours ago",
    },
    {
      title: "Draft article saved",
      detail: "A new post about scalable frontend structure is ready for review.",
      time: "Today",
    },
  ],
  taskList: [
    {
      title: "Check contact form submissions",
      status: "High priority",
      due: "Due today",
    },
    {
      title: "Review dark mode contrast",
      status: "In progress",
      due: "Needs QA",
    },
    {
      title: "Prepare project showcase",
      status: "Planned",
      due: "Next sprint",
    },
  ],
  teamMembers: [
    { name: "Sky Developer", role: "Owner / Frontend", status: "Online" },
    { name: "Design Partner", role: "Visual direction", status: "Reviewing" },
    { name: "Content Lead", role: "Copy and messaging", status: "Idle" },
  ],
  navigationItems: [
    { label: "Dashboard", href: "/admin" },
    { label: "Portfolio", href: "/admin/portofolio" },
    { label: "Activity", href: "/admin/portofolio" },
    { label: "Tables", href: "/admin/portofolio" },
  ],
  mainTabs: [
    { label: "Portfolio", value: "portfolio" },
    { label: "Achievement", value: "achievement" },
    { label: "Work", value: "work" },
    { label: "Code Language", value: "code_language" },
    { label: "Framework", value: "framework" },
    { label: "General", value: "general" },
  ],
  portfolioTabs: [
    { label: "Portfolio", value: "portfolio" },
    { label: "Category", value: "category" },
  ],
  tableViews: {
    portfolio: {
      portfolio: makeTableView(
        "Portfolio Items",
        "Sample rows for portfolio content management.",
        [
          { label: "Title", key: "title" },
          { label: "Type", key: "type" },
          { label: "Status", key: "status" },
          { label: "Updated", key: "updated" },
        ],
        [
          { title: "Portfolio Revamp", type: "Landing Page", status: "Published", updated: "2h ago" },
          { title: "Admin Dashboard", type: "Internal Tool", status: "Draft", updated: "1d ago" },
          { title: "API Showcase", type: "Documentation", status: "Review", updated: "3d ago" },
        ],
      ),
      category: makeTableView(
        "Portfolio Categories",
        "Sample category rows used to group portfolio entries.",
        [
          { label: "Category", key: "category" },
          { label: "Slug", key: "slug" },
          { label: "Items", key: "items" },
          { label: "Visibility", key: "visibility" },
        ],
        [
          { category: "Frontend", slug: "frontend", items: "12", visibility: "Public" },
          { category: "Backend", slug: "backend", items: "8", visibility: "Public" },
          { category: "Experimental", slug: "experimental", items: "4", visibility: "Private" },
        ],
      ),
    },
    achievement: makeTableView(
      "Achievements",
      "Sample achievements and their latest status.",
      [
        { label: "Title", key: "title" },
        { label: "Source", key: "source" },
        { label: "Year", key: "year" },
        { label: "Status", key: "status" },
      ],
      [
        { title: "Best Portfolio UI", source: "Design Award", year: "2025", status: "Verified" },
        { title: "Open Source Contributor", source: "GitHub", year: "2024", status: "Verified" },
        { title: "Performance Showcase", source: "Internal Review", year: "2024", status: "Pending" },
      ],
    ),
    work: makeTableView(
      "Work Items",
      "Sample work records to track current production tasks.",
      [
        { label: "Work", key: "work" },
        { label: "Owner", key: "owner" },
        { label: "Priority", key: "priority" },
        { label: "Progress", key: "progress" },
      ],
      [
        { work: "Header redesign", owner: "Sky", priority: "High", progress: "82%" },
        { work: "Contact flow", owner: "Sky", priority: "Medium", progress: "63%" },
        { work: "SEO tuning", owner: "Content", priority: "Low", progress: "41%" },
      ],
    ),
    code_language: makeTableView(
      "Code Languages",
      "Sample language usage and proficiency tracking.",
      [
        { label: "Language", key: "language" },
        { label: "Usage", key: "usage" },
        { label: "Level", key: "level" },
        { label: "Focus", key: "focus" },
      ],
      [
        { language: "TypeScript", usage: "Frontend", level: "Expert", focus: "UI architecture" },
        { language: "JavaScript", usage: "Shared", level: "Advanced", focus: "Client logic" },
        { language: "SQL", usage: "Data", level: "Intermediate", focus: "Reporting" },
      ],
    ),
    framework: makeTableView(
      "Frameworks",
      "Sample framework inventory for the portfolio stack.",
      [
        { label: "Framework", key: "framework" },
        { label: "Category", key: "category" },
        { label: "Status", key: "status" },
        { label: "Notes", key: "notes" },
      ],
      [
        { framework: "Next.js", category: "Frontend", status: "Primary", notes: "Main site layer" },
        { framework: "React", category: "UI", status: "Primary", notes: "Shared component base" },
        { framework: "Tailwind CSS", category: "Styling", status: "Primary", notes: "Utility-driven design" },
      ],
    ),
    general: makeTableView(
      "General Settings",
      "Sample operational settings for the dashboard.",
      [
        { label: "Setting", key: "setting" },
        { label: "Value", key: "value" },
        { label: "Group", key: "group" },
        { label: "State", key: "state" },
      ],
      [
        { setting: "Dark mode", value: "Enabled", group: "UI", state: "Active" },
        { setting: "Notifications", value: "Email only", group: "System", state: "Active" },
        { setting: "Autosave", value: "On", group: "Workflow", state: "Active" },
      ],
    ),
  },
};

export const adminNavigationItems: AdminNavigationItem[] = [
  { label: "Dashboard", href: "/admin", key: "dashboard" },
  {
    label: "Portfolio",
    href: "/admin/portofolio",
    key: "portfolio",
    children: [
      { label: "Portfolio", href: "/admin/portofolio", key: "portfolio" },
      { label: "Category", href: "/admin/portofolio/category", key: "category" },
    ],
  },
  { label: "Achievement", href: "/admin/achievement", key: "achievement" },
  { label: "Work", href: "/admin/work", key: "work" },
  { label: "Code Language", href: "/admin/code-language", key: "code_language" },
  { label: "Framework", href: "/admin/framework", key: "framework" },
  { label: "General", href: "/admin/general", key: "general" },
];

export function getAdminSectionFromSlug(
  slug?: string,
): AdminTabKey | "dashboard" | undefined {
  switch (slug) {
    case undefined:
    case "dashboard":
      return "dashboard";
    case "portfolio":
      return "portfolio";
    case "achievement":
      return "achievement";
    case "work":
      return "work";
    case "code-language":
      return "code_language";
    case "framework":
      return "framework";
    case "general":
      return "general";
    default:
      return undefined;
  }
}

export function getPortfolioSubsectionFromSlug(
  slug?: string,
): PortfolioTabKey | undefined {
  switch (slug) {
    case undefined:
    case "portfolio":
      return "portfolio";
    case "category":
      return "category";
    default:
      return undefined;
  }
}

const AdminLogic = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  return <AdminLogic.Provider value={adminContent}>{children}</AdminLogic.Provider>;
};

export const useAdminLogic = () => {
  const context = useContext(AdminLogic);
  if (!context) {
    throw new Error("useAdminLogic must be used within AdminProvider");
  }
  return context;
};
