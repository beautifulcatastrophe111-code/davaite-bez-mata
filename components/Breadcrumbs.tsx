'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = parts.map((part, index) => ({
    label: decodeURIComponent(part).replace(/-/g, ' '),
    href: `/${parts.slice(0, index + 1).join('/')}`,
  }));

  return (
    <nav aria-label="Breadcrumbs" className="mb-4 text-sm text-slate-300">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/">Home</Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span>/</span>
            <Link href={crumb.href} className="capitalize">
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
