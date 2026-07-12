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
      if (links.length === 0) {
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = isDark ? dark : light;
        document.head.appendChild(link);
        return;
      }
      links.forEach((link) => {
        link.href = isDark ? dark : light;
        link.type = "image/png";
      });
    };

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches);

    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);

    // Next.js re-injects favicon <link> on client-side navigations;
    // re-apply the correct theme favicon whenever <head> changes.
    const observer = new MutationObserver(() => apply(mq.matches));
    observer.observe(document.head, { childList: true, subtree: true });

    return () => {
      mq.removeEventListener("change", handler);
      observer.disconnect();
    };
  }, []);

  return null;
}
