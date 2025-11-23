/**
 * Tests for MotionSharedElement component
 *
 * Tests the MotionSharedElement component:
 * - Rendering
 * - LayoutId prop
 * - Layout prop
 * - Props forwarding
 * - Children rendering
 */

import { MotionSharedElement } from '@core/ui/utilities/motion/components/MotionSharedElement';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const DEFAULT_LAYOUT_ID = 'test-id';
const DEFAULT_CHILDREN = <div>Content</div>;
const MOTION_DIV_TEST_ID = 'motion-div';
const DATA_LAYOUT_ID_ATTR = 'data-layout-id';
const DATA_LAYOUT_ATTR = 'data-layout';
const EMPTY_OBJECT_JSON = '{}';

// Helper function to get motion div element
const getMotionDiv = () => screen.getByTestId(MOTION_DIV_TEST_ID);

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: vi.fn(
			({
				children,
				layoutId,
				layout,
				className,
				...props
			}: {
				children?: ReactNode;
				layoutId?: string;
				layout?: boolean | 'position' | 'size' | 'preserve-aspect';
				className?: string;
				[key: string]: unknown;
			}) => (
				<div
					data-testid="motion-div"
					data-layout-id={layoutId}
					data-layout={String(layout)}
					className={className}
					data-props={JSON.stringify(props)}
				>
					{children}
				</div>
			)
		),
	},
}));

describe('MotionSharedElement - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID}>
				<div data-testid="child">Content</div>
			</MotionSharedElement>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID}>
				<div data-testid="child-1">First</div>
				<div data-testid="child-2">Second</div>
			</MotionSharedElement>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});

	it('renders motion.div with layoutId', () => {
		renderWithProviders(
			<MotionSharedElement layoutId="shared-element-1">{DEFAULT_CHILDREN}</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toBeInTheDocument();
		expect(motionDiv).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'shared-element-1');
	});
});

describe('MotionSharedElement - LayoutId prop', () => {
	it('forwards layoutId to motion.div', () => {
		renderWithProviders(
			<MotionSharedElement layoutId="unique-id-123">{DEFAULT_CHILDREN}</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'unique-id-123');
	});

	it('handles different layoutId values', () => {
		const { rerender } = renderWithProviders(
			<MotionSharedElement layoutId="id-1">{DEFAULT_CHILDREN}</MotionSharedElement>
		);

		expect(getMotionDiv()).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'id-1');

		rerender(<MotionSharedElement layoutId="id-2">{DEFAULT_CHILDREN}</MotionSharedElement>);

		expect(getMotionDiv()).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'id-2');
	});
});

describe('MotionSharedElement - Layout prop', () => {
	it('uses default layout true', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID}>{DEFAULT_CHILDREN}</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveAttribute(DATA_LAYOUT_ATTR, 'true');
	});

	it('forwards layout false', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID} layout={false}>
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveAttribute(DATA_LAYOUT_ATTR, 'false');
	});

	it('forwards layout position', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID} layout="position">
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveAttribute(DATA_LAYOUT_ATTR, 'position');
	});

	it('forwards layout size', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID} layout="size">
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveAttribute(DATA_LAYOUT_ATTR, 'size');
	});

	it('forwards layout preserve-aspect', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID} layout="preserve-aspect">
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveAttribute(DATA_LAYOUT_ATTR, 'preserve-aspect');
	});
});

describe('MotionSharedElement - Props forwarding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards className to motion.div', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID} className="custom-class">
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveClass('custom-class');
	});

	it('forwards additional props to motion.div', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID} data-test="value" aria-label="Test">
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		const props = JSON.parse(motionDiv.dataset.props ?? EMPTY_OBJECT_JSON);
		expect(props).toMatchObject({
			'data-test': 'value',
			'aria-label': 'Test',
		});
	});

	it('forwards all motion props', () => {
		renderWithProviders(
			<MotionSharedElement
				layoutId={DEFAULT_LAYOUT_ID}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		const props = JSON.parse(motionDiv.dataset.props ?? EMPTY_OBJECT_JSON);
		expect(props).toMatchObject({
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
		});
	});
});

describe('MotionSharedElement - Edge cases', () => {
	it('handles empty children', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID}>{null}</MotionSharedElement>
		);

		expect(getMotionDiv()).toBeInTheDocument();
	});

	it('handles fragment children', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID}>
				<>
					<div data-testid="child-1">First</div>
					<div data-testid="child-2">Second</div>
				</>
			</MotionSharedElement>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});

	it('handles complex layoutId values', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={`item-${123}-${'test'}`}>
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'item-123-test');
	});

	it('handles className with multiple classes', () => {
		renderWithProviders(
			<MotionSharedElement layoutId={DEFAULT_LAYOUT_ID} className="class1 class2 class3">
				{DEFAULT_CHILDREN}
			</MotionSharedElement>
		);

		const motionDiv = getMotionDiv();
		expect(motionDiv).toHaveClass('class1', 'class2', 'class3');
	});
});

describe('MotionSharedElement - Shared element transitions', () => {
	it('enables shared element transitions with same layoutId', () => {
		const { rerender } = renderWithProviders(
			<MotionSharedElement layoutId="shared-1">
				<div data-testid="element-1">Element 1</div>
			</MotionSharedElement>
		);

		expect(getMotionDiv()).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'shared-1');

		// Simulate transition to different view with same layoutId
		rerender(
			<MotionSharedElement layoutId="shared-1">
				<div data-testid="element-2">Element 2</div>
			</MotionSharedElement>
		);

		expect(getMotionDiv()).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'shared-1');
	});

	it('handles different layoutIds for different elements', () => {
		renderWithProviders(
			<>
				<MotionSharedElement layoutId="element-1">
					<div>First</div>
				</MotionSharedElement>
				<MotionSharedElement layoutId="element-2">
					<div>Second</div>
				</MotionSharedElement>
			</>
		);

		const motionDivs = screen.getAllByTestId(MOTION_DIV_TEST_ID);
		expect(motionDivs[0]).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'element-1');
		expect(motionDivs[1]).toHaveAttribute(DATA_LAYOUT_ID_ATTR, 'element-2');
	});
});

// Test the component directly to ensure coverage tracking
// This ensures the component file is tracked even when framer-motion is mocked
describe('MotionSharedElement - Direct Component Test (Coverage)', () => {
	it('should execute the MotionSharedElement function directly', async () => {
		// Import the component directly to ensure it's tracked
		const { MotionSharedElement: MotionSharedElementComponent } = await import(
			'@core/ui/utilities/motion/components/MotionSharedElement'
		);

		// Verify the component is a function
		expect(typeof MotionSharedElementComponent).toBe('function');

		// Render with the component to ensure the wrapper function executes
		// Even with the mock, the wrapper function (lines 56-68) should execute
		renderWithProviders(
			<MotionSharedElementComponent layoutId="test-id">
				<div data-testid="direct-test">Direct Test</div>
			</MotionSharedElementComponent>
		);

		expect(screen.getByTestId('direct-test')).toBeInTheDocument();
	});
});
