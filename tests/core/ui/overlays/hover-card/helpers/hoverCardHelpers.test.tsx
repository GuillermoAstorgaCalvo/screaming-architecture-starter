/**
 * Tests for hoverCardHelpers
 *
 * Tests the helper functions used by HoverCard:
 * - buildWrapperProps: builds props for HoverCardWrapper
 * - renderHoverCard: renders HoverCard with wrapper
 */

import {
	buildWrapperProps,
	renderHoverCard,
} from '@core/ui/overlays/hover-card/helpers/hoverCardHelpers';
import type { HoverCardProps } from '@src-types/ui/overlays/floating';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('hoverCardHelpers - buildWrapperProps', () => {
	it('builds wrapper props with all required properties', () => {
		const props = buildWrapperProps({
			hoverCardId: 'test-id',
			className: 'test-class',
			handleMouseEnter: () => {},
			handleMouseLeave: () => {},
			handleFocus: () => {},
			handleBlur: () => {},
			isVisible: true,
			position: 'top',
			content: <div>Test content</div>,
			contentClassName: 'content-class',
			showArrow: true,
		});

		expect(props.hoverCardId).toBe('test-id');
		expect(props.className).toBe('test-class');
		expect(props.isVisible).toBe(true);
		expect(props.position).toBe('top');
		expect(props.showArrow).toBe(true);
		expect(props.contentClassName).toBe('content-class');
	});

	it('includes contentClassName when provided', () => {
		const props = buildWrapperProps({
			hoverCardId: 'test-id',
			className: undefined,
			handleMouseEnter: () => {},
			handleMouseLeave: () => {},
			handleFocus: () => {},
			handleBlur: () => {},
			isVisible: false,
			position: 'bottom',
			content: <div>Test</div>,
			contentClassName: 'custom-content',
			showArrow: false,
		});

		expect(props.contentClassName).toBe('custom-content');
	});

	it('omits contentClassName when undefined', () => {
		const props = buildWrapperProps({
			hoverCardId: 'test-id',
			className: undefined,
			handleMouseEnter: () => {},
			handleMouseLeave: () => {},
			handleFocus: () => {},
			handleBlur: () => {},
			isVisible: false,
			position: 'left',
			content: <div>Test</div>,
			contentClassName: undefined,
			showArrow: true,
		});

		expect(props).not.toHaveProperty('contentClassName');
	});

	it('handles all position variants', () => {
		const positions: HoverCardProps['position'][] = ['top', 'bottom', 'left', 'right'];
		for (const position of positions) {
			const props = buildWrapperProps({
				hoverCardId: 'test-id',
				className: undefined,
				handleMouseEnter: () => {},
				handleMouseLeave: () => {},
				handleFocus: () => {},
				handleBlur: () => {},
				isVisible: true,
				position,
				content: <div>Test</div>,
				contentClassName: undefined,
				showArrow: true,
			});

			expect(props.position).toBe(position);
		}
	});
});

describe('hoverCardHelpers - renderHoverCard', () => {
	it('renders HoverCardWrapper with children', () => {
		const handleMouseEnter = () => {};
		const handleMouseLeave = () => {};
		const handleFocus = () => {};
		const handleBlur = () => {};

		render(
			renderHoverCard({
				hoverCardId: 'test-hover-card',
				className: 'test-class',
				handleMouseEnter,
				handleMouseLeave,
				handleFocus,
				handleBlur,
				isVisible: true,
				position: 'top',
				content: <div>Hover content</div>,
				contentClassName: undefined,
				showArrow: true,
				children: <button>Hover me</button>,
			})
		);

		expect(screen.getByText('Hover me')).toBeInTheDocument();
	});

	it('renders content when visible', () => {
		const handleMouseEnter = () => {};
		const handleMouseLeave = () => {};
		const handleFocus = () => {};
		const handleBlur = () => {};

		render(
			renderHoverCard({
				hoverCardId: 'test-hover-card',
				className: undefined,
				handleMouseEnter,
				handleMouseLeave,
				handleFocus,
				handleBlur,
				isVisible: true,
				position: 'top',
				content: <div>Visible content</div>,
				contentClassName: undefined,
				showArrow: false,
				children: <span>Trigger</span>,
			})
		);

		expect(screen.getByText('Visible content')).toBeInTheDocument();
	});

	it('does not render content when not visible', () => {
		const handleMouseEnter = () => {};
		const handleMouseLeave = () => {};
		const handleFocus = () => {};
		const handleBlur = () => {};

		render(
			renderHoverCard({
				hoverCardId: 'test-hover-card',
				className: undefined,
				handleMouseEnter,
				handleMouseLeave,
				handleFocus,
				handleBlur,
				isVisible: false,
				position: 'bottom',
				content: <div>Hidden content</div>,
				contentClassName: undefined,
				showArrow: true,
				children: <span>Trigger</span>,
			})
		);

		expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('passes all props to wrapper correctly', () => {
		const handleMouseEnter = () => {};
		const handleMouseLeave = () => {};
		const handleFocus = () => {};
		const handleBlur = () => {};

		render(
			renderHoverCard({
				hoverCardId: 'custom-id',
				className: 'custom-wrapper-class',
				handleMouseEnter,
				handleMouseLeave,
				handleFocus,
				handleBlur,
				isVisible: true,
				position: 'right',
				content: <div>Right positioned content</div>,
				contentClassName: 'custom-content-class',
				showArrow: true,
				children: <div>Custom trigger</div>,
			})
		);

		expect(screen.getByText('Custom trigger')).toBeInTheDocument();
		expect(screen.getByText('Right positioned content')).toBeInTheDocument();
	});
});
