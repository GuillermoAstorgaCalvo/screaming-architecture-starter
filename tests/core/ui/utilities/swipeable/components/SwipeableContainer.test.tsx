/**
 * SwipeableContainer Component Tests
 *
 * Tests for the SwipeableContainer component:
 * - Rendering
 * - Touch event handlers
 * - Action visibility
 * - Content styling
 * - Ref handling
 * - ClassName merging
 */

import { SwipeableContainer } from '@core/ui/utilities/swipeable/SwipeableContainer';
import type { SwipeableAction } from '@src-types/ui/overlays/interactions';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { describe, expect, it, type Mock, vi } from 'vitest';

const SWIPEABLE_CONTAINER_TEST_ID = 'swipeable-container';

/**
 * Test handlers interface
 */
interface TestHandlers {
	handleTouchStart: Mock;
	handleTouchMove: Mock;
	handleTouchEnd: Mock;
	handleActionClick: Mock;
}

/**
 * Creates default test handlers
 */
function createTestHandlers(): TestHandlers {
	return {
		handleTouchStart: vi.fn(),
		handleTouchMove: vi.fn(),
		handleTouchEnd: vi.fn(),
		handleActionClick: vi.fn(),
	};
}

/**
 * Renders SwipeableContainer with default props
 */
function renderSwipeableContainer(
	containerRef: RefObject<HTMLDivElement | null>,
	handlers: TestHandlers,
	overrides?: {
		showActions?: boolean;
		actions?: readonly SwipeableAction[];
		actionsContainerStyle?: CSSProperties;
		contentStyle?: CSSProperties;
		className?: string;
		children?: ReactNode;
		'data-testid'?: string;
	}
) {
	const {
		showActions = false,
		actions = [],
		actionsContainerStyle = {},
		contentStyle = {},
		className,
		children = <div>Test</div>,
		'data-testid': dataTestId,
	} = overrides ?? {};

	return renderWithProviders(
		<SwipeableContainer
			containerRef={containerRef}
			className={className}
			handleTouchStart={handlers.handleTouchStart}
			handleTouchMove={handlers.handleTouchMove}
			handleTouchEnd={handlers.handleTouchEnd}
			showActions={showActions}
			actions={actions}
			actionsContainerStyle={actionsContainerStyle}
			handleActionClick={handlers.handleActionClick}
			contentStyle={contentStyle}
			data-testid={dataTestId}
		>
			{children}
		</SwipeableContainer>
	);
}

describe('SwipeableContainer - Rendering', () => {
	it('renders container with children', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();

		renderSwipeableContainer(containerRef, handlers, {
			children: <div>Test Content</div>,
		});

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('applies default className', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();

		renderSwipeableContainer(containerRef, handlers, {
			'data-testid': SWIPEABLE_CONTAINER_TEST_ID,
		});

		const containerElement = screen.getByTestId(SWIPEABLE_CONTAINER_TEST_ID);
		expect(containerElement).toHaveClass('relative');
		expect(containerElement).toHaveClass('overflow-hidden');
	});

	it('merges custom className with default classes', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();

		renderSwipeableContainer(containerRef, handlers, {
			className: 'custom-class',
			'data-testid': SWIPEABLE_CONTAINER_TEST_ID,
		});

		const containerElement = screen.getByTestId(SWIPEABLE_CONTAINER_TEST_ID);
		expect(containerElement).toHaveClass('custom-class');
		expect(containerElement).toHaveClass('relative');
		expect(containerElement).toHaveClass('overflow-hidden');
	});

	it('applies ref to container element', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();

		renderSwipeableContainer(containerRef, handlers);

		expect(containerRef.current).toBeInstanceOf(HTMLDivElement);
	});
});

/**
 * Gets the container element from the rendered component
 */
function getContainerElement(testId = SWIPEABLE_CONTAINER_TEST_ID): HTMLElement {
	return screen.getByTestId(testId);
}

/**
 * Tests touch start event handling
 */
function testTouchStart() {
	const containerRef = createRef<HTMLDivElement>();
	const handlers = createTestHandlers();

	renderSwipeableContainer(containerRef, handlers, {
		'data-testid': SWIPEABLE_CONTAINER_TEST_ID,
	});

	const containerElement = getContainerElement();
	fireEvent.touchStart(containerElement, {
		touches: [{ clientX: 100, clientY: 50 }],
	});

	expect(handlers.handleTouchStart).toHaveBeenCalledTimes(1);
}

/**
 * Tests touch move event handling
 */
function testTouchMove() {
	const containerRef = createRef<HTMLDivElement>();
	const handlers = createTestHandlers();

	renderSwipeableContainer(containerRef, handlers, {
		'data-testid': SWIPEABLE_CONTAINER_TEST_ID,
	});

	const containerElement = getContainerElement();
	fireEvent.touchMove(containerElement, {
		touches: [{ clientX: 150, clientY: 50 }],
	});

	expect(handlers.handleTouchMove).toHaveBeenCalledTimes(1);
}

/**
 * Tests touch end event handling
 */
function testTouchEnd() {
	const containerRef = createRef<HTMLDivElement>();
	const handlers = createTestHandlers();

	renderSwipeableContainer(containerRef, handlers, {
		'data-testid': SWIPEABLE_CONTAINER_TEST_ID,
	});

	const containerElement = getContainerElement();
	fireEvent.touchEnd(containerElement);

	expect(handlers.handleTouchEnd).toHaveBeenCalledTimes(1);
}

describe('SwipeableContainer - Touch Event Handlers', () => {
	it('calls handleTouchStart on touch start', () => {
		testTouchStart();
	});

	it('calls handleTouchMove on touch move', () => {
		testTouchMove();
	});

	it('calls handleTouchEnd on touch end', () => {
		testTouchEnd();
	});
});

describe('SwipeableContainer - Action Visibility', () => {
	it('does not render actions when showActions is false', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();
		const actions: readonly SwipeableAction[] = [{ id: 'edit', content: 'Edit' }];

		renderSwipeableContainer(containerRef, handlers, {
			showActions: false,
			actions,
			actionsContainerStyle: { left: 0, width: '100px' },
		});

		expect(screen.queryByText('Edit')).not.toBeInTheDocument();
	});

	it('renders actions when showActions is true', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();
		const actions: readonly SwipeableAction[] = [{ id: 'edit', content: 'Edit' }];

		renderSwipeableContainer(containerRef, handlers, {
			showActions: true,
			actions,
			actionsContainerStyle: { left: 0, width: '100px' },
		});

		expect(screen.getByText('Edit')).toBeInTheDocument();
	});
});

describe('SwipeableContainer - Content Styling', () => {
	it('applies contentStyle to content wrapper', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();
		const contentStyle = { transform: 'translate(100px, 0px)' };

		renderSwipeableContainer(containerRef, handlers, {
			contentStyle,
		});

		const contentWrapper = screen.getByTestId('swipeable-content');
		expect(contentWrapper).toHaveStyle({ transform: 'translate(100px, 0px)' });
	});

	it('applies transition classes to content wrapper', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();

		renderSwipeableContainer(containerRef, handlers);

		const contentWrapper = screen.getByTestId('swipeable-content');
		expect(contentWrapper).toHaveClass('transition-transform');
		expect(contentWrapper).toHaveClass('duration-normal');
		expect(contentWrapper).toHaveClass('ease-out');
	});
});

describe('SwipeableContainer - Props Forwarding', () => {
	it('forwards additional props to container element', () => {
		const containerRef = createRef<HTMLDivElement>();
		const handlers = createTestHandlers();

		renderSwipeableContainer(containerRef, handlers, {
			'data-testid': SWIPEABLE_CONTAINER_TEST_ID,
		});

		const containerElement = screen.getByTestId(SWIPEABLE_CONTAINER_TEST_ID);
		expect(containerElement).toBeInTheDocument();
	});
});
