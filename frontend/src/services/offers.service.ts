import type { Offer } from "../models/offer.ts";
import { API_URL, readJson } from "../utils/api.ts";
import { isOfferList } from "../utils/guards.ts";

export const getOffers = async (
  token: string,
  search: string,
  signal?: AbortSignal,
): Promise<Offer[]> => {
  const params = new URLSearchParams();
  const trimmedSearch = search.trim();
  if (trimmedSearch !== "") params.set("q", trimmedSearch);

  const query = params.toString();
  const response = await fetch(`${API_URL}/offers${query === "" ? "" : `?${query}`}`, {
    headers: { Authorization: token },
    signal,
  });
  return readJson(response, isOfferList, "Chargement des offres impossible");
};
