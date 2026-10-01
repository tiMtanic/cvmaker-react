import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import axios from "axios";
import { signInAsync, verifyAsync } from "../services/cvmakerApi.service";

export type AuthPayload = {
  code: string;
  is_admin_code: boolean;
};

type AuthContextValue = {
  isLoggedIn: boolean;
  code: string | null;
  isAdmin: boolean;
  setUserVariables: (authToken: string, payload: AuthPayload) => void;
  verifyUser: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthWrapperProps = {
  children: ReactNode;
};

export function AuthWrapper({ children }: AuthWrapperProps) {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifyingUser, setIsVerifyingUser] = useState(true);

  const clearUserVariables = useCallback(() => {
    setIsLoggedIn(false);
    setCode(null);
    setIsAdmin(false);
  }, []);

  const setUserVariables = useCallback(
    (authToken: string, payload: AuthPayload) => {
      localStorage.setItem("authToken", authToken);

      setIsLoggedIn(true);
      setCode(payload.code);
      setIsAdmin(payload.is_admin_code);
    },
    [],
  );

  const removeCodeFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);

    params.delete("code");

    const search = params.toString();

    navigate(
      {
        pathname: window.location.pathname,
        search: search ? `?${search}` : "",
        hash: window.location.hash,
      },
      {
        replace: true,
      },
    );
  }, [navigate]);

  const verifyUser = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      const queryCode = urlParams.get("code")?.trim();

      /*
       * Automatic login:
       * /?code=12345
       */
      if (queryCode) {
        if (queryCode.length !== 5) {
          removeCodeFromUrl();
          clearUserVariables();
          localStorage.removeItem("authToken");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        try {
          const result = await signInAsync(queryCode);

          setUserVariables(result.authToken, result.payload);

          removeCodeFromUrl();

          return;
        } catch (error) {
          removeCodeFromUrl();

          if (
            axios.isAxiosError(error) &&
            error.response?.data?.errorCode === "SETUP_REQUIRED"
          ) {
            clearUserVariables();

            localStorage.removeItem("authToken");

            navigate("/setup", {
              replace: true,
            });

            return;
          }

          clearUserVariables();

          localStorage.removeItem("authToken");

          navigate("/login", {
            replace: true,
          });

          return;
        }
      }

      const result = await verifyAsync();

      setIsLoggedIn(true);
      setCode(result.payload.code);
      setIsAdmin(result.payload.is_admin_code);
    } catch (error) {
      clearUserVariables();
      localStorage.removeItem("authToken");

      if (
        axios.isAxiosError(error) &&
        error.response?.data?.errorCode === "SETUP_REQUIRED"
      ) {
        navigate("/setup", {
          replace: true,
        });
        return;
      }

      navigate("/login", {
        replace: true,
      });
    } finally {
      setIsVerifyingUser(false);
    }
  }, [clearUserVariables, navigate, removeCodeFromUrl, setUserVariables]);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");

    clearUserVariables();

    navigate("/login", {
      replace: true,
    });
  }, [clearUserVariables, navigate]);

  useEffect(() => {
    void verifyUser();
  }, [verifyUser]);

  const passedContext = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      code,
      isAdmin,
      setUserVariables,
      verifyUser,
      logout,
    }),
    [isLoggedIn, code, isAdmin, setUserVariables, verifyUser, logout],
  );

  if (isVerifyingUser) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />

        <Typography variant="body2" color="text.secondary">
          Verifying access
        </Typography>
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {children}
    </AuthContext.Provider>
  );
}
