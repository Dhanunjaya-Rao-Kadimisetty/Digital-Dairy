import { LogOut } from "lucide-react";

import { signOutAction } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <button className="soft-button-secondary w-full gap-2 sm:w-auto">
        <LogOut className="size-4" />
        Sign out
      </button>
    </form>
  );
}

