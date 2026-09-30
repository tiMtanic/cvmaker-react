import type { useProfile } from "../../context/profile.context";

type ProfileContextValue = ReturnType<typeof useProfile>;

export type ProfileData = NonNullable<ProfileContextValue["profile"]>;
export type WorkExperienceData = ProfileContextValue["workExperience"][number];
export type EducationData = ProfileContextValue["education"][number];
export type SkillData = ProfileContextValue["skills"][number];
export type CvDocumentData = ProfileContextValue["documents"][number];
