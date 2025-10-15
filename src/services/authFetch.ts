// Centralized fetch wrapper that adds Authorization header and handles 401 / user-not-found
import config from "@/config";
import { apiService } from "./api";

function shouldForceLogout(status: number, bodyText?: string): boolean {
  if (status === 401) return true;
  if (!bodyText) return false;
  const msg = bodyText.toLowerCase();
  // Cover common backend messages
  return (
    msg.includes("invalid token") ||
    msg.includes("token invalide") ||
    msg.includes("invalid signature") ||
    msg.includes("signature invalide") ||
    msg.includes("user not found") ||
    msg.includes("utilisateur inexistant") ||
    msg.includes("utilisateur n'existe") ||
    msg.includes("does not exist") ||
    msg.includes("n'existe pas")
  );
}

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem(config.auth.tokenKey);
    if (token && typeof headers === "object") {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(input, { ...init, headers });

  if (!response.ok) {
    // Try to read body text safely to detect messages
    let text: string | undefined = undefined;
    try {
      const clone = response.clone();
      text = await clone.text();
    } catch {}

    if (shouldForceLogout(response.status, text)) {
      // Clear and redirect
      apiService.clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return response;
}
