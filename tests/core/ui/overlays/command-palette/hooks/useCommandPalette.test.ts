/**
 * useCommandPalette Tests
 *
 * Tests for the main useCommandPalette hook:
 * - Initial state
 * - Search functionality
 * - Command filtering
 * - Highlighting
 * - Selection
 * - Keyboard navigation
 * - Event handlers
 */

import { useCommandPalette } from '@core/ui/overlays/command-palette/hooks/useCommandPalette';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createCommand = (
	id: string,
	label: string,
	options?: Partial<CommandPaletteCommand>
): CommandPaletteCommand => ({
	id,
	label,
	...options,
});

describe('useCommandPalette - Initial State', () => {
	it('should be a function', () => {
		expect(typeof useCommandPalette).toBe('function');
	});

	it('returns all expected properties', () => {
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

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

	it('initializes with empty search query', () => {
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		expect(result.current.searchQuery).toBe('');
	});

	it('initializes with all commands when search is empty', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		expect(result.current.filteredCommands).toEqual(commands);
	});

	it('highlights first enabled command', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		expect(result.current.highlightedIndex).toBe(0);
	});
});

describe('useCommandPalette - Search', () => {
	it('allows setting search query', () => {
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		act(() => {
			result.current.setSearchQuery('test');
		});

		expect(result.current.searchQuery).toBe('test');
	});

	it('filters commands based on search query', () => {
		const commands = [createCommand('1', 'Apple'), createCommand('2', 'Banana')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		act(() => {
			result.current.setSearchQuery('apple');
		});

		expect(result.current.filteredCommands).toHaveLength(1);
		expect(result.current.filteredCommands[0]?.id).toBe('1');
	});

	it('resets search query when palette opens', () => {
		const commands = [createCommand('1', 'Command 1')];
		const { result, rerender } = renderHook(
			({ isOpen }) =>
				useCommandPalette({
					commands,
					isOpen,
					onClose: vi.fn(),
					closeOnEscape: true,
					closeOnOverlayClick: true,
				}),
			{ initialProps: { isOpen: false } }
		);

		act(() => {
			result.current.setSearchQuery('test');
		});

		rerender({ isOpen: true });

		expect(result.current.searchQuery).toBe('');
	});
});

describe('useCommandPalette - Highlighting', () => {
	it('allows setting highlighted index', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		act(() => {
			result.current.setHighlightedIndex(1);
		});

		expect(result.current.highlightedIndex).toBe(1);
	});

	it('resets highlighted index when palette opens', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result, rerender } = renderHook(
			({ isOpen }) =>
				useCommandPalette({
					commands,
					isOpen,
					onClose: vi.fn(),
					closeOnEscape: true,
					closeOnOverlayClick: true,
				}),
			{ initialProps: { isOpen: false } }
		);

		act(() => {
			result.current.setHighlightedIndex(1);
		});

		rerender({ isOpen: true });

		expect(result.current.highlightedIndex).toBe(0);
	});

	it('updates highlighted index when filtered commands change', () => {
		const commands = [createCommand('1', 'Apple'), createCommand('2', 'Banana')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		act(() => {
			result.current.setSearchQuery('banana');
		});

		expect(result.current.highlightedIndex).toBe(0);
		expect(result.current.filteredCommands[0]?.id).toBe('2');
	});
});

describe('useCommandPalette - Selection', () => {
	it('calls onSelect callback when command is selected', async () => {
		const onSelect = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
				onSelect,
			})
		);

		await act(async () => {
			await result.current.handleSelect(commands[0]!);
		});

		expect(onSelect).toHaveBeenCalledWith(commands[0]);
	});

	it('calls command onSelect when provided', async () => {
		const commandOnSelect = vi.fn().mockResolvedValue(undefined);
		const commands = [createCommand('1', 'Command 1', { onSelect: commandOnSelect })];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		await act(async () => {
			await result.current.handleSelect(commands[0]!);
		});

		expect(commandOnSelect).toHaveBeenCalled();
	});

	it('calls onClose after selection', async () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		await act(async () => {
			await result.current.handleSelect(commands[0]!);
		});

		expect(onClose).toHaveBeenCalled();
	});

	it('skips disabled commands', async () => {
		const onSelect = vi.fn();
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1', { disabled: true })];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: true,
				onSelect,
			})
		);

		await act(async () => {
			await result.current.handleSelect(commands[0]!);
		});

		expect(onSelect).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('useCommandPalette - Keyboard Navigation', () => {
	it('handles ArrowDown key', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(result.current.highlightedIndex).toBe(1);
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('handles ArrowUp key', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		act(() => {
			result.current.setHighlightedIndex(1);
		});

		const event = {
			key: 'ArrowUp',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(result.current.highlightedIndex).toBe(0);
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('handles Enter key', async () => {
		const onSelect = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
				onSelect,
			})
		);

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLDivElement>;

		await act(async () => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onSelect).toHaveBeenCalledWith(commands[0]);
	});

	it('handles Escape key when closeOnEscape is true', () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalled();
	});

	it('does not handle Escape key when closeOnEscape is false', () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose,
				closeOnEscape: false,
				closeOnOverlayClick: true,
			})
		);

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('handles Home key', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		act(() => {
			result.current.setHighlightedIndex(1);
		});

		const event = {
			key: 'Home',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(result.current.highlightedIndex).toBe(0);
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('handles End key', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		const event = {
			key: 'End',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLDivElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(result.current.highlightedIndex).toBe(1);
		expect(event.preventDefault).toHaveBeenCalled();
	});
});

describe('useCommandPalette - Mouse Events', () => {
	it('handleOverlayClick closes when clicking overlay and closeOnOverlayClick is true', () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const overlay = document.createElement('div');
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		const event = {
			target: overlay,
			currentTarget: overlay,
		} as unknown as MouseEvent<HTMLDivElement>;

		act(() => {
			result.current.handleOverlayClick(event);
		});

		expect(onClose).toHaveBeenCalled();
	});

	it('handleOverlayClick does not close when clicking content', () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const overlay = document.createElement('div');
		const content = document.createElement('div');
		overlay.append(content);
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		const event = {
			target: content,
			currentTarget: overlay,
		} as unknown as MouseEvent<HTMLDivElement>;

		act(() => {
			result.current.handleOverlayClick(event);
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('handleOverlayClick does not close when closeOnOverlayClick is false', () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const overlay = document.createElement('div');
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: false,
			})
		);

		const event = {
			target: overlay,
			currentTarget: overlay,
		} as unknown as MouseEvent<HTMLDivElement>;

		act(() => {
			result.current.handleOverlayClick(event);
		});

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('useCommandPalette - Refs', () => {
	it('returns searchInputRef and commandsListRef', () => {
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPalette({
				commands,
				isOpen: true,
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		expect(result.current.searchInputRef).toBeDefined();
		expect(result.current.commandsListRef).toBeDefined();
		expect(result.current.searchInputRef.current).toBeNull();
		expect(result.current.commandsListRef.current).toBeNull();
	});
});
