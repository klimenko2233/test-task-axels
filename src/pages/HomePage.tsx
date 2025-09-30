import { useState } from "react";
import { Home } from "../components";
import { useAppDispatch, useAppSelector } from "../hooks/redux.ts";
import { roomsActions, roomsSelectors } from "../store/ducks/rooms.duck.ts";
import { authSelectors, chatActions, chatSelectors } from "../store/selectors/index.ts";

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(authSelectors.user);
    const currentRoom = useAppSelector(roomsSelectors.currentRoom);
    const messagesByRoom = useAppSelector(chatSelectors.messagesByRoom);
    const isConnected = useAppSelector(chatSelectors.isConnected);

    const [currentMessage,setCurrentMessage] = useState<string>("");

    const handleRoomChange = (roomName: string) => {
        dispatch(roomsActions.selectRoom(roomName));
    };

    const handleSendMessage = () => {
        if(!currentMessage.trim() || !user) return;
        dispatch(chatActions.sendMessage({
            author: user.name,
            text: currentMessage,
            room: currentRoom
        }));
        setCurrentMessage("");
    };

    const currentRoomMessages = messagesByRoom[currentRoom] || [];

    return (
        <Home
            userName={user?.name||"Guest"}
            currentRoom={currentRoom}
            onRoomChange={handleRoomChange}
            messages={currentRoomMessages}
            currentMessage={currentMessage}
            onMessageChange={setCurrentMessage}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
        />
    );
};