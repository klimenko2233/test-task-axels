import { useState } from "react";
import Login from "./components /Login.tsx";
import {Container} from "@mui/material";
import {Home} from "./components /Home.tsx";
import {Profile} from "./components /Profile.tsx";

export interface UserCredo {
    name: string;
    password: string;
}

function App() {
    const [user, setUser] = useState<UserCredo | null>(null);

    if (!user) return <Login onLogin={setUser} />;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, display: "flex", gap: 3, flexDirection: "column"}}>
            <Profile user={user} />
            <Home user={user} />
        </Container>
    );
}

export default App;




