import {useState} from "react";
import {Avatar, Box, Button, Paper, TextField, Typography} from "@mui/material";
import {PersonIcon} from "./PersonIcon.tsx";
import type {UserCredo} from "../App.tsx";



export default function Login({ onLogin }: { onLogin: (user: UserCredo) => void }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if(name.trim() && password.trim()) {
            onLogin({name,password});
        }
    };
    return (
        //main container
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="background.default"
        >
            {/* Login form */}
            <Paper elevation={6} sx={{padding: 4, minWidth: 320, textAlign: "center"}}>

                {/* Avatar with user icon */}
                <Avatar sx={{margin:"0 auto",bgcolor:"primary.main", mb:2}}>
                    <PersonIcon/>
                </Avatar>

                {/* Header */}
                <Typography variant="h5" mb={3}>
                    Enter your credentials to login
                </Typography>

                {/* Input fields */}
                <TextField
                    fullWidth
                    label="Name"
                    value={name}
                onChange={(e)=>setName(e.target.value)}
                    margin="normal"
                    onKeyDown={(e)=>e.key === "Enter" && handleLogin()}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="text"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    margin="normal"
                    onKeyDown={(e)=>e.key === "Enter" && handleLogin()}
                />

                {/* Login button */}
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    sx={{ mt: 2, py: 1.5, fontSize: "16px" }}
                >
                    Login
                </Button>
            </Paper>
        </Box>
    )
}


