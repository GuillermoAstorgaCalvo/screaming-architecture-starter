import {
	Archive,
	File,
	FileCheck,
	FileText,
	Folder,
	FolderOpen,
	Image,
	Music,
	Package,
	Video,
} from 'lucide-react';

import type { IconItem } from './types';

export const filesIcons: IconItem[] = [
	{ name: 'File', icon: File, category: 'Files', keywords: ['file', 'document'] },
	{ name: 'FileText', icon: FileText, category: 'Files', keywords: ['file', 'text', 'document'] },
	{
		name: 'FileCheck',
		icon: FileCheck,
		category: 'Files',
		keywords: ['file', 'check', 'verified'],
	},
	{ name: 'Folder', icon: Folder, category: 'Files', keywords: ['folder', 'directory'] },
	{
		name: 'FolderOpen',
		icon: FolderOpen,
		category: 'Files',
		keywords: ['folder', 'directory', 'open'],
	},
	{ name: 'Image', icon: Image, category: 'Files', keywords: ['image', 'photo', 'picture'] },
	{ name: 'Video', icon: Video, category: 'Files', keywords: ['video', 'movie', 'play'] },
	{ name: 'Music', icon: Music, category: 'Files', keywords: ['music', 'audio', 'sound'] },
	{ name: 'Archive', icon: Archive, category: 'Files', keywords: ['archive', 'zip', 'compress'] },
	{ name: 'Package', icon: Package, category: 'Files', keywords: ['package', 'box', 'bundle'] },
];
