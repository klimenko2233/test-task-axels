import { describe } from "vitest";
import { authActions, authReducer } from "../store/ducks/auth.duck.ts";

describe("Auth Reducer - Unit Tests", () => {
    const initialState = {
        user: null,
        isAuthenticated: false
    };

    describe("Initial state and unknown action", () => {
        it("should return initial state for unknown action", () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const action = { type: "UNKNOWN_ACTION" } as any;
            const state = authReducer(initialState, action);
            expect(state).toEqual(initialState);
        });
    });

    describe("AUTH_LOGIN_SUCCESS action", () => {
        it("should set user when handling AUTH_LOGIN_SUCCESS", () => {
            const user = { id: "1", name: "John", isOnline: true };
            const action = authActions.loginSuccess(user);
            const state = authReducer(initialState, action);
            expect(state.user).toEqual(user);
        });

        it("should set isAuthenticated to true when handling AUTH_LOGIN_SUCCESS", () => {
            const user = { id: "1", name: "John", isOnline: true };
            const action = authActions.loginSuccess(user);
            const state = authReducer(initialState, action);
            expect(state.isAuthenticated).toBe(true);
        });

        it("should overwrite existing user when handling AUTH_LOGIN_SUCCESS", () => {
            const existingState = {
                user: { id: "1111", name: "Old User", isOnline: true },
                isAuthenticated: true
            };
            const newUser = { id: "2222", name: "New User", isOnline: true };
            const action = authActions.loginSuccess(newUser);
            const state = authReducer(existingState, action);
            expect(state.user).toEqual(newUser);
        });

        it("should maintain isAuthenticated as true when overwriting user with AUTH_LOGIN_SUCCESS", () => {
            const existingState = {
                user: { id: "1111", name: "Old User", isOnline: true },
                isAuthenticated: true
            };
            const newUser = { id: "2222", name: "New User", isOnline: true };
            const action = authActions.loginSuccess(newUser);
            const state = authReducer(existingState, action);
            expect(state.isAuthenticated).toBe(true);
        });
    });

    describe("AUTH_LOGOUT action", () => {
        it("should reset user to null when handling AUTH_LOGOUT", () => {
            const loggedInState = {
                user: { id: "1", name: "John", isOnline: true },
                isAuthenticated: true
            };
            const action = authActions.logout();
            const state = authReducer(loggedInState, action);
            expect(state.user).toBeNull();
        });

        it("should reset isAuthenticated to false when handling AUTH_LOGOUT", () => {
            const loggedInState = {
                user: { id: "1", name: "John", isOnline: true },
                isAuthenticated: true
            };
            const action = authActions.logout();
            const state = authReducer(loggedInState, action);
            expect(state.isAuthenticated).toBe(false);
        });
    });
});