"use client";

import { useState, FormEvent } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "./Button";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const SERVICES = [
  "Mowing (Weekly / Bi-weekly)",
  "Edging",
  "Weed Control",
  "Fertilization",
  "Aeration",
  "Overseeding",
  "Leaf Cleanup",
  "Snow Removal",
  "Free Estimate / Not Sure Yet",
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (data.phone && !/^[\d\s\-().+]{7,}$/.test(data.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!data.message.trim()) errors.message = "Please tell us a bit about your lawn.";
  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Mailto fallback — opens default email client
    const subject = encodeURIComponent(`Free Estimate Request — ${form.service || "General Inquiry"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "Not provided"}\nService: ${form.service || "Not specified"}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:kellan@kellanlawncare.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-green/10 border border-green/20 p-8 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green" aria-hidden="true" />
        <h3 className="text-xl font-bold text-green mb-2">Email Client Opening…</h3>
        <p className="text-gray-600 text-sm">
          Thanks, {form.name}! Your email client should be opening with your request pre-filled. If nothing opened, email us directly at{" "}
          <a href="mailto:kellan@kellanlawncare.com" className="text-green font-medium hover:underline">
            kellan@kellanlawncare.com
          </a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact and free estimate form" className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-green mb-1">
            Full Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
              errors.name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
            }`}
            placeholder="Jane Smith"
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-green mb-1">
            Email <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
            }`}
            placeholder="jane@example.com"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-green mb-1">
            Phone <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            aria-invalid={!!errors.phone}
            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
              errors.phone ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
            }`}
            placeholder="(309) 555-0100"
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="mt-1 text-xs text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Service */}
        <div>
          <label htmlFor="service" className="block text-sm font-semibold text-green mb-1">
            Service Needed
          </label>
          <select
            id="service"
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
          >
            <option value="">Select a service…</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-green mb-1">
          Tell us about your lawn <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          aria-required="true"
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-colors resize-none ${
            errors.message ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
          }`}
          placeholder="Approximate lot size, current condition, any specific concerns…"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Get My Free Estimate →
      </Button>

      <p className="text-xs text-gray-500">
        No obligation. We respond within 24 hours. Or call us directly at{" "}
        <a href="tel:+13095550100" className="text-green font-medium hover:underline">(309) 555-0100</a>.
      </p>
    </form>
  );
}
