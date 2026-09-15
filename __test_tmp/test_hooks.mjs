import { pathToFileURL } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import React from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost',
  storageType: 'localStorage'
});
const { window } = dom;
global.window = window;
global.document = window.document;
Object.defineProperty(global, 'navigator', { value: window.navigator, writable: true, configurable: true });
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
window.requestAnimationFrame = global.requestAnimationFrame;
window.cancelAnimationFrame = global.cancelAnimationFrame;

// Intercept module resolution to provide stubs
import { Module } from 'module';
const stubsPath = require.resolve('C:/Users/ruthe/Selah-App/__test_tmp/stubs.mjs');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request === 'lucide-react' || request === '../services/geminiService' || request === './BibleStudy' || request === './Button') {
    return stubsPath;
  }
  return origResolve.call(this, request, parent, ...rest);
};

const { Dashboard } = await import(pathToFileURL('C:/Users/ruthe/Selah-App/__test_tmp/Dashboard.bundle.mjs').href);

const user = {
  name: 'Test User', email: 't@t.com', profilePicture: '', bio: '',
  struggles: [], specificStruggle: '', connectionPreference: 'both',
  availability: [], prayerRequest: '', bibleBook: null, bibleStudyGroupId: null,
  streak: 1, lastCheckIn: null, notificationsEnabled: false, notificationTime: 'Morning',
  notifyOnBuddyMessage: true, notifyOnCommunityPost: true, shareGrowthStats: false,
  defaultAnonymousPrayer: false, moodHistory: [], gratitudeHistory: [], completedLessons: [],
  biblicalInterests: [], location: '', wantsGroupMatch: true
};

const container = window.document.getElementById('root');
const root = createRoot(container);

let capturedErrors = [];
const origError = console.error;
console.error = (...args) => { capturedErrors.push(args.map(a => a?.message || String(a)).join(' ')); };

let currentUser = user;
const setUser = (updater) => { currentUser = typeof updater === 'function' ? updater(currentUser) : updater; };

// Helper to dispatch click on an element
function clickEl(el) {
  const ev = new window.MouseEvent('click', { bubbles: true, cancelable: true });
  el.dispatchEvent(ev);
}

// Helper to set input value (React-controlled)
function setInputValue(el, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(el, value);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
}

try {
  root.render(React.createElement(Dashboard, { user, setUser, onLogout: () => {} }));
  await new Promise(r => setTimeout(r, 200));
  console.log('=== STEP 1: Initial render ===');
  console.log('Render OK. Errors:', capturedErrors.length);
  capturedErrors.forEach((e, i) => console.log(`  err[${i}]:`, e.substring(0, 300)));

  // Navigate to Profile tab (bottom nav)
  console.log('\n=== STEP 2: Click Profile tab ===');
  const buttons = Array.from(container.querySelectorAll('button'));
  const profileBtn = buttons.find(b => b.textContent.includes('Profile'));
  console.log('Found Profile button:', !!profileBtn);
  clickEl(profileBtn);
  await new Promise(r => setTimeout(r, 100));
  console.log('After Profile click, errors:', capturedErrors.length);

  // Find "Edit Profile" MenuCard
  console.log('\n=== STEP 3: Click "Edit Profile" menu card ===');
  const editProfileBtn = Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Edit Profile'));
  console.log('Found Edit Profile button:', !!editProfileBtn);
  clickEl(editProfileBtn);
  await new Promise(r => setTimeout(r, 100));
  console.log('After Edit Profile click, errors:', capturedErrors.length);
  capturedErrors.forEach((e, i) => console.log(`  err[${i}]:`, e.substring(0, 300)));

  // Now go back to menu, then click Location
  console.log('\n=== STEP 4: Back to menu, then click Location ===');
  const backBtn = Array.from(container.querySelectorAll('button')).find(b => b.querySelector('[data-icon="ArrowLeft"]'));
  if (backBtn) clickEl(backBtn);
  await new Promise(r => setTimeout(r, 100));
  const locationBtn = Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Location'));
  console.log('Found Location button:', !!locationBtn);
  clickEl(locationBtn);
  await new Promise(r => setTimeout(r, 100));
  console.log('After Location click, errors:', capturedErrors.length);
  capturedErrors.forEach((e, i) => console.log(`  err[${i}]:`, e.substring(0, 300)));

  console.log('\n=== FINAL: localStorage state ===');
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    console.log(`  ${k} = ${window.localStorage.getItem(k)}`);
  }

} catch (e) {
  console.log('EXCEPTION:', e.message);
  console.log(e.stack);
}
