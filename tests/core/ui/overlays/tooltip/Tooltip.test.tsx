import Tooltip from '@core/ui/overlays/tooltip/Tooltip';
import type { TooltipPosition } from '@src-types/ui/overlays/floating';
import { act, fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TOOLTIP_CONTENT = 'Tooltip text';
const BUTTON_TEXT = 'Hover me';

// Helper functions
const renderTooltip = (props?: {
	content?: string;
	disabled?: boolean;
	delay?: number;
	position?: TooltipPosition;
	buttonText?: string;
}) => {
	const content = props?.content ?? TOOLTIP_CONTENT;
	const buttonText = props?.buttonText ?? BUTTON_TEXT;
	const tooltipProps: {
		content: string;
		disabled?: boolean;
		delay?: number;
		position?: TooltipPosition;
	} = {
		content,
	};
	if (props?.disabled !== undefined) {
		tooltipProps.disabled = props.disabled;
	}
	if (props?.delay !== undefined) {
		tooltipProps.delay = props.delay;
	}
	if (props?.position !== undefined) {
		tooltipProps.position = props.position;
	}
	return renderWithProviders(
		<Tooltip {...tooltipProps}>
			<button>{buttonText}</button>
		</Tooltip>
	);
};

const waitForTooltipToAppear = async (delay: number) => {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(delay);
	});
	expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();
};

const waitForTooltipToDisappear = async () => {
	await act(async () => {
		// Flush any pending React updates
		await Promise.resolve();
	});
	expect(screen.queryByText(TOOLTIP_CONTENT)).not.toBeInTheDocument();
};

const triggerTooltipWithMouse = async (buttonText: string, delay: number) => {
	const button = screen.getByText(buttonText);
	fireEvent.mouseEnter(button);
	await waitForTooltipToAppear(delay);
};

const triggerTooltipWithFocus = async (buttonText: string, delay: number) => {
	const button = screen.getByText(buttonText);
	fireEvent.focus(button);
	await waitForTooltipToAppear(delay);
};

const hideTooltipWithMouseLeave = (buttonText: string) => {
	const button = screen.getByText(buttonText);
	fireEvent.mouseLeave(button);
};

const hideTooltipWithBlur = (buttonText: string) => {
	const button = screen.getByText(buttonText);
	fireEvent.blur(button);
};

// Test suites
const renderingTests = () => {
	describe('Rendering', () => {
		it('renders children when tooltip is disabled', () => {
			renderTooltip({ disabled: true });

			expect(screen.getByText(BUTTON_TEXT)).toBeInTheDocument();
			expect(screen.queryByText(TOOLTIP_CONTENT)).not.toBeInTheDocument();
		});

		it('renders children when tooltip is enabled', () => {
			renderTooltip({ disabled: false });

			expect(screen.getByText(BUTTON_TEXT)).toBeInTheDocument();
		});

		it('does not render tooltip content initially', () => {
			renderTooltip();

			expect(screen.queryByText(TOOLTIP_CONTENT)).not.toBeInTheDocument();
		});

		it('renders tooltip content after delay on mouse enter', async () => {
			vi.useFakeTimers();
			renderTooltip({ delay: 100 });

			const button = screen.getByText(BUTTON_TEXT);
			fireEvent.mouseEnter(button);

			expect(screen.queryByText(TOOLTIP_CONTENT)).not.toBeInTheDocument();

			await waitForTooltipToAppear(100);

			vi.useRealTimers();
		});

		it('renders with default position', async () => {
			vi.useFakeTimers();
			renderTooltip();

			await triggerTooltipWithMouse(BUTTON_TEXT, 500);

			vi.useRealTimers();
		});

		it('renders with custom position', async () => {
			vi.useFakeTimers();
			renderTooltip({ position: 'bottom' });

			await triggerTooltipWithMouse(BUTTON_TEXT, 500);

			vi.useRealTimers();
		});
	});
};

const openCloseTests = () => {
	describe('Open/Close', () => {
		it('shows tooltip on mouse enter', async () => {
			vi.useFakeTimers();
			renderTooltip({ delay: 100 });

			await triggerTooltipWithMouse(BUTTON_TEXT, 100);

			vi.useRealTimers();
		});

		it('hides tooltip on mouse leave', async () => {
			vi.useFakeTimers();
			renderTooltip({ delay: 100 });

			await triggerTooltipWithMouse(BUTTON_TEXT, 100);
			hideTooltipWithMouseLeave(BUTTON_TEXT);
			await waitForTooltipToDisappear();

			vi.useRealTimers();
		});

		it('shows tooltip on focus', async () => {
			vi.useFakeTimers();
			renderTooltip({ delay: 100 });

			await triggerTooltipWithFocus(BUTTON_TEXT, 100);

			vi.useRealTimers();
		});

		it('hides tooltip on blur', async () => {
			vi.useFakeTimers();
			renderTooltip({ delay: 100 });

			await triggerTooltipWithFocus(BUTTON_TEXT, 100);
			hideTooltipWithBlur(BUTTON_TEXT);
			await waitForTooltipToDisappear();

			vi.useRealTimers();
		});

		it('does not show tooltip when disabled', async () => {
			vi.useFakeTimers();
			renderTooltip({ disabled: true, delay: 100 });

			const button = screen.getByText(BUTTON_TEXT);
			fireEvent.mouseEnter(button);
			await act(async () => {
				await vi.advanceTimersByTimeAsync(100);
			});

			expect(screen.queryByText(TOOLTIP_CONTENT)).not.toBeInTheDocument();

			vi.useRealTimers();
		});
	});
};

const focusManagementTests = () => {
	describe('Focus Management', () => {
		it('shows tooltip when element receives focus', async () => {
			vi.useFakeTimers();
			renderTooltip({ delay: 100, buttonText: 'Focus me' });

			await triggerTooltipWithFocus('Focus me', 100);

			vi.useRealTimers();
		});

		it('hides tooltip when element loses focus', async () => {
			vi.useFakeTimers();
			renderTooltip({ delay: 100, buttonText: 'Focus me' });

			await triggerTooltipWithFocus('Focus me', 100);
			hideTooltipWithBlur('Focus me');
			await waitForTooltipToDisappear();

			vi.useRealTimers();
		});
	});
};

const accessibilityTests = () => {
	describe('Accessibility', () => {
		it('has no accessibility violations', async () => {
			vi.useFakeTimers();
			const { container } = renderTooltip({ delay: 100 });

			await triggerTooltipWithMouse(BUTTON_TEXT, 100);
			vi.useRealTimers();
			await expectA11y(container);
		});

		it('has proper ARIA attributes when visible', async () => {
			vi.useFakeTimers();
			renderTooltip({ delay: 100 });

			await triggerTooltipWithMouse(BUTTON_TEXT, 100);

			const tooltip = screen.getByRole('tooltip');
			expect(tooltip).toHaveAttribute('role', 'tooltip');
			expect(tooltip).toHaveTextContent(TOOLTIP_CONTENT);

			vi.useRealTimers();
		});
	});
};

describe('Tooltip', () => {
	renderingTests();
	openCloseTests();
	focusManagementTests();
	accessibilityTests();
});
