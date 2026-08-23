import axios from "axios";
import { api } from "../api/client";
import type { User } from "../types";

const TOKEN_KEY = "pythonpro.token";
const LOCAL_AUTH_KEY = "pythonpro.local-auth.v2";
const LEGACY_AUTH_KEY = "pythonpro.auth";
const ITERATIONS = 210_000;

type AuthResponse = { token: string; user: User };
type LocalAuthRecord = {
  email: string;
  passwordHash: string;
  salt: string;
  user: User;
};

export const apiAuthenticationEnabled =
  import.meta.env.VITE_USE_API === "true" ||
  Boolean(import.meta.env.VITE_API_URL);

function bytesToBase64(bytes: Uint8Array) {
  let value = "";
  bytes.forEach((byte) => (value += String.fromCharCode(byte)));
  return btoa(value);
}

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function derivePasswordHash(password: string, salt: Uint8Array) {
  if (!crypto.subtle)
    throw new Error("Secure browser storage is unavailable in this browser.");
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt.slice().buffer as ArrayBuffer,
      iterations: ITERATIONS,
    },
    material,
    256,
  );
  return bytesToBase64(new Uint8Array(bits));
}

function errorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string") return message;
    if (!error.response)
      return "The PythonPro server is unavailable. Please try again shortly.";
  }
  return error instanceof Error ? error.message : fallback;
}

async function saveLocalAccount(user: User, password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const record: LocalAuthRecord = {
    email: user.email.trim().toLowerCase(),
    passwordHash: await derivePasswordHash(password, salt),
    salt: bytesToBase64(salt),
    user,
  };
  localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(record));
  localStorage.removeItem(LEGACY_AUTH_KEY);
}

async function loginLocally(email: string, password: string) {
  const raw = localStorage.getItem(LOCAL_AUTH_KEY);
  if (raw) {
    const record = JSON.parse(raw) as LocalAuthRecord;
    const hash = await derivePasswordHash(password, base64ToBytes(record.salt));
    if (
      record.email === email.trim().toLowerCase() &&
      record.passwordHash === hash
    )
      return record.user;
  }

  // Migrate accounts created by older PythonPro builds, then remove the
  // reversible legacy password record immediately.
  const legacyRaw = localStorage.getItem(LEGACY_AUTH_KEY);
  if (legacyRaw) {
    const legacy = JSON.parse(legacyRaw) as {
      email?: string;
      passwordHash?: string;
      user?: User;
    };
    if (
      legacy.user &&
      legacy.email?.toLowerCase() === email.trim().toLowerCase() &&
      legacy.passwordHash === btoa(password)
    ) {
      await saveLocalAccount(legacy.user, password);
      return legacy.user;
    }
  }
  throw new Error("Email or password is incorrect.");
}

export const authService = {
  token() {
    return localStorage.getItem(TOKEN_KEY);
  },
  async register(user: User, password: string) {
    if (!apiAuthenticationEnabled) {
      await saveLocalAccount(user, password);
      return user;
    }
    try {
      const { data } = await api.post<AuthResponse>("/auth/register", {
        ...user,
        password,
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      return data.user;
    } catch (error) {
      throw new Error(errorMessage(error, "Unable to create the account."));
    }
  },
  async login(email: string, password: string) {
    if (!apiAuthenticationEnabled) return loginLocally(email, password);
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      return data.user;
    } catch (error) {
      throw new Error(errorMessage(error, "Unable to log in."));
    }
  },
  async currentUser() {
    if (!apiAuthenticationEnabled || !this.token()) return null;
    try {
      const { data } = await api.get<User>("/auth/me");
      return data;
    } catch {
      this.logout();
      return null;
    }
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
};
