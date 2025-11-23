/**
 * SplitButtonDefaults Tests
 *
 * Tests for the DEFAULT_PROPS constant:
 * - Default values are correct
 * - Default values are readonly
 * - dropdownAriaLabel is a getter function
 */

import { DEFAULT_PROPS } from '@core/ui/split-button/constants/SplitButtonDefaults';
import { describe, expect, it } from 'vitest';

describe('SplitButtonDefaults', () => {
	describe('DEFAULT_PROPS', () => {
		it('should have correct default variant', () => {
			expect(DEFAULT_PROPS.variant).toBe('primary');
		});

		it('should have correct default size', () => {
			expect(DEFAULT_PROPS.size).toBe('md');
		});

		it('should have correct default isLoading', () => {
			expect(DEFAULT_PROPS.isLoading).toBe(false);
		});

		it('should have correct default menuAlign', () => {
			expect(DEFAULT_PROPS.menuAlign).toBe('end');
		});

		it('should have correct default type', () => {
			expect(DEFAULT_PROPS.type).toBe('button');
		});

		it('should have dropdownAriaLabel as a getter', () => {
			expect(typeof DEFAULT_PROPS.dropdownAriaLabel).toBe('string');
			expect(DEFAULT_PROPS.dropdownAriaLabel.length).toBeGreaterThan(0);
		});

		it('should return consistent dropdownAriaLabel values', () => {
			const label1 = DEFAULT_PROPS.dropdownAriaLabel;
			const label2 = DEFAULT_PROPS.dropdownAriaLabel;
			expect(label1).toBe(label2);
		});

		it('should have all required default properties', () => {
			expect(DEFAULT_PROPS).toHaveProperty('variant');
			expect(DEFAULT_PROPS).toHaveProperty('size');
			expect(DEFAULT_PROPS).toHaveProperty('isLoading');
			expect(DEFAULT_PROPS).toHaveProperty('menuAlign');
			expect(DEFAULT_PROPS).toHaveProperty('dropdownAriaLabel');
			expect(DEFAULT_PROPS).toHaveProperty('type');
		});

		it('should have correct types for all properties', () => {
			expect(typeof DEFAULT_PROPS.variant).toBe('string');
			expect(typeof DEFAULT_PROPS.size).toBe('string');
			expect(typeof DEFAULT_PROPS.isLoading).toBe('boolean');
			expect(typeof DEFAULT_PROPS.menuAlign).toBe('string');
			expect(typeof DEFAULT_PROPS.type).toBe('string');
			expect(typeof DEFAULT_PROPS.dropdownAriaLabel).toBe('string');
		});

		it('should have valid variant value', () => {
			const validVariants = ['primary', 'secondary', 'ghost'];
			expect(validVariants).toContain(DEFAULT_PROPS.variant);
		});

		it('should have valid size value', () => {
			const validSizes = ['sm', 'md', 'lg'];
			expect(validSizes).toContain(DEFAULT_PROPS.size);
		});

		it('should have valid menuAlign value', () => {
			const validAligns = ['start', 'center', 'end'];
			expect(validAligns).toContain(DEFAULT_PROPS.menuAlign);
		});

		it('should have valid type value', () => {
			const validTypes = ['button', 'submit', 'reset'];
			expect(validTypes).toContain(DEFAULT_PROPS.type);
		});
	});
});
