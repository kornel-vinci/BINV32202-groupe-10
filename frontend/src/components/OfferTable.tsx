import { useState } from "react";
import type { Offer } from "../models/offer.ts";
import { OFFER_STATUS_LABELS, OFFER_STATUS_TONES, PERIOD_LABELS } from "../utils/labels.ts";
import StatusBadge from "./StatusBadge.tsx";

interface OfferTableProps {
  offers: Offer[];
  canApply?: boolean;
  activeOfferIds?: Set<number>;
  onApply?: (offerId: number, message: string) => Promise<void>;
}

const OfferTable = ({
  offers,
  canApply = false,
  activeOfferIds = new Set(),
  onApply,
}: OfferTableProps) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Titre</th>
          <th scope="col">Entreprise</th>
          <th scope="col">Année</th>
          <th scope="col">Période</th>
          <th scope="col">Statut</th>
          {canApply && <th scope="col">Action</th>}
        </tr>
      </thead>
      <tbody>
        {offers.map((offer) => (
          <tr key={offer.id}>
            <td>{offer.title}</td>
            <td>{offer.companyShortName}</td>
            <td>{offer.academicYear}</td>
            <td>{PERIOD_LABELS[offer.period]}</td>
            <td>
              <StatusBadge
                label={OFFER_STATUS_LABELS[offer.status]}
                tone={OFFER_STATUS_TONES[offer.status]}
              />
            </td>
            {canApply && (
              <td>
                {activeOfferIds.has(offer.id) ? (
                  "Déjà candidat"
                ) : (
                  <ApplicationAction offerId={offer.id} onApply={onApply} />
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface ApplicationActionProps {
  offerId: number;
  onApply?: (offerId: number, message: string) => Promise<void>;
}

const ApplicationAction = ({ offerId, onApply }: ApplicationActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return (
      <button className="button" type="button" onClick={() => setIsOpen(true)}>
        Candidater
      </button>
    );
  }

  const submit = async () => {
    if (!onApply) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await onApply(offerId, message);
      setIsOpen(false);
      setMessage("");
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Candidature impossible");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <label>
        Message (facultatif)
        <textarea
          maxLength={500}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      {error && <p className="state state-error">{error}</p>}
      <button className="button" type="button" disabled={isSubmitting} onClick={() => void submit()}>
        Envoyer
      </button>
      <button className="button" type="button" onClick={() => setIsOpen(false)}>
        Annuler
      </button>
    </div>
  );
};

export default OfferTable;
