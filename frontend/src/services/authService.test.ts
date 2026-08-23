// @vitest-environment jsdom
import { webcrypto } from "node:crypto";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { authService } from "./authService";

const user = {
  id: "student-secure",
  fullName: "Secure Student",
  email: "secure@example.com",
  studentId: "SEC-1",
  course: "Python",
  year: "1",
};

describe("local demo authentication", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: webcrypto,
    });
  });

  beforeEach(() => localStorage.clear());

  it("stores a salted password hash and can log in", async () => {
    await authService.register(user, "secure-password-123");
    const stored = localStorage.getItem("pythonpro.local-auth.v2") || "";

    expect(stored).not.toContain("secure-password-123");
    expect(localStorage.getItem("pythonpro.auth")).toBeNull();
    await expect(
      authService.login(user.email, "secure-password-123"),
    ).resolves.toEqual(user);
  });

  it("rejects an incorrect password", async () => {
    await authService.register(user, "secure-password-123");
    await expect(authService.login(user.email, "wrong-password")).rejects.toThrow(
      "Email or password is incorrect.",
    );
  });
});
