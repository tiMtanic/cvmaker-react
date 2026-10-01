import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { AuthContext } from "./auth.context";

import {
  getDocumentsAsync,
  getEducationAsync,
  getProfileAsync,
  getSkillsAsync,
  getWorkExperienceAsync,
  type UpdateProfileBody,
} from "../services/cvmakerApi.service";

export type Profile = UpdateProfileBody["profile"] & {
  id: number;
};

export type WorkExperience = UpdateProfileBody["work_experience"][number] & {
  id: number;
  profile_info_id: number;
};

export type Education = UpdateProfileBody["education"][number] & {
  id: number;
  profile_info_id: number;
};

export type Skill = UpdateProfileBody["skills"][number] & {
  id: number;
  profile_info_id: number;
};

export type Document = {
  id: number;
  profile_info_id: number;
  title: string;
  category: string;
  description: string | null;
  external_url: string | null;
  file_name: string | null;
  file_mime_type: string | null;
  issue_date: string | null;
};

type ProfileContextType = {
  profile: Profile | null;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined,
);

type ProfileProviderProps = {
  children: ReactNode;
};

export function ProfileProvider({ children }: ProfileProviderProps) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("ProfileProvider must be used inside AuthWrapper");
  }

  const { isLoggedIn } = authContext;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setWorkExperience([]);
    setEducation([]);
    setSkills([]);
    setDocuments([]);
    setError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const profileRequest = getProfileAsync().catch((error) => {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          return null;
        }

        throw error;
      });

      const [
        profileData,
        workExperienceData,
        educationData,
        skillsData,
        documentsData,
      ] = await Promise.all([
        profileRequest,
        getWorkExperienceAsync(),
        getEducationAsync(),
        getSkillsAsync(),
        getDocumentsAsync(),
      ]);

      setProfile(profileData);
      setWorkExperience(workExperienceData);
      setEducation(educationData);
      setSkills(skillsData);
      setDocuments(documentsData);
    } catch (error) {
      console.error(error);
      setError("Could not load CV.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      clearProfile();
      setIsLoading(false);
      return;
    }

    void refreshProfile();
  }, [
    isLoggedIn,
    clearProfile,
    refreshProfile,
  ]);

  useEffect(() => {
    if (profile?.full_name) {
      document.title = `CV - ${profile.full_name}`;
    } else {
      document.title = "CV";
    }
  }, [profile?.full_name]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        workExperience,
        education,
        skills,
        documents,
        isLoading,
        error,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used inside ProfileProvider",
    );
  }

  return context;
}
