/**
 * Tests for SnackbarContainer component
 *
 * Tests the snackbar container component:
 * - Rendering with no snackbars (returns null)
 * - Rendering with snackbars
 * - Position prop variations
 * - Custom className
 * - Multiple snackbars stacking
 * - Dismissal functionality
 * - Different intents
 * - Optional props (autoDismiss, dismissAfter, action, className)
 * - Accessibility attributes
 * - State synchronization with snackbars array
 */

import { SnackbarProvider } from '@core/providers/snackbar/SnackbarProvider';
import { useSnackbar } from '@core/providers/snackbar/useSnackbar';
import SnackbarContainer from '@core/ui/feedback/snackbar/components/SnackbarContainer';
import { SNACKBAR_POSITION_CLASSES } from '@core/ui/feedback/snackbar/constants/snackbar.constants';
import { componentZIndex } from '@core/ui/theme/tokens';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_MESSAGE_1 = 'First snackbar message';
const TEST_MESSAGE_2 = 'Second snackbar message';
const TEST_MESSAGE_3 = 'Third snackbar message';

// Helper component to add snackbars for testing
function SnackbarTestHelper({
	children,
	onAddSnackbar,
}: {
	readonly children: ReactNode;
	readonly onAddSnackbar?: (addSnackbar: ReturnType<typeof useSnackbar>) => void;
}) {
	const snackbar = useSnackbar();

	if (onAddSnackbar) {
		onAddSnackbar(snackbar);
	}

	return <>{children}</>;
}

// Helper to render SnackbarContainer with SnackbarProvider
function renderSnackbarContainer(
	props: Parameters<typeof SnackbarContainer>[0] = {},
	options?: {
		readonly onAddSnackbar?: (addSnackbar: ReturnType<typeof useSnackbar>) => void;
	}
) {
	return renderWithProviders(
		<SnackbarProvider>
			<SnackbarTestHelper {...(options?.onAddSnackbar && { onAddSnackbar: options.onAddSnackbar })}>
				<SnackbarContainer {...props} />
			</SnackbarTestHelper>
		</SnackbarProvider>
	);
}

describe('SnackbarContainer - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderSnackbarContainer();
		}).not.toThrow();
	});

	it('returns null when no snackbars are present', () => {
		const { container } = renderSnackbarContainer();
		expect(container.firstChild).toBeNull();
	});

	it('renders when snackbars are present', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
	});

	it('renders snackbar message', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const customClass = 'custom-container-class';
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(
			{ className: customClass },
			{
				onAddSnackbar: sb => {
					snackbar = sb;
				},
			}
		);

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const containerElement = container.querySelector(`.${customClass}`);
		expect(containerElement).toBeInTheDocument();
		expect(containerElement).toHaveClass(customClass);
	});
});

describe('SnackbarContainer - Position', () => {
	it('renders with default position (bottom-center)', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass(SNACKBAR_POSITION_CLASSES['bottom-center']);
	});

	it('renders with bottom-left position', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(
			{ position: 'bottom-left' },
			{
				onAddSnackbar: sb => {
					snackbar = sb;
				},
			}
		);

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass(SNACKBAR_POSITION_CLASSES['bottom-left']);
	});

	it('renders with bottom-right position', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(
			{ position: 'bottom-right' },
			{
				onAddSnackbar: sb => {
					snackbar = sb;
				},
			}
		);

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass(SNACKBAR_POSITION_CLASSES['bottom-right']);
	});

	it('applies correct position classes for all positions', () => {
		const positions: Array<'bottom-left' | 'bottom-center' | 'bottom-right'> = [
			'bottom-left',
			'bottom-center',
			'bottom-right',
		];

		for (const position of positions) {
			let snackbar: ReturnType<typeof useSnackbar> | undefined;

			const { container, unmount } = renderSnackbarContainer(
				{ position },
				{
					onAddSnackbar: sb => {
						snackbar = sb;
					},
				}
			);

			act(() => {
				snackbar?.success(TEST_MESSAGE_1);
			});

			const containerElement = container.firstChild as HTMLElement;
			expect(containerElement).toHaveClass(SNACKBAR_POSITION_CLASSES[position]);
			unmount();
		}
	});
});

describe('SnackbarContainer - Multiple Snackbars', () => {
	it('renders multiple snackbars', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
			snackbar?.error(TEST_MESSAGE_2);
			snackbar?.warning(TEST_MESSAGE_3);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_2)).toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_3)).toBeInTheDocument();
	});

	it('stacks snackbars vertically with gap', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
			snackbar?.error(TEST_MESSAGE_2);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('flex', 'flex-col', 'gap-2');
	});

	it('updates when snackbars are added', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		expect(screen.queryByText(TEST_MESSAGE_1)).not.toBeInTheDocument();

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();

		act(() => {
			snackbar?.error(TEST_MESSAGE_2);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_2)).toBeInTheDocument();
	});

	it('updates when snackbars are removed', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		let snackbarId: string | undefined;

		act(() => {
			snackbarId = snackbar?.success(TEST_MESSAGE_1);
			snackbar?.error(TEST_MESSAGE_2);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_2)).toBeInTheDocument();

		act(() => {
			if (snackbarId) {
				snackbar?.dismiss(snackbarId);
			}
		});

		expect(screen.queryByText(TEST_MESSAGE_1)).not.toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_2)).toBeInTheDocument();
	});

	it('returns null when all snackbars are dismissed', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		let snackbarId: string | undefined;

		act(() => {
			snackbarId = snackbar?.success(TEST_MESSAGE_1);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();

		act(() => {
			if (snackbarId) {
				snackbar?.dismiss(snackbarId);
			}
		});

		expect(container.firstChild).toBeNull();
	});
});

describe('SnackbarContainer - Dismissal', () => {
	it('calls dismiss when snackbar dismiss button is clicked', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const dismissButton = screen.getByRole('button');
		fireEvent.click(dismissButton);

		expect(screen.queryByText(TEST_MESSAGE_1)).not.toBeInTheDocument();
	});

	it('dismisses correct snackbar when multiple are present', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
			snackbar?.error(TEST_MESSAGE_2);
		});

		const dismissButtons = screen.getAllByRole('button');
		// Click the first dismiss button (should dismiss first snackbar)
		expect(dismissButtons[0]).toBeDefined();
		fireEvent.click(dismissButtons[0]!);

		expect(screen.queryByText(TEST_MESSAGE_1)).not.toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_2)).toBeInTheDocument();
	});
});

describe('SnackbarContainer - Intents', () => {
	it('renders snackbar with success intent', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const snackbarElement = screen.getByText(TEST_MESSAGE_1).closest('output');
		expect(snackbarElement).toBeInTheDocument();
	});

	it('renders snackbar with error intent', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.error(TEST_MESSAGE_1);
		});

		const snackbarElement = screen.getByText(TEST_MESSAGE_1).closest('output');
		expect(snackbarElement).toBeInTheDocument();
	});

	it('renders snackbar with warning intent', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.warning(TEST_MESSAGE_1);
		});

		const snackbarElement = screen.getByText(TEST_MESSAGE_1).closest('output');
		expect(snackbarElement).toBeInTheDocument();
	});

	it('renders snackbar with info intent', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.info(TEST_MESSAGE_1);
		});

		const snackbarElement = screen.getByText(TEST_MESSAGE_1).closest('output');
		expect(snackbarElement).toBeInTheDocument();
	});
});

describe('SnackbarContainer - Optional Props', () => {
	it('passes autoDismiss prop to Snackbar when provided', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success({
				message: TEST_MESSAGE_1,
				autoDismiss: false,
			});
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
	});

	it('passes dismissAfter prop to Snackbar when provided', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success({
				message: TEST_MESSAGE_1,
				dismissAfter: 5000,
			});
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
	});

	it('passes action prop to Snackbar when provided', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;
		const actionOnClick = vi.fn();

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success({
				message: TEST_MESSAGE_1,
				action: {
					label: 'Retry',
					onClick: actionOnClick,
				},
			});
		});

		const actionButton = screen.getByText('Retry');
		expect(actionButton).toBeInTheDocument();

		fireEvent.click(actionButton);
		expect(actionOnClick).toHaveBeenCalledTimes(1);
	});

	it('passes className prop to Snackbar when provided', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;
		const customClass = 'custom-snackbar-class';

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success({
				message: TEST_MESSAGE_1,
				className: customClass,
			});
		});

		const snackbarElement = screen.getByText(TEST_MESSAGE_1).closest('output');
		expect(snackbarElement).toHaveClass(customClass);
	});

	it('does not pass optional props when not provided', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		// Snackbar should still render without optional props
		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
	});
});

describe('SnackbarContainer - Styling', () => {
	it('has fixed positioning', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('fixed');
	});

	it('has pointer-events-none on container', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('pointer-events-none');
	});

	it('has pointer-events-auto on snackbar wrapper', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const snackbarWrapper = container.querySelector('.pointer-events-auto');
		expect(snackbarWrapper).toBeInTheDocument();
	});

	it('has correct z-index', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		const { container } = renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveStyle({ zIndex: componentZIndex.popover });
	});
});

describe('SnackbarContainer - Accessibility', () => {
	it('has aria-label attribute', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		const container = screen.getByLabelText('Notifications');
		expect(container).toBeInTheDocument();
	});
});

describe('SnackbarContainer - State Synchronization', () => {
	it('synchronizes visibleSnackbars with snackbars array', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();

		act(() => {
			snackbar?.error(TEST_MESSAGE_2);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_2)).toBeInTheDocument();
	});

	it('updates visibleSnackbars when snackbars array changes', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		let snackbarId: string | undefined;

		act(() => {
			snackbarId = snackbar?.success(TEST_MESSAGE_1);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();

		act(() => {
			if (snackbarId) {
				snackbar?.dismiss(snackbarId);
			}
		});

		expect(screen.queryByText(TEST_MESSAGE_1)).not.toBeInTheDocument();
	});
});

describe('SnackbarContainer - Edge Cases', () => {
	it('handles rapid snackbar additions and removals', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		let id2: string | undefined;

		act(() => {
			snackbar?.success(TEST_MESSAGE_1);
			id2 = snackbar?.error(TEST_MESSAGE_2);
			snackbar?.warning(TEST_MESSAGE_3);
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_2)).toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_3)).toBeInTheDocument();

		act(() => {
			if (id2) {
				snackbar?.dismiss(id2);
			}
		});

		expect(screen.getByText(TEST_MESSAGE_1)).toBeInTheDocument();
		expect(screen.queryByText(TEST_MESSAGE_2)).not.toBeInTheDocument();
		expect(screen.getByText(TEST_MESSAGE_3)).toBeInTheDocument();
	});

	it('handles ReactNode messages', () => {
		let snackbar: ReturnType<typeof useSnackbar> | undefined;

		renderSnackbarContainer(undefined, {
			onAddSnackbar: sb => {
				snackbar = sb;
			},
		});

		const nodeMessage = <div data-testid="node-message">Node message</div>;

		act(() => {
			snackbar?.success({ message: nodeMessage });
		});

		expect(screen.getByTestId('node-message')).toBeInTheDocument();
	});
});
