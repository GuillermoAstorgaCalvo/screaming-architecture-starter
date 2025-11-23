import Text from '@core/ui/text/Text';
import { getDemoIcons } from '@domains/landing/components/shared/iconShowcase.utils';

interface IconPreviewProps {
	sizeClass: string;
	colorClass: string;
}

export function IconPreview({ sizeClass, colorClass }: Readonly<IconPreviewProps>) {
	const demoIcons = getDemoIcons();

	return (
		<div>
			<Text size="sm" className="mb-2 font-medium">
				Preview
			</Text>
			<div className="flex flex-wrap gap-4 rounded-lg border border-border bg-surface p-4">
				{demoIcons.map(({ name, IconComponent }) => (
					<div key={name} className="flex flex-col items-center gap-2">
						<IconComponent className={`${sizeClass} ${colorClass}`} />
						<Text size="sm" className="text-xs text-muted-foreground">
							{name}
						</Text>
					</div>
				))}
			</div>
		</div>
	);
}
