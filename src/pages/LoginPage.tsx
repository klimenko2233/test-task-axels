import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../store/userSlice";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Login } from "../components ";

export const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading, user } = useSelector((state: RootState) => state.user);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (!name.trim() || !password.trim()) return;
        dispatch(loginRequest({ name, password }));
    };

    useEffect(() => {
        if (user) navigate("/home");
    }, [user, navigate]);

    return (
        <>
            <Login
                name={name}
                password={password}
                onNameChange={setName}
                onPasswordChange={setPassword}
                onSubmit={handleLogin}
            />
            {loading && (
                <Typography align="center" color="text.secondary" mt={2}>
                    Logging in...
                </Typography>
            )}
            {error && (
                <Typography align="center" color="error" mt={2}>
                    {error}
                </Typography>
            )}
        </>
    );
};