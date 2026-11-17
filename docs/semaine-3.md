# Semaine 8 — Bilan

## Inventaire — guides et senseurs

La matrice HTML détaillée, réalisée pour l’exercice 1, est conservée dans
[`semaine-8/matrice.html`](./semaine-8/matrice.html). Le tableau ci-dessous reprend son inventaire
pour réunir les éléments demandés dans ce livrable.

| Catégorie                           | Mécanisme — fichier ou outil                                      | Ce qu’il demande, impose ou vérifie                                                            | Exemple concret                                                                                                 | État pendant la séance                          |
| ----------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Guide — feedforward, inférentiel    | `.github/copilot-instructions.md`                                 | Donne à Copilot les conventions d’architecture, d’authentification, de migrations et de tests. | Garder l’accès SQL dans les repositories ; utiliser `HttpError` pour les erreurs API.                           | Consulté et vérifié                             |
| Guide — feedforward, inférentiel    | `README.md` et `docs/architecture.md`                             | Décrit l’organisation du projet, le flux backend/frontend et les commandes attendues.          | Flux backend : `controllers → services → repositories → SQLite`.                                                | Consultés et vérifiés                           |
| Guide — feedforward, inférentiel    | `backend/API.md`                                                  | Décrit le contrat HTTP : routes, statuts, formats JSON, authentification et erreurs.           | Une erreur suit le format `{ "error": { "code", "message" } }`.                                                 | Consulté et vérifié                             |
| Guide — feedforward, inférentiel    | `docs/cdc_gesta_developpement.md`                                 | Donne les exigences fonctionnelles, règles métier, rôles et périmètre à respecter.             | Un étudiant peut consulter les offres publiées et candidater.                                                   | Consulté et vérifié                             |
| Guide — feedforward, inférentiel    | `docs/semaine-7/plan.md`                                          | Guide de développement ciblé pour les candidatures étudiantes et leurs tests.                  | Une candidature active en double doit produire une erreur HTTP 409.                                             | Consulté et vérifié                             |
| Guide — feedforward, computationnel | `package.json`, packages workspace et configurations Oxlint       | Définit les commandes exécutables et les règles automatiques de qualité.                       | `npm run check` enchaîne lint, typage, tests et build ; Oxlint utilise `--deny-warnings`.                       | Exécuté partiellement et vérifié                |
| Guide — feedforward, computationnel | `.vscode/settings.json`                                           | Configure les permissions de Copilot, l’auto-approbation sélective et les limites de sandbox.  | Les commandes de test et de build sont autorisées automatiquement ; les écritures hors workspace sont bloquées. | Consulté et vérifié, configuration non modifiée |
| Guide — feedforward, inférentiel    | `.github/pull_request_template.md`                                | Impose une checklist de revue et de validation avant une pull request.                         | Vérifier les tests d’erreur, les droits backend, la documentation API et les migrations.                        | Consulté et vérifié, sans pull request          |
| Guide — feedforward, computationnel | `backend/src/db/migrations/002_active_application_unique.sql`     | Impose une contrainte SQLite sur les candidatures actives.                                     | Index unique partiel sur `(offer_id, student_id)` lorsque `status = 'IN_PROGRESS'`.                             | Présent et vérifié                              |
| Senseur — feedback, computationnel  | Oxlint, via `npm run lint`                                        | Analyse statiquement le code et signale les erreurs ou avertissements.                         | Deux avertissements bloquants dans `offers.service.ts` et `useApplications.ts`.                                 | Exécuté : échec                                 |
| Senseur — feedback, computationnel  | TypeScript, via `npm run typecheck`                               | Vérifie la cohérence des types backend et frontend.                                            | `tsc --noEmit` côté backend et `tsc -b` côté frontend.                                                          | Exécuté : succès                                |
| Senseur — feedback, computationnel  | Vitest, via `npm test`                                            | Exécute les tests backend et frontend : API, UI, permissions et migrations.                    | Frontend : 47 tests réussis. Backend : 110 réussis, 1 échec dans `migrations.test.ts`.                          | Exécuté : échec global                          |
| Senseur — feedback, computationnel  | Tests de migrations SQLite, `backend/tests/db/migrations.test.ts` | Vérifient que les migrations créent le schéma attendu et ne sont pas appliquées deux fois.     | Le test attend seulement `001_initial.sql`, mais le dépôt applique aussi `002_active_application_unique.sql`.   | Exécuté : échec vérifié                         |
| Senseur — feedback, computationnel  | Build TypeScript/Vite, via `npm run build`                        | Vérifie que le backend et le frontend peuvent être compilés et empaquetés.                     | Compilation backend, copie des migrations, compilation frontend et génération du bundle Vite.                   | Exécuté : succès                                |
| Senseur — feedback, computationnel  | Garde de version Node et test associé                             | Vérifie que l’environnement respecte la version minimale déclarée.                             | Le dépôt exige Node `>=22.14.0` ; la séance utilisait Node `v22.14.0`.                                          | Vérifié                                         |

Les guides computationnels regroupent les scripts, configurations et contraintes du projet.
Les senseurs exécutables comprennent Oxlint, TypeScript, Vitest, les tests de migrations,
le build et le contrôle de version Node. Aucun senseur de revue de code par IA n’a été exécuté
pendant cette séance. D’après la matrice, `npm run check` échoue au lint ; les tests de migration
signalent également un échec.

## Couverture des exigences

| Exigence | Cas à vérifier                                  | Test existant (fichier et nom)                                                                       | Assertions utiles                                                             | Couverture                                        |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| EF-32    | Refuser une candidature à une offre non publiée | Aucun test correspondant dans `backend/tests/applications.test.ts`                                   | Aucune assertion sur le statut 409 et le code `OFFER_NOT_PUBLISHED`           | Absent                                            |
| EF-32    | Candidater à une offre publiée                  | `backend/tests/applications.test.ts` — `crée une candidature pour une offre publiée`                 | Réponse 201 et vérification de l’offre, du message et du statut `IN_PROGRESS` | Couvert pour ce cas                               |
| EF-32    | Retirer une candidature en cours                | `backend/tests/applications.test.ts` — `retire une candidature en cours`                             | Réponse 204                                                                   | Partiel : le statut `WITHDRAWN` n’est pas vérifié |
| EF-33    | Un étudiant ne voit que ses candidatures        | `backend/tests/applications.test.ts` — `retourne uniquement les candidatures de l'étudiant connecté` | Réponse 200, une seule candidature et l’offre attendue                        | Couvert                                           |

Le test `refuse un doublon actif` vérifie également le refus d’une deuxième candidature avec
409 et `APPLICATION_ALREADY_EXISTS`. Ce comportement ne vérifie toutefois pas le refus d’une
offre non publiée.

## Modifications et vérification

Aucun code ni test n’a été ajouté ou modifié pour ces exercices. Le manque principal identifié
est un test API vérifiant le refus d’une candidature pour une offre non publiée avec `409` et
`OFFER_NOT_PUBLISHED`. Le test de retrait pourrait également vérifier que le statut devient
`WITHDRAWN`.

Vérifications relevées dans les réponses des exercices :

- `npm test --workspace backend -- tests/applications.test.ts` : réussi, 4 tests.
- `npm run check` : échec à l’étape lint à cause de deux avertissements frontend. Le typecheck,
  les tests complets et le build n’ont donc pas été exécutés dans cette vérification.
- La matrice de l’exercice 1 rapporte séparément un typecheck et un build réussis, et un test
  complet échoué (un échec dans `migrations.test.ts`).
- Aucune vérification manuelle distincte n’a été effectuée pour la couverture EF-32 / EF-33.

## Audit des guides

J’ai comparé les consignes du projet avec les supports Web 2 portant sur l’organisation du code,
les API, la validation, la sécurité, les tests et l’accessibilité.

| Attente ou convention de Web 2                                                    | Guide examiné (passage)                                                                                | Correspondance | Écart ou ajout proposé                                                         |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------ |
| Responsabilités séparées et organisation du code                                  | Consignes sur les rôles des contrôleurs, services, repositories, pages et hooks                        | Oui            | Rien à ajouter. Les rôles sont décrits clairement.                             |
| Appels API dans les services et gestion du chargement, des erreurs et des données | Consignes sur les services frontend, les hooks et la gestion des erreurs                               | Partielle      | Préciser que l’interface doit traiter les trois états de chaque requête.       |
| Validation des entrées côté serveur                                               | Consignes qui confient la validation HTTP aux contrôleurs et les règles métier aux services            | Oui            | Rien à ajouter.                                                                |
| Conventions REST, statuts HTTP et documentation des routes                        | Consignes sur les contrats API et la documentation des réponses et erreurs                             | Oui            | Rien à ajouter.                                                                |
| Authentification et autorisation vérifiées par le backend                         | Consignes sur les routes protégées et les contrôles d’accès ; le mode démo est limité au développement | Oui            | Rien à ajouter. Le mode démo est bien distingué d’une authentification réelle. |

Les consignes correspondent bien au cours pour l’architecture, la validation, les API et la
sécurité. Il serait utile de préciser la gestion des états des requêtes. Les guides du projet
n’ont pas été modifiés : le travail demandé est un audit et des recommandations.
