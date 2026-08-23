import { api } from "../api/client";
import type { AppState } from "../types";

export const remoteStateService = {
  async load() {
    const { data } = await api.get<Partial<AppState>>("/state");
    return data;
  },
  async save(state: AppState) {
    const { user: _user, ...data } = state;
    await api.put("/state", data);
  },
};
