export const REDACTION_PATTERNS = [
  {
    name: 'email',
    regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    replacement: '[REDACTED_EMAIL]',
  },
  {
    name: 'phone',
    regex: /\+?\d[\d\s\-]{7,15}/g,
    replacement: '[REDACTED_PHONE]',
  },
  {
    name: 'private_key',
    regex: /S[A-Z2-7]{55}/g,
    replacement: '[REDACTED_SECRET]',
  },
  {
    name: 'jwt',
    regex: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
    replacement: '[REDACTED_TOKEN]',
  },
  {
    name: 'ip',
    regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    replacement: '[REDACTED_IP]',
  },
  {
    name: 'long_hex_secret',
    regex: /\b[a-f0-9]{64,}\b/gi,
    replacement: '[REDACTED_SECRET]',
  },
];
