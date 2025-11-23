/**
 * NotificationBadge Component Tests
 *
 * Tests for NotificationBadge component including:
 * - Rendering
 * - Display count formatting (normal count, max count exceeded)
 * - Badge variants
 * - Animation state
 * - Accessibility
 */

import { NotificationBadge } from '@core/ui/feedback/notification-bell/components/NotificationBadge';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const DEFAULT_MAX_COUNT = 99;
const DEFAULT_BADGE_VARIANT = 'error';

describe('NotificationBadge - Rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(
				<NotificationBadge
					count={5}
					maxCount={DEFAULT_MAX_COUNT}
					badgeVariant={DEFAULT_BADGE_VARIANT}
					animated={false}
				/>
			);
		}).not.toThrow();
	});

	it('should render badge element', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		const badge = screen.getByText('5');
		expect(badge).toBeInTheDocument();
	});

	it('should render with correct positioning classes', () => {
		const { container } = renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		const wrapper = container.querySelector('span');
		expect(wrapper).toHaveClass('absolute', '-top-1', '-right-1');
		expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
		expect(wrapper).toHaveClass('min-w-5', 'h-5', 'px-1');
	});

	it('should render Badge component with correct props', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant="primary"
				animated={false}
			/>
		);
		const badge = screen.getByText('5');
		expect(badge).toBeInTheDocument();
		expect(badge.tagName).toBe('SPAN');
	});
});

describe('NotificationBadge - Display Count Formatting', () => {
	it('should display exact count when count is less than maxCount', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should display exact count when count equals maxCount', () => {
		renderWithProviders(
			<NotificationBadge
				count={99}
				maxCount={99}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('99')).toBeInTheDocument();
	});

	it('should display maxCount with "+" suffix when count exceeds maxCount', () => {
		renderWithProviders(
			<NotificationBadge
				count={150}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('99+')).toBeInTheDocument();
	});

	it('should display maxCount with "+" suffix for large counts', () => {
		renderWithProviders(
			<NotificationBadge
				count={1000}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('99+')).toBeInTheDocument();
	});

	it('should handle custom maxCount values', () => {
		renderWithProviders(
			<NotificationBadge
				count={50}
				maxCount={50}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('50')).toBeInTheDocument();
	});

	it('should display custom maxCount with "+" when exceeded', () => {
		renderWithProviders(
			<NotificationBadge
				count={75}
				maxCount={50}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('50+')).toBeInTheDocument();
	});

	it('should display zero count', () => {
		renderWithProviders(
			<NotificationBadge
				count={0}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('0')).toBeInTheDocument();
	});

	it('should display single digit count', () => {
		renderWithProviders(
			<NotificationBadge
				count={1}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('1')).toBeInTheDocument();
	});
});

describe('NotificationBadge - Badge Variants', () => {
	it('should render with error variant', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant="error"
				animated={false}
			/>
		);
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should render with primary variant', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant="primary"
				animated={false}
			/>
		);
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should render with success variant', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant="success"
				animated={false}
			/>
		);
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should render with warning variant', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant="warning"
				animated={false}
			/>
		);
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should render with info variant', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant="info"
				animated={false}
			/>
		);
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should render with default variant', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant="default"
				animated={false}
			/>
		);
		expect(screen.getByText('5')).toBeInTheDocument();
	});
});

describe('NotificationBadge - Animation', () => {
	it('should not apply animation class when animated is false', () => {
		const { container } = renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		const wrapper = container.querySelector('span');
		expect(wrapper).not.toHaveClass('animate-pulse');
	});

	it('should apply animation class when animated is true', () => {
		const { container } = renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={true}
			/>
		);
		const wrapper = container.querySelector('span');
		expect(wrapper).toHaveClass('animate-pulse');
	});

	it('should apply animation with different badge variants', () => {
		const { container } = renderWithProviders(
			<NotificationBadge
				count={10}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant="primary"
				animated={true}
			/>
		);
		const wrapper = container.querySelector('span');
		expect(wrapper).toHaveClass('animate-pulse');
		expect(screen.getByText('10')).toBeInTheDocument();
	});

	it('should apply animation with max count exceeded', () => {
		const { container } = renderWithProviders(
			<NotificationBadge
				count={150}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={true}
			/>
		);
		const wrapper = container.querySelector('span');
		expect(wrapper).toHaveClass('animate-pulse');
		expect(screen.getByText('99+')).toBeInTheDocument();
	});
});

describe('NotificationBadge - Accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		await expectA11y(container);
	});

	it('should be readable by screen readers', () => {
		renderWithProviders(
			<NotificationBadge
				count={5}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		const badge = screen.getByText('5');
		expect(badge).toBeInTheDocument();
		// Content should be accessible to screen readers
	});

	it('should display accessible count text for screen readers', () => {
		renderWithProviders(
			<NotificationBadge
				count={150}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('99+')).toBeInTheDocument();
	});
});

describe('NotificationBadge - Edge Cases', () => {
	it('should handle very large count values', () => {
		renderWithProviders(
			<NotificationBadge
				count={999999}
				maxCount={DEFAULT_MAX_COUNT}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('99+')).toBeInTheDocument();
	});

	it('should handle maxCount of 1', () => {
		renderWithProviders(
			<NotificationBadge
				count={1}
				maxCount={1}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('should handle maxCount of 1 with exceeded count', () => {
		renderWithProviders(
			<NotificationBadge
				count={2}
				maxCount={1}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('1+')).toBeInTheDocument();
	});

	it('should handle small maxCount values', () => {
		renderWithProviders(
			<NotificationBadge
				count={10}
				maxCount={5}
				badgeVariant={DEFAULT_BADGE_VARIANT}
				animated={false}
			/>
		);
		expect(screen.getByText('5+')).toBeInTheDocument();
	});
});
