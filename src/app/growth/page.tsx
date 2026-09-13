import Link from 'next/link';

const channels = [
  ['Organic search', 'Interactive calculators, research, and high-intent guides that turn discovery into Wealth Plans.'],
  ['Social', 'Research snippets, charts, short videos, and product demonstrations built around useful financial decisions.'],
  ['Partnerships', 'Career professionals, accountants, brokers, educators, communities, and employers.'],
  ['Outreach', 'A permission-aware pipeline for qualified contacts, partner invitations, beta users, and collaborations.'],
];

export default function GrowthPage() {
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto max-w-6xl">
    <Link href="/" className="text-sm text-emerald-300">← WealthOS</Link>
    <p className="mt-10 text-sm font-medium text-emerald-300">WEALTHOS GROWTH ENGINE</p>
    <h1 className="mt-2 max-w-4xl text-5xl font-bold tracking-tight">Build the product and the distribution machine at the same time.</h1>
    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">WealthOS grows when useful intelligence attracts people, the Wealth Plan activates them, and successful execution turns users into repeat users and referrers.</p>
    <div className="mt-10 grid gap-5 md:grid-cols-2">{channels.map(([title, detail]) => <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-slate-400">{detail}</p></article>)}</div>
    <section className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8"><p className="text-sm text-emerald-300">NORTH STAR</p><h2 className="mt-2 text-3xl font-semibold">Weekly Activated Wealth Plans</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">A visitor becomes valuable when they complete a plan and activate a real next action. That is the behavior we should optimize before chasing vanity traffic.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/plan" className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950">Build a Wealth Plan</Link><Link href="/dashboard" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold">Open dashboard</Link></div></section>
  </div></main>;
}
