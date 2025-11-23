/**
 * Marquee Constants Tests
 *
 * Tests for the Marquee constants including:
 * - Default values
 * - Base CSS classes
 */

import {
	BASE_CLASSES,
	DEFAULT_DIRECTION,
	DEFAULT_LOOP,
	DEFAULT_PAUSE_ON_HOVER,
	DEFAULT_SPEED,
} from '@core/ui/media/marquee/constants/Marquee.constants';
import { describe, expect, it } from 'vitest';

describe('Marquee.constants', () => {
	describe('DEFAULT_SPEED', () => {
		it('should have default speed of 50', () => {
			expect(DEFAULT_SPEED).toBe(50);
		});

		it('should be a number', () => {
			expect(typeof DEFAULT_SPEED).toBe('number');
		});
	});

	describe('DEFAULT_DIRECTION', () => {
		it('should have default direction of "left"', () => {
			expect(DEFAULT_DIRECTION).toBe('left');
		});

		it('should be a string', () => {
			expect(typeof DEFAULT_DIRECTION).toBe('string');
		});
	});

	describe('DEFAULT_PAUSE_ON_HOVER', () => {
		it('should have default pauseOnHover of true', () => {
			expect(DEFAULT_PAUSE_ON_HOVER).toBe(true);
		});

		it('should be a boolean', () => {
			expect(typeof DEFAULT_PAUSE_ON_HOVER).toBe('boolean');
		});
	});

	describe('DEFAULT_LOOP', () => {
		it('should have default loop of true', () => {
			expect(DEFAULT_LOOP).toBe(true);
		});

		it('should be a boolean', () => {
			expect(typeof DEFAULT_LOOP).toBe('boolean');
		});
	});

	describe('BASE_CLASSES', () => {
		it('should contain expected CSS classes', () => {
			expect(BASE_CLASSES).toContain('relative');
			expect(BASE_CLASSES).toContain('flex');
			expect(BASE_CLASSES).toContain('w-full');
			expect(BASE_CLASSES).toContain('overflow-hidden');
			expect(BASE_CLASSES).toContain('whitespace-nowrap');
			expect(BASE_CLASSES).toContain('will-change-transform');
		});

		it('should be a string', () => {
			expect(typeof BASE_CLASSES).toBe('string');
		});

		it('should not be empty', () => {
			expect(BASE_CLASSES.length).toBeGreaterThan(0);
		});
	});
});
