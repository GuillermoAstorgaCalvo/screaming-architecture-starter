import { useToggle } from '@core/hooks/useToggle';
import { classNames } from '@core/utils/classNames';

interface ToggleButtonsProps {
	readonly isExpanded: boolean;
	readonly toggle: () => void;
	readonly expand: () => void;
	readonly collapse: () => void;
}

function ToggleButtons({ isExpanded, toggle, expand, collapse }: ToggleButtonsProps) {
	return (
		<div className="flex gap-2 flex-wrap">
			<button
				type="button"
				onClick={toggle}
				className={classNames(
					'px-4 py-2 rounded-lg font-medium transition-colors',
					'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
					isExpanded
						? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
						: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
				)}
			>
				Toggle ({isExpanded ? 'Expanded' : 'Collapsed'})
			</button>
			<button
				type="button"
				onClick={expand}
				className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Expand
			</button>
			<button
				type="button"
				onClick={collapse}
				className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
			>
				Collapse
			</button>
		</div>
	);
}

interface ExpandableContentProps {
	readonly isExpanded: boolean;
}

function ExpandableContent({ isExpanded }: ExpandableContentProps) {
	return (
		<div
			className={classNames(
				'overflow-hidden transition-all duration-300 ease-in-out',
				isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
			)}
		>
			<div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg mt-2">
				<p className="text-sm text-gray-700 dark:text-gray-300">
					This content is {isExpanded ? 'expanded' : 'collapsed'} using the{' '}
					<code className="text-xs bg-white dark:bg-gray-800 px-1 rounded">useToggle</code> hook.
				</p>
			</div>
		</div>
	);
}

interface HighlightDemoProps {
	readonly isHighlighted: boolean;
	readonly toggleHighlight: () => void;
}

function HighlightDemo({ isHighlighted, toggleHighlight }: HighlightDemoProps) {
	return (
		<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				type="button"
				onClick={toggleHighlight}
				className={classNames(
					'px-4 py-2 rounded-lg font-medium transition-all',
					'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
					{
						'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200':
							isHighlighted,
						'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': !isHighlighted,
					}
				)}
			>
				{isHighlighted ? '✨ Highlighted!' : 'Highlight Me'}
			</button>
			<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
				Using <code>classNames</code> with object syntax for conditional styling
			</p>
		</div>
	);
}

export default function ToggleSection() {
	const [isExpanded, toggle, expand, collapse] = useToggle(false);
	const [isHighlighted, toggleHighlight] = useToggle(false);

	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
				Toggle Hook & ClassNames Demo
			</h2>
			<div className="space-y-4">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Demonstrates{' '}
					<code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">useToggle</code> from{' '}
					<code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
						@core/hooks/useToggle
					</code>{' '}
					and <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">classNames</code>{' '}
					from{' '}
					<code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
						@core/utils/classNames
					</code>
				</p>

				<div className="space-y-3">
					<ToggleButtons
						isExpanded={isExpanded}
						toggle={toggle}
						expand={expand}
						collapse={collapse}
					/>
					<ExpandableContent isExpanded={isExpanded} />
					<HighlightDemo isHighlighted={isHighlighted} toggleHighlight={toggleHighlight} />
				</div>
			</div>
		</section>
	);
}
