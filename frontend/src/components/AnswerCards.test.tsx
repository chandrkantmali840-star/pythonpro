// @vitest-environment jsdom
import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AnswerCards,
  AnswerFeedback,
  isCodeOption,
  shortcutIndex,
  useSingleColumn,
} from "./AnswerCards";

const options = ["First", "Second", "Third", "Fourth"];

afterEach(cleanup);

function ControlledCards() {
  const [value, setValue] = useState("");
  return <AnswerCards options={options} value={value} onChange={setValue} />;
}

describe("AnswerCards", () => {
  it("selects one option and lets the student change it before submission", async () => {
    const user = userEvent.setup();
    render(<ControlledCards />);
    const cards = screen.getAllByRole("radio");

    await user.click(cards[0]);
    expect(cards[0].getAttribute("aria-checked")).toBe("true");
    expect(cards[1].getAttribute("aria-checked")).toBe("false");

    await user.click(cards[1]);
    expect(cards[0].getAttribute("aria-checked")).toBe("false");
    expect(cards[1].getAttribute("aria-checked")).toBe("true");
  });

  it("shows the selected wrong answer and the correct answer only after submission", () => {
    const { rerender } = render(
      <AnswerCards options={options} value="First" onChange={() => {}} />,
    );
    expect(screen.queryByText("Your answer")).toBeNull();
    expect(screen.queryByText("Correct answer")).toBeNull();

    rerender(
      <AnswerCards
        options={options}
        value="First"
        onChange={() => {}}
        submitted
        correctAnswer="Second"
      />,
    );
    expect(screen.getByText("Your answer")).toBeTruthy();
    expect(screen.getByText("Correct answer")).toBeTruthy();
  });

  it("supports A-D and 1-4 shortcuts plus Enter submission", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <AnswerCards
        options={options}
        value="Second"
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.keyDown(window, { key: "C" });
    expect(onChange).toHaveBeenLastCalledWith("Third");
    fireEvent.keyDown(window, { key: "4" });
    expect(onChange).toHaveBeenLastCalledWith("Fourth");
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("does not trigger shortcuts while the student is typing", () => {
    const onChange = vi.fn();
    render(
      <div>
        <input aria-label="Code input" />
        <AnswerCards options={options} value="" onChange={onChange} />
      </div>,
    );
    fireEvent.keyDown(screen.getByLabelText("Code input"), { key: "A" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("uses one column for long or code options and preserves code formatting", () => {
    expect(useSingleColumn(options)).toBe(false);
    expect(
      useSingleColumn([
        "This intentionally long answer explains a Python behavior in enough detail to need the full width.",
        "Short",
      ]),
    ).toBe(true);
    expect(isCodeOption('print("Hello")')).toBe(true);
    expect(shortcutIndex("A")).toBe(0);
    expect(shortcutIndex("4")).toBe(3);

    const { container } = render(
      <AnswerCards
        options={['if ready:\n    print("Go")', "No output"]}
        value=""
        onChange={() => {}}
      />,
    );
    expect(container.querySelector("code")?.textContent).toContain(
      'print("Go")',
    );
    expect(screen.getByRole("radiogroup").className).toContain("grid-cols-1");
  });
});

describe("AnswerFeedback", () => {
  it("renders educational feedback, concept, reward, and next action", () => {
    render(
      <MemoryRouter>
        <AnswerFeedback
          correct
          selectedAnswer="Second"
          correctAnswer="Second"
          explanation="Python evaluates this expression from left to right."
          concept="Evaluation order"
          reviewPath="/learn"
          xpGained={10}
          onNext={() => {}}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Correct!")).toBeTruthy();
    expect(screen.getByText("+10 XP")).toBeTruthy();
    expect(screen.getByText(/Evaluation order/)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Review concept/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Next question/i })).toBeTruthy();
  });
});
