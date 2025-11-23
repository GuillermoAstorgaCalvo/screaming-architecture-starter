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

describe('HttpProvider lifecycle', () => {
	it('maintains context value on unmount and remount', () => {
		const http = createHttpPortMock();
		const { result, unmount } = renderHook(() => useHttp(), {
			wrapper: createWrapper(http),
		});

		const initialValue = result.current;
		unmount();

		const { result: newResult } = renderHook(() => useHttp(), {
			wrapper: createWrapper(http),
		});

		expect(newResult.current).toBe(http);
		expect(newResult.current).toBe(initialValue);
	});
});

describe('HttpProvider context memoization', () => {
	it('memoizes context value when http instance is stable', () => {
		const http = createHttpPortMock();
		const { result, rerender } = renderHook(() => useContext(HttpContext), {
			wrapper: createWrapper(http),
		});

		const firstValue = result.current;
		rerender();

		expect(result.current).toBe(firstValue);
		expect(result.current?.http).toBe(http);
	});

	it('updates context value when http instance changes', () => {
		const firstHttp = createHttpPortMock();
		const secondHttp = createHttpPortMock();
		const onHttp = vi.fn();

		const { rerender } = render(
			<HttpProvider http={firstHttp}>
				<HttpConsumer notify={onHttp} />
			</HttpProvider>
		);

		expect(onHttp).toHaveBeenLastCalledWith(firstHttp);

		rerender(
			<HttpProvider http={secondHttp}>
				<HttpConsumer notify={onHttp} />
			</HttpProvider>
		);

		expect(onHttp).toHaveBeenLastCalledWith(secondHttp);
		expect(secondHttp).not.toBe(firstHttp);
	});
});

describe('HttpProvider composition', () => {
	it('works correctly when nested with other providers', () => {
		const http = createHttpPortMock();

		const NestedWrapper = ({ children }: { children: ReactNode }) => (
			<HttpProvider http={http}>
				<div data-testid="nested">{children}</div>
			</HttpProvider>
		);

		const { result } = renderHook(() => useHttp(), {
			wrapper: NestedWrapper,
		});

		expect(result.current).toBe(http);
	});
});

describe('HttpProvider HTTP methods', () => {
	it('delegates all HTTP methods to the provided port', async () => {
		const http = createHttpPortMock();
		const { result } = renderHook(() => useHttp(), {
			wrapper: createWrapper(http),
		});

		await result.current.get('/get');
		await result.current.post('/post', { data: 'test' });
		await result.current.put('/put', { data: 'test' });
		await result.current.patch('/patch', { data: 'test' });
		await result.current.delete('/delete');
		await result.current.head('/head');
		await result.current.options('/options');
		await result.current.request('/request', { method: 'GET' });

		expect(http.get).toHaveBeenCalledWith('/get');
		expect(http.post).toHaveBeenCalledWith('/post', { data: 'test' });
		expect(http.put).toHaveBeenCalledWith('/put', { data: 'test' });
		expect(http.patch).toHaveBeenCalledWith('/patch', { data: 'test' });
		expect(http.delete).toHaveBeenCalledWith('/delete');
		expect(http.head).toHaveBeenCalledWith('/head');
		expect(http.options).toHaveBeenCalledWith('/options');
		expect(http.request).toHaveBeenCalledWith('/request', { method: 'GET' });
	});
});
