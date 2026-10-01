import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { MuiOtpInput } from "mui-one-time-password-input";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { alpha } from "@mui/material/styles";
import { AuthContext } from "../context/auth.context";
import { signInAsync } from "../services/cvmakerApi.service";

type ApiError = {
  errorCode?: string;
  errorMessage?: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!authContext) {
    throw new Error("LoginPage must be used inside AuthWrapper");
  }

  const { setUserVariables } = authContext;

  const handleCodeChange = (value: string) => {
    setCode(value);

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCode = code.trim();

    if (trimmedCode.length !== 5) {
      setErrorMessage("Please enter a 5-character access code.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = await signInAsync(trimmedCode);

      setUserVariables(result.authToken, result.payload);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrorMessage(
          error.response?.data?.errorMessage ??
            "Could not sign in with this access code.",
        );
      } else {
        setErrorMessage("Could not sign in with this access code.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
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
              xs: 3,
              sm: 5,
            },

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

            boxShadow: `
              0 18px 50px ${alpha(
                theme.palette.common.black,
                theme.palette.mode === "dark" ? 0.35 : 0.08,
              )},
              0 0 36px ${alpha(
                theme.palette.primary.dark,
                theme.palette.mode === "dark" ? 0.25 : 0.14,
              )}
            `,
          })}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 32,
              width: 64,
              height: 4,
              bgcolor: "primary.main",
              borderRadius: "0 0 4px 4px",
            }}
          />

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "action.hover",
              color: "primary.main",
              mb: 3,
            }}
          >
            <LockOutlinedIcon
              sx={{
                fontSize: 30,
              }}
            />
          </Box>

          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "1.75rem",
                sm: "2rem",
              },
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.15,
            }}
          >
            Sign in
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1.25,
              lineHeight: 1.7,
            }}
          >
            Enter your 5-character access code to continue.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 4,
            }}
          >
            <Typography
              component="label"
              sx={{
                display: "block",
                mb: 1.5,
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
            >
              Access code
            </Typography>

            <MuiOtpInput
              value={code}
              onChange={handleCodeChange}
              length={5}
              autoFocus
              TextFieldsProps={(index) => ({
                type: "password",
                disabled: isSubmitting,
                slotProps: {
                  htmlInput: {
                    "aria-label": `Access code character ${index + 1}`,
                  },
                },
                sx: {
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                  },

                  "& .MuiInputBase-input": {
                    textAlign: "center",
                    fontSize: {
                      xs: "1.15rem",
                      sm: "1.35rem",
                    },
                    fontWeight: 700,
                    py: {
                      xs: 1.25,
                      sm: 1.5,
                    },
                  },

                  "& input::-ms-reveal, & input::-ms-clear": {
                    display: "none",
                  },
                },
              })}
            />

            {errorMessage && (
              <Alert
                severity="error"
                sx={{
                  mt: 3,
                }}
              >
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting || code.trim().length !== 5}
              sx={{
                mt: 4,
                py: 1.35,
                fontWeight: 700,
                boxShadow: "none",

                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                  }}
                >
                  <CircularProgress size={18} color="inherit" />
                  Signing in
                </Box>
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
