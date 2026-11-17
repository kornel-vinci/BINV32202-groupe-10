# Matrice des guides, senseurs et pratiques Web 2

## Identification et classification

L’inventaire détaillé, ses preuves et les résultats relevés sont conservés sans
modification dans [`matrice.md`](./matrice.md). Ce tableau en reprend les
classes pour les mettre en regard de l’audit Web 2.

| Classe | Éléments identifiés | Rôle |
|---|---|---|
| Guide inférentiel — feedforward | G1 instructions Copilot ; G2 README ; G3 documentation de référence ; G4 plan et décisions ; G5 modèle de PR | Oriente l’agent par des consignes textuelles à interpréter. |
| Guide computationnel — feedforward | G6 scripts npm ; G7 version de Node ; G8 installation figée ; G9 exclusions Git ; G10 générateur de configuration | Fournit des commandes, contraintes et mécanismes applicables par des outils. |
| Senseur inférentiel — feedback | SI1 auto-revue de l’agent | Produit une appréciation textuelle, sans remplacer une vérification exécutée. |
| Senseur computationnel — feedback | S1 Oxlint ; S2 TypeScript ; S3 tests backend ; S4 tests frontend ; S5 build ; S6 gardes au démarrage ; S7 contraintes SQLite ; S8 diagnostics VS Code | Observe le code ou son exécution et produit un résultat déterministe ou un diagnostic. |

## Correspondance avec les pratiques Web 2

Les correspondances et recommandations ci-dessous reprennent l’audit consigné
dans [`../semaine-3.md`](../semaine-3.md). Le dossier ne contient pas les
supports, notes ou consignes du cours Web 2 permettant d’en donner une
référence précise. Les statuts sont donc ceux de l’audit existant et restent à
confirmer avec la source de cours avant remise.

| Attente ou convention relevée dans l’audit | Guide examiné | Correspondance | Écart ou ajout proposé | Source Web 2 précise |
|---|---|---|---|---|
| Séparation des responsabilités et organisation du code | Instructions Copilot et documentation d’architecture : rôles des contrôleurs, services, repositories, pages et hooks | Oui, selon l’audit existant | Rien à ajouter dans cet audit | Non fournie ; à compléter avec le support ou la note de cours |
| Appels API et gestion des états de chargement, d’erreur et de données | Instructions sur les services frontend, les hooks et la gestion des erreurs | Partielle, selon l’audit existant | Préciser le traitement des états de chargement, d’erreur et de succès pour chaque requête | Non fournie ; à compléter avec le support ou la note de cours |
| Validation des entrées côté serveur | Instructions séparant la validation HTTP dans les contrôleurs des règles métier dans les services | Oui, selon l’audit existant | Rien à ajouter dans cet audit | Non fournie ; à compléter avec le support ou la note de cours |
| Conventions REST, statuts HTTP et documentation des routes | `backend/API.md` et instructions sur le contrat API | Oui, selon l’audit existant | Maintenir la documentation API alignée sur les routes et erreurs réellement implémentées ; l’inventaire signale des écarts | Non fournie ; à compléter avec le support ou la note de cours |
| Authentification et autorisation côté backend | Instructions sur les routes protégées et les contrôles d’accès ; règles du mode démo | Oui, selon l’audit existant | Rien à ajouter dans cet audit ; conserver la distinction entre mode démo et authentification réelle | Non fournie ; à compléter avec le support ou la note de cours |

### Limite de l’audit

L’exercice demande d’appuyer chaque attente Web 2 sur une source vérifiable.
L’audit déjà rédigé donne des catégories et des correspondances, mais pas les
références exactes aux supports du cours. Les tableaux ne prétendent donc pas
constituer une vérification indépendante des exigences de Web 2 : il faut
ajouter les références de cours disponibles au groupe avant de présenter ces
statuts comme confirmés.

