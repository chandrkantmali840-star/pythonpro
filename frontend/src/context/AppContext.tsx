import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { persistenceService } from "../services/persistenceService";
import type { AppState, User } from "../types";
type Ctx = {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  login: (e: string, p: string) => boolean;
  register: (u: User, p: string) => void;
  logout: () => void;
  bookmark: (b: AppState["bookmarks"][number]) => void;
};
const C = createContext<Ctx | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => persistenceService.load());
  const update = (f: (s: AppState) => AppState) => setState(f);
  useEffect(() => persistenceService.save(state), [state]);
  useEffect(() => {
    const d =
      state.settings.theme === "dark" ||
      (state.settings.theme === "system" &&
        (window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false));
    document.documentElement.classList.toggle("dark", d);
  }, [state.settings.theme]);
  const value: Ctx = {
    state,
    update,
    login: (email, password) => {
      const x = JSON.parse(localStorage.getItem("pythonpro.auth") || "null");
      if (x?.email === email && x?.passwordHash === btoa(password)) {
        update((s) => ({ ...s, user: x.user }));
        return true;
      }
      return false;
    },
    register: (user, password) => {
      localStorage.setItem(
        "pythonpro.auth",
        JSON.stringify({
          email: user.email,
          passwordHash: btoa(password),
          user,
        }),
      );
      update((s) => ({ ...s, user }));
    },
    logout: () => update((s) => ({ ...s, user: null })),
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
