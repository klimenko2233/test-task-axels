import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {main: "#1976d2", dark:"#115293"},
        secondary: {main:"#f50057"},
        background: {default: "#f5f5f5", paper: "#ffffff"},
        text: {primary: "#000000", secondary: "#555555"}
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h5: {fontWeight:500},
        body1: {fontSize: "1rem"}
    }
});

export default theme;
