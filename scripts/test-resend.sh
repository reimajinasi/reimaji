#!/usr/bin/env bash
set -euo pipefail

echo "Testing Resend"

# Load .env.local if present
if [[ -f ".env.local" ]]; then
  set -a
  source .env.local
  set +a
fi

if [[ -z "${RESEND_API_KEY:-}" ]] || [[ "$RESEND_API_KEY" == re_REPLACE_ME* ]]; then
  echo "❌ Missing RESEND_API_KEY"
  exit 1
fi

HTTP_CODE=$(curl -s -o /tmp/resend_resp.json -w "%{http_code}" -H "Authorization: Bearer $RESEND_API_KEY" https://api.resend.com/domains || true)

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Resend credentials valid (domains endpoint reachable)"
  exit 0
else
  echo "❌ Resend test failed (HTTP $HTTP_CODE)"
  exit 2
fi
