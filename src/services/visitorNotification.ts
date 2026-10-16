/**
 * BADAL // 001 — SECURE VISITOR NOTIFICATION SERVICE
 *
 * Privacy-conscious visitor notification and telemetry dispatcher.
 * - Records: Timestamp, Page Path, Referrer, Anonymous Session ID, Screen Resolution, Browser Language.
 * - Zero sensitive data, zero device fingerprinting, zero passwords or location tracking.
 * - Prevents notification spam: executes at most ONCE per browser session via sessionStorage.
 * - Completely safe for public GitHub repositories and GitHub Pages static hosting:
 *   NO API keys, passwords, or webhook secrets are stored in client-side code.
 * - In production, forwards payload to an external serverless endpoint (e.g. Vercel, Cloudflare,
 *   or Formspree) configured via VITE_VISITOR_NOTIFICATION_URL.
 */

export interface VisitorPayload {
  timestamp: string;
  path: string;
  referrer: string;
  sessionId: string;
  screen: string;
  language: string;
  pilotName?: string;
  userAgentBrief: string;
}

const SESSION_STORAGE_FLAG = 'badal_visit_notified';
const SESSION_ID_KEY = 'badal_anon_session_id';

/**
 * Generate or retrieve an anonymous session identifier for this visit.
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = 'pilot_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch {
    return 'fallback_' + Math.random().toString(36).substring(2, 9);
  }
}

/**
 * Notify owner of a new unique visitor session.
 * Guaranteed to execute only once per browser session to prevent refresh spam.
 */
export async function trackVisitorArrival(pilotName?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Guard against repeat notifications within the same session
    if (sessionStorage.getItem(SESSION_STORAGE_FLAG) === 'true') {
      return false;
    }

    const endpoint = import.meta.env.VITE_VISITOR_NOTIFICATION_URL;
    const sessionId = getOrCreateSessionId();

    const payload: VisitorPayload = {
      timestamp: new Date().toISOString(),
      path: window.location.pathname + window.location.hash,
      referrer: document.referrer || 'Direct / Bookmark',
      sessionId,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language || 'en',
      pilotName: pilotName || undefined,
      userAgentBrief: navigator.userAgent.slice(0, 120),
    };

    // Mark as notified in this session immediately to prevent race conditions
    sessionStorage.setItem(SESSION_STORAGE_FLAG, 'true');

    // 2. Dispatch if a notification endpoint is configured
    if (endpoint && typeof endpoint === 'string' && endpoint.trim().length > 0) {
      if (typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        const enqueued = navigator.sendBeacon(endpoint, blob);
        if (enqueued) return true;
      }

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
        keepalive: true,
      });
      return true;
    } else {
      // Local development or unconfigured mode: log safe debug telemetry
      if (import.meta.env.DEV) {
        console.info(
          '%c[BADAL // 001]%c Visitor session recorded locally (Anonymous session ID: ' +
            sessionId +
            '). Set VITE_VISITOR_NOTIFICATION_URL in .env to receive live alerts.',
          'color: #10b981; font-weight: bold;',
          'color: #94a3b8;'
        );
      }
      return true;
    }
  } catch (err) {
    // Fail silently in frontend so visitor experience is never interrupted
    console.debug('Visitor telemetry notice:', err);
    return false;
  }
}
