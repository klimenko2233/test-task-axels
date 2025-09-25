import { useState } from "react";
import { Home } from "../components ";

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

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;
        setMessagesByRoom({ ...messagesByRoom, [currentRoom]: [...messagesByRoom[currentRoom], { author: user.name, text: currentMessage }] });
        setCurrentMessage("");
    };

    return (
        <Home
            userName={user.name}
            currentRoom={currentRoom}
            onRoomChange={setCurrentRoom}
            messages={messagesByRoom[currentRoom]}
            currentMessage={currentMessage}
            onMessageChange={setCurrentMessage}
            onSendMessage={handleSendMessage}
        />
    );
};