/**
 * useCommandPaletteHandlers Tests
 *
 * Tests for event handlers:
 * - useKeyboardNavigation
 * - useCommandPaletteHandlers
 * - Keyboard event handling
 * - Mouse event handling
 */

import {
	useCommandPaletteHandlers,
	useKeyboardNavigation,
} from '@core/ui/overlays/command-palette/hooks/useCommandPalette.handlers';
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

const createKeyboardEvent = (key: string): KeyboardEvent<HTMLDivElement> => {
	return {
		key,
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
		target: document.createElement('div'),
		currentTarget: document.createElement('div'),
	} as unknown as KeyboardEvent<HTMLDivElement>;
};

const createMouseEvent = (
	target: HTMLElement,
	currentTarget: HTMLElement
): MouseEvent<HTMLDivElement> => {
	return {
		target,
		currentTarget,
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
	} as unknown as MouseEvent<HTMLDivElement>;
};

describe('useKeyboardNavigation', () => {
	it('should be a function', () => {
		expect(typeof useKeyboardNavigation).toBe('function');
	});

	it('returns a function', () => {
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose: vi.fn(),
				closeOnEscape: true,
			})
		);

		expect(typeof result.current).toBe('function');
	});

	it('handles Escape key when closeOnEscape is true', () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose,
				closeOnEscape: true,
			})
		);

		const event = createKeyboardEvent('Escape');

		act(() => {
			result.current(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalled();
	});

	it('does not handle Escape key when closeOnEscape is false', () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose,
				closeOnEscape: false,
			})
		);

		const event = createKeyboardEvent('Escape');

		act(() => {
			result.current(event);
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('handles ArrowDown key', () => {
		const setHighlightedIndex = vi.fn();
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex,
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose: vi.fn(),
				closeOnEscape: true,
			})
		);

		const event = createKeyboardEvent('ArrowDown');

		act(() => {
			result.current(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('handles ArrowUp key', () => {
		const setHighlightedIndex = vi.fn();
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 1,
				setHighlightedIndex,
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose: vi.fn(),
				closeOnEscape: true,
			})
		);

		const event = createKeyboardEvent('ArrowUp');

		act(() => {
			result.current(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('handles Enter key', async () => {
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect,
				onClose: vi.fn(),
				closeOnEscape: true,
			})
		);

		const event = createKeyboardEvent('Enter');

		await act(async () => {
			result.current(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(handleSelect).toHaveBeenCalledWith(commands[0]);
	});

	it('handles Space key', async () => {
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect,
				onClose: vi.fn(),
				closeOnEscape: true,
			})
		);

		const event = createKeyboardEvent(' ');

		await act(async () => {
			result.current(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(handleSelect).toHaveBeenCalledWith(commands[0]);
	});

	it('handles Home key', () => {
		const setHighlightedIndex = vi.fn();
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 1,
				setHighlightedIndex,
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose: vi.fn(),
				closeOnEscape: true,
			})
		);

		const event = createKeyboardEvent('Home');

		act(() => {
			result.current(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('handles End key', () => {
		const setHighlightedIndex = vi.fn();
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const { result } = renderHook(() =>
			useKeyboardNavigation({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex,
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose: vi.fn(),
				closeOnEscape: true,
			})
		);

		const event = createKeyboardEvent('End');

		act(() => {
			result.current(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});
});

describe('useCommandPaletteHandlers', () => {
	it('should be a function', () => {
		expect(typeof useCommandPaletteHandlers).toBe('function');
	});

	it('returns handleKeyDown and handleOverlayClick', () => {
		const commands = [createCommand('1', 'Command 1')];
		const { result } = renderHook(() =>
			useCommandPaletteHandlers({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose: vi.fn(),
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		expect(result.current).toHaveProperty('handleKeyDown');
		expect(result.current).toHaveProperty('handleOverlayClick');
		expect(typeof result.current.handleKeyDown).toBe('function');
		expect(typeof result.current.handleOverlayClick).toBe('function');
	});

	it('handleOverlayClick closes when clicking overlay and closeOnOverlayClick is true', () => {
		const onClose = vi.fn();
		const commands = [createCommand('1', 'Command 1')];
		const overlay = document.createElement('div');
		const { result } = renderHook(() =>
			useCommandPaletteHandlers({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		const event = createMouseEvent(overlay, overlay);

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
			useCommandPaletteHandlers({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: true,
			})
		);

		const event = createMouseEvent(content, overlay);

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
			useCommandPaletteHandlers({
				filteredCommands: commands,
				highlightedIndex: 0,
				setHighlightedIndex: vi.fn(),
				handleSelect: vi.fn().mockResolvedValue(undefined),
				onClose,
				closeOnEscape: true,
				closeOnOverlayClick: false,
			})
		);

		const event = createMouseEvent(overlay, overlay);

		act(() => {
			result.current.handleOverlayClick(event);
		});

		expect(onClose).not.toHaveBeenCalled();
	});
});
