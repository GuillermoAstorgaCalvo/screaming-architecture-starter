import { Calendar, Clock } from 'lucide-react';

import type { IconItem } from './types';

export const timeIcons: IconItem[] = [
	{ name: 'Calendar', icon: Calendar, category: 'Time', keywords: ['calendar', 'date'] },
	{ name: 'Clock', icon: Clock, category: 'Time', keywords: ['clock', 'time'] },
];
