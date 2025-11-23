import { DataTableShowcase } from './lists-tables/DataTableShowcase';
import { ListGroupShowcase } from './lists-tables/ListGroupShowcase';
import { ListShowcase } from './lists-tables/ListShowcase';
import { TableShowcase } from './lists-tables/TableShowcase';
import { TreeViewShowcase } from './lists-tables/TreeViewShowcase';

interface ListsTablesShowcaseProps {
	readonly selectedNode: string | null;
	readonly onNodeSelect: (nodeId: string) => void;
}

export function ListsTablesShowcase({ selectedNode, onNodeSelect }: ListsTablesShowcaseProps) {
	return (
		<div className="space-y-8">
			<ListShowcase />
			<ListGroupShowcase />
			<TableShowcase />
			<DataTableShowcase />
			<TreeViewShowcase selectedNode={selectedNode} onNodeSelect={onNodeSelect} />
		</div>
	);
}
