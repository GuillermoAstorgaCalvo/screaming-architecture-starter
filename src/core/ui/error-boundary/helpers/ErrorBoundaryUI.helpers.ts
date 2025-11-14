import { ROUTES } from '@core/config/routes';
import i18n from '@core/i18n/i18n';
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
	const t = (key: string) => i18n.t(key, { ns: 'common' });
	return {
		title: title ?? t('errors.errorBoundary.title'),
		description: description ?? t('errors.errorBoundary.description'),
	};
}

/**
 * Build actions props from ErrorBoundaryUI props
 * @param props - ErrorBoundaryUI component props
 * @returns RenderActionsOptions object with default values applied
 */
export function buildActionsProps(props: Readonly<ErrorBoundaryUIProps>): RenderActionsOptions {
	const t = (key: string) => i18n.t(key, { ns: 'common' });
	return {
		onRetry: props.onRetry,
		showRetry: props.showRetry ?? true,
		retryLabel: props.retryLabel ?? t('errors.errorBoundary.tryAgain'),
		showHomeLink: props.showHomeLink ?? true,
		homeLinkLabel: props.homeLinkLabel ?? t('errors.errorBoundary.goToHome'),
		homeLinkTo: props.homeLinkTo ?? ROUTES.HOME,
		customActions: props.customActions,
	};
}
