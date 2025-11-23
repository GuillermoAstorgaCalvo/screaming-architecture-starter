import TreeView from '@core/ui/data-display/tree-view/TreeView';
import Text from '@core/ui/text/Text';
import { TREE_NODES } from '@domains/landing/components/categories/data-display/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface TreeViewShowcaseProps {
	readonly selectedNode: string | null;
	readonly onNodeSelect: (nodeId: string) => void;
}

export function TreeViewShowcase({ selectedNode, onNodeSelect }: TreeViewShowcaseProps) {
	return (
		<ShowcaseSection
			title="TreeView"
			description="Hierarchical data component for tree structures"
			tags={['data', 'tree', 'hierarchical', 'list']}
		>
			<div className="space-y-4">
				<TreeView
					nodes={TREE_NODES}
					selectionMode="single"
					onNodeClick={(nodeId, _node) => {
						onNodeSelect(nodeId);
					}}
				/>
				{selectedNode ? (
					<Text size="sm" className="text-muted-foreground">
						Selected: {selectedNode}
					</Text>
				) : null}
			</div>
		</ShowcaseSection>
	);
}
