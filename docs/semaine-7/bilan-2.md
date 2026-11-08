Choix :
- Nouvelle candidature après retrait : autorisée (allow_reapply). Une candidature Retirée reste dans l’historique et permet de recandidater.
- Limite du message : 500 caractères maximum.
- Visibilité du message : étudiant propriétaire uniquement (student_only).
- Placement de l’interface : bouton/formulaire dans la liste des offres + page « Mes candidatures » (offers_and_page).
- Doublon actif : refuser une deuxième candidature lorsqu’une candidature En cours existe ; autoriser une nouvelle candidature après retrait (reject_active_allow_withdrawn).
- Réponse API pour un doublon : HTTP 409 avec le code APPLICATION_ALREADY_EXISTS (conflict_409).
- Comportement frontend en cas de candidature active : masquer ou désactiver le bouton « Candidater » (hide_disable).


Tout fonctionnait avec aucun probleme

J'ai du relancé l'IA a un moment donné pour le plan car il avait pas donné assez de précision avec les candidatures en double. Le plan a été faconné en 2 fois.


Ces validations fonctionnelles ont été vérifiées : 
— candidature à une offre publiée, avec et sans message ;
— présence de la candidature et de son statut après rechargement ;
— retrait d’une candidature encore en cours ;
— impossibilité de retirer une candidature déjà traitée ;
— séparation des candidatures de deux étudiants différents.


