import { useTranslation } from '@core/i18n/useTranslation';

/**
 * DismissButton - Button component for dismissing snackbar notifications
 *
 * Provides an accessible close button with an X icon for snackbar notifications.
 * Uses proper ARIA attributes for screen readers.
 */
export function DismissButton({ onDismiss }: { readonly onDismiss: () => void }) {
	const { t } = useTranslation('common');

	return (
		<button
			type="button"
			onClick={onDismiss}
			aria-label={t('a11y.dismissNotification')}
			className="ml-2 text-current/80 hover:text-current"
		>
			<svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
				<path
					fillRule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clipRule="evenodd"
				/>
			</svg>
		</button>
	);
}
