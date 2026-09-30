import {
  memo,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import type { UpdateProfileBody } from "../services/cvmakerApi.service";
import { fileToBase64 } from "../utils/fileToBase64";
import CvDatePicker from "./CvDatePicker";
import EditFormSection, { EditEntry, EmptySection } from "./EditFormSection";

type DocumentFormData = UpdateProfileBody["documents"][number];

export type DocumentEditorItem = DocumentFormData & {
  clientId: string;
};

type DocumentsSectionProps = {
  items: DocumentEditorItem[];
  setItems: Dispatch<SetStateAction<DocumentEditorItem[]>>;
};

type DocumentEntryProps = {
  item: DocumentEditorItem;
  setItems: Dispatch<SetStateAction<DocumentEditorItem[]>>;
};

const DocumentEntry = memo(function DocumentEntry({
  item,
  setItems,
}: DocumentEntryProps) {
  function updateField<K extends keyof DocumentFormData>(
    field: K,
    value: DocumentFormData[K],
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

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const base64 = await fileToBase64(file);

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.clientId === item.clientId
            ? {
                ...currentItem,
                file_name: file.name,
                file_content_base64: base64,
                file_mime_type: file.type || "application/octet-stream",
                remove_file: false,
              }
            : currentItem,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      event.target.value = "";
    }
  }

  function removeFile() {
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.clientId === item.clientId
          ? {
              ...currentItem,
              file_name: null,
              file_content_base64: null,
              file_mime_type: null,
              remove_file: true,
            }
          : currentItem,
      ),
    );
  }

  return (
    <EditEntry
      title={item.title || "New document"}
      subtitle={item.category || undefined}
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
          label="Title"
          value={item.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Category"
          value={item.category}
          onChange={(event) => updateField("category", event.target.value)}
          placeholder="e.g. Certificate"
          required
          fullWidth
        />

        <TextField
          label="External URL"
          type="url"
          value={item.external_url ?? ""}
          onChange={(event) => updateField("external_url", event.target.value)}
          fullWidth
        />

        <CvDatePicker
          label="Issue date"
          value={item.issue_date}
          onChange={(value) => updateField("issue_date", value)}
        />

        <TextField
          label="Description"
          value={item.description ?? ""}
          onChange={(event) => updateField("description", event.target.value)}
          multiline
          minRows={3}
          fullWidth
          sx={{
            gridColumn: {
              xs: "auto",
              md: "1 / -1",
            },
          }}
        />

        <Box
          sx={{
            gridColumn: {
              xs: "auto",
              md: "1 / -1",
            },
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            gap: 1.5,
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
          >
            {item.file_name ? "Replace file" : "Select file"}

            <input hidden type="file" onChange={handleFileChange} />
          </Button>

          {item.file_name ? (
            <>
              <Chip
                label={item.file_name}
                sx={{
                  maxWidth: {
                    xs: "100%",
                    sm: 400,
                  },
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />

              <Button
                type="button"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={removeFile}
                sx={{
                  ml: {
                    xs: 0,
                    sm: "auto",
                  },
                }}
              >
                Remove file
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No file attached
            </Typography>
          )}
        </Box>
      </Box>
    </EditEntry>
  );
});

function DocumentsSection({ items, setItems }: DocumentsSectionProps) {
  function addItem() {
    setItems((current) => [
      ...current,
      {
        clientId: crypto.randomUUID(),
        title: "",
        category: "",
        description: "",
        external_url: "",
        file_name: null,
        file_content_base64: null,
        file_mime_type: null,
        issue_date: null,
        remove_file: false,
      },
    ]);
  }

  return (
    <EditFormSection
      title="Documents"
      description="Certificates, references, portfolios and supporting material."
      icon={<DescriptionOutlinedIcon />}
      action={
        <Button
          type="button"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addItem}
        >
          Add document
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptySection>No documents added yet.</EmptySection>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {items.map((item) => (
            <DocumentEntry
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

export default memo(DocumentsSection);
