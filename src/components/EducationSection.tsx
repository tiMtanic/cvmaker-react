import { memo, type Dispatch, type SetStateAction } from "react";
import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import type { UpdateProfileBody } from "../services/cvmakerApi.service";
import CvDatePicker from "./CvDatePicker";
import EditFormSection, { EditEntry, EmptySection } from "./EditFormSection";

type EducationFormData = UpdateProfileBody["education"][number];

export type EducationEditorItem = EducationFormData & {
  clientId: string;
};

type EducationSectionProps = {
  items: EducationEditorItem[];
  setItems: Dispatch<SetStateAction<EducationEditorItem[]>>;
};

type EducationEntryProps = {
  item: EducationEditorItem;
  setItems: Dispatch<SetStateAction<EducationEditorItem[]>>;
};

const EducationEntry = memo(function EducationEntry({
  item,
  setItems,
}: EducationEntryProps) {
  function updateField<K extends keyof EducationFormData>(
    field: K,
    value: EducationFormData[K],
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

  return (
    <EditEntry
      title={item.institution_name || "New education"}
      subtitle={item.qualification || undefined}
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
          label="Institution"
          value={item.institution_name}
          onChange={(event) =>
            updateField("institution_name", event.target.value)
          }
          required
          fullWidth
        />

        <TextField
          label="Qualification"
          value={item.qualification ?? ""}
          onChange={(event) => updateField("qualification", event.target.value)}
          fullWidth
        />

        <TextField
          label="Field of study"
          value={item.field_of_study ?? ""}
          onChange={(event) =>
            updateField("field_of_study", event.target.value)
          }
          fullWidth
        />

        <TextField
          label="Location"
          value={item.location ?? ""}
          onChange={(event) => updateField("location", event.target.value)}
          fullWidth
        />

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

function EducationSection({ items, setItems }: EducationSectionProps) {
  function addItem() {
    setItems((current) => [
      ...current,
      {
        clientId: crypto.randomUUID(),
        institution_name: "",
        qualification: "",
        field_of_study: "",
        location: "",
        start_date: "",
        end_date: null,
        description: "",
      },
    ]);
  }

  return (
    <EditFormSection
      title="Education"
      description="Degrees, training and other relevant education."
      icon={<SchoolIcon />}
      action={
        <Button
          type="button"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addItem}
        >
          Add education
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptySection>No education entries added yet.</EmptySection>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {items.map((item) => (
            <EducationEntry
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

export default memo(EducationSection);
