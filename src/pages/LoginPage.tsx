import { useAppDispatch } from "../hooks/redux";
import { authActions } from "../store/ducks/auth.duck";
import { Login } from "../components";

export const LoginPage = () => {
    const dispatch = useAppDispatch();

    const handleLogin = (name: string, password: string) => {
        dispatch(authActions.login({ name, password }));
    };

    return <Login onSubmit={handleLogin}/>;
};