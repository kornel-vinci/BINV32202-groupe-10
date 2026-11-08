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
  const applicationFields = `
    SELECT a.id, a.offer_id, a.student_id, a.message, a.status, a.applied_at,
           o.title AS offer_title, c.short_name AS company_short_name,
           ay.label AS academic_year_label, p.code AS period_code
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    JOIN academic_years ay ON ay.id = o.academic_year_id
    JOIN periods p ON p.id = o.period_id
  `;
  const applicationsByStudent = db.prepare<{ studentId: number }, ApplicationDbo>(`
    ${applicationFields}
    WHERE a.student_id = @studentId
    ORDER BY a.applied_at DESC, a.id DESC
  `);
  const publishedOffer = db.prepare<OfferParams, { id: number }>(
    "SELECT id FROM offers WHERE id = @offerId AND status = 'PUBLISHED'",
  );
  const activeApplication = db.prepare<
    Pick<ApplicationParams, "offerId" | "studentId">,
    ApplicationDbo
  >(`
    ${applicationFields}
    WHERE a.offer_id = @offerId
      AND a.student_id = @studentId
      AND a.status = 'IN_PROGRESS'
  `);
  const insertApplication = db.prepare<ApplicationParams, { id: number }>(`
    INSERT INTO applications (offer_id, student_id, message)
    VALUES (@offerId, @studentId, @message)
    RETURNING id
  `);
  const applicationById = db.prepare<{ id: number; studentId: number }, ApplicationDbo>(`
    ${applicationFields}
    WHERE a.id = @id AND a.student_id = @studentId
  `);

  return {
    findByStudent: (studentId: number): ApplicationDbo[] =>
      applicationsByStudent.all({ studentId }),
    hasPublishedOffer: (offerId: number): boolean =>
      publishedOffer.get({ offerId }) !== undefined,
    findActive: (offerId: number, studentId: number): ApplicationDbo | undefined =>
      activeApplication.get({ offerId, studentId }),
    create: (params: ApplicationParams): ApplicationDbo => {
      const inserted = insertApplication.get(params);
      const application = inserted
        ? applicationById.get({ id: inserted.id, studentId: params.studentId })
        : undefined;
      if (!application) throw new Error("Candidature créée introuvable");
      return application;
    },
  };
};

export type ApplicationsRepository = ReturnType<typeof createApplicationsRepository>;
