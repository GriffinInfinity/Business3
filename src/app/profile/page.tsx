'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const initial = { annualIncome: '', liquidSavings: '', monthlyExpenses: '', targetIncome: '', availableHoursPerWeek: '10', primaryGoal: 'income', riskTolerance: 'medium' };

export default function ProfilePage() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault(); setStatus('Saving...');
    const response = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, ...Object.fromEntries(['annualIncome','liquidSavings','monthlyExpenses','targetIncome','availableHoursPerWeek'].map((key) => [key, Number(form[key as keyof typeof form])])) }) });
    const data = await response.json();
    setStatus(response.ok ? `Profile saved · ${data.completeness}% complete` : (data.error ?? 'Unable to save profile.'));
  }

  const input = (label: string, key: keyof typeof form, placeholder: string) => <label className="block text-sm text-slate-300"><span className="mb-2 block">{label}</span><input required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" /></label>;

  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-3xl"><Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">← Command Center</Link><p className="mt-8 text-sm font-medium text-emerald-300">WEALTHOS · YOUR PROFILE</p><h1 className="mt-2 text-4xl font-bold">Build the context behind your plan.</h1><p className="mt-3 text-slate-400">Your profile gives the opportunity engine the constraints it needs to prioritize useful actions instead of generic advice.</p>
    <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">{input('Annual income','annualIncome','75000')}{input('Liquid savings','liquidSavings','20000')}{input('Monthly expenses','monthlyExpenses','4500')}{input('Target annual income','targetIncome','120000')}{input('Available hours per week','availableHoursPerWeek','10')}
      <label className="block text-sm text-slate-300"><span className="mb-2 block">Primary goal</span><select value={form.primaryGoal} onChange={(e) => setForm({ ...form, primaryGoal: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"><option value="income">Increase income</option><option value="savings">Build savings</option><option value="business">Build or buy a business</option><option value="stability">Increase stability</option></select></label>
      <label className="block text-sm text-slate-300"><span className="mb-2 block">Risk preference</span><select value={form.riskTolerance} onChange={(e) => setForm({ ...form, riskTolerance: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
      <button className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">Save Wealth Profile</button>{status && <p className="text-sm text-emerald-300">{status}</p>}
    </form></div></main>;
}
