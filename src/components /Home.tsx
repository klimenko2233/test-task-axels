import {Box,Button,Divider,Paper,TextField,Typography} from "@mui/material";
import { RoomList } from "./RoomList";

interface HomeProps {
    userName: string;
    messages: { author: string; text: string }[];
    currentMessage: string;
    onMessageChange: (value: string) => void;
    onSendMessage: () => void;
}

export const Home = ({userName, messages, currentMessage, onMessageChange, onSendMessage}: HomeProps) => (
        <Box display="flex" height="80vh" gap={2} pb={10}>
            <Paper elevation={3} sx={{width: 260, p: 2, display: "flex", flexDirection: "column",}}>
                <RoomList />
            </Paper>
            <Paper elevation={3} sx={{flex: 1, p: 2, display: "flex", flexDirection: "column"}}>
                <Typography variant="h6" gutterBottom>Welcome, {userName}! It's a general chat room.</Typography>
                <Divider />
                <Box flex={1} my={2} sx={{overflowY: "auto", display: "flex", flexDirection: "column", gap: 1}}>
                    {messages.map((msg, idx) => (
                        <Typography key={idx} variant="body1"><b>{msg.author}:</b> {msg.text}</Typography>
                    ))}
                </Box>
                <Box display="flex" gap={1}>
                    <TextField fullWidth size="small" placeholder="Type your message..." value={currentMessage}
                        onChange={(e) => onMessageChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
                    />
                    <Button variant="contained" onClick={onSendMessage}>Send</Button>
                </Box>
            </Paper>
        </Box>
);

