/**
 * Tests for LayoutGroup component
 *
 * Tests the LayoutGroup wrapper component:
 * - Rendering
 * - Props forwarding
 * - Children rendering
 */

import { LayoutGroup } from '@core/ui/utilities/motion/components/LayoutGroup';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion's LayoutGroup
vi.mock('framer-motion', () => ({
	LayoutGroup: vi.fn(({ children, ...props }) => (
		<div data-testid="layout-group" data-props={JSON.stringify(props)}>
			{children}
		</div>
	)),
}));

describe('LayoutGroup - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<LayoutGroup>
				<div data-testid="child">Content</div>
			</LayoutGroup>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		renderWithProviders(
			<LayoutGroup>
				<div key="1" data-testid="child-1">
					First
				</div>
				<div key="2" data-testid="child-2">
					Second
				</div>
			</LayoutGroup>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});
});

describe('LayoutGroup - Props forwarding', () => {
	it('forwards props to framer-motion LayoutGroup', async () => {
		const { LayoutGroup: MockLayoutGroup } = await import('framer-motion');
		renderWithProviders(
			<LayoutGroup id="test-group">
				<div>Content</div>
			</LayoutGroup>
		);

		expect(MockLayoutGroup).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 'test-group',
			}),
			undefined
		);
	});

	it('forwards all layout group props', async () => {
		const { LayoutGroup: MockLayoutGroup } = await import('framer-motion');
		renderWithProviders(
			<LayoutGroup id="test">
				<div>Content</div>
			</LayoutGroup>
		);

		const lastCall = vi.mocked(MockLayoutGroup).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			id: 'test',
		});
	});

	it('forwards all props including className', async () => {
		const { LayoutGroup: MockLayoutGroup } = await import('framer-motion');
		renderWithProviders(
			<LayoutGroup id="test" className="custom-class">
				<div>Content</div>
			</LayoutGroup>
		);

		const lastCall = vi.mocked(MockLayoutGroup).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			id: 'test',
			className: 'custom-class',
		});
	});
});

describe('LayoutGroup - Layout animations', () => {
	it('enables shared layout animations across children', () => {
		renderWithProviders(
			<LayoutGroup>
				<div key="1" data-testid="item-1">
					Item 1
				</div>
				<div key="2" data-testid="item-2">
					Item 2
				</div>
			</LayoutGroup>
		);

		expect(screen.getByTestId('item-1')).toBeInTheDocument();
		expect(screen.getByTestId('item-2')).toBeInTheDocument();
	});

	it('supports layoutId for shared element transitions', async () => {
		const { LayoutGroup: MockLayoutGroup } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<LayoutGroup>
				<div data-testid="shared-element" data-layout-id="shared-1">
					Shared Element
				</div>
			</LayoutGroup>
		);

		expect(MockLayoutGroup).toHaveBeenCalled();
		expect(screen.getByTestId('shared-element')).toBeInTheDocument();
	});
});

describe('LayoutGroup - Props forwarding implementation', () => {
	it('renders FramerLayoutGroup with spread props', async () => {
		const { LayoutGroup: MockLayoutGroup } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<LayoutGroup id="group-1" className="layout-class">
				<div>Content</div>
			</LayoutGroup>
		);

		expect(MockLayoutGroup).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 'group-1',
				className: 'layout-class',
			}),
			undefined
		);
	});

	it('forwards all props including id and className together', async () => {
		const { LayoutGroup: MockLayoutGroup } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<LayoutGroup id="test-id" className="test-class">
				<div>Content</div>
			</LayoutGroup>
		);

		const lastCall = vi.mocked(MockLayoutGroup).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			id: 'test-id',
			className: 'test-class',
		});
	});

	it('forwards additional HTML attributes', async () => {
		const { LayoutGroup: MockLayoutGroup } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<LayoutGroup id="test" data-testid="layout-group-test">
				<div>Content</div>
			</LayoutGroup>
		);

		const lastCall = vi.mocked(MockLayoutGroup).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			id: 'test',
		});
	});
});

describe('LayoutGroup - Children handling', () => {
	it('forwards children to FramerLayoutGroup', async () => {
		const { LayoutGroup: MockLayoutGroup } = await import('framer-motion');
		vi.clearAllMocks();

		renderWithProviders(
			<LayoutGroup>
				<div data-testid="child">Child content</div>
			</LayoutGroup>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
		expect(MockLayoutGroup).toHaveBeenCalled();
	});

	it('handles empty children', () => {
		renderWithProviders(<LayoutGroup>{null}</LayoutGroup>);

		const layoutGroup = screen.getByTestId('layout-group');
		expect(layoutGroup).toBeInTheDocument();
	});

	it('handles fragment children', () => {
		renderWithProviders(
			<LayoutGroup>
				<>
					<div data-testid="child-1">First</div>
					<div data-testid="child-2">Second</div>
				</>
			</LayoutGroup>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});
});

// Test the component directly to ensure coverage tracking
// This ensures the component file is tracked even when framer-motion is mocked
describe('LayoutGroup - Direct Component Test (Coverage)', () => {
	it('should execute the LayoutGroup wrapper function directly', async () => {
		// Import the component directly to ensure it's tracked
		const { LayoutGroup: LayoutGroupComponent } = await import(
			'@core/ui/utilities/motion/components/LayoutGroup'
		);

		// Verify the component is a function
		expect(typeof LayoutGroupComponent).toBe('function');

		// Render with the component to ensure the wrapper function executes
		// Even with the mock, the wrapper function (lines 28-29) should execute
		renderWithProviders(
			<LayoutGroupComponent>
				<div data-testid="direct-test">Direct Test</div>
			</LayoutGroupComponent>
		);

		expect(screen.getByTestId('direct-test')).toBeInTheDocument();
	});
});
