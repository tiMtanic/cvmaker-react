import axios from "axios";

const cvmakerApiService = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

cvmakerApiService.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
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
    id?: number;
    title: string;
    category: string;
    description?: string | null;
    external_url?: string | null;
    file_name?: string | null;
    file_content_base64?: string | null;
    file_mime_type?: string | null;
    issue_date?: string | null;
    remove_file?: boolean;
  }>;
};

export type AuthPayload = {
  code: string;
  is_admin_code: boolean;
};

export type AuthResponse = {
  authToken: string;
  payload: AuthPayload;
};

export type VerifyResponse = {
  payload: AuthPayload;
};

export type AccessCode = {
  code: string;
  company: string | null;
  is_admin_code: boolean;
};

export type AccessLog = {
  access_code_code: string;
  access_time: string;
  country: string | null;
  city: string | null;
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

export async function setupAsync(code: string): Promise<AuthResponse> {
  return (await cvmakerApiService.post("/auth/setup", { code })).data;
}

export async function signInAsync(code: string): Promise<AuthResponse> {
  return (await cvmakerApiService.post("/auth/signin", { code })).data;
}

export async function verifyAsync(): Promise<VerifyResponse> {
  return (await cvmakerApiService.get("/auth/verify")).data;
}

export async function getAccessCodesAsync(): Promise<AccessCode[]> {
  return (await cvmakerApiService.get("/access-codes")).data;
}

export async function createAccessCodeAsync(
  code: string,
  company?: string | null,
): Promise<AccessCode> {
  return (
    await cvmakerApiService.post("/access-codes", {
      code,
      company: company?.trim() || null,
    })
  ).data;
}

export async function deleteAccessCodeAsync(code: string): Promise<void> {
  await cvmakerApiService.delete(`/access-codes/${encodeURIComponent(code)}`);
}

export async function getAccessLogsAsync(): Promise<AccessLog[]> {
  return (await cvmakerApiService.get("/access-logs")).data;
}

export default cvmakerApiService;
