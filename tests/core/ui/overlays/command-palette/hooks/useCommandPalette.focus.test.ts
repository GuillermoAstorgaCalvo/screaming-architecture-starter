/**
 * useFocusManagement Tests
 *
 * Tests for focus management hook:
 * - Focuses input when palette opens
 * - Does not focus when closed
 * - Handles missing ref gracefully
 */

import { useFocusManagement } from '@core/ui/overlays/command-palette/hooks/useCommandPalette.focus';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useFocusManagement', () => {
	it('should be a function', () => {
		expect(typeof useFocusManagement).toBe('function');
	});

	it('focuses input when palette opens', async () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const mockFocus = vi.fn();
		const mockElement = {
			focus: mockFocus,
		} as unknown as HTMLInputElement;

		searchInputRef.current = mockElement;

		renderHook(() => useFocusManagement(true, searchInputRef));

		await waitFor(() => {
			expect(mockFocus).toHaveBeenCalled();
		});
	});

	it('does not focus when palette is closed', async () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const mockFocus = vi.fn();
		const mockElement = {
			focus: mockFocus,
		} as unknown as HTMLInputElement;

		searchInputRef.current = mockElement;

		renderHook(() => useFocusManagement(false, searchInputRef));

		await act(async () => {
			await new Promise(resolve => setTimeout(resolve, 20));
		});

		expect(mockFocus).not.toHaveBeenCalled();
	});

	it('handles missing ref gracefully', () => {
		const searchInputRef = createRef<HTMLInputElement>();

		expect(() => {
			renderHook(() => useFocusManagement(true, searchInputRef));
		}).not.toThrow();
	});

	it('refocuses when palette reopens', async () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const mockFocus = vi.fn();
		const mockElement = {
			focus: mockFocus,
		} as unknown as HTMLInputElement;

		searchInputRef.current = mockElement;

		const { rerender } = renderHook(({ isOpen }) => useFocusManagement(isOpen, searchInputRef), {
			initialProps: { isOpen: false },
		});

		mockFocus.mockClear();

		rerender({ isOpen: true });

		await waitFor(() => {
			expect(mockFocus).toHaveBeenCalled();
		});
	});
});
