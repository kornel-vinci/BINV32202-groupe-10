# Semaine 8 — Bilan

## 2. Première partie — Examiner les senseurs : couverture des tests

### Partir des exigences

EF-32 concerne le dépôt et le retrait d’une candidature. EF-33 concerne la consultation
des candidatures par l’étudiant. Les cas vérifiés sont le dépôt sur une offre publiée, le refus
pour une offre non publiée, le retrait et l’isolement des candidatures.

### Relier les tests aux cas

| Exigence | Cas à vérifier                                  | Test existant (fichier et nom)                                                                   | Assertions utiles                                                            | Couverture                                      |
| -------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| EF-32    | Refuser une candidature à une offre non publiée | Aucun test correspondant dans backend/tests/applications.test.ts                                 | Aucune assertion sur le statut 409 et le code OFFER_NOT_PUBLISHED            | Absent                                          |
| EF-32    | Candidater à une offre publiée                  | backend/tests/applications.test.ts — crée une candidature pour une offre publiée`                | Réponse 201 et vérification de l’offre, du message et du statut IN_PROGRESS` | Couvert pour ce cas                             |
| EF-32    | Retirer une candidature en cours                | backend/tests/applications.test.ts — retire une candidature en cours                             | Réponse 204                                                                  | Partiel : le statut WITHDRAWN n’est pas vérifié |
| EF-33    | Un étudiant ne voit que ses candidatures        | backend/tests/applications.test.ts — retourne uniquement les candidatures de l'étudiant connecté | Réponse 200, une seule candidature et l’offre attendue                       | Couvert                                         |

Le test refuse un doublon actif vérifie également le refus d’une deuxième candidature
avec 409 et APPLICATION_ALREADY_EXISTS. C’est un comportement utile, mais il ne vérifie
pas le refus d’une offre non publiée.

### Traiter les manques

Le manque principal est un test API qui vérifie qu’une candidature à une offre non publiée
est refusée avec 409 et OFFER_NOT_PUBLISHED. Le retrait pourrait aussi être mieux vérifié
en contrôlant le statut enregistré après l’action. Aucun test ni code n’a été ajouté.

Vérifications effectuées :

- npm test : réussi, 4 tests.
- npm run check : échec à l’étape lint à cause de deux avertissements frontend. Le typecheck,
  les tests complets et le build n’ont donc pas été exécutés.

## 3. Deuxième partie — Auditer les guides à la lumière de Web 2

| Attente ou convention de Web 2 (source)                                           | Guide examiné (passage)                                                                                | Correspondance | Écart ou ajout proposé                                                         |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------ |
| Responsabilités séparées et organisation du code                                  | Consignes sur les rôles des contrôleurs, services, repositories, pages et hooks                        | Oui            | Rien à ajouter. Les rôles sont décrits clairement.                             |
| Appels API dans les services et gestion du chargement, des erreurs et des données | Consignes sur les services frontend, les hooks et la gestion des erreurs                               | Partielle      | Préciser que l’interface doit traiter les trois états de chaque requête.       |
| Validation des entrées côté serveur                                               | Consignes qui confient la validation HTTP aux contrôleurs et les règles métier aux services            | Oui            | Rien à ajouter.                                                                |
| Conventions REST, statuts HTTP et documentation des routes                        | Consignes sur les contrats API et la documentation des réponses et erreurs                             | Oui            | Rien à ajouter.                                                                |
| Authentification et autorisation vérifiées par le backend                         | Consignes sur les routes protégées et les contrôles d’accès ; le mode démo est limité au développement | Oui            | Rien à ajouter. Le mode démo est bien distingué d’une authentification réelle. |

Les consignes correspondent bien au cours pour l’architecture, la validation, les API et la
sécurité. Les deux améliorations les plus utiles seraient de préciser la gestion des états des
requêtes et d’ajouter un rappel d’accessibilité.
