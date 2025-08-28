#!/usr/bin/env bash
# Redeploy on Vercel without using the build cache.
# Requirements:
# - Vercel CLI installed: npm i -g vercel
# - Environment variables set:
#   VERCEL_TOKEN   -> your Vercel token
#   VERCEL_ORG_ID  -> your Vercel Team or Personal ID (optional if already linked)
#   VERCEL_PROJECT_ID -> your Vercel Project ID (optional if already linked)

set -euo pipefail

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI is not installed. Install with: npm i -g vercel"
  exit 1
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Please export VERCEL_TOKEN before running this script."
  exit 1
fi

echo "Pulling environment settings (optional)..."
vercel pull --yes --environment=production --token "$VERCEL_TOKEN" || true

echo "Triggering deployment without existing build cache..."
# --force skips existing build cache on Vercel
vercel deploy --prod --force --token "$VERCEL_TOKEN" --yes
echo "Done. Check your Vercel dashboard for build logs."
