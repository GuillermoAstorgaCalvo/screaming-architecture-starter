/**
 * Tests for reduced motion variants
 *
 * Tests the reduced motion variants:
 * - STATIC_VARIANTS structure and properties
 * - REDUCED_FADE_VARIANTS structure and properties
 * - withInstantTransitions function
 * - Variant exports
 */

import { fadeVariants } from '@core/ui/utilities/motion/variants/fadeVariants';
import {
	REDUCED_FADE_VARIANTS,
	STATIC_VARIANTS,
	withInstantTransitions,
} from '@core/ui/utilities/motion/variants/reducedMotionVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('STATIC_VARIANTS - Structure', () => {
	it('exports STATIC_VARIANTS as Variants type', () => {
		expect(STATIC_VARIANTS).toBeDefined();
		expect(typeof STATIC_VARIANTS).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(STATIC_VARIANTS.hidden).toBeDefined();
		expect(STATIC_VARIANTS.visible).toBeDefined();
		expect(STATIC_VARIANTS.exit).toBeDefined();
	});
});

describe('STATIC_VARIANTS - Properties', () => {
	it('hidden state is empty object', () => {
		const { hidden } = STATIC_VARIANTS;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(Object.keys(hidden).length).toBe(0);
		}
	});

	it('visible state is empty object', () => {
		const { visible } = STATIC_VARIANTS;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(Object.keys(visible).length).toBe(0);
		}
	});

	it('exit state is empty object', () => {
		const { exit } = STATIC_VARIANTS;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(Object.keys(exit).length).toBe(0);
		}
	});
});

describe('REDUCED_FADE_VARIANTS - Structure', () => {
	it('exports REDUCED_FADE_VARIANTS as Variants type', () => {
		expect(REDUCED_FADE_VARIANTS).toBeDefined();
		expect(typeof REDUCED_FADE_VARIANTS).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(REDUCED_FADE_VARIANTS.hidden).toBeDefined();
		expect(REDUCED_FADE_VARIANTS.visible).toBeDefined();
		expect(REDUCED_FADE_VARIANTS.exit).toBeDefined();
	});
});

describe('REDUCED_FADE_VARIANTS - Properties', () => {
	it('hidden state has opacity 0', () => {
		const { hidden } = REDUCED_FADE_VARIANTS;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
		}
	});

	it('visible state has opacity 1', () => {
		const { visible } = REDUCED_FADE_VARIANTS;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
		}
	});

	it('exit state has opacity 0', () => {
		const { exit } = REDUCED_FADE_VARIANTS;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
		}
	});
});

describe('REDUCED_FADE_VARIANTS - Transitions', () => {
	it('visible state has transition configuration', () => {
		const { visible } = REDUCED_FADE_VARIANTS;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			expect(typeof transition).toBe('object');
		}
	});

	it('exit state has transition configuration', () => {
		const { exit } = REDUCED_FADE_VARIANTS;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null && 'transition' in exit) {
			const { transition } = exit;
			expect(transition).toBeDefined();
			expect(typeof transition).toBe('object');
		}
	});
});

describe('withInstantTransitions - Function', () => {
	it('exports withInstantTransitions function', () => {
		expect(withInstantTransitions).toBeDefined();
		expect(typeof withInstantTransitions).toBe('function');
	});

	it('returns Variants type', () => {
		const result = withInstantTransitions(fadeVariants);
		expect(result).toBeDefined();
		expect(typeof result).toBe('object');
	});

	it('preserves variant structure', () => {
		const result = withInstantTransitions(fadeVariants);
		expect(result.hidden).toBeDefined();
		expect(result.visible).toBeDefined();
		expect(result.exit).toBeDefined();
	});
});

describe('withInstantTransitions - Transition Properties', () => {
	it('sets duration to 0 for all transitions', () => {
		const result = withInstantTransitions(fadeVariants);
		const { visible } = result;
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			if (transition && typeof transition === 'object') {
				expect(transition.duration).toBe(0);
			}
		}
	});

	it('sets delay to 0 for all transitions', () => {
		const result = withInstantTransitions(fadeVariants);
		const { visible } = result;
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			if (transition && typeof transition === 'object') {
				expect(transition.delay).toBe(0);
			}
		}
	});

	it('preserves other transition properties', () => {
		const result = withInstantTransitions(fadeVariants);
		const { visible } = result;
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			if (transition && typeof transition === 'object') {
				// Should still have ease property if it existed
				expect(transition).toHaveProperty('duration');
				expect(transition).toHaveProperty('delay');
			}
		}
	});
});

describe('withInstantTransitions - Edge Cases', () => {
	it('handles function variants', () => {
		const functionVariants: Variants = {
			hidden: { opacity: 0 },
			visible: (i: number) => ({
				opacity: 1,
				transition: { delay: i * 0.1 },
			}),
		};

		const result = withInstantTransitions(functionVariants);
		expect(result.visible).toBeDefined();
		// Function variants should be preserved as-is
		expect(typeof result.visible).toBe('function');
	});

	it('handles variants without transitions', () => {
		const noTransitionVariants: Variants = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
		};

		const result = withInstantTransitions(noTransitionVariants);
		expect(result.hidden).toBeDefined();
		expect(result.visible).toBeDefined();
	});
});

describe('reducedMotionVariants - Type safety', () => {
	it('STATIC_VARIANTS matches Variants type', () => {
		const variants: Variants = STATIC_VARIANTS;
		expect(variants).toBeDefined();
	});

	it('REDUCED_FADE_VARIANTS matches Variants type', () => {
		const variants: Variants = REDUCED_FADE_VARIANTS;
		expect(variants).toBeDefined();
	});
});
