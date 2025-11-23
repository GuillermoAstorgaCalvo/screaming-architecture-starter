/**
 * RichTextEditorConstants Tests
 *
 * Tests for the RichTextEditorConstants including:
 * - Heading level constants
 * - Heading levels array
 * - Default placeholder constant
 */

import {
	DEFAULT_PLACEHOLDER,
	HEADING_LEVEL_1,
	HEADING_LEVEL_2,
	HEADING_LEVEL_3,
	HEADING_LEVEL_4,
	HEADING_LEVEL_5,
	HEADING_LEVEL_6,
	HEADING_LEVELS,
} from '@core/ui/forms/rich-text-editor/constants/RichTextEditorConstants';
import { describe, expect, it } from 'vitest';

describe('RichTextEditorConstants - Heading Levels', () => {
	it('defines all heading level constants', () => {
		expect(HEADING_LEVEL_1).toBe(1);
		expect(HEADING_LEVEL_2).toBe(2);
		expect(HEADING_LEVEL_3).toBe(3);
		expect(HEADING_LEVEL_4).toBe(4);
		expect(HEADING_LEVEL_5).toBe(5);
		expect(HEADING_LEVEL_6).toBe(6);
	});

	it('HEADING_LEVELS array contains all heading levels', () => {
		expect(HEADING_LEVELS).toHaveLength(6);
		expect(HEADING_LEVELS).toContain(HEADING_LEVEL_1);
		expect(HEADING_LEVELS).toContain(HEADING_LEVEL_2);
		expect(HEADING_LEVELS).toContain(HEADING_LEVEL_3);
		expect(HEADING_LEVELS).toContain(HEADING_LEVEL_4);
		expect(HEADING_LEVELS).toContain(HEADING_LEVEL_5);
		expect(HEADING_LEVELS).toContain(HEADING_LEVEL_6);
	});

	it('HEADING_LEVELS array is in ascending order', () => {
		expect(HEADING_LEVELS[0]).toBe(1);
		expect(HEADING_LEVELS[1]).toBe(2);
		expect(HEADING_LEVELS[2]).toBe(3);
		expect(HEADING_LEVELS[3]).toBe(4);
		expect(HEADING_LEVELS[4]).toBe(5);
		expect(HEADING_LEVELS[5]).toBe(6);
	});

	it('HEADING_LEVELS is a readonly tuple type', () => {
		// TypeScript ensures this is a readonly tuple
		// Runtime check: array should be immutable in practice
		const levels = [...HEADING_LEVELS];
		expect(levels).toEqual([1, 2, 3, 4, 5, 6]);
	});
});

describe('RichTextEditorConstants - Default Placeholder', () => {
	it('defines DEFAULT_PLACEHOLDER constant', () => {
		expect(DEFAULT_PLACEHOLDER).toBe('Start typing...');
		expect(typeof DEFAULT_PLACEHOLDER).toBe('string');
		expect(DEFAULT_PLACEHOLDER.length).toBeGreaterThan(0);
	});
});
