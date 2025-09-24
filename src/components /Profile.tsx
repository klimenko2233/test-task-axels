import { Avatar, Paper, Typography } from "@mui/material";

export const Profile = ({ user }: { user: { name: string } }) => (
        <Paper elevation={3} sx={{ p: 1.5, textAlign: "center" }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50, mb: 1 }}>
                {user.name[0].toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">
                Online
            </Typography>
        </Paper>
);
