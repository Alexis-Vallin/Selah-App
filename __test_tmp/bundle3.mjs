import { build } from 'esbuild';

const stubsPath = 'C:/Users/ruthe/Selah-App/__test_tmp/stubs.mjs';

const stubPlugin = {
  name: 'stub',
  setup(build) {
    build.onResolve({ filter: /^lucide-react$/ }, () => ({ path: stubsPath }));
    build.onResolve({ filter: /\.\/BibleStudy$/ }, () => ({ path: stubsPath }));
    build.onResolve({ filter: /\.\/Button$/ }, () => ({ path: stubsPath }));
    build.onResolve({ filter: /\.\.\/services\/geminiService$/ }, () => ({ path: stubsPath }));
    build.onResolve({ filter: /^react$/ }, () => ({ external: true }));
    build.onResolve({ filter: /^react-dom.*$/ }, () => ({ external: true }));
    build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ external: true }));
  }
};

await build({
  entryPoints: ['C:/Users/ruthe/Selah-App/components/Dashboard.tsx'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  plugins: [stubPlugin],
  outfile: 'C:/Users/ruthe/Selah-App/__test_tmp/Dashboard.bundle.mjs',
  logLevel: 'info'
});
console.log('Bundle done');
