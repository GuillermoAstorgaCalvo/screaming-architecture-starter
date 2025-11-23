/**
 * useCommandPalette.keyboard Tests
 *
 * Tests for keyboard navigation handlers:
 * - handleEscapeKey
 * - handleNavigationKey (ArrowDown, ArrowUp)
 * - handleSelectionKey (Enter, Space)
 * - handleHomeEndKey (Home, End)
 */

import {
	handleEscapeKey,
	handleHomeEndKey,
	handleNavigationKey,
	handleSelectionKey,
	type KeyboardNavigationParams,
} from '@core/ui/overlays/command-palette/hooks/useCommandPalette.keyboard';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import type { KeyboardEvent } from 'react';
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
	} as unknown as KeyboardEvent<HTMLDivElement>;
};

const createParams = (
	commands: CommandPaletteCommand[],
	highlightedIndex: number = 0
): KeyboardNavigationParams => ({
	filteredCommands: commands,
	highlightedIndex,
	setHighlightedIndex: vi.fn(),
	handleSelect: vi.fn().mockResolvedValue(undefined),
	onClose: vi.fn(),
	closeOnEscape: true,
});

describe('handleEscapeKey', () => {
	it('should be a function', () => {
		expect(typeof handleEscapeKey).toBe('function');
	});

	it('prevents default and calls onClose', () => {
		const onClose = vi.fn();
		const event = createKeyboardEvent('Escape');

		handleEscapeKey(event, onClose);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalled();
	});
});

describe('handleNavigationKey', () => {
	it('should be a function', () => {
		expect(typeof handleNavigationKey).toBe('function');
	});

	it('handles ArrowDown key', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent('ArrowDown');

		const result = handleNavigationKey(event, params);

		expect(result).toBe(true);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('handles ArrowUp key', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const params = createParams(commands, 1);
		const event = createKeyboardEvent('ArrowUp');

		const result = handleNavigationKey(event, params);

		expect(result).toBe(true);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('skips disabled commands when navigating down', () => {
		const commands = [
			createCommand('1', 'Command 1'),
			createCommand('2', 'Command 2', { disabled: true }),
			createCommand('3', 'Command 3'),
		];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent('ArrowDown');

		const result = handleNavigationKey(event, params);

		expect(result).toBe(true);
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(2);
	});

	it('skips disabled commands when navigating up', () => {
		const commands = [
			createCommand('1', 'Command 1'),
			createCommand('2', 'Command 2', { disabled: true }),
			createCommand('3', 'Command 3'),
		];
		const params = createParams(commands, 2);
		const event = createKeyboardEvent('ArrowUp');

		const result = handleNavigationKey(event, params);

		expect(result).toBe(true);
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('wraps around when navigating down from last item', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const params = createParams(commands, 1);
		const event = createKeyboardEvent('ArrowDown');

		const result = handleNavigationKey(event, params);

		expect(result).toBe(true);
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('wraps around when navigating up from first item', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent('ArrowUp');

		const result = handleNavigationKey(event, params);

		expect(result).toBe(true);
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('returns false for non-navigation keys', () => {
		const commands = [createCommand('1', 'Command 1')];
		const params = createParams(commands);
		const event = createKeyboardEvent('Enter');

		const result = handleNavigationKey(event, params);

		expect(result).toBe(false);
		expect(params.setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('handles empty commands array', () => {
		const params = createParams([], -1);
		const event = createKeyboardEvent('ArrowDown');

		const result = handleNavigationKey(event, params);

		expect(result).toBe(true);
		expect(params.setHighlightedIndex).not.toHaveBeenCalled();
	});
});

describe('handleSelectionKey', () => {
	it('should be a function', () => {
		expect(typeof handleSelectionKey).toBe('function');
	});

	it('handles Enter key', async () => {
		const commands = [createCommand('1', 'Command 1')];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent('Enter');

		const result = handleSelectionKey(event, params);

		expect(result).toBe(true);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(params.handleSelect).toHaveBeenCalledWith(commands[0]);
	});

	it('handles Space key', async () => {
		const commands = [createCommand('1', 'Command 1')];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent(' ');

		const result = handleSelectionKey(event, params);

		expect(result).toBe(true);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(params.handleSelect).toHaveBeenCalledWith(commands[0]);
	});

	it('does not select when highlighted index is invalid', () => {
		const commands = [createCommand('1', 'Command 1')];
		const params = createParams(commands, -1);
		const event = createKeyboardEvent('Enter');

		const result = handleSelectionKey(event, params);

		expect(result).toBe(true);
		expect(params.handleSelect).not.toHaveBeenCalled();
	});

	it('returns false for non-selection keys', () => {
		const commands = [createCommand('1', 'Command 1')];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent('ArrowDown');

		const result = handleSelectionKey(event, params);

		expect(result).toBe(false);
		expect(params.handleSelect).not.toHaveBeenCalled();
	});
});

describe('handleHomeEndKey', () => {
	it('should be a function', () => {
		expect(typeof handleHomeEndKey).toBe('function');
	});

	it('handles Home key', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const params = createParams(commands, 1);
		const event = createKeyboardEvent('Home');

		const result = handleHomeEndKey(event, params);

		expect(result).toBe(true);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('handles End key', () => {
		const commands = [createCommand('1', 'Command 1'), createCommand('2', 'Command 2')];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent('End');

		const result = handleHomeEndKey(event, params);

		expect(result).toBe(true);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('skips disabled commands when using Home', () => {
		const commands = [
			createCommand('1', 'Command 1', { disabled: true }),
			createCommand('2', 'Command 2'),
		];
		const params = createParams(commands, 1);
		const event = createKeyboardEvent('Home');

		const result = handleHomeEndKey(event, params);

		expect(result).toBe(true);
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('skips disabled commands when using End', () => {
		const commands = [
			createCommand('1', 'Command 1'),
			createCommand('2', 'Command 2', { disabled: true }),
		];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent('End');

		const result = handleHomeEndKey(event, params);

		expect(result).toBe(true);
		expect(params.setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('returns false for non-home-end keys', () => {
		const commands = [createCommand('1', 'Command 1')];
		const params = createParams(commands, 0);
		const event = createKeyboardEvent('ArrowDown');

		const result = handleHomeEndKey(event, params);

		expect(result).toBe(false);
		expect(params.setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('handles empty commands array', () => {
		const params = createParams([], -1);
		const event = createKeyboardEvent('Home');

		const result = handleHomeEndKey(event, params);

		expect(result).toBe(true);
		expect(params.setHighlightedIndex).not.toHaveBeenCalled();
	});
});
