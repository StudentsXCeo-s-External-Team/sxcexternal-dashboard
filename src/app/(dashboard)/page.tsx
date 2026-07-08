import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getStats() {
  const [
    eventsTotal, eventsPublished,
    newsTotal, newsPublished,
    galleryTotal,
    membersTotal,
    programsTotal, programsPublished,
    partnersTotal,
    resourcesTotal, resourcesPublished,
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("gallery_photos").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("programs").select("*", { count: "exact", head: true }),
    supabase.from("programs").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("partners").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }).eq("is_published", true),
  ]);

  return {
    events:    { total: eventsTotal.count ?? 0,    published: eventsPublished.count ?? 0 },
    news:      { total: newsTotal.count ?? 0,      published: newsPublished.count ?? 0 },
    gallery:   { total: galleryTotal.count ?? 0 },
    members:   { total: membersTotal.count ?? 0 },
    programs:  { total: programsTotal.count ?? 0,  published: programsPublished.count ?? 0 },
    partners:  { total: partnersTotal.count ?? 0 },
    resources: { total: resourcesTotal.count ?? 0, published: resourcesPublished.count ?? 0 },
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Events",
      value: stats.events.total,
      sub: `${stats.events.published} published`,
      href: "/events",
      accent: "#2061E3",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "News",
      value: stats.news.total,
      sub: `${stats.news.published} published`,
      href: "/news",
      accent: "#00ADF1",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      label: "Gallery",
      value: stats.gallery.total,
      sub: "total photos",
      href: "/gallery",
      accent: "#2061E3",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Members",
      value: stats.members.total,
      sub: "total members",
      href: "/members",
      accent: "#00ADF1",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Programs",
      value: stats.programs.total,
      sub: `${stats.programs.published} published`,
      href: "/programs",
      accent: "#2061E3",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: "Partners",
      value: stats.partners.total,
      sub: "total partners",
      href: "/partners",
      accent: "#00ADF1",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Resources",
      value: stats.resources.total,
      sub: `${stats.resources.published} published`,
      href: "/resources",
      accent: "#2061E3",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    { href: "/events/new", label: "+ Event" },
    { href: "/news/new", label: "+ News" },
    { href: "/gallery/new", label: "+ Photo" },
    { href: "/members/new", label: "+ Member" },
    { href: "/programs/new", label: "+ Program" },
    { href: "/partners/new", label: "+ Partner" },
    { href: "/resources/new", label: "+ Resource" },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-0.5">StudentsxCEOs Jakarta — CMS Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 border border-zinc-100 p-4 flex items-center gap-3 hover:border-zinc-200 dark:border-zinc-700 hover:shadow-sm transition-all group"
            style={{ borderRadius: "4px" }}
          >
            <div className="p-2 shrink-0" style={{ backgroundColor: `${card.accent}15`, borderRadius: "4px" }}>
              <span style={{ color: card.accent }}>{card.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-zinc-900 leading-none">{card.value}</p>
              <p className="text-xs font-semibold text-zinc-700 mt-0.5 truncate">{card.label}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 border border-zinc-100 p-5" style={{ borderRadius: "4px" }}>
        <h2 className="text-xs font-bold text-zinc-400 tracking-[0.15em] uppercase mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#07224F", borderRadius: "4px" }}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
