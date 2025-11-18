import type { HttpClientResponse, HttpPort } from '@core/ports/HttpPort';
import { HttpContext } from '@core/providers/http/HttpContext';
import { HttpProvider } from '@core/providers/http/HttpProvider';
import { useHttp } from '@core/providers/http/useHttp';
import { render, renderHook } from '@testing-library/react';
import { type ReactNode, useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockHttpResponse = (): HttpClientResponse => ({
	data: null,
	status: 200,
	statusText: 'OK',
	headers: new Headers(),
	response: {} as Response,
});

const createHttpPortMock = (): HttpPort => {
	const createMethod = () => vi.fn().mockResolvedValue(createMockHttpResponse());
	return {
		request: createMethod(),
		get: createMethod(),
		post: createMethod(),
		put: createMethod(),
		patch: createMethod(),
		delete: createMethod(),
		head: createMethod(),
		options: createMethod(),
	};
};

const createWrapper = (http: HttpPort) => {
	return function Wrapper({ children }: { children: ReactNode }) {
		return <HttpProvider http={http}>{children}</HttpProvider>;
	};
};

function HttpConsumer({ notify }: { notify: (client: HttpPort) => void }) {
	const http = useHttp();
	notify(http);
	return null;
}

describe('HttpProvider', () => {
	it('provides the HttpContext value to descendants', () => {
		const http = createHttpPortMock();

		const { result } = renderHook(() => useContext(HttpContext), {
			wrapper: createWrapper(http),
		});

		expect(result.current?.http).toBe(http);
	});

	it('injects the provided HttpPort into the useHttp hook', async () => {
		const http = createHttpPortMock();

		const { result } = renderHook(() => useHttp(), {
			wrapper: createWrapper(http),
		});

		expect(result.current).toBe(http);

		await result.current.get('/test');
		expect(http.get).toHaveBeenCalledWith('/test');
	});

	it('allows components using useHttp to receive updates when the client changes', () => {
		const firstClient = createHttpPortMock();
		const nextClient = createHttpPortMock();
		const onHttp = vi.fn();

		const { rerender } = render(
			<HttpProvider http={firstClient}>
				<HttpConsumer notify={onHttp} />
			</HttpProvider>
		);

		expect(onHttp).toHaveBeenLastCalledWith(firstClient);

		rerender(
			<HttpProvider http={nextClient}>
				<HttpConsumer notify={onHttp} />
			</HttpProvider>
		);

		expect(onHttp).toHaveBeenLastCalledWith(nextClient);
	});

	it('throws when useHttp is called outside of HttpProvider', () => {
		expect(() => renderHook(() => useHttp())).toThrowError(
			'useHttp must be used within an HttpProvider'
		);
	});
});
