import { execSync } from 'child_process';

console.log('[v0] Regenerating pnpm lockfile with overrides...');

try {
  execSync('pnpm install --no-frozen-lockfile', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('[v0] Successfully regenerated pnpm-lock.yaml');
} catch (error) {
  console.error('[v0] Error regenerating lockfile:', error.message);
  process.exit(1);
}
