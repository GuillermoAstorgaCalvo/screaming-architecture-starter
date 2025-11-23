/**
 * Tests for effect animation variants
 *
 * Tests the effect variants:
 * - shakeVariants structure and properties
 * - blurVariants structure and properties
 * - Variant exports
 * - Transition configurations
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import { blurVariants, shakeVariants } from '@core/ui/utilities/motion/variants/effectVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('effectVariants - shakeVariants', () => {
	it('exports shakeVariants as Variants type', () => {
		expect(shakeVariants).toBeDefined();
		expect(typeof shakeVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(shakeVariants.hidden).toBeDefined();
		expect(shakeVariants.visible).toBeDefined();
		expect(shakeVariants.exit).toBeDefined();
	});

	it('hidden state has x: 0', () => {
		expect(shakeVariants.hidden).toMatchObject({
			x: 0,
		});
	});

	it('visible state has shake animation keyframes', () => {
		const { visible } = shakeVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.x).toBeDefined();
			expect(Array.isArray(visible.x)).toBe(true);
			if (Array.isArray(visible.x)) {
				expect(visible.x[0]).toBe(0); // Start at 0
				expect(visible.x.at(-1)).toBe(0); // End at 0
			}
		}
	});

	it('visible state has correct transition configuration', () => {
		const { visible } = shakeVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.normal);
				expect(transition.ease).toBe(motionEasing.ease);
			}
		}
	});

	it('exit state has x: 0', () => {
		expect(shakeVariants.exit).toMatchObject({
			x: 0,
		});
	});
});

describe('effectVariants - blurVariants', () => {
	it('exports blurVariants as Variants type', () => {
		expect(blurVariants).toBeDefined();
		expect(typeof blurVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(blurVariants.hidden).toBeDefined();
		expect(blurVariants.visible).toBeDefined();
		expect(blurVariants.exit).toBeDefined();
	});
});

describe('effectVariants - blurVariants - hidden state', () => {
	it('hidden state has opacity 0 and blur filter', () => {
		const { hidden } = blurVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.filter).toBeDefined();
			if (typeof hidden.filter === 'string') {
				expect(hidden.filter).toContain('blur');
			}
		}
	});
});

describe('effectVariants - blurVariants - visible state', () => {
	it('visible state has opacity 1 and no blur', () => {
		const { visible } = blurVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.filter).toBeDefined();
			if (typeof visible.filter === 'string') {
				expect(visible.filter).toContain('blur');
			}
		}
	});

	it('visible state has correct transition configuration', () => {
		const { visible } = blurVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.normal);
				expect(transition.ease).toBe(motionEasing['ease-out']);
			}
		}
	});
});

describe('effectVariants - blurVariants - exit state', () => {
	it('exit state has opacity 0 and blur filter', () => {
		const { exit } = blurVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.filter).toBeDefined();
			if (typeof exit.filter === 'string') {
				expect(exit.filter).toContain('blur');
			}
		}
	});

	it('exit state has correct transition configuration', () => {
		const { exit } = blurVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null && 'transition' in exit) {
			const { transition } = exit;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.fast);
				expect(transition.ease).toBe(motionEasing['ease-in']);
			}
		}
	});
});

describe('effectVariants - Type safety', () => {
	it('shakeVariants matches Variants type', () => {
		const variants: Variants = shakeVariants;
		expect(variants).toBeDefined();
	});

	it('blurVariants matches Variants type', () => {
		const variants: Variants = blurVariants;
		expect(variants).toBeDefined();
	});
});
