import { Alert, Box, CircularProgress, Container, Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EducationSection from "../components/profile/EducationSection";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileSummarySection from "../components/profile/ProfileSummarySection";
import WorkExperienceSection from "../components/profile/WorkExperienceSection";
import { useProfile } from "../context/profile.context";

function ProfilePage() {
  const {
    profile,
    workExperience,
    education,
    skills,
    documents,
    isLoading,
    error,
  } = useProfile();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="info">No profile found.</Alert>
      </Container>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 0, sm: 4, md: 6 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 0, sm: 3 },
        }}
      >
        <Paper
          elevation={0}
          sx={(theme) => ({
            overflow: "hidden",
            borderRadius: { xs: 4 },

            border: "1px solid",
            borderColor: alpha(
              theme.palette.primary.dark,
              theme.palette.mode === "dark" ? 0.45 : 0.28,
            ),

            bgcolor: "background.paper",

            backgroundImage: `linear-gradient(
              135deg,
              transparent 0%,
              transparent 35%,
              ${alpha(
                theme.palette.primary.main,
                theme.palette.mode === "dark" ? 0.22 : 0.12,
              )} 100%
            )`,

            boxShadow: "none",

            [theme.breakpoints.up("sm")]: {
              boxShadow: `
                0 18px 50px ${alpha(
                  theme.palette.common.black,
                  theme.palette.mode === "dark" ? 0.35 : 0.1,
                )},
                0 0 30px ${alpha(
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.main
                    : theme.palette.primary.dark,
                  theme.palette.mode === "dark" ? 0.32 : 0.22,
                )},
                0 0 70px ${alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.14 : 0.1,
                )}
              `,
            },
          })}
        >
          <ProfileHeader profile={profile} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 1.8fr) minmax(340px, 0.9fr)",
              },
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                p: { xs: 3, sm: 5, md: 6 },
                pt: { md: 5 },
              }}
            >
              <ProfileSummarySection summary={profile.profile_summary} />
              <WorkExperienceSection items={workExperience} />
              <EducationSection items={education} />
            </Box>

            <ProfileSidebar skills={skills} documents={documents} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProfilePage;
