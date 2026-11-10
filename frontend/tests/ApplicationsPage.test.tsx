import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplicationsPage from "../src/pages/ApplicationsPage.tsx";
import { stubFetch, studentUser } from "./helpers/fetchMock.ts";

describe("ApplicationsPage", () => {
  it("affiche les candidatures et leurs statuts français", async () => {
    stubFetch({
      "/api/applications": () =>
        Response.json([
          {
            id: 1,
            offerId: 1,
            offerTitle: "Application React de gestion de flotte",
            companyShortName: "Lumen Digital",
            academicYear: "2026-2027",
            period: "P2",
            message: "Mon message",
            status: "IN_PROGRESS",
            appliedAt: "2026-10-02 18:10:00",
          },
          {
            id: 2,
            offerId: 2,
            offerTitle: "Portail client",
            companyShortName: "Lumen Data",
            academicYear: "2026-2027",
            period: "P1",
            message: null,
            status: "REJECTED",
            appliedAt: "2026-09-02 18:10:00",
          },
        ]),
    });

    render(
      <ApplicationsPage
        user={studentUser}
        token="jeton"
        onUnauthorized={vi.fn()}
      />,
    );

    expect(await screen.findByText("Application React de gestion de flotte")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Non retenue")).toBeInTheDocument();
    expect(screen.getByText("Mon message")).toBeInTheDocument();
  });
});
