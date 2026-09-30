import { memo, type Dispatch, type SetStateAction } from "react";
import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CodeIcon from "@mui/icons-material/Code";
import type { UpdateProfileBody } from "../services/cvmakerApi.service";
import EditFormSection, { EditEntry, EmptySection } from "./EditFormSection";

type SkillFormData = UpdateProfileBody["skills"][number];

export type SkillEditorItem = SkillFormData & {
  clientId: string;
};

type SkillsSectionProps = {
  items: SkillEditorItem[];
  setItems: Dispatch<SetStateAction<SkillEditorItem[]>>;
};

type SkillEntryProps = {
  item: SkillEditorItem;
  setItems: Dispatch<SetStateAction<SkillEditorItem[]>>;
};

const SkillEntry = memo(function SkillEntry({
  item,
  setItems,
}: SkillEntryProps) {
  function updateField<K extends keyof SkillFormData>(
    field: K,
    value: SkillFormData[K],
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
      title={item.name || "New skill"}
      subtitle={item.category || undefined}
      onRemove={removeItem}
    >
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
          label="Name"
          value={item.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Category"
          value={item.category ?? ""}
          onChange={(event) => updateField("category", event.target.value)}
          placeholder="e.g. Programming, Language"
          fullWidth
        />

        <TextField
          label="Level"
          value={item.level ?? ""}
          onChange={(event) => updateField("level", event.target.value)}
          placeholder="e.g. Advanced, C1"
          fullWidth
        />

        <TextField
          label="Years experience"
          type="number"
          value={item.years_experience ?? ""}
          onChange={(event) =>
            updateField(
              "years_experience",
              event.target.value === "" ? null : Number(event.target.value),
            )
          }
          slotProps={{
            htmlInput: {
              min: 0,
              step: 0.1,
            },
          }}
          fullWidth
        />
      </Box>
    </EditEntry>
  );
});

function SkillsSection({ items, setItems }: SkillsSectionProps) {
  function addItem() {
    setItems((current) => [
      ...current,
      {
        clientId: crypto.randomUUID(),
        name: "",
        category: "",
        level: "",
        years_experience: null,
      },
    ]);
  }

  return (
    <EditFormSection
      title="Skills"
      description="Technical skills, tools, technologies and languages."
      icon={<CodeIcon />}
      action={
        <Button
          type="button"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addItem}
        >
          Add skill
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptySection>No skills added yet.</EmptySection>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {items.map((item) => (
            <SkillEntry key={item.clientId} item={item} setItems={setItems} />
          ))}
        </Box>
      )}
    </EditFormSection>
  );
}

export default memo(SkillsSection);
