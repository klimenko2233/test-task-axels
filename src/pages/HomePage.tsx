import { useState } from "react";
import { Home } from "../components ";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/userSlice.ts";
import { Box, Button } from "@mui/material";

interface HomePageProps {
    user: { name: string };
}

export const HomePage = ({ user }: HomePageProps) => {
    const [currentRoom, setCurrentRoom] = useState("General");
    const [messagesByRoom, setMessagesByRoom] = useState<Record<string, { author: string; text: string }[]>>(
        {
            General: [{ author: "Alice", text: "Hi!" }, { author: user.name, text: "How's it going?" }],
            FirstRoom: [{ author: "Bob", text: "Welcome to FirstRoom" }],
            AnotherRoom: [{ author: "Eve", text: "Another room here!" }],
            Random: []
        });

    const [currentMessage, setCurrentMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;
        setMessagesByRoom({
            ...messagesByRoom,
            [currentRoom]: [...messagesByRoom[currentRoom], { author: user.name, text: currentMessage }]
        });
        setCurrentMessage("");
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="outlined" color="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
            <Home
                userName={user.name}
                currentRoom={currentRoom}
                onRoomChange={setCurrentRoom}
                messages={messagesByRoom[currentRoom]}
                currentMessage={currentMessage}
                onMessageChange={setCurrentMessage}
                onSendMessage={handleSendMessage}
            />
        </Box>
    );
};