"use client";

import { useEffect } from "react";

export function FaviconThemeSwitcher() {
  useEffect(() => {
    const light = "/favicon/favicon-light.png";
    const dark = "/favicon/favicon-dark.png";

    const getLink = () => {
      let link = document.querySelector<HTMLLinkElement>(
        'link[data-theme-favicon]'
      );
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.dataset.themeFavicon = "true";
        document.head.appendChild(link);
      }
      return link;
    };

    const apply = (isDark: boolean) => {
      const link = getLink();
      link.href = isDark ? dark : light;
    };

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches);

    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);

    // Next.js re-injects favicon <link> on client-side navigations;
    // recreate/apply the theme favicon whenever <head> changes.
    const observer = new MutationObserver(() => apply(mq.matches));
    observer.observe(document.head, { childList: true, subtree: true });

    return () => {
      mq.removeEventListener("change", handler);
      observer.disconnect();
      document.querySelector('link[data-theme-favicon]')?.remove();
    };
  }, []);

  return null;
}
