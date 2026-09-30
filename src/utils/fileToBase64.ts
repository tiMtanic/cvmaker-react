export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Could not read file"));
        return;
      }

      const base64 = result.split(",")[1];

      if (!base64) {
        reject(new Error("Could not convert file to Base64"));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Could not read file"));
    };

    reader.readAsDataURL(file);
  });
}
