import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[v0] Regenerating pnpm-lock.yaml with new overrides...\n');

try {
  // Run pnpm install without frozen lockfile to regenerate it
  console.log('[v0] Running: pnpm install --no-frozen-lockfile');
  execSync('pnpm install --no-frozen-lockfile', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n[v0] ✓ Lockfile regenerated successfully');
  
  // Check if Git is available and offer to commit
  try {
    execSync('git status', { stdio: 'ignore', cwd: process.cwd() });
    console.log('[v0] Git repository detected');
    console.log('[v0] Next steps:');
    console.log('[v0]   1. Review the changes: git diff pnpm-lock.yaml');
    console.log('[v0]   2. Commit the changes: git add pnpm-lock.yaml && git commit -m "fix: regenerate lockfile with pnpm overrides"');
    console.log('[v0]   3. Push to GitHub: git push');
    console.log('[v0]   4. Redeploy on Vercel');
  } catch {
    console.log('[v0] No Git repository detected. Please commit pnpm-lock.yaml manually.');
  }
  
} catch (error) {
  console.error('[v0] ✗ Error regenerating lockfile:', error.message);
  process.exit(1);
}
