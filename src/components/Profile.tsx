import { Avatar, Paper, Typography, Button, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { authSelectors } from "../store/ducks/auth.duck";
import { chatSelectors } from "../store/ducks/chat.duck";
import { authActions } from "../store/ducks/auth.duck";

export const Profile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(authSelectors.user);
    const isConnected = useAppSelector(chatSelectors.isConnected);

    const handleLogout = () => {
        dispatch(authActions.logout());
    };

    if (!user) {
        return null;
    }

    return (
        <Paper elevation={3} sx={{
            p: { xs: 1, sm: 1.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2
        }}>
            <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{
                    bgcolor: "primary.main",
                    width: { xs: 40, sm: 50 },
                    height: { xs: 40, sm: 50 }
                }}>
                    {user.name[0].toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" component="div">
                        {user.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={isConnected ? "success.main" : "text.secondary"}
                    >
                        {isConnected ? "Online" : "Offline"}
                    </Typography>
                </Box>
            </Box>
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Paper>
    );
};