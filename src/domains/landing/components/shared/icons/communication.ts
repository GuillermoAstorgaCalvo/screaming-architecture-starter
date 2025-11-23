import {
	Bell,
	BellOff,
	Link,
	Link2,
	Mail,
	MessageCircle,
	MessageSquare,
	Phone,
	Send,
} from 'lucide-react';

import type { IconItem } from './types';

export const communicationIcons: IconItem[] = [
	{ name: 'Mail', icon: Mail, category: 'Communication', keywords: ['mail', 'email', 'message'] },
	{
		name: 'MessageCircle',
		icon: MessageCircle,
		category: 'Communication',
		keywords: ['message', 'chat', 'comment', 'circle'],
	},
	{
		name: 'MessageSquare',
		icon: MessageSquare,
		category: 'Communication',
		keywords: ['message', 'chat', 'comment', 'square'],
	},
	{
		name: 'Bell',
		icon: Bell,
		category: 'Communication',
		keywords: ['bell', 'notification', 'alert'],
	},
	{
		name: 'BellOff',
		icon: BellOff,
		category: 'Communication',
		keywords: ['bell', 'notification', 'off', 'mute'],
	},
	{ name: 'Link', icon: Link, category: 'Communication', keywords: ['link', 'url', 'chain'] },
	{
		name: 'Link2',
		icon: Link2,
		category: 'Communication',
		keywords: ['link', 'url', 'chain', 'alt'],
	},
	{ name: 'Send', icon: Send, category: 'Communication', keywords: ['send', 'message', 'submit'] },
	{
		name: 'Phone',
		icon: Phone,
		category: 'Communication',
		keywords: ['phone', 'call', 'telephone'],
	},
];
