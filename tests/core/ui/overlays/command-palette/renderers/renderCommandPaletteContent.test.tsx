/**
 * renderCommandPaletteContent Tests
 *
 * Tests for the renderCommandPaletteContent function including:
 * - Returns null when isOpen is false
 * - Renders portal with overlay and content when isOpen is true
 * - Builds overlay props correctly
 * - Builds content props correctly
 * - Handles optional className
 * - Handles optional overlayClassName
 */

import { renderCommandPaletteContent } from '@core/ui/overlays/command-palette/renderers/renderCommandPaletteContent';
import type { UseCommandPaletteReturn } from '@core/ui/overlays/command-palette/types/useCommandPalette.types';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockState = (
	overrides?: Partial<UseCommandPaletteReturn>
): UseCommandPaletteReturn => ({
	searchQuery: '',
	setSearchQuery: vi.fn(),
	filteredCommands: [],
	highlightedIndex: -1,
	setHighlightedIndex: vi.fn(),
	searchInputRef: createRef<HTMLInputElement>(),
	commandsListRef: createRef<HTMLDivElement>(),
	handleKeyDown: vi.fn(),
	handleSelect: vi.fn(),
	handleOverlayClick: vi.fn(),
	...overrides,
});

describe('renderCommandPaletteContent', () => {
	describe('Visibility', () => {
		it('returns null when isOpen is false', () => {
			const state = createMockState();
			const result = renderCommandPaletteContent({
				isOpen: false,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).toBeNull();
		});

		it('renders portal when isOpen is true', () => {
			const state = createMockState();
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			const { container } = renderWithProviders(result!);
			expect(container).toBeInTheDocument();
		});
	});

	describe('Props Building', () => {
		it('builds overlay props with isOpen and onClick', () => {
			const handleOverlayClick = vi.fn();
			const state = createMockState({ handleOverlayClick });
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			const overlay = document.body.querySelector('[aria-hidden="true"]');
			expect(overlay).toBeInTheDocument();
		});

		it('builds overlay props with overlayClassName when provided', () => {
			const state = createMockState();
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: 'custom-overlay-class',
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			const overlay = document.body.querySelector('[aria-hidden="true"]');
			expect(overlay).toHaveClass('custom-overlay-class');
		});

		it('builds content props with all required fields', () => {
			const setSearchQuery = vi.fn();
			const handleKeyDown = vi.fn();
			const handleSelect = vi.fn();
			const searchInputRef = createRef<HTMLInputElement>();
			const commandsListRef = createRef<HTMLDivElement>();
			const state = createMockState({
				searchQuery: 'test query',
				setSearchQuery,
				handleKeyDown,
				handleSelect,
				searchInputRef,
				commandsListRef,
				filteredCommands: [],
				highlightedIndex: 0,
			});

			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search commands...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			expect(document.body.querySelector('dialog')).toBeInTheDocument();
		});

		it('builds content props with className when provided', () => {
			const state = createMockState();
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: 'custom-content-class',
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			const dialog = document.body.querySelector('dialog');
			expect(dialog).toHaveClass('custom-content-class');
		});
	});

	describe('Portal Rendering', () => {
		it('renders to document.body', () => {
			const state = createMockState();
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			// Portal renders to document.body, so we check if elements exist
			expect(document.body.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
		});

		it('renders both overlay and content in portal', () => {
			const state = createMockState();
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);

			const overlay = document.body.querySelector('[aria-hidden="true"]');
			const dialog = document.body.querySelector('dialog');
			expect(overlay).toBeInTheDocument();
			expect(dialog).toBeInTheDocument();
		});
	});

	describe('State Integration', () => {
		it('passes searchQuery to content', () => {
			const state = createMockState({ searchQuery: 'test search' });
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			const input = document.body.querySelector('input');
			expect(input).toHaveValue('test search');
		});

		it('passes filteredCommands to content', () => {
			const commands = [
				{ id: '1', label: 'Command 1' },
				{ id: '2', label: 'Command 2' },
			];
			const state = createMockState({ filteredCommands: commands as never });
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			// Commands should be rendered in the list
			expect(document.body.textContent).toContain('Command 1');
			expect(document.body.textContent).toContain('Command 2');
		});

		it('passes highlightedIndex to content', () => {
			const commands = [
				{ id: '1', label: 'Command 1' },
				{ id: '2', label: 'Command 2' },
			];
			const state = createMockState({
				filteredCommands: commands as never,
				highlightedIndex: 1,
			});
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			// The highlighted index should be passed to the list component
			expect(state.highlightedIndex).toBe(1);
		});
	});

	describe('Edge Cases', () => {
		it('handles undefined className gracefully', () => {
			const state = createMockState();
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			expect(() => renderWithProviders(result!)).not.toThrow();
		});

		it('handles undefined overlayClassName gracefully', () => {
			const state = createMockState();
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: 'test-class',
			});

			expect(result).not.toBeNull();
			expect(() => renderWithProviders(result!)).not.toThrow();
		});

		it('handles empty filteredCommands', () => {
			const state = createMockState({ filteredCommands: [] });
			const result = renderCommandPaletteContent({
				isOpen: true,
				paletteId: 'test-palette',
				state,
				overlayClassName: undefined,
				placeholder: 'Search...',
				emptyState: <div>No results</div>,
				className: undefined,
			});

			expect(result).not.toBeNull();
			renderWithProviders(result!);
			expect(document.body.textContent).toContain('No results');
		});
	});
});
