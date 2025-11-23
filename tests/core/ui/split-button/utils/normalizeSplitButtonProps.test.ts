/**
 * normalizeSplitButtonProps Tests
 *
 * Tests for the normalizeSplitButtonProps utility function:
 * - Default value application
 * - Prop merging
 * - Preserving provided values
 * - Button props extraction
 */

import { DEFAULT_PROPS } from '@core/ui/split-button/constants/SplitButtonDefaults';
import { normalizeSplitButtonProps } from '@core/ui/split-button/utils/normalizeSplitButtonProps';
import type { SplitButtonProps } from '@src-types/ui/buttons';
import { describe, expect, it } from 'vitest';

describe('normalizeSplitButtonProps', () => {
	it('should apply default values when props are undefined', () => {
		const props: SplitButtonProps = {
			children: 'Save',
			menuItems: [],
		};

		const result = normalizeSplitButtonProps(props);

		expect(result.variant).toBe(DEFAULT_PROPS.variant);
		expect(result.size).toBe(DEFAULT_PROPS.size);
		expect(result.isLoading).toBe(DEFAULT_PROPS.isLoading);
		expect(result.menuAlign).toBe(DEFAULT_PROPS.menuAlign);
		expect(result.type).toBe(DEFAULT_PROPS.type);
		expect(result.dropdownAriaLabel).toBe(DEFAULT_PROPS.dropdownAriaLabel);
	});

	it('should preserve provided values over defaults', () => {
		const props: SplitButtonProps = {
			children: 'Save',
			variant: 'secondary',
			size: 'lg',
			isLoading: true,
			menuAlign: 'start',
			type: 'submit',
			dropdownAriaLabel: 'Custom label',
			menuItems: [],
		};

		const result = normalizeSplitButtonProps(props);

		expect(result.variant).toBe('secondary');
		expect(result.size).toBe('lg');
		expect(result.isLoading).toBe(true);
		expect(result.menuAlign).toBe('start');
		expect(result.type).toBe('submit');
		expect(result.dropdownAriaLabel).toBe('Custom label');
	});

	it('should preserve optional props as undefined when not provided', () => {
		const props: SplitButtonProps = {
			children: 'Save',
			menuItems: [],
		};

		const result = normalizeSplitButtonProps(props);

		expect(result.disabled).toBeUndefined();
		expect(result.onClick).toBeUndefined();
		expect(result.onMenuItemSelect).toBeUndefined();
		expect(result.className).toBeUndefined();
	});

	it('should preserve provided optional props', () => {
		const onClick = () => {};
		const onMenuItemSelect = () => {};
		const props: SplitButtonProps = {
			children: 'Save',
			disabled: true,
			onClick,
			onMenuItemSelect,
			className: 'custom-class',
			menuItems: [],
		};

		const result = normalizeSplitButtonProps(props);

		expect(result.disabled).toBe(true);
		expect(result.onClick).toBe(onClick);
		expect(result.onMenuItemSelect).toBe(onMenuItemSelect);
		expect(result.className).toBe('custom-class');
	});

	it('should preserve children and menuItems', () => {
		const menuItems: SplitButtonProps['menuItems'] = [
			{ id: '1', label: 'Option 1' },
			{ id: '2', type: 'separator' },
		];

		const props: SplitButtonProps = {
			children: 'Save',
			menuItems,
		};

		const result = normalizeSplitButtonProps(props);

		expect(result.children).toBe('Save');
		expect(result.menuItems).toBe(menuItems);
		expect(result.menuItems).toHaveLength(2);
	});

	it('should extract button props correctly', () => {
		const props = {
			children: 'Save',
			menuItems: [],
			'data-testid': 'split-button',
			'aria-label': 'Save button',
			id: 'my-button',
		} as SplitButtonProps & { 'data-testid'?: string; 'aria-label'?: string };

		const result = normalizeSplitButtonProps(props);

		expect(result.buttonProps).toEqual({
			'data-testid': 'split-button',
			'aria-label': 'Save button',
			id: 'my-button',
		});
	});

	it('should not include SplitButton-specific props in buttonProps', () => {
		const props = {
			children: 'Save',
			variant: 'primary',
			size: 'md',
			isLoading: false,
			disabled: false,
			onClick: () => {},
			menuItems: [],
			onMenuItemSelect: () => {},
			menuAlign: 'end',
			dropdownAriaLabel: 'More options',
			className: 'custom',
			type: 'button',
			'data-testid': 'test',
		} as SplitButtonProps & { 'data-testid'?: string };

		const result = normalizeSplitButtonProps(props);

		expect(result.buttonProps).not.toHaveProperty('variant');
		expect(result.buttonProps).not.toHaveProperty('size');
		expect(result.buttonProps).not.toHaveProperty('isLoading');
		expect(result.buttonProps).not.toHaveProperty('disabled');
		expect(result.buttonProps).not.toHaveProperty('onClick');
		expect(result.buttonProps).not.toHaveProperty('menuItems');
		expect(result.buttonProps).not.toHaveProperty('onMenuItemSelect');
		expect(result.buttonProps).not.toHaveProperty('menuAlign');
		expect(result.buttonProps).not.toHaveProperty('dropdownAriaLabel');
		expect(result.buttonProps).not.toHaveProperty('className');
		expect(result.buttonProps).not.toHaveProperty('children');
		expect(result.buttonProps).not.toHaveProperty('type');
		expect(result.buttonProps).toHaveProperty('data-testid');
	});

	it('should handle empty buttonProps', () => {
		const props: SplitButtonProps = {
			children: 'Save',
			menuItems: [],
		};

		const result = normalizeSplitButtonProps(props);

		expect(result.buttonProps).toEqual({});
	});

	it('should handle all default props correctly', () => {
		const props: SplitButtonProps = {
			children: 'Save',
			menuItems: [],
		};

		const result = normalizeSplitButtonProps(props);

		expect(result.variant).toBe('primary');
		expect(result.size).toBe('md');
		expect(result.isLoading).toBe(false);
		expect(result.menuAlign).toBe('end');
		expect(result.type).toBe('button');
		expect(typeof result.dropdownAriaLabel).toBe('string');
		expect(result.dropdownAriaLabel.length).toBeGreaterThan(0);
	});
});
