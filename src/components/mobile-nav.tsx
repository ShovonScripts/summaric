"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CompassIcon,
  HomeIcon,
  InfoIcon,
  LibraryIcon,
} from "@/components/icons";

const ITEMS = [
  { href: "/", label: "হোম", icon: HomeIcon },
  { href: "/books", label: "বই", icon: LibraryIcon },
  { href: "/#topics", label: "বিষয়", icon: CompassIcon },
  { href: "/about", label: "আমাদের কথা", icon: InfoIcon },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="মোবাইল মেনু"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-[var(--header-bg)] pb-[max(0.45rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : !item.href.includes("#") &&
                (pathname === item.href ||
                  pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 pt-2 text-[0.66rem] leading-none transition-colors ${
                active ? "text-gold-ink" : "text-faint hover:text-ink"
              }`}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
