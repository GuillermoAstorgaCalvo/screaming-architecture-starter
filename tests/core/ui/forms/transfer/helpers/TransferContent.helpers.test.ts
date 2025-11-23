/**
 * TransferContent.helpers Tests
 *
 * Tests for TransferContent helper functions including:
 * - Gap class generation
 * - Container class building
 * - Label extraction
 * - Props extraction
 */

import {
	extractTransferProps,
	getActionLabels,
	getContainerClasses,
	getGapClass,
	getListLabels,
} from '@core/ui/forms/transfer/helpers/TransferContent.helpers';
import type { TransferProps } from '@src-types/ui/data/transfer';
import { describe, expect, it } from 'vitest';

describe('getGapClass', () => {
	it('returns gap-sm for sm size', () => {
		expect(getGapClass('sm')).toBe('gap-sm');
	});

	it('returns gap-md for md size', () => {
		expect(getGapClass('md')).toBe('gap-md');
	});

	it('returns gap-xl for lg size', () => {
		expect(getGapClass('lg')).toBe('gap-xl');
	});
});

describe('getContainerClasses', () => {
	it('merges base classes with gap class', () => {
		const result = getContainerClasses('md');
		expect(result).toContain('flex');
		expect(result).toContain('gap-md');
	});

	it('merges custom className', () => {
		const result = getContainerClasses('md', 'custom-class');
		expect(result).toContain('flex');
		expect(result).toContain('gap-md');
		expect(result).toContain('custom-class');
	});

	it('handles undefined className', () => {
		const result = getContainerClasses('sm');
		expect(result).toContain('flex');
		expect(result).toContain('gap-sm');
	});
});

describe('getListLabels', () => {
	it('returns undefined when labels is undefined', () => {
		expect(getListLabels(undefined)).toBeUndefined();
	});

	it('returns undefined when labels object is empty', () => {
		expect(getListLabels({})).toBeUndefined();
	});

	it('extracts selectAll label', () => {
		const result = getListLabels({ selectAll: 'Select All' });
		expect(result).toEqual({ selectAll: 'Select All' });
	});

	it('extracts selectNone label', () => {
		const result = getListLabels({ selectNone: 'Deselect All' });
		expect(result).toEqual({ selectNone: 'Deselect All' });
	});

	it('extracts both labels', () => {
		const result = getListLabels({
			selectAll: 'Select All',
			selectNone: 'Deselect All',
		});
		expect(result).toEqual({
			selectAll: 'Select All',
			selectNone: 'Deselect All',
		});
	});

	it('ignores other label properties', () => {
		const labels = {
			selectAll: 'Select All',
			moveToRight: 'Move Right',
			moveToLeft: 'Move Left',
		} as TransferProps<unknown>['labels'];
		const result = getListLabels(labels);
		expect(result).toEqual({ selectAll: 'Select All' });
	});
});

describe('getActionLabels', () => {
	it('returns undefined when labels is undefined', () => {
		expect(getActionLabels(undefined)).toBeUndefined();
	});

	it('returns undefined when labels object is empty', () => {
		expect(getActionLabels({})).toBeUndefined();
	});

	it('extracts moveToRight label', () => {
		const result = getActionLabels({ moveToRight: 'Move Right' });
		expect(result).toEqual({ moveToRight: 'Move Right' });
	});

	it('extracts moveToLeft label', () => {
		const result = getActionLabels({ moveToLeft: 'Move Left' });
		expect(result).toEqual({ moveToLeft: 'Move Left' });
	});

	it('extracts both labels', () => {
		const result = getActionLabels({
			moveToRight: 'Move Right',
			moveToLeft: 'Move Left',
		});
		expect(result).toEqual({
			moveToRight: 'Move Right',
			moveToLeft: 'Move Left',
		});
	});

	it('ignores other label properties', () => {
		const labels = {
			moveToRight: 'Move Right',
			selectAll: 'Select All',
			selectNone: 'Deselect All',
		} as TransferProps<unknown>['labels'];
		const result = getActionLabels(labels);
		expect(result).toEqual({ moveToRight: 'Move Right' });
	});
});

describe('extractTransferProps', () => {
	it('applies default props', () => {
		const props: TransferProps = {
			options: [],
		};
		const result = extractTransferProps(props);
		expect(result.sourceTitle).toBeDefined();
		expect(result.targetTitle).toBeDefined();
		expect(result.searchPlaceholder).toBeDefined();
		expect(result.showSearch).toBe(true);
		expect(result.size).toBe('md');
		expect(result.disabled).toBe(false);
		expect(result.maxHeight).toBe(300);
		expect(result.showSelectAll).toBe(true);
	});

	it('overrides defaults with provided props', () => {
		const props: TransferProps = {
			options: [],
			sourceTitle: 'Custom Source',
			targetTitle: 'Custom Target',
			showSearch: false,
			size: 'lg',
			disabled: true,
			maxHeight: 500,
			showSelectAll: false,
		};
		const result = extractTransferProps(props);
		expect(result.sourceTitle).toBe('Custom Source');
		expect(result.targetTitle).toBe('Custom Target');
		expect(result.showSearch).toBe(false);
		expect(result.size).toBe('lg');
		expect(result.disabled).toBe(true);
		expect(result.maxHeight).toBe(500);
		expect(result.showSelectAll).toBe(false);
	});

	it('excludes onChange, options, value, and defaultValue from restProps', () => {
		const props: TransferProps = {
			options: [],
			value: ['1'],
			defaultValue: ['2'],
			onChange: () => {},
			className: 'custom-class',
		};
		const result = extractTransferProps(props);
		expect('onChange' in result.restProps).toBe(false);
		expect('options' in result.restProps).toBe(false);
		expect('value' in result.restProps).toBe(false);
		expect('defaultValue' in result.restProps).toBe(false);
		expect(result.restProps.className).toBe('custom-class');
	});
});
