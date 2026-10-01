import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={(theme) => ({
            position: "relative",
            overflow: "hidden",
            p: {
              xs: 4,
              sm: 6,
            },
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid",
            borderColor: alpha(
              theme.palette.primary.dark,
              theme.palette.mode === "dark" ? 0.45 : 0.28,
            ),
            bgcolor: "background.paper",
            backgroundImage: `linear-gradient(
              135deg,
              transparent 0%,
              transparent 45%,
              ${alpha(
                theme.palette.primary.main,
                theme.palette.mode === "dark" ? 0.18 : 0.1,
              )} 100%
            )`,
          })}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "4rem",
                sm: "5rem",
              },
              fontWeight: 900,
              lineHeight: 1,
              color: "primary.main",
              letterSpacing: "-0.06em",
            }}
          >
            404
          </Typography>

          <Typography
            component="h1"
            sx={{
              mt: 2,
              fontSize: {
                xs: "1.5rem",
                sm: "1.8rem",
              },
              fontWeight: 800,
            }}
          >
            Page not found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1.5,
              lineHeight: 1.7,
            }}
          >
            The page you are looking for does not exist or may have been moved.
          </Typography>

          <Button
            variant="contained"
            startIcon={<HomeOutlinedIcon />}
            onClick={() => navigate("/")}
            sx={{
              mt: 4,
              px: 3,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Back to profile
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default NotFoundPage;
