import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  CircleDollarSign,
  Command,
  Crosshair,
  Globe2,
  HandHeart,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Network,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";

const regions = [
  {
    name: "Gaza",
    arabic: "غزة",
    value: "68.4M π",
    status: "Reconstruction active",
    color: "bg-rose-400",
    progress: 74,
  },
  {
    name: "Sudan",
    arabic: "السودان",
    value: "42.1M π",
    status: "Supply corridor open",
    color: "bg-amber-400",
    progress: 52,
  },
  {
    name: "Levant",
    arabic: "الشام",
    value: "31.8M π",
    status: "Governor online",
    color: "bg-emerald-400",
    progress: 66,
  },
  {
    name: "Maghreb",
    arabic: "المغرب العربي",
    value: "24.6M π",
    status: "Stable / monitored",
    color: "bg-sky-400",
    progress: 81,
  },
];

export const Route = createFileRoute("/")({ component: Index });

const protocols = [
  {
    label: "Gaza–Sudan reconstruction feed",
    detail: "14 new field reports",
    icon: HandHeart,
    tone: "text-rose-300",
  },
  {
    label: "Sovereign dashboard control",
    detail: "All systems nominal",
    icon: LayoutDashboard,
    tone: "text-cyan-300",
  },
  {
    label: "Digital covenant binding",
    detail: "3 covenants awaiting review",
    icon: LockKeyhole,
    tone: "text-amber-300",
  },
  {
    label: "Shihab Rasad security",
    detail: "No active anomalies",
    icon: ShieldCheck,
    tone: "text-emerald-300",
  },
];

function StatusDot({ color = "bg-emerald-400" }: { color?: string }) {
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${color} shadow-[0_0_12px_currentColor]`} />
  );
}

export default function Index() {
  const [activeNav, setActiveNav] = useState("Command");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07111d] text-[#e7eee9] selection:bg-[#caa76a]/30">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:linear-gradient(rgba(178,208,197,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(178,208,197,.04)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-260px] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[#0c6b61]/20 blur-[110px]" />

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[252px] flex-col border-r border-white/10 bg-[#091824]/95 px-5 py-6 backdrop-blur-xl transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#caa76a]/40 bg-[#caa76a]/10 text-[#d9b977]">
              <Command size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d9b977]">
                Sultan
              </p>
              <p className="text-xs text-[#76918c]">Sovereign Command</p>
            </div>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#55736f]">
          Command layer
        </p>
        <nav className="space-y-1">
          {[
            { name: "Command", icon: LayoutDashboard },
            { name: "Reconstruction", icon: HandHeart },
            { name: "Covenants", icon: BookOpen },
            { name: "Security / Rasad", icon: Crosshair },
            { name: "Economy / Pi", icon: CircleDollarSign },
          ].map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => {
                setActiveNav(name);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${activeNav === name ? "border border-[#caa76a]/25 bg-[#caa76a]/10 text-[#f1d08a]" : "text-[#88a39e] hover:bg-white/5 hover:text-white"}`}
            >
              <Icon size={17} />
              <span>{name}</span>
              {name === "Security / Rasad" && <StatusDot />}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-[#78918c]">Network integrity</span>
            <StatusDot />
          </div>
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[97%] rounded-full bg-emerald-400" />
          </div>
          <p className="text-[11px] text-[#8ea9a3]">97.8% operational confidence</p>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#123b3a] text-xs font-semibold text-[#bbd7c5]">
            YA
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">YASEEN</p>
            <p className="truncate text-[10px] text-[#6d8883]">Authority holder</p>
          </div>
          <ChevronDown className="ml-auto text-[#66817b]" size={15} />
        </div>
      </aside>

      <div className="relative lg:pl-[252px]">
        <header className="flex h-[72px] items-center justify-between border-b border-white/10 px-5 md:px-10">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#6f8b86]">
                Sovereign launch point · 28 Jan 2026
              </p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight md:text-xl">
                Command center <span className="text-[#caa76a]">/</span> المركز السيادي
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className="hidden rounded-lg border border-white/10 p-2 text-[#809b95] hover:bg-white/5 md:block"
              aria-label="Search"
            >
              <Search size={17} />
            </button>
            <button
              onClick={() => setNoticeOpen(!noticeOpen)}
              className="relative rounded-lg border border-white/10 p-2 text-[#809b95] hover:bg-white/5"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {noticeOpen && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#caa76a] text-[9px] text-[#07111d]">
                  3
                </span>
              )}
            </button>
            <div className="hidden items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs text-emerald-200 sm:flex">
              <StatusDot /> Live systems
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-7 md:px-10 md:py-10">
          <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs text-[#8aa7a0]">
                <Globe2 size={15} className="text-[#caa76a]" /> Arabic Mubin{" "}
                <span className="text-[#4f706b]">·</span> Global access
              </div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">
                Build. Empower. <span className="text-[#d8b875]">Secure.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#89a49f]">
                A unified view of the sovereign mandate, translating wisdom and justice into
                measurable action across seven active regions.
              </p>
            </div>
            <button
              onClick={() => setNoticeOpen(true)}
              className="flex w-fit items-center gap-2 rounded-lg border border-[#caa76a]/40 bg-[#caa76a]/10 px-4 py-2.5 text-xs font-semibold text-[#e7ca8b] transition hover:bg-[#caa76a]/20"
            >
              <Sparkles size={15} /> Issue a directive <ArrowUpRight size={14} />
            </button>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Active regions",
                value: "07",
                sub: "All governors online",
                icon: Globe2,
                color: "text-cyan-300",
              },
              {
                label: "Reconstruction flow",
                value: "166.9M π",
                sub: "+12.4% this cycle",
                icon: TrendingUp,
                color: "text-emerald-300",
              },
              {
                label: "Covenant integrity",
                value: "99.2%",
                sub: "Verified obligations",
                icon: ShieldCheck,
                color: "text-[#d8b875]",
              },
              {
                label: "Citizens empowered",
                value: "2.84M",
                sub: "Across active network",
                icon: Users,
                color: "text-sky-300",
              },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#caa76a]/30"
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs text-[#78938d]">{label}</p>
                  <Icon size={17} className={color} />
                </div>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-white">{value}</p>
                <p className="mt-1 text-[11px] text-[#73908a]">{sub}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-emerald-300" />
                    <h3 className="font-semibold">Reconstruction pulse</h3>
                  </div>
                  <p className="mt-1 text-xs text-[#75918b]">
                    Pi Network allocation across humanitarian corridors
                  </p>
                </div>
                <button className="text-xs text-[#caa76a] hover:text-white">
                  View ledger <ArrowUpRight className="ml-1 inline" size={13} />
                </button>
              </div>
              <div className="mt-8 flex h-[190px] items-end gap-2 border-b border-white/10 px-1 pb-0 md:gap-3">
                {[32, 48, 39, 62, 57, 75, 68, 91, 77, 84, 73, 98].map((height, i) => (
                  <div key={i} className="group flex h-full flex-1 items-end">
                    <div
                      className="relative w-full rounded-t-md bg-gradient-to-t from-[#0e766d] to-[#68b6a0] opacity-80 transition group-hover:opacity-100"
                      style={{ height: `${height}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-[10px] text-[#bed7ca] group-hover:block">
                        {height}k
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-[#57736e]">
                <span>JAN 28</span>
                <span>FEB 04</span>
                <span>FEB 11</span>
                <span>FEB 18</span>
                <span>FEB 25</span>
                <span>MAR 04</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#caa76a]/25 bg-gradient-to-br from-[#1a2b2a] to-[#0d1a25] p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WalletCards size={16} className="text-[#d8b875]" />
                  <h3 className="font-semibold">Pi economy</h3>
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[10px] text-emerald-200">
                  Integrated
                </span>
              </div>
              <p className="mt-6 text-3xl font-semibold tracking-tight">
                166.9M <span className="text-base font-normal text-[#88aaa0]">π</span>
              </p>
              <p className="mt-1 text-xs text-[#7e9b94]">Committed for reconstruction</p>
              <div className="my-6 h-px bg-white/10" />
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#76918b]">Verified settlements</span>
                  <span className="text-white">12,488</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76918b]">Network liquidity</span>
                  <span className="text-emerald-300">84.6%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76918b]">Next disbursement</span>
                  <span className="text-[#d8b875]">04:16:22</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_1fr]">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Regional governors</h3>
                  <p className="mt-1 text-xs text-[#75918b]">Seven regions · operational status</p>
                </div>
                <button
                  className="rounded-md border border-white/10 p-2 text-[#7c9891] hover:bg-white/5"
                  aria-label="Network view"
                >
                  <Network size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {regions.map((region) => (
                  <div key={region.name}>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium">
                        <StatusDot color={region.color} /> {region.name}{" "}
                        <span className="text-[#5f7d76]">{region.arabic}</span>
                      </span>
                      <span className="text-[#d9c180]">{region.value}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${region.color}`}
                          style={{ width: `${region.progress}%` }}
                        />
                      </div>
                      <span className="w-[118px] text-right text-[10px] text-[#68837d]">
                        {region.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Active protocols</h3>
                  <p className="mt-1 text-xs text-[#75918b]">Live directives and system health</p>
                </div>
                <Radio size={17} className="text-[#caa76a]" />
              </div>
              <div className="space-y-2">
                {protocols.map(({ label, detail, icon: Icon, tone }) => (
                  <button
                    key={label}
                    onClick={() => setNoticeOpen(true)}
                    className="flex w-full items-center gap-3 rounded-lg border border-white/5 bg-black/10 p-3 text-left transition hover:border-[#caa76a]/25 hover:bg-white/[0.04]"
                  >
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 ${tone}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[#dce8e2]">{label}</p>
                      <p className="mt-1 text-[10px] text-[#708b84]">{detail}</p>
                    </div>
                    <Check size={15} className="text-emerald-300" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <footer className="mt-10 flex flex-col gap-3 border-t border-white/10 py-6 text-[10px] text-[#5d7973] sm:flex-row sm:items-center sm:justify-between">
            <span>Base law: The Quran · Order of revelation</span>
            <span className="flex items-center gap-2">
              <StatusDot /> Shihab Rasad secure channel <span className="text-[#405c57]">·</span>{" "}
              v1.0.28
            </span>
          </footer>
        </main>
      </div>
      {noticeOpen && (
        <div className="fixed bottom-5 right-5 z-40 max-w-sm rounded-xl border border-[#caa76a]/30 bg-[#102321] p-4 shadow-2xl">
          <div className="flex gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#caa76a]/15 text-[#d9b977]">
              <Bell size={15} />
            </div>
            <div>
              <p className="text-sm font-medium">Command channel ready</p>
              <p className="mt-1 text-xs leading-5 text-[#8ba8a0]">
                Directive controls are online. Review the active protocols before issuing a new
                sovereign instruction.
              </p>
            </div>
            <button
              onClick={() => setNoticeOpen(false)}
              className="ml-2 self-start text-[#6f8c85]"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
