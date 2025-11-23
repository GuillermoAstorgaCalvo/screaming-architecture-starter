/**
 * AutocompleteListbox Component Tests
 *
 * Tests for the AutocompleteListbox component including:
 * - Rendering when closed
 * - Rendering empty state
 * - Rendering options list
 * - Props forwarding
 */

import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import { AutocompleteListbox } from '@core/ui/forms/autocomplete/components/AutocompleteListbox';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry' },
];

const mockEmptyState = <div data-testid="empty-state">No options found</div>;

const createDefaultProps = (
	overrides?: Partial<Parameters<typeof AutocompleteListbox>[0]>
): Parameters<typeof AutocompleteListbox>[0] =>
	({
		isOpen: true,
		emptyState: mockEmptyState,
		filteredOptions: mockOptions,
		highlightedIndex: -1,
		optionRefs: [createRef(), createRef(), createRef()],
		handleSelect: vi.fn(),
		listboxRef: createRef(),
		menuId: 'test-menu',
		maxHeight: 280,
		searchQuery: '',
		highlightMatches: false,
		...overrides,
	}) as Parameters<typeof AutocompleteListbox>[0];

describe('AutocompleteListbox - Rendering', () => {
	it('returns null when isOpen is false', () => {
		const { container } = render(
			<AutocompleteListbox {...createDefaultProps({ isOpen: false })} />
		);

		expect(container.firstChild).toBeNull();
	});

	it('renders empty state when filteredOptions is empty', () => {
		render(<AutocompleteListbox {...createDefaultProps({ filteredOptions: [] })} />);

		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
	});

	it('renders options list when filteredOptions has items', () => {
		render(<AutocompleteListbox {...createDefaultProps()} />);

		const listbox = screen.getByRole('listbox');
		expect(listbox).toBeInTheDocument();
		expect(listbox).toHaveAttribute('id', 'test-menu');
	});

	it('renders all options in the list', () => {
		render(<AutocompleteListbox {...createDefaultProps()} />);

		const listbox = screen.getByRole('listbox');
		expect(listbox.children).toHaveLength(mockOptions.length);
	});
});

describe('AutocompleteListbox - Props Forwarding', () => {
	it('forwards all props to AutocompleteOptionsList', () => {
		const handleSelect = vi.fn();
		const listboxRef = createRef<HTMLUListElement>();
		const optionRefs = [
			createRef<HTMLButtonElement>(),
			createRef<HTMLButtonElement>(),
			createRef<HTMLButtonElement>(),
		];

		render(
			<AutocompleteListbox
				{...createDefaultProps({
					handleSelect,
					listboxRef,
					optionRefs,
					highlightedIndex: 1,
					searchQuery: 'test',
					highlightMatches: true,
					maxHeight: 300,
				})}
			/>
		);

		const listbox = screen.getByRole('listbox');
		expect(listbox).toBeInTheDocument();
		expect(listbox).toHaveAttribute('id', 'test-menu');
	});

	it('forwards emptyState to AutocompleteEmptyState when no options', () => {
		const customEmptyState = <div data-testid="custom-empty">Custom empty</div>;
		render(
			<AutocompleteListbox
				{...createDefaultProps({
					filteredOptions: [],
					emptyState: customEmptyState,
				})}
			/>
		);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
	});
});

describe('AutocompleteListbox - Edge Cases', () => {
	it('handles single option', () => {
		const singleOption = [{ value: '1', label: 'Single' }];
		render(<AutocompleteListbox {...createDefaultProps({ filteredOptions: singleOption })} />);

		const listbox = screen.getByRole('listbox');
		expect(listbox.children).toHaveLength(1);
	});

	it('handles many options', () => {
		const manyOptions: AutocompleteOption[] = Array.from({ length: 100 }, (_, i) => ({
			value: String(i),
			label: `Option ${i}`,
		}));
		render(<AutocompleteListbox {...createDefaultProps({ filteredOptions: manyOptions })} />);

		const listbox = screen.getByRole('listbox');
		expect(listbox.children).toHaveLength(100);
	});

	it('switches between empty and populated states', () => {
		const { rerender } = render(
			<AutocompleteListbox {...createDefaultProps({ filteredOptions: [] })} />
		);

		expect(screen.getByTestId('empty-state')).toBeInTheDocument();

		rerender(<AutocompleteListbox {...createDefaultProps()} />);

		expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});
});
