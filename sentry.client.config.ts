import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    process.env.SENTRY_DSN ||
    "https://4c371c5e0ee53775f3c5bb999980f030@o4512057459343360.ingest.de.sentry.io/4512057506005072",
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
