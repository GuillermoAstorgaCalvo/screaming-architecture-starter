import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';

function SizeExamples() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
			<div className="flex flex-wrap items-center gap-6">
				<div className="flex flex-col items-center gap-2">
					<CloseIcon size="sm" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Small</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<CloseIcon size="md" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<CloseIcon size="lg" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Large</span>
				</div>
			</div>
		</div>
	);
}

function ContextExamples() {
	const buttonClass = 'rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300';
	const labelClass = 'text-sm text-gray-600 dark:text-gray-400';

	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">In Context</h3>
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<span className={labelClass}>Close button:</span>
					<button type="button" className={buttonClass} aria-label="Close">
						<CloseIcon />
					</button>
				</div>
				<div className="flex items-center gap-2">
					<span className={labelClass}>Small close button:</span>
					<button type="button" className={buttonClass} aria-label="Close">
						<CloseIcon size="sm" />
					</button>
				</div>
				<div className="flex items-center gap-2">
					<span className={labelClass}>Large close button:</span>
					<button type="button" className={buttonClass} aria-label="Close">
						<CloseIcon size="lg" />
					</button>
				</div>
			</div>
		</div>
	);
}

function CustomStylingExamples() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Custom Styling</h3>
			<div className="flex flex-wrap items-center gap-4">
				<CloseIcon className="text-blue-500" />
				<CloseIcon className="text-red-500" />
				<CloseIcon className="text-green-500" />
				<CloseIcon className="text-purple-500" />
			</div>
		</div>
	);
}

export default function CloseIconSection() {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Close Icon</h2>
			<div className="space-y-6">
				<SizeExamples />
				<ContextExamples />
				<CustomStylingExamples />
			</div>
		</section>
	);
}
