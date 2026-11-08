import type { Db } from "../db/database.ts";
import type { ApplicationDbo } from "../models/application.ts";

interface OfferParams {
  offerId: number;
}

interface ApplicationParams {
  offerId: number;
  studentId: number;
  message: string | null;
}

export const createApplicationsRepository = (db: Db) => {
  const publishedOffer = db.prepare<OfferParams, { id: number }>(
    "SELECT id FROM offers WHERE id = @offerId AND status = 'PUBLISHED'",
  );
  const activeApplication = db.prepare<
    Pick<ApplicationParams, "offerId" | "studentId">,
    ApplicationDbo
  >(`
    SELECT id, offer_id, student_id, message, status, applied_at
    FROM applications
    WHERE offer_id = @offerId
      AND student_id = @studentId
      AND status = 'IN_PROGRESS'
  `);
  const insertApplication = db.prepare<ApplicationParams, ApplicationDbo>(`
    INSERT INTO applications (offer_id, student_id, message)
    VALUES (@offerId, @studentId, @message)
    RETURNING id, offer_id, student_id, message, status, applied_at
  `);

  return {
    hasPublishedOffer: (offerId: number): boolean =>
      publishedOffer.get({ offerId }) !== undefined,
    findActive: (offerId: number, studentId: number): ApplicationDbo | undefined =>
      activeApplication.get({ offerId, studentId }),
    create: (params: ApplicationParams): ApplicationDbo => {
      const application = insertApplication.get(params);
      if (!application) throw new Error("Candidature créée introuvable");
      return application;
    },
  };
};

export type ApplicationsRepository = ReturnType<typeof createApplicationsRepository>;
