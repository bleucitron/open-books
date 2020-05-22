## Livres ouverts, c'est quoi ?

Livres ouverts est un **moteur de recherche** permettant de parcourir **les budgets des différentes communes françaises**.

## À quoi ça sert ?

Depuis plusieurs années, le gouvernement français a une politique promouvant l'ouverture des données publiques.

Néanmoins, malgré la disponibilité de nombreuses données, notamment [sur le portail Data.gouv.fr](https://www.data.gouv.fr/fr/), la plupart sont brutes, obscures et difficiles d'accès, ce qui rend l'objectif gouvernemental de transparence quelque peu candide.

Les données budgétaires des établissements publics ne font pas exception.

Livres ouverts a pour ambition d'offrir une interface simple permettant d'accéder aux différents budgets des communes françaises.

## Qui est concerné.e ?

**Tout le monde.**

Les budget des collectivités locales, financés par les impôts locaux de tout un chacun.e, permettent de financer les salaires des fonctionnaires locaux, de construires des écoles, des hôpitaux, de financer des projets d'intérêt public...

Ils concernent donc tout le monde.

**Ce projet s'adresse plus particulièrement aux personnes dont l'expertise peut permettre une analyse pertinente de ce type de données: journalistes, économistes, ou autres.**

## Qu'est-ce que vous ne trouverez pas ici ?

Livres ouverts ne fournit **aucune analyse** des données qu'il présente.

Son rôle n'est pas de critiquer ou d'encenser telle ou telle politique, mais de rendre disponible des données au plus grand nombre, afin que d'autres puissent s'en saisir et les analyser.

De plus, **aucune manipulation n'est effectuée sur les données**. D'éventuelles simplifications de labels peuvent être effectuées dans l'interface dans un souci de concision, mais les fichiers CSVs que vous pouvez télécharger sont tels qu'ils sont fournis par le Ministère de l'Économie et des Finances.

## D'où viennent les données ?

Ce projet utilise les données ouvertes:

- du [Ministère de l'Économie et des Finances](https://data.economie.gouv.fr/explore/dataset/balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec0/table/)
- de [la base SIREN](https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee#!/Etablissement/findBySiret)
- de [la Base d'Adresse Nationale](https://geo.api.gouv.fr/decoupage-administratif/communes)

## Je ne trouve pas ma commune...

Les données actuellement utilisées sont celles définies comme "_Balances comptables des collectivités et des établissements publics locaux avec la présentation croisée nature-fonction_".

Il est probable que certaines communes n'aient pas fourni au Ministère leurs données budgétaires sous ce format.

Celles-ci ne seront donc pas référencées ici.

Néanmoins, il est prévu d'intégrer les données définies par le Ministère comme "_Balances comptable des communes_", qui devraient rendre accessibles plus de communes.

## J'en veux plus !

Actuellement, Livres ouverts ne propose que la navigation par Siret et par année.

Bien que présents dans les CSV à télécharger, aucun détail n'est accessible via l'interface.

Dans une version future, **il est prévu d'intégrer une navigation croisée nature/fonction**, permettant d'explorer chaque budget plus en détail.

De plus, il est envisagé d'intégrer les données d'autres types de collectivités locales: régions, départements, ...

## Ça ne marche pas 🤬!

Livres ouverts est **en phase active de développement**, et est certainement sujet à différents bugs. Ceux-ci seront corrigés au fur et à mesure.

**Si vous trouvez un bug, n'hésitez pas à le remonter.**

## Comment puis-je aider ?

Livres ouverts un projet **open-source**, auquel [vous pouvez contribuer](https://github.com/iOiurson/open-books).

## Qui puis-je contacter ?

Pour toute question, n'hésitez pas à contacter le mainteneur du projet [sur Twitter](https://twitter.com/r_ourson).
