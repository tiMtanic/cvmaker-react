import { memo } from "react";
import { Avatar, Box, Button, Link, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import type { ProfileData } from "./profile.types";

type Props = {
  profile: ProfileData;
};

const socialButtonSx = {
  color: "text.primary",
  bgcolor: "action.hover",
  px: 1.5,
  "&:hover": {
    bgcolor: "action.selected",
  },
} as const;

const ProfileHeader = memo(function ProfileHeader({ profile }: Props) {
  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        p: { xs: 3, sm: 5, md: 6 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: { xs: 24, sm: 40, md: 48 },
          width: 64,
          height: 4,
          bgcolor: "primary.main",
          borderRadius: "0 0 4px 4px",
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: profile.photo_base64 ? "auto minmax(0, 1fr)" : "1fr",
          },
          gap: { xs: 3, sm: 4, md: 5 },
          alignItems: "center",
        }}
      >
        {profile.photo_base64 && (
          <Avatar
            src={`data:${profile.photo_mime_type ?? "image/jpeg"};base64,${profile.photo_base64}`}
            alt={profile.full_name}
            sx={{
              width: { xs: 120, sm: 150, md: 168 },
              height: { xs: 120, sm: 150, md: 168 },
              justifySelf: { xs: "center", sm: "start" },
              boxShadow: 3,
            }}
          />
        )}

        <Box
          sx={{
            minWidth: 0,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.1rem", sm: "2.75rem", md: "3.4rem" },
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
              overflowWrap: "anywhere",
            }}
          >
            {profile.full_name}
          </Typography>

          {profile.professional_title && (
            <Typography
              sx={{
                mt: 1.25,
                fontSize: { xs: "1.1rem", sm: "1.3rem" },
                fontWeight: 500,
                color: "primary.main",
                letterSpacing: "0.01em",
              }}
            >
              {profile.professional_title}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: { xs: 1.5, sm: 2.5 },
              mt: 3,
              color: "text.secondary",
            }}
          >
            {profile.email && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  minWidth: 0,
                }}
              >
                <EmailOutlinedIcon
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />

                <Link
                  href={`mailto:${profile.email}`}
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.9rem", overflowWrap: "anywhere" }}
                >
                  {profile.email}
                </Link>
              </Box>
            )}

            {profile.phone && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <PhoneOutlinedIcon
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />

                <Link
                  href={`tel:${profile.phone}`}
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.9rem" }}
                >
                  {profile.phone}
                </Link>
              </Box>
            )}

            {profile.country && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <LocationOnOutlinedIcon
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                  {profile.country}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: 1,
              mt: 3,
            }}
          >
            {profile.linkedin_url && (
              <Button
                component="a"
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                size="small"
                startIcon={<LinkedInIcon />}
                sx={socialButtonSx}
              >
                LinkedIn
              </Button>
            )}

            {profile.xing_url && (
              <Button
                component="a"
                href={profile.xing_url}
                target="_blank"
                rel="noreferrer"
                size="small"
                startIcon={<LanguageIcon />}
                sx={socialButtonSx}
              >
                Xing
              </Button>
            )}

            {profile.github_url && (
              <Button
                component="a"
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                size="small"
                startIcon={<GitHubIcon />}
                sx={socialButtonSx}
              >
                GitHub
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default ProfileHeader;
