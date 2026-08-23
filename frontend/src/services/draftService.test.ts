// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { draftService } from "./draftService";

describe("lesson code drafts", () => {
  beforeEach(() => localStorage.clear());

  it("keeps drafts separate for each activity", () => {
    draftService.save("lesson-1-try", "print('A')");
    draftService.save("lesson-1-bug", "print('B')");
    expect(draftService.load("lesson-1-try")).toBe("print('A')");
    expect(draftService.load("lesson-1-bug")).toBe("print('B')");
  });

  it("removes only the reset activity draft", () => {
    draftService.save("lesson-1-try", "changed");
    draftService.save("lesson-1-bug", "other");
    draftService.remove("lesson-1-try");
    expect(draftService.load("lesson-1-try")).toBeNull();
    expect(draftService.load("lesson-1-bug")).toBe("other");
  });
});
