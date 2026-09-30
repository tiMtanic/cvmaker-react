import { memo, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ProfileSectionTitle from "./ProfileSectionTitle";
import { formatYearsExperience } from "./profileFormatters";
import type { SkillData } from "./profile.types";

type Props = {
  skills: SkillData[];
};

const SkillsSection = memo(function SkillsSection({ skills }: Props) {
  const skillsByCategory = useMemo(
    () =>
      skills.reduce<Record<string, SkillData[]>>((groups, skill) => {
        const category = skill.category?.trim() || "Other";
        (groups[category] ??= []).push(skill);
        return groups;
      }, {}),
    [skills],
  );

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <ProfileSectionTitle icon={<BusinessCenterIcon />}>
        Skills
      </ProfileSectionTitle>

      {skills.length === 0 ? (
        <Typography color="text.secondary">No skills added.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Object.entries(skillsByCategory).map(
            ([category, categorySkills]) => (
              <Box key={category}>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    color: "primary.main",
                    fontWeight: 800,
                    letterSpacing: "0.11em",
                    lineHeight: 1.4,
                    mb: 1.5,
                  }}
                >
                  {category}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {categorySkills.map((skill, index) => (
                    <Box
                      key={skill.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "minmax(0, 1fr) minmax(60px, 0.55fr) minmax(72px, 0.65fr)",
                        columnGap: 1.5,
                        alignItems: "center",
                        py: 1.25,
                        px: 0.5,
                        borderTop: index === 0 ? 1 : 0,
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 650,
                          minWidth: 0,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {skill.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color={skill.level ? "text.primary" : "text.disabled"}
                      >
                        {skill.level || "—"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textAlign: "right",
                          whiteSpace: "nowrap",
                          minHeight: "1.25rem",
                        }}
                      >
                        {formatYearsExperience(skill.years_experience)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ),
          )}
        </Box>
      )}
    </Box>
  );
});

export default SkillsSection;
