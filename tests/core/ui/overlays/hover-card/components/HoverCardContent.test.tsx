/**
 * Tests for HoverCardContent
 *
 * Tests the hover card content component:
 * - Rendering with different positions
 * - Arrow visibility
 * - Content rendering
 * - Accessibility attributes
 * - Custom className
 */

import { HoverCardContent } from '@core/ui/overlays/hover-card/components/HoverCardContent';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('HoverCardContent', () => {
	it('renders content', () => {
		render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={<div>Test content</div>}
				showArrow={true}
			/>
		);

		expect(screen.getByText('Test content')).toBeInTheDocument();
	});

	it('renders with correct role', () => {
		render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toBeInTheDocument();
	});

	it('renders with correct id', () => {
		render(
			<HoverCardContent
				hoverCardId="custom-hover-card-id"
				position="top"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toHaveAttribute('id', 'custom-hover-card-id');
	});

	it('renders arrow when showArrow is true', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const arrows = container.querySelectorAll('.absolute.w-2.h-2');
		expect(arrows.length).toBeGreaterThan(0);
	});

	it('does not render arrow when showArrow is false', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={<div>Test</div>}
				showArrow={false}
			/>
		);

		const arrows = container.querySelectorAll('.absolute.w-2.h-2');
		expect(arrows.length).toBe(0);
	});

	it('applies correct position classes for top', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const tooltip = container.querySelector('[role="tooltip"]');
		expect(tooltip?.className).toContain('bottom-full');
		expect(tooltip?.className).toContain('left-1/2');
	});

	it('applies correct position classes for bottom', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="bottom"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const tooltip = container.querySelector('[role="tooltip"]');
		expect(tooltip?.className).toContain('top-full');
		expect(tooltip?.className).toContain('left-1/2');
	});

	it('applies correct position classes for left', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="left"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const tooltip = container.querySelector('[role="tooltip"]');
		expect(tooltip?.className).toContain('right-full');
		expect(tooltip?.className).toContain('top-1/2');
	});

	it('applies correct position classes for right', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="right"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const tooltip = container.querySelector('[role="tooltip"]');
		expect(tooltip?.className).toContain('left-full');
		expect(tooltip?.className).toContain('top-1/2');
	});

	it('applies custom contentClassName', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={<div>Test</div>}
				contentClassName="custom-content-class"
				showArrow={true}
			/>
		);

		const content = container.querySelector('.custom-content-class');
		expect(content).toBeInTheDocument();
	});

	it('renders complex content', () => {
		render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={
					<div>
						<h3>Title</h3>
						<p>Description</p>
						<button>Action</button>
					</div>
				}
				showArrow={true}
			/>
		);

		expect(screen.getByText('Title')).toBeInTheDocument();
		expect(screen.getByText('Description')).toBeInTheDocument();
		expect(screen.getByText('Action')).toBeInTheDocument();
	});

	it('has pointer-events-none class', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const tooltip = container.querySelector('[role="tooltip"]');
		expect(tooltip?.className).toContain('pointer-events-none');
	});

	it('has absolute positioning', () => {
		const { container } = render(
			<HoverCardContent
				hoverCardId="test-id"
				position="top"
				content={<div>Test</div>}
				showArrow={true}
			/>
		);

		const tooltip = container.querySelector('[role="tooltip"]');
		expect(tooltip?.className).toContain('absolute');
	});
});
