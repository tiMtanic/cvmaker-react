import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router";
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

type RedirectPath = "/login" | "/setup" | "/" | null;

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthWrapperProps = {
  children: ReactNode;
};

export function AuthWrapper({ children }: AuthWrapperProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifyingUser, setIsVerifyingUser] = useState(true);
  const [redirectTo, setRedirectTo] = useState<RedirectPath>(null);

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

      setRedirectTo(null);
    },
    [],
  );

  const removeCodeFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);

    params.delete("code");

    const search = params.toString();

    const newUrl = `${window.location.pathname}${
      search ? `?${search}` : ""
    }${window.location.hash}`;

    window.history.replaceState(window.history.state, "", newUrl);
  }, []);

  const verifyUser = useCallback(async () => {
    setIsVerifyingUser(true);

    try {
      const params = new URLSearchParams(window.location.search);

      const queryCode = params.get("code")?.trim();

      /*
       * Automatic login:
       * /?code=12345
       */
      if (queryCode) {
        removeCodeFromUrl();

        if (queryCode.length !== 5) {
          localStorage.removeItem("authToken");

          clearUserVariables();

          setRedirectTo("/login");

          return;
        }

        try {
          const result = await signInAsync(queryCode);

          setUserVariables(result.authToken, result.payload);

          setRedirectTo("/");

          return;
        } catch (error) {
          localStorage.removeItem("authToken");

          clearUserVariables();

          if (
            axios.isAxiosError(error) &&
            error.response?.data?.errorCode === "SETUP_REQUIRED"
          ) {
            setRedirectTo("/setup");

            return;
          }

          setRedirectTo("/login");

          return;
        }
      }

      const result = await verifyAsync();

      setIsLoggedIn(true);
      setCode(result.payload.code);
      setIsAdmin(result.payload.is_admin_code);

      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/setup"
      ) {
        setRedirectTo("/");
      }
    } catch (error) {
      localStorage.removeItem("authToken");

      clearUserVariables();

      if (
        axios.isAxiosError(error) &&
        error.response?.data?.errorCode === "SETUP_REQUIRED"
      ) {
        setRedirectTo("/setup");
        return;
      }

      /*
       * A normal 401 ends up here.
       */
      setRedirectTo("/login");
    } finally {
      setIsVerifyingUser(false);
    }
  }, [clearUserVariables, removeCodeFromUrl, setUserVariables]);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");

    clearUserVariables();

    navigate("/login", {
      replace: true,
    });
  }, [clearUserVariables, navigate]);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    void verifyUser();
  }, [verifyUser]);

  useEffect(() => {
    if (redirectTo && location.pathname === redirectTo) {
      setRedirectTo(null);
    }
  }, [location.pathname, redirectTo]);

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

  if (redirectTo && location.pathname !== redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {children}
    </AuthContext.Provider>
  );
}
