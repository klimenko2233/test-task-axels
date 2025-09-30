import { useFormik } from "formik";
import { Avatar, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { PersonIcon } from "./PersonIcon";
import { loginValidationSchema } from "../schemas/authValidation";

interface LoginProps {
    onSubmit: () => void;
}

export const Login = ({ onSubmit }: LoginProps) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            password: "",
        },
        validationSchema: loginValidationSchema,
        onSubmit: () => {
            onSubmit();
        },
    });

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="background.default">
            <Paper elevation={6} sx={{ padding: 4, minWidth: 320, textAlign: "center" }}>
                <Avatar sx={{ margin: "0 auto", bgcolor: "primary.main", mb: 2 }}>
                    <PersonIcon/>
                </Avatar>
                <Typography variant="h5" mb={3}>
                    Enter your credentials to login
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        margin="normal"
                        autoComplete="username"
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        margin="normal"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2, py: 1.5, fontSize: "16px" }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};