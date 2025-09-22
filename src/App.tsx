import { useState } from "react";
import Login from "./components /Login.tsx";

export interface UserCredo {
    name: string;
    password: string;
}

function App() {
    const [user, setUser] = useState<UserCredo | null>(null);

    if (!user) return <Login onLogin={setUser} />;

    return (
        <div style={{ padding: "2rem", fontFamily: "Roboto, Arial, sans-serif" }}>
            <h1>Hello, {user.name}!</h1>
            <p>Your password: {user.password}</p>
        </div>
    );
}

export default App;




