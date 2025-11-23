/**
 * PullToRefreshIndicators Component Tests
 *
 * Tests for the PullToRefreshIndicators component:
 * - renderIndicator
 * - createIndicatorProps
 * - createIndicatorNode
 * - Default indicators
 * - Custom indicators
 */

import {
	createIndicatorNode,
	createIndicatorProps,
	renderIndicator,
} from '@core/ui/utilities/pull-to-refresh/components/PullToRefreshIndicators';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const RELEASE_TO_REFRESH_TEXT = 'Release to refresh';
const PULL_TO_REFRESH_TEXT = 'Pull to refresh';

describe('PullToRefreshIndicators - renderIndicator - default indicators', () => {
	it('renders refreshing indicator when isRefreshing is true', () => {
		render(<div>{renderIndicator({ isRefreshing: true, canRelease: false })}</div>);

		// Should show spinner
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('renders release indicator when canRelease is true and not refreshing', () => {
		render(<div>{renderIndicator({ isRefreshing: false, canRelease: true })}</div>);

		expect(screen.getByText(RELEASE_TO_REFRESH_TEXT)).toBeInTheDocument();
	});

	it('renders pull indicator when canRelease is false and not refreshing', () => {
		render(<div>{renderIndicator({ isRefreshing: false, canRelease: false })}</div>);

		expect(screen.getByText(PULL_TO_REFRESH_TEXT)).toBeInTheDocument();
	});
});

describe('PullToRefreshIndicators - renderIndicator - custom indicators', () => {
	it('uses custom refreshing indicator when provided', () => {
		const customRefreshing = <div data-testid="custom-refreshing">Custom Refreshing</div>;
		render(
			<div>
				{renderIndicator({
					isRefreshing: true,
					canRelease: false,
					refreshingIndicator: customRefreshing,
				})}
			</div>
		);

		expect(screen.getByTestId('custom-refreshing')).toBeInTheDocument();
		expect(screen.queryByText(PULL_TO_REFRESH_TEXT)).not.toBeInTheDocument();
	});

	it('uses custom release indicator when provided', () => {
		const customRelease = <div data-testid="custom-release">Custom Release</div>;
		render(
			<div>
				{renderIndicator({
					isRefreshing: false,
					canRelease: true,
					releaseIndicator: customRelease,
				})}
			</div>
		);

		expect(screen.getByTestId('custom-release')).toBeInTheDocument();
		expect(screen.queryByText(RELEASE_TO_REFRESH_TEXT)).not.toBeInTheDocument();
	});

	it('uses custom pull indicator when provided', () => {
		const customPull = <div data-testid="custom-pull">Custom Pull</div>;
		render(
			<div>
				{renderIndicator({
					isRefreshing: false,
					canRelease: false,
					pullIndicator: customPull,
				})}
			</div>
		);

		expect(screen.getByTestId('custom-pull')).toBeInTheDocument();
		expect(screen.queryByText(PULL_TO_REFRESH_TEXT)).not.toBeInTheDocument();
	});
});

describe('PullToRefreshIndicators - renderIndicator - state prioritization', () => {
	it('prioritizes refreshing over release state', () => {
		render(
			<div>
				{renderIndicator({
					isRefreshing: true,
					canRelease: true,
				})}
			</div>
		);

		// Should show spinner, not release text
		expect(screen.getByRole('status')).toBeInTheDocument();
		expect(screen.queryByText(RELEASE_TO_REFRESH_TEXT)).not.toBeInTheDocument();
	});
});

describe('PullToRefreshIndicators - createIndicatorProps', () => {
	it('creates indicator props correctly', () => {
		const props = createIndicatorProps({
			isRefreshing: false,
			canRelease: true,
			pullIndicator: <div>Pull</div>,
			releaseIndicator: <div>Release</div>,
			refreshingIndicator: <div>Refreshing</div>,
		});

		expect(props.isRefreshing).toBe(false);
		expect(props.canRelease).toBe(true);
		expect(props.pullIndicator).toBeDefined();
		expect(props.releaseIndicator).toBeDefined();
		expect(props.refreshingIndicator).toBeDefined();
	});

	it('handles undefined custom indicators', () => {
		const props = createIndicatorProps({
			isRefreshing: false,
			canRelease: false,
		});

		expect(props.isRefreshing).toBe(false);
		expect(props.canRelease).toBe(false);
		expect(props.pullIndicator).toBeUndefined();
		expect(props.releaseIndicator).toBeUndefined();
		expect(props.refreshingIndicator).toBeUndefined();
	});
});

describe('PullToRefreshIndicators - createIndicatorNode', () => {
	it('creates indicator node correctly', () => {
		render(
			<div>
				{createIndicatorNode({
					isRefreshing: false,
					canRelease: false,
				})}
			</div>
		);

		expect(screen.getByText(PULL_TO_REFRESH_TEXT)).toBeInTheDocument();
	});

	it('creates refreshing indicator node', () => {
		render(
			<div>
				{createIndicatorNode({
					isRefreshing: true,
					canRelease: false,
				})}
			</div>
		);

		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('creates release indicator node', () => {
		render(
			<div>
				{createIndicatorNode({
					isRefreshing: false,
					canRelease: true,
				})}
			</div>
		);

		expect(screen.getByText(RELEASE_TO_REFRESH_TEXT)).toBeInTheDocument();
	});

	it('uses custom indicators when provided', () => {
		const customPull = <div data-testid="custom-pull">Custom Pull</div>;
		render(
			<div>
				{createIndicatorNode({
					isRefreshing: false,
					canRelease: false,
					pullIndicator: customPull,
				})}
			</div>
		);

		expect(screen.getByTestId('custom-pull')).toBeInTheDocument();
	});
});
