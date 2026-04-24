export async function uploadImage(file: File, type = "tour"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = (await response.json()) as { url?: string };

  if (!data.url) {
    throw new Error("Image URL missing in upload response");
  }

  return data.url;
}
