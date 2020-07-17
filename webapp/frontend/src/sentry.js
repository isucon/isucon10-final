import * as Sentry from '@sentry/browser';

(() => {
  const meta = document.querySelector('meta[name="isux:sentry-dsn"]');
  if (meta) {
    Sentry.init({dsn: meta.content});
  }
})();
