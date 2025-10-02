import { render, screen, fireEvent } from "@testing-library/react";
import { Home } from "./Home";
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

    it("should render user info and current room", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        expect(screen.getByText(/Welcome, John Doe!/i)).toBeInTheDocument();
        const heading = screen.getAllByRole("heading", { level: 6 });
        const welcomeHeading = heading[1];
        expect(welcomeHeading).toHaveTextContent(/General/i);
    });

    it("should display messages from props in the chat", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        expect(screen.getByText("Alice:")).toBeInTheDocument();
        expect(screen.getByText("Hi!")).toBeInTheDocument();
        expect(screen.getByText("Bob:")).toBeInTheDocument();
        expect(screen.getByText("Hello!")).toBeInTheDocument();
    });

    it("should display empty chat when no messages in props", () => {
        const noMessagesProps = {
            ...mockProps,
            messages: []
        };
        render(
            <Provider store={createMockStore()}>
                <Home {...noMessagesProps}/>
            </Provider>
        );
        expect(screen.getByText(/Welcome, John Doe!/i)).toBeInTheDocument();
        expect(screen.queryByText("Alice:")).not.toBeInTheDocument();
        expect(screen.queryByText("Bob:")).not.toBeInTheDocument();
        expect(screen.queryByText("Hi!")).not.toBeInTheDocument();
    });

    it("should display input field and send button", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        expect(screen.getByPlaceholderText(/Type your message.../i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    it("button should call onSendMessage when clicked", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        const sendButton = screen.getByRole("button", { name: /send/i });
        fireEvent.click(sendButton);
        expect(mockProps.onSendMessage).toHaveBeenCalledTimes(1);

    });

    it("should disable send button and input when not connected", () => {
        const disconnectedProps = {
            ...mockProps,
            isConnected: false
        };
        render(
            <Provider store={createMockStore()}>
                <Home {...disconnectedProps}/>
            </Provider>
        );
        const sendButton = screen.getByRole("button", { name: /send/i });
        expect(sendButton).toBeDisabled();
        const messageInput = screen.getByPlaceholderText(/Type your message.../i);
        expect(messageInput).toBeDisabled();
    });

    it("should call onMessageChange when typing in input", () => {
        render(
            <Provider store={createMockStore()}>
                <Home {...mockProps}/>
            </Provider>
        );
        const messageInput = screen.getByPlaceholderText(/Type your message.../i);
        fireEvent.change(messageInput, { target: { value: "New message" } });
        expect(mockProps.onMessageChange).toHaveBeenCalledWith("New message");
    });

    it("should call onSendMessage when pressing Enter", () => {
        const withMessageProps = {
            ...mockProps,
            currentMessage: "Test message"
        };
        render(
            <Provider store={createMockStore()}>
                <Home {...withMessageProps}/>
            </Provider>
        );
        const messageInput = screen.getByPlaceholderText(/Type your message.../i);
        fireEvent.keyDown(messageInput, { key: "Enter" });
        expect(mockProps.onSendMessage).toHaveBeenCalledTimes(1);
    });

    it("should display user message and echo message from server", () => {
        const messagesWithEcho = [
            { author: "John", text: "Hello everyone!" },
            { author: "Echo Server", text: "Hello everyone!" }
        ];

        const propsWithEcho = {
            ...mockProps,
            messages: messagesWithEcho
        };

        render(
            <Provider store={createMockStore()}>
                <Home {...propsWithEcho} />
            </Provider>
        );

        expect(screen.getByText("John:")).toBeInTheDocument();
        expect(screen.getByText("Echo Server:")).toBeInTheDocument();

        const messages = screen.getAllByText("Hello everyone!");
        expect(messages).toHaveLength(2);
    });

    it("should display multiple echo messages correctly", () => {
        const multipleMessages = [
            { author: "Alice", text: "First message" },
            { author: "Echo Server", text: "First message" },
            { author: "Bob", text: "Second message" },
            { author: "Echo Server", text: "Second message" }
        ];

        const props = {
            ...mockProps,
            messages: multipleMessages
        };

        render(
            <Provider store={createMockStore()}>
                <Home {...props} />
            </Provider>
        );

        expect(screen.getByText("Alice:")).toBeInTheDocument();
        expect(screen.getByText("Bob:")).toBeInTheDocument();
        expect(screen.getAllByText("Echo Server:")).toHaveLength(2);

        expect(screen.getAllByText("First message")).toHaveLength(2);
        expect(screen.getAllByText("Second message")).toHaveLength(2);
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