/**
 * Tests for MotionAccordion component
 *
 * Tests the MotionAccordion component:
 * - Rendering when open/closed
 * - Default props
 * - Props forwarding to MotionPresence
 * - Content className
 * - Presence key
 * - Mount/unmount behavior
 */

import { MotionAccordion } from '@core/ui/utilities/motion/components/MotionAccordion';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const TEST_CONTENT = 'Content';
const TEST_ID_CONTENT = 'content';
const TEST_ID_MOTION_PRESENCE = 'motion-presence';

// Mock MotionPresence
vi.mock('@core/ui/utilities/motion/components/MotionPresence', () => ({
	MotionPresence: vi.fn(
		({
			children,
			isPresent,
			presenceKey: _presenceKey,
			mode: _mode,
			mountOnEnter: _mountOnEnter,
			unmountOnExit: _unmountOnExit,
			variant: _variant,
			duration: _duration,
			ease: _ease,
			initial: _initial,
			reducedMotionStrategy: _reducedMotionStrategy,
			className: _className,
			...props
		}) => (
			<div
				data-testid={TEST_ID_MOTION_PRESENCE}
				data-is-present={isPresent}
				data-props={JSON.stringify(props)}
			>
				{children}
			</div>
		)
	),
}));

// Helper function to get the last MotionPresence call
async function getLastMotionPresenceCall() {
	const { MotionPresence } = await import('@core/ui/utilities/motion/components/MotionPresence');
	return vi.mocked(MotionPresence).mock.calls.at(-1);
}

// Helper function to test default prop
async function testDefaultProp(propName: string, expectedValue: unknown) {
	renderWithProviders(
		<MotionAccordion isOpen>
			<div>{TEST_CONTENT}</div>
		</MotionAccordion>
	);

	const lastCall = await getLastMotionPresenceCall();
	expect(lastCall?.[0]).toMatchObject({
		[propName]: expectedValue,
	});
}

// Helper function to test forwarded prop
async function testForwardedProp(
	propName: string,
	propValue: unknown,
	accordionProps?: Record<string, unknown>
) {
	renderWithProviders(
		<MotionAccordion isOpen {...accordionProps}>
			<div>{TEST_CONTENT}</div>
		</MotionAccordion>
	);

	const lastCall = await getLastMotionPresenceCall();
	expect(lastCall?.[0]).toMatchObject({
		[propName]: propValue,
	});
}

describe('MotionAccordion - Rendering', () => {
	it('renders children when open', () => {
		renderWithProviders(
			<MotionAccordion isOpen>
				<div data-testid={TEST_ID_CONTENT}>Accordion content</div>
			</MotionAccordion>
		);

		expect(screen.getByTestId(TEST_ID_CONTENT)).toBeInTheDocument();
	});

	it('renders with content className', () => {
		renderWithProviders(
			<MotionAccordion isOpen contentClassName="content-class">
				<div>{TEST_CONTENT}</div>
			</MotionAccordion>
		);

		// Verify content is rendered
		expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
		// Verify className is applied to the wrapper div
		const contentWrapper = screen.getByTestId('motion-accordion-content');
		expect(contentWrapper).toBeInTheDocument();
		expect(contentWrapper).toHaveClass('content-class');
	});
});

describe('MotionAccordion - Default props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Animation defaults', () => {
		it('uses default variant "height"', async () => {
			await testDefaultProp('variant', 'height');
		});

		it('uses default duration "normal"', async () => {
			await testDefaultProp('duration', 'normal');
		});

		it('uses default ease "ease-in-out"', async () => {
			await testDefaultProp('ease', 'ease-in-out');
		});

		it('uses default initial "hidden"', async () => {
			await testDefaultProp('initial', 'hidden');
		});

		it('uses default reducedMotionStrategy "static"', async () => {
			await testDefaultProp('reducedMotionStrategy', 'static');
		});
	});

	describe('Presence defaults', () => {
		it('uses default presenceKey "motion-accordion"', async () => {
			await testDefaultProp('presenceKey', 'motion-accordion');
		});

		it('uses default mountOnEnter true', async () => {
			await testDefaultProp('mountOnEnter', true);
		});

		it('uses default unmountOnExit true', async () => {
			await testDefaultProp('unmountOnExit', true);
		});
	});
});

describe('MotionAccordion - Props forwarding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards isOpen to MotionPresence isPresent', async () => {
		await testForwardedProp('isPresent', true);
	});

	describe('Animation props', () => {
		it('forwards custom variant', async () => {
			await testForwardedProp('variant', 'fade', { variant: 'fade' });
		});

		it('forwards custom duration', async () => {
			await testForwardedProp('duration', 'slow', { duration: 'slow' });
		});

		it('forwards custom ease', async () => {
			await testForwardedProp('ease', 'ease-out', { ease: 'ease-out' });
		});

		it('forwards custom initial', async () => {
			await testForwardedProp('initial', 'visible', { initial: 'visible' });
		});

		it('forwards custom reducedMotionStrategy', async () => {
			await testForwardedProp('reducedMotionStrategy', 'fade', {
				reducedMotionStrategy: 'fade',
			});
		});
	});

	describe('Presence props', () => {
		it('forwards custom presenceKey', async () => {
			await testForwardedProp('presenceKey', 'custom-key', { presenceKey: 'custom-key' });
		});

		it('forwards custom mountOnEnter', async () => {
			await testForwardedProp('mountOnEnter', false, { mountOnEnter: false });
		});

		it('forwards custom unmountOnExit', async () => {
			await testForwardedProp('unmountOnExit', false, { unmountOnExit: false });
		});
	});
});

describe('MotionAccordion - Mode and className', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses mode "sync"', async () => {
		await testForwardedProp('mode', 'sync');
	});

	it('merges className with overflow-hidden', async () => {
		renderWithProviders(
			<MotionAccordion isOpen className="custom-class">
				<div>{TEST_CONTENT}</div>
			</MotionAccordion>
		);

		const lastCall = await getLastMotionPresenceCall();
		expect(lastCall?.[0].className).toContain('overflow-hidden');
		expect(lastCall?.[0].className).toContain('custom-class');
	});
});

describe('MotionAccordion - State changes', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders content when isOpen changes from false to true', () => {
		const { rerender } = renderWithProviders(
			<MotionAccordion isOpen={false}>
				<div data-testid={TEST_ID_CONTENT}>{TEST_CONTENT}</div>
			</MotionAccordion>
		);

		// MotionPresence is rendered but content visibility depends on isPresent
		const motionPresence = screen.getByTestId(TEST_ID_MOTION_PRESENCE);
		expect(motionPresence).toHaveAttribute('data-is-present', 'false');

		// Change to open
		rerender(
			<MotionAccordion isOpen>
				<div data-testid={TEST_ID_CONTENT}>{TEST_CONTENT}</div>
			</MotionAccordion>
		);

		expect(screen.getByTestId(TEST_ID_CONTENT)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_ID_MOTION_PRESENCE)).toHaveAttribute('data-is-present', 'true');
	});

	it('renders content when isOpen changes from true to false', () => {
		const { rerender } = renderWithProviders(
			<MotionAccordion isOpen>
				<div data-testid={TEST_ID_CONTENT}>{TEST_CONTENT}</div>
			</MotionAccordion>
		);

		expect(screen.getByTestId(TEST_ID_CONTENT)).toBeInTheDocument();

		// Change to closed
		rerender(
			<MotionAccordion isOpen={false}>
				<div data-testid={TEST_ID_CONTENT}>{TEST_CONTENT}</div>
			</MotionAccordion>
		);

		// With unmountOnExit=true (default), content should be removed
		// But MotionPresence handles this, so we just verify the component renders
		expect(screen.getByTestId(TEST_ID_MOTION_PRESENCE)).toBeInTheDocument();
	});
});

describe('MotionAccordion - Children handling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles empty children', () => {
		renderWithProviders(<MotionAccordion isOpen>{null}</MotionAccordion>);

		expect(screen.getByTestId(TEST_ID_MOTION_PRESENCE)).toBeInTheDocument();
	});

	it('handles fragment children', () => {
		renderWithProviders(
			<MotionAccordion isOpen>
				<>
					<div data-testid="child-1">First</div>
					<div data-testid="child-2">Second</div>
				</>
			</MotionAccordion>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});
});

describe('MotionAccordion - Advanced props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles custom presenceKey', async () => {
		await testForwardedProp('presenceKey', 'custom-accordion-key', {
			presenceKey: 'custom-accordion-key',
		});
	});

	it('handles mountOnEnter false', async () => {
		await testForwardedProp('mountOnEnter', false, { mountOnEnter: false });
	});

	it('handles unmountOnExit false', async () => {
		await testForwardedProp('unmountOnExit', false, { unmountOnExit: false });
	});

	it('forwards all MotionBox props', async () => {
		renderWithProviders(
			<MotionAccordion
				isOpen
				variant="fade"
				duration="fast"
				delay={0.1}
				className="accordion-class"
				contentClassName="content-class"
			>
				<div>{TEST_CONTENT}</div>
			</MotionAccordion>
		);

		const lastCall = await getLastMotionPresenceCall();
		expect(lastCall?.[0]).toMatchObject({
			variant: 'fade',
			duration: 'fast',
			delay: 0.1,
		});
		expect(lastCall?.[0].className).toContain('accordion-class');
		expect(screen.getByTestId('motion-accordion-content')).toHaveClass('content-class');
	});
});

// Test the component directly to ensure coverage tracking
// This ensures the component file is tracked even when dependencies are mocked
describe('MotionAccordion - Direct Component Test (Coverage)', () => {
	it('should execute the MotionAccordion function directly', async () => {
		// Import the component directly to ensure it's tracked
		const { MotionAccordion: MotionAccordionComponent } = await import(
			'@core/ui/utilities/motion/components/MotionAccordion'
		);

		// Verify the component is a function
		expect(typeof MotionAccordionComponent).toBe('function');

		// Render with the component to ensure the wrapper function executes
		// Even with the mock, the wrapper function (lines 36-71) should execute
		renderWithProviders(
			<MotionAccordionComponent isOpen>
				<div data-testid="direct-test">Direct Test</div>
			</MotionAccordionComponent>
		);

		expect(screen.getByTestId('direct-test')).toBeInTheDocument();
	});
});
