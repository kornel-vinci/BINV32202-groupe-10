# Matrice de traçabilité des tests — EF-32 et EF-33

Les tests et assertions ci-dessous sont ceux relevés dans
`backend/tests/applications.test.ts` et `frontend/tests/ApplicationsPage.test.tsx`.
La couverture est qualifiée selon les assertions effectivement présentes,
pas seulement selon l’existence d’un appel à l’API.

| Exigence | Cas à vérifier | Test existant | Assertions utiles | Couverture |
|---|---|---|---|---|
| EF-32 | Candidater à une offre publiée avec un message | `backend/tests/applications.test.ts` — `crée une candidature pour une offre publiée` | Réponse `201` ; `offerId`, `message` et statut `IN_PROGRESS` comparés aux valeurs attendues | Couvert pour ce cas |
| EF-32 | Candidater à une offre publiée sans message | Aucun test identifié dans `backend/tests/applications.test.ts` | Aucune assertion sur la création lorsque le champ facultatif `message` est absent | Absent |
| EF-32 | Refuser une candidature à une offre non publiée | Aucun test identifié dans `backend/tests/applications.test.ts` | Aucune assertion sur le statut `409` et le code `OFFER_NOT_PUBLISHED` | Absent |
| EF-32 | Refuser une deuxième candidature active pour la même offre | `backend/tests/applications.test.ts` — `refuse un doublon actif` | Réponse `409` et code d’erreur `APPLICATION_ALREADY_EXISTS` | Couvert pour le doublon actif |
| EF-32 | Retirer une candidature en cours | `backend/tests/applications.test.ts` — `retire une candidature en cours` | Réponse `204` ; le statut après retrait n’est pas vérifié dans ce test | Partiel |
| EF-32 | Ne pas retirer une candidature déjà traitée | Aucun test identifié dans `backend/tests/applications.test.ts` | Aucune assertion sur le refus d’un retrait après traitement | Absent |
| EF-33 | Un étudiant ne voit que ses candidatures | `backend/tests/applications.test.ts` — `retourne uniquement les candidatures de l'étudiant connecté` | Réponse `200`, une candidature, et vérification de son identifiant d’offre et de son statut | Couvert pour le cas observé ; le test ne vérifie pas explicitement les données de plusieurs étudiants simultanément |
| EF-33 | Afficher les candidatures et traduire les statuts testés | `frontend/tests/ApplicationsPage.test.tsx` — `affiche les candidatures et leurs statuts français` | Vérifie l’affichage du titre et du message, ainsi que « En cours » et « Non retenue » | Partiel : les statuts « Retenue » et « Retirée » ne sont pas assertés dans ce test |

## Comportements testés hors couverture directe de ces cas

Le doublon actif est bien testé par `refuse un doublon actif`, mais ce cas ne
prouve pas le refus d’une offre non publiée. Les tests de permissions,
contraintes SQLite et migrations répertoriés dans l’inventaire des senseurs
portent sur d’autres comportements et ne sont pas rattachés artificiellement à
EF-32 ou EF-33.

## Manques prioritaires à traiter

1. Ajouter un test API vérifiant qu’une offre non publiée est refusée avec le
   statut et le code d’erreur prévus.
2. Vérifier la création avec `message` absent.
3. Vérifier le résultat d’un retrait au-delà du seul statut HTTP, puis le refus
   de retirer une candidature traitée.
4. Compléter les tests d’affichage des quatre statuts français.

Ces tests n’ont pas été ajoutés dans le cadre de la constitution des livrables.

