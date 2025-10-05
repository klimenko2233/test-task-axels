import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Profile } from "../components";

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
    describe("When user is authenticated", () => {
        it("should display user name", () => {
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
                    <Profile/>
                </Provider>
            );
            expect(screen.getByText("John Doe")).toBeInTheDocument();
        });

        it("should display online status when connected", () => {
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
                    <Profile/>
                </Provider>
            );
            expect(screen.getByText("Online")).toBeInTheDocument();
        });

        it("should display offline status when not connected", () => {
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
                    <Profile/>
                </Provider>
            );
            expect(screen.getByText("Offline")).toBeInTheDocument();
        });

        it("should render logout button", () => {
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
                    <Profile/>
                </Provider>
            );
            const logoutButton = screen.getByRole("button", { name: /logout/i });
            expect(logoutButton).toBeInTheDocument();
        });

        it("should allow clicking logout button", () => {
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
                    <Profile/>
                </Provider>
            );
            const logoutButton = screen.getByRole("button", { name: /logout/i });
            fireEvent.click(logoutButton);
            expect(logoutButton).toBeInTheDocument();
        });
    });

    describe("When user is not authenticated", () => {
        it("should not render any content", () => {
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
                    <Profile/>
                </Provider>
            );
            expect(container.firstChild).toBeNull();
        });
    });

    describe("Snapshot tests", () => {
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
                    <Profile/>
                </Provider>
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});