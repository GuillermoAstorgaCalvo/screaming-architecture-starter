/**
 * Tests for HoverCardWrapper
 *
 * Tests the hover card wrapper component:
 * - Rendering with children
 * - Event handlers attachment
 * - Content visibility
 * - Accessibility attributes
 * - Handler composition
 */

import { HoverCardWrapper } from '@core/ui/overlays/hover-card/components/HoverCardWrapper';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('HoverCardWrapper', () => {
	it('renders children', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		expect(screen.getByText('Hover me')).toBeInTheDocument();
	});

	it('calls handleMouseEnter on mouse enter', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		const wrapper = screen.getByText('Hover me').parentElement;
		fireEvent.mouseEnter(wrapper!);

		expect(handleMouseEnter).toHaveBeenCalled();
	});

	it('calls handleMouseLeave on mouse leave', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		const wrapper = screen.getByText('Hover me').parentElement;
		fireEvent.mouseLeave(wrapper!);

		expect(handleMouseLeave).toHaveBeenCalled();
	});

	it('calls handleFocus on child focus', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		const button = screen.getByText('Hover me');
		fireEvent.focus(button);

		expect(handleFocus).toHaveBeenCalled();
	});

	it('calls handleBlur on child blur', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		const button = screen.getByText('Hover me');
		fireEvent.blur(button);

		expect(handleBlur).toHaveBeenCalled();
	});

	it('attaches aria-describedby to child', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="custom-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		const button = screen.getByText('Hover me');
		expect(button).toHaveAttribute('aria-describedby', 'custom-id');
	});

	it('preserves existing child props', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		const existingOnFocus = vi.fn();
		const existingOnBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				<button onFocus={existingOnFocus} onBlur={existingOnBlur}>
					Hover me
				</button>
			</HoverCardWrapper>
		);

		const button = screen.getByText('Hover me');
		fireEvent.focus(button);
		fireEvent.blur(button);

		expect(handleFocus).toHaveBeenCalled();
		expect(handleBlur).toHaveBeenCalled();
		expect(existingOnFocus).toHaveBeenCalled();
		expect(existingOnBlur).toHaveBeenCalled();
	});

	it('renders content when isVisible is true', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={true}
				position="top"
				content={<div>Visible content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		expect(screen.getByText('Visible content')).toBeInTheDocument();
	});

	it('does not render content when isVisible is false', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Hidden content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
	});

	it('applies custom className to wrapper', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		const { container } = render(
			<HoverCardWrapper
				hoverCardId="test-id"
				className="custom-wrapper-class"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		const wrapper = container.querySelector('.custom-wrapper-class');
		expect(wrapper).toBeInTheDocument();
	});

	it('handles non-element children gracefully', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={false}
				position="top"
				content={<div>Content</div>}
				showArrow={true}
			>
				Just text
			</HoverCardWrapper>
		);

		expect(screen.getByText('Just text')).toBeInTheDocument();
	});

	it('passes contentClassName to content', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();

		const { container } = render(
			<HoverCardWrapper
				hoverCardId="test-id"
				handleMouseEnter={handleMouseEnter}
				handleMouseLeave={handleMouseLeave}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				isVisible={true}
				position="top"
				content={<div>Content</div>}
				contentClassName="custom-content-class"
				showArrow={true}
			>
				<button>Hover me</button>
			</HoverCardWrapper>
		);

		const content = container.querySelector('.custom-content-class');
		expect(content).toBeInTheDocument();
	});
});
