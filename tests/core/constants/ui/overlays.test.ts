import {
	BACKDROP_BASE_CLASSES,
	MODAL_SIZE_CLASSES,
	SPINNER_SIZE_CLASSES,
} from '@core/constants/ui/overlays';
import { describe, expect, it } from 'vitest';

describe('overlay constants', () => {
	it('locks spinner size classes', () => {
		expect(SPINNER_SIZE_CLASSES).toEqual({
			sm: 'h-4 w-4',
			md: 'h-8 w-8',
			lg: 'h-12 w-12',
		});
	});

	it('locks modal size classes', () => {
		expect(MODAL_SIZE_CLASSES).toEqual({
			sm: 'max-w-sm',
			md: 'max-w-md',
			lg: 'max-w-lg',
			xl: 'max-w-xl',
			full: 'max-w-full mx-4',
		});
	});

	it('locks backdrop base classes', () => {
		expect(BACKDROP_BASE_CLASSES).toBe(
			'fixed inset-0 transition-opacity duration-slower ease-in-out'
		);
	});
});
