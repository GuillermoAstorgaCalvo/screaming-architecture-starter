/**
 * Tests for stagger animation variants
 *
 * Tests the stagger variants:
 * - staggerContainerVariants structure and properties
 * - staggerItemVariants structure and properties
 * - Variant exports
 * - Transition configurations
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import {
	staggerContainerVariants,
	staggerItemVariants,
} from '@core/ui/utilities/motion/variants/staggerVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('staggerContainerVariants - Structure', () => {
	it('exports staggerContainerVariants as Variants type', () => {
		expect(staggerContainerVariants).toBeDefined();
		expect(typeof staggerContainerVariants).toBe('object');
	});

	it('has hidden and visible states', () => {
		expect(staggerContainerVariants.hidden).toBeDefined();
		expect(staggerContainerVariants.visible).toBeDefined();
	});
});

describe('staggerContainerVariants - Properties', () => {
	it('hidden state has opacity 0', () => {
		const { hidden } = staggerContainerVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
		}
	});

	it('visible state has opacity 1', () => {
		const { visible } = staggerContainerVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
		}
	});
});

describe('staggerContainerVariants - Stagger Configuration', () => {
	it('visible state has stagger configuration using stagger() function', () => {
		const { visible } = staggerContainerVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			if (transition && typeof transition === 'object' && 'delayChildren' in transition) {
				const { delayChildren } = transition;
				expect(delayChildren).toBeDefined();
				// delayChildren should be a stagger function (stagger() returns a function)
				expect(typeof delayChildren).toBe('function');
			}
		}
	});
});

describe('staggerItemVariants - Structure', () => {
	it('exports staggerItemVariants as Variants type', () => {
		expect(staggerItemVariants).toBeDefined();
		expect(typeof staggerItemVariants).toBe('object');
	});

	it('has hidden and visible states', () => {
		expect(staggerItemVariants.hidden).toBeDefined();
		expect(staggerItemVariants.visible).toBeDefined();
	});
});

describe('staggerItemVariants - Properties', () => {
	it('hidden state has opacity 0 and y 20', () => {
		const { hidden } = staggerItemVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
			expect(hidden.y).toBe(20);
		}
	});

	it('visible state has opacity 1 and y 0', () => {
		const { visible } = staggerItemVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
			expect(visible.y).toBe(0);
		}
	});
});

describe('staggerItemVariants - Transitions', () => {
	it('visible state has correct transition configuration', () => {
		const { visible } = staggerItemVariants;
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

describe('staggerVariants - Type safety', () => {
	it('staggerContainerVariants matches Variants type', () => {
		const variants: Variants = staggerContainerVariants;
		expect(variants).toBeDefined();
	});

	it('staggerItemVariants matches Variants type', () => {
		const variants: Variants = staggerItemVariants;
		expect(variants).toBeDefined();
	});
});

describe('staggerVariants - Integration', () => {
	it('staggerContainerVariants and staggerItemVariants work together', () => {
		// Verify that container has stagger configuration
		const containerVisible = staggerContainerVariants.visible;
		expect(containerVisible).toBeDefined();
		if (
			typeof containerVisible === 'object' &&
			containerVisible !== null &&
			'transition' in containerVisible
		) {
			const { transition } = containerVisible;
			if (transition && typeof transition === 'object') {
				expect(transition.delayChildren).toBeDefined();
			}
		}

		// Verify that items have animation properties
		const itemHidden = staggerItemVariants.hidden;
		const itemVisible = staggerItemVariants.visible;
		expect(itemHidden).toBeDefined();
		expect(itemVisible).toBeDefined();
	});
});
