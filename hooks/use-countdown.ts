"use client";

import { useEffect, useState } from "react";

function getCountdownParts(target: string) {
  const diff = new Date(target).getTime() - Date.now();

  if (diff <= 0) {
    return null;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { days, hours, minutes };
}

export function useCountdown(target: string) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(target));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(getCountdownParts(target));
    }, 1000 * 60);

    return () => window.clearInterval(interval);
  }, [target]);

  return countdown;
}

