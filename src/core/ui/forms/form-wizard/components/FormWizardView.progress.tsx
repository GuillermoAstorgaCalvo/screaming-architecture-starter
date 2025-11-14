interface ProgressIndicatorProps {
	readonly activeStep: number;
	readonly totalSteps: number;
	readonly progress: number;
}

/**
 * Progress indicator component
 */
export function ProgressIndicator({
	activeStep,
	totalSteps,
	progress,
}: Readonly<ProgressIndicatorProps>) {
	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-text-primary dark:text-text-primary">
					Step {activeStep + 1} of {totalSteps}
				</span>
				<span className="text-sm text-text-secondary dark:text-text-secondary">{progress}%</span>
			</div>
			<progress
				value={progress}
				max={100}
				className="w-full h-2 bg-muted rounded-full dark:bg-muted [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-bar]:dark:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
			/>
		</div>
	);
}

interface ProgressSectionProps {
	readonly showProgress: boolean;
	readonly activeStep: number;
	readonly totalSteps: number;
	readonly progress: number;
}

/**
 * Progress section component
 */
export function ProgressSection({
	showProgress,
	activeStep,
	totalSteps,
	progress,
}: Readonly<ProgressSectionProps>) {
	if (!showProgress) {
		return null;
	}

	return <ProgressIndicator activeStep={activeStep} totalSteps={totalSteps} progress={progress} />;
}
