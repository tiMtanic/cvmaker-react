import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#9775fa",
          light: "#b197fc",
          dark: "#7048e8",
          contrastText: "#ffffff",
        },
        background: {
          default: "#f8f7fc",
          paper: "#ffffff",
        },
        text: {
          primary: "#271a2b",
          secondary: "#716176",
        },
        divider: "rgba(151, 117, 250, 0.18)",
      },
    },

    dark: {
      palette: {
        primary: {
          main: "#9775fa",
          light: "#b197fc",
          dark: "#7048e8",
          contrastText: "#ffffff",
        },
        background: {
          default: "#000000",
          paper: "#1b161d",
        },
        text: {
          primary: "#f5eff7",
          secondary: "#c3b6c7",
        },
        divider: "rgba(151, 117, 250, 0.28)",
      },
    },
  },

  cssVariables: {
    colorSchemeSelector: "class",
  },

  shape: {
    borderRadius: 10,
  },
});

export default theme;
