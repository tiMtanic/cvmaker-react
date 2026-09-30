import { memo } from "react";
import { Box, Typography } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ProfileSectionTitle from "./ProfileSectionTitle";

type Props = {
  summary: string | null | undefined;
};

const ProfileSummarySection = memo(function ProfileSummarySection({
  summary,
}: Props) {
  if (!summary) return null;

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <ProfileSectionTitle icon={<BusinessCenterIcon />}>
        Profile
      </ProfileSectionTitle>

      <Typography
        color="text.secondary"
        sx={{
          lineHeight: 1.85,
          whiteSpace: "pre-line",
          maxWidth: "75ch",
          fontSize: { xs: "0.95rem", sm: "1rem" },
        }}
      >
        {summary}
      </Typography>
    </Box>
  );
});

export default ProfileSummarySection;
