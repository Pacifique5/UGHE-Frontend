"use client";

import { FormEvent, useEffect, useState } from "react";

import { Header } from "@/components/Header";
import { API_URL, login, logout } from "@/lib/api";
import type { AuthSession, Homepage } from "@/lib/types";

const STORAGE_KEY = "ughe_auth";

export function LoginForm({ data }: { data: Homepage | null }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }
    try {
      setSession(JSON.parse(saved) as AuthSession);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const nextSession = await login(username.trim(), password);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setPassword("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login failed.");
    } finally {
      setPending(false);
    }
  }

  async function onLogout() {
    if (session) {
      await logout(session.token);
    }
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  return (
    <>
      {data ? <Header data={data} /> : null}
      <main className="login-main">
        <section className="login-card">
          <h1>Staff login</h1>
          <p>
            Sign in with the predefined account, then add slides, menus, and statistics in Django
            admin. The public homepage reads that content from the API.
          </p>
          {session ? (
            <>
              <p>
                Signed in as <strong>{session.username}</strong>.
              </p>
              <div className="login-actions">
                <a className="text-button" href={`${API_URL}/admin/`} target="_blank" rel="noopener noreferrer">
                  Open Django admin
                </a>
                <a className="text-button" href="/">
                  View homepage
                </a>
                <button type="button" className="text-button" onClick={onLogout}>
                  Log out
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              <label>
                Username
                <input
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              {error ? <p className="form-error">{error}</p> : null}
              <button type="submit" disabled={pending}>
                {pending ? "Signing in..." : "Sign in"}
              </button>
              <p className="login-note">Predefined account: ughe_admin / UGHE-admin-2026</p>
            </form>
          )}
        </section>
      </main>
    </>
  );
}
