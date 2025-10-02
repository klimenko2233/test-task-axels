import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("socket.io-client", () => ({
    io: vi.fn(() => ({
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
        disconnect: vi.fn(),
    })),
}));

const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (/Warning.*not wrapped in act/.test(args[0]) ||
            /The current testing environment is not configured to support act/.test(args[0])) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});