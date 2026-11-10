import { API_URL, readJson } from "../utils/api.ts";
import { isApplication, isApplicationList } from "../utils/guards.ts";

export const getApplications = async (token: string) => {
  const response = await fetch(`${API_URL}/applications`, {
    headers: { Authorization: token },
  });
  return readJson(response, isApplicationList, "Chargement des candidatures impossible");
};

export const applyToOffer = async (
  token: string,
  offerId: number,
  message: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ offerId, message }),
  });
  await readJson(response, isApplication, "Candidature impossible");
};

export const withdrawApplication = async (token: string, applicationId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/applications/${applicationId}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });
  if (!response.ok) {
    throw new Error(`Retrait impossible (statut ${response.status})`);
  }
};
