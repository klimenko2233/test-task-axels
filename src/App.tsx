import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage, HomePage } from "./pages";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store.ts";

export interface UserCredo {
    name: string;
    password: string;
}

function App() {
    const user = useSelector((state: RootState) => state.user.user);
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route
                    path="/home"
                    element={user ? <HomePage user={user}/> : <Navigate to="/login" replace/>}
                />
                <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace/>}/>
            </Routes>
        </Router>
    );
}

export default App;