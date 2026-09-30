import { memo } from "react";
import { Box, Button, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getDocumentFileAsync } from "../../services/cvmakerApi.service";
import ProfileSectionTitle from "./ProfileSectionTitle";
import { formatDate } from "./profileFormatters";
import type { CvDocumentData } from "./profile.types";

type Props = {
  documents: CvDocumentData[];
};

const DocumentsSection = memo(function DocumentsSection({ documents }: Props) {
  async function handleOpenDocument(document: CvDocumentData) {
    try {
      const blob = await getDocumentFileAsync(document.id);
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank", "noopener,noreferrer");

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      console.error(error);
      alert("Could not open document.");
    }
  }

  return (
    <Box component="section">
      <ProfileSectionTitle icon={<DescriptionIcon />}>
        Documents
      </ProfileSectionTitle>

      {documents.length === 0 ? (
        <Typography color="text.secondary">No documents added.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {documents.map((document, index) => (
            <Box
              component="article"
              key={document.id}
              sx={{
                py: 2.5,
                borderTop: index === 0 ? 0 : 1,
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    component="h3"
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.35,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {document.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.4,
                      color: "primary.main",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {document.category}
                  </Typography>
                </Box>

                {document.issue_date && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    {formatDate(document.issue_date)}
                  </Typography>
                )}
              </Box>

              {document.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.65, mt: 1.5 }}
                >
                  {document.description}
                </Typography>
              )}

              {document.file_name && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 1.5,
                    overflowWrap: "anywhere",
                  }}
                >
                  {document.file_name}
                </Typography>
              )}

              {(document.file_name || document.external_url) && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                      md: "column",
                      lg: "row",
                    },
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {document.file_name && (
                    <Button
                      type="button"
                      size="small"
                      variant="contained"
                      startIcon={<DescriptionIcon />}
                      onClick={() => handleOpenDocument(document)}
                      sx={{ flex: 1, boxShadow: "none" }}
                    >
                      Open file
                    </Button>
                  )}

                  {document.external_url && (
                    <Button
                      component="a"
                      href={document.external_url}
                      target="_blank"
                      rel="noreferrer"
                      size="small"
                      endIcon={<OpenInNewIcon />}
                      sx={{
                        flex: 1,
                        bgcolor: "background.paper",
                        color: "text.primary",
                        "&:hover": {
                          bgcolor: "action.selected",
                        },
                      }}
                    >
                      External link
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
});

export default DocumentsSection;
