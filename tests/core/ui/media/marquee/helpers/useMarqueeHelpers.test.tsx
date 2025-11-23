/**
 * useMarqueeHelpers Tests
 *
 * Tests for the marquee helper functions including:
 * - calculateDuplicateCount
 * - shouldShowMeasure
 * - buildLoopAnimationStyle
 * - createDuplicatedContentFactory
 */

import {
	buildLoopAnimationStyle,
	calculateDuplicateCount,
	createDuplicatedContentFactory,
	shouldShowMeasure,
} from '@core/ui/media/marquee/helpers/useMarqueeHelpers';
import { describe, expect, it } from 'vitest';

describe('useMarqueeHelpers', () => {
	describe('calculateDuplicateCount', () => {
		it('should return minDuplicates when contentWidth is 0', () => {
			const result = calculateDuplicateCount(100, 0, 2);
			expect(result).toBe(2);
		});

		it('should return minDuplicates when contentWidth is 0 and minDuplicates is 3', () => {
			const result = calculateDuplicateCount(100, 0, 3);
			expect(result).toBe(3);
		});

		it('should calculate duplicates for container smaller than content', () => {
			const containerWidth = 100;
			const contentWidth = 200;
			const result = calculateDuplicateCount(containerWidth, contentWidth);
			// neededWidth = 100 + 200 = 300
			// duplicates = Math.ceil(300 / 200) = 2
			expect(result).toBe(2);
		});

		it('should calculate duplicates for container larger than content', () => {
			const containerWidth = 500;
			const contentWidth = 200;
			const result = calculateDuplicateCount(containerWidth, contentWidth);
			// neededWidth = 500 + 200 = 700
			// duplicates = Math.ceil(700 / 200) = 4
			expect(result).toBe(4);
		});

		it('should return at least minDuplicates even if calculation is less', () => {
			const containerWidth = 50;
			const contentWidth = 100;
			const minDuplicates = 3;
			const result = calculateDuplicateCount(containerWidth, contentWidth, minDuplicates);
			// neededWidth = 50 + 100 = 150
			// duplicates = Math.ceil(150 / 100) = 2
			// But should return max(2, 3) = 3
			expect(result).toBe(3);
		});

		it('should handle exact fit scenario', () => {
			const containerWidth = 200;
			const contentWidth = 200;
			const result = calculateDuplicateCount(containerWidth, contentWidth);
			// neededWidth = 200 + 200 = 400
			// duplicates = Math.ceil(400 / 200) = 2
			expect(result).toBe(2);
		});

		it('should use default minDuplicates of 2 when not provided', () => {
			const containerWidth = 50;
			const contentWidth = 100;
			const result = calculateDuplicateCount(containerWidth, contentWidth);
			// neededWidth = 50 + 100 = 150
			// duplicates = Math.ceil(150 / 100) = 2
			expect(result).toBe(2);
		});
	});

	describe('shouldShowMeasure', () => {
		it('should return true when loop is true and providedDuplicateCount is undefined', () => {
			const result = shouldShowMeasure(true, undefined);
			expect(result).toBe(true);
		});

		it('should return false when loop is false', () => {
			const result = shouldShowMeasure(false, undefined);
			expect(result).toBe(false);
		});

		it('should return false when loop is true but providedDuplicateCount is provided', () => {
			const result = shouldShowMeasure(true, 3);
			expect(result).toBe(false);
		});

		it('should return false when loop is false and providedDuplicateCount is provided', () => {
			const result = shouldShowMeasure(false, 3);
			expect(result).toBe(false);
		});

		it('should return false when loop is false and providedDuplicateCount is undefined', () => {
			const result = shouldShowMeasure(false, undefined);
			expect(result).toBe(false);
		});
	});

	describe('buildLoopAnimationStyle', () => {
		it('should return undefined when loop is false', () => {
			const result = buildLoopAnimationStyle(false, 'left', false);
			expect(result).toBeUndefined();
		});

		it('should return animation style when loop is true and not paused', () => {
			const result = buildLoopAnimationStyle(true, 'left', false);
			expect(result).toBeDefined();
			expect(result?.animation).toBe('marquee-left var(--marquee-duration, 20s) linear infinite');
		});

		it('should return animation style with right direction', () => {
			const result = buildLoopAnimationStyle(true, 'right', false);
			expect(result).toBeDefined();
			expect(result?.animation).toBe('marquee-right var(--marquee-duration, 20s) linear infinite');
		});

		it('should return animation: none when paused', () => {
			const result = buildLoopAnimationStyle(true, 'left', true);
			expect(result).toBeDefined();
			expect(result?.animation).toBe('none');
		});

		it('should return animation: none when paused with right direction', () => {
			const result = buildLoopAnimationStyle(true, 'right', true);
			expect(result).toBeDefined();
			expect(result?.animation).toBe('none');
		});
	});

	describe('createDuplicatedContentFactory', () => {
		it('should create array with specified duplicate count', () => {
			const children = <span>Test</span>;
			const duplicateCount = 3;
			const result = createDuplicatedContentFactory(children, duplicateCount);

			expect(result).toHaveLength(3);
			expect(result[0]?.key).toBe(0);
			expect(result[1]?.key).toBe(1);
			expect(result[2]?.key).toBe(2);
		});

		it('should create array with duplicate count of 1', () => {
			const children = <span>Test</span>;
			const duplicateCount = 1;
			const result = createDuplicatedContentFactory(children, duplicateCount);

			expect(result).toHaveLength(1);
			expect(result[0]?.key).toBe(0);
		});

		it('should create array with duplicate count of 0', () => {
			const children = <span>Test</span>;
			const duplicateCount = 0;
			const result = createDuplicatedContentFactory(children, duplicateCount);

			expect(result).toHaveLength(0);
		});

		it('should assign same children to all duplicates', () => {
			const children = <div>Content</div>;
			const duplicateCount = 2;
			const result = createDuplicatedContentFactory(children, duplicateCount);

			expect(result[0]?.children).toBe(children);
			expect(result[1]?.children).toBe(children);
		});

		it('should assign unique keys to each duplicate', () => {
			const children = <span>Test</span>;
			const duplicateCount = 5;
			const result = createDuplicatedContentFactory(children, duplicateCount);

			const keys = result.map(item => item.key);
			const uniqueKeys = new Set(keys);
			expect(uniqueKeys.size).toBe(5);
			expect(keys).toEqual([0, 1, 2, 3, 4]);
		});

		it('should handle complex children', () => {
			const children = (
				<div>
					<span>Item 1</span>
					<span>Item 2</span>
				</div>
			);
			const duplicateCount = 2;
			const result = createDuplicatedContentFactory(children, duplicateCount);

			expect(result).toHaveLength(2);
			expect(result[0]?.children).toBe(children);
			expect(result[1]?.children).toBe(children);
		});
	});
});
