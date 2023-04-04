import api from "../utils/api";

export async function register(username: string, email: string, password: string) {
  const response = await api.post("/users", { username, email, password });
  return response.data;
}

export async function login(username: string, password: string) {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
}

