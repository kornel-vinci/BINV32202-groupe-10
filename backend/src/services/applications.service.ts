import { toApplication } from "../mappers/application.mapper.ts";
import type { Application } from "../models/application.ts";
import type { User } from "../models/user.ts";
import type { ApplicationsRepository } from "../repositories/applications.repository.ts";
import { HttpError } from "../utils/httpError.ts";
import { isStudent } from "./permissions.ts";

const MAX_MESSAGE_LENGTH = 500;

export const createApplicationsService = (repository: ApplicationsRepository) => ({
  listMine: (viewer: User): Application[] => {
    if (!isStudent(viewer)) {
      throw new HttpError(403, "FORBIDDEN", "Seul un étudiant peut consulter ses candidatures");
    }
    return repository.findByStudent(viewer.id).map(toApplication);
  },
  apply: (viewer: User, offerId: number, message: string | null): Application => {
    if (!isStudent(viewer)) {
      throw new HttpError(403, "FORBIDDEN", "Seul un étudiant peut candidater");
    }
    if (!repository.hasPublishedOffer(offerId)) {
      throw new HttpError(409, "OFFER_NOT_PUBLISHED", "Cette offre n'est pas publiée");
    }
    if (repository.findActive(offerId, viewer.id)) {
      throw new HttpError(
        409,
        "APPLICATION_ALREADY_EXISTS",
        "Vous avez déjà une candidature en cours pour cette offre",
      );
    }
    if (message !== null && message.length > MAX_MESSAGE_LENGTH) {
      throw new HttpError(400, "INVALID_BODY", "Le message ne peut pas dépasser 500 caractères");
    }

    return toApplication(repository.create({ offerId, studentId: viewer.id, message }));
  },
  withdraw: (viewer: User, applicationId: number): void => {
    if (!isStudent(viewer)) {
      throw new HttpError(403, "FORBIDDEN", "Seul un étudiant peut retirer une candidature");
    }

    const application = repository.findByStudent(viewer.id).find(({ id }) => id === applicationId);
    if (!application) {
      throw new HttpError(404, "NOT_FOUND", "Candidature introuvable");
    }
    if (application.status !== "IN_PROGRESS") {
      throw new HttpError(
        409,
        "APPLICATION_ALREADY_PROCESSED",
        "Cette candidature a déjà été traitée",
      );
    }
    if (!repository.withdraw(applicationId, viewer.id)) {
      throw new HttpError(
        409,
        "APPLICATION_ALREADY_PROCESSED",
        "Cette candidature a déjà été traitée",
      );
    }
  },
});

export type ApplicationsService = ReturnType<typeof createApplicationsService>;
