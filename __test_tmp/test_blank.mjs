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

const baseUser = {
  name: 'Original Name', email: 't@t.com', profilePicture: '', bio: '',
  struggles: [], specificStruggle: '', connectionPreference: 'both',
  availability: [], prayerRequest: '', bibleBook: null, bibleStudyGroupId: null,
  streak: 1, lastCheckIn: null, notificationsEnabled: false, notificationTime: 'Morning',
  notifyOnBuddyMessage: true, notifyOnCommunityPost: true, shareGrowthStats: false,
  defaultAnonymousPrayer: false, moodHistory: [], gratitudeHistory: [], completedLessons: [],
  biblicalInterests: [], location: 'Original City', wantsGroupMatch: true
};

let capturedErrors = [];
console.error = (...args) => { capturedErrors.push(args.map(a => a?.message || String(a)).join(' ')); };

function clickEl(el) { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })); }

async function testView(viewName) {
  capturedErrors = [];
  const container = window.document.createElement('div');
  window.document.body.appendChild(container);
  const root = createRoot(container);
  let currentUser = { ...baseUser };
  const setUser = (updater) => { currentUser = typeof updater === 'function' ? updater(currentUser) : updater; };

  root.render(React.createElement(Dashboard, { user: currentUser, setUser, onLogout: () => {} }));
  await new Promise(r => setTimeout(r, 100));

  // Navigate to Profile
  clickEl(Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Profile')));
  await new Promise(r => setTimeout(r, 50));

  // Click target view
  const target = Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes(viewName));
  if (target) clickEl(target);
  await new Promise(r => setTimeout(r, 100));

  const childCount = container.children.length;
  const hasContent = container.textContent.trim().length > 0;
  const inputCount = container.querySelectorAll('input').length;
  const hookErrors = capturedErrors.filter(e => e.includes('Rendered more hooks') || e.includes('change in the order of Hooks'));

  console.log(`[${viewName}] children:${childCount} hasContent:${hasContent} inputs:${inputCount} hookErrors:${hookErrors.length}`);

  root.unmount();
  container.remove();
  await new Promise(r => setTimeout(r, 30));
}

console.log('=== Checking if edit views render or blank the screen ===\n');
for (const view of ['Edit Profile', 'Location', 'Discussion Focus Areas', 'Biblical Interests']) {
  await testView(view);
}
console.log('\n=== Also testing non-edit views (should work) ===');
for (const view of ['My Prayers', 'Notifications', 'Account Settings', 'Help & Support']) {
  await testView(view);
}
