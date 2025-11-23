/**
 * useCommandPaletteRefs Tests
 *
 * Tests for refs management hook:
 * - Returns correct refs
 * - Refs are properly initialized
 */

import { useCommandPaletteRefs } from '@core/ui/overlays/command-palette/hooks/useCommandPalette.refs';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useCommandPaletteRefs', () => {
	it('should be a function', () => {
		expect(typeof useCommandPaletteRefs).toBe('function');
	});

	it('returns searchInputRef and commandsListRef', () => {
		const { result } = renderHook(() => useCommandPaletteRefs());

		expect(result.current).toHaveProperty('searchInputRef');
		expect(result.current).toHaveProperty('commandsListRef');
	});

	it('initializes refs with null', () => {
		const { result } = renderHook(() => useCommandPaletteRefs());

		expect(result.current.searchInputRef.current).toBeNull();
		expect(result.current.commandsListRef.current).toBeNull();
	});

	it('returns stable refs across re-renders', () => {
		const { result, rerender } = renderHook(() => useCommandPaletteRefs());

		const firstSearchRef = result.current.searchInputRef;
		const firstCommandsRef = result.current.commandsListRef;

		rerender();

		expect(result.current.searchInputRef).toBe(firstSearchRef);
		expect(result.current.commandsListRef).toBe(firstCommandsRef);
	});
});
