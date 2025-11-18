import {
	BUTTON_BASE_CLASSES,
	BUTTON_SIZE_CLASSES,
	BUTTON_VARIANT_CLASSES,
	ICON_BUTTON_SIZE_CLASSES,
	ICON_BUTTON_VARIANT_CLASSES,
	TOGGLE_BASE_CLASSES,
	TOGGLE_PRESSED_CLASSES,
	TOGGLE_SIZE_CLASSES,
	TOGGLE_VARIANT_CLASSES,
} from '@core/constants/ui/buttons';
import { describe, expect, it } from 'vitest';

describe('button constants', () => {
	it('defines the shared button base classes', () => {
		expect(BUTTON_BASE_CLASSES).toBe(
			'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
		);
	});

	it('defines variant classes per semantic token', () => {
		expect(BUTTON_VARIANT_CLASSES).toEqual({
			primary:
				'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary dark:bg-primary dark:hover:bg-primary/90',
			secondary:
				'bg-secondary text-secondary-foreground hover:bg-secondary-dark focus:ring-secondary dark:bg-secondary-dark dark:hover:bg-secondary',
			ghost:
				'bg-transparent text-text-primary hover:bg-muted focus:ring-border dark:text-text-primary dark:hover:bg-muted-dark',
		});
	});

	it('defines size classes mapped to StandardSize', () => {
		expect(BUTTON_SIZE_CLASSES).toEqual({
			sm: 'px-md py-xs text-sm',
			md: 'px-lg py-sm text-base',
			lg: 'px-xl py-md text-lg',
		});
	});
});

describe('icon button constants', () => {
	it('exposes size classes', () => {
		expect(ICON_BUTTON_SIZE_CLASSES).toEqual({
			sm: 'h-4 w-4 p-xs',
			md: 'h-5 w-5 p-xs',
			lg: 'h-6 w-6 p-sm',
		});
	});

	it('exposes variant classes', () => {
		expect(ICON_BUTTON_VARIANT_CLASSES).toEqual({
			default:
				'text-text-muted hover:bg-muted hover:text-text-primary dark:hover:bg-muted-dark dark:hover:text-text-primary',
			ghost: 'text-text-secondary hover:bg-muted dark:text-text-muted dark:hover:bg-muted-dark',
		});
	});
});

describe('toggle constants', () => {
	it('locks the base classes', () => {
		expect(TOGGLE_BASE_CLASSES).toBe(
			'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
		);
	});

	it('defines variant classes', () => {
		expect(TOGGLE_VARIANT_CLASSES).toEqual({
			default:
				'bg-transparent text-text-primary hover:bg-muted focus:ring-border dark:text-text-primary dark:hover:bg-muted-dark',
			outline:
				'border border-border bg-transparent text-text-primary hover:bg-muted focus:ring-border dark:border-border dark:text-text-primary dark:hover:bg-muted-dark',
		});
	});

	it('defines size and pressed state classes', () => {
		expect(TOGGLE_SIZE_CLASSES).toEqual({
			sm: 'px-md py-xs text-sm',
			md: 'px-lg py-sm text-base',
			lg: 'px-xl py-md text-lg',
		});
		expect(TOGGLE_PRESSED_CLASSES).toBe(
			'bg-secondary-light text-text-primary dark:bg-secondary-dark dark:text-secondary-foreground'
		);
	});
});
