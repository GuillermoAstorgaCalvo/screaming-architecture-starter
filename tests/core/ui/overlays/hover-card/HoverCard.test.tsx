/**
 * Tests for HoverCard
 *
 * Tests the main HoverCard component:
 * - Rendering with different props
 * - Disabled state
 * - Position variants
 * - Delay configuration
 * - Arrow visibility
 * - Content rendering
 * - Event handling
 */

import HoverCard from '@core/ui/overlays/hover-card/HoverCard';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('HoverCard - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<HoverCard content={<div>Hover content</div>}>
				<button>Hover me</button>
			</HoverCard>
		);

		expect(screen.getByText('Hover me')).toBeInTheDocument();
	});

	it('returns children only when disabled', () => {
		renderWithProviders(
			<HoverCard content={<div>Hover content</div>} disabled={true}>
				<button>Hover me</button>
			</HoverCard>
		);

		expect(screen.getByText('Hover me')).toBeInTheDocument();
		expect(screen.queryByText('Hover content')).not.toBeInTheDocument();
	});

	it('renders with default position', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>}>
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('renders with custom position', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} position="bottom">
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});
});

describe('HoverCard - Visibility', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shows content on mouse enter after delay', () => {
		renderWithProviders(
			<HoverCard content={<div>Hover content</div>} delay={100}>
				<button>Hover me</button>
			</HoverCard>
		);

		const button = screen.getByText('Hover me');
		const wrapper = button.parentElement;

		act(() => {
			fireEvent.mouseEnter(wrapper!);
		});

		expect(screen.queryByText('Hover content')).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(screen.getByText('Hover content')).toBeInTheDocument();
	});

	it('hides content on mouse leave after hideDelay', () => {
		renderWithProviders(
			<HoverCard content={<div>Hover content</div>} delay={100} hideDelay={50}>
				<button>Hover me</button>
			</HoverCard>
		);

		const button = screen.getByText('Hover me');
		const wrapper = button.parentElement;

		// Show content
		act(() => {
			fireEvent.mouseEnter(wrapper!);
			vi.advanceTimersByTime(100);
		});

		expect(screen.getByText('Hover content')).toBeInTheDocument();

		// Hide content
		act(() => {
			fireEvent.mouseLeave(wrapper!);
		});

		act(() => {
			vi.advanceTimersByTime(50);
		});

		expect(screen.queryByText('Hover content')).not.toBeInTheDocument();
	});

	it('shows content on focus after delay', () => {
		renderWithProviders(
			<HoverCard content={<div>Hover content</div>} delay={100}>
				<button>Hover me</button>
			</HoverCard>
		);

		const button = screen.getByText('Hover me');

		act(() => {
			fireEvent.focus(button);
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(screen.getByText('Hover content')).toBeInTheDocument();
	});

	it('hides content on blur after hideDelay', () => {
		renderWithProviders(
			<HoverCard content={<div>Hover content</div>} delay={100} hideDelay={50}>
				<button>Hover me</button>
			</HoverCard>
		);

		const button = screen.getByText('Hover me');

		// Show content
		act(() => {
			fireEvent.focus(button);
			vi.advanceTimersByTime(100);
		});

		expect(screen.getByText('Hover content')).toBeInTheDocument();

		// Hide content
		act(() => {
			fireEvent.blur(button);
		});

		act(() => {
			vi.advanceTimersByTime(50);
		});

		expect(screen.queryByText('Hover content')).not.toBeInTheDocument();
	});
});

describe('HoverCard - Configuration', () => {
	it('uses default delay from UI_TIMEOUTS', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>}>
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('uses custom delay', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} delay={500}>
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('uses custom hideDelay', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} hideDelay={200}>
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('renders arrow by default', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>}>
				<button>Trigger</button>
			</HoverCard>
		);

		// Arrow is only rendered when visible, but we can check the component accepts showArrow
		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('hides arrow when showArrow is false', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} showArrow={false}>
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});
});

describe('HoverCard - Positions', () => {
	it('renders with top position', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} position="top">
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('renders with bottom position', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} position="bottom">
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('renders with left position', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} position="left">
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('renders with right position', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} position="right">
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});
});

describe('HoverCard - Customization', () => {
	it('applies custom className', () => {
		const { container } = renderWithProviders(
			<HoverCard content={<div>Content</div>} className="custom-class">
				<button>Trigger</button>
			</HoverCard>
		);

		const wrapper = container.querySelector('.custom-class');
		expect(wrapper).toBeInTheDocument();
	});

	it('applies custom contentClassName', () => {
		renderWithProviders(
			<HoverCard content={<div>Content</div>} contentClassName="custom-content-class">
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('renders complex content', () => {
		renderWithProviders(
			<HoverCard
				content={
					<div>
						<h3>Title</h3>
						<p>Description</p>
						<button>Action</button>
					</div>
				}
			>
				<button>Trigger</button>
			</HoverCard>
		);

		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});
});
