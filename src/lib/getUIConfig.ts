const API = process.env.NEXT_PUBLIC_API_URL!;

/* 🔹 GET */
export async function getUIConfig(page: string) {
  const res = await fetch(`${API}/ui-config/${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load UI config");
  }

  return res.json();
}

/* 🔹 UPDATE */
export async function updateUIConfig(page: string, config: any) {
  const res = await fetch(`${API}/ui-config/${page}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ config }),
  });

  if (!res.ok) {
    throw new Error("Update failed");
  }

  return res.json();
}
