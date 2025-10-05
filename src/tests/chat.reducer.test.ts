import { describe } from "vitest";
import { chatActions, chatReducer } from "../store/ducks/chat.duck.ts";

describe("Chat Reducer - Unit Tests", () => {
    const initialState = {
        messages: {
            General: [{ id: "1", author: "John", text: "Hello", timestamp: "2025-01-01", room: "General" }]
        },
        isConnected: false
    };
    describe("WEBSOCKET_CONNECTED action", () => {
        it("should set isConnected to true when handling WEBSOCKET_CONNECTED", () => {
            const action = chatActions.webSocketConnected();
            const state = chatReducer(initialState, action);
            expect(state.isConnected).toBe(true);
        });
    });
    describe("MESSAGE_RECEIVE action", () => {
        describe("when receiving user message", () => {
            it("should increase message count in room when adding user message", () => {
                const userMessage = {
                    id: "2",
                    author: "Jane",
                    text: "Hi",
                    timestamp: "2025-01-02",
                    room: "General"
                };
                const action = chatActions.receiveMessage(userMessage);
                const state = chatReducer(initialState, action);
                expect(state.messages.General.length).toBe(2);
            });
            it("should add user message to correct position in room", () => {
                const userMessage = {
                    id: "2",
                    author: "Jane",
                    text: "Hi",
                    timestamp: "2025-01-02",
                    room: "General"
                };
                const action = chatActions.receiveMessage(userMessage);
                const state = chatReducer(initialState, action);
                expect(state.messages.General[1]).toEqual(userMessage);
            });
        });

        describe("when receiving echo server message", () => {
            it("should increase message count when adding echo server message", () => {
                const echoServerMessage = {
                    id: "3",
                    author: "Echo Server",
                    text: "Test Message",
                    timestamp: "2025-01-03",
                    room: "General"
                };
                const action = chatActions.receiveMessage(echoServerMessage);
                const state = chatReducer(initialState, action);
                expect(state.messages.General.length).toBe(2);
            });

            it("should set correct author for echo server message", () => {
                const echoServerMessage = {
                    id: "3",
                    author: "Echo Server",
                    text: "Test Message",
                    timestamp: "2025-01-03",
                    room: "General"
                };
                const action = chatActions.receiveMessage(echoServerMessage);
                const state = chatReducer(initialState, action);
                expect(state.messages.General[1].author).toBe("Echo Server");
            });

            it("should set correct text for echo server message", () => {
                const echoServerMessage = {
                    id: "3",
                    author: "Echo Server",
                    text: "Test Message",
                    timestamp: "2025-01-03",
                    room: "General"
                };
                const action = chatActions.receiveMessage(echoServerMessage);
                const state = chatReducer(initialState, action);
                expect(state.messages.General[1].text).toBe("Test Message");
            });
        });
        describe("When receiving message for different room", () => {
            it("should create new room when receiving message for non-existent room", () => {
                const privateMessage = {
                    id: "4",
                    author: "Private User",
                    text: "Private message",
                    timestamp: "2023-01-04",
                    room: "Private"
                };
                const action = chatActions.receiveMessage(privateMessage);
                const state = chatReducer(initialState, action);
                expect(state.messages.Private).toBeDefined();
            });

            it("should add message to new room when receiving message for non-existent room", () => {
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
            });

            it("should store correct message in new room", () => {
                const privateMessage = {
                    id: "4",
                    author: "Private User",
                    text: "Private message",
                    timestamp: "2023-01-04",
                    room: "Private"
                };
                const action = chatActions.receiveMessage(privateMessage);
                const state = chatReducer(initialState, action);
                expect(state.messages.Private[0]).toEqual(privateMessage);
            });

            it("should not modify existing rooms when adding message to new room", () => {
                const privateMessage = {
                    id: "4",
                    author: "Private User",
                    text: "Private message",
                    timestamp: "2023-01-04",
                    room: "Private"
                };
                const action = chatActions.receiveMessage(privateMessage);
                const state = chatReducer(initialState, action);
                expect(state.messages.General).toHaveLength(1);
            });
        });
    });
});