/**
 * Tests for slide animation variants
 *
 * Tests the slide variants:
 * - slideVariants structure and properties
 * - slideRightVariants structure and properties
 * - slideTopVariants structure and properties
 * - slideBottomVariants structure and properties
 * - Variant exports
 * - Transition configurations
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import {
	slideBottomVariants,
	slideRightVariants,
	slideTopVariants,
	slideVariants,
} from '@core/ui/utilities/motion/variants/slideVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('slideVariants - Structure', () => {
	it('exports slideVariants as Variants type', () => {
		expect(slideVariants).toBeDefined();
		expect(typeof slideVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(slideVariants.hidden).toBeDefined();
		expect(slideVariants.visible).toBeDefined();
		expect(slideVariants.exit).toBeDefined();
	});
});

describe('slideVariants - Properties (slide from left)', () => {
	it('hidden state has opacity 0 and x -20', () => {
		const { hidden } = slideVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.x).toBe(-20);
		}
	});

	it('visible state has opacity 1 and x 0', () => {
		const { visible } = slideVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.x).toBe(0);
		}
	});

	it('exit state has opacity 0 and x -20', () => {
		const { exit } = slideVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.x).toBe(-20);
		}
	});
});

describe('slideRightVariants - Properties (slide from right)', () => {
	it('hidden state has opacity 0 and x 20', () => {
		const { hidden } = slideRightVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.x).toBe(20);
		}
	});

	it('visible state has opacity 1 and x 0', () => {
		const { visible } = slideRightVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.x).toBe(0);
		}
	});

	it('exit state has opacity 0 and x 20', () => {
		const { exit } = slideRightVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.x).toBe(20);
		}
	});
});

describe('slideTopVariants - Properties (slide from top)', () => {
	it('hidden state has opacity 0 and y -20', () => {
		const { hidden } = slideTopVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.y).toBe(-20);
		}
	});

	it('visible state has opacity 1 and y 0', () => {
		const { visible } = slideTopVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.y).toBe(0);
		}
	});

	it('exit state has opacity 0 and y -20', () => {
		const { exit } = slideTopVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.y).toBe(-20);
		}
	});
});

describe('slideBottomVariants - Properties (slide from bottom)', () => {
	it('hidden state has opacity 0 and y 20', () => {
		const { hidden } = slideBottomVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.y).toBe(20);
		}
	});

	it('visible state has opacity 1 and y 0', () => {
		const { visible } = slideBottomVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.y).toBe(0);
		}
	});

	it('exit state has opacity 0 and y 20', () => {
		const { exit } = slideBottomVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.y).toBe(20);
		}
	});
});

describe('slideVariants - Transitions', () => {
	it('slideVariants visible state has correct transition configuration', () => {
		const { visible } = slideVariants;
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

	it('slideVariants exit state has correct transition configuration', () => {
		const { exit } = slideVariants;
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

	it('all slide variants have consistent transition configuration', () => {
		const variants = [slideVariants, slideRightVariants, slideTopVariants, slideBottomVariants];

		for (const variant of variants) {
			const { visible } = variant;
			if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
				const { transition } = visible;
				if (transition && typeof transition === 'object') {
					expect(transition.duration).toBe(motionDurations.normal);
					expect(transition.ease).toBe(motionEasing['ease-out']);
				}
			}

			const { exit } = variant;
			if (typeof exit === 'object' && exit !== null && 'transition' in exit) {
				const { transition } = exit;
				if (transition && typeof transition === 'object') {
					expect(transition.duration).toBe(motionDurations.fast);
					expect(transition.ease).toBe(motionEasing['ease-in']);
				}
			}
		}
	});
});

describe('slideVariants - Type safety', () => {
	it('slideVariants matches Variants type', () => {
		const variants: Variants = slideVariants;
		expect(variants).toBeDefined();
	});

	it('slideRightVariants matches Variants type', () => {
		const variants: Variants = slideRightVariants;
		expect(variants).toBeDefined();
	});

	it('slideTopVariants matches Variants type', () => {
		const variants: Variants = slideTopVariants;
		expect(variants).toBeDefined();
	});

	it('slideBottomVariants matches Variants type', () => {
		const variants: Variants = slideBottomVariants;
		expect(variants).toBeDefined();
	});
});
