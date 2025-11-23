/**
 * LoadingWrapperHelpers.error Tests
 *
 * Tests for the error state helpers including:
 * - renderErrorContent
 * - renderErrorState
 */

import { ARIA_LIVE } from '@core/constants/aria';
import {
	renderErrorContent,
	renderErrorState,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.error';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const STRING_ERROR = 'String error';
const ERROR_MESSAGE = 'Error message';
const DEFAULT_ERROR_MESSAGE = 'Default error';

describe('renderErrorContent', () => {
	it('renders string error', () => {
		const { container } = render(<>{renderErrorContent(STRING_ERROR)}</>);
		expect(container.textContent).toContain(STRING_ERROR);
	});

	it('renders Error object message', () => {
		const error = new Error(ERROR_MESSAGE);
		const { container } = render(<>{renderErrorContent(error)}</>);
		expect(container.textContent).toContain(ERROR_MESSAGE);
	});

	it('renders default message when Error has no message', () => {
		const error = Object.create(Error.prototype) as Error;
		const { container } = render(<>{renderErrorContent(error, DEFAULT_ERROR_MESSAGE)}</>);
		expect(container.textContent).toContain(DEFAULT_ERROR_MESSAGE);
	});

	it('renders default message when Error has empty string message', () => {
		const error = Object.create(Error.prototype) as Error;
		Object.defineProperty(error, 'message', { value: '', writable: true });
		const { container } = render(<>{renderErrorContent(error, DEFAULT_ERROR_MESSAGE)}</>);
		expect(container.textContent).toContain(DEFAULT_ERROR_MESSAGE);
	});

	it('renders i18n fallback when Error has no message and no defaultErrorMessage', () => {
		const error = Object.create(Error.prototype) as Error;
		const { container } = render(<>{renderErrorContent(error)}</>);
		// Should render the i18n fallback message
		expect(container.textContent).toBeTruthy();
	});

	it('renders i18n fallback when Error has empty string message and no defaultErrorMessage', () => {
		const error = Object.create(Error.prototype) as Error;
		Object.defineProperty(error, 'message', { value: '', writable: true });
		const { container } = render(<>{renderErrorContent(error)}</>);
		// Should render the i18n fallback message
		expect(container.textContent).toBeTruthy();
	});

	it('renders ReactNode error', () => {
		const errorNode = <div data-testid="error-node">Error Node</div>;
		render(<>{renderErrorContent(errorNode)}</>);
		expect(screen.getByTestId('error-node')).toBeInTheDocument();
	});
});

describe('renderErrorState - custom error component', () => {
	it('renders custom error component when provided', () => {
		const props = {
			error: 'Error',
			errorComponent: <div data-testid="custom-error">Custom Error</div>,
			props: {},
		};

		render(<>{renderErrorState(props)}</>);
		expect(screen.getByTestId('custom-error')).toBeInTheDocument();
	});
});

describe('renderErrorState - error content rendering', () => {
	it('renders error content with string error', () => {
		const props = {
			error: STRING_ERROR,
			props: {},
		};

		render(<>{renderErrorState(props)}</>);
		expect(screen.getByText(STRING_ERROR)).toBeInTheDocument();
	});

	it('renders error content with Error object', () => {
		const props = {
			error: new Error(ERROR_MESSAGE),
			props: {},
		};

		render(<>{renderErrorState(props)}</>);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});
});

describe('renderErrorState - retry button', () => {
	it('renders retry button when onRetry provided', () => {
		const onRetry = vi.fn();
		const props = {
			error: 'Error',
			onRetry,
			props: {},
		};

		render(<>{renderErrorState(props)}</>);
		const retryButton = screen.getByRole('button', { name: /retry/i });
		expect(retryButton).toBeInTheDocument();

		fireEvent.click(retryButton);
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('does not render retry button when onRetry not provided', () => {
		const props = {
			error: 'Error',
			props: {},
		};

		render(<>{renderErrorState(props)}</>);
		expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
	});
});

describe('renderErrorState - ARIA attributes', () => {
	it('has correct ARIA attributes', () => {
		const props = {
			error: 'Error',
			props: {},
		};

		render(<>{renderErrorState(props)}</>);
		const errorContainer = screen.getByRole('alert');
		expect(errorContainer).toBeInTheDocument();
		expect(errorContainer).toHaveAttribute('aria-live', ARIA_LIVE.ASSERTIVE);
	});
});

describe('renderErrorState - styling and props', () => {
	it('applies className to container', () => {
		const props = {
			error: 'Error',
			className: 'custom-class',
			props: {},
		};

		render(<>{renderErrorState(props)}</>);
		const errorContainer = screen.getByRole('alert');
		expect(errorContainer).toHaveClass('custom-class');
	});

	it('passes through props to container', () => {
		const props = {
			error: 'Error',
			props: { 'data-testid': 'error-wrapper' },
		};

		render(<>{renderErrorState(props)}</>);
		expect(screen.getByTestId('error-wrapper')).toBeInTheDocument();
	});
});
