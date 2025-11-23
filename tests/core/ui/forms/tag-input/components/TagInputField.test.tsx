/**
 * TagInputField Component Tests
 *
 * Tests for the TagInputField component including:
 * - Rendering
 * - Input attributes
 * - Tag display
 * - Disabled state
 * - Max tags handling
 * - Placeholder behavior
 */

import { TagInputField } from '@core/ui/forms/tag-input/components/TagInputField';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('TagInputField - Rendering', () => {
	it('renders input element', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('applies id attribute', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('id', 'test-input');
	});

	it('renders tags as chips', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={['tag1', 'tag2']}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
		expect(screen.getByText('tag2')).toBeInTheDocument();
	});
});

describe('TagInputField - Input Attributes', () => {
	it('applies value attribute', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value="test value"
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('test value');
	});

	it('applies placeholder when provided', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('placeholder', 'Add tags');
	});

	it('removes placeholder when max tags reached', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={['tag1', 'tag2']}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={2}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).not.toHaveAttribute('placeholder');
	});

	it('applies required attribute', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={true}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('required');
	});

	it('applies aria-invalid when hasError is true', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={true}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('applies aria-describedby when provided', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy="test-input-error test-input-helper"
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-describedby', 'test-input-error test-input-helper');
	});
});

describe('TagInputField - Disabled State', () => {
	it('disables input when disabled prop is true', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toBeDisabled();
	});

	it('disables input when max tags reached', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={['tag1', 'tag2']}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={2}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toBeDisabled();
	});

	it('does not disable input when disabled is false and max tags not reached', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={false}
				required={undefined}
				tags={['tag1']}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={2}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).not.toBeDisabled();
	});
});

describe('TagInputField - User Interactions', () => {
	it('calls onChange when input value changes', () => {
		const onRemoveTag = vi.fn();
		const onChange = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={onChange}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'new value' } });
		expect(onChange).toHaveBeenCalledWith('new value');
	});

	it('calls onKeyDown when key is pressed', () => {
		const onRemoveTag = vi.fn();
		const onKeyDown = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={onKeyDown}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const input = screen.getByRole('textbox');
		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		fireEvent.keyDown(input, event);
		expect(onKeyDown).toHaveBeenCalled();
	});

	it('calls onRemoveTag when chip remove button is clicked', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={['tag1']}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{}}
			/>
		);

		const removeButton = screen.getByLabelText('Remove tag1');
		fireEvent.click(removeButton);
		expect(onRemoveTag).toHaveBeenCalledWith('tag1');
	});
});

describe('TagInputField - Additional Props', () => {
	it('passes through additional input props', () => {
		const onRemoveTag = vi.fn();
		renderWithProviders(
			<TagInputField
				id="test-input"
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={undefined}
				required={undefined}
				tags={[]}
				onRemoveTag={onRemoveTag}
				chipSize="sm"
				chipVariant="default"
				value=""
				onChange={vi.fn()}
				onKeyDown={undefined}
				placeholder="Add tags"
				maxTags={undefined}
				props={{ 'data-testid': 'custom-input', autoFocus: true } as any}
			/>
		);

		const input = screen.getByTestId('custom-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveFocus();
	});
});
