# **Semaine 8 — Harnais agentique : guider et vérifier**

## **Objectif de la séance**

Un harnais agentique combine deux familles de mécanismes : les **guides** , qui orientent l’agent avant et pendant son travail ( _feedforward_ ), et les **senseurs** , qui lui donnent un retour sur le résultat produit ( _feedback_ ). Vous allez examiner les deux dans votre projet : vérifier ce que les tests contrôlent, puis évaluer si les guides reflètent les consignes et conventions vues en développement Web 2.

À la fin de la séance, vous devez pouvoir distinguer une instruction d’un contrôle, étayer vos constats en consultant les fichiers et les résultats, et signaler les limites de votre analyse.

## **Déroulement**

### **1. Repérer les guides et les senseurs**

Avec GitHub Copilot, explorez le dépôt et repérez les guides et senseurs présents. Un guide donne à l’agent des consignes en amont ; un senseur observe le code ou son comportement et produit un retour.

Classez les mécanismes dans cette matrice :

|                                                       | **Guide — feedforward** | **Senseur — feedback**         |
| ----------------------------------------------------- | ----------------------- | ------------------------------ |
| **Inférentiel** (interprété par<br>une IA)            | Ex. `AGENTS.md`         | Ex. revue de code par une IA   |
| **Computationnel** (règles ou<br>calculs exécutables) | Ex. générateur de code  | Ex. tests, compilation, linter |

Pour chaque mécanisme réellement présent :

— indiquez son nom et le fichier ou l’outil correspondant ;

1

- résumez ce qu’il demande, impose ou vérifie ;

- donnez un exemple concret de règle ou de résultat ;

- précisez s’il a été exécuté et vérifié pendant la séance, ou s’il est seulement décrit ou configuré.

Ne remplissez pas artificiellement les quatre cases. Vous pouvez utiliser Copilot pour trouver et résumer les éléments, mais ouvrez les fichiers et vérifiez ses affirmations.

### **2. Première partie — Examiner les senseurs : couverture des tests**

Le projet contient déjà des tests. Leur réussite ne prouve pas qu’ils couvrent toutes les exigences. Construisez une matrice de traçabilité entre les exigences travaillées la séance précédente et les tests qui les vérifient réellement.

### **Partir des exigences**

Relisez le cahier des charges, en particulier **EF-32** (candidater et retirer sa candidature) et **EF-33** (consulter ses candidatures et leur statut). Découpez-les en cas précis, avec le résultat attendu : cas normaux, refus et limites. Par exemple, une offre non publiée ne doit pas accepter de candidature et un étudiant ne doit pas voir les candidatures d’un autre.

### **Relier les tests aux cas**

Explorez les tests existants, notamment les tests d’API s’il y en a. Pour chaque cas, relevez le fichier, le nom du test et les assertions qui vérifient le résultat attendu.

| Exigence | Cas à vérifier                    | Test existant<br>(fichier et nom) | Assertions utiles | Couverture                    |
| -------- | --------------------------------- | --------------------------------- | ----------------- | ----------------------------- |
| EF-32    | Refuser une<br>candidature à<br>f | …                                 | …                 | Couvert /<br>Partiel / Absent |
|          | une offre non<br>publiée          |                                   |                   |                               |
| EF-33    | Un étudiant ne                    | …                                 | …                 | Couvert /                     |
|          | voit que ses<br>candidatures      |                                   |                   | Partiel / Absent              |

Un cas est **couvert** seulement si les assertions portent effectivement sur son résultat attendu. Un test qui appelle une route et reçoit une réponse ne suffit pas nécessairement. Notez aussi les comportements testés qui ne correspondent pas à EF-32 ou EF-33, sans les rattacher à une exigence au hasard.

2

### **Traiter les manques**

Repérez les cas absents ou partiellement couverts. Choisissez les manques les plus importants et ajoutez ou améliorez des tests avec les outils déjà utilisés dans le projet. Privilégiez les vérifications possibles au niveau de l’API et du backend. Il n’est pas demandé de créer des tests end-to-end ni de refaire toute la suite. Si un cas ne peut pas être vérifié avec les tests disponibles, signalez cette limite et indiquez comment vous l’avez vérifié manuellement, le cas échéant.

Lancez `npm run check` après vos modifications et relevez le résultat de chaque contrôle. Pour un test ajouté, expliquez quel défaut le ferait échouer ; vérifiez ce point seulement si vous pouvez le faire sans risque pour le projet.

### **3. Deuxième partie — Auditer les guides à la lumière de Web 2**

Les guides influencent le travail de l’agent avant qu’un test ou un autre senseur ne donne son retour. Examinez les consignes réellement fournies à l’agent dans le dépôt (par exemple `AGENTS.md` , les instructions de Copilot ou les guides du projet) et comparez-les aux consignes et conventions de développement web enseignées en **Web 2** .

1. Repérez les guides applicables à votre projet et lisez-les en entier.

2. À partir de vos supports, notes ou consignes de Web 2, relevez les attentes pertinentes : architecture, organisation du code, conventions, validation des entrées, sécurité, accessibilité ou autres sujets effectivement abordés.

3. Comparez chaque attente avec les guides : est-elle couverte, couverte en partie, absente, ou en contradiction avec une consigne ? Appuyez chaque constat sur un passage du guide et une source de Web 2.

4. Rédigez un court rapport indiquant ce qui correspond, ce qui ne correspond pas ou manque, et ce qu’il serait utile d’ajouter ou de préciser dans les guides.

Ne déduisez pas qu’une pratique était demandée en Web 2 si vous ne pouvez pas retrouver la consigne ou le support correspondant. Vous pouvez demander à Copilot de repérer des passages, mais vérifiez vous-mêmes les sources et les consignes proposées.

| Attente ou<br>convention de Web 2 | Guide examiné<br>i   |                       | Écart ou ajout |
| --------------------------------- | -------------------- | --------------------- | -------------- |
| (source)                          | (fichier et passage) | Correspondance        | proposé        |
| …                                 | …                    | Oui / Partielle / Non | …              |
|                                   |                      | / Contradiction       |                |

Le rapport est un audit : formulez des recommandations justifiées. Ne modifiez les guides que si le travail demandé par votre enseignant consiste aussi à les corriger.

3

### **4. Optionnel — Imaginer un senseur d’architecture**

Demandez-vous si votre projet aurait besoin d’un senseur qui vérifie son architecture. Choisissez un problème architectural concret et récurrent dans votre projet, puis proposez une façon de le détecter.

Précisez :

- quelle règle d’architecture serait vérifiée et pourquoi ;

- à quel moment le senseur fonctionnerait (test, commande de vérification, CI, revue assistée, etc.) ;

- — quelles données il examinerait et quel résultat il produirait ;

- un exemple de violation qui devrait déclencher un retour ;

- les faux positifs, limites et coûts possibles.

Il n’est pas nécessaire d’implémenter ce senseur. Une proposition concrète et vérifiable suffit.

Si vous ne faites pas cette extension, finalisez le rapport et préparez une courte restitution de vos constats.

## **Livrable : bilan du harnais**

Dans le dossier **`docs/`** du dépôt, ajoutez **`semaine-3.md`** , avec :

- **Inventaire** : la matrice guides/senseurs, avec les emplacements, rôles, exemples et vérifications effectuées.

- **Couverture des exigences** : la matrice des cas EF-32 et EF-33, les tests correspondants et les manques identifiés.

- **Modifications et vérification** : les tests ajoutés ou améliorés, les commandes lancées

- et leurs résultats, ainsi que les vérifications manuelles et limites.

- — **Audit des guides** : les attentes de Web 2 utilisées comme références, les correspondances, les écarts et les ajouts proposés.

- **Optionnel — senseur d’architecture** : la règle envisagée, son mode de fonctionnement et ses limites, si vous avez fait cette activité.

Décrivez ce que vous avez réellement vérifié. Un trou de couverture bien identifié vaut mieux qu’un test déclaré couvrant sans preuve. Remettez le bilan et les éventuelles modifications des tests dans votre dépôt Git, avec les commits poussés sur GitHub.

Harness Engineering — Martin Fowler

4
