import { build } from 'esbuild';

const result = await build({
  entryPoints: ['C:/Users/ruthe/Selah-App/components/Dashboard.tsx'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  alias: {
    'lucide-react': 'C:/Users/ruthe/Selah-App/__test_tmp/stubs.mjs',
    '../services/geminiService': 'C:/Users/ruthe/Selah-App/__test_tmp/stubs.mjs',
    './BibleStudy': 'C:/Users/ruthe/Selah-App/__test_tmp/stubs.mjs',
    './Button': 'C:/Users/ruthe/Selah-App/__test_tmp/stubs.mjs'
  },
  outfile: 'C:/Users/ruthe/Selah-App/__test_tmp/Dashboard.bundle.mjs',
  logLevel: 'info'
});
console.log('Bundle done');
