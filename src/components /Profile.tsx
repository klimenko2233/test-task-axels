import { Avatar, Paper, Typography } from "@mui/material";

export const Profile = ({ user }: { user: { name: string } }) => (
    <Paper elevation={3} sx={{
        p: { xs: 1, sm: 1.5 },
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }}>
        <Avatar sx={{ bgcolor: "primary.main", width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 }, mb: 1 }}>
            {user.name[0].toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1">{user.name}</Typography>
        <Typography variant="caption" color="text.secondary">Online</Typography>
    </Paper>
);