import React from 'react';
export const Loader2 = (props) => React.createElement('svg', { 'data-icon': 'Loader2', ...props });
export const Dashboard = (props) => {
  if (typeof window !== 'undefined') window.__HYDRATED_USER__ = props.user;
  return React.createElement('div', { id: 'dashboard-stub' }, 'Dashboard stub, user=' + (props.user?.name || 'none'));
};
export const Onboarding = () => React.createElement('div', { id: 'onboarding-stub' }, 'Onboarding stub');
export const generateScriptureOfTheDay = async () => ({ verseText: 's', reference: 'r' });
