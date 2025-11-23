/**
 * Tests for scaleConfig helper
 *
 * Tests the scale configuration functions:
 * - Default config
 * - Config extraction
 * - Override handling
 */

import { extractScaleConfig } from '@core/ui/utilities/motion/helpers/MotionScale/scaleConfig';
import { describe, expect, it } from 'vitest';

describe('extractScaleConfig - default config', () => {
	it('returns default config when no props provided', () => {
		const props = {};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.95,
			finalScale: 1,
			duration: 'normal',
			ease: 'ease-out',
			delay: 0,
			initial: false,
		});
	});
});

describe('extractScaleConfig - scale property overrides', () => {
	it('overrides initialScale', () => {
		const props = {
			initialScale: 0.8,
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.8,
			finalScale: 1,
			duration: 'normal',
			ease: 'ease-out',
			delay: 0,
			initial: false,
		});
	});

	it('overrides finalScale', () => {
		const props = {
			finalScale: 1.1,
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.95,
			finalScale: 1.1,
			duration: 'normal',
			ease: 'ease-out',
			delay: 0,
			initial: false,
		});
	});
});

describe('extractScaleConfig - timing property overrides', () => {
	it('overrides duration', () => {
		const props = {
			duration: 'slow',
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.95,
			finalScale: 1,
			duration: 'slow',
			ease: 'ease-out',
			delay: 0,
			initial: false,
		});
	});

	it('overrides ease', () => {
		const props = {
			ease: 'ease-in',
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.95,
			finalScale: 1,
			duration: 'normal',
			ease: 'ease-in',
			delay: 0,
			initial: false,
		});
	});

	it('overrides delay', () => {
		const props = {
			delay: 0.5,
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.95,
			finalScale: 1,
			duration: 'normal',
			ease: 'ease-out',
			delay: 0.5,
			initial: false,
		});
	});
});

describe('extractScaleConfig - state property overrides', () => {
	it('overrides initial', () => {
		const props = {
			initial: true,
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.95,
			finalScale: 1,
			duration: 'normal',
			ease: 'ease-out',
			delay: 0,
			initial: true,
		});
	});
});

describe('extractScaleConfig - multiple property overrides', () => {
	it('overrides multiple properties', () => {
		const props = {
			initialScale: 0.8,
			finalScale: 1.1,
			duration: 'slow',
			ease: 'ease-in',
			delay: 0.5,
			initial: true,
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.8,
			finalScale: 1.1,
			duration: 'slow',
			ease: 'ease-in',
			delay: 0.5,
			initial: true,
		});
	});
});

describe('extractScaleConfig - edge cases', () => {
	it('handles undefined values correctly', () => {
		const props = {
			initialScale: undefined,
			finalScale: undefined,
			duration: undefined,
			ease: undefined,
			delay: undefined,
			initial: undefined,
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0.95,
			finalScale: 1,
			duration: 'normal',
			ease: 'ease-out',
			delay: 0,
			initial: false,
		});
	});

	it('handles zero values', () => {
		const props = {
			initialScale: 0,
			finalScale: 0,
			delay: 0,
		};

		const result = extractScaleConfig(props as any);

		expect(result).toEqual({
			initialScale: 0,
			finalScale: 0,
			duration: 'normal',
			ease: 'ease-out',
			delay: 0,
			initial: false,
		});
	});
});
