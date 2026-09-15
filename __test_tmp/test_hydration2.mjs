import { pathToFileURL } from 'url';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost', storageType: 'localStorage'
});
const { window } = dom;
global.window = window;
global.document = window.document;
Object.defineProperty(global, 'navigator', { value: window.navigator, writable: true, configurable: true });
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
window.requestAnimationFrame = global.requestAnimationFrame;
window.cancelAnimationFrame = global.cancelAnimationFrame;

window.localStorage.setItem('selah_user_name', 'John Doe');
window.localStorage.setItem('selah_user_location', 'London, UK');
window.localStorage.setItem('selah_user_struggles', JSON.stringify(['Anxiety & Worry', 'Loneliness']));
window.localStorage.setItem('selah_user_interests', JSON.stringify(['Apologetics', 'Worship Music']));

import { build } from 'esbuild';
const stubPath = 'C:/Users/ruthe/Selah-App/__test_tmp/appStubs.mjs';
const stubPlugin = {
  name: 'stub',
  setup(build) {
    build.onResolve({ filter: /^\.\/components\/Dashboard$/ }, () => ({ path: stubPath }));
    build.onResolve({ filter: /^\.\/components\/Onboarding$/ }, () => ({ path: stubPath }));
    build.onResolve({ filter: /^react$/ }, () => ({ external: true }));
    build.onResolve({ filter: /^react-dom.*$/ }, () => ({ external: true }));
    build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ external: true }));
    build.onResolve({ filter: /^lucide-react$/ }, () => ({ path: stubPath }));
  }
};
await build({
  entryPoints: ['C:/Users/ruthe/Selah-App/App.tsx'],
  bundle: true, format: 'esm', platform: 'node', jsx: 'automatic',
  plugins: [stubPlugin],
  outfile: 'C:/Users/ruthe/Selah-App/__test_tmp/App.bundle.mjs',
  logLevel: 'warning'
});
console.log('Bundle OK');

const { default: App } = await import(pathToFileURL('C:/Users/ruthe/Selah-App/__test_tmp/App.bundle.mjs').href);

const container = window.document.getElementById('root');
const root = createRoot(container);
root.render(React.createElement(App));
await new Promise(r => setTimeout(r, 500));

const hydrated = window.__HYDRATED_USER__;
console.log('=== Hydration from localStorage ===');
console.log('Dashboard rendered (user hydrated):', !!hydrated);
if (hydrated) {
  console.log('name:', JSON.stringify(hydrated.name));
  console.log('location:', JSON.stringify(hydrated.location));
  console.log('struggles:', JSON.stringify(hydrated.struggles));
  console.log('biblicalInterests:', JSON.stringify(hydrated.biblicalInterests));
  console.log('email (should be empty):', JSON.stringify(hydrated.email));
  console.log('streak (default 1):', hydrated.streak);
} else {
  console.log('Dashboard did NOT render - onboarding shown instead');
  console.log('container textContent:', container.textContent.substring(0, 100));
}
