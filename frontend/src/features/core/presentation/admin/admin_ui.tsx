"use client";

import { useAdminLogic } from "./admin_logic";
import AdminShell from "./component/admin_shell";

export default function AdminUI() {
  const { overviewStats, shortcutItems, activityFeed, taskList, teamMembers } =
    useAdminLogic();

  return (
    <AdminShell
      activeKey="dashboard"
      title="Dashboard Overview"
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.24)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Admin summary
            </p>
            <h3 className="mt-3 text-3xl font-black text-white">
              Keep the system content-first and route-driven.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              This overview is intentionally admin-focused: the sidebar opens
              dedicated pages, and the dashboard gives you a quick operational
              snapshot before you head into a specific module.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.18)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-sky-300">{stat.change}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Quick actions
                </p>
                <h3 className="mt-2 text-xl font-black text-white">
                  Things to check first
                </h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                Live
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {shortcutItems.map((item) => (
                <div key={item.title} className="rounded-2xl bg-white/5 px-4 py-4">
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-300">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-black text-white">Team and tasks</h3>
            <div className="mt-4 space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{member.name}</div>
                    <div className="text-xs text-slate-300">{member.role}</div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                    {member.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {taskList.map((task) => (
                <div
                  key={task.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{task.title}</div>
                      <div className="mt-1 text-sm text-slate-300">{task.due}</div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-black text-white">Recent activity</h3>
            <div className="mt-4 space-y-3">
              {activityFeed.map((item) => (
                <div key={item.title} className="rounded-2xl bg-white/5 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <div className="text-xs font-semibold text-slate-300">{item.time}</div>
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-300">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
