import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { NavLink } from "react-router";

function Navigation() {
  const { mode, systemMode, setMode } = useColorScheme();

  const currentMode = mode === "system" ? systemMode : mode;

  const isDarkMode = currentMode === "dark";

  function handleThemeToggle() {
    setMode(isDarkMode ? "light" : "dark");
  }

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
      <Button
        component={NavLink}
        to="/"
        color="inherit"
        sx={{
          "&.active": {
            fontWeight: "bold",
          },
        }}
      >
        Profile
      </Button>

      <Button
        component={NavLink}
        to="/edit"
        color="inherit"
        sx={{
          "&.active": {
            fontWeight: "bold",
          },
        }}
      >
        Edit Profile
      </Button>

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
