// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "../services/authService";
import { AppProvider, useApp } from "./AppContext";
import {
  initialState,
  persistenceService,
} from "../services/persistenceService";
import { recordMeaningfulActivity } from "../services/streakService";

vi.mock("../services/authService", () => ({
  apiAuthenticationEnabled: false,
  authService: {
    currentUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    token: vi.fn(),
  },
}));

const user = {
  id: "student-1",
  fullName: "Yash Student",
  email: "yash@example.com",
  studentId: "ST-1",
  course: "Python",
  year: "1",
};

describe("streak persistence around account actions", () => {
  beforeEach(() => localStorage.clear());

  it("does not increase the streak on refresh/load", () => {
    const state = recordMeaningfulActivity(
      { ...initialState, user },
      "learning:lesson-1-concept",
    );
    persistenceService.save(state);
    const first = persistenceService.load(),
      refreshed = persistenceService.load();
    expect(refreshed.streak).toEqual(first.streak);
    expect(refreshed.streak.activeDates).toHaveLength(1);
  });

  it("keeps streak data unchanged through logout and login", async () => {
    const state = recordMeaningfulActivity(
      { ...initialState, user },
      "learning:lesson-1-concept",
    );
    persistenceService.save(state);
    vi.mocked(authService.login).mockResolvedValue(user);
    render(
      <AppProvider>
        <AccountProbe />
      </AppProvider>,
    );
    const before = screen.getByTestId("streak").textContent;
    fireEvent.click(screen.getByRole("button", { name: "Log out test" }));
    expect(screen.getByTestId("streak").textContent).toBe(before);
    fireEvent.click(screen.getByRole("button", { name: "Log in test" }));
    await waitFor(() =>
      expect(screen.getByTestId("streak").textContent).toBe(before),
    );
  });
});

function AccountProbe() {
  const { state, login, logout } = useApp();
  return (
    <>
      <span data-testid="streak">
        {state.streak.currentStreak}:{state.streak.activeDates.join(",")}
      </span>
      <button onClick={logout}>Log out test</button>
      <button onClick={() => login(user.email, "password")}>Log in test</button>
    </>
  );
}
