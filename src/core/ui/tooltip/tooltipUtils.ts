import type { TooltipProps } from '@src-types/ui/overlays';

export function getPositionClasses(position: TooltipProps['position']): string {
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

export function getArrowClasses(position: TooltipProps['position']): string {
	const baseClasses = 'absolute w-2 h-2 bg-gray-900 dark:bg-gray-800';
	switch (position) {
		case 'top': {
			return `${baseClasses} top-full left-1/2 -translate-x-1/2 -mt-1 rotate-45`;
		}
		case 'bottom': {
			return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-45`;
		}
		case 'left': {
			return `${baseClasses} left-full top-1/2 -translate-y-1/2 -ml-1 rotate-45`;
		}
		case 'right': {
			return `${baseClasses} right-full top-1/2 -translate-y-1/2 -mr-1 rotate-45`;
		}
		default: {
			return `${baseClasses} top-full left-1/2 -translate-x-1/2 -mt-1 rotate-45`;
		}
	}
}
