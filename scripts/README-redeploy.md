Redeploy without using the existing Build Cache

Option A — Dashboard (recommended)
1. Open your Project in the Vercel Dashboard.
2. Go to the Deployments tab.
3. Click Redeploy on the latest commit.
4. In the popup, UNCHECK “Use existing Build Cache”.
5. Confirm to start a fresh build.

Option B — CLI
- Install CLI: npm i -g vercel
- Run:
  vercel deploy --prod --force
  (You can also use: vercel --force)
- The --force flag tells Vercel to skip the Build cache.

Option C — Env var
- Add a Project Env Var: VERCEL_FORCE_NO_BUILD_CACHE=1
- Redeploy normally from the dashboard or CLI.

Notes
- Skipping the Build cache is the correct way to ensure dependency overrides and lockfile updates are applied on the next build [^1].
- Builds are triggered by Git pushes, the dashboard Deploy button, or the Vercel CLI [^4].

References
- Troubleshooting Build Errors: Skipping Build cache and Redeploy options [^1]
- Builds: How builds are triggered and managed [^4]
