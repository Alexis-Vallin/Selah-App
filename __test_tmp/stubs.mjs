import React from 'react';

const makeIcon = (name) => (props) => React.createElement('svg', { 'data-icon': name, ...props });
const icons = ['ArrowLeft','Bell','BookOpen','Check','ChevronRight','Edit2','Flame','Hash','Heart','HelpCircle','Home','LogOut','MapPin','MessageCircle','Moon','Plus','Send','Settings','ShieldCheck','Sun','ThumbsUp','UserCircle','Users','X'];
const lucide = {};
for (const i of icons) lucide[i] = makeIcon(i);
export const { ArrowLeft, Bell, BookOpen, Check, ChevronRight, Edit2, Flame, Hash, Heart, HelpCircle, Home, LogOut, MapPin, MessageCircle, Moon, Plus, Send, Settings, ShieldCheck, Sun, ThumbsUp, UserCircle, Users, X } = lucide;

export const generateScriptureOfTheDay = async () => ({ verseText: 'stub verse', reference: 'Stub 1:1' });
export const BibleStudy = (props) => React.createElement('div', { 'data-stub': 'BibleStudy' });
export const Button = (props) => React.createElement('button', { onClick: props.onClick, className: props.className, 'data-stub': 'Button' }, props.children);
