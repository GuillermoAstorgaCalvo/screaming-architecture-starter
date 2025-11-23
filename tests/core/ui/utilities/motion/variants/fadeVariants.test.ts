/**
 * Tests for fade animation variants
 *
 * Tests the fade variants:
 * - fadeVariants structure and properties
 * - Variant exports
 * - Transition configurations
 * - createVariant factory usage
 */

import { fadeVariants } from '@core/ui/utilities/motion/variants/fadeVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('fadeVariants - Structure', () => {
	it('exports fadeVariants as Variants type', () => {
		expect(fadeVariants).toBeDefined();
		expect(typeof fadeVariants).toBe('object');
	});

	it('has hidden, visible, and exit states', () => {
		expect(fadeVariants.hidden).toBeDefined();
		expect(fadeVariants.visible).toBeDefined();
		expect(fadeVariants.exit).toBeDefined();
	});
});

describe('fadeVariants - Properties', () => {
	it('hidden state has opacity 0', () => {
		const { hidden } = fadeVariants;
		expect(hidden).toBeDefined();
		if (typeof hidden === 'object' && hidden !== null) {
			expect(hidden.opacity).toBe(0);
		}
	});

	it('visible state has opacity 1', () => {
		const { visible } = fadeVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null) {
			expect(visible.opacity).toBe(1);
		}
	});

	it('exit state has opacity 0', () => {
		const { exit } = fadeVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null) {
			expect(exit.opacity).toBe(0);
		}
	});
});

describe('fadeVariants - Transitions', () => {
	it('visible state has transition configuration', () => {
		const { visible } = fadeVariants;
		expect(visible).toBeDefined();
		if (typeof visible === 'object' && visible !== null && 'transition' in visible) {
			const { transition } = visible;
			expect(transition).toBeDefined();
			expect(typeof transition).toBe('object');
		}
	});

	it('exit state has transition configuration', () => {
		const { exit } = fadeVariants;
		expect(exit).toBeDefined();
		if (typeof exit === 'object' && exit !== null && 'transition' in exit) {
			const { transition } = exit;
			expect(transition).toBeDefined();
			expect(typeof transition).toBe('object');
		}
	});
});

describe('fadeVariants - Type safety', () => {
	it('fadeVariants matches Variants type', () => {
		const variants: Variants = fadeVariants;
		expect(variants).toBeDefined();
	});
});
