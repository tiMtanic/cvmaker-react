import { memo, type Dispatch, type SetStateAction } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WorkIcon from "@mui/icons-material/Work";
import type { UpdateProfileBody } from "../services/cvmakerApi.service";
import CvDatePicker from "./CvDatePicker";
import EditFormSection, { EditEntry, EmptySection } from "./EditFormSection";

type WorkExperienceFormData = UpdateProfileBody["work_experience"][number];

export type WorkExperienceEditorItem = WorkExperienceFormData & {
  clientId: string;
};

type WorkExperienceSectionProps = {
  items: WorkExperienceEditorItem[];
  setItems: Dispatch<SetStateAction<WorkExperienceEditorItem[]>>;
};

type WorkExperienceEntryProps = {
  item: WorkExperienceEditorItem;
  setItems: Dispatch<SetStateAction<WorkExperienceEditorItem[]>>;
};

const WorkExperienceEntry = memo(function WorkExperienceEntry({
  item,
  setItems,
}: WorkExperienceEntryProps) {
  function updateField<K extends keyof WorkExperienceFormData>(
    field: K,
    value: WorkExperienceFormData[K],
  ) {
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.clientId === item.clientId
          ? {
              ...currentItem,
              [field]: value,
            }
          : currentItem,
      ),
    );
  }

  function removeItem() {
    setItems((current) =>
      current.filter((currentItem) => currentItem.clientId !== item.clientId),
    );
  }

  function handleCurrentChange(checked: boolean) {
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.clientId === item.clientId
          ? {
              ...currentItem,
              is_current: checked,
              end_date: checked ? null : currentItem.end_date,
            }
          : currentItem,
      ),
    );
  }

  return (
    <EditEntry
      title={item.job_title || item.company_name || "New position"}
      subtitle={
        item.job_title && item.company_name ? item.company_name : undefined
      }
      onRemove={removeItem}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <TextField
          label="Company"
          value={item.company_name}
          onChange={(event) => updateField("company_name", event.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Job title"
          value={item.job_title}
          onChange={(event) => updateField("job_title", event.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Location"
          value={item.location}
          onChange={(event) => updateField("location", event.target.value)}
          required
          fullWidth
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={item.is_current ?? false}
                onChange={(event) => handleCurrentChange(event.target.checked)}
              />
            }
            label="Current position"
          />
        </Box>

        <CvDatePicker
          label="Start date"
          value={item.start_date}
          required
          onChange={(value) => updateField("start_date", value ?? "")}
        />

        <CvDatePicker
          label="End date"
          value={item.end_date}
          minDate={item.start_date}
          disabled={item.is_current ?? false}
          onChange={(value) => updateField("end_date", value)}
        />

        <TextField
          label="Description"
          value={item.description ?? ""}
          onChange={(event) => updateField("description", event.target.value)}
          multiline
          minRows={4}
          fullWidth
          sx={{
            gridColumn: {
              xs: "auto",
              md: "1 / -1",
            },
          }}
        />
      </Box>
    </EditEntry>
  );
});

function WorkExperienceSection({
  items,
  setItems,
}: WorkExperienceSectionProps) {
  function addItem() {
    setItems((current) => [
      ...current,
      {
        clientId: crypto.randomUUID(),
        company_name: "",
        job_title: "",
        location: "",
        start_date: "",
        end_date: null,
        is_current: false,
        description: "",
      },
    ]);
  }

  return (
    <EditFormSection
      title="Work Experience"
      description="Your professional positions and responsibilities."
      icon={<WorkIcon />}
      action={
        <Button
          type="button"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addItem}
        >
          Add position
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptySection>No work experience added yet.</EmptySection>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {items.map((item) => (
            <WorkExperienceEntry
              key={item.clientId}
              item={item}
              setItems={setItems}
            />
          ))}
        </Box>
      )}
    </EditFormSection>
  );
}

export default memo(WorkExperienceSection);
