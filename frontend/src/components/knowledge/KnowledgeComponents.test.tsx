// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeExample } from "./KnowledgeComponents";

afterEach(cleanup);

describe("CodeExample", () => {
  it("copies code and links the same code to the existing Playground", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const code = "numbers = [1, 2]\nprint(numbers)";
    render(
      <MemoryRouter>
        <CodeExample code={code} title="List example" />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: "Copy List example code" }),
    );
    expect(writeText).toHaveBeenCalledWith(code);
    expect(screen.getByText("Copied")).toBeTruthy();
    const tryIt = screen.getByRole("link", { name: /Try It/i });
    expect(decodeURIComponent(tryIt.getAttribute("href") || "")).toContain(
      code,
    );
  });
});
