import type { IconRegistry } from '@src-types/ui/icons';

import ArrowDownIcon from './arrow-down-icon/ArrowDownIcon';
import ArrowLeftIcon from './arrow-left-icon/ArrowLeftIcon';
import ArrowRightIcon from './arrow-right-icon/ArrowRightIcon';
import ArrowUpIcon from './arrow-up-icon/ArrowUpIcon';
import BellIcon from './bell-icon/BellIcon';
import CheckIcon from './check-icon/CheckIcon';
import ClearIcon from './clear-icon/ClearIcon';
import CloseIcon from './close-icon/CloseIcon';
import CopyIcon from './copy-icon/CopyIcon';
import HeartIcon from './heart-icon/HeartIcon';
import SearchIcon from './search-icon/SearchIcon';
import SettingsIcon from './settings-icon/SettingsIcon';
import StarIcon from './star-icon/StarIcon';

/**
 * Icon Registry
 * Central registry for all icons in the application
 *
 * To add a new icon:
 * 1. Create the icon component in src/core/ui/icons/[icon-name]-icon/
 * 2. Import it above
 * 3. Add it to the registry object below
 */
export const iconRegistry: IconRegistry = {
	'arrow-down': ArrowDownIcon,
	'arrow-left': ArrowLeftIcon,
	'arrow-right': ArrowRightIcon,
	'arrow-up': ArrowUpIcon,
	bell: BellIcon,
	check: CheckIcon,
	clear: ClearIcon,
	close: CloseIcon,
	copy: CopyIcon,
	heart: HeartIcon,
	search: SearchIcon,
	settings: SettingsIcon,
	star: StarIcon,
} as const;

/**
 * Get an icon component from the registry
 *
 * @param name - Name of the icon
 * @returns Icon component or undefined if not found
 */
export function getIcon(name: string): IconRegistry[string] | undefined {
	return iconRegistry[name];
}

/**
 * Register a new icon in the registry
 *
 * @param name - Name of the icon
 * @param component - Icon component
 */
export function registerIcon(name: string, component: IconRegistry[string]): void {
	iconRegistry[name] = component;
}

/**
 * Check if an icon exists in the registry
 *
 * @param name - Name of the icon
 * @returns True if icon exists
 */
export function hasIcon(name: string): boolean {
	return name in iconRegistry;
}
