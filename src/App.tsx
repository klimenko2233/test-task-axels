import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { useEffect } from "react";
import { chatActions } from "./store/ducks/chat.duck";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import { Container } from "@mui/material";
import { Profile } from "./components";
import { authSelectors } from "./store/ducks/auth.duck";

function App() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(authSelectors.isAuthenticated);
    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(chatActions.connectWebSocket());
        }
    }, [isAuthenticated,dispatch]);

    return (
        <Router>
            <Routes>
                <Route path="/login"
                       element={ !isAuthenticated? (<LoginPage/>) : (<Navigate to="/" replace/>)}/>
                <Route path="/"
                    element={ isAuthenticated ? (
                            <Container
                                maxWidth="lg"
                                sx={{
                                    mt: { xs: 2, sm: 3, md: 4 },
                                    display: "flex",
                                    gap: { xs: 2, sm: 3 },
                                    flexDirection: "column"
                                }}
                            >
                                <Profile />
                                <HomePage />
                            </Container>
                        ) : (<Navigate to="/login" replace />)
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;