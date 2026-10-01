import { useContext } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { NavLink } from "react-router";
import { AuthContext } from "../context/auth.context";

function Navigation() {
  const { mode, systemMode, setMode } = useColorScheme();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Navigation must be used inside AuthWrapper");
  }

  const { isAdmin } = authContext;

  const currentMode = mode === "system" ? systemMode : mode;

  const isDarkMode = currentMode === "dark";

  function handleThemeToggle() {
    setMode(isDarkMode ? "light" : "dark");
  }

  const navButtonSx = {
    "&.active": {
      fontWeight: "bold",
      color: "primary.main",
    },
  } as const;

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      {isAdmin && (
        <>
          <Button component={NavLink} to="/" color="inherit" sx={navButtonSx}>
            Profile
          </Button>

          <Button
            component={NavLink}
            to="/edit"
            color="inherit"
            sx={navButtonSx}
          >
            Edit Profile
          </Button>

          <Button
            component={NavLink}
            to="/access-log"
            color="inherit"
            sx={navButtonSx}
          >
            Access Log
          </Button>
        </>
      )}

      <Tooltip title={isDarkMode ? "Light mode" : "Dark mode"}>
        <IconButton
          onClick={handleThemeToggle}
          color="inherit"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default Navigation;
