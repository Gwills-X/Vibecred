"use client";
import { useEffect } from "react";
import { refreshSessionAction } from "@/actions/auth";

export default function SessionRefresher() {
  useEffect(() => {
    // Refresh every 10 minutes (600,000ms)
    const interval = setInterval(
      () => {
        refreshSessionAction();
      },
      10 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return null;
}
