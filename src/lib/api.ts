import { cache } from "react";

import type { AuthSession, Homepage } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

/** Server-side fetches inside Docker use the backend service name. The browser keeps API_URL. */
const SERVER_API_URL = process.env.API_URL_INTERNAL || API_URL;

export const getHomepage = cache(async (): Promise<Homepage> => {
  let response: Response;
  try {
    response = await fetch(`${SERVER_API_URL}/api/homepage/`, { cache: "no-store" });
  } catch {
    throw new Error(
      "The content API is not reachable. Start Django on http://127.0.0.1:8000 and refresh.",
    );
  }
  if (!response.ok) {
    throw new Error("The content API returned an error. Check that Django is running.");
  }
  return response.json();
});

export async function login(username: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Those credentials were not recognised.");
  }
  return response.json();
}

export async function logout(token: string): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout/`, {
    method: "POST",
    headers: { Authorization: `Token ${token}` },
  });
}
