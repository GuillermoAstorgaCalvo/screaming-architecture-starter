/**
 * Tests for spring animation variants
 *
 * Tests the spring variants:
 * - bounceVariants structure and properties
 * - Variant exports
 * - Spring transition configurations
 */

import {
	motionDurations,
	motionEasing,
	springConfig,
} from '@core/ui/utilities/motion/constants/motionConstants';
import { bounceVariants } from '@core/ui/utilities/motion/variants/springVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('bounceVariants - Structure', () => {
	it('exports bounceVariants as Variants type', () => {
		expect(bounceVariants).toBeDefined();
		expect(typeof bounceVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(bounceVariants.hidden).toBeDefined();
		expect(bounceVariants.visible).toBeDefined();
		expect(bounceVariants.exit).toBeDefined();
	});
});

describe('bounceVariants - Properties', () => {
	it('hidden state has opacity 0 and scale 0.3', () => {
		const { hidden } = bounceVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.scale).toBe(0.3);
		}
	});

	it('visible state has opacity 1 and scale 1', () => {
		const { visible } = bounceVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.scale).toBe(1);
		}
	});

	it('exit state has opacity 0 and scale 0.3', () => {
		const { exit } = bounceVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.scale).toBe(0.3);
		}
	});
});

describe('bounceVariants - Spring Transitions', () => {
	it('visible state uses spring transition type', () => {
		const { visible } = bounceVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.type).toBe('spring');
			}
		}
	});

	it('visible state has correct spring configuration', () => {
		const { visible } = bounceVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.stiffness).toBe(springConfig.normal.stiffness);
				expect(transition.damping).toBe(springConfig.normal.damping);
			}
		}
	});

	it('exit state uses duration-based transition', () => {
		const { exit } = bounceVariants;
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

describe('bounceVariants - Type safety', () => {
	it('bounceVariants matches Variants type', () => {
		const variants: Variants = bounceVariants;
		expect(variants).toBeDefined();
	});
});
