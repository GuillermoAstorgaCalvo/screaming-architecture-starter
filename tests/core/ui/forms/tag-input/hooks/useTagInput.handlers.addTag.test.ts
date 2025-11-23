/**
 * handleAddTag Tests
 *
 * Tests for the handleAddTag function:
 * - Adding tags
 * - Max tags limit
 * - Duplicate detection
 * - Tag validation
 * - Controlled vs uncontrolled mode
 */

import { handleAddTag } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers.addTag';
import type { HandleAddTagOptions } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers.types';
import { describe, expect, it, vi } from 'vitest';

describe('handleAddTag', () => {
	it('should be a function', () => {
		expect(typeof handleAddTag).toBe('function');
	});

	it('returns false for empty trimmed value', () => {
		const options: HandleAddTagOptions = {
			trimmedValue: '',
			tags: [],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags: vi.fn(),
			onChange: vi.fn(),
		};

		const result = handleAddTag(options);

		expect(result).toBe(false);
		expect(options.onChange).not.toHaveBeenCalled();
	});

	it('returns false when max tags limit reached', () => {
		const options: HandleAddTagOptions = {
			trimmedValue: 'newtag',
			tags: ['tag1', 'tag2'],
			maxTags: 2,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags: vi.fn(),
			onChange: vi.fn(),
		};

		const result = handleAddTag(options);

		expect(result).toBe(false);
		expect(options.onChange).not.toHaveBeenCalled();
	});

	it('returns false for invalid tag (whitespace only)', () => {
		const options: HandleAddTagOptions = {
			trimmedValue: '   ',
			tags: [],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags: vi.fn(),
			onChange: vi.fn(),
		};

		const result = handleAddTag(options);

		expect(result).toBe(false);
		expect(options.onChange).not.toHaveBeenCalled();
	});

	it('returns false for duplicate tag when allowDuplicates is false', () => {
		const options: HandleAddTagOptions = {
			trimmedValue: 'tag1',
			tags: ['tag1', 'tag2'],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags: vi.fn(),
			onChange: vi.fn(),
		};

		const result = handleAddTag(options);

		expect(result).toBe(false);
		expect(options.onChange).not.toHaveBeenCalled();
	});

	it('returns true and adds tag when valid', () => {
		const setInternalTags = vi.fn();
		const onChange = vi.fn();
		const options: HandleAddTagOptions = {
			trimmedValue: 'newtag',
			tags: ['tag1'],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags,
			onChange,
		};

		const result = handleAddTag(options);

		expect(result).toBe(true);
		expect(setInternalTags).toHaveBeenCalledWith(['tag1', 'newtag']);
		expect(onChange).toHaveBeenCalledWith(['tag1', 'newtag']);
	});

	it('normalizes tag before adding', () => {
		const setInternalTags = vi.fn();
		const onChange = vi.fn();
		const options: HandleAddTagOptions = {
			trimmedValue: '  newtag  ',
			tags: ['tag1'],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags,
			onChange,
		};

		const result = handleAddTag(options);

		expect(result).toBe(true);
		expect(setInternalTags).toHaveBeenCalledWith(['tag1', 'newtag']);
		expect(onChange).toHaveBeenCalledWith(['tag1', 'newtag']);
	});

	it('allows duplicate when allowDuplicates is true', () => {
		const setInternalTags = vi.fn();
		const onChange = vi.fn();
		const options: HandleAddTagOptions = {
			trimmedValue: 'tag1',
			tags: ['tag1', 'tag2'],
			maxTags: undefined,
			allowDuplicates: true,
			isControlled: false,
			setInternalTags,
			onChange,
		};

		const result = handleAddTag(options);

		expect(result).toBe(true);
		expect(setInternalTags).toHaveBeenCalledWith(['tag1', 'tag2', 'tag1']);
		expect(onChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag1']);
	});

	it('does not update internal tags in controlled mode', () => {
		const setInternalTags = vi.fn();
		const onChange = vi.fn();
		const options: HandleAddTagOptions = {
			trimmedValue: 'newtag',
			tags: ['tag1'],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: true,
			setInternalTags,
			onChange,
		};

		const result = handleAddTag(options);

		expect(result).toBe(true);
		expect(setInternalTags).not.toHaveBeenCalled();
		expect(onChange).toHaveBeenCalledWith(['tag1', 'newtag']);
	});

	it('handles case-insensitive duplicate detection', () => {
		const options: HandleAddTagOptions = {
			trimmedValue: 'TAG1',
			tags: ['tag1'],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags: vi.fn(),
			onChange: vi.fn(),
		};

		const result = handleAddTag(options);

		expect(result).toBe(false);
	});

	it('handles empty tags array', () => {
		const setInternalTags = vi.fn();
		const onChange = vi.fn();
		const options: HandleAddTagOptions = {
			trimmedValue: 'firsttag',
			tags: [],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags,
			onChange,
		};

		const result = handleAddTag(options);

		expect(result).toBe(true);
		expect(setInternalTags).toHaveBeenCalledWith(['firsttag']);
		expect(onChange).toHaveBeenCalledWith(['firsttag']);
	});

	it('does not call onChange when undefined', () => {
		const setInternalTags = vi.fn();
		const options: HandleAddTagOptions = {
			trimmedValue: 'newtag',
			tags: ['tag1'],
			maxTags: undefined,
			allowDuplicates: false,
			isControlled: false,
			setInternalTags,
			onChange: undefined,
		};

		const result = handleAddTag(options);

		expect(result).toBe(true);
		expect(setInternalTags).toHaveBeenCalled();
	});
});
