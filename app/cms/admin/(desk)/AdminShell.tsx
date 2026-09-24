"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { CMS_APPLICATIONS, CMS_BASE, CMS_JOBS } from "@/lib/cms";

const NAV = [
  { href: CMS_BASE, label: "Overview" },
  { href: CMS_JOBS, label: "Jobs" },
  { href: CMS_APPLICATIONS, label: "Applicants" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="desk-shell">
      <aside className="desk-rail">
        <Link className="desk-brand" href={CMS_BASE}>
          <strong>Bräutigam</strong>
          <span>Job desk</span>
        </Link>
        <nav className="desk-nav" aria-label="Job desk">
          {NAV.map((item) => {
            const current =
              item.href === CMS_BASE
                ? pathname === CMS_BASE
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="desk-rail-foot">
          <p className="desk-meta">Signed in as {email}</p>
          <Link className="desk-link" href="/karriere">
            Careers page
          </Link>
          <form action={logout}>
            <button className="desk-btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="desk-main">{children}</div>
    </div>
  );
}
