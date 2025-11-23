/**
 * Tests for scale animation variants
 *
 * Tests the scale variants:
 * - scaleVariants structure and properties
 * - scaleUpVariants structure and properties
 * - Variant exports
 * - Transition configurations
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import { scaleUpVariants, scaleVariants } from '@core/ui/utilities/motion/variants/scaleVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('scaleVariants - Structure', () => {
	it('exports scaleVariants as Variants type', () => {
		expect(scaleVariants).toBeDefined();
		expect(typeof scaleVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(scaleVariants.hidden).toBeDefined();
		expect(scaleVariants.visible).toBeDefined();
		expect(scaleVariants.exit).toBeDefined();
	});
});

describe('scaleVariants - Properties', () => {
	it('hidden state has opacity 0 and scale 0.95', () => {
		const { hidden } = scaleVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.scale).toBe(0.95);
		}
	});

	it('visible state has opacity 1 and scale 1', () => {
		const { visible } = scaleVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.scale).toBe(1);
		}
	});

	it('exit state has opacity 0 and scale 0.95', () => {
		const { exit } = scaleVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.scale).toBe(0.95);
		}
	});
});

describe('scaleVariants - Transitions', () => {
	it('visible state has correct transition configuration', () => {
		const { visible } = scaleVariants;
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

	it('exit state has correct transition configuration', () => {
		const { exit } = scaleVariants;
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

describe('scaleUpVariants - Structure', () => {
	it('exports scaleUpVariants as Variants type', () => {
		expect(scaleUpVariants).toBeDefined();
		expect(typeof scaleUpVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(scaleUpVariants.hidden).toBeDefined();
		expect(scaleUpVariants.visible).toBeDefined();
		expect(scaleUpVariants.exit).toBeDefined();
	});
});

describe('scaleUpVariants - Properties', () => {
	it('hidden state has opacity 0 and scale 0.8', () => {
		const { hidden } = scaleUpVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.scale).toBe(0.8);
		}
	});

	it('visible state has opacity 1 and scale 1', () => {
		const { visible } = scaleUpVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.scale).toBe(1);
		}
	});

	it('exit state has opacity 0 and scale 0.8', () => {
		const { exit } = scaleUpVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.scale).toBe(0.8);
		}
	});
});

describe('scaleUpVariants - Transitions', () => {
	it('visible state has correct transition configuration', () => {
		const { visible } = scaleUpVariants;
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
		const { exit } = scaleUpVariants;
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

describe('scaleVariants - Type safety', () => {
	it('scaleVariants matches Variants type', () => {
		const variants: Variants = scaleVariants;
		expect(variants).toBeDefined();
	});

	it('scaleUpVariants matches Variants type', () => {
		const variants: Variants = scaleUpVariants;
		expect(variants).toBeDefined();
	});
});
