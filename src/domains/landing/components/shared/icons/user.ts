import {
	Eye,
	EyeOff,
	Lock,
	LogIn,
	LogOut,
	Settings,
	Shield,
	ShieldCheck,
	Sliders,
	Unlock,
	User,
	UserCheck,
	UserPlus,
	Users,
} from 'lucide-react';

import type { IconItem } from './types';

export const userIcons: IconItem[] = [
	{ name: 'User', icon: User, category: 'User', keywords: ['user', 'person', 'profile'] },
	{ name: 'Users', icon: Users, category: 'User', keywords: ['users', 'people', 'group'] },
	{ name: 'UserCheck', icon: UserCheck, category: 'User', keywords: ['user', 'check', 'verified'] },
	{ name: 'UserPlus', icon: UserPlus, category: 'User', keywords: ['user', 'add', 'plus'] },
	{ name: 'Settings', icon: Settings, category: 'User', keywords: ['settings', 'config', 'gear'] },
	{
		name: 'Sliders',
		icon: Sliders,
		category: 'User',
		keywords: ['sliders', 'settings', 'controls'],
	},
	{ name: 'Eye', icon: Eye, category: 'User', keywords: ['eye', 'view', 'show'] },
	{ name: 'EyeOff', icon: EyeOff, category: 'User', keywords: ['eye', 'hide', 'hidden'] },
	{ name: 'Lock', icon: Lock, category: 'User', keywords: ['lock', 'secure', 'private'] },
	{ name: 'Unlock', icon: Unlock, category: 'User', keywords: ['unlock', 'open', 'public'] },
	{ name: 'LogIn', icon: LogIn, category: 'User', keywords: ['login', 'signin', 'enter'] },
	{ name: 'LogOut', icon: LogOut, category: 'User', keywords: ['logout', 'signout', 'exit'] },
	{ name: 'Shield', icon: Shield, category: 'User', keywords: ['shield', 'security', 'protect'] },
	{
		name: 'ShieldCheck',
		icon: ShieldCheck,
		category: 'User',
		keywords: ['shield', 'security', 'verified'],
	},
];
