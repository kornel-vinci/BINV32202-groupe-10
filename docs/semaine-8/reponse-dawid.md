# Semaine 8 — Harnais agentique : guider et vérifier

## 2. Première partie — Examiner les senseurs : couverture des tests

### Relier les tests aux cas

| Exigence | Cas à vérifier                                  | Test existant (fichier et nom)                                                                       | Assertions utiles                                                               | Couverture |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------- |
| EF-32    | Refuser une candidature à une offre non publiée | `backend/tests/applications.test.ts` — `crée une candidature pour une offre publiée`                 | `status === 201` et `status === "IN_PROGRESS"` pour une offre publiée           | Partiel    |
| EF-33    | Un étudiant ne voit que ses candidatures        | `backend/tests/applications.test.ts` — `retourne uniquement les candidatures de l'étudiant connecté` | `status === 200`, `body.length === 1`, et `body[0].offerId === OFFER.FLEET_APP` | Couvert    |

Un cas est couvert seulement si les assertions portent effectivement sur le résultat attendu.
Ici, EF-33 est bien couvert : le test vérifie l’isolement des candidatures par étudiant, ce qui est
l’objectif de l’exigence. Pour EF-32, le test existant ne couvre que le cas nominal, c’est-à-dire la
création d’une candidature sur une offre publiée ; il ne vérifie pas le refus quand l’offre n’est pas
publiée.

Les comportements testés qui ne correspondent pas strictement à EF-32 ou EF-33 sont :

- `refuse un doublon actif` : vérifie la protection contre un double dépôt pour la même offre ;
- `retire une candidature en cours` : vérifie le retrait avant traitement ;
- `crée une candidature pour une offre publiée` : cas de succès de l’EF-32.

Ces tests sont utiles, mais ils ne remplacent pas le contrôle explicite de la non-publication de l’offre.

### Traiter les manques

Le manque principal est le cas de refus d’une candidature lorsqu’une offre n’est pas publiée.
Le code métier contient bien la vérification (`service.apply` vérifie que l’offre est publiée), mais il
n’y a pas de test API/backend qui affirme explicitement ce refus avec un `409` et le code
`OFFER_NOT_PUBLISHED`.

Le cas de EF-33 est déjà couvert par le test existant : il s’assure que l’étudiant connecté ne voit que
ses candidatures. Ce test est pertinent et cible la bonne règle métier. En revanche, pour EF-32,
seule la branche positive est testée ; la branche négative de “offre non publiée” manque encore.
