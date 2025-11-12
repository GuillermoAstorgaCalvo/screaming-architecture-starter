interface SignaturePadClearButtonProps {
	readonly onClick: () => void;
	readonly label: string;
}

/**
 * Clear button component for signature pad
 */
export function SignaturePadClearButton({
	onClick,
	label,
}: Readonly<SignaturePadClearButtonProps>) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="absolute bottom-2 right-2 rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
			aria-label={label}
		>
			{label}
		</button>
	);
}
