import { memo, type ReactNode } from "react";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

type EditFormSectionProps = {
  title: string;
  description?: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

function EditFormSection({
  title,
  description,
  icon,
  action,
  children,
}: EditFormSectionProps) {
  return (
    <Paper
      component="section"
      elevation={1}
      sx={{
        p: {
          xs: 2.5,
          sm: 3.5,
          md: 4,
        },
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: 2,
              flexShrink: 0,
              bgcolor: "action.hover",
              color: "primary.main",
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              component="h2"
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  lineHeight: 1.5,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Box>

        {action && (
          <Box
            sx={{
              alignSelf: {
                xs: "flex-start",
                sm: "center",
              },
              flexShrink: 0,
            }}
          >
            {action}
          </Box>
        )}
      </Box>

      {children}
    </Paper>
  );
}

type EditEntryProps = {
  title: string;
  subtitle?: string;
  onRemove: () => void;
  children: ReactNode;
};

export const EditEntry = memo(function EditEntry({
  title,
  subtitle,
  onRemove,
  children,
}: EditEntryProps) {
  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
        borderRadius: 2.5,
        bgcolor: "action.hover",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.25,
                overflowWrap: "anywhere",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Tooltip title="Remove">
          <IconButton
            type="button"
            color="error"
            size="small"
            onClick={onRemove}
            aria-label={`Remove ${title}`}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {children}
    </Box>
  );
});

export const EmptySection = memo(function EmptySection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        px: 3,
        py: 4,
        borderRadius: 2.5,
        bgcolor: "action.hover",
        textAlign: "center",
      }}
    >
      <Typography color="text.secondary">{children}</Typography>
    </Box>
  );
});

export default memo(EditFormSection);
