import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (!POSTHOG_KEY) {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV === "development") {
    console.warn("PostHog key missing; analytics disabled in development build.");
  }
} else {
  posthog.init(POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true, // Enables PostHog Error Tracking
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    debug: process.env.NODE_ENV === "development",
  });
}
