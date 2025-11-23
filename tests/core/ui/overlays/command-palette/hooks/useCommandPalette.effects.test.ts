/**
 * useCommandPaletteEffects Tests
 *
 * Tests for effects hook:
 * - Calls focus management
 * - Calls scroll management
 */

import { useCommandPaletteEffects } from '@core/ui/overlays/command-palette/hooks/useCommandPalette.effects';
import { useFocusManagement } from '@core/ui/overlays/command-palette/hooks/useCommandPalette.focus';
import { useScrollToHighlighted } from '@core/ui/overlays/command-palette/hooks/useCommandPalette.scroll';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock the hooks
vi.mock('@core/ui/overlays/command-palette/hooks/useCommandPalette.focus', () => ({
	useFocusManagement: vi.fn(),
}));

vi.mock('@core/ui/overlays/command-palette/hooks/useCommandPalette.scroll', () => ({
	useScrollToHighlighted: vi.fn(),
}));

describe('useCommandPaletteEffects', () => {
	it('should be a function', () => {
		expect(typeof useCommandPaletteEffects).toBe('function');
	});

	it('calls useFocusManagement with correct params', () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const commandsListRef = createRef<HTMLDivElement>();

		renderHook(() =>
			useCommandPaletteEffects({
				isOpen: true,
				searchInputRef,
				highlightedIndex: 0,
				commandsListRef,
			})
		);

		expect(useFocusManagement).toHaveBeenCalledWith(true, searchInputRef);
	});

	it('calls useScrollToHighlighted with correct params', () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const commandsListRef = createRef<HTMLDivElement>();

		renderHook(() =>
			useCommandPaletteEffects({
				isOpen: true,
				searchInputRef,
				highlightedIndex: 2,
				commandsListRef,
			})
		);

		expect(useScrollToHighlighted).toHaveBeenCalledWith(2, commandsListRef);
	});

	it('updates effects when params change', () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const commandsListRef = createRef<HTMLDivElement>();

		const { rerender } = renderHook(
			({ isOpen, highlightedIndex }) =>
				useCommandPaletteEffects({
					isOpen,
					searchInputRef,
					highlightedIndex,
					commandsListRef,
				}),
			{ initialProps: { isOpen: false, highlightedIndex: 0 } }
		);

		expect(useFocusManagement).toHaveBeenCalledWith(false, searchInputRef);

		rerender({ isOpen: true, highlightedIndex: 1 });

		expect(useFocusManagement).toHaveBeenCalledWith(true, searchInputRef);
		expect(useScrollToHighlighted).toHaveBeenCalledWith(1, commandsListRef);
	});
});
