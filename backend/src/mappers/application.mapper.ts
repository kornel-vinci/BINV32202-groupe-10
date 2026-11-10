import type { Application, ApplicationDbo, ApplicationDto } from "../models/application.ts";

export const toApplication = (row: ApplicationDbo): Application => ({
  id: row.id,
  offerId: row.offer_id,
  studentId: row.student_id,
  message: row.message,
  status: row.status,
  appliedAt: row.applied_at,
  offerTitle: row.offer_title,
  companyShortName: row.company_short_name,
  academicYear: row.academic_year_label,
  period: row.period_code,
});

export const toApplicationDto = (application: Application): ApplicationDto => ({
  id: application.id,
  offerId: application.offerId,
  message: application.message,
  status: application.status,
  appliedAt: application.appliedAt,
  offerTitle: application.offerTitle,
  companyShortName: application.companyShortName,
  academicYear: application.academicYear,
  period: application.period,
});
