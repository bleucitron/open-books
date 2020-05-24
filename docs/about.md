## Livres ouverts, c'est quoi ?

Livres ouverts est un **moteur de recherche open-source** permettant de parcourir **les budgets des différentes communes françaises**.

## C'est payant ?

**Non.**

Ce projet est porté avec une ambition citoyenne. Il ne sera jamais payant.

## Pourquoi ce projet ?

Depuis plusieurs années, le gouvernement français a une politique promouvant l'ouverture des données publiques.

Néanmoins, malgré la disponibilité de nombreuses données, notamment [sur le portail Data.gouv.fr](https://www.data.gouv.fr/fr/), la plupart sont brutes, obscures et difficiles d'accès, ce qui dessert l'objectif de transparence de ces données.

Les données budgétaires des établissements publics ne font pas exception.

Livres ouverts a pour ambition d'**offrir une interface simple permettant à tout le monde d'accéder aux différents budgets des communes françaises**.

## Qui est concerné.e ?

**Tout le monde.**

Les budget des collectivités locales, financés par les impôts locaux de tout un chacun.e, permettent de financer les salaires des fonctionnaires locaux, de construires des écoles, des hôpitaux, de financer des projets d'intérêt public...

Ils concernent donc tout le monde.

**Ce projet s'adresse plus particulièrement aux personnes dont l'expertise peut permettre une analyse pertinente de ce type de données: journalistes, économistes, ou autres.**

## Qu'est-ce que vous ne trouverez pas ici ?

Livres ouverts ne fournit **aucune analyse** des données budgétaires qu'il présente.

Son rôle n'est pas de critiquer ou d'encenser une politique budgétaire, mais de rendre disponible des données au plus grand nombre, afin que d'autres puissent s'en saisir et les analyser.

De plus, **aucune manipulation n'est effectuée sur les données**. D'éventuelles simplifications de labels peuvent être effectuées au niveau de l'interface dans un souci de concision, mais les fichiers CSVs que vous pouvez télécharger sont tels qu'ils sont fournis par le Ministère de l'Économie et des Finances.

## D'où viennent les données ?

Ce projet utilise les données ouvertes:

- du [Ministère de l'Économie et des Finances](https://data.economie.gouv.fr/explore/dataset/balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec0/table/)
- de [la base SIREN](https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee#!/Etablissement/findBySiret)
- de [la Base d'Adresse Nationale](https://geo.api.gouv.fr/decoupage-administratif/communes)

## Pourquoi ma commune n'a pas de budget ?

Les données actuellement utilisées sont celles définies comme:

> [_Balances comptables des collectivités et des établissements publics locaux avec la présentation croisée nature-fonction_](https://data.economie.gouv.fr/explore/?sort=modified&q=balances+crois%C3%A9e)

Il est probable que certaines communes n'aient pas fourni au Ministère leurs données budgétaires sous ce format.

Celles-ci ne seront donc pas référencées ici.

D'autres données concernant les données des communes sont fournies par le Ministère de l'Économie et des Finances:

> [_Balances comptables des communes_](https://data.economie.gouv.fr/explore/?sort=modified&q=balances+communes)

**Il est prévu d'intégrer ces données** dans Livres ouverts, ce qui devrait rendre accessibles les données de plus de communes.

## C'est tout ?

Actuellement, Livres ouverts ne propose que la navigation par Siret et par année.

Bien que présents dans les CSV à télécharger, aucun détail n'est accessible via l'interface.

Dans une version future, **il est prévu d'intégrer une navigation croisée nature/fonction** similaire à [celle proposée par le Département de la Gironde pour son budget 2018](https://www.gironde.fr/un-budget-au-service-des-solidarites-humaine-et-territoriale#!/explorer).

Une telle navigation permettra d'explorer chaque budget plus en détail.

De plus, il est envisagé d'intégrer les données d'autres types de collectivités locales: régions, départements, ...

## Ça ne marche pas 🤬!

Livres ouverts est **en phase active de développement**, et est certainement sujet à différents bugs. Ceux-ci seront corrigés au fur et à mesure.

**Si vous trouvez un bug, n'hésitez pas à le remonter.**

## Comment puis-je aider ?

Livres ouverts un projet **open-source**, auquel [vous pouvez contribuer](https://github.com/iOiurson/open-books).

## Qui puis-je contacter ?

Pour toute question, **n'hésitez pas** à contacter le mainteneur du projet [sur Twitter](https://twitter.com/r_ourson).
