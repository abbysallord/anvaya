"use client";
import { useEffect, useState } from "react";

const clock = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });

/** Studio time in India; server-rendered as a placeholder so hydration never mismatches. */
export function StudioClock({ className = "hero-clock" }: { className?: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(clock.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <p className={className}>IST <time>{time || "--:--"}</time></p>;
}
