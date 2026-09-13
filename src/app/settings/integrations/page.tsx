import Link from 'next/link';

export default function IntegrationsPage() {
  const configured = Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET && process.env.MICROSOFT_REDIRECT_URI);
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">← Dashboard</Link>
        <h1 className="mt-6 text-4xl font-bold">Integrations</h1>
        <p className="mt-3 text-slate-400">Connect the services WealthOS uses to turn recommendations into scheduled, executable workflows.</p>
        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div><p className="font-semibold">Microsoft Outlook</p><p className="mt-1 text-sm text-slate-400">Calendar and email integration via Microsoft Graph.</p></div>
            {configured ? <a href="/api/integrations/microsoft/authorize" className="rounded-xl bg-emerald-400 px-5 py-3 text-center font-semibold text-slate-950">Connect Outlook</a> : <span className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">Awaiting Microsoft app credentials</span>}
          </div>
        </section>
        <section className="mt-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between"><div><p className="font-semibold">Stripe</p><p className="mt-1 text-sm text-slate-400">Subscription checkout and customer billing portal.</p></div><span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">Billing ready</span></div>
          <p className="mt-4 text-xs leading-5 text-slate-500">Live products and prices are intentionally not created by the application until commercial configuration is explicitly authorized.</p>
        </section>
      </div>
    </main>
  );
}
