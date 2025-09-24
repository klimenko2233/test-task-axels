import { useState } from "react";
import { Container } from "@mui/material";
import { LoginPage, HomePage } from "./pages";
import {Profile} from "./components ";

export interface UserCredo {
    name: string;
    password: string;
}

function App() {
    const [user, setUser] = useState<UserCredo | null>(null);
    if (!user) return <LoginPage onLogin={setUser} />;
    return (
        <Container maxWidth="lg" sx={{mt: {xs: 2, sm: 3, md: 4},display: "flex",gap: {xs: 2, sm: 3},flexDirection:"column"}}>
            <Profile user={user} />
            <HomePage user={user} />
        </Container>
    )}
export default App;






