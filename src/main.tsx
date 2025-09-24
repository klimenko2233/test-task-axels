import { createRoot } from 'react-dom/client'
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./themes/theme.ts";
import App from "./App.tsx";

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App/>
    </ThemeProvider>
)
