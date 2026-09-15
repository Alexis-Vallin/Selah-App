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

let currentUser = { ...user };
const setUser = (updater) => { currentUser = typeof updater === 'function' ? updater(currentUser) : updater; };

function clickEl(el) {
  const ev = new window.MouseEvent('click', { bubbles: true, cancelable: true });
  el.dispatchEvent(ev);
}

async function renderFresh() {
  root.render(React.createElement(Dashboard, { user: currentUser, setUser, onLogout: () => {} }));
  await new Promise(r => setTimeout(r, 100));
}

async function navTo(viewName) {
  // Always start from a fresh Profile menu by clicking Profile tab
  const buttons = Array.from(container.querySelectorAll('button'));
  const profileBtn = buttons.find(b => b.textContent.includes('Profile'));
  if (profileBtn) clickEl(profileBtn);
  await new Promise(r => setTimeout(r, 50));
  const target = Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes(viewName));
  if (target) clickEl(target);
  await new Promise(r => setTimeout(r, 50));
  return target;
}

console.log('=== Testing each edit view for hooks violation ===\n');

for (const view of ['Edit Profile', 'Location', 'Discussion Focus Areas', 'Biblical Interests']) {
  capturedErrors = [];
  currentUser = { ...user };
  try {
    await renderFresh();
    const found = await navTo(view);
    const hookErrors = capturedErrors.filter(e => e.includes('Hooks') || e.includes('hooks') || e.includes('Rendered more hooks'));
    console.log(`[${view}] button found: ${!!found} | hooks errors: ${hookErrors.length}`);
    hookErrors.forEach(e => console.log('   ->', e.substring(0, 150)));
  } catch (e) {
    console.log(`[${view}] EXCEPTION: ${e.message}`);
  }
  // unmount to reset for next test
  root.unmount();
  await new Promise(r => setTimeout(r, 50));
  // re-create root
  container.innerHTML = '<div id="root"></div>';
}
