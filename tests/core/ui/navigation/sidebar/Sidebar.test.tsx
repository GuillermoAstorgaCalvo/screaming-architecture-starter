import { SIDEBAR_DEFAULT_WIDTH } from '@core/constants/ui/navigation';
import Sidebar from '@core/ui/navigation/sidebar/Sidebar';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Sidebar Component - Basic Rendering', () => {
	it('renders Sidebar with children', () => {
		renderWithProviders(
			<Sidebar>
				<div>Sidebar Content</div>
			</Sidebar>
		);

		expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
		expect(screen.getByLabelText(/sidebar/i)).toBeInTheDocument();
	});

	it('renders Sidebar with default position (left)', () => {
		const { container } = renderWithProviders(
			<Sidebar>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toBeInTheDocument();
		expect(sidebar.tagName).toBe('ASIDE');
		expect(container.querySelector('aside')).toHaveClass('border-r');
	});

	it('renders Sidebar with right position', () => {
		const { container } = renderWithProviders(
			<Sidebar position="right">
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toBeInTheDocument();
		expect(container.querySelector('aside')).toHaveClass('border-l');
	});

	it('renders Sidebar with custom className', () => {
		renderWithProviders(
			<Sidebar className="custom-sidebar-class">
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toHaveClass('custom-sidebar-class');
	});

	it('applies default width when not specified', () => {
		renderWithProviders(
			<Sidebar>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toHaveStyle({ width: SIDEBAR_DEFAULT_WIDTH });
	});

	it('applies custom width', () => {
		renderWithProviders(
			<Sidebar width="300px">
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toHaveStyle({ width: '300px' });
	});

	it('applies numeric width', () => {
		renderWithProviders(
			<Sidebar width={400}>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toHaveStyle({ width: '400px' });
	});
});

describe('Sidebar Component - Collapse State', () => {
	it('renders Sidebar in expanded state by default', () => {
		renderWithProviders(
			<Sidebar width="300px">
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toHaveStyle({ width: '300px' });
	});

	it('renders Sidebar in collapsed state', () => {
		renderWithProviders(
			<Sidebar width="300px" collapsed>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toHaveStyle({ width: 'var(--spacing-4xl)' });
	});

	it('applies collapsed width when collapsed is true', () => {
		renderWithProviders(
			<Sidebar width="500px" collapsed>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toHaveStyle({ width: 'var(--spacing-4xl)' });
	});
});

describe('Sidebar Component - Header and Footer', () => {
	it('renders Sidebar without header when not provided', () => {
		renderWithProviders(
			<Sidebar>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		const headers = sidebar.querySelectorAll('[class*="border-b"]');
		expect(headers.length).toBe(0);
	});

	it('renders Sidebar with header', () => {
		renderWithProviders(
			<Sidebar header={<div>Header Content</div>}>
				<div>Content</div>
			</Sidebar>
		);

		expect(screen.getByText('Header Content')).toBeInTheDocument();
	});

	it('renders Sidebar without footer when not provided', () => {
		renderWithProviders(
			<Sidebar>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		const footers = sidebar.querySelectorAll('[class*="border-t"]');
		expect(footers.length).toBe(0);
	});

	it('renders Sidebar with footer', () => {
		renderWithProviders(
			<Sidebar footer={<div>Footer Content</div>}>
				<div>Content</div>
			</Sidebar>
		);

		expect(screen.getByText('Footer Content')).toBeInTheDocument();
	});

	it('renders Sidebar with both header and footer', () => {
		renderWithProviders(
			<Sidebar header={<div>Header</div>} footer={<div>Footer</div>}>
				<div>Content</div>
			</Sidebar>
		);

		expect(screen.getByText('Header')).toBeInTheDocument();
		expect(screen.getByText('Footer')).toBeInTheDocument();
		expect(screen.getByText('Content')).toBeInTheDocument();
	});
});

describe('Sidebar Component - Border', () => {
	it('renders Sidebar with border by default', () => {
		const { container } = renderWithProviders(
			<Sidebar position="left">
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = container.querySelector('aside');
		expect(sidebar).toHaveClass('border-r');
	});

	it('renders Sidebar without border when showBorder is false', () => {
		const { container } = renderWithProviders(
			<Sidebar position="left" showBorder={false}>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = container.querySelector('aside');
		expect(sidebar).not.toHaveClass('border-r');
		expect(sidebar).not.toHaveClass('border-l');
	});

	it('applies correct border class for left position', () => {
		const { container } = renderWithProviders(
			<Sidebar position="left" showBorder>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = container.querySelector('aside');
		expect(sidebar).toHaveClass('border-r');
		expect(sidebar).not.toHaveClass('border-l');
	});

	it('applies correct border class for right position', () => {
		const { container } = renderWithProviders(
			<Sidebar position="right" showBorder>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = container.querySelector('aside');
		expect(sidebar).toHaveClass('border-l');
		expect(sidebar).not.toHaveClass('border-r');
	});
});

describe('Sidebar Component - Content Styling', () => {
	it('renders Sidebar with default contentClassName', () => {
		renderWithProviders(
			<Sidebar>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		const content = sidebar.querySelector('.flex-1.overflow-y-auto');
		expect(content).toBeInTheDocument();
	});

	it('renders Sidebar with custom contentClassName', () => {
		renderWithProviders(
			<Sidebar contentClassName="custom-content-class">
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		const content = sidebar.querySelector('.custom-content-class');
		expect(content).toBeInTheDocument();
	});
});

describe('Sidebar Component - Custom Style', () => {
	it('applies custom style prop', () => {
		renderWithProviders(
			<Sidebar style={{ backgroundColor: 'red' }}>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar.style.backgroundColor).toBe('red');
	});

	it('merges custom style with width style', () => {
		renderWithProviders(
			<Sidebar width="300px" style={{ backgroundColor: 'blue' }}>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar.style.width).toBe('300px');
		expect(sidebar.style.backgroundColor).toBe('blue');
	});
});

describe('Sidebar Component - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Sidebar header={<div>Header</div>} footer={<div>Footer</div>}>
				<div>Content</div>
			</Sidebar>
		);

		await expectA11y(container);
	});

	it('has proper ARIA label', () => {
		renderWithProviders(
			<Sidebar>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toBeInTheDocument();
	});

	it('uses semantic aside element', () => {
		renderWithProviders(
			<Sidebar>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar.tagName).toBe('ASIDE');
	});
});

describe('Sidebar Component - Layout Structure', () => {
	it('renders with proper layout structure', () => {
		renderWithProviders(
			<Sidebar header={<div>Header</div>} footer={<div>Footer</div>}>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		expect(sidebar).toBeInTheDocument();
		expect(screen.getByText('Header')).toBeInTheDocument();
		expect(screen.getByText('Content')).toBeInTheDocument();
		expect(screen.getByText('Footer')).toBeInTheDocument();
	});

	it('renders content in scrollable container', () => {
		renderWithProviders(
			<Sidebar>
				<div>Content</div>
			</Sidebar>
		);

		const sidebar = screen.getByLabelText(/sidebar/i);
		const content = sidebar.querySelector('.flex-1.overflow-y-auto');
		expect(content).toBeInTheDocument();
		expect(content).toHaveTextContent('Content');
	});
});
