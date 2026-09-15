import { build } from 'esbuild';
import { writeFileSync } from 'fs';

// Bundle Dashboard.tsx with all deps externalized except geminiService
const result = await build({
  entryPoints: ['C:/Users/ruthe/Selah-App/components/Dashboard.tsx'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'lucide-react', '../services/geminiService', './BibleStudy', './Button'],
  outfile: 'C:/Users/ruthe/Selah-App/__test_tmp/Dashboard.bundle.mjs',
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  logLevel: 'info'
});
console.log('Bundle done');
