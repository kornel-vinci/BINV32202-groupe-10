Petit scénario E2E — Candidature étudiant
L’étudiant se connecte avec une connexion de démonstration.
Il ouvre la liste des offres publiées.
Il clique sur « Candidater » pour une offre.
Il saisit éventuellement un message de maximum 500 caractères, puis valide.
La candidature est créée avec le statut « En cours ».
Si une candidature active existe déjà pour cette offre, le bouton est désactivé et l’API refuse la nouvelle tentative avec une erreur 409.
L’étudiant ouvre « Mes candidatures » et consulte l’offre, son message et son statut.
Tant que la candidature est « En cours », il peut cliquer sur « Retirer ».
La candidature passe alors à « Retirée » et reste visible dans l’historique.
Il peut ensuite recandidater à la même offre ; une nouvelle candidature est créée.
Les statuts affichés sont : En cours, Retenue, Non retenue et Retirée.