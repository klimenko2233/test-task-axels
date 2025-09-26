import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/userSlice";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home } from "../components ";

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector((state) => state.user.user);

    const [currentRoom, setCurrentRoom] = useState("General");
    const [messages, setMessages] = useState<{ author: string; text: string }[]>([
        { author: "Alice", text: "Hi!" },
        { author: user?.name ?? "Me", text: "How's it going?" },
    ]);
    const [currentMessage, setCurrentMessage] = useState("");

    if (!user) return null; // защита от анонимного доступа

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;
        setMessages([...messages, { author: user.name, text: currentMessage }]);
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
                messages={messages}
                currentMessage={currentMessage}
                onMessageChange={setCurrentMessage}
                onSendMessage={handleSendMessage}
            />
        </Box>
    );
};
