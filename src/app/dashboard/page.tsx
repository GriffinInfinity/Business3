'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type DashboardData = {
  profile: null | { annualIncome: number; liquidSavings: number; monthlyExpenses: number; targetIncome: number; availableHoursPerWeek: number; primaryGoal: string; riskTolerance: string };
  metrics: null | { monthlyIncome: number; monthlySurplus: number; savingsRate: number; runwayMonths: number; incomeGap: number; trajectoryScore: number };
  plan: null | { opportunities: Array<{ id: string; title: string; score: number; category: string; rationale: string; nextStep: string }> };
  updatedAt: string | null;
  completeness: number;
};

const fallbackActions = [
  ['1', 'Complete your wealth profile', 'Give WealthOS enough context to rank opportunities accurately.', '/profile'],
  ['2', 'Connect Outlook', 'Bring scheduling and communication workflows into one operating system.', '/settings/integrations'],
  ['3', 'Review your opportunity queue', 'Choose one high-leverage move to execute this week.', '/plan'],
];

const money = (value: number) => `$${Math.round(value).toLocaleString()}`;

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => { fetch('/api/dashboard').then((r) => r.json()).then(setData).catch(() => setData(null)); }, []);

  const profileComplete = Boolean(data?.profile);
  const metrics = data?.metrics;
  const opportunities = data?.plan?.opportunities ?? [];
  const actions = profileComplete
    ? opportunities.slice(0, 3).map((o, i) => [String(i + 1), o.title, o.nextStep, '/plan'])
    : fallbackActions;

  const pillars = metrics ? [
    { name: 'Earn', score: Math.min(99, Math.round((data!.profile!.annualIncome / Math.max(data!.profile!.targetIncome, 1)) * 100)), detail: metrics.incomeGap ? `${money(metrics.incomeGap)} annual income gap to target.` : 'Income target reached; focus on durable upside.' },
    { name: 'Manage', score: Math.min(99, Math.round(metrics.savingsRate * 100 + Math.min(metrics.runwayMonths * 4, 40))), detail: `${Math.round(metrics.savingsRate * 100)}% modeled savings rate.` },
    { name: 'Discover', score: opportunities[0]?.score ?? 0, detail: opportunities[0]?.title ?? 'Complete your profile to activate intelligence.' },
    { name: 'Acquire', score: opportunities.find((o) => o.category === 'Multiply')?.score ?? 0, detail: 'Readiness for business and asset opportunities.' },
    { name: 'Protect', score: Math.min(99, Math.round(metrics.runwayMonths * 10)), detail: 'Build cash resilience and continuity planning.' },
  ] : [];

  return <main className="min-h-screen bg-slate-950 text-white">
    <header className="border-b border-slate-800 bg-slate-950/90"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><Link href="/" className="text-xl font-bold">Wealth<span className="text-emerald-400">OS</span></Link><div className="flex items-center gap-3 text-sm"><Link href="/profile" className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-500">Profile</Link><Link href="/plan" className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-500">Wealth Plan</Link><Link href="/settings/integrations" className="rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950">Integrations</Link></div></div></header>
    <section className="mx-auto max-w-7xl px-6 py-10"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-medium text-emerald-300">WEALTHOS COMMAND CENTER</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Your financial operating system</h1><p className="mt-3 max-w-2xl text-slate-400">One view of the moves that can improve your earning power, financial position, opportunities, and protection.</p></div><Link href={profileComplete ? '/plan' : '/profile'} className="rounded-xl bg-emerald-400 px-5 py-3 text-center font-semibold text-slate-950">{profileComplete ? 'Update my plan' : 'Build my profile'}</Link></div>
      {metrics && <div className="mt-8 grid gap-4 md:grid-cols-4"><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs text-slate-500">Trajectory</p><p className="mt-1 text-3xl font-bold">{metrics.trajectoryScore}<span className="text-base text-slate-500"> / 100</span></p></div><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs text-slate-500">Monthly surplus</p><p className="mt-1 text-3xl font-bold">{money(metrics.monthlySurplus)}</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs text-slate-500">Cash runway</p><p className="mt-1 text-3xl font-bold">{metrics.runwayMonths.toFixed(1)}<span className="text-base text-slate-500"> mo</span></p></div><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs text-slate-500">Income gap</p><p className="mt-1 text-3xl font-bold">{money(metrics.incomeGap)}</p></div></div>}
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]"><section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Wealth trajectory</p><p className="mt-1 text-3xl font-bold">{metrics?.trajectoryScore ?? 0}<span className="text-base font-normal text-slate-500"> / 100</span></p></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">Live model</span></div><div className="mt-7 space-y-4">{pillars.map((p) => <div key={p.name}><div className="mb-1 flex justify-between text-sm"><span className="font-medium">{p.name}</span><span className="text-slate-400">{p.score}</span></div><div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-emerald-400" style={{ width: `${p.score}%` }} /></div><p className="mt-1 text-xs text-slate-500">{p.detail}</p></div>)}</div></section>
        <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6"><p className="text-sm text-emerald-300">THIS WEEK</p><h2 className="mt-2 text-2xl font-semibold">Highest-leverage move</h2><p className="mt-4 text-slate-300">{opportunities[0]?.nextStep ?? 'Complete your wealth profile so WealthOS can replace generic recommendations with decisions matched to your situation.'}</p><Link href={opportunities[0] ? '/plan' : '/profile'} className="mt-6 block w-full rounded-xl bg-emerald-400 px-4 py-3 text-center font-semibold text-slate-950">{opportunities[0] ? 'Review opportunity' : 'Start profile'}</Link></section></div>
      <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6"><div className="flex items-end justify-between"><div><p className="text-sm text-slate-400">Execution queue</p><h2 className="mt-1 text-2xl font-semibold">Next three actions</h2></div><span className="text-sm text-slate-500">{data?.updatedAt ? 'Profile updated' : 'Waiting for profile'}</span></div><div className="mt-6 grid gap-4 md:grid-cols-3">{actions.map(([n,title,detail,href]) => <Link href={href} key={n} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/40"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-emerald-300">{n}</span><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p><p className="mt-4 text-xs font-semibold text-emerald-300">Open →</p></Link>)}</div></section>
    </section></main>;
}
