# Fix Lockfile Sync Error

The pnpm lockfile is out of sync with the new `overrides` configuration in package.json.

## Quick Fix

Run locally on your machine:

\`\`\`bash
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml
git commit -m "fix: regenerate lockfile with pnpm overrides"
git push
\`\`\`

## Using the Script

Or use the automated script:

\`\`\`bash
node scripts/regenerate-lockfile.mjs
\`\`\`

## What Happened

- Added pnpm `overrides` to force @hookform/resolvers@3.3.4 and zod@3.24.1
- The old pnpm-lock.yaml doesn't know about these overrides
- Vercel rejected the installation because of the mismatch
- Regenerating the lockfile with the new overrides will fix this

## Why This Works

When you run `pnpm install --no-frozen-lockfile`:
1. pnpm reads the overrides from package.json
2. It regenerates pnpm-lock.yaml with the correct dependency graph
3. The new lockfile will include the override constraints
4. Vercel's frozen install will now succeed with matching overrides

## After Pushing

- Commit and push the updated pnpm-lock.yaml
- Redeploy on Vercel—the build should pass
- The overrides ensure @hookform/resolvers stays at v3.3.4 (zod v3 compatible)
