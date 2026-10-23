import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 text-4xl font-extrabold text-ink">Looks like a wrong turn.</h1>
      <p className="mt-3 text-slate-600">The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on route.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-xl bg-brand px-6 py-3 font-bold text-white">Go home</Link>
        <Link href="/book" className="rounded-xl bg-accent px-6 py-3 font-bold text-white">Book a cab</Link>
      </div>
    </section>
  );
}
