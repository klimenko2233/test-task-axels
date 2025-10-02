import { describe, it, expect } from "vitest";
import { chatReducer, chatActions } from "../store/ducks/chat.duck.ts";

describe("Chat Reducer - Unit Tests", () => {
    const initialState = {
        messages: {
            General: [
                { id: "1", author: "Alice", text: "Hi!", timestamp: "2025-01-01", room: "General" }
            ]
        },
        isConnected: false
    };

    it("should handle WEBSOCKET_CONNECTED", () => {
        const action = chatActions.webSocketConnected();
        const state = chatReducer(initialState, action);

        expect(state.isConnected).toBe(true);
    });

    it("should add user message to state", () => {
        const userMessage = {
            id: "2",
            author: "John",
            text: "Hello World",
            timestamp: "2025-01-02",
            room: "General"
        };

        const action = chatActions.receiveMessage(userMessage);
        const state = chatReducer(initialState, action);

        expect(state.messages.General).toHaveLength(2);
        expect(state.messages.General[1]).toEqual(userMessage);
    });

    it("should add echo server message to state", () => {
        const echoMessage = {
            id: "3",
            author: "Echo Server",
            text: "Test echo",
            timestamp: "2023-01-03",
            room: "General"
        };

        const action = chatActions.receiveMessage(echoMessage);
        const state = chatReducer(initialState, action);

        expect(state.messages.General).toHaveLength(2);
        expect(state.messages.General[1].author).toBe("Echo Server");
        expect(state.messages.General[1].text).toBe("Test echo");
    });

    it("should handle messages for different rooms", () => {
        const privateMessage = {
            id: "4",
            author: "Private User",
            text: "Private message",
            timestamp: "2023-01-04",
            room: "Private"
        };

        const action = chatActions.receiveMessage(privateMessage);
        const state = chatReducer(initialState, action);

        expect(state.messages.Private).toHaveLength(1);
        expect(state.messages.Private[0]).toEqual(privateMessage);
        expect(state.messages.General).toHaveLength(1);
    });
});