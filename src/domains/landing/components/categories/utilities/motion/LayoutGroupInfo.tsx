import Text from '@core/ui/text/Text';

export function LayoutGroupInfo() {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				LayoutGroup - Shared Layout Animations
			</Text>
			<Text size="sm" className="text-muted-foreground">
				LayoutGroup enables shared layout animations between components. It&apos;s typically used at
				a higher level to coordinate animations across route changes or complex UI transitions.
			</Text>
		</div>
	);
}
