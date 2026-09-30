import { memo } from "react";
import { Box, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import ProfileSectionTitle from "./ProfileSectionTitle";
import { formatDate } from "./profileFormatters";
import type { WorkExperienceData } from "./profile.types";

type Props = {
  items: WorkExperienceData[];
};

const WorkExperienceSection = memo(function WorkExperienceSection({
  items,
}: Props) {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <ProfileSectionTitle icon={<WorkHistoryIcon />}>
        Work Experience
      </ProfileSectionTitle>

      {items.length === 0 ? (
        <Typography color="text.secondary">
          No work experience added.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {items.map((item, index) => {
            const hasNext = index < items.length - 1;

            return (
              <Box
                component="article"
                key={item.id}
                sx={{
                  position: "relative",
                  pb: hasNext ? 4.5 : 0,
                  mb: hasNext ? 4.5 : 0,
                  "&::after": hasNext
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        bgcolor: "divider",
                        opacity: 0.65,
                      }
                    : undefined,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "minmax(0, 1fr) auto",
                    },
                    gap: { xs: 0.75, sm: 2 },
                    alignItems: "start",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{ fontWeight: 750, lineHeight: 1.3 }}
                    >
                      {item.job_title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.35,
                        color: "primary.main",
                        fontWeight: 600,
                      }}
                    >
                      {item.company_name}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flexShrink: 0,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      pt: { sm: 0.35 },
                    }}
                  >
                    {formatDate(item.start_date)} –{" "}
                    {item.is_current ? "Present" : formatDate(item.end_date)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.65,
                    mt: 1.25,
                    color: "text.secondary",
                  }}
                >
                  <LocationOnOutlinedIcon sx={{ fontSize: 17 }} />
                  <Typography variant="body2">{item.location}</Typography>
                </Box>

                {item.description && (
                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 1.75,
                      lineHeight: 1.8,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
});

export default WorkExperienceSection;
