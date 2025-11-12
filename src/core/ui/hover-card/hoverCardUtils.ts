import type { HoverCardProps } from '@src-types/ui/overlays';

export function getPositionClasses(position: HoverCardProps['position']): string {
	switch (position) {
		case 'top': {
			return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
		}
		case 'bottom': {
			return 'top-full left-1/2 -translate-x-1/2 mt-2';
		}
		case 'left': {
			return 'right-full top-1/2 -translate-y-1/2 mr-2';
		}
		case 'right': {
			return 'left-full top-1/2 -translate-y-1/2 ml-2';
		}
		default: {
			return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
		}
	}
}

export function getArrowClasses(position: HoverCardProps['position']): string {
	const baseClasses =
		'absolute w-2 h-2 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
	switch (position) {
		case 'top': {
			return `${baseClasses} top-full left-1/2 -translate-x-1/2 -mt-1 rotate-45 border-t-0 border-l-0`;
		}
		case 'bottom': {
			return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-45 border-b-0 border-r-0`;
		}
		case 'left': {
			return `${baseClasses} left-full top-1/2 -translate-y-1/2 -ml-1 rotate-45 border-l-0 border-b-0`;
		}
		case 'right': {
			return `${baseClasses} right-full top-1/2 -translate-y-1/2 -mr-1 rotate-45 border-r-0 border-t-0`;
		}
		default: {
			return `${baseClasses} top-full left-1/2 -translate-x-1/2 -mt-1 rotate-45 border-t-0 border-l-0`;
		}
	}
}
