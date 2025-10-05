import { render, screen, fireEvent } from "@testing-library/react";
import { Home } from "../components";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { vi } from "vitest";

const createMockStore = () =>
    configureStore({
        reducer: {
            rooms: (state = {
                rooms: [
                    { id: "1", name: "General", users: ["Alice", "Bob"] },
                    { id: "2", name: "Random", users: [] }
                ],
                currentRoom: "General"
            }) => state
        }
    });

const mockProps = {
    userName: "John Doe",
    currentRoom: "General",
    onRoomChange: vi.fn(),
    messages: [
        { author: "Alice", text: "Hi!" },
        { author: "Bob", text: "Hello!" }
    ],
    currentMessage: "",
    onMessageChange: vi.fn(),
    onSendMessage: vi.fn(),
    isConnected: true,
};

describe("Home Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should display welcome message with user name", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        expect(screen.getByText(/Welcome, John Doe!/i)).toBeInTheDocument();
    });

    it("should display current room in welcome message", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        const heading = screen.getAllByRole("heading", { level: 6 });
        expect(heading[1]).toHaveTextContent(/General/i);
    });

    it("should display Alice's message with author and text", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        expect(screen.getByText("Alice:")).toBeInTheDocument();
    });

    it("should display Bob's message with author and text", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        expect(screen.getByText("Bob:")).toBeInTheDocument();
    });

    it("should not display any messages when messages array is empty", () => {
        const noMessagesProps = { ...mockProps, messages: [] };
        render(
            <Provider store={createMockStore()}>
                <Home {...noMessagesProps}/>
            </Provider>
        );
        expect(screen.queryByText("Alice:")).not.toBeInTheDocument();
    });

    it("should display message input field", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        expect(screen.getByPlaceholderText(/Type your message.../i)).toBeInTheDocument();
    });

    it("should display send button", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    it("should call onSendMessage when send button is clicked", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        expect(mockProps.onSendMessage).toHaveBeenCalledTimes(1);
    });

    it("should call onMessageChange when typing in input", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        fireEvent.change(screen.getByPlaceholderText(/Type your message.../i), {
            target: { value: "New message" }
        });
        expect(mockProps.onMessageChange).toHaveBeenCalledWith("New message");
    });

    it("should call onSendMessage when pressing Enter", () => {
        const withMessageProps = { ...mockProps, currentMessage: "Test message" };
        render(
            <Provider store={createMockStore()}>
                <Home {...withMessageProps}/>
            </Provider>
        );
        fireEvent.keyDown(screen.getByPlaceholderText(/Type your message.../i), { key: "Enter" });
        expect(mockProps.onSendMessage).toHaveBeenCalledTimes(1);
    });

    it("should disable send button when not connected", () => {
        const disconnectedProps = { ...mockProps, isConnected: false };
        render(
            <Provider store={createMockStore()}>
                <Home {...disconnectedProps}/>
            </Provider>
        );
        expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
    });

    it("should disable message input when not connected", () => {
        const disconnectedProps = { ...mockProps, isConnected: false };
        render(
            <Provider store={createMockStore()}>
                <Home {...disconnectedProps}/>
            </Provider>
        );
        expect(screen.getByPlaceholderText(/Type your message.../i)).toBeDisabled();
    });

    it("should display user message and echo message authors", () => {
        const messagesWithEcho = [
            { author: "John", text: "Hello everyone!" },
            { author: "Echo Server", text: "Hello everyone!" }
        ];
        const propsWithEcho = { ...mockProps, messages: messagesWithEcho };
        render(
            <Provider store={createMockStore()}>
                <Home {...propsWithEcho} />
            </Provider>
        );
        expect(screen.getByText("John:")).toBeInTheDocument();
    });

    it("should display echo server message author", () => {
        const messagesWithEcho = [
            { author: "John", text: "Hello everyone!" },
            { author: "Echo Server", text: "Hello everyone!" }
        ];
        const propsWithEcho = { ...mockProps, messages: messagesWithEcho };
        render(
            <Provider store={createMockStore()}>
                <Home {...propsWithEcho} />
            </Provider>
        );
        expect(screen.getByText("Echo Server:")).toBeInTheDocument();
    });

    it("should display multiple instances of same message text for echo", () => {
        const messagesWithEcho = [
            { author: "John", text: "Hello everyone!" },
            { author: "Echo Server", text: "Hello everyone!" }
        ];
        const propsWithEcho = { ...mockProps, messages: messagesWithEcho };
        render(
            <Provider store={createMockStore()}>
                <Home {...propsWithEcho} />
            </Provider>
        );
        expect(screen.getAllByText("Hello everyone!")).toHaveLength(2);
    });

    it("should display multiple echo server authors in complex scenario", () => {
        const multipleMessages = [
            { author: "Alice", text: "First message" },
            { author: "Echo Server", text: "First message" },
            { author: "Bob", text: "Second message" },
            { author: "Echo Server", text: "Second message" }
        ];
        const props = { ...mockProps, messages: multipleMessages };
        render(
            <Provider store={createMockStore()}>
                <Home {...props} />
            </Provider>
        );
        expect(screen.getAllByText("Echo Server:")).toHaveLength(2);
    });

    it("should match snapshot", () => {
        const { container } = render(
            <Provider store={createMockStore()}>
                <Home {...mockProps} />
            </Provider>
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});