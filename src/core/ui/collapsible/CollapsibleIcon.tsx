/**
 * Renders the expand/collapse icon
 */
export function CollapsibleIcon({ expanded }: Readonly<{ expanded: boolean }>) {
	return (
		<span className="text-muted-foreground" aria-hidden="true">
			{expanded ? '▼' : '▶'}
		</span>
	);
}
