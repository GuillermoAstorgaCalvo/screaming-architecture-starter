/**
 * TagInputFieldContainer Component Tests
 *
 * Tests for the TagInputFieldContainer component including:
 * - Rendering
 * - Tag display
 * - Chip rendering
 * - Remove tag functionality
 * - Styling and states
 */

import { TagInputFieldContainer } from '@core/ui/forms/tag-input/components/TagInputFieldContainer';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('TagInputFieldContainer - Rendering', () => {
	it('renders container element', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={[]}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		const container = screen.getByRole('textbox').parentElement;
		expect(container).toBeInTheDocument();
	});

	it('renders children input element', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={[]}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" data-testid="test-input" />
			</TagInputFieldContainer>
		);

		expect(screen.getByTestId('test-input')).toBeInTheDocument();
	});

	it('renders tags as chips', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1', 'tag2', 'tag3']}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
		expect(screen.getByText('tag2')).toBeInTheDocument();
		expect(screen.getByText('tag3')).toBeInTheDocument();
	});

	it('renders empty container when no tags', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={[]}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		const container = screen.getByRole('textbox').parentElement;
		expect(container).toBeInTheDocument();
		expect(screen.queryByText('tag1')).not.toBeInTheDocument();
	});
});

describe('TagInputFieldContainer - Chip Variants', () => {
	it('renders chips with default variant', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1']}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
	});

	it('renders chips with primary variant', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1']}
				chipVariant="primary"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
	});

	it('renders chips with different variants', () => {
		const onRemoveTag = vi.fn();
		const { rerender } = renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1']}
				chipVariant="success"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();

		rerender(
			<TagInputFieldContainer
				tags={['tag1']}
				chipVariant="error"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
	});
});

describe('TagInputFieldContainer - Chip Sizes', () => {
	it('renders chips with small size', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1']}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
	});

	it('renders chips with medium size', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1']}
				chipVariant="default"
				chipSize="md"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
	});

	it('renders chips with large size', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1']}
				chipVariant="default"
				chipSize="lg"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
	});
});

describe('TagInputFieldContainer - Remove Tag', () => {
	it('calls onRemoveTag when chip remove button is clicked', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1', 'tag2']}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		const removeButtons = screen.getAllByLabelText(/Remove/);
		expect(removeButtons.length).toBeGreaterThan(0);

		expect(removeButtons[0]).toBeDefined();
		if (removeButtons[0]) {
			fireEvent.click(removeButtons[0]);
		}
		expect(onRemoveTag).toHaveBeenCalledWith('tag1');
	});

	it('calls onRemoveTag with correct tag for each chip', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputFieldContainer
				tags={['tag1', 'tag2', 'tag3']}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		const removeButtons = screen.getAllByLabelText(/Remove/);
		expect(removeButtons[1]).toBeDefined();
		if (removeButtons[1]) {
			fireEvent.click(removeButtons[1]);
		}
		expect(onRemoveTag).toHaveBeenCalledWith('tag2');
	});
});

describe('TagInputFieldContainer - Styling and States', () => {
	it('applies custom className', () => {
		const onRemoveTag = vi.fn();
		const { container } = renderWithProviders(
			<TagInputFieldContainer
				tags={[]}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className="custom-class"
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		const containerElement = container.querySelector('.custom-class');
		expect(containerElement).toBeInTheDocument();
	});

	it('applies error styling when hasError is true', () => {
		const onRemoveTag = vi.fn();
		const { container } = renderWithProviders(
			<TagInputFieldContainer
				tags={[]}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={true}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('border-destructive');
	});

	it('applies disabled styling when disabled is true', () => {
		const onRemoveTag = vi.fn();
		const { container } = renderWithProviders(
			<TagInputFieldContainer
				tags={[]}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={true}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('cursor-not-allowed');
	});

	it('does not apply disabled styling when disabled is undefined', () => {
		const onRemoveTag = vi.fn();
		const { container } = renderWithProviders(
			<TagInputFieldContainer
				tags={[]}
				chipVariant="default"
				chipSize="sm"
				onRemoveTag={onRemoveTag}
				className=""
				hasError={false}
				disabled={undefined}
			>
				<input type="text" />
			</TagInputFieldContainer>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).not.toHaveClass('cursor-not-allowed');
	});
});
