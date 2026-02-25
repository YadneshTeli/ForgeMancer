#!/bin/bash
cd /vercel/share/v0-project
echo "Fixing pnpm lockfile mismatch..."
pnpm install --no-frozen-lockfile
echo "Lockfile fixed successfully!"
