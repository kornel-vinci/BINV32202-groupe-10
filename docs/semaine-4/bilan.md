Fonctionnalité
Exercices de la semaine 4 (EF-32, EF-33 et début de EF-30) : audit des tests des candidatures et mise en place du TDD pour la recherche d'offres par titre.

Changements
Skills / config : ajout des skills test-gap-audit et test-driven-development, et mise à jour de .github/copilot-instructions.md.
Tests : ajout de tests frontend pour la soumission de candidature (EF-32) et ajout des tests TDD backend/frontend pour la recherche d'offres (EF-30).
Docs : ajout du tableau d'audit dans docs/semaine-4/dawid.md.
Non fait : implémentation de EF-30 (code backend/frontend), hook Tool Guardian, bilan docs/semaine-4.md et export des conversations.
Vérifications
npm run check passe sans erreur ni avertissement
Des tests couvrent le nouveau comportement et les cas d'erreur (400, 401, 403, 404…)
Les droits sont vérifiés par le backend, pas seulement masqués dans l'interface
backend/API.md et les fichiers backend/http/\*.http sont à jour
Une évolution du schéma passe par une nouvelle migration (002\_….sql…)
Testé dans le navigateur, avec les profils concernés
Travail avec l'agent
Conversation exportée dans docs/conversation-N.md
L'agent a bien suivi l'audit des tests et a bien écrit les tests TDD avant le code pour EF-30. On n'a pas eu le temps d'aller jusqu'à l'implémentation de EF-30 ni au hook.

Points d'attention pour la revue
Les tests de recherche (EF-30) échouent encore car seul le côté tests du TDD a été fait, pas l'implémentation. Le hook optionnel, le bilan complet et les conversations exportées n'ont pas été faits faute de temps.
