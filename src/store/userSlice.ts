import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserCredo } from "../App.tsx";

interface UserState {
    user: UserCredo | null;
    error: string | null;
    loading: boolean;
}

const initialState: UserState = {
    user: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loginRequest: (state, _action: PayloadAction<UserCredo>) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<UserCredo>) => {
            state.user = action.payload;
            state.loading = false;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.error = null;
            state.loading = false;
        },
    },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;