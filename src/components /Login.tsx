import {Avatar, Box, Button, Paper, TextField, Typography} from "@mui/material";
import { PersonIcon } from "./PersonIcon";

interface LoginProps {
    name: string;
    password: string;
    onNameChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: () => void;
}

export const Login = ({name, password, onNameChange, onPasswordChange, onSubmit}: LoginProps) => (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="background.default"
        >
            <Paper elevation={6} sx={{ padding: 4, minWidth: 320, textAlign: "center" }}>
                <Avatar sx={{ margin: "0 auto", bgcolor: "primary.main", mb: 2 }}>
                    <PersonIcon />
                </Avatar>
                <Typography variant="h5" mb={3}>
                    Enter your credentials to login
                </Typography>
                <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    margin="normal"
                    onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    margin="normal"
                    onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    sx={{ mt: 2, py: 1.5, fontSize: "16px" }}
                >
                    Login
                </Button>
            </Paper>
        </Box>
);


