import { memo } from "react";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import DocumentsSection from "./DocumentsSection";
import SkillsSection from "./SkillsSection";
import type { CvDocumentData, SkillData } from "./profile.types";

type Props = {
  skills: SkillData[];
  documents: CvDocumentData[];
};

const ProfileSidebar = memo(function ProfileSidebar({
  skills,
  documents,
}: Props) {
  return (
    <Box
      component="aside"
      sx={(theme) => {
        const sidebarColor = alpha(
          theme.palette.primary.main,
          theme.palette.mode === "dark" ? 0.12 : 0.07,
        );

        const sidebarBorderColor = alpha(
          theme.palette.primary.dark,
          theme.palette.mode === "dark" ? 0.45 : 0.28,
        );

        return {
          minWidth: 0,
          position: "relative",
          p: { xs: 3, sm: 5, md: 5 },
          pl: { md: 7 },

          background: {
            xs: `linear-gradient(
              180deg,
              transparent 0px,
              ${sidebarColor} 80px,
              ${sidebarColor} 100%
            )`,
            md: `linear-gradient(
              90deg,
              transparent 0px,
              ${sidebarColor} 90px,
              ${sidebarColor} 100%
            )`,
          },

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(
              90deg,
              transparent 0%,
              ${alpha(theme.palette.primary.dark, 0.18)} 45%,
              ${sidebarBorderColor} 100%
            )`,
          },
        };
      }}
    >
      <SkillsSection skills={skills} />
      <DocumentsSection documents={documents} />
    </Box>
  );
});

export default ProfileSidebar;
