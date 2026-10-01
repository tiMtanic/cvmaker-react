import {
  memo,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import type { UpdateProfileBody } from "../services/cvmakerApi.service";
import { fileToBase64 } from "../utils/fileToBase64";
import EditFormSection from "./EditFormSection";

type ProfileFormData = UpdateProfileBody["profile"];

type ProfileFormSectionProps = {
  profile: ProfileFormData;
  setProfile: Dispatch<SetStateAction<ProfileFormData>>;
};

function ProfileFormSection({
  profile,
  setProfile,
}: ProfileFormSectionProps) {
  function handleProfileChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const base64 = await fileToBase64(file);

      setProfile((current) => ({
        ...current,
        photo_base64: base64,
        photo_mime_type: file.type,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      event.target.value = "";
    }
  }

  function removePhoto() {
    setProfile((current) => ({
      ...current,
      photo_base64: null,
      photo_mime_type: null,
    }));
  }

  return (
    <EditFormSection
      title="Profile"
      description="Your main personal and professional information."
      icon={<PersonOutlineIcon />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "210px minmax(0, 1fr)",
          },
          gap: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            gap: 1.5,
          }}
        >
          {profile.photo_base64 ? (
            <Box
              sx={(theme) => ({
                position: "relative",
                display: "inline-flex",
                p: "5px",
                borderRadius: 3.5,
                bgcolor: "background.paper",

                border: "1px solid",
                borderColor: alpha(
                  theme.palette.primary.dark,
                  theme.palette.mode === "dark" ? 0.35 : 0.18,
                ),

                boxShadow: `
                  0 12px 30px ${alpha(
                    theme.palette.common.black,
                    theme.palette.mode === "dark" ? 0.28 : 0.1,
                  )},
                  0 0 24px ${alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === "dark" ? 0.1 : 0.06,
                  )}
                `,

                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 20,
                  right: 20,
                  bottom: -1,
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  bgcolor: "primary.main",
                  opacity: 0.8,
                },
              })}
            >
              <Box
                component="img"
                src={`data:${
                  profile.photo_mime_type ?? "image/jpeg"
                };base64,${profile.photo_base64}`}
                alt={profile.full_name || "Profile"}
                sx={{
                  display: "block",

                  width: {
                    xs: 170,
                    md: 180,
                  },

                  height: "auto",
                  borderRadius: 2.5,
                }}
              />
            </Box>
          ) : (
            <Box
              sx={(theme) => ({
                width: {
                  xs: 170,
                  md: 180,
                },

                aspectRatio: "4 / 5",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 3.5,

                border: "1px solid",
                borderColor: alpha(
                  theme.palette.primary.dark,
                  theme.palette.mode === "dark" ? 0.3 : 0.15,
                ),

                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.06 : 0.025,
                ),

                color: "text.secondary",
              })}
            >
              <PersonOutlineIcon
                sx={{
                  fontSize: 48,
                  opacity: 0.55,
                }}
              />
            </Box>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            sx={{
              width: {
                xs: 170,
                md: 180,
              },
              whiteSpace: "nowrap",
            }}
          >
            Choose photo

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </Button>

          {profile.photo_base64 && (
            <Button
              type="button"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={removePhoto}
              sx={{
                width: {
                  xs: 170,
                  md: 180,
                },
                whiteSpace: "nowrap",
              }}
            >
              Remove photo
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <TextField
            label="Full name"
            name="full_name"
            value={profile.full_name}
            onChange={handleProfileChange}
            required
            fullWidth
          />

          <TextField
            label="Professional title"
            name="professional_title"
            value={profile.professional_title ?? ""}
            onChange={handleProfileChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={profile.email ?? ""}
            onChange={handleProfileChange}
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            type="tel"
            value={profile.phone ?? ""}
            onChange={handleProfileChange}
            fullWidth
          />

          <TextField
            label="Country"
            name="country"
            value={profile.country ?? ""}
            onChange={handleProfileChange}
            fullWidth
          />

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          />

          <TextField
            label="LinkedIn URL"
            name="linkedin_url"
            type="url"
            value={profile.linkedin_url ?? ""}
            onChange={handleProfileChange}
            fullWidth
          />

          <TextField
            label="Xing URL"
            name="xing_url"
            type="url"
            value={profile.xing_url ?? ""}
            onChange={handleProfileChange}
            fullWidth
          />

          <TextField
            label="GitHub URL"
            name="github_url"
            type="url"
            value={profile.github_url ?? ""}
            onChange={handleProfileChange}
            fullWidth
          />

          <TextField
            label="Profile summary"
            name="profile_summary"
            value={profile.profile_summary ?? ""}
            onChange={handleProfileChange}
            multiline
            minRows={5}
            fullWidth
            sx={{
              gridColumn: {
                xs: "auto",
                sm: "1 / -1",
              },
            }}
          />
        </Box>
      </Box>
    </EditFormSection>
  );
}

export default memo(ProfileFormSection);
