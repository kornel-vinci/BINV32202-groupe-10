import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OffersPage from "../src/pages/OffersPage.tsx";
import { adminUser, contactUser, stubFetch, studentUser } from "./helpers/fetchMock.ts";

const offers = [
  {
    id: 2,
    title: "Refonte du portail client",
    companyShortName: "Lumen Digital",
    academicYear: "2026-2027",
    period: "P2",
    status: "SUBMITTED",
  },
  {
    id: 5,
    title: "Tableau de bord de qualité des données",
    companyShortName: "Lumen Data",
    academicYear: "2026-2027",
    period: "OTHER",
    status: "ASSIGNED",
  },
];

const publishedOffer = {
  id: 8,
  title: "Application de suivi des stocks",
  companyShortName: "Orbis",
  academicYear: "2026-2027",
  period: "P2",
  status: "PUBLISHED",
};

const createdApplication = {
  id: 8,
  offerId: publishedOffer.id,
  message: null,
  status: "IN_PROGRESS",
  appliedAt: "2026-11-17 10:00:00",
  offerTitle: publishedOffer.title,
  companyShortName: publishedOffer.companyShortName,
  academicYear: publishedOffer.academicYear,
  period: publishedOffer.period,
};

const stubStudentOffers = (postResponder = () =>
  Response.json(createdApplication, { status: 201 })) =>
  stubFetch({
    "/api/offers": () => Response.json([publishedOffer]),
    "/api/applications": (_input, init) =>
      init?.method === "POST" ? postResponder() : Response.json([]),
  });

describe("OffersPage", () => {
  it("recherche les offres par expression dans leur titre", async () => {
    const fetchMock = stubFetch({
      "/api/offers": (input) => {
        const search = new URL(String(input), "http://localhost").searchParams.get("q");
        return Response.json(search === "portail client" ? [offers[0]] : offers);
      },
    });

    render(<OffersPage user={adminUser} token="jeton" onUnauthorized={vi.fn()} />);

    fireEvent.change(await screen.findByLabelText("Rechercher par titre"), {
      target: { value: "  portail client  " },
    });

    expect(await screen.findByText("Refonte du portail client")).toBeInTheDocument();
    expect(screen.queryByText("Tableau de bord de qualité des données")).not.toBeInTheDocument();
    expect(
      fetchMock.mock.calls.some(([input]) => {
        return new URL(String(input), "http://localhost").searchParams.get("q") === "portail client";
      }),
    ).toBe(true);
  });

  it("affiche un message adapté quand la recherche ne retourne aucune offre", async () => {
    stubFetch({
      "/api/offers": (input) => {
        const search = new URL(String(input), "http://localhost").searchParams.get("q");
        return Response.json(search === "inexistant" ? [] : offers);
      },
    });

    render(<OffersPage user={adminUser} token="jeton" onUnauthorized={vi.fn()} />);

    fireEvent.change(await screen.findByLabelText("Rechercher par titre"), {
      target: { value: "inexistant" },
    });

    expect(await screen.findByText("Aucune offre ne correspond à votre recherche.")).toBeInTheDocument();
  });

  it("affiche les offres avec leurs libellés français", async () => {
    stubFetch({ "/api/offers": () => Response.json(offers) });

    render(<OffersPage user={contactUser} token="jeton" onUnauthorized={vi.fn()} />);

    expect(await screen.findByText("Refonte du portail client")).toBeInTheDocument();
    expect(screen.getByText("Soumise")).toBeInTheDocument();
    expect(screen.getByText("Attribuée")).toBeInTheDocument();
    expect(screen.getByText("Autre")).toBeInTheDocument();
    expect(screen.getByText("2 offres")).toBeInTheDocument();
    expect(screen.getByText("Les offres que vous avez déposées.")).toBeInTheDocument();
  });

  it("adapte la description au profil", async () => {
    stubFetch({ "/api/offers": () => Response.json([]) });

    const { unmount } = render(
      <OffersPage user={studentUser} token="jeton" onUnauthorized={vi.fn()} />,
    );
    expect(screen.getByText("Les offres publiées.")).toBeInTheDocument();
    expect(await screen.findByText("Aucune offre à afficher.")).toBeInTheDocument();
    unmount();

    render(<OffersPage user={adminUser} token="jeton" onUnauthorized={vi.fn()} />);
    expect(screen.getByText("Toutes les offres, tous statuts confondus.")).toBeInTheDocument();
  });

  it("affiche un refus d'accès renvoyé par le backend", async () => {
    stubFetch({ "/api/offers": () => new Response(null, { status: 403 }) });

    render(<OffersPage user={contactUser} token="jeton" onUnauthorized={vi.fn()} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("statut 403");
  });

  it("signale une session expirée", async () => {
    stubFetch({ "/api/offers": () => new Response(null, { status: 401 }) });
    const onUnauthorized = vi.fn();

    render(<OffersPage user={contactUser} token="jeton" onUnauthorized={onUnauthorized} />);

    await waitFor(() => expect(onUnauthorized).toHaveBeenCalled());
  });

  it("candidate sans message et envoie le corps attendu", async () => {
    const fetchMock = stubStudentOffers();

    render(<OffersPage user={studentUser} token="jeton" onUnauthorized={vi.fn()} />);

    fireEvent.click(await screen.findByRole("button", { name: "Candidater" }));
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => {
      const postRequest = fetchMock.mock.calls.find(
        ([input, init]) => String(input) === "/api/applications" && init?.method === "POST",
      );
      expect(postRequest).toBeDefined();
      expect(postRequest?.[1]).toMatchObject({
        method: "POST",
        headers: {
          Authorization: "jeton",
          "Content-Type": "application/json",
        },
      });
      expect(JSON.parse(String(postRequest?.[1]?.body))).toEqual({
        offerId: publishedOffer.id,
        message: "",
      });
    });

    expect(await screen.findByRole("button", { name: "Candidater" })).toBeInTheDocument();
  });

  it("candidate avec un message facultatif", async () => {
    const fetchMock = stubStudentOffers();

    render(<OffersPage user={studentUser} token="jeton" onUnauthorized={vi.fn()} />);

    fireEvent.click(await screen.findByRole("button", { name: "Candidater" }));
    fireEvent.change(screen.getByLabelText("Message (facultatif)"), {
      target: { value: "Mon message de candidature" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => {
      const postRequest = fetchMock.mock.calls.find(
        ([input, init]) => String(input) === "/api/applications" && init?.method === "POST",
      );
      expect(postRequest).toBeDefined();
      expect(JSON.parse(String(postRequest?.[1]?.body))).toEqual({
        offerId: publishedOffer.id,
        message: "Mon message de candidature",
      });
    });
  });

  it("affiche l'erreur du serveur et conserve le formulaire en cas d'échec", async () => {
    stubStudentOffers(() => new Response(null, { status: 409 }));

    render(<OffersPage user={studentUser} token="jeton" onUnauthorized={vi.fn()} />);

    fireEvent.click(await screen.findByRole("button", { name: "Candidater" }));
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(await screen.findByText("Candidature impossible (statut 409)")).toBeInTheDocument();
    expect(screen.getByLabelText("Message (facultatif)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeInTheDocument();
  });
});
