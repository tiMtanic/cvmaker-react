import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

type Props = {
  icon: ReactNode;
  children: ReactNode;
};

function ProfileSectionTitle({ icon, children }: Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
        }}
      >
        {icon}
      </Box>

      <Typography
        component="h2"
        sx={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "0.01em" }}
      >
        {children}
      </Typography>

      <Box sx={{ height: 1, flex: 1, bgcolor: "divider", ml: 0.5 }} />
    </Box>
  );
}

export default ProfileSectionTitle;
