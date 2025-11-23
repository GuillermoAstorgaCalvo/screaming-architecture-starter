/**
 * Tests for motion variant factory
 *
 * Tests the createVariant factory function:
 * - Basic variant creation
 * - Timing configuration
 * - State-specific timing overrides
 * - Transition merging
 * - Duration resolution
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import {
	createVariant,
	type CreateVariantOptions,
} from '@core/ui/utilities/motion/helpers/motionVariantFactory';
import type { TargetAndTransition, Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

describe('createVariant - Basic variant creation', () => {
	it('creates variant with hidden and visible states', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
		};

		const result = createVariant(options);

		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
		expect(result.hidden).toEqual({ opacity: 0 });
		expect(result.visible).toEqual({ opacity: 1 });
		expect(result.exit).toEqual({ opacity: 0 }); // defaults to hidden
	});

	it('creates variant with custom exit state', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			exit: { opacity: 0, scale: 0.8 },
		};

		const result = createVariant(options);

		expect(result.exit).toEqual({ opacity: 0, scale: 0.8 });
	});

	it('creates variant with multiple properties', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0, x: -100, scale: 0.8 },
			visible: { opacity: 1, x: 0, scale: 1 },
		};

		const result = createVariant(options);

		expect(result.hidden).toEqual({ opacity: 0, x: -100, scale: 0.8 });
		expect(result.visible).toEqual({ opacity: 1, x: 0, scale: 1 });
	});
});

describe('createVariant - Base timing configuration - Complete timing', () => {
	it('applies base timing to all states', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				duration: 'normal',
				ease: 'ease-out',
				delay: 0.1,
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
			delay: 0.1,
		});
		expect((result.visible as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
			delay: 0.1,
		});
		expect((result.exit as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
			delay: 0.1,
		});
	});

	it('applies base timing with numeric duration', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				duration: 0.5,
				ease: 'ease-in',
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition?.duration).toBe(0.5);
		expect((result.visible as TargetAndTransition)?.transition?.duration).toBe(0.5);
		expect((result.exit as TargetAndTransition)?.transition?.duration).toBe(0.5);
	});
});

describe('createVariant - Base timing configuration - Partial timing', () => {
	it('applies base timing with only duration', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				duration: 'fast',
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition?.duration).toBe(motionDurations.fast);
		expect((result.visible as TargetAndTransition)?.transition?.duration).toBe(
			motionDurations.fast
		);
		expect((result.exit as TargetAndTransition)?.transition?.duration).toBe(motionDurations.fast);
	});

	it('applies base timing with only ease', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				ease: 'ease-in-out',
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition?.ease).toEqual(
			motionEasing['ease-in-out']
		);
		expect((result.visible as TargetAndTransition)?.transition?.ease).toEqual(
			motionEasing['ease-in-out']
		);
		expect((result.exit as TargetAndTransition)?.transition?.ease).toEqual(
			motionEasing['ease-in-out']
		);
	});

	it('applies base timing with only delay', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				delay: 0.2,
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition?.delay).toBe(0.2);
		expect((result.visible as TargetAndTransition)?.transition?.delay).toBe(0.2);
		expect((result.exit as TargetAndTransition)?.transition?.delay).toBe(0.2);
	});
});

describe('createVariant - State-specific timing overrides - Hidden state', () => {
	it('overrides hidden state timing', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				duration: 'normal',
				ease: 'ease-out',
			},
			hiddenTiming: {
				duration: 'fast',
				ease: 'ease-in',
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		});
		expect((result.visible as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		});
		expect((result.exit as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		});
	});
});

describe('createVariant - State-specific timing overrides - Visible state', () => {
	it('overrides visible state timing', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				duration: 'normal',
			},
			visibleTiming: {
				duration: 'slow',
				delay: 0.1,
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition?.duration).toBe(
			motionDurations.normal
		);
		expect((result.visible as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.slow,
			delay: 0.1,
		});
		expect((result.exit as TargetAndTransition)?.transition?.duration).toBe(motionDurations.normal);
	});
});

describe('createVariant - State-specific timing overrides - Exit state', () => {
	it('overrides exit state timing', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				duration: 'normal',
			},
			exitTiming: {
				duration: 'fast',
				delay: 0.05,
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition?.duration).toBe(
			motionDurations.normal
		);
		expect((result.visible as TargetAndTransition)?.transition?.duration).toBe(
			motionDurations.normal
		);
		expect((result.exit as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.fast,
			delay: 0.05,
		});
	});
});

describe('createVariant - State-specific timing overrides - Without base timing', () => {
	it('handles state-specific timing without base timing', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			hiddenTiming: {
				duration: 'fast',
			},
			visibleTiming: {
				duration: 'slow',
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition?.duration).toBe(motionDurations.fast);
		expect((result.visible as TargetAndTransition)?.transition?.duration).toBe(
			motionDurations.slow
		);
		expect((result.exit as TargetAndTransition)?.transition).toBeUndefined();
	});
});

describe('createVariant - Transition merging - With existing transitions', () => {
	it('merges existing transition with timing config', () => {
		const options: CreateVariantOptions = {
			hidden: {
				opacity: 0,
				transition: {
					type: 'spring',
					stiffness: 100,
				},
			},
			visible: { opacity: 1 },
			timing: {
				duration: 'normal',
				ease: 'ease-out',
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
			type: 'spring',
			stiffness: 100,
		});
	});

	it('preserves existing transition properties when merging', () => {
		const options: CreateVariantOptions = {
			hidden: {
				opacity: 0,
				transition: {
					duration: 0.8,
					type: 'tween',
					ease: [0.5, 0, 0.5, 1],
				},
			},
			visible: { opacity: 1 },
			timing: {
				duration: 'normal',
				ease: 'ease-out',
			},
		};

		const result = createVariant(options);

		// Existing transition properties override timing config (implementation uses ...existingTransition last)
		expect((result.hidden as TargetAndTransition)?.transition).toMatchObject({
			duration: 0.8, // existing overrides timing config
			ease: [0.5, 0, 0.5, 1], // existing overrides timing config
			type: 'tween', // preserved from existing
		});
	});
});

describe('createVariant - Transition merging - Without existing transitions', () => {
	it('handles state with no existing transition', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {
				duration: 'normal',
			},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.normal,
		});
		expect((result.visible as TargetAndTransition)?.transition).toEqual({
			duration: motionDurations.normal,
		});
	});
});

describe('createVariant - Edge cases - Empty timing', () => {
	it('handles empty timing config', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			timing: {},
		};

		const result = createVariant(options);

		expect((result.hidden as TargetAndTransition)?.transition).toBeUndefined();
		expect((result.visible as TargetAndTransition)?.transition).toBeUndefined();
		expect((result.exit as TargetAndTransition)?.transition).toBeUndefined();
	});
});

describe('createVariant - Edge cases - Complex properties', () => {
	it('handles complex nested properties', () => {
		const options: CreateVariantOptions = {
			hidden: {
				opacity: 0,
				scale: 0.8,
				rotate: -45,
				filter: 'blur(10px)',
			},
			visible: {
				opacity: 1,
				scale: 1,
				rotate: 0,
				filter: 'blur(0px)',
			},
			timing: {
				duration: 'normal',
			},
		};

		const result = createVariant(options);

		expect(result.hidden).toMatchObject({
			opacity: 0,
			scale: 0.8,
			rotate: -45,
			filter: 'blur(10px)',
		});
		expect(result.visible).toMatchObject({
			opacity: 1,
			scale: 1,
			rotate: 0,
			filter: 'blur(0px)',
		});
	});
});

describe('createVariant - Edge cases - Type validation', () => {
	it('creates valid Variants object', () => {
		const options: CreateVariantOptions = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
		};

		const result = createVariant(options);

		// Type check: result should be a valid Variants object
		const variants: Variants = result;
		expect(variants).toBeDefined();
		expect(variants.hidden).toBeDefined();
		expect(variants.visible).toBeDefined();
		expect(variants.exit).toBeDefined();
	});
});
