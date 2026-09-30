import {
  memo,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Avatar, Box, Button, TextField } from "@mui/material";
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

function ProfileFormSection({ profile, setProfile }: ProfileFormSectionProps) {
  function handleProfileChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

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
            md: "180px minmax(0, 1fr)",
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
              md: "stretch",
            },
            gap: 1.5,
          }}
        >
          <Avatar
            src={
              profile.photo_base64
                ? `data:${profile.photo_mime_type ?? "image/jpeg"};base64,${
                    profile.photo_base64
                  }`
                : undefined
            }
            alt={profile.full_name || "Profile"}
            sx={{
              width: 150,
              height: 150,
              alignSelf: {
                xs: "center",
                md: "flex-start",
              },
              boxShadow: 1,
            }}
          />

          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
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
