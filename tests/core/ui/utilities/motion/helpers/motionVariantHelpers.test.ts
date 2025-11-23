/**
 * Tests for motion variant helpers
 *
 * Tests the motion variant helper functions:
 * - getFadeVariant
 * - getSlideVariant
 * - getSlideRightVariant
 * - getSlideTopVariant
 * - getSlideBottomVariant
 * - getScaleVariant
 * - getScaleUpVariant
 * - getRotateVariant
 * - getBounceVariant
 * - getShakeVariant
 * - getBlurVariant
 * - getHeightVariant
 * - getWidthVariant
 * - getVariant
 */

import {
	getBlurVariant,
	getBounceVariant,
	getFadeVariant,
	getHeightVariant,
	getRotateVariant,
	getScaleUpVariant,
	getScaleVariant,
	getShakeVariant,
	getSlideBottomVariant,
	getSlideRightVariant,
	getSlideTopVariant,
	getSlideVariant,
	getVariant,
	getWidthVariant,
} from '@core/ui/utilities/motion/helpers/motionVariantHelpers';
import { blurVariants, shakeVariants } from '@core/ui/utilities/motion/variants/effectVariants';
import { fadeVariants } from '@core/ui/utilities/motion/variants/fadeVariants';
import { rotateVariants } from '@core/ui/utilities/motion/variants/rotateVariants';
import { scaleUpVariants, scaleVariants } from '@core/ui/utilities/motion/variants/scaleVariants';
import { heightVariants, widthVariants } from '@core/ui/utilities/motion/variants/sizeVariants';
import {
	slideBottomVariants,
	slideRightVariants,
	slideTopVariants,
	slideVariants,
} from '@core/ui/utilities/motion/variants/slideVariants';
import { bounceVariants } from '@core/ui/utilities/motion/variants/springVariants';
import type { Variants } from 'framer-motion';
import { describe, expect, it } from 'vitest';

type VariantType =
	| 'fade'
	| 'slide'
	| 'slideRight'
	| 'slideTop'
	| 'slideBottom'
	| 'scale'
	| 'scaleUp'
	| 'rotate'
	| 'bounce'
	| 'shake'
	| 'blur'
	| 'height'
	| 'width';

const getAllVariantTypes = (): VariantType[] => [
	'fade',
	'slide',
	'slideRight',
	'slideTop',
	'slideBottom',
	'scale',
	'scaleUp',
	'rotate',
	'bounce',
	'shake',
	'blur',
	'height',
	'width',
];

const testVariantProperties = (result: Variants) => {
	expect(result).toBeDefined();
	expect(result).toHaveProperty('hidden');
	expect(result).toHaveProperty('visible');
	expect(result).toHaveProperty('exit');
	// Type check: result should be a valid Variants object
	const variants: Variants = result;
	expect(variants).toBeDefined();
};

const testVariantMapping = (variantType: VariantType, expectedVariants: Variants) => {
	const result = getVariant(variantType);
	expect(result).toBe(expectedVariants);
};

describe('getFadeVariant', () => {
	it('returns fade variants', () => {
		const result = getFadeVariant();

		expect(result).toBe(fadeVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getSlideVariant', () => {
	it('returns slide variants', () => {
		const result = getSlideVariant();

		expect(result).toBe(slideVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getSlideRightVariant', () => {
	it('returns slide right variants', () => {
		const result = getSlideRightVariant();

		expect(result).toBe(slideRightVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getSlideTopVariant', () => {
	it('returns slide top variants', () => {
		const result = getSlideTopVariant();

		expect(result).toBe(slideTopVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getSlideBottomVariant', () => {
	it('returns slide bottom variants', () => {
		const result = getSlideBottomVariant();

		expect(result).toBe(slideBottomVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getScaleVariant', () => {
	it('returns scale variants', () => {
		const result = getScaleVariant();

		expect(result).toBe(scaleVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getScaleUpVariant', () => {
	it('returns scale up variants', () => {
		const result = getScaleUpVariant();

		expect(result).toBe(scaleUpVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getRotateVariant', () => {
	it('returns rotate variants', () => {
		const result = getRotateVariant();

		expect(result).toBe(rotateVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getBounceVariant', () => {
	it('returns bounce variants', () => {
		const result = getBounceVariant();

		expect(result).toBe(bounceVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getShakeVariant', () => {
	it('returns shake variants', () => {
		const result = getShakeVariant();

		expect(result).toBe(shakeVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getBlurVariant', () => {
	it('returns blur variants', () => {
		const result = getBlurVariant();

		expect(result).toBe(blurVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getHeightVariant', () => {
	it('returns height variants', () => {
		const result = getHeightVariant();

		expect(result).toBe(heightVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getWidthVariant', () => {
	it('returns width variants', () => {
		const result = getWidthVariant();

		expect(result).toBe(widthVariants);
		expect(result).toHaveProperty('hidden');
		expect(result).toHaveProperty('visible');
		expect(result).toHaveProperty('exit');
	});
});

describe('getVariant', () => {
	describe('fade and slide variants', () => {
		it('returns fade variant for "fade"', () => {
			testVariantMapping('fade', fadeVariants);
		});

		it('returns slide variant for "slide"', () => {
			testVariantMapping('slide', slideVariants);
		});

		it('returns slide right variant for "slideRight"', () => {
			testVariantMapping('slideRight', slideRightVariants);
		});

		it('returns slide top variant for "slideTop"', () => {
			testVariantMapping('slideTop', slideTopVariants);
		});

		it('returns slide bottom variant for "slideBottom"', () => {
			testVariantMapping('slideBottom', slideBottomVariants);
		});
	});

	describe('scale, rotate, and effect variants', () => {
		it('returns scale variant for "scale"', () => {
			testVariantMapping('scale', scaleVariants);
		});

		it('returns scale up variant for "scaleUp"', () => {
			testVariantMapping('scaleUp', scaleUpVariants);
		});

		it('returns rotate variant for "rotate"', () => {
			testVariantMapping('rotate', rotateVariants);
		});

		it('returns bounce variant for "bounce"', () => {
			testVariantMapping('bounce', bounceVariants);
		});

		it('returns shake variant for "shake"', () => {
			testVariantMapping('shake', shakeVariants);
		});

		it('returns blur variant for "blur"', () => {
			testVariantMapping('blur', blurVariants);
		});
	});

	describe('size variants', () => {
		it('returns height variant for "height"', () => {
			testVariantMapping('height', heightVariants);
		});

		it('returns width variant for "width"', () => {
			testVariantMapping('width', widthVariants);
		});
	});
});

describe('getVariant - all variant types', () => {
	it('handles all variant types correctly', () => {
		const variantTypes = getAllVariantTypes();

		for (const variant of variantTypes) {
			const result = getVariant(variant);
			testVariantProperties(result);
		}
	});
});
