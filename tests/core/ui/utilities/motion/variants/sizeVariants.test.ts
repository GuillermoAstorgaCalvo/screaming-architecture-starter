/**
 * Tests for size animation variants
 *
 * Tests the size variants:
 * - heightVariants structure and properties
 * - widthVariants structure and properties
 * - Variant exports
 * - Transition configurations
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import { heightVariants, widthVariants } from '@core/ui/utilities/motion/variants/sizeVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('heightVariants - Structure', () => {
	it('exports heightVariants as Variants type', () => {
		expect(heightVariants).toBeDefined();
		expect(typeof heightVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(heightVariants.hidden).toBeDefined();
		expect(heightVariants.visible).toBeDefined();
		expect(heightVariants.exit).toBeDefined();
	});
});

describe('heightVariants - Properties', () => {
	it('hidden state has opacity 0 and height 0', () => {
		const { hidden } = heightVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.height).toBe(0);
		}
	});

	it('visible state has opacity 1 and height auto', () => {
		const { visible } = heightVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.height).toBe('auto');
		}
	});

	it('exit state has opacity 0 and height 0', () => {
		const { exit } = heightVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.height).toBe(0);
		}
	});
});

describe('heightVariants - Transitions', () => {
	it('hidden state has correct transition configuration', () => {
		const { hidden } = heightVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null && 'transition' in hidden) {
			const { transition } = hidden;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.normal);
				expect(transition.ease).toBe(motionEasing['ease-in-out']);
			}
		}
	});

	it('visible state has correct transition configuration', () => {
		const { visible } = heightVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.normal);
				expect(transition.ease).toBe(motionEasing['ease-in-out']);
			}
		}
	});

	it('exit state has correct transition configuration', () => {
		const { exit } = heightVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null && 'transition' in exit) {
			const { transition } = exit;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.normal);
				expect(transition.ease).toBe(motionEasing['ease-in-out']);
			}
		}
	});
});

describe('widthVariants - Structure', () => {
	it('exports widthVariants as Variants type', () => {
		expect(widthVariants).toBeDefined();
		expect(typeof widthVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(widthVariants.hidden).toBeDefined();
		expect(widthVariants.visible).toBeDefined();
		expect(widthVariants.exit).toBeDefined();
	});
});

describe('widthVariants - Properties', () => {
	it('hidden state has opacity 0 and width 0', () => {
		const { hidden } = widthVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.width).toBe(0);
		}
	});

	it('visible state has opacity 1 and width auto', () => {
		const { visible } = widthVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.width).toBe('auto');
		}
	});

	it('exit state has opacity 0 and width 0', () => {
		const { exit } = widthVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
			expect(exit.width).toBe(0);
		}
	});
});

describe('widthVariants - Transitions', () => {
	it('hidden state has correct transition configuration', () => {
		const { hidden } = widthVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null && 'transition' in hidden) {
			const { transition } = hidden;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.normal);
				expect(transition.ease).toBe(motionEasing['ease-in-out']);
			}
		}
	});

	it('visible state has correct transition configuration', () => {
		const { visible } = widthVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.normal);
				expect(transition.ease).toBe(motionEasing['ease-in-out']);
			}
		}
	});

	it('exit state has correct transition configuration', () => {
		const { exit } = widthVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null && 'transition' in exit) {
			const { transition } = exit;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(motionDurations.normal);
				expect(transition.ease).toBe(motionEasing['ease-in-out']);
			}
		}
	});
});

describe('sizeVariants - Type safety', () => {
	it('heightVariants matches Variants type', () => {
		const variants: Variants = heightVariants;
		expect(variants).toBeDefined();
	});

	it('widthVariants matches Variants type', () => {
		const variants: Variants = widthVariants;
		expect(variants).toBeDefined();
	});
});
