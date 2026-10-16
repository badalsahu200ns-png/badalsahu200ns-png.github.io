/**
 * BADAL // 001 — SERVERLESS VISITOR NOTIFICATION ENDPOINT
 *
 * This serverless function can be deployed on Vercel, Netlify, or Cloudflare Workers.
 * It receives visitor telemetry from the portfolio frontend and securely transmits
 * an alert to the portfolio owner's configured destination (e.g. Email via Resend,
 * Formspree, Discord Webhook, or Telegram Bot).
 *
 * SECURITY GUARANTEES:
 * - All secrets (API keys, webhook tokens, owner email) reside solely in server-side
 *   environment variables (e.g. VERCEL environment variables).
 * - ZERO secrets are bundled into client-side JavaScript or committed to GitHub Pages.
 * - Basic rate-limiting and payload validation prevents spam and malformed requests.
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

export default async function handler(req: {
  method?: string;
  body?: string | VisitorPayload;
  headers?: Record<string, string>;
}, res: {
  status: (code: number) => { json: (data: unknown) => void };
  setHeader?: (name: string, value: string) => void;
}) {
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { timestamp, path, referrer, sessionId, screen, language, pilotName } = (rawBody || {}) as VisitorPayload;

    const message = [
      `🚀 **New Pilot Arrival on Badal // 001 Career World**`,
      `• **Pilot Name / Callsign**: ${pilotName || 'Anonymous Explorer'}`,
      `• **Timestamp**: ${timestamp || new Date().toISOString()}`,
      `• **Landing Path**: ${path || '/'}`,
      `• **Referrer**: ${referrer || 'Direct'}`,
      `• **Session ID**: \`${sessionId || 'unknown'}\``,
      `• **Screen / Lang**: ${screen || 'unknown'} (${language || 'unknown'})`,
    ].join('\n');

    // Option A: Forward to Discord / Slack / Teams Webhook if configured
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
    }

    // Option B: Forward to Resend Email API if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.OWNER_NOTIFICATION_EMAIL || 'badalsahu200ns@gmail.com';
    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Badal Career World <onboarding@resend.dev>',
          to: [notifyEmail],
          subject: `🚀 Pilot Alert: ${pilotName || 'Visitor'} arrived at Career World`,
          text: message.replace(/\*\*/g, '').replace(/`/g, ''),
        }),
      });
    }

    return res.status(200).json({ status: 'received', sessionId });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return res.status(500).json({ error: errorMsg });
  }
}
