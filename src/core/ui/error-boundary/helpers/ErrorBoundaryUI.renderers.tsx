import Box from '@core/ui/box/Box';
import Button from '@core/ui/button/Button';
import Flex from '@core/ui/flex/Flex';
import Heading from '@core/ui/heading/Heading';
import Icon from '@core/ui/icons/Icon';
import Text from '@core/ui/text/Text';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { ErrorBoundaryUIProps, RenderActionsOptions } from './ErrorBoundaryUITypes';

/**
 * Render error icon based on variant and custom icon prop
 * @param icon - Custom icon (ReactNode or string)
 * @param variant - Error boundary variant
 * @returns Rendered icon or null
 */
export function renderIcon(icon: ReactNode | undefined, variant: ErrorBoundaryUIProps['variant']) {
	if (icon !== undefined) {
		return (
			<Box className="mb-2 text-destructive">
				{typeof icon === 'string' ? (
					<Icon name={icon} size="lg" className="text-destructive" />
				) : (
					icon
				)}
			</Box>
		);
	}

	// Default error icon based on variant
	if (variant === 'minimal') {
		return null;
	}

	// Use a simple SVG icon as fallback since we don't have an error icon in registry
	return (
		<Box className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
			<svg viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8" aria-hidden="true">
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.828-10.828a1 1 0 10-1.414-1.414L10 7.586 8.586 6.172a1 1 0 10-1.414 1.414L8.586 9 7.172 10.414a1 1 0 101.414 1.414L10 10.414l1.414 1.414a1 1 0 001.414-1.414L11.414 9l1.414-1.414z"
					clipRule="evenodd"
				/>
			</svg>
		</Box>
	);
}

/**
 * Render error details (stack trace, error message) for development
 * @param error - Error object to display
 * @returns Rendered error details box
 */
export function renderErrorDetails(error: Error) {
	return (
		<Box className="mt-4 w-full">
			<Box className="rounded-lg bg-destructive/10 p-4 text-left dark:bg-destructive/20">
				<Text size="sm" className="font-mono text-destructive">
					{error.toString()}
				</Text>
				{error.stack ? (
					<Box className="mt-2">
						<pre className="overflow-auto text-xs text-destructive/80 dark:text-destructive/70">
							{error.stack}
						</pre>
					</Box>
				) : null}
			</Box>
		</Box>
	);
}

/**
 * Render retry button
 * @param onRetry - Retry callback function
 * @param showRetry - Whether to show retry button
 * @param retryLabel - Label for retry button
 * @returns Rendered retry button or null
 */
export function renderRetryButton(
	onRetry: (() => void) | undefined,
	showRetry: boolean,
	retryLabel: string
) {
	if (!showRetry || !onRetry) {
		return null;
	}

	return (
		<Button variant="primary" onClick={onRetry} aria-label="Try again to reload the application">
			{retryLabel}
		</Button>
	);
}

/**
 * Render home link
 * @param showHomeLink - Whether to show home link
 * @param homeLinkLabel - Label for home link
 * @param homeLinkTo - Route path for home link
 * @returns Rendered home link or null
 */
export function renderHomeLink(showHomeLink: boolean, homeLinkLabel: string, homeLinkTo: string) {
	if (!showHomeLink) {
		return null;
	}

	return (
		<Link
			to={homeLinkTo}
			className="rounded-lg border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
		>
			{homeLinkLabel}
		</Link>
	);
}

/**
 * Render action buttons (retry, home link, custom actions)
 * @param options - RenderActionsOptions object
 * @returns Rendered actions flex container or null
 */
export function renderActions({
	onRetry,
	showRetry,
	retryLabel,
	showHomeLink,
	homeLinkLabel,
	homeLinkTo,
	customActions,
}: RenderActionsOptions) {
	const hasActions = showRetry || showHomeLink || customActions;

	if (!hasActions) {
		return null;
	}

	return (
		<Flex
			direction="col"
			gap="sm"
			align="center"
			className="mt-6 w-full sm:flex-row sm:justify-center"
		>
			{renderRetryButton(onRetry, showRetry, retryLabel)}
			{renderHomeLink(showHomeLink, homeLinkLabel, homeLinkTo)}
			{customActions}
		</Flex>
	);
}

/**
 * Render error content (icon, title, description, error details, children, actions)
 * @param params - Error content render parameters
 * @returns Rendered error content fragment
 */
export function renderErrorContent({
	error,
	icon,
	variant,
	displayTitle,
	displayDescription,
	showErrorDetails,
	children,
	actionsProps,
}: {
	error: Error | null;
	icon: ReactNode | undefined;
	variant: ErrorBoundaryUIProps['variant'] | undefined;
	displayTitle: string;
	displayDescription: string;
	showErrorDetails: boolean | undefined;
	children: ReactNode | undefined;
	actionsProps: RenderActionsOptions;
}) {
	return (
		<>
			{renderIcon(icon, variant)}
			<Heading as="h1" size="lg">
				{displayTitle}
			</Heading>
			<Text size="md" className="text-muted-foreground">
				{displayDescription}
			</Text>
			{showErrorDetails && error ? renderErrorDetails(error) : null}
			{children}
			{renderActions(actionsProps)}
		</>
	);
}
