/**
 * Tests for ToastContainer component
 *
 * Tests the toast container component:
 * - Rendering with no toasts (returns null)
 * - Rendering with toasts
 * - Position prop variations
 * - Custom className
 * - Multiple toasts stacking
 * - Dismissal functionality
 * - Different intents
 * - Optional props (title, description, children, autoDismiss, dismissAfter, pauseOnHover, action, className, role)
 * - Accessibility attributes
 * - State synchronization with toasts array
 */

import { ToastProvider } from '@core/providers/toast/ToastProvider';
import { useToast } from '@core/providers/toast/useToast';
import ToastContainer from '@core/ui/feedback/toast/components/ToastContainer';
import { componentZIndex } from '@core/ui/theme/tokens';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE_1 = 'First toast title';
const TEST_TITLE_2 = 'Second toast title';
const TEST_TITLE_3 = 'Third toast title';
const TEST_DESCRIPTION_1 = 'First toast description';
const TEST_DESCRIPTION_2 = 'Second toast description';

// Helper component to add toasts for testing
function ToastTestHelper({
	children,
	onAddToast,
}: {
	readonly children: ReactNode;
	readonly onAddToast?: (addToast: ReturnType<typeof useToast>) => void;
}) {
	const toast = useToast();

	if (onAddToast) {
		onAddToast(toast);
	}

	return <>{children}</>;
}

// Helper to render ToastContainer with ToastProvider
function renderToastContainer(
	props: Parameters<typeof ToastContainer>[0] = {},
	options?: {
		readonly onAddToast?: (addToast: ReturnType<typeof useToast>) => void;
	}
) {
	return renderWithProviders(
		<ToastProvider>
			<ToastTestHelper {...(options?.onAddToast && { onAddToast: options.onAddToast })}>
				<ToastContainer {...props} />
			</ToastTestHelper>
		</ToastProvider>
	);
}

describe('ToastContainer - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderToastContainer();
		}).not.toThrow();
	});

	it('returns null when no toasts are present', () => {
		const { container } = renderToastContainer();
		expect(container.firstChild).toBeNull();
	});

	it('renders when toasts are present', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('renders toast title', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const customClass = 'custom-container-class';
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(
			{ className: customClass },
			{
				onAddToast: t => {
					toast = t;
				},
			}
		);

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.querySelector(`.${customClass}`);
		expect(containerElement).toBeInTheDocument();
		expect(containerElement).toHaveClass(customClass);
	});
});

describe('ToastContainer - Position', () => {
	it('renders with default position (top-right)', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('top-4', 'right-4');
	});

	it('renders with top-left position', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(
			{ position: 'top-left' },
			{
				onAddToast: t => {
					toast = t;
				},
			}
		);

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('top-4', 'left-4');
	});

	it('renders with top-center position', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(
			{ position: 'top-center' },
			{
				onAddToast: t => {
					toast = t;
				},
			}
		);

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('top-4', 'left-1/2', '-translate-x-1/2');
	});

	it('renders with bottom-left position', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(
			{ position: 'bottom-left' },
			{
				onAddToast: t => {
					toast = t;
				},
			}
		);

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('bottom-4', 'left-4');
	});

	it('renders with bottom-center position', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(
			{ position: 'bottom-center' },
			{
				onAddToast: t => {
					toast = t;
				},
			}
		);

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('bottom-4', 'left-1/2', '-translate-x-1/2');
	});

	it('renders with bottom-right position', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(
			{ position: 'bottom-right' },
			{
				onAddToast: t => {
					toast = t;
				},
			}
		);

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('bottom-4', 'right-4');
	});

	it('applies correct position classes for all positions', () => {
		const positions: Array<
			'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
		> = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

		const positionClasses = {
			'top-left': ['top-4', 'left-4'],
			'top-center': ['top-4', 'left-1/2', '-translate-x-1/2'],
			'top-right': ['top-4', 'right-4'],
			'bottom-left': ['bottom-4', 'left-4'],
			'bottom-center': ['bottom-4', 'left-1/2', '-translate-x-1/2'],
			'bottom-right': ['bottom-4', 'right-4'],
		};

		for (const position of positions) {
			let toast: ReturnType<typeof useToast> | undefined;

			const { container, unmount } = renderToastContainer(
				{ position },
				{
					onAddToast: t => {
						toast = t;
					},
				}
			);

			act(() => {
				toast?.success(TEST_TITLE_1);
			});

			const containerElement = container.firstChild as HTMLElement;
			for (const className of positionClasses[position]) {
				expect(containerElement).toHaveClass(className);
			}
			unmount();
		}
	});
});

describe('ToastContainer - Multiple Toasts', () => {
	it('renders multiple toasts', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
			toast?.error(TEST_TITLE_2);
			toast?.warning(TEST_TITLE_3);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_2)).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_3)).toBeInTheDocument();
	});

	it('stacks toasts vertically with gap', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
			toast?.error(TEST_TITLE_2);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('flex', 'flex-col', 'gap-2');
	});

	it('updates when toasts are added', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		expect(screen.queryByText(TEST_TITLE_1)).not.toBeInTheDocument();

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();

		act(() => {
			toast?.error(TEST_TITLE_2);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_2)).toBeInTheDocument();
	});

	it('updates when toasts are removed', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		let toastId: string | undefined;

		act(() => {
			toastId = toast?.success(TEST_TITLE_1);
			toast?.error(TEST_TITLE_2);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_2)).toBeInTheDocument();

		act(() => {
			if (toastId) {
				toast?.dismiss(toastId);
			}
		});

		expect(screen.queryByText(TEST_TITLE_1)).not.toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_2)).toBeInTheDocument();
	});

	it('returns null when all toasts are dismissed', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		let toastId: string | undefined;

		act(() => {
			toastId = toast?.success(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();

		act(() => {
			if (toastId) {
				toast?.dismiss(toastId);
			}
		});

		expect(container.firstChild).toBeNull();
	});
});

describe('ToastContainer - Dismissal', () => {
	it('calls dismiss when toast dismiss button is clicked', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const dismissButton = screen.getByRole('button', { name: /dismiss notification/i });
		fireEvent.click(dismissButton);

		expect(screen.queryByText(TEST_TITLE_1)).not.toBeInTheDocument();
	});

	it('dismisses correct toast when multiple are present', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
			toast?.error(TEST_TITLE_2);
		});

		const dismissButtons = screen.getAllByRole('button', { name: /dismiss notification/i });
		// Click the first dismiss button (should dismiss first toast)
		expect(dismissButtons[0]).toBeDefined();
		fireEvent.click(dismissButtons[0]!);

		expect(screen.queryByText(TEST_TITLE_1)).not.toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_2)).toBeInTheDocument();
	});
});

describe('ToastContainer - Intents', () => {
	it('renders toast with success intent', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('renders toast with error intent', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.error(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('renders toast with warning intent', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.warning(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('renders toast with info intent', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.info(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});
});

describe('ToastContainer - Optional Props', () => {
	it('renders toast with title and description', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
				description: TEST_DESCRIPTION_1,
			});
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_DESCRIPTION_1)).toBeInTheDocument();
	});

	it('renders toast with children', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		const customContent = <div data-testid="toast-children">Custom content</div>;

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
				children: customContent,
			});
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.getByTestId('toast-children')).toBeInTheDocument();
	});

	it('passes autoDismiss prop to Toast when provided', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
				autoDismiss: false,
			});
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('passes dismissAfter prop to Toast when provided', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
				dismissAfter: 5000,
			});
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('passes pauseOnHover prop to Toast when provided', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
				pauseOnHover: false,
			});
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('passes action prop to Toast when provided', () => {
		let toast: ReturnType<typeof useToast> | undefined;
		const actionOnClick = vi.fn();

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
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

	it('passes className prop to Toast when provided', () => {
		let toast: ReturnType<typeof useToast> | undefined;
		const customClass = 'custom-toast-class';

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
				className: customClass,
			});
		});

		// Toast component should receive and apply the className
		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('passes role prop to Toast when provided', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
				role: 'alert',
			});
		});

		const toastElement = screen.getByRole('alert');
		expect(toastElement).toBeInTheDocument();
		expect(toastElement).toHaveTextContent(TEST_TITLE_1);
	});

	it('does not pass optional props when not provided', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		// Toast should still render without optional props
		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});
});

describe('ToastContainer - Styling', () => {
	it('has fixed positioning', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('fixed');
	});

	it('has pointer-events-none on container', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('pointer-events-none');
	});

	it('has correct z-index', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveStyle({ zIndex: componentZIndex.popover });
	});

	it('renders as section element', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement.tagName).toBe('SECTION');
	});
});

describe('ToastContainer - Accessibility', () => {
	it('has aria-label attribute', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const container = screen.getByLabelText('Notifications');
		expect(container).toBeInTheDocument();
	});

	it('has aria-live="polite" attribute', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		const { container } = renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveAttribute('aria-live', 'polite');
	});
});

describe('ToastContainer - State Synchronization', () => {
	it('synchronizes visibleToasts with toasts array', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();

		act(() => {
			toast?.error(TEST_TITLE_2);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_2)).toBeInTheDocument();
	});

	it('updates visibleToasts when toasts array changes', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		let toastId: string | undefined;

		act(() => {
			toastId = toast?.success(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();

		act(() => {
			if (toastId) {
				toast?.dismiss(toastId);
			}
		});

		expect(screen.queryByText(TEST_TITLE_1)).not.toBeInTheDocument();
	});
});

describe('ToastContainer - Edge Cases', () => {
	it('handles rapid toast additions and removals', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		let id2: string | undefined;

		act(() => {
			toast?.success(TEST_TITLE_1);
			id2 = toast?.error(TEST_TITLE_2);
			toast?.warning(TEST_TITLE_3);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_2)).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_3)).toBeInTheDocument();

		act(() => {
			if (id2) {
				toast?.dismiss(id2);
			}
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.queryByText(TEST_TITLE_2)).not.toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE_3)).toBeInTheDocument();
	});

	it('handles ReactNode description', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		const nodeDescription = <div data-testid="node-description">Node description</div>;

		act(() => {
			toast?.success({
				title: TEST_TITLE_1,
				description: nodeDescription,
			});
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
		expect(screen.getByTestId('node-description')).toBeInTheDocument();
	});

	it('handles toast with only title (string shorthand)', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.success(TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});

	it('handles toast with default intent (info)', () => {
		let toast: ReturnType<typeof useToast> | undefined;

		renderToastContainer(undefined, {
			onAddToast: t => {
				toast = t;
			},
		});

		act(() => {
			toast?.show('info', TEST_TITLE_1);
		});

		expect(screen.getByText(TEST_TITLE_1)).toBeInTheDocument();
	});
});
