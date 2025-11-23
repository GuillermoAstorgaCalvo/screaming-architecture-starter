import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	ExternalLink,
	Home,
	Maximize,
	Menu,
	Minimize,
	MoreHorizontal,
	MoreVertical,
} from 'lucide-react';

import type { IconItem } from './types';

export const navigationIcons: IconItem[] = [
	{ name: 'Home', icon: Home, category: 'Navigation', keywords: ['home', 'house'] },
	{
		name: 'ArrowLeft',
		icon: ArrowLeft,
		category: 'Navigation',
		keywords: ['arrow', 'left', 'back'],
	},
	{
		name: 'ArrowRight',
		icon: ArrowRight,
		category: 'Navigation',
		keywords: ['arrow', 'right', 'next'],
	},
	{ name: 'ArrowUp', icon: ArrowUp, category: 'Navigation', keywords: ['arrow', 'up', 'top'] },
	{
		name: 'ArrowDown',
		icon: ArrowDown,
		category: 'Navigation',
		keywords: ['arrow', 'down', 'bottom'],
	},
	{ name: 'ChevronLeft', icon: ChevronLeft, category: 'Navigation', keywords: ['chevron', 'left'] },
	{
		name: 'ChevronRight',
		icon: ChevronRight,
		category: 'Navigation',
		keywords: ['chevron', 'right'],
	},
	{ name: 'ChevronUp', icon: ChevronUp, category: 'Navigation', keywords: ['chevron', 'up'] },
	{ name: 'ChevronDown', icon: ChevronDown, category: 'Navigation', keywords: ['chevron', 'down'] },
	{ name: 'Menu', icon: Menu, category: 'Navigation', keywords: ['menu', 'hamburger'] },
	{
		name: 'MoreVertical',
		icon: MoreVertical,
		category: 'Navigation',
		keywords: ['more', 'dots', 'menu', 'vertical'],
	},
	{
		name: 'MoreHorizontal',
		icon: MoreHorizontal,
		category: 'Navigation',
		keywords: ['more', 'dots', 'menu', 'horizontal'],
	},
	{
		name: 'ExternalLink',
		icon: ExternalLink,
		category: 'Navigation',
		keywords: ['external', 'link', 'open'],
	},
	{
		name: 'Maximize',
		icon: Maximize,
		category: 'Navigation',
		keywords: ['maximize', 'expand', 'fullscreen'],
	},
	{ name: 'Minimize', icon: Minimize, category: 'Navigation', keywords: ['minimize', 'collapse'] },
];
