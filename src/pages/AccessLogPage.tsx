import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { Navigate } from "react-router";
import axios from "axios";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import { AuthContext } from "../context/auth.context";

import {
  createAccessCodeAsync,
  deleteAccessCodeAsync,
  getAccessCodesAsync,
  getAccessLogsAsync,
  type AccessCode,
  type AccessLog,
} from "../services/cvmakerApi.service";

type ApiError = {
  errorCode?: string;
  errorMessage?: string;
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "medium",
});

function formatAccessTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

function AccessLogPage() {
  const authContext = useContext(AuthContext);

  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  const [newCode, setNewCode] = useState("");
  const [company, setCompany] = useState("");
  const [selectedCode, setSelectedCode] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  if (!authContext) {
    throw new Error("AccessLogPage must be used inside AuthWrapper");
  }

  const { isAdmin } = authContext;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [codes, logs] = await Promise.all([
        getAccessCodesAsync(),
        getAccessLogsAsync(),
      ]);

      setAccessCodes(codes);
      setAccessLogs(logs);
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrorMessage(
          error.response?.data?.errorMessage ??
            "Could not load access information.",
        );
      } else {
        setErrorMessage("Could not load access information.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      void loadData();
    }
  }, [isAdmin, loadData]);

  const filterCodes = useMemo(() => {
    const codes = new Set<string>();

    accessCodes.forEach((item) => {
      codes.add(item.code);
    });

    accessLogs.forEach((item) => {
      codes.add(item.access_code_code);
    });

    return Array.from(codes).sort((a, b) => a.localeCompare(b));
  }, [accessCodes, accessLogs]);

  const filteredLogs = useMemo(() => {
    if (!selectedCode) {
      return accessLogs;
    }

    return accessLogs.filter(
      (log) => log.access_code_code === selectedCode,
    );
  }, [accessLogs, selectedCode]);

  function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
    setNewCode(event.target.value);

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleCreateAccessCode(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedCode = newCode.trim();

    if (trimmedCode.length !== 5) {
      setErrorMessage(
        "Access code must contain exactly 5 characters.",
      );
      return;
    }

    setIsCreating(true);
    setErrorMessage("");

    try {
      const createdCode = await createAccessCodeAsync(
        trimmedCode,
        company,
      );

      setAccessCodes((current) =>
        [...current, createdCode].sort((a, b) =>
          a.code.localeCompare(b.code),
        ),
      );

      setNewCode("");
      setCompany("");
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrorMessage(
          error.response?.data?.errorMessage ??
            "Could not create access code.",
        );
      } else {
        setErrorMessage("Could not create access code.");
      }
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteAccessCode(code: string) {
    setDeletingCode(code);
    setErrorMessage("");

    try {
      await deleteAccessCodeAsync(code);

      setAccessCodes((current) =>
        current.filter((item) => item.code !== code),
      );
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrorMessage(
          error.response?.data?.errorMessage ??
            "Could not remove access code.",
        );
      } else {
        setErrorMessage("Could not remove access code.");
      }
    } finally {
      setDeletingCode(null);
    }
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem" },
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              Access Log
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Manage access codes and review previous access.
            </Typography>
          </Box>

          <Tooltip title="Refresh">
            <IconButton
              onClick={() => void loadData()}
              disabled={isLoading}
              aria-label="Refresh access data"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage("")}
            sx={{ mb: 3 }}
          >
            {errorMessage}
          </Alert>
        )}

        {isLoading ? (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* ACCESS CODES */}
            <Paper
              elevation={0}
              sx={(theme) => ({
                overflow: "hidden",
                border: "1px solid",
                borderColor: alpha(
                  theme.palette.primary.dark,
                  theme.palette.mode === "dark" ? 0.4 : 0.22,
                ),
                borderRadius: 3,
                bgcolor: "background.paper",
              })}
            >
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  component="h2"
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                  }}
                >
                  Access Codes
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Create or remove codes that can be used to access the CV.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleCreateAccessCode}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "160px minmax(0, 1fr) auto",
                    },
                    gap: 1.5,
                    mt: 3,
                    alignItems: "start",
                  }}
                >
                  <TextField
                    label="Access code"
                    value={newCode}
                    onChange={handleCodeChange}
                    disabled={isCreating}
                    required
                    slotProps={{
                      htmlInput: {
                        maxLength: 5,
                      },
                    }}
                  />

                  <TextField
                    label="Company"
                    value={company}
                    onChange={(event) =>
                      setCompany(event.target.value)
                    }
                    disabled={isCreating}
                    slotProps={{
                      htmlInput: {
                        maxLength: 256,
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      isCreating ? (
                        <CircularProgress
                          size={16}
                          color="inherit"
                        />
                      ) : (
                        <AddIcon />
                      )
                    }
                    disabled={
                      isCreating ||
                      newCode.trim().length !== 5
                    }
                    sx={{
                      minHeight: 56,
                      px: 3,
                      boxShadow: "none",
                      "&:hover": {
                        boxShadow: "none",
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {accessCodes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography
                            color="text.secondary"
                            sx={{ py: 2 }}
                          >
                            No access codes found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      accessCodes.map((accessCode) => (
                        <TableRow
                          key={accessCode.code}
                          hover
                        >
                          <TableCell>
                            <Typography
                              component="span"
                              sx={{
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                              }}
                            >
                              {accessCode.code}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {accessCode.company || "—"}
                          </TableCell>

                          <TableCell>
                            {accessCode.is_admin_code
                              ? "Administrator"
                              : "Access"}
                          </TableCell>

                          <TableCell align="right">
                            {accessCode.is_admin_code ? (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Protected
                              </Typography>
                            ) : (
                              <Tooltip title="Remove access code">
                                <span>
                                  <IconButton
                                    color="error"
                                    disabled={
                                      deletingCode ===
                                      accessCode.code
                                    }
                                    onClick={() =>
                                      void handleDeleteAccessCode(
                                        accessCode.code,
                                      )
                                    }
                                    aria-label={`Remove access code ${accessCode.code}`}
                                  >
                                    {deletingCode ===
                                    accessCode.code ? (
                                      <CircularProgress
                                        size={20}
                                        color="inherit"
                                      />
                                    ) : (
                                      <DeleteOutlineIcon />
                                    )}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* ACCESS LOGS */}
            <Paper
              elevation={0}
              sx={(theme) => ({
                overflow: "hidden",
                mt: 4,
                border: "1px solid",
                borderColor: alpha(
                  theme.palette.primary.dark,
                  theme.palette.mode === "dark" ? 0.4 : 0.22,
                ),
                borderRadius: 3,
                bgcolor: "background.paper",
              })}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "stretch",
                    sm: "center",
                  },
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 2,
                  p: { xs: 2.5, sm: 3 },
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                    }}
                  >
                    Access History
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {filteredLogs.length}{" "}
                    {filteredLogs.length === 1
                      ? "entry"
                      : "entries"}
                  </Typography>
                </Box>

                <FormControl
                  size="small"
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 180,
                    },
                  }}
                >
                  <InputLabel id="access-code-filter-label">
                    Access code
                  </InputLabel>

                  <Select
                    labelId="access-code-filter-label"
                    value={selectedCode}
                    label="Access code"
                    onChange={(event) =>
                      setSelectedCode(event.target.value)
                    }
                  >
                    <MenuItem value="">
                      All access codes
                    </MenuItem>

                    {filterCodes.map((code) => (
                      <MenuItem
                        key={code}
                        value={code}
                      >
                        {code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Access code</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>City</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography
                            color="text.secondary"
                            sx={{ py: 2 }}
                          >
                            No access log entries found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow
                          key={`${log.access_code_code}-${log.access_time}`}
                          hover
                        >
                          <TableCell>
                            <Typography
                              component="span"
                              sx={{
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                              }}
                            >
                              {log.access_code_code}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {formatAccessTime(
                              log.access_time,
                            )}
                          </TableCell>

                          <TableCell>
                            {log.country || "—"}
                          </TableCell>

                          <TableCell>
                            {log.city || "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
}

export default AccessLogPage;
