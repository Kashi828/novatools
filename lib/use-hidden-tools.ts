'use client';

import { useEffect, useState } from 'react';

/** Fetches the current set of admin-hidden tool slugs once on mount, for client
 * components (search, command palette) that filter the static tools list themselves. */
export function useHiddenTools() {
  const [hiddenSlugs, setHiddenSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    fetch('/api/tool-visibility')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setHiddenSlugs(new Set(data.hiddenSlugs ?? []));
      })
      .catch(() => {
        // Fail open — if this request fails, show everything rather than break search.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return hiddenSlugs;
}
