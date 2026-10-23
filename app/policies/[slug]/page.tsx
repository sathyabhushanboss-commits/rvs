import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { POLICY_LINKS } from "@/lib/data";
import { POLICIES, POLICY_UPDATED } from "@/lib/policies";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POLICIES[slug];
  if (!p) return {};
  return { title: p.title, description: p.intro.slice(0, 155), alternates: { canonical: `/policies/${slug}` } };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep text-white">
        <div className="stripes stripes-fade absolute inset-0 text-white/[0.06]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">Policies</p>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">{policy.title}</h1>
          <p className="mt-3 text-sm text-white/60">Last updated: {POLICY_UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
            {POLICY_LINKS.map((l) => (
              <Link
                key={l.slug}
                href={`/policies/${l.slug}`}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${l.slug === slug ? "bg-brand text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
              >
                <FileText className="size-4" /> {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <article className="policy max-w-3xl">
          <p className="text-lg leading-8 text-slate-700">{policy.intro}</p>
          {policy.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p?.map((t) => <p key={t}>{t}</p>)}
              {s.list && (
                <ul>
                  {s.list.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
