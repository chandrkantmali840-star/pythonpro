const PREFIX = "pythonpro.draft.";
export const draftService = {
  load(activityId: string) {
    try {
      return localStorage.getItem(PREFIX + activityId);
    } catch {
      return null;
    }
  },
  save(activityId: string, code: string) {
    try {
      localStorage.setItem(PREFIX + activityId, code);
    } catch {
      // Draft saving is helpful, but the editor must still work if storage is full.
    }
  },
  remove(activityId: string) {
    try {
      localStorage.removeItem(PREFIX + activityId);
    } catch {
      // Reset still restores local state when storage is unavailable.
    }
  },
};
