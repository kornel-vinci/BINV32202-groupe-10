import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import OfferTable from "../components/OfferTable.tsx";
import { useApplications } from "../hooks/useApplications.ts";
import { applyToOffer } from "../services/applications.service.ts";
import { useOffers } from "../hooks/useOffers.ts";
import type { User } from "../models/user.ts";

interface OffersPageProps {
  user: User;
  token: string;
  onUnauthorized: () => void;
}

const DESCRIPTIONS = {
  ADMIN: "Toutes les offres, tous statuts confondus.",
  STUDENT: "Les offres publiées.",
  CONTACT: "Les offres que vous avez déposées.",
} as const;

const OffersPage = ({ user, token, onUnauthorized }: OffersPageProps) => {
  const { offers, isLoading, error } = useOffers(token, onUnauthorized);
  const applications = useApplications(token, onUnauthorized, user.kind === "STUDENT");

  const renderContent = () => {
    if (error) return <ErrorState message={error} />;
    if (isLoading) return <LoadingState />;
    if (offers.length === 0) return <EmptyState message="Aucune offre à afficher." />;
    return (
      <>
        <p className="result-count">
          {offers.length} offre{offers.length > 1 ? "s" : ""}
        </p>
        <OfferTable
          offers={offers}
          canApply={user.kind === "STUDENT"}
          activeOfferIds={
            new Set(
              applications.applications
                .filter((application) => application.status === "IN_PROGRESS")
                .map((application) => application.offerId),
            )
          }
          onApply={(offerId, message) => applyToOffer(token, offerId, message)}
        />
      </>
    );
  };

  return (
    <section>
      <h1>Offres de stage</h1>
      <p>{DESCRIPTIONS[user.kind]}</p>
      {renderContent()}
    </section>
  );
};

export default OffersPage;
