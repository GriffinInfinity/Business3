'use client';

import { FormEvent, useState } from 'react';

type Opportunity = { id: string; title: string; score: number; category: string; rationale: string; nextStep: string };
type PlanResponse = {
  profile: { primaryGoal: string; riskTolerance: string };
  plan: { savingsRate: number; runwayMonths: number; incomeGap: number; opportunities: Opportunity[] };
};
type ActionStatus = 'new' | 'saved' | 'active' | 'completed' | 'dismissed';

type ExistingAction = { opportunity: Opportunity; status: ActionStatus; note: string };
const initial = { annualIncome: '', liquidSavings: '', monthlyExpenses: '', targetIncome: '', availableHoursPerWeek: '10', primaryGoal: 'income', riskTolerance: 'medium' };

export default function PlanPage() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState<PlanResponse | null>(null);
  const [statuses, setStatuses] = useState<Record<string, ActionStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setResult(null);
    const numeric = Object.fromEntries(['annualIncome','liquidSavings','monthlyExpenses','targetIncome','availableHoursPerWeek'].map((key) => [key, Number(form[key as keyof typeof form])]));
    const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, ...numeric }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? 'Unable to build your plan.'); return; }
    setResult(data);
    const existing = await fetch('/api/actions').then((r) => r.ok ? r.json() : { actions: [] });
    const actions = (existing.actions ?? []) as ExistingAction[];
    setStatuses(Object.fromEntries(actions.map((action) => [action.opportunity.id, action.status])));
    setNotes(Object.fromEntries(actions.map((action) => [action.opportunity.id, action.note ?? ''])));
  }

  async function setAction(opportunity: Opportunity, status: ActionStatus) {
    setSaving(opportunity.id); setError('');
    const response = await fetch('/api/actions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ opportunity, status, note: notes[opportunity.id] ?? '' }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? 'Unable to update action.');
    else setStatuses((current) => ({ ...current, [opportunity.id]: data.action.status }));
    setSaving('');
  }

  async function saveNote(opportunity: Opportunity) {
    setSaving(opportunity.id); setError('');
    const existing = await fetch('/api/actions').then((r) => r.ok ? r.json() : { actions: [] });
    const action = (existing.actions ?? []).find((item: { opportunity: Opportunity }) => item.opportunity.id === opportunity.id);
    if (!action) { await setAction(opportunity, 'saved'); setSaving(''); return; }
    const response = await fetch('/api/actions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: action.id, note: notes[opportunity.id] ?? '' }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? 'Unable to save note.');
    setSaving('');
  }

  const field = (label: string, key: keyof typeof form, placeholder: string) => (
    <label className="block text-sm text-slate-300"><span className="mb-2 block">{label}</span><input required type="number" min="0" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" /></label>
  );

  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto max-w-5xl">
    <p className="text-sm font-medium text-emerald-300">WEALTHOS · WEALTH PLAN</p><h1 className="mt-2 text-4xl font-bold">Tell us where you are. We’ll find the leverage.</h1><p className="mt-4 max-w-2xl text-slate-400">This first plan is an educational planning model. It is not financial, legal, tax, or investment advice.</p>
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={submit} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
        {field('Annual income', 'annualIncome', '75000')}{field('Liquid savings', 'liquidSavings', '20000')}{field('Monthly expenses', 'monthlyExpenses', '4500')}{field('Target annual income', 'targetIncome', '120000')}{field('Available hours per week', 'availableHoursPerWeek', '10')}
        <label className="block text-sm text-slate-300"><span className="mb-2 block">Primary goal</span><select value={form.primaryGoal} onChange={(e) => setForm({ ...form, primaryGoal: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"><option value="income">Increase income</option><option value="savings">Build savings</option><option value="business">Build/buy a business</option><option value="stability">Increase stability</option></select></label>
        <label className="block text-sm text-slate-300"><span className="mb-2 block">Risk preference</span><select value={form.riskTolerance} onChange={(e) => setForm({ ...form, riskTolerance: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        <button className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">Generate my Wealth Plan</button>{error && <p className="text-sm text-red-300">{error}</p>}
      </form>
      <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">{!result ? <div className="flex h-full min-h-96 items-center justify-center text-center text-slate-500"><p>Your modeled plan and opportunity ranking will appear here.</p></div> : <div><p className="text-sm text-emerald-300">YOUR INITIAL MODEL</p><div className="mt-4 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Savings rate</p><p className="mt-1 text-2xl font-semibold">{Math.round(result.plan.savingsRate * 100)}%</p></div><div className="rounded-2xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Runway</p><p className="mt-1 text-2xl font-semibold">{result.plan.runwayMonths.toFixed(1)} mo</p></div><div className="rounded-2xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Income gap</p><p className="mt-1 text-2xl font-semibold">${Math.round(result.plan.incomeGap).toLocaleString()}</p></div></div><div className="mt-6 space-y-4">{result.plan.opportunities.map((o) => { const status = statuses[o.id] ?? 'new'; return <article key={o.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-emerald-300">{o.category}</p><h2 className="mt-1 font-semibold">{o.title}</h2></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 font-semibold text-emerald-300">{o.score}</span></div><p className="mt-3 text-sm leading-6 text-slate-400">{o.rationale}</p><p className="mt-3 text-sm font-medium text-slate-200">Next: {o.nextStep}</p><textarea value={notes[o.id] ?? ''} onChange={(e) => setNotes((current) => ({ ...current, [o.id]: e.target.value }))} placeholder="Add a note, target, or next checkpoint..." rows={2} className="mt-4 w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-400" /><div className="mt-3 flex flex-wrap items-center gap-2"><button type="button" disabled={saving === o.id || status === 'completed'} onClick={() => setAction(o, status === 'saved' ? 'active' : 'saved')} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium hover:border-emerald-400 disabled:opacity-50">{status === 'active' ? 'Active' : status === 'saved' ? 'Saved · Activate' : status === 'completed' ? 'Completed' : 'Save opportunity'}</button>{(status === 'active' || status === 'saved') && <button type="button" disabled={saving === o.id} onClick={() => setAction(o, 'completed')} className="rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">Mark complete</button>}<button type="button" disabled={saving === o.id || status === 'new'} onClick={() => setAction(o, 'dismissed')} className="rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-500 hover:text-slate-300 disabled:opacity-40">Dismiss</button><button type="button" disabled={saving === o.id || status === 'new'} onClick={() => saveNote(o)} className="rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-400 hover:border-slate-600 disabled:opacity-40">Save note</button><span className="text-xs uppercase tracking-wider text-slate-500">{status}</span></div></article>; })}</div></div>}</section>
    </div>
  </div></main>;
}
