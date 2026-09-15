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
function setInputValue(el, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(el, value);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
}

const container = window.document.getElementById('root');
const root = createRoot(container);
let currentUser = { ...baseUser };
const setUser = (updater) => { currentUser = typeof updater === 'function' ? updater(currentUser) : updater; };

root.render(React.createElement(Dashboard, { user: currentUser, setUser, onLogout: () => {} }));
await new Promise(r => setTimeout(r, 100));

// Navigate to Profile > Edit Profile
clickEl(Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Profile')));
await new Promise(r => setTimeout(r, 50));
clickEl(Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Edit Profile')));
await new Promise(r => setTimeout(r, 100));

// Check if the edit form rendered (input for name)
const nameInput = container.querySelector('input');
console.log('=== Edit Profile form rendered? ===');
console.log('Name input found:', !!nameInput);
if (nameInput) console.log('Name input value:', nameInput.value);

// Check localStorage before save
console.log('\n=== localStorage BEFORE save ===');
console.log('selah_user_name:', window.localStorage.getItem('selah_user_name'));

// Try to change name and save
if (nameInput) {
  setInputValue(nameInput, 'New Edited Name');
  await new Promise(r => setTimeout(r, 50));
  console.log('Name input after change:', nameInput.value);
  // Find Save button
  const saveBtn = Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Save Changes'));
  console.log('Save button found:', !!saveBtn);
  if (saveBtn) clickEl(saveBtn);
  await new Promise(r => setTimeout(r, 100));
}

console.log('\n=== localStorage AFTER save ===');
console.log('selah_user_name:', window.localStorage.getItem('selah_user_name'));
console.log('currentUser.name:', currentUser.name);

console.log('\n=== Errors during save flow ===');
console.log('Total errors:', capturedErrors.length);
capturedErrors.forEach((e,i) => console.log(`  [${i}]:`, e.substring(0, 120)));

// Check if the app is in a broken state - does the profile menu render?
console.log('\n=== App state after save ===');
const menuText = container.textContent;
console.log('Contains "Active Memberships":', menuText.includes('Active Memberships'));
console.log('Contains "Edit Profile":', menuText.includes('Edit Profile'));
console.log('Root has children:', container.children.length > 0);
