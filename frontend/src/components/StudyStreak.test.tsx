// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { AppProvider } from "../context/AppContext";
import {
  initialState,
  persistenceService,
} from "../services/persistenceService";
import { recordMeaningfulActivity } from "../services/streakService";
import { DashboardStreakCard, StreakIndicator } from "./StudyStreak";

describe("study streak UI", () => {
  beforeEach(() => localStorage.clear());

  it("shows a clear zero-day state for a new student", () => {
    persistenceService.save(initialState);
    renderWithState(
      <>
        <StreakIndicator />
        <DashboardStreakCard />
      </>,
    );
    expect(
      screen.getByRole("button", {
        name: "0 Day Learning Streak. Open streak details.",
      }),
    ).toBeTruthy();
    expect(screen.getByText("Start your streak")).toBeTruthy();
    expect(
      screen.getByText("Complete one learning activity today to begin."),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Start Learning" })).toBeTruthy();
  });

  it("shows a seven-day milestone and opens real details", () => {
    let state = initialState;
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - offset);
      state = recordMeaningfulActivity(state, `activity:${offset}`, date);
    }
    persistenceService.save(state);
    renderWithState(<StreakIndicator />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "7 Day Learning Streak. Open streak details.",
      }),
    );
    expect(
      screen.getByRole("dialog", { name: "Your study activity" }),
    ).toBeTruthy();
    expect(screen.getAllByText("7 days")).toHaveLength(2);
    expect(screen.getByText("Next milestone: 14 days")).toBeTruthy();
  });
});

function renderWithState(children: ReactNode) {
  return render(
    <BrowserRouter>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>,
  );
}
