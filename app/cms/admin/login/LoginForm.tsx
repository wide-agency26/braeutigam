"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/app/actions/auth";

const INITIAL: AuthState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, INITIAL);

  return (
    <form action={action} className="desk-form">
      <label className="desk-field">
        <span>Email</span>
        <input
          className="desk-input"
          type="email"
          name="email"
          autoComplete="username"
          required
        />
        {state.fieldErrors?.email ? (
          <p className="desk-error">{state.fieldErrors.email[0]}</p>
        ) : null}
      </label>
      <label className="desk-field">
        <span>Password</span>
        <input
          className="desk-input"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        {state.fieldErrors?.password ? (
          <p className="desk-error">{state.fieldErrors.password[0]}</p>
        ) : null}
      </label>
      {state.error ? <p className="desk-banner">{state.error}</p> : null}
      <button className="desk-btn desk-btn-primary" type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
