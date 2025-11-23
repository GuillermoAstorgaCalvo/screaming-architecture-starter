/**
 * LoadingWrapperHelpers.loading.render Tests
 *
 * Tests for the loading state rendering helpers including:
 * - renderSkeletonState
 * - renderSpinnerState
 */

import { ARIA_LABELS, ARIA_LIVE } from '@core/constants/aria';
import {
	renderSkeletonState,
	renderSpinnerState,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.loading.render';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const TEST_CLASS = 'test-class';
const CUSTOM_CLASS = 'custom-class';
const SKELETON_CONTAINER_TEST_ID = 'skeleton-container';

describe('renderSkeletonState', () => {
	it('renders custom skeleton component when provided', () => {
		const props = {
			skeletonComponent: <div data-testid="custom-skeleton">Custom Skeleton</div>,
			className: TEST_CLASS,
			props: {},
		};

		render(<>{renderSkeletonState(props)}</>);
		expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
		expect(screen.getByText('Custom Skeleton')).toBeInTheDocument();
	});

	it('renders default skeleton when no custom component provided', () => {
		const props = {
			className: TEST_CLASS,
			props: { 'data-testid': SKELETON_CONTAINER_TEST_ID },
		};

		render(<>{renderSkeletonState(props)}</>);
		expect(screen.getByTestId(SKELETON_CONTAINER_TEST_ID)).toBeInTheDocument();
	});

	it('applies className to container', () => {
		const props = {
			className: CUSTOM_CLASS,
			props: { 'data-testid': SKELETON_CONTAINER_TEST_ID },
		};

		render(<>{renderSkeletonState(props)}</>);
		expect(screen.getByTestId(SKELETON_CONTAINER_TEST_ID)).toHaveClass(CUSTOM_CLASS);
	});

	it('passes through props to container', () => {
		const props = {
			className: TEST_CLASS,
			props: { 'data-testid': 'skeleton-wrapper' },
		};

		render(<>{renderSkeletonState(props)}</>);
		expect(screen.getByTestId('skeleton-wrapper')).toBeInTheDocument();
	});
});

describe('renderSpinnerState', () => {
	it('renders spinner with ARIA attributes', () => {
		const props = {
			className: TEST_CLASS,
			props: {},
		};

		render(<>{renderSpinnerState(props)}</>);
		const spinnerContainers = screen.getAllByLabelText(ARIA_LABELS.LOADING);
		expect(spinnerContainers.length).toBeGreaterThan(0);
		expect(spinnerContainers[0]).toHaveAttribute('aria-live', ARIA_LIVE.POLITE);
	});

	it('renders loading text when provided', () => {
		const props = {
			loadingText: 'Loading data...',
			className: TEST_CLASS,
			props: {},
		};

		render(<>{renderSpinnerState(props)}</>);
		expect(screen.getByText('Loading data...')).toBeInTheDocument();
	});

	it('does not render loading text when not provided', () => {
		const props = {
			className: TEST_CLASS,
			props: {},
		};

		render(<>{renderSpinnerState(props)}</>);
		expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
	});

	it('applies className to container', () => {
		const props = {
			className: CUSTOM_CLASS,
			props: { 'data-testid': 'spinner-container' },
		};

		render(<>{renderSpinnerState(props)}</>);
		expect(screen.getByTestId('spinner-container')).toHaveClass(CUSTOM_CLASS);
	});

	it('passes through props to container', () => {
		const props = {
			className: TEST_CLASS,
			props: { 'data-testid': 'spinner-wrapper' },
		};

		render(<>{renderSpinnerState(props)}</>);
		expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
	});
});
