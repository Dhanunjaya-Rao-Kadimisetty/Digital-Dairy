"use client";

import { Bell } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { markAllNotificationsAsRead } from "@/lib/actions/notifications";
import type { Notification } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export function NotificationBell({
  userId,
  initialCount,
  initialNotifications
}: {
  userId: string;
  initialCount: number;
  initialNotifications: Notification[];
}) {
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          const newNotif = payload.new as Notification;
          // Fetch the actor details since the payload only has IDs
          const { data: actor } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", newNotif.actor_id)
            .single();

          const notificationWithActor = { ...newNotif, actor };
          setNotifications((prev) => [notificationWithActor, ...prev].slice(0, 20));
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative grid size-10 place-items-center rounded-full bg-white/5 transition hover:bg-white/10"
      >
        <Bell className="size-5 text-parchment/70" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 size-2.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="glass-panel absolute right-0 top-12 z-50 w-80 overflow-hidden p-0 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="font-serif text-lg text-parchment">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isPending}
                  className="text-xs text-gold/70 hover:text-gold"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-parchment/40">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => setIsOpen(false)}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onClick
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const getMessage = () => {
    const actorName = notification.actor?.name || "Someone";
    switch (notification.type) {
      case "diary_entry":
        return `shared a new diary entry: "${notification.content}"`;
      case "comment":
        return `commented: "${notification.content}"`;
      case "reaction":
        return `reacted ${notification.content} to your entry`;
      case "memory":
        return `shared a new memory: "${notification.content}"`;
      case "voice_note":
        return `uploaded a new voice note: "${notification.content}"`;
      case "future_letter":
        return `wrote a future letter: "${notification.content}"`;
      default:
        return "sent a notification";
    }
  };

  const href = notification.entry_id ? `/diary/${notification.entry_id}` : "/dashboard";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block p-4 transition hover:bg-white/5 ${
        !notification.is_read ? "bg-white/[0.02]" : ""
      }`}
    >
      <div className="flex gap-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gold/10 text-xs font-bold text-gold">
          {notification.actor?.name?.charAt(0) || "?"}
        </div>
        <div className="space-y-1">
          <p className="text-sm leading-snug text-parchment/90">
            <span className="font-semibold text-parchment">{notification.actor?.name}</span>{" "}
            {getMessage()}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-parchment/40">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  );
}
