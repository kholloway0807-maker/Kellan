"use client";

import { useState } from "react";
import { CircleNotch, Check, Warning } from "@phosphor-icons/react/dist/ssr";

type Status = "idle" | "submitting" | "success" | "error";

const SPEND_OPTIONS = [
  "Not running ads yet",
  "Under $1,000 a month",
  "$1,000 - $5,000 a month",
  "$5,000 - $15,000 a month",
  "Over $15,000 a month",
];

const fieldClass =
  "w-full rounded-card border border-line bg-raised px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted transition-colors duration-200 focus:border-accent focus:outline-none";

const labelClass = "text-[13px] font-medium text-ink";
const helpClass = "text-[12px] text-muted";

export function AuditForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    const name = String(data.get("name") ?? "").trim();
    const business = String(data.get("business") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (!name) next.name = "Please tell us your name.";
    if (!business) next.business = "Please tell us your business name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "That email address does not look right.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      // TODO: point this at the real endpoint (CRM, Formspree, or a route handler).
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
    } catch {
      setStatus("error");
      setErrors({ form: "Something went wrong. Please email hello@hollowaymarketing.com." });
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-line bg-raised p-8">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check size={20} weight="regular" />
        </div>
        <h3 className="text-[20px] font-semibold tracking-tight text-ink">
          Request received.
        </h3>
        <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted">
          We will look at your account and reply within two business days with
          what we found. No call required to get the audit.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-card border border-line bg-raised p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input id="name" name="name" type="text" className={fieldClass} />
          {errors.name ? (
            <p className="text-[12px] text-accent">{errors.name}</p>
          ) : (
            <p className={helpClass}>Who we should ask for.</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business" className={labelClass}>
            Business name
          </label>
          <input id="business" name="business" type="text" className={fieldClass} />
          {errors.business ? (
            <p className="text-[12px] text-accent">{errors.business}</p>
          ) : (
            <p className={helpClass}>So we can find your listings.</p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" className={fieldClass} />
          {errors.email ? (
            <p className="text-[12px] text-accent">{errors.email}</p>
          ) : (
            <p className={helpClass}>We send the audit here as a PDF.</p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="spend" className={labelClass}>
            Current ad spend
          </label>
          <select id="spend" name="spend" defaultValue={SPEND_OPTIONS[0]} className={fieldClass}>
            {SPEND_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <p className={helpClass}>A rough number is fine.</p>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            What is not working right now
          </label>
          <textarea id="message" name="message" rows={4} className={fieldClass} />
          <p className={helpClass}>Optional, but it makes the audit sharper.</p>
        </div>
      </div>

      {errors.form && (
        <p className="mt-5 flex items-center gap-2 text-[13px] text-accent">
          <Warning size={16} weight="regular" />
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent px-6 py-3.5 text-[15px] font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <CircleNotch size={17} weight="regular" className="animate-spin" />
            Sending
          </>
        ) : (
          "Get a free audit"
        )}
      </button>
    </form>
  );
}
