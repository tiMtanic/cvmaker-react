import axios from "axios";

const cvmakerApiService = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

export type UpdateProfileBody = {
  profile: {
    full_name: string;
    professional_title?: string | null;
    email?: string | null;
    phone?: string | null;
    country?: string | null;
    profile_summary?: string | null;
    linkedin_url?: string | null;
    xing_url?: string | null;
    github_url?: string | null;
    photo_base64?: string | null;
    photo_mime_type?: string | null;
  };
  work_experience: Array<{
    company_name: string;
    job_title: string;
    location: string;
    start_date: string;
    end_date?: string | null;
    is_current?: boolean;
    description?: string | null;
  }>;
  education: Array<{
    institution_name: string;
    qualification?: string | null;
    field_of_study?: string | null;
    location?: string | null;
    start_date: string;
    end_date?: string | null;
    description?: string | null;
  }>;
  skills: Array<{
    name: string;
    category?: string | null;
    level?: string | null;
    years_experience?: number | null;
  }>;
  documents: Array<{
    title: string;
    category: string;
    description?: string | null;
    external_url?: string | null;
    file_name?: string | null;
    file_content_base64?: string | null;
    file_mime_type?: string | null;
    issue_date?: string | null;
  }>;
};

export async function getProfileAsync() {
  const response = await cvmakerApiService.get("/profile");
  return response.data;
}

export async function updateProfileAsync(profile: UpdateProfileBody) {
  const response = await cvmakerApiService.put("/profile", profile);
  return response.data;
}

export async function getWorkExperienceAsync() {
  const response = await cvmakerApiService.get("/work-experience");
  return response.data;
}

export async function getEducationAsync() {
  const response = await cvmakerApiService.get("/education");
  return response.data;
}

export async function getSkillsAsync() {
  const response = await cvmakerApiService.get("/skills");
  return response.data;
}

export async function getDocumentsAsync() {
  const response = await cvmakerApiService.get("/documents");
  return response.data;
}

export async function getDocumentFileAsync(documentId: number) {
  const response = await cvmakerApiService.get(
    `/documents/${documentId}/file`,
    {
      responseType: "blob",
    },
  );

  return response.data;
}

export default cvmakerApiService;
