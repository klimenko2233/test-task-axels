import { put, takeLatest } from "redux-saga/effects";

export interface User {
    id: string;
    name: string;
    isOnline: boolean;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const AUTH_LOGIN = "auth/LOGIN";
const AUTH_LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
const AUTH_LOGOUT = "auth/LOGOUT";

export const authActions = {
    login: (credentials: { name: string; password: string }) => ({
        type: AUTH_LOGIN as typeof AUTH_LOGIN,
        payload: credentials
    }),

    loginSuccess: (user: User) => ({
        type: AUTH_LOGIN_SUCCESS as typeof AUTH_LOGIN_SUCCESS,
        payload: user
    }),

    logout: () => ({
        type: AUTH_LOGOUT as typeof AUTH_LOGOUT
    })
};

type AuthAction =
    | ReturnType<typeof authActions.login>
    | ReturnType<typeof authActions.loginSuccess>
    | ReturnType<typeof authActions.logout>;

const initialState: AuthState = {
    user: null,
    isAuthenticated: false
};

export function authReducer(state = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AUTH_LOGIN_SUCCESS:
            return {
                user: action.payload,
                isAuthenticated: true
            };

        case AUTH_LOGOUT:
            return initialState;

        default:
            return state;
    }
}

function* loginSaga(action: ReturnType<typeof authActions.login>): Generator<unknown, void, unknown> {
    try {
        const user: User = {
            id: Date.now().toString(),
            name: action.payload.name,
            isOnline: true
        };

        yield put(authActions.loginSuccess(user));

        yield put({ type: "chat/WEBSOCKET_CONNECT" });

    } catch (error) {
        console.error("Login error:", error);
    }
}

export function* authSaga(): Generator<unknown, void, unknown> {
    yield takeLatest(AUTH_LOGIN, loginSaga);
}

export const authSelectors = {
    user: (state: { auth: AuthState }) => state.auth.user,
    isAuthenticated: (state: { auth: AuthState }) => state.auth.isAuthenticated
};