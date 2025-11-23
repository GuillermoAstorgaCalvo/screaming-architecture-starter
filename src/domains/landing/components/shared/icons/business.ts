import {
	BarChart3,
	Book,
	Briefcase,
	Building,
	CreditCard,
	Globe,
	Map,
	MapPin,
	Target,
	ToggleLeft,
	ToggleRight,
	Type,
} from 'lucide-react';

import type { IconItem } from './types';

export const businessIcons: IconItem[] = [
	{
		name: 'CreditCard',
		icon: CreditCard,
		category: 'Business',
		keywords: ['credit', 'card', 'payment'],
	},
	{
		name: 'BarChart3',
		icon: BarChart3,
		category: 'Business',
		keywords: ['chart', 'bar', 'analytics'],
	},
	{ name: 'Target', icon: Target, category: 'Business', keywords: ['target', 'goal', 'aim'] },
	{
		name: 'Briefcase',
		icon: Briefcase,
		category: 'Business',
		keywords: ['briefcase', 'business', 'work'],
	},
	{
		name: 'Building',
		icon: Building,
		category: 'Business',
		keywords: ['building', 'office', 'company'],
	},
	{
		name: 'Globe',
		icon: Globe,
		category: 'Business',
		keywords: ['globe', 'world', 'international'],
	},
	{ name: 'Map', icon: Map, category: 'Business', keywords: ['map', 'location', 'geography'] },
	{ name: 'MapPin', icon: MapPin, category: 'Business', keywords: ['map', 'pin', 'location'] },
	{ name: 'Book', icon: Book, category: 'Business', keywords: ['book', 'read', 'documentation'] },
	{ name: 'Type', icon: Type, category: 'Business', keywords: ['type', 'text', 'font'] },
	{
		name: 'ToggleLeft',
		icon: ToggleLeft,
		category: 'Business',
		keywords: ['toggle', 'switch', 'left'],
	},
	{
		name: 'ToggleRight',
		icon: ToggleRight,
		category: 'Business',
		keywords: ['toggle', 'switch', 'right'],
	},
];
