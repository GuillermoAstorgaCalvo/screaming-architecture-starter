import { env } from '@core/config/env.client';
import Box from '@core/ui/box/Box';
import {
	buildActionsProps,
	getDisplayText,
} from '@core/ui/error-boundary/helpers/ErrorBoundaryUI.helpers';
import { renderErrorContent } from '@core/ui/error-boundary/helpers/ErrorBoundaryUI.renderers';
import type { ErrorBoundaryUIProps } from '@core/ui/error-boundary/types/ErrorBoundaryUITypes';
import Flex from '@core/ui/flex/Flex';
import { classNames } from '@core/utils/classNames';

/**
 * ErrorBoundaryUI - Customizable error UI component for ErrorBoundary
 *
 * Features:
 * - Customizable error UI with multiple variants
 * - Retry functionality
 * - Fallback UI options
 * - Design system integration
 * - Development error details
 * - Accessible error messaging
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <ErrorBoundaryUI
 *   error={error}
 *   onRetry={handleReset}
 *   variant="detailed"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ErrorBoundaryUI
 *   error={error}
 *   onRetry={handleReset}
 *   variant="minimal"
 *   title="Oops! Something went wrong"
 *   description="We're working on fixing this issue."
 * />
 * ```
 */
export default function ErrorBoundaryUI(props: Readonly<ErrorBoundaryUIProps>) {
	const { title: displayTitle, description: displayDescription } = getDisplayText(
		props.title,
		props.description
	);
	const actionsProps = buildActionsProps(props);
	const showErrorDetails = props.showErrorDetails ?? env.DEV;

	return (
		<main
			className={classNames(
				'flex min-h-screen flex-col items-center justify-center p-6',
				props.className
			)}
			role="alert"
			aria-live="assertive"
		>
			<Box className="max-w-md text-center">
				<Flex direction="col" gap="md" align="center">
					{renderErrorContent({
						error: props.error,
						icon: props.icon,
						variant: props.variant ?? 'default',
						displayTitle,
						displayDescription,
						showErrorDetails,
						children: props.children,
						actionsProps,
					})}
				</Flex>
			</Box>
		</main>
	);
}
