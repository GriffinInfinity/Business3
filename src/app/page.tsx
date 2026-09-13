import Link from 'next/link';

const opportunities = [
  { title: 'Increase earning power', score: 92, copy: 'Prioritize the highest-value career or business move in your current position.' },
  { title: 'Reduce financial leakage', score: 84, copy: 'Find recurring expenses and cash-flow improvements that create investable margin.' },
  { title: 'Business acquisition watchlist', score: 79, copy: 'Track acquisition opportunities that fit your capital, skills, and risk profile.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold tracking-tight">Wealth<span className="text-emerald-400">OS</span></div>
        <div className="hidden gap-6 text-sm text-slate-300 md:flex">
          <Link href="#opportunity">Opportunity</Link><Link href="#career">Career</Link><Link href="#finance">Finance</Link><Link href="#acquisitions">Acquisitions</Link><Link href="#legacy">Legacy</Link>
        </div>
        <Link href="/plan" className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-emerald-400">Build my plan</Link>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:pt-24">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">EARN → MANAGE → DISCOVER → ACQUIRE → GROW → PROTECT</div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Find the opportunities that can change your financial trajectory.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">WealthOS turns your income, goals, capital, and constraints into a living plan for building and protecting wealth.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/plan" className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">Build my wealth plan</Link>
            <a href="#opportunity" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">See the intelligence layer</a>
          </div>
        </div>

        <section id="opportunity" className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-sm text-emerald-300">Opportunity Intelligence</p><h2 className="mt-1 text-2xl font-semibold">Your highest-leverage moves</h2></div>
            <p className="text-sm text-slate-400">Illustrative MVP data</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {opportunities.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-start justify-between gap-4"><h3 className="font-semibold">{item.title}</h3><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-sm font-semibold text-emerald-300">{item.score}</span></div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Manage','Finance OS'],['Earn','Career OS'],['Multiply','Acquisition Intelligence'],['Protect','Life & Legacy']].map(([label,title]) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 font-semibold">{title}</p></div>
          ))}
        </section>
      </section>
    </main>
  );
}
