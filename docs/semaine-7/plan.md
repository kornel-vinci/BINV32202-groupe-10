# Plan EF-32 / EF-33 — candidatures étudiantes

## Problème et approche

Implémenter le parcours étudiant de candidature à une offre publiée, de consultation
des candidatures et de retrait avant traitement, en réutilisant la liste des offres et
le mode de connexion de démonstration existants. Le schéma contient déjà `applications`
et les quatre statuts nécessaires ; une migration complétera les contraintes utiles
sans modifier la migration initiale.

## Trois étapes proposées

1. **Candidater**
   - Ajouter une route backend protégée permettant à un étudiant de créer une
     candidature sur une offre `PUBLISHED`, avec message facultatif.
   - Refuser les profils non étudiants, les offres non publiées et les doublons actifs
     ou retirés selon la règle métier retenue.
   - Ajouter dans la liste des offres un bouton « Candidater » et un formulaire/message,
     en conservant la liste comme point d’entrée.

2. **Consulter ses candidatures**
   - Ajouter une route qui retourne uniquement les candidatures de l’étudiant connecté,
     avec l’offre et les informations nécessaires à l’affichage.
   - Ajouter une page de navigation dédiée, les modèles, garde-fous JSON, service et
     hook frontend.
   - Traduire les statuts `IN_PROGRESS`, `SELECTED`, `REJECTED`, `WITHDRAWN` en
     « En cours », « Retenue », « Non retenue », « Retirée ».

3. **Retirer une candidature**
   - Ajouter une route protégée qui ne cible que la candidature de l’étudiant connecté.
   - Autoriser le retrait uniquement depuis `IN_PROGRESS` ; rendre l’action indisponible
     pour les candidatures traitées ou déjà retirées.
   - Rafraîchir la liste après succès et afficher explicitement les erreurs HTTP.

## Fichiers/composants concernés

### Backend

- Nouvelle migration `backend/src/db/migrations/002_*.sql` : unicité
  `offer_id`/`student_id` et index/contraintes directement nécessaires.
- `backend/src/models/application.ts` et `backend/src/mappers/application.mapper.ts`.
- Nouveau `backend/src/repositories/applications.repository.ts`.
- Nouveau `backend/src/services/applications.service.ts` et extension ciblée de
  `backend/src/services/permissions.ts` si nécessaire.
- Nouveau `backend/src/controllers/applications.controller.ts`.
- `backend/src/app.ts` pour composer et monter `/applications`.
- `backend/API.md` pour documenter les routes, corps, statuts et erreurs.
- Tests backend dans `backend/tests/applications.test.ts`, avec les helpers et seed
  existants (`backend/src/db/seed/seedIds.ts`, `offersData.ts`) sans utiliser la base
  de développement.

### Frontend

- `frontend/src/models/application.ts`, `services/applications.service.ts`,
  `hooks/useApplications.ts` et les garde-fous dans `frontend/src/utils/guards.ts`.
- `frontend/src/pages/ApplicationsPage.tsx` et composants dédiés si la table/formulaire
  dépasse raisonnablement `OfferTable.tsx`.
- `frontend/src/pages/OffersPage.tsx` / `frontend/src/components/OfferTable.tsx` pour
  l’action de candidature.
- `frontend/src/App.tsx`, `frontend/src/components/NavBar.tsx`,
  `frontend/src/utils/labels.ts` et éventuellement `permissions.ts`.
- Tests ciblés dans `frontend/tests/OffersPage.test.tsx`, nouvelle
  `frontend/tests/ApplicationsPage.test.tsx` et tests de navigation si nécessaire.

## Vérifications et tests envisagés

- Tests API : absence de session, profil non étudiant, offre non publiée, candidature
  valide avec/sans message, doublon, lecture isolée par étudiant, statuts et retrait
  autorisé/interdit.
- Tests frontend : bouton et formulaire dans la liste, validation/erreur, affichage des
  quatre statuts français, retrait et réaction à une session expirée.
- Exécuter les tests ciblés backend/frontend, puis `npm run lint`,
  `npm run typecheck`, `npm test` et `npm run build` si les tests ciblés sont concluants.

## Décisions métier à confirmer

Les valeurs proposées ci-dessous servent de défaut pour l’implémentation :

1. **Nouvelle candidature après retrait** : autoriser une nouvelle candidature pour la
   même offre. Chaque candidature garde son historique ; l’unicité structurelle devra
   donc être limitée aux candidatures actives/non retirées.
2. **Longueur du message** : 500 caractères maximum, avec chaîne vide normalisée en
   `null`.
3. **Visibilité du message** : le retourner uniquement à l’étudiant propriétaire dans
   EF-33 ; pas de surface administrateur puisque EF-34 est hors périmètre.
4. **Offre déjà attribuée/retirée après candidature** : conserver le
   statut de la candidature jusqu’au traitement explicite ; aucune sélection ni
   transition automatique n’est ajoutée dans EF-32/EF-33.
5. **Emplacement UI** : bouton/formulaire dans la liste des offres et lien
   « Mes candidatures » visible uniquement pour un étudiant.
