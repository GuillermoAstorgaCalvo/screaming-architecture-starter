import {
	Pause,
	PauseCircle,
	Play,
	PlayCircle,
	SkipBack,
	SkipForward,
	Volume,
	Volume2,
	VolumeX,
} from 'lucide-react';

import type { IconItem } from './types';

export const mediaIcons: IconItem[] = [
	{ name: 'Play', icon: Play, category: 'Media', keywords: ['play', 'start', 'media'] },
	{
		name: 'PlayCircle',
		icon: PlayCircle,
		category: 'Media',
		keywords: ['play', 'start', 'circle'],
	},
	{ name: 'Pause', icon: Pause, category: 'Media', keywords: ['pause', 'stop', 'media'] },
	{
		name: 'PauseCircle',
		icon: PauseCircle,
		category: 'Media',
		keywords: ['pause', 'stop', 'circle'],
	},
	{ name: 'SkipBack', icon: SkipBack, category: 'Media', keywords: ['skip', 'back', 'previous'] },
	{
		name: 'SkipForward',
		icon: SkipForward,
		category: 'Media',
		keywords: ['skip', 'forward', 'next'],
	},
	{ name: 'Volume', icon: Volume, category: 'Media', keywords: ['volume', 'sound', 'audio'] },
	{
		name: 'Volume2',
		icon: Volume2,
		category: 'Media',
		keywords: ['volume', 'sound', 'audio', 'alt'],
	},
	{ name: 'VolumeX', icon: VolumeX, category: 'Media', keywords: ['volume', 'mute', 'off'] },
];
