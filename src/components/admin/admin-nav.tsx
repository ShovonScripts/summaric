"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  DashboardIcon,
  SettingsIcon,
  TagIcon,
  UsersIcon,
} from "@/components/icons";

const NAV_ITEMS = [
  { label: "ড্যাশবোর্ড", icon: DashboardIcon, href: "/admin", exact: true },
  { label: "সারসংক্ষেপ", icon: BookOpenIcon, href: "/admin/books" },
  { label: "বিভাগ", icon: TagIcon, href: "/admin/categories" },
  { label: "পাঠক", icon: UsersIcon, soon: true },
  { label: "সেটিংস", icon: SettingsIcon, soon: true },
];

export function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.href
          ? item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          : false;

        const content = (
          <>
            <Icon className="size-[1.1rem] shrink-0" />
            <span>{item.label}</span>
            {item.soon ? (
              <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[0.6rem] text-faint">
                শীঘ্রই
              </span>
            ) : null}
          </>
        );

        if (item.href) {
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-surface text-ink"
                  : "text-muted hover:bg-surface hover:text-ink"
              } ${mobile ? "shrink-0 border border-line" : ""}`}
            >
              {content}
            </Link>
          );
        }

        return (
          <span
            key={item.label}
            aria-disabled="true"
            className={`flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-faint ${
              mobile ? "shrink-0 border border-line" : ""
            }`}
          >
            {content}
          </span>
        );
      })}
    </>
  );
}
