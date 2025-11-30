#!/usr/bin/env bash
set -euo pipefail

echo "Testing Xendit (test mode)"

# Load .env.local if present
if [[ -f ".env.local" ]]; then
  set -a
  source .env.local
  set +a
fi

if [[ -z "${XENDIT_SECRET_KEY:-}" ]] || [[ "$XENDIT_SECRET_KEY" == xnd_development_REPLACE_ME* ]]; then
  echo "❌ Missing XENDIT_SECRET_KEY"
  exit 1
fi

# Use basic auth: apiKey as username, empty password
HTTP_CODE=$(curl -s -o /tmp/xendit_resp.json -w "%{http_code}" -u "$XENDIT_SECRET_KEY:" https://api.xendit.co/balance || true)

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Xendit credentials valid (balance endpoint reachable)"
  exit 0
else
  echo "❌ Xendit test failed (HTTP $HTTP_CODE)"
  exit 2
fi
