import { useAppDispatch } from "../hooks/redux";
import { authActions } from "../store/ducks/auth.duck";
import { Login } from "../components";

export const LoginPage = () => {
    const dispatch = useAppDispatch();

    const handleLogin = () => {
        dispatch(authActions.login({ name: "user", password: "pass" })); // или любая другая логика
    };

    return <Login onSubmit={handleLogin} />;
};