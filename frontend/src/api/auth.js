import api from "./http";

export async function register(payload) {
  const { data } = await api.post("/register", payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/login", payload);
  return data;
}

export async function logout() {
  await api.post("/logout");
}

export async function me() {
  const { data } = await api.get("/me");
  return data;
}

export async function changePassword(payload) {
  const { data } = await api.post("/change-password", payload);
  return data;
}