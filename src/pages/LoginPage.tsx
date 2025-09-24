import { useState } from "react";
import { Login } from "../components";
import type { UserCredo } from "../App";

interface LoginPageProps {
    onLogin: (user: UserCredo) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (name.trim() && password.trim()) {
            onLogin({ name, password });
        }
    };

    return (
        <Login
            name={name}
            password={password}
            onNameChange={setName}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
        />
    );
};

