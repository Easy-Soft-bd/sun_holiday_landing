"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminUser = {
  email?: string | null;
  role?: string | null;
} | null;

type PublicAdminContextValue = {
  ready: boolean;
  admin: boolean;
  user: AdminUser;
  refresh: () => Promise<void>;
};

const PublicAdminContext = createContext<PublicAdminContextValue>({
  ready: false,
  admin: false,
  user: null,
  refresh: async () => undefined,
});

export function PublicAdminProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const payload = (await response.json()) as { user?: AdminUser };
      setUser(payload.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const run = () => {
      void refresh();
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    // Defer auth probe so it does not compete with LCP image/fonts.
    if (typeof idleWindow.requestIdleCallback === "function") {
      const id = idleWindow.requestIdleCallback(run, { timeout: 2500 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const timeoutId = window.setTimeout(run, 1200);
    return () => window.clearTimeout(timeoutId);
  }, [refresh]);

  const value = useMemo(
    () => ({
      ready,
      admin: Boolean(user),
      user,
      refresh,
    }),
    [ready, user, refresh],
  );

  return (
    <PublicAdminContext.Provider value={value}>{children}</PublicAdminContext.Provider>
  );
}

export function usePublicAdmin() {
  return useContext(PublicAdminContext);
}
