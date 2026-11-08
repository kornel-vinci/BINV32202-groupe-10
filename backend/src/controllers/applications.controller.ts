import { Router } from "express";
import { toApplicationDto } from "../mappers/application.mapper.ts";
import { getCurrentUser } from "../middlewares/authenticate.ts";
import type { ApplicationsService } from "../services/applications.service.ts";
import { HttpError } from "../utils/httpError.ts";

const parsePositiveInteger = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new HttpError(400, "INVALID_BODY", "offerId doit être un entier positif");
  }
  return value;
};

const parseApplicationId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "INVALID_QUERY", "L'identifiant de candidature est invalide");
  }
  return id;
};

export const createApplicationsRouter = (service: ApplicationsService) => {
  const router = Router();

  router.get("/", (req, res) => {
    res.json(service.listMine(getCurrentUser(req)).map(toApplicationDto));
  });

  router.post("/", (req, res) => {
    if (typeof req.body !== "object" || req.body === null || Array.isArray(req.body)) {
      throw new HttpError(400, "INVALID_BODY", "Le corps doit être un objet JSON");
    }

    const offerId = parsePositiveInteger(req.body.offerId);
    const message =
      req.body.message === undefined || req.body.message === null || req.body.message === ""
        ? null
        : typeof req.body.message === "string"
          ? req.body.message
          : (() => {
              throw new HttpError(400, "INVALID_BODY", "message doit être une chaîne de caractères");
            })();

    const application = service.apply(getCurrentUser(req), offerId, message);
    res.status(201).json(toApplicationDto(application));
  });

  router.delete("/:id", (req, res) => {
    service.withdraw(getCurrentUser(req), parseApplicationId(req.params.id));
    res.status(204).send();
  });

  return router;
};
