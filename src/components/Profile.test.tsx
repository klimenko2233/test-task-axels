import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Profile } from "./Profile";

interface MockState {
    auth: {
        user: { id: string; name: string; isOnline: boolean } | null;
        isAuthenticated: boolean;
    };
    chat: {
        isConnected: boolean;
    };
}

const createMockStore = (initialState: MockState) =>
    configureStore({
        reducer: {
            auth: (state = initialState.auth) => state,
            chat: (state = initialState.chat) => state,
        },
    });

describe("Profile Component", () => {
    it("should render user name when user is logged in", () => {
        const mockStore = createMockStore({
            auth: {
                user: { id: "1", name: "John Doe", isOnline: true },
                isAuthenticated: true
            },
            chat: {
                isConnected: true
            }
        });

        render(
            <Provider store={mockStore}>
                <Profile />
            </Provider>
        );

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("should show offline status when not connected", () => {
        const mockStore = createMockStore({
            auth: {
                user: { id: "1", name: "Jane Doe", isOnline: false },
                isAuthenticated: true
            },
            chat: {
                isConnected: false
            }
        });

        render(
            <Provider store={mockStore}>
                <Profile />
            </Provider>
        );

        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
        expect(screen.getByText("Offline")).toBeInTheDocument();
    });

    it("should not render when user is not authenticated", () => {
        const mockStore = createMockStore({
            auth: {
                user: null,
                isAuthenticated: false
            },
            chat: {
                isConnected: false
            }
        });

        const { container } = render(
            <Provider store={mockStore}>
                <Profile />
            </Provider>
        );

        expect(container.firstChild).toBeNull();
    });

    it("should have logout button", () => {
        const mockStore = createMockStore({
            auth: {
                user: { id: "1", name: "John Doe", isOnline: true },
                isAuthenticated: true
            },
            chat: {
                isConnected: true
            }
        });

        render(
            <Provider store={mockStore}>
                <Profile />
            </Provider>
        );

        const logoutButton = screen.getByRole("button", { name: /logout/i });
        expect(logoutButton).toBeInTheDocument();
        fireEvent.click(logoutButton);
    });
    it("should match snapshot when user is online", () => {
        const mockStore = createMockStore({
            auth: {
                user: { id: "1", name: "John Doe", isOnline: true },
                isAuthenticated: true
            },
            chat: {
                isConnected: true
            }
        });

        const { container } = render(
            <Provider store={mockStore}>
                <Profile />
            </Provider>
        );

        expect(container.firstChild).toMatchSnapshot();
    });
});