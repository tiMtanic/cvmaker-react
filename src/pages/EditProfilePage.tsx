import { useEffect, useState, type ComponentProps } from "react";
import { useNavigate } from "react-router";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ProfileFormSection from "../components/ProfileFormSection";
import WorkExperienceSection, {
  type WorkExperienceEditorItem,
} from "../components/WorkExperienceSection";
import EducationSection, {
  type EducationEditorItem,
} from "../components/EducationSection";
import SkillsSection, {
  type SkillEditorItem,
} from "../components/SkillsSection";
import DocumentsSection, {
  type DocumentEditorItem,
} from "../components/DocumentsSection";
import { useProfile } from "../context/profile.context";
import {
  updateProfileAsync,
  type UpdateProfileBody,
} from "../services/cvmakerApi.service";

type ProfileFormData = UpdateProfileBody["profile"];

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

const emptyProfile: ProfileFormData = {
  full_name: "",
  professional_title: "",
  email: "",
  phone: "",
  country: "",
  profile_summary: "",
  linkedin_url: "",
  xing_url: "",
  github_url: "",
  photo_base64: null,
  photo_mime_type: null,
};

function stripClientId<T extends { clientId: string }>(
  item: T,
): Omit<T, "clientId"> {
  const { clientId, ...data } = item;

  void clientId;

  return data;
}

function EditProfilePage() {
  const navigate = useNavigate();

  const {
    profile: storedProfile,
    workExperience: storedWorkExperience,
    education: storedEducation,
    skills: storedSkills,
    documents: storedDocuments,
    isLoading,
    error: profileError,
    refreshProfile,
  } = useProfile();

  const [profile, setProfile] = useState<ProfileFormData>(emptyProfile);

  const [workExperience, setWorkExperience] = useState<
    WorkExperienceEditorItem[]
  >([]);

  const [education, setEducation] = useState<EducationEditorItem[]>([]);

  const [skills, setSkills] = useState<SkillEditorItem[]>([]);

  const [documents, setDocuments] = useState<DocumentEditorItem[]>([]);

  const [isInitialized, setIsInitialized] = useState(false);

  const [isInitializing, setIsInitializing] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || isInitialized) {
      return;
    }

    try {
      if (storedProfile) {
        setProfile({
          full_name: storedProfile.full_name ?? "",
          professional_title: storedProfile.professional_title ?? "",
          email: storedProfile.email ?? "",
          phone: storedProfile.phone ?? "",
          country: storedProfile.country ?? "",
          profile_summary: storedProfile.profile_summary ?? "",
          linkedin_url: storedProfile.linkedin_url ?? "",
          xing_url: storedProfile.xing_url ?? "",
          github_url: storedProfile.github_url ?? "",
          photo_base64: storedProfile.photo_base64 ?? null,
          photo_mime_type: storedProfile.photo_mime_type ?? null,
        });
      }

      setWorkExperience(
        storedWorkExperience.map((item) => ({
          clientId: `work-${item.id}`,
          company_name: item.company_name,
          job_title: item.job_title,
          location: item.location,
          start_date: item.start_date,
          end_date: item.end_date,
          is_current: item.is_current,
          description: item.description,
        })),
      );

      setEducation(
        storedEducation.map((item) => ({
          clientId: `education-${item.id}`,
          institution_name: item.institution_name,
          qualification: item.qualification,
          field_of_study: item.field_of_study,
          location: item.location,
          start_date: item.start_date,
          end_date: item.end_date,
          description: item.description,
        })),
      );

      setSkills(
        storedSkills.map((item) => ({
          clientId: `skill-${item.id}`,
          name: item.name,
          category: item.category,
          level: item.level,
          years_experience: item.years_experience,
        })),
      );

      setDocuments(
        storedDocuments.map((item) => ({
          clientId: `document-${item.id}`,
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description,
          external_url: item.external_url,
          file_name: item.file_name,
          file_content_base64: null,
          file_mime_type: item.file_mime_type,
          issue_date: item.issue_date,
          remove_file: false,
        })),
      );

      setIsInitialized(true);
    } catch (error) {
      console.error(error);

      setError("Could not prepare profile for editing.");
    } finally {
      setIsInitializing(false);
    }
  }, [
    isLoading,
    isInitialized,
    storedProfile,
    storedWorkExperience,
    storedEducation,
    storedSkills,
    storedDocuments,
  ]);

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setError(null);

    try {
      await updateProfileAsync({
        profile,

        work_experience: workExperience.map(stripClientId),

        education: education.map(stripClientId),

        skills: skills.map(stripClientId),

        documents: documents.map(stripClientId),
      });

      await refreshProfile();

      navigate("/");
    } catch (error) {
      console.error(error);

      setError("Could not save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isInitializing) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: {
          xs: 2,
          sm: 4,
          md: 6,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
              },
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Edit CV
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
              maxWidth: 700,
            }}
          >
            Update your professional information, experience, education, skills
            and supporting documents.
          </Typography>
        </Box>

        {profileError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {profileError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <ProfileFormSection profile={profile} setProfile={setProfile} />

          <WorkExperienceSection
            items={workExperience}
            setItems={setWorkExperience}
          />

          <EducationSection items={education} setItems={setEducation} />

          <SkillsSection items={skills} setItems={setSkills} />

          <DocumentsSection items={documents} setItems={setDocuments} />

          <Box
            sx={{
              pt: {
                xs: 1,
                sm: 2,
              },
            }}
          >
            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column-reverse",
                  sm: "row",
                },
                justifyContent: "flex-end",
                gap: 1.5,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={() => navigate("/")}
                disabled={isSaving}
                sx={{
                  minWidth: {
                    sm: 120,
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSaving || !isInitialized}
                startIcon={
                  isSaving ? (
                    <CircularProgress size={18} thickness={5} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  minWidth: {
                    sm: 140,
                  },
                }}
              >
                {isSaving ? "Saving" : "Save CV"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default EditProfilePage;
