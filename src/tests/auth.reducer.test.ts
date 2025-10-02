import { authActions, authReducer } from "../store/ducks/auth.duck.ts";

describe("Auth Reducer - Unit Tests", () => {
    const initialState = {
        user: null,
        isAuthenticated: false,
    };

    it("should return initial state for unknown action", () => {
        const action = { type: "UNKNOWN_ACTION" } as any;
        const state = authReducer(initialState, action);
        expect(state).toEqual(initialState);
    });

    it("should handle AUTH_LOGIN_SUCCESS - set user and isAuthenticated", () => {
        const user = { id: "1", name: "John", isOnline: true };
        const action = authActions.loginSuccess(user);
        const state = authReducer(initialState, action);
        expect(state.user).toEqual(user);
        expect(state.isAuthenticated).toBe(true);
    });

    it("should handle AUTH_LOGOUT - reset user and isAuthenticated to initial state", () => {
        const loggedInState = {
            user: { id: "1", name: "John", isOnline: true },
            isAuthenticated: true,
        };
        const action = authActions.logout();
        const state = authReducer(loggedInState, action);
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it("should handle AUTH_LOGIN_SUCCESS - overwrite existing user", () => {
        const existingState = {
            user: { id: "111", name: "Old User", isOnline: true },
            isAuthenticated: true,
        };
        const newUser = { id: "222", name: "New User", isOnline: true };
        const action = authActions.loginSuccess(newUser);
        const state = authReducer(existingState, action);
        expect(state.user).toEqual(newUser);
        expect(state.isAuthenticated).toBe(true);
    });
});