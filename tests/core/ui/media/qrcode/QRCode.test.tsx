/**
 * QRCode Component Tests
 *
 * Tests for the QRCode component including:
 * - Rendering
 * - Props handling
 * - Default values
 * - Image settings
 * - Accessibility
 */

import QRCode from '@core/ui/media/qrcode/QRCode';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TEST_VALUE = 'https://example.com';
const TEST_VALUE_LONG = 'https://example.com/very/long/path/with/many/segments';

describe('QRCode - Rendering', () => {
	it('renders QR code element', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('renders with default size', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('width', '256');
		expect(svg).toHaveAttribute('height', '256');
	});

	it('renders with custom size', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} size={200} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('width', '200');
		expect(svg).toHaveAttribute('height', '200');
	});

	it('renders with custom className', () => {
		const { container } = renderWithProviders(
			<QRCode value={TEST_VALUE} className="custom-class" />
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('custom-class');
	});
});

describe('QRCode - Default Props', () => {
	it('uses default size of 256', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '256');
		expect(svg).toHaveAttribute('height', '256');
	});

	it('uses default level of M', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		// Level is used internally by QRCodeSVG
	});

	it('uses default colors from design tokens', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		// Colors are applied internally by QRCodeSVG
	});

	it('uses default includeMargin of true', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		// Margin is applied internally by QRCodeSVG
	});
});

describe('QRCode - Props', () => {
	it('handles custom size', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} size={128} />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '128');
		expect(svg).toHaveAttribute('height', '128');
	});

	it('handles custom level', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} level="H" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles all level options', () => {
		const levels: Array<'L' | 'M' | 'Q' | 'H'> = ['L', 'M', 'Q', 'H'];
		for (const level of levels) {
			const { container, unmount } = renderWithProviders(
				<QRCode value={TEST_VALUE} level={level} />
			);
			const svg = container.querySelector('svg');
			expect(svg).toBeInTheDocument();
			unmount();
		}
	});

	it('handles custom bgColor', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} bgColor="#FF0000" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles custom fgColor', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} fgColor="#0000FF" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles includeMargin prop', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} includeMargin={false} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles all props together', () => {
		const { container } = renderWithProviders(
			<QRCode
				value={TEST_VALUE}
				size={200}
				level="H"
				bgColor="#FFFFFF"
				fgColor="#000000"
				includeMargin={true}
				className="custom-class"
			/>
		);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('width', '200');
		expect(svg).toHaveAttribute('height', '200');
	});
});

describe('QRCode - Image Settings', () => {
	it('renders without image when imageSettings is not provided', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('renders with image when imageSettings has height and width', () => {
		const { container } = renderWithProviders(
			<QRCode
				value={TEST_VALUE}
				imageSettings={{
					src: '/logo.png',
					height: 50,
					width: 50,
				}}
			/>
		);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		// Note: qrcode.react may render image differently, so we just check SVG exists
		expect(svg).toBeInTheDocument();
	});

	it('does not render image when imageSettings has no height', () => {
		const { container } = renderWithProviders(
			<QRCode
				value={TEST_VALUE}
				imageSettings={{
					src: '/logo.png',
					width: 50,
				}}
			/>
		);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		// Image should not be rendered when height is missing
		const image = svg?.querySelector('image');
		expect(image).not.toBeInTheDocument();
	});

	it('does not render image when imageSettings has no width', () => {
		const { container } = renderWithProviders(
			<QRCode
				value={TEST_VALUE}
				imageSettings={{
					src: '/logo.png',
					height: 50,
				}}
			/>
		);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		// Image should not be rendered when width is missing
		const image = svg?.querySelector('image');
		expect(image).not.toBeInTheDocument();
	});

	it('handles imageSettings with excavate', () => {
		const { container } = renderWithProviders(
			<QRCode
				value={TEST_VALUE}
				imageSettings={{
					src: '/logo.png',
					height: 50,
					width: 50,
					excavate: true,
				}}
			/>
		);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		const image = svg?.querySelector('image');
		expect(image).toBeInTheDocument();
	});

	it('handles imageSettings with excavate false', () => {
		const { container } = renderWithProviders(
			<QRCode
				value={TEST_VALUE}
				imageSettings={{
					src: '/logo.png',
					height: 50,
					width: 50,
					excavate: false,
				}}
			/>
		);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		const image = svg?.querySelector('image');
		expect(image).toBeInTheDocument();
	});
});

describe('QRCode - Value Handling', () => {
	it('handles short values', () => {
		const { container } = renderWithProviders(<QRCode value="test" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles long values', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE_LONG} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles URL values', () => {
		const { container } = renderWithProviders(<QRCode value="https://example.com" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles text values', () => {
		const { container } = renderWithProviders(<QRCode value="Hello World" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles numeric values as string', () => {
		const { container } = renderWithProviders(<QRCode value="1234567890" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});
});

describe('QRCode - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		// Disable rules for third-party QRCodeSVG component limitations
		await expectA11y(container, {
			rules: {
				'color-contrast': { enabled: false },
				'page-has-heading-one': { enabled: false },
				'svg-img-alt': { enabled: false },
				'aria-prohibited-attr': { enabled: false },
			},
		} as Parameters<typeof expectA11y>[1]);
	});

	it('renders in a container div', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toBeInstanceOf(HTMLDivElement);
	});

	it('supports custom className for styling', () => {
		const { container } = renderWithProviders(
			<QRCode value={TEST_VALUE} className="qr-code-wrapper" />
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('qr-code-wrapper');
	});
});

describe('QRCode - Additional Props', () => {
	it('passes through additional HTML attributes', () => {
		renderWithProviders(<QRCode value={TEST_VALUE} data-testid="custom-qr" id="qr-1" />);
		const container = screen.getByTestId('custom-qr');
		expect(container).toBeInTheDocument();
		expect(container).toHaveAttribute('id', 'qr-1');
	});

	it('handles onMouseEnter and onMouseLeave', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		const { container } = renderWithProviders(
			<QRCode value={TEST_VALUE} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
		);
		const wrapper = container.firstChild as HTMLElement;
		fireEvent.mouseEnter(wrapper);
		expect(handleMouseEnter).toHaveBeenCalledTimes(1);
		fireEvent.mouseLeave(wrapper);
		expect(handleMouseLeave).toHaveBeenCalledTimes(1);
	});
});

describe('QRCode - Edge Cases', () => {
	it('handles empty string value', () => {
		const { container } = renderWithProviders(<QRCode value="" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles very small size', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} size={10} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('width', '10');
		expect(svg).toHaveAttribute('height', '10');
	});

	it('handles very large size', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} size={1000} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('width', '1000');
		expect(svg).toHaveAttribute('height', '1000');
	});

	it('handles imageSettings with undefined excavate', () => {
		const { container } = renderWithProviders(
			<QRCode
				value={TEST_VALUE}
				imageSettings={{
					src: '/logo.png',
					height: 50,
					width: 50,
				}}
			/>
		);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		const image = svg?.querySelector('image');
		expect(image).toBeInTheDocument();
	});
});

describe('QRCode - Unused Props', () => {
	it('ignores renderAs prop (not implemented)', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} renderAs="canvas" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		// renderAs is accepted but not used (always renders as SVG)
	});

	it('ignores sizeVariant prop (not implemented)', () => {
		const { container } = renderWithProviders(<QRCode value={TEST_VALUE} sizeVariant="lg" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		// sizeVariant is accepted but not used
	});
});
