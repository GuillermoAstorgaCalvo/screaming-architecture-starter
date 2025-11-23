/**
 * TagInput Component Tests
 *
 * Tests for the TagInput component including:
 * - Rendering
 * - User interactions
 * - Controlled and uncontrolled modes
 * - Tag management
 * - Keyboard interactions
 * - Validation
 * - Accessibility
 */

import TagInput from '@core/ui/forms/tag-input/TagInput';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const LABEL_TAGS = 'Tags';
const PLACEHOLDER_ADD_TAGS = 'Add tags...';
const ERROR_MESSAGE = 'Tags are required';

describe('TagInput - Rendering', () => {
	it('renders tag input element', () => {
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} />);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders with label', () => {
		renderWithProviders(<TagInput label={LABEL_TAGS} placeholder={PLACEHOLDER_ADD_TAGS} />);

		expect(screen.getByText(LABEL_TAGS)).toBeInTheDocument();
	});

	it('renders with placeholder', () => {
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('placeholder', PLACEHOLDER_ADD_TAGS);
	});

	it('renders with helper text', () => {
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} helperText="Add up to 5 tags" />
		);

		expect(screen.getByText('Add up to 5 tags')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} error={ERROR_MESSAGE} />);

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it('renders existing tags as chips', () => {
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} defaultTags={['tag1', 'tag2']} />
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();
		expect(screen.getByText('tag2')).toBeInTheDocument();
	});
});

describe('TagInput - User Interactions', () => {
	it('allows typing in input', () => {
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'new tag' } });

		expect(input).toHaveValue('new tag');
	});

	it('adds tag when Enter is pressed', async () => {
		const onChange = vi.fn();
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} onChange={onChange} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'newtag' } });
		fireEvent.keyDown(input, { key: 'Enter' });

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(['newtag']);
		});
	});

	it('adds tag when separator (comma) is pressed', async () => {
		const onChange = vi.fn();
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} onChange={onChange} separator="," />
		);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'newtag' } });
		fireEvent.keyDown(input, { key: ',' });

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(['newtag']);
		});
	});

	it('removes tag when chip remove button is clicked', async () => {
		const onChange = vi.fn();
		renderWithProviders(
			<TagInput
				placeholder={PLACEHOLDER_ADD_TAGS}
				defaultTags={['tag1', 'tag2']}
				onChange={onChange}
			/>
		);

		const removeButton = screen.getByLabelText('Remove tag1');
		fireEvent.click(removeButton);

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(['tag2']);
		});
	});

	it('removes last tag when Backspace is pressed on empty input', async () => {
		const onChange = vi.fn();
		renderWithProviders(
			<TagInput
				placeholder={PLACEHOLDER_ADD_TAGS}
				defaultTags={['tag1', 'tag2']}
				onChange={onChange}
			/>
		);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: '' } });
		fireEvent.keyDown(input, { key: 'Backspace' });

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(['tag1']);
		});
	});
});

describe('TagInput - Controlled Mode', () => {
	it('uses controlled tags', () => {
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} tags={['controlled1', 'controlled2']} />
		);

		expect(screen.getByText('controlled1')).toBeInTheDocument();
		expect(screen.getByText('controlled2')).toBeInTheDocument();
	});

	it('updates when controlled tags change', () => {
		const { rerender } = renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} tags={['tag1']} />
		);

		expect(screen.getByText('tag1')).toBeInTheDocument();

		rerender(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} tags={['tag1', 'tag2']} />);

		expect(screen.getByText('tag1')).toBeInTheDocument();
		expect(screen.getByText('tag2')).toBeInTheDocument();
	});

	it('uses controlled input value', () => {
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} value="controlled value" />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('controlled value');
	});
});

describe('TagInput - Uncontrolled Mode', () => {
	it('uses defaultTags', () => {
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} defaultTags={['default1', 'default2']} />
		);

		expect(screen.getByText('default1')).toBeInTheDocument();
		expect(screen.getByText('default2')).toBeInTheDocument();
	});

	it('uses defaultValue', () => {
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} defaultValue="default value" />
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('default value');
	});
});

describe('TagInput - Tag Management', () => {
	it('prevents duplicate tags by default', async () => {
		const onChange = vi.fn();
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} defaultTags={['tag1']} onChange={onChange} />
		);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'tag1' } });
		fireEvent.keyDown(input, { key: 'Enter' });

		await waitFor(() => {
			expect(onChange).not.toHaveBeenCalled();
		});
	});

	it('allows duplicate tags when allowDuplicates is true', async () => {
		const onChange = vi.fn();
		renderWithProviders(
			<TagInput
				placeholder={PLACEHOLDER_ADD_TAGS}
				defaultTags={['tag1']}
				allowDuplicates={true}
				onChange={onChange}
			/>
		);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'tag1' } });
		fireEvent.keyDown(input, { key: 'Enter' });

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(['tag1', 'tag1']);
		});
	});

	it('enforces maxTags limit', async () => {
		const onChange = vi.fn();
		renderWithProviders(
			<TagInput
				placeholder={PLACEHOLDER_ADD_TAGS}
				defaultTags={['tag1', 'tag2']}
				maxTags={2}
				onChange={onChange}
			/>
		);

		const input = screen.getByRole('textbox');
		expect(input).toBeDisabled();

		fireEvent.change(input, { target: { value: 'tag3' } });
		fireEvent.keyDown(input, { key: 'Enter' });

		await waitFor(() => {
			expect(onChange).not.toHaveBeenCalled();
		});
	});

	it('removes placeholder when maxTags reached', () => {
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} defaultTags={['tag1', 'tag2']} maxTags={2} />
		);

		const input = screen.getByRole('textbox');
		expect(input).not.toHaveAttribute('placeholder');
	});
});

describe('TagInput - Validation', () => {
	it('displays error message', () => {
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} error={ERROR_MESSAGE} />);

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} error={ERROR_MESSAGE} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('associates error with input via ARIA', () => {
		renderWithProviders(
			<TagInput label={LABEL_TAGS} placeholder={PLACEHOLDER_ADD_TAGS} error={ERROR_MESSAGE} />
		);

		const input = screen.getByRole('textbox');
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		expect(describedBy).toContain('error');
	});
});

describe('TagInput - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<TagInput label={LABEL_TAGS} placeholder={PLACEHOLDER_ADD_TAGS} helperText="Add tags" />
		);

		await expectA11y(container, {
			rules: {
				'color-contrast': { enabled: false },
				'page-has-heading-one': { enabled: false },
			},
		} as Parameters<typeof expectA11y>[1]);
	});

	it('associates label with input', () => {
		renderWithProviders(<TagInput label={LABEL_TAGS} placeholder={PLACEHOLDER_ADD_TAGS} />);

		const input = screen.getByLabelText(LABEL_TAGS);
		expect(input).toBeInTheDocument();
	});

	it('uses aria-describedby for helper text', () => {
		renderWithProviders(
			<TagInput label={LABEL_TAGS} placeholder={PLACEHOLDER_ADD_TAGS} helperText="Helper text" />
		);

		const input = screen.getByRole('textbox');
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		expect(describedBy).toContain('helper');
	});
});

describe('TagInput - Disabled State', () => {
	it('renders disabled input', () => {
		renderWithProviders(<TagInput placeholder={PLACEHOLDER_ADD_TAGS} disabled />);

		const input = screen.getByRole('textbox');
		expect(input).toBeDisabled();
	});

	it('prevents interaction when disabled', async () => {
		const onChange = vi.fn();
		renderWithProviders(
			<TagInput placeholder={PLACEHOLDER_ADD_TAGS} disabled onChange={onChange} />
		);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'test' } });
		fireEvent.keyDown(input, { key: 'Enter' });

		await waitFor(() => {
			expect(onChange).not.toHaveBeenCalled();
		});
	});
});
