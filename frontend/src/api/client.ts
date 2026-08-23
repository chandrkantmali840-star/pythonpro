import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});
api.interceptors.request.use((c) => {
  const token = localStorage.getItem("pythonpro.token");
  if (token) c.headers.Authorization = `Bearer ${token}`;
  return c;
});
