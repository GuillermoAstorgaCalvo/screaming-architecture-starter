import {
	SheetCloseButton,
	SheetFooter,
	SheetHeader,
	SheetMainContent,
	SheetOverlay,
	SheetTitle,
} from '@core/ui/overlays/sheet/components/SheetParts';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Sheet Title';

describe('SheetParts', () => {
	describe('SheetTitle', () => {
		it('renders title with correct id', () => {
			renderWithProviders(<SheetTitle id="test-sheet" title={TEST_TITLE} />);

			const title = screen.getByText(TEST_TITLE);
			expect(title).toBeInTheDocument();
			expect(title).toHaveAttribute('id', 'test-sheet-title');
			expect(title.tagName).toBe('H2');
		});

		it('has correct heading level', () => {
			renderWithProviders(<SheetTitle id="test-sheet" title={TEST_TITLE} />);

			const title = screen.getByRole('heading', { level: 2 });
			expect(title).toBeInTheDocument();
			expect(title).toHaveTextContent(TEST_TITLE);
		});
	});

	describe('SheetCloseButton', () => {
		it('renders close button', () => {
			const onClose = vi.fn();
			renderWithProviders(<SheetCloseButton onClose={onClose} />);

			const button = screen.getByRole('button', { name: /close/i });
			expect(button).toBeInTheDocument();
		});

		it('calls onClose when clicked', () => {
			const onClose = vi.fn();
			renderWithProviders(<SheetCloseButton onClose={onClose} />);

			const button = screen.getByRole('button', { name: /close/i });
			fireEvent.click(button);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('has accessible label', () => {
			const onClose = vi.fn();
			renderWithProviders(<SheetCloseButton onClose={onClose} />);

			const button = screen.getByRole('button', { name: /close/i });
			expect(button).toHaveAttribute('aria-label');
		});
	});

	describe('SheetHeader', () => {
		it('renders nothing when both title and showCloseButton are false', () => {
			const { container } = renderWithProviders(
				<SheetHeader id="test" showCloseButton={false} onClose={vi.fn()} />
			);

			expect(container.firstChild).toBeNull();
		});

		it('renders title when provided', () => {
			renderWithProviders(
				<SheetHeader id="test" title={TEST_TITLE} showCloseButton={false} onClose={vi.fn()} />
			);

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		});

		it('renders close button when showCloseButton is true', () => {
			const onClose = vi.fn();
			renderWithProviders(<SheetHeader id="test" showCloseButton={true} onClose={onClose} />);

			const button = screen.getByRole('button', { name: /close/i });
			expect(button).toBeInTheDocument();
		});

		it('renders both title and close button', () => {
			const onClose = vi.fn();
			renderWithProviders(
				<SheetHeader id="test" title={TEST_TITLE} showCloseButton={true} onClose={onClose} />
			);

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
		});

		it('calls onClose when close button is clicked', () => {
			const onClose = vi.fn();
			renderWithProviders(
				<SheetHeader id="test" title={TEST_TITLE} showCloseButton={true} onClose={onClose} />
			);

			const button = screen.getByRole('button', { name: /close/i });
			fireEvent.click(button);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('SheetFooter', () => {
		it('renders nothing when footer is not provided', () => {
			const { container } = renderWithProviders(<SheetFooter footer={undefined} />);

			expect(container.firstChild).toBeNull();
		});

		it('renders footer content when provided', () => {
			renderWithProviders(<SheetFooter footer={<button>Footer Button</button>} />);

			expect(screen.getByText('Footer Button')).toBeInTheDocument();
		});

		it('renders complex footer content', () => {
			renderWithProviders(
				<SheetFooter
					footer={
						<div>
							<button>Cancel</button>
							<button>Save</button>
						</div>
					}
				/>
			);

			expect(screen.getByText('Cancel')).toBeInTheDocument();
			expect(screen.getByText('Save')).toBeInTheDocument();
		});
	});

	describe('SheetMainContent', () => {
		it('renders children content', () => {
			renderWithProviders(<SheetMainContent>Main content here</SheetMainContent>);

			expect(screen.getByText('Main content here')).toBeInTheDocument();
		});

		it('renders complex children', () => {
			renderWithProviders(
				<SheetMainContent>
					<div>
						<p>Paragraph 1</p>
						<p>Paragraph 2</p>
					</div>
				</SheetMainContent>
			);

			expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
			expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
		});
	});

	describe('SheetOverlay', () => {
		it('renders overlay with correct attributes', () => {
			const onClick = vi.fn();
			renderWithProviders(<SheetOverlay isOpen={true} onClick={onClick} />);

			const overlay = document.querySelector('[aria-hidden="true"]');
			expect(overlay).toBeInTheDocument();
			expect(overlay).toHaveAttribute('aria-hidden', 'true');
		});

		it('calls onClick when clicked', () => {
			const onClick = vi.fn();
			renderWithProviders(<SheetOverlay isOpen={true} onClick={onClick} />);

			const overlay = document.querySelector('[aria-hidden="true"]');
			if (overlay) {
				fireEvent.click(overlay);
				expect(onClick).toHaveBeenCalledTimes(1);
			}
		});

		it('applies overlay classes based on isOpen', () => {
			const { rerender } = renderWithProviders(<SheetOverlay isOpen={true} onClick={vi.fn()} />);

			const overlay1 = document.querySelector('[aria-hidden="true"]');
			expect(overlay1?.className).toContain('opacity-100');

			rerender(<SheetOverlay isOpen={false} onClick={vi.fn()} />);

			const overlay2 = document.querySelector('[aria-hidden="true"]');
			expect(overlay2?.className).toContain('opacity-0');
			expect(overlay2?.className).toContain('pointer-events-none');
		});

		it('applies custom overlay className when provided', () => {
			renderWithProviders(
				<SheetOverlay isOpen={true} onClick={vi.fn()} overlayClassName="custom-overlay" />
			);

			const overlay = document.querySelector('[aria-hidden="true"]');
			expect(overlay?.className).toContain('custom-overlay');
		});

		it('handles click event correctly', () => {
			const onClick = vi.fn((e: MouseEvent<HTMLDivElement>) => {
				// Mock implementation
			});
			renderWithProviders(<SheetOverlay isOpen={true} onClick={onClick} />);

			const overlay = document.querySelector('[aria-hidden="true"]');
			if (overlay) {
				fireEvent.click(overlay);
				expect(onClick).toHaveBeenCalled();
			}
		});
	});

	describe('SheetParts - Accessibility', () => {
		it('SheetHeader has no accessibility violations', async () => {
			const { container } = renderWithProviders(
				<SheetHeader id="test" title={TEST_TITLE} showCloseButton={true} onClose={vi.fn()} />
			);

			await expectA11y(container);
		});

		it('SheetFooter has no accessibility violations', async () => {
			const { container } = renderWithProviders(<SheetFooter footer={<button>Footer</button>} />);

			await expectA11y(container);
		});

		it('SheetMainContent has no accessibility violations', async () => {
			const { container } = renderWithProviders(<SheetMainContent>Content</SheetMainContent>);

			await expectA11y(container);
		});
	});
});
