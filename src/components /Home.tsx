import {
    Box,
    Button,
    Divider,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { RoomList } from "./RoomList.tsx";

export const Home = ({ user }: { user: { name: string } }) => {
    return (
        <Box display="flex" height="80vh" gap={2} pb={10}>
            {/* Sidebar with rooms list*/}
            <Paper
                elevation={3}
                sx={{
                    width: 260,
                    p: 2,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <RoomList />
            </Paper>

            {/* General chat room */}
            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* Title */}
                <Typography variant="h6" gutterBottom>
                    Welcome, {user.name}! It's a general chat room.
                </Typography>
                <Divider />

                {/* Messages */}
                <Box
                    flex={1}
                    my={2}
                    sx={{
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    <Typography variant="body1">
                        <b>Alice:</b> Hi!
                    </Typography>
                    <Typography variant="body1">
                        <b>{user.name}:</b> How its going?
                    </Typography>
                </Box>

                {/* input field */}
                <Box display="flex" gap={1}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type your message..."
                    />
                    <Button variant="contained">Надіслати</Button>
                </Box>
            </Paper>
        </Box>
    );
};
