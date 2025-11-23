export const TABLE_DATA = [
	{ id: '1', name: 'John Doe', age: 30, role: 'Developer' },
	{ id: '2', name: 'Jane Smith', age: 25, role: 'Designer' },
	{ id: '3', name: 'Bob Johnson', age: 35, role: 'Manager' },
];

export const TABLE_COLUMNS = [
	{ id: 'name', header: 'Name', accessor: (row: (typeof TABLE_DATA)[number]) => row.name },
	{ id: 'age', header: 'Age', accessor: (row: (typeof TABLE_DATA)[number]) => row.age },
	{ id: 'role', header: 'Role', accessor: (row: (typeof TABLE_DATA)[number]) => row.role },
];

export const CHART_DATA = [
	{ name: 'Jan', value: 400 },
	{ name: 'Feb', value: 300 },
	{ name: 'Mar', value: 200 },
	{ name: 'Apr', value: 278 },
	{ name: 'May', value: 189 },
];

export const TREE_NODES = [
	{
		id: '1',
		label: 'Documents',
		children: [
			{ id: '1-1', label: 'File 1.pdf' },
			{ id: '1-2', label: 'File 2.docx' },
			{
				id: '1-3',
				label: 'Subfolder',
				children: [
					{ id: '1-3-1', label: 'Nested File 1.txt' },
					{ id: '1-3-2', label: 'Nested File 2.txt' },
				],
			},
		],
	},
	{
		id: '2',
		label: 'Images',
		children: [
			{ id: '2-1', label: 'Photo 1.jpg' },
			{ id: '2-2', label: 'Photo 2.png' },
		],
	},
	{ id: '3', label: 'Videos' },
];

export const TIMELINE_EVENTS = [
	{
		id: '1',
		title: 'Event 1',
		description: 'First event description',
		timestamp: '2024-01-01',
		completed: true,
	},
	{
		id: '2',
		title: 'Event 2',
		description: 'Second event description',
		timestamp: '2024-01-15',
		active: true,
	},
	{
		id: '3',
		title: 'Event 3',
		description: 'Third event description',
		timestamp: '2024-02-01',
	},
];
