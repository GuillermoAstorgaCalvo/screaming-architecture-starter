import { ROUTES } from '@core/config/routes';
import type {
	ErrorBoundaryUIProps,
	RenderActionsOptions,
} from '@core/ui/error-boundary/types/ErrorBoundaryUITypes';

/**
 * Get display text for error boundary UI
 * @param title - Optional custom title
 * @param description - Optional custom description
 * @returns Object with title and description strings
 */
export function getDisplayText(title?: string, description?: string) {
	return {
		title: title ?? 'Something went wrong',
		description: description ?? "We're sorry, but something unexpected happened. Please try again.",
	};
}

/**
 * Build actions props from ErrorBoundaryUI props
 * @param props - ErrorBoundaryUI component props
 * @returns RenderActionsOptions object with default values applied
 */
export function buildActionsProps(props: Readonly<ErrorBoundaryUIProps>): RenderActionsOptions {
	return {
		onRetry: props.onRetry,
		showRetry: props.showRetry ?? true,
		retryLabel: props.retryLabel ?? 'Try again',
		showHomeLink: props.showHomeLink ?? true,
		homeLinkLabel: props.homeLinkLabel ?? 'Go to Home',
		homeLinkTo: props.homeLinkTo ?? ROUTES.HOME,
		customActions: props.customActions,
	};
}
