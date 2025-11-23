/**
 * useToggleGroupContext Tests
 *
 * Tests for the useToggleGroupContext hook including:
 * - Context consumption
 * - Error handling when used outside ToggleGroup
 * - Return value structure
 */

import { ToggleGroupContext } from '@core/ui/forms/toggle/components/ToggleGroupContext';
import { useToggleGroupContext } from '@core/ui/forms/toggle/hooks/useToggleGroupContext';
import type { ToggleGroupContextValue } from '@core/ui/forms/toggle/types/ToggleGroupTypes';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockContextValue = (): ToggleGroupContextValue => ({
	type: 'single',
	selectedValues: [],
	handleToggle: vi.fn(),
	variant: 'default',
	size: 'md',
	groupDisabled: false,
});

const createWrapper = (mockValue: ToggleGroupContextValue) => {
	const Wrapper = ({ children }: { children: React.ReactNode }) =>
		React.createElement(ToggleGroupContext.Provider, { value: mockValue }, children);
	Wrapper.displayName = 'ToggleGroupContextWrapper';
	return Wrapper;
};

const renderHookWithContext = (mockValue: ToggleGroupContextValue) => {
	const wrapper = createWrapper(mockValue);
	return renderHook(() => useToggleGroupContext(), { wrapper });
};

describe('useToggleGroupContext', () => {
	it('should be a function', () => {
		expect(typeof useToggleGroupContext).toBe('function');
	});

	it('throws error when used outside ToggleGroup', () => {
		expect(() => {
			renderHook(() => useToggleGroupContext());
		}).toThrow('Toggle must be used within a ToggleGroup');
	});

	describe('when used inside ToggleGroup', () => {
		it('returns context value', () => {
			const mockValue = createMockContextValue();
			const { result } = renderHookWithContext(mockValue);

			expect(result.current).toBe(mockValue);
			expect(result.current.type).toBe('single');
			expect(result.current.selectedValues).toEqual([]);
			expect(result.current.handleToggle).toBeDefined();
			expect(result.current.variant).toBe('default');
			expect(result.current.size).toBe('md');
			expect(result.current.groupDisabled).toBe(false);
		});

		it('returns all required properties', () => {
			const mockValue = createMockContextValue();
			const { result } = renderHookWithContext(mockValue);

			expect(result.current).toHaveProperty('type');
			expect(result.current).toHaveProperty('selectedValues');
			expect(result.current).toHaveProperty('handleToggle');
			expect(result.current).toHaveProperty('variant');
			expect(result.current).toHaveProperty('size');
			expect(result.current).toHaveProperty('groupDisabled');
		});

		it('returns correct values for multiple type', () => {
			const mockValue: ToggleGroupContextValue = {
				type: 'multiple',
				selectedValues: ['a', 'b'],
				handleToggle: vi.fn(),
				variant: 'outline',
				size: 'lg',
				groupDisabled: false,
			};
			const { result } = renderHookWithContext(mockValue);

			expect(result.current.type).toBe('multiple');
			expect(result.current.selectedValues).toEqual(['a', 'b']);
			expect(result.current.variant).toBe('outline');
			expect(result.current.size).toBe('lg');
		});

		it('returns correct values when group is disabled', () => {
			const mockValue: ToggleGroupContextValue = {
				type: 'single',
				selectedValues: ['a'],
				handleToggle: vi.fn(),
				variant: 'default',
				size: 'md',
				groupDisabled: true,
			};
			const { result } = renderHookWithContext(mockValue);

			expect(result.current.groupDisabled).toBe(true);
		});
	});
});
