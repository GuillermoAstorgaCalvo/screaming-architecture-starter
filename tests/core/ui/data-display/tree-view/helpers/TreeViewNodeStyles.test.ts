/**
 * Tests for TreeViewNodeStyles helper functions
 *
 * Tests helper functions:
 * - getTreeNodeElementClasses
 */

import {
	TREE_VIEW_NODE_BASE_CLASSES,
	TREE_VIEW_NODE_HOVER_CLASSES,
	TREE_VIEW_NODE_SELECTED_CLASSES,
	TREE_VIEW_NODE_SIZE_CLASSES,
} from '@core/constants/ui/navigation';
import { getTreeNodeElementClasses } from '@core/ui/data-display/tree-view/helpers/TreeViewNodeStyles';
import type { StandardSize } from '@src-types/ui/base';
import { describe, expect, it } from 'vitest';

describe('TreeViewNodeStyles - getTreeNodeElementClasses', () => {
	const sizes: StandardSize[] = ['sm', 'md', 'lg'];

	it('should return base classes with size classes for all sizes when not selected and not disabled', () => {
		for (const size of sizes) {
			const result = getTreeNodeElementClasses(size, false, false);
			expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
			expect(result).toContain(TREE_VIEW_NODE_SIZE_CLASSES[size]);
			expect(result).toContain(TREE_VIEW_NODE_HOVER_CLASSES);
			expect(result).not.toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
			expect(result).not.toContain('opacity-disabled');
		}
	});

	it('should include selected classes when nodeIsSelected is true', () => {
		const result = getTreeNodeElementClasses('md', true, false);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
		expect(result).toContain(TREE_VIEW_NODE_HOVER_CLASSES);
		expect(result).not.toContain('opacity-disabled');
	});

	it('should include disabled class when nodeDisabled is true', () => {
		const result = getTreeNodeElementClasses('md', false, true);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).toContain('opacity-disabled');
		expect(result).not.toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
	});

	it('should not include disabled class when nodeDisabled is false', () => {
		const result = getTreeNodeElementClasses('md', false, false);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).not.toContain('opacity-disabled');
	});

	it('should not include disabled class when nodeDisabled is undefined', () => {
		const result = getTreeNodeElementClasses('md', false, undefined);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).not.toContain('opacity-disabled');
	});

	it('should handle selected and disabled states together', () => {
		const result = getTreeNodeElementClasses('md', true, true);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
		expect(result).toContain('opacity-disabled');
	});

	it('should return different classes for different sizes', () => {
		const smResult = getTreeNodeElementClasses('sm', false, false);
		const mdResult = getTreeNodeElementClasses('md', false, false);
		const lgResult = getTreeNodeElementClasses('lg', false, false);

		expect(smResult).not.toBe(mdResult);
		expect(smResult).not.toBe(lgResult);
		expect(mdResult).not.toBe(lgResult);
	});

	it('should return different classes for selected vs unselected states', () => {
		const selectedResult = getTreeNodeElementClasses('md', true, false);
		const unselectedResult = getTreeNodeElementClasses('md', false, false);

		expect(selectedResult).not.toBe(unselectedResult);
		expect(selectedResult).toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
		expect(unselectedResult).not.toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
	});

	it('should return different classes for disabled vs enabled states', () => {
		const disabledResult = getTreeNodeElementClasses('md', false, true);
		const enabledResult = getTreeNodeElementClasses('md', false, false);

		expect(disabledResult).not.toBe(enabledResult);
		expect(disabledResult).toContain('opacity-disabled');
		expect(enabledResult).not.toContain('opacity-disabled');
	});

	it('should handle all size variants with disabled state', () => {
		for (const size of sizes) {
			const result = getTreeNodeElementClasses(size, false, true);
			expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
			expect(result).toContain(TREE_VIEW_NODE_SIZE_CLASSES[size]);
			expect(result).toContain('opacity-disabled');
		}
	});

	it('should handle all size variants with selected and disabled states', () => {
		for (const size of sizes) {
			const result = getTreeNodeElementClasses(size, true, true);
			expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
			expect(result).toContain(TREE_VIEW_NODE_SIZE_CLASSES[size]);
			expect(result).toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
			expect(result).toContain('opacity-disabled');
		}
	});

	it('should handle all combinations of size, selected, and disabled states', () => {
		const combinations = [
			{ size: 'sm' as StandardSize, selected: false, disabled: false },
			{ size: 'sm' as StandardSize, selected: false, disabled: true },
			{ size: 'sm' as StandardSize, selected: false, disabled: undefined },
			{ size: 'sm' as StandardSize, selected: true, disabled: false },
			{ size: 'sm' as StandardSize, selected: true, disabled: true },
			{ size: 'sm' as StandardSize, selected: true, disabled: undefined },
			{ size: 'md' as StandardSize, selected: false, disabled: false },
			{ size: 'md' as StandardSize, selected: false, disabled: true },
			{ size: 'md' as StandardSize, selected: false, disabled: undefined },
			{ size: 'md' as StandardSize, selected: true, disabled: false },
			{ size: 'md' as StandardSize, selected: true, disabled: true },
			{ size: 'md' as StandardSize, selected: true, disabled: undefined },
			{ size: 'lg' as StandardSize, selected: false, disabled: false },
			{ size: 'lg' as StandardSize, selected: false, disabled: true },
			{ size: 'lg' as StandardSize, selected: false, disabled: undefined },
			{ size: 'lg' as StandardSize, selected: true, disabled: false },
			{ size: 'lg' as StandardSize, selected: true, disabled: true },
			{ size: 'lg' as StandardSize, selected: true, disabled: undefined },
		];

		for (const combo of combinations) {
			const result = getTreeNodeElementClasses(combo.size, combo.selected, combo.disabled);
			expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
			expect(result).toContain(TREE_VIEW_NODE_SIZE_CLASSES[combo.size]);
			expect(result).toContain(TREE_VIEW_NODE_HOVER_CLASSES);

			if (combo.selected) {
				expect(result).toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
			} else {
				expect(result).not.toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
			}

			if (combo.disabled === true) {
				expect(result).toContain('opacity-disabled');
			} else {
				expect(result).not.toContain('opacity-disabled');
			}
		}
	});
});
