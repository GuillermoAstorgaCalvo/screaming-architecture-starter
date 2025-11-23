/**
 * Tests for CommandPaletteHelpers
 *
 * Tests the helper functions used by CommandPalette:
 * - filterCommands: filtering commands by search query
 * - findNextEnabledIndex: finding next enabled command index
 * - groupCommands: grouping commands by group property
 */

import {
	filterCommands,
	findNextEnabledIndex,
	groupCommands,
} from '@core/ui/overlays/command-palette/helpers/CommandPaletteHelpers';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import { describe, expect, it } from 'vitest';

describe('CommandPaletteHelpers - filterCommands', () => {
	const createMockCommands = (): CommandPaletteCommand[] => [
		{ id: '1', label: 'New File', description: 'Create a new file' },
		{
			id: '2',
			label: 'Save File',
			description: 'Save the current file',
			keywords: ['store', 'write'],
		},
		{ id: '3', label: 'Open File', description: 'Open an existing file' },
		{ id: '4', label: 'Close Tab', keywords: ['tab', 'window'] },
	];

	it('returns all commands when search query is empty', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, '');
		expect(result).toHaveLength(commands.length);
		expect(result).toEqual(commands);
	});

	it('returns all commands when search query is only whitespace', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, '   ');
		expect(result).toHaveLength(commands.length);
		expect(result).toEqual(commands);
	});

	it('filters commands by label (case insensitive)', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'file');
		expect(result).toHaveLength(3);
		expect(result.map(c => c.id)).toEqual(['1', '2', '3']);
	});

	it('filters commands by label (partial match)', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'save');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('2');
	});

	it('filters commands by description', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'create');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('1');
	});

	it('filters commands by keywords', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'store');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('2');
	});

	it('filters commands by multiple keywords', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'tab');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('4');
	});

	it('returns empty array when no commands match', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'nonexistent');
		expect(result).toHaveLength(0);
	});

	it('handles case insensitive matching', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'FILE');
		expect(result).toHaveLength(3);
	});

	it('handles trimmed search queries', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, '  file  ');
		expect(result).toHaveLength(3);
	});

	it('handles commands without description', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'close');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('4');
	});

	it('handles commands without keywords', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'new');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('1');
	});

	it('matches partial words in label', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'fil');
		expect(result).toHaveLength(3);
	});

	it('matches partial words in description', () => {
		const commands = createMockCommands();
		const result = filterCommands(commands, 'curr');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('2');
	});

	it('handles empty commands array', () => {
		const result = filterCommands([], 'test');
		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});

	it('handles special characters in search query', () => {
		const commands: CommandPaletteCommand[] = [{ id: '1', label: 'Test@#$%' }];
		const result = filterCommands(commands, '@#$');
		expect(result).toHaveLength(1);
	});
});

describe('CommandPaletteHelpers - findNextEnabledIndex', () => {
	it('returns -1 when commands array is empty', () => {
		const result = findNextEnabledIndex([], 0, 1);
		expect(result).toBe(-1);
	});

	it('finds next enabled index (forward direction)', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2', disabled: true },
			{ id: '3', label: 'Command 3' },
		];
		const result = findNextEnabledIndex(commands, 0, 1);
		expect(result).toBe(2);
	});

	it('finds previous enabled index (backward direction)', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2', disabled: true },
			{ id: '3', label: 'Command 3' },
		];
		const result = findNextEnabledIndex(commands, 2, -1);
		expect(result).toBe(0);
	});

	it('wraps around when reaching end (forward direction)', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2' },
		];
		const result = findNextEnabledIndex(commands, 1, 1);
		expect(result).toBe(0);
	});

	it('wraps around when reaching start (backward direction)', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2' },
		];
		const result = findNextEnabledIndex(commands, 0, -1);
		expect(result).toBe(1);
	});

	it('skips disabled commands (forward direction)', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2', disabled: true },
			{ id: '3', label: 'Command 3', disabled: true },
			{ id: '4', label: 'Command 4' },
		];
		const result = findNextEnabledIndex(commands, 0, 1);
		expect(result).toBe(3);
	});

	it('skips disabled commands (backward direction)', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2', disabled: true },
			{ id: '3', label: 'Command 3', disabled: true },
			{ id: '4', label: 'Command 4' },
		];
		const result = findNextEnabledIndex(commands, 3, -1);
		expect(result).toBe(0);
	});

	it('returns -1 when all commands are disabled', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1', disabled: true },
			{ id: '2', label: 'Command 2', disabled: true },
		];
		const result = findNextEnabledIndex(commands, 0, 1);
		expect(result).toBe(-1);
	});

	it('handles single enabled command', () => {
		const commands: CommandPaletteCommand[] = [{ id: '1', label: 'Command 1' }];
		const result = findNextEnabledIndex(commands, 0, 1);
		expect(result).toBe(0);
	});

	it('handles negative start index', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2' },
		];
		const result = findNextEnabledIndex(commands, -1, 1);
		expect(result).toBe(0);
	});

	it('handles start index beyond array length', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2' },
		];
		const result = findNextEnabledIndex(commands, 10, 1);
		// When startIndex is beyond array length, it wraps using modulo: (10 + 1 + 2) % 2 = 1
		expect(result).toBe(1);
	});
});

describe('CommandPaletteHelpers - groupCommands', () => {
	it('groups commands by group property', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'New File', group: 'File' },
			{ id: '2', label: 'Save File', group: 'File' },
			{ id: '3', label: 'Cut', group: 'Edit' },
			{ id: '4', label: 'Copy', group: 'Edit' },
		];
		const result = groupCommands(commands);
		expect(result.size).toBe(2);
		expect(result.get('File')).toHaveLength(2);
		expect(result.get('Edit')).toHaveLength(2);
	});

	it('groups commands without group into "Other"', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'New File', group: 'File' },
			{ id: '2', label: 'Command Without Group' },
		];
		const result = groupCommands(commands);
		expect(result.size).toBe(2);
		expect(result.get('File')).toHaveLength(1);
		expect(result.get('Other')).toHaveLength(1);
	});

	it('handles empty commands array', () => {
		const result = groupCommands([]);
		expect(result.size).toBe(0);
	});

	it('handles all commands without group', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2' },
		];
		const result = groupCommands(commands);
		expect(result.size).toBe(1);
		expect(result.get('Other')).toHaveLength(2);
	});

	it('handles commands with undefined group', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1' },
			{ id: '2', label: 'Command 2' },
		];
		const result = groupCommands(commands);
		expect(result.size).toBe(1);
		expect(result.get('Other')).toHaveLength(2);
	});

	it('handles multiple groups', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'Command 1', group: 'Group A' },
			{ id: '2', label: 'Command 2', group: 'Group B' },
			{ id: '3', label: 'Command 3', group: 'Group C' },
		];
		const result = groupCommands(commands);
		expect(result.size).toBe(3);
		expect(result.get('Group A')).toHaveLength(1);
		expect(result.get('Group B')).toHaveLength(1);
		expect(result.get('Group C')).toHaveLength(1);
	});

	it('preserves command order within groups', () => {
		const commands: CommandPaletteCommand[] = [
			{ id: '1', label: 'First', group: 'File' },
			{ id: '2', label: 'Second', group: 'File' },
			{ id: '3', label: 'Third', group: 'File' },
		];
		const result = groupCommands(commands);
		const fileGroup = result.get('File');
		expect(fileGroup).toHaveLength(3);
		expect(fileGroup?.[0]?.id).toBe('1');
		expect(fileGroup?.[1]?.id).toBe('2');
		expect(fileGroup?.[2]?.id).toBe('3');
	});
});
