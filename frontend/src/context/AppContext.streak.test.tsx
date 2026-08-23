// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AppProvider, useApp } from "./AppContext";
import {
  initialState,
  persistenceService,
} from "../services/persistenceService";
import { recordMeaningfulActivity } from "../services/streakService";

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

  it("keeps streak data unchanged through logout and login", () => {
    const state = recordMeaningfulActivity(
      { ...initialState, user },
      "learning:lesson-1-concept",
    );
    persistenceService.save(state);
    localStorage.setItem(
      "pythonpro.auth",
      JSON.stringify({
        email: user.email,
        passwordHash: btoa("password"),
        user,
      }),
    );
    render(
      <AppProvider>
        <AccountProbe />
      </AppProvider>,
    );
    const before = screen.getByTestId("streak").textContent;
    fireEvent.click(screen.getByRole("button", { name: "Log out test" }));
    expect(screen.getByTestId("streak").textContent).toBe(before);
    fireEvent.click(screen.getByRole("button", { name: "Log in test" }));
    expect(screen.getByTestId("streak").textContent).toBe(before);
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
