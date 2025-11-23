/**
 * Tests for rotate animation variants
 *
 * Tests the rotate variants:
 * - rotateVariants structure and properties
 * - Variant exports
 * - Transition configurations
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import { rotateVariants } from '@core/ui/utilities/motion/variants/rotateVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('rotateVariants - Structure', () => {
	it('exports rotateVariants as Variants type', () => {
		expect(rotateVariants).toBeDefined();
		expect(typeof rotateVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(rotateVariants.hidden).toBeDefined();
		expect(rotateVariants.visible).toBeDefined();
		expect(rotateVariants.exit).toBeDefined();
	});
});

describe('rotateVariants - Properties', () => {
	it('hidden state has opacity 0 and rotate -180', () => {
		const { hidden } = rotateVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.rotate).toBe(-180);
		}
	});

	it('visible state has opacity 1 and rotate 0', () => {
		const { visible } = rotateVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.rotate).toBe(0);
		}
	});

	it('exit state has opacity 0 and rotate 180', () => {
		const { exit } = rotateVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.rotate).toBe(180);
		}
	});
});

describe('rotateVariants - Transitions', () => {
	it('visible state has correct transition configuration', () => {
		const { visible } = rotateVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.slow);
				expect(transition.ease).toBe(motionEasing['ease-out']);
			}
		}
	});

	it('exit state has correct transition configuration', () => {
		const { exit } = rotateVariants;
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

describe('rotateVariants - Type safety', () => {
	it('rotateVariants matches Variants type', () => {
		const variants: Variants = rotateVariants;
		expect(variants).toBeDefined();
	});
});
