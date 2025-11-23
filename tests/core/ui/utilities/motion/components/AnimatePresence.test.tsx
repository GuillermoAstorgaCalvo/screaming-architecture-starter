/**
 * Tests for AnimatePresence component
 *
 * Tests the AnimatePresence wrapper component:
 * - Rendering
 * - Props forwarding
 * - Default values
 * - Mode configuration
 */

import { AnimatePresence } from '@core/ui/utilities/motion/components/AnimatePresence';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion's AnimatePresence
vi.mock('framer-motion', () => ({
	AnimatePresence: vi.fn(({ children }) => <div data-testid="animate-presence">{children}</div>),
}));

describe('AnimatePresence - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<AnimatePresence>
				<div data-testid="child">Content</div>
			</AnimatePresence>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		renderWithProviders(
			<AnimatePresence>
				<div key="1" data-testid="child-1">
					First
				</div>
				<div key="2" data-testid="child-2">
					Second
				</div>
			</AnimatePresence>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});
});

describe('AnimatePresence - Props', () => {
	it('forwards mode prop to framer-motion', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		renderWithProviders(
			<AnimatePresence mode="wait">
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenLastCalledWith(
			expect.objectContaining({
				mode: 'wait',
			}),
			undefined
		);
	});

	it('forwards initial prop to framer-motion', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		renderWithProviders(
			<AnimatePresence initial={false}>
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenLastCalledWith(
			expect.objectContaining({
				initial: false,
			}),
			undefined
		);
	});

	it('uses default mode "sync"', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		renderWithProviders(
			<AnimatePresence>
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenLastCalledWith(
			expect.objectContaining({
				mode: 'sync',
			}),
			undefined
		);
	});

	it('uses default initial true', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		renderWithProviders(
			<AnimatePresence>
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenLastCalledWith(
			expect.objectContaining({
				initial: true,
			}),
			undefined
		);
	});
});

describe('AnimatePresence - Mode values', () => {
	it('supports different mode values', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		const { rerender } = renderWithProviders(
			<AnimatePresence mode="popLayout">
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenLastCalledWith(
			expect.objectContaining({
				mode: 'popLayout',
			}),
			undefined
		);

		rerender(
			<AnimatePresence mode="sync">
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenLastCalledWith(
			expect.objectContaining({
				mode: 'sync',
			}),
			undefined
		);
	});
});

describe('AnimatePresence - Exit animations', () => {
	it('enables exit animations for children with exit prop', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence>
				<div key="item" data-testid="item">
					Item
				</div>
			</AnimatePresence>
		);

		// AnimatePresence should be called to enable exit animations
		expect(MockAnimatePresence).toHaveBeenCalled();
		expect(screen.getByTestId('item')).toBeInTheDocument();
	});

	it('handles multiple children with exit animations', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence>
				<div key="1" data-testid="child-1">
					First
				</div>
				<div key="2" data-testid="child-2">
					Second
				</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalled();
		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});
});

describe('AnimatePresence - Exit animation modes', () => {
	it('supports wait mode for sequential exit animations', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence mode="wait">
				<div key="item" data-testid="item">
					Item
				</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'wait',
			}),
			undefined
		);
	});

	it('supports sync mode for simultaneous exit animations', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence mode="sync">
				<div key="item" data-testid="item">
					Item
				</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'sync',
			}),
			undefined
		);
	});

	it('supports popLayout mode for layout-aware exit animations', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence mode="popLayout">
				<div key="item" data-testid="item">
					Item
				</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'popLayout',
			}),
			undefined
		);
	});
});

describe('AnimatePresence - Initial animation control', () => {
	it('controls initial animation with initial prop', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence initial={false}>
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				initial: false,
			}),
			undefined
		);
	});

	it('enables initial animation by default', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence>
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				initial: true,
			}),
			undefined
		);
	});

	it('handles initial prop changes', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		const { rerender } = renderWithProviders(
			<AnimatePresence initial={true}>
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				initial: true,
			}),
			undefined
		);

		rerender(
			<AnimatePresence initial={false}>
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenLastCalledWith(
			expect.objectContaining({
				initial: false,
			}),
			undefined
		);
	});
});

describe('AnimatePresence - Props structure', () => {
	it('renders FramerAnimatePresence with correct props structure', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence mode="wait" initial={false}>
				<div>Content</div>
			</AnimatePresence>
		);

		// Verify the component calls FramerAnimatePresence with both mode and initial
		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'wait',
				initial: false,
			}),
			undefined
		);
	});
});

describe('AnimatePresence - Children handling', () => {
	it('passes children to FramerAnimatePresence', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence>
				<div data-testid="child">Child content</div>
			</AnimatePresence>
		);

		// Children should be rendered
		expect(screen.getByTestId('child')).toBeInTheDocument();
		// AnimatePresence should have been called
		expect(MockAnimatePresence).toHaveBeenCalled();
	});
});

describe('AnimatePresence - Default values', () => {
	it('uses default values when props are not provided', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence>
				<div>Content</div>
			</AnimatePresence>
		);

		// Should use defaults: mode='sync', initial=true
		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'sync',
				initial: true,
			}),
			undefined
		);
	});

	it('handles undefined mode prop by using default', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence initial={false}>
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'sync',
				initial: false,
			}),
			undefined
		);
	});

	it('handles undefined initial prop by using default', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<AnimatePresence mode="popLayout">
				<div>Content</div>
			</AnimatePresence>
		);

		expect(MockAnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'popLayout',
				initial: true,
			}),
			undefined
		);
	});
});

describe('AnimatePresence - Edge cases', () => {
	it('renders with null children', async () => {
		const { AnimatePresence: MockAnimatePresence } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(<AnimatePresence>{null}</AnimatePresence>);

		expect(MockAnimatePresence).toHaveBeenCalled();
	});
});

// Test the component directly to ensure coverage tracking
// This ensures the component file is tracked even when framer-motion is mocked
describe('AnimatePresence - Direct Component Test (Coverage)', () => {
	it('should execute the AnimatePresence wrapper function directly', async () => {
		// Import the component directly to ensure it's tracked
		const { AnimatePresence: AnimatePresenceComponent } = await import(
			'@core/ui/utilities/motion/components/AnimatePresence'
		);

		// Verify the component is a function
		expect(typeof AnimatePresenceComponent).toBe('function');

		// Render with the component to ensure the wrapper function executes
		// Even with the mock, the wrapper function (lines 59-68) should execute
		renderWithProviders(
			<AnimatePresenceComponent>
				<div data-testid="direct-test">Direct Test</div>
			</AnimatePresenceComponent>
		);

		expect(screen.getByTestId('direct-test')).toBeInTheDocument();
	});
});
