import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  initialState,
  persistenceService,
} from "../services/persistenceService";
import {
  apiAuthenticationEnabled,
  authService,
} from "../services/authService";
import { remoteStateService } from "../services/remoteStateService";
import type { AppState, User } from "../types";
type Ctx = {
  state: AppState;
  authReady: boolean;
  update: (f: (s: AppState) => AppState) => void;
  login: (e: string, p: string) => Promise<void>;
  register: (u: User, p: string) => Promise<void>;
  logout: () => void;
  bookmark: (b: AppState["bookmarks"][number]) => void;
};
const C = createContext<Ctx | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => persistenceService.load());
  const [authReady, setAuthReady] = useState(!apiAuthenticationEnabled);
  const hydratedFromServer = useRef(!apiAuthenticationEnabled);
  const update = (f: (s: AppState) => AppState) => setState(f);

  useEffect(() => {
    if (!apiAuthenticationEnabled) return;
    let active = true;
    void (async () => {
      const user = await authService.currentUser();
      if (!active) return;
      if (!user) {
        setState(initialState);
        hydratedFromServer.current = true;
        setAuthReady(true);
        return;
      }
      try {
        const remote = await remoteStateService.load();
        if (active)
          setState({ ...persistenceService.hydrate(remote), user });
      } catch {
        if (active) setState((current) => ({ ...current, user }));
      } finally {
        if (active) {
          hydratedFromServer.current = true;
          setAuthReady(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => persistenceService.save(state), [state]);
  useEffect(() => {
    if (
      !apiAuthenticationEnabled ||
      !authReady ||
      !hydratedFromServer.current ||
      !state.user
    )
      return;
    const timer = window.setTimeout(() => {
      void remoteStateService.save(state).catch(() => {
        // The local cache remains available and the next state change retries.
      });
    }, 750);
    return () => window.clearTimeout(timer);
  }, [authReady, state]);

  useEffect(() => {
    const d =
      state.settings.theme === "dark" ||
      (state.settings.theme === "system" &&
        (window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false));
    document.documentElement.classList.toggle("dark", d);
  }, [state.settings.theme]);
  const value: Ctx = {
    state,
    authReady,
    update,
    login: async (email, password) => {
      const user = await authService.login(email, password);
      if (apiAuthenticationEnabled) {
        const remote = await remoteStateService.load();
        hydratedFromServer.current = true;
        setState({ ...persistenceService.hydrate(remote), user });
      } else {
        update((current) => ({ ...current, user }));
      }
      setAuthReady(true);
    },
    register: async (user, password) => {
      const registered = await authService.register(user, password);
      const next = { ...initialState, user: registered };
      hydratedFromServer.current = true;
      setState(next);
      if (apiAuthenticationEnabled) await remoteStateService.save(next);
      setAuthReady(true);
    },
    logout: () => {
      authService.logout();
      setState((current) =>
        apiAuthenticationEnabled ? initialState : { ...current, user: null },
      );
    },
    bookmark: (b) =>
      update((s) => ({
        ...s,
        bookmarks: s.bookmarks.some((x) => x.kind === b.kind && x.id === b.id)
          ? s.bookmarks.filter((x) => !(x.kind === b.kind && x.id === b.id))
          : [...s.bookmarks, b],
      })),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useApp = () => {
  const c = useContext(C);
  if (!c) throw Error("AppProvider missing");
  return c;
};
