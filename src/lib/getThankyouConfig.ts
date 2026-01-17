import { ThankYouConfig } from "@/types/thankyouConfig";

const API = process.env.NEXT_PUBLIC_API_URL!;

/* 🔹 GET */
export async function getThankYouConfig(
  page: string
): Promise<ThankYouConfig | null> {
  const res = await fetch(`${API}/ui-config/${page}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return Object.keys(data).length ? data : null;
}

/* 🔹 UPDATE */
export async function updateThankYouConfig(
  page: string,
  payload: Omit<ThankYouConfig, "page">
) {
  const res = await fetch(`${API}/ui-config/${page}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Update failed");
  }

  return res.json();
}
