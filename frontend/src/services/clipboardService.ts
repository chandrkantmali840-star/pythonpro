export const clipboardService = {
  async copy(text: string) {
    if (!navigator.clipboard?.writeText)
      throw new Error("Clipboard access is unavailable in this browser.");
    await navigator.clipboard.writeText(text);
  },
};
