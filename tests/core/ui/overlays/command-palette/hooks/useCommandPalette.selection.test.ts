/**
 * useCommandSelection Tests
 *
 * Tests for command selection hook:
 * - Selects enabled commands
 * - Skips disabled commands
 * - Calls onSelect callback
 * - Calls onClose after selection
 * - Handles async onSelect
 */

import { useCommandSelection } from '@core/ui/overlays/command-palette/hooks/useCommandPalette.selection';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useCommandSelection', () => {
	it('should be a function', () => {
		expect(typeof useCommandSelection).toBe('function');
	});

	it('returns a function', () => {
		const onClose = vi.fn();
		const { result } = renderHook(() => useCommandSelection(undefined, onClose));

		expect(typeof result.current).toBe('function');
	});

	it('calls command onSelect when provided', async () => {
		const onClose = vi.fn();
		const commandOnSelect = vi.fn().mockResolvedValue(undefined);
		const command: CommandPaletteCommand = {
			id: '1',
			label: 'Test',
			onSelect: commandOnSelect,
		};

		const { result } = renderHook(() => useCommandSelection(undefined, onClose));

		await act(async () => {
			await result.current(command);
		});

		expect(commandOnSelect).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalled();
	});

	it('calls onSelect callback when provided', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn();
		const command: CommandPaletteCommand = {
			id: '1',
			label: 'Test',
		};

		const { result } = renderHook(() => useCommandSelection(onSelect, onClose));

		await act(async () => {
			await result.current(command);
		});

		expect(onSelect).toHaveBeenCalledWith(command);
		expect(onClose).toHaveBeenCalled();
	});

	it('calls onClose after selection', async () => {
		const onClose = vi.fn();
		const command: CommandPaletteCommand = {
			id: '1',
			label: 'Test',
		};

		const { result } = renderHook(() => useCommandSelection(undefined, onClose));

		await act(async () => {
			await result.current(command);
		});

		expect(onClose).toHaveBeenCalled();
	});

	it('skips disabled commands', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn();
		const commandOnSelect = vi.fn();
		const command: CommandPaletteCommand = {
			id: '1',
			label: 'Test',
			disabled: true,
			onSelect: commandOnSelect,
		};

		const { result } = renderHook(() => useCommandSelection(onSelect, onClose));

		await act(async () => {
			await result.current(command);
		});

		expect(commandOnSelect).not.toHaveBeenCalled();
		expect(onSelect).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});

	it('handles async command onSelect', async () => {
		const onClose = vi.fn();
		const commandOnSelect = vi.fn().mockResolvedValue(undefined);
		const command: CommandPaletteCommand = {
			id: '1',
			label: 'Test',
			onSelect: commandOnSelect,
		};

		const { result } = renderHook(() => useCommandSelection(undefined, onClose));

		await act(async () => {
			await result.current(command);
		});

		expect(commandOnSelect).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalled();
	});

	it('handles command onSelect errors gracefully', async () => {
		const onClose = vi.fn();
		const commandOnSelect = vi.fn().mockRejectedValue(new Error('Test error'));
		const command: CommandPaletteCommand = {
			id: '1',
			label: 'Test',
			onSelect: commandOnSelect,
		};

		const { result } = renderHook(() => useCommandSelection(undefined, onClose));

		await act(async () => {
			try {
				await result.current(command);
			} catch {
				// Error is expected and should be caught by caller
			}
		});

		expect(commandOnSelect).toHaveBeenCalled();
		// onClose is not called when error occurs before it
		expect(onClose).not.toHaveBeenCalled();
	});

	it('calls both command onSelect and onSelect callback', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn();
		const commandOnSelect = vi.fn().mockResolvedValue(undefined);
		const command: CommandPaletteCommand = {
			id: '1',
			label: 'Test',
			onSelect: commandOnSelect,
		};

		const { result } = renderHook(() => useCommandSelection(onSelect, onClose));

		await act(async () => {
			await result.current(command);
		});

		expect(commandOnSelect).toHaveBeenCalled();
		expect(onSelect).toHaveBeenCalledWith(command);
		expect(onClose).toHaveBeenCalled();
	});
});
