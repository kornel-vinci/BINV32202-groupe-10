# Bilan — guides, senseurs et traçabilité

## Livrables

- [Matrice des guides, senseurs et pratiques Web 2](./matrice-guides-web2.md) :
  classification des mécanismes et comparaison avec les attentes mentionnées
  dans l’audit existant.
- [Inventaire détaillé des guides et senseurs](./matrice.md) : preuves,
  observations et résultats détaillés, conservés sans modification.
- [Matrice de traçabilité des tests EF-32 et EF-33](./matrice-tests-requirements.md) :
  correspondance entre exigences, cas, tests, assertions et manques.
- [Conversation 1](./conversation-1.md) et
  [conversation 2](./conversation-2.md) : copies des conversations existantes
  dans `docs/semaine-1/` et `docs/semaine-2/`.

## Résultats principaux

Les guides inférentiels comprennent notamment les instructions Copilot, le
README, les documents de référence, les décisions de conception et le modèle
de pull request. Les guides computationnels comprennent les scripts npm, les
contraintes de version et d’installation, les exclusions Git et la génération
de configuration. Les senseurs répertoriés sont Oxlint, TypeScript, les tests
backend et frontend, le build, les gardes au démarrage, les contraintes SQLite,
les diagnostics VS Code et une auto-revue inférentielle observée.

Pour EF-32, la création avec message et le refus d’un doublon actif sont
assertés dans les tests backend. Le refus d’une offre non publiée n’est pas
couvert ; le test de retrait vérifie le statut HTTP mais pas le statut final.
Pour EF-33, un test backend vérifie la liste de l’étudiant connecté et le test
frontend couvre actuellement l’affichage des statuts « En cours » et « Non
retenue », pas les quatre statuts.

L’audit de couverture et les vérifications disponibles sont détaillés dans les
matrices. Les documents sources rapportent un test ciblé backend réussi (4
tests), un échec de `npm run check` au lint, ainsi que des résultats séparés de
typecheck, de tests complets et de build. Ces résultats sont rapportés depuis
les documents existants ; les commandes n’ont pas été relancées pour créer ces
livrables.

## Limites et suite

La matrice Web 2 reprend les statuts de l’audit déjà rédigé. Les références
précises aux supports ou notes Web 2 ne sont pas présentes dans le dépôt et
doivent être ajoutées pour confirmer ces correspondances conformément à
l’exercice. Aucun code ni test n’a été modifié ici. Les tests prioritaires
manquants sont listés dans la matrice de traçabilité.

La création et l’envoi de la pull request ainsi que la soumission de son lien
restent à effectuer par le groupe.

