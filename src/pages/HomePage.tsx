import { useState } from "react";
import { Home } from "../components ";

interface HomePageProps {
    user: { name: string };
}

export const HomePage = ({ user }: HomePageProps) => {
    const [messages, setMessages] = useState([
        { author: "Alice", text: "Hi!" },
        { author: user.name, text: "How's it going?" },
    ]);

    const [currentMessage, setCurrentMessage] = useState("");

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;
        setMessages([...messages, { author: user.name, text: currentMessage }]);
        setCurrentMessage("");
    };

    return (
        <Home
            userName={user.name}
            messages={messages}
            currentMessage={currentMessage}
            onMessageChange={setCurrentMessage}
            onSendMessage={handleSendMessage}
        />
    );
};

