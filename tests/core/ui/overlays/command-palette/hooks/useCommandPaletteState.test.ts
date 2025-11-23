/**
 * useCommandPaletteState Tests
 *
 * Tests for the useCommandPaletteState wrapper hook:
 * - Passes props correctly to useCommandPalette
 * - Uses default values for optional props
 * - Handles all prop combinations
 */

import { useCommandPaletteState } from '@core/ui/overlays/command-palette/hooks/useCommandPaletteState';
import type { CommandPaletteProps } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createCommand = (id: string, label: string): CommandPaletteProps['commands'][number] => ({
	id,
	label,
});

describe('useCommandPaletteState', () => {
	it('should be a function', () => {
		expect(typeof useCommandPaletteState).toBe('function');
	});

	it('returns all expected properties', () => {
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: true,
			onClose: vi.fn(),
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		expect(result.current).toHaveProperty('searchQuery');
		expect(result.current).toHaveProperty('setSearchQuery');
		expect(result.current).toHaveProperty('filteredCommands');
		expect(result.current).toHaveProperty('highlightedIndex');
		expect(result.current).toHaveProperty('setHighlightedIndex');
		expect(result.current).toHaveProperty('searchInputRef');
		expect(result.current).toHaveProperty('commandsListRef');
		expect(result.current).toHaveProperty('handleKeyDown');
		expect(result.current).toHaveProperty('handleSelect');
		expect(result.current).toHaveProperty('handleOverlayClick');
	});

	it('uses default closeOnEscape value (true)', () => {
		const onClose = vi.fn();
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: true,
			onClose,
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(onClose).toHaveBeenCalled();
	});

	it('uses default closeOnOverlayClick value (true)', () => {
		const onClose = vi.fn();
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: true,
			onClose,
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		const overlay = document.createElement('div');
		const event = {
			target: overlay,
			currentTarget: overlay,
		} as unknown as React.MouseEvent<HTMLDivElement>;

		result.current.handleOverlayClick(event);

		expect(onClose).toHaveBeenCalled();
	});

	it('respects closeOnEscape prop when provided', () => {
		const onClose = vi.fn();
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: true,
			onClose,
			closeOnEscape: false,
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('respects closeOnOverlayClick prop when provided', () => {
		const onClose = vi.fn();
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: true,
			onClose,
			closeOnOverlayClick: false,
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		const overlay = document.createElement('div');
		const event = {
			target: overlay,
			currentTarget: overlay,
		} as unknown as React.MouseEvent<HTMLDivElement>;

		result.current.handleOverlayClick(event);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('passes onSelect callback when provided', async () => {
		const onSelect = vi.fn();
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: true,
			onClose: vi.fn(),
			onSelect,
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		await result.current.handleSelect(props.commands[0]!);

		expect(onSelect).toHaveBeenCalledWith(props.commands[0]);
	});

	it('handles missing onSelect callback', async () => {
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: true,
			onClose: vi.fn(),
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		await expect(result.current.handleSelect(props.commands[0]!)).resolves.not.toThrow();
	});

	it('passes commands correctly', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const props: CommandPaletteProps = {
			commands,
			isOpen: true,
			onClose: vi.fn(),
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		expect(result.current.filteredCommands).toEqual(commands);
	});

	it('passes isOpen correctly', () => {
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: false,
			onClose: vi.fn(),
		};

		const { result, rerender } = renderHook(
			({ isOpen }) =>
				useCommandPaletteState({
					...props,
					isOpen,
				}),
			{ initialProps: { isOpen: false } }
		);

		expect(result.current.searchQuery).toBe('');

		rerender({ isOpen: true });

		expect(result.current.searchQuery).toBe('');
	});

	it('passes onClose correctly', () => {
		const onClose = vi.fn();
		const props: CommandPaletteProps = {
			commands: [createCommand('1', 'Command 1')],
			isOpen: true,
			onClose,
		};

		const { result } = renderHook(() => useCommandPaletteState(props));

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLDivElement>;

		result.current.handleKeyDown(event);

		expect(onClose).toHaveBeenCalled();
	});
});
