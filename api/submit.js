const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT = 5;

const rateStore = globalThis.__iahcFormRateStore || new Map();
globalThis.__iahcFormRateStore = rateStore;

const cleanText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);
const escapeHtml = (value) => cleanText(value, 5000)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const reply = (res, status, body) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(body);
};

const sameOrigin = (req) => {
  const origin = req.headers.origin;
  if (!origin) return true;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try { return new URL(origin).host === host; } catch { return false; }
};

const withinRateLimit = (req) => {
  const forwarded = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const recent = (rateStore.get(forwarded) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateStore.set(forwarded, recent);
  return true;
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, { error: 'Method not allowed.' });
  }
  if (!sameOrigin(req)) return reply(res, 403, { error: 'Request not allowed.' });
  if (!withinRateLimit(req)) return reply(res, 429, { error: 'Too many requests. Please try again in a few minutes.' });

  const body = req.body || {};
  if (cleanText(body.website, 200)) return reply(res, 200, { ok: true });

  const kind = cleanText(body.kind, 20);
  const email = cleanText(body.email, 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return reply(res, 400, { error: 'Please enter a valid email address.' });

  let subject;
  let html;
  let text;
  const replyTo = email;

  if (kind === 'contact') {
    const name = cleanText(body.name, 100);
    const message = cleanText(body.message, 5000);
    if (name.length < 2 || message.length < 5) return reply(res, 400, { error: 'Please complete your name and message.' });
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');
    subject = `New IAHC website message from ${name.replace(/[\r\n]/g, ' ')}`;
    html = `<h2>New website message</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong><br>${safeMessage}</p>`;
    text = `New website message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  } else if (kind === 'newsletter') {
    subject = 'New IAHC newsletter signup';
    html = `<h2>New newsletter signup</h2><p><strong>Email:</strong> ${escapeHtml(email)}</p>`;
    text = `New newsletter signup\n\nEmail: ${email}`;
  } else {
    return reply(res, 400, { error: 'Unknown form type.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return reply(res, 503, { error: 'Email service is not configured yet.' });

  const recipient = process.env.IAHC_CONTACT_EMAIL || 'ialsohelpcharity@gmail.com';
  const emailDomain = process.env.RESEND_EMAIL_DOMAIN || 'ialsohelpcharity.org';
  const from = process.env.IAHC_FROM_EMAIL || `I Also Help Charity <website@${emailDomain}>`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let resendResponse;
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [recipient], reply_to: replyTo, subject, html, text }),
      signal: controller.signal
    });
  } catch (error) {
    console.error('Resend request failed', error?.name || 'unknown error');
    return reply(res, 502, { error: 'Your information could not be delivered. Please try again or contact IAHC directly.' });
  } finally {
    clearTimeout(timeout);
  }

  if (!resendResponse.ok) {
    console.error('Resend request failed with status', resendResponse.status);
    return reply(res, 502, { error: 'Your information could not be delivered. Please try again or contact IAHC directly.' });
  }

  return reply(res, 200, { ok: true });
};
