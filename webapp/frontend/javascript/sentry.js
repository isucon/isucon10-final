import * as Sentry from '@sentry/browser';

(() => {
  const meta = document.querySelector('meta[name="xsu:sentry-dsn"]');
  if (meta) {
    Sentry.init({dsn: meta.content});
  }
})();
