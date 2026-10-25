"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutIcon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";

export function AdminAccount() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  async function handleLogout() {
    setLeaving(true);
    try {
      await logout();
      router.replace("/");
      router.refresh();
    } catch {
      setLeaving(false);
    }
  }

  const initial = user?.name?.trim().charAt(0) || "অ";

  return (
    <div className="flex items-center gap-2">
      <span
        className="flex size-9 items-center justify-center rounded-full border border-line bg-surface font-display text-sm text-ink"
        aria-label={user?.name ? `${user.name} (অ্যাডমিন)` : "অ্যাডমিন"}
        title={user?.name}
      >
        {initial}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        disabled={leaving}
        className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-50 sm:flex"
      >
        <LogoutIcon className="size-3.5" />
        {leaving ? "বের হচ্ছে..." : "লগআউট"}
      </button>
    </div>
  );
}
