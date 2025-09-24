import { useState } from "react";
import { Container } from "@mui/material";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import {Profile} from "./components ";

export interface UserCredo {
    name: string;
    password: string;
}

function App() {
    const [user, setUser] = useState<UserCredo | null>(null);

    if (!user) {
        return <LoginPage onLogin={setUser} />;
    }

    return (
        <Container
            maxWidth="lg"
            sx={{ mt: 4, display: "flex", gap: 3, flexDirection: "column" }}
        >
            <Profile user={user} />
            <HomePage user={user} />
        </Container>
    );
}

export default App;






