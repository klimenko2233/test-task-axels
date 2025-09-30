// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import "@testing-library/jest-dom";

interface WebSocketEvent {
    data: string;
}

class WebSocketMock {
    url: string;
    onopen: () => void = () => {};
    onmessage: (event: WebSocketEvent) => void = () => {};
    send = jest.fn();
    close = jest.fn();

    constructor(url: string) {
        this.url = url;
        setTimeout(() => this.onopen(), 0);
    }
}

global.WebSocket = WebSocketMock;

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});