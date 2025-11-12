import type { CommandPaletteCommand } from './CommandPalette';

/**
 * Normalizes a string for search comparison
 */
function normalizeString(str: string): string {
	return str.toLowerCase().trim();
}

/**
 * Checks if a command matches the search query
 */
function matchesSearch(command: CommandPaletteCommand, query: string): boolean {
	const normalizedQuery = normalizeString(query);
	const normalizedLabel = normalizeString(command.label);
	const normalizedDescription = command.description ? normalizeString(command.description) : '';
	const normalizedKeywords =
		command.keywords?.map(keyword => normalizeString(keyword)).join(' ') ?? '';

	return (
		normalizedLabel.includes(normalizedQuery) ||
		normalizedDescription.includes(normalizedQuery) ||
		normalizedKeywords.includes(normalizedQuery)
	);
}

/**
 * Filters commands based on search query
 */
export function filterCommands(
	commands: CommandPaletteCommand[],
	searchQuery: string
): CommandPaletteCommand[] {
	if (!searchQuery.trim()) {
		return commands;
	}

	return commands.filter(command => matchesSearch(command, searchQuery));
}

/**
 * Finds the next enabled command index in the given direction
 */
export function findNextEnabledIndex(
	commands: CommandPaletteCommand[],
	startIndex: number,
	direction: 1 | -1
): number {
	let index = startIndex;
	const total = commands.length;

	if (total === 0) {
		return -1;
	}

	for (let i = 0; i < total; i += 1) {
		index = (index + direction + total) % total;
		if (!commands[index]?.disabled) {
			return index;
		}
	}

	return -1;
}

/**
 * Groups commands by their group property
 */
export function groupCommands(
	commands: CommandPaletteCommand[]
): Map<string, CommandPaletteCommand[]> {
	const groups = new Map<string, CommandPaletteCommand[]>();

	for (const command of commands) {
		const groupKey = command.group ?? 'Other';
		const groupItems = groups.get(groupKey) ?? [];
		groupItems.push(command);
		groups.set(groupKey, groupItems);
	}

	return groups;
}
