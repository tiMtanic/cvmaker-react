import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ProfileProvider } from "./context/profile.context.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider theme={theme} defaultMode="system" disableTransitionOnChange>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <BrowserRouter>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </BrowserRouter>
    </LocalizationProvider>
  </ThemeProvider>,
  // </StrictMode>,
);
