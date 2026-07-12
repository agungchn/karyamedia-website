"use client";

import { useEffect } from "react";

export function FaviconThemeSwitcher() {
  useEffect(() => {
    const light = "/favicon/favicon-light.png";
    const dark = "/favicon/favicon-dark.png";

    const apply = (isDark: boolean) => {
      const links = document.querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"]'
      );
      links.forEach((link) => {
        link.href = isDark ? dark : light;
      });
    };

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches);

    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return null;
}
