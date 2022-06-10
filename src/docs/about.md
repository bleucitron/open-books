# Foire aux questions

## Livres ouverts, c'est quoi ?

[Livres ouverts](https://www.livres-ouverts.fr) est un **moteur de recherche open-source** permettant de parcourir **les budgets des différentes communes françaises**.

## C'est payant ?

**Non.**

Ce projet est porté avec une ambition citoyenne. Il ne sera jamais payant.

## Pourquoi ce projet ?

Depuis plusieurs années, le gouvernement français a une politique promouvant l'ouverture des données publiques.

Néanmoins, malgré la disponibilité de nombreuses données, notamment [sur le portail data.gouv.fr](https://www.data.gouv.fr/fr/), la plupart sont brutes, obscures et difficiles d'accès, ce qui dessert l'objectif de transparence de ces données.

Les données budgétaires des établissements publics ne font pas exception.

Livres ouverts a pour ambition d'**offrir une interface simple permettant à tout le monde d'accéder aux différents budgets des communes françaises**.

## Qui est concerné.e ?

**Tout le monde.**

Les budgets des collectivités locales sont financés par les impôts locaux de tout un chacun.e.
Ils permettent de payer les salaires des fonctionnaires locaux, de construire des écoles, des hôpitaux, de financer des projets d'intérêt public...

Ils concernent donc tout le monde, et chacun.e est invité.e à parcourir le budget de sa commune avec cet outil.

Toutefois, **ce projet s'adresse plus particulièrement aux personnes dont l'expertise peut permettre une analyse pertinente de ce type de données**: journalistes, économistes, ou autres.

## Qu'est-ce que vous ne trouverez pas ici ?

[Livres ouverts](https://www.livres-ouverts.fr) ne fournit **aucune analyse** des données budgétaires qu'il présente.

Son rôle n'est pas de critiquer ou d'encenser une politique budgétaire, mais de rendre disponible des données au plus grand nombre, afin que certain.e.s puissent s'en saisir et les analyser.

De plus, **aucune manipulation n'est effectuée sur les données**. D'éventuelles simplifications de labels peuvent être effectuées au niveau de l'interface dans un souci de concision, mais les fichiers CSV que vous pouvez télécharger sont tels qu'ils sont fournis par le Ministère de l'Économie et des Finances.

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

Actuellement, Livres ouverts ne propose que la navigation par Siret, par année, et par fonction. Mais des pistes sont déjà envisagées pour améliorer cet outil.

**Il est prévu d'élargir ce projet à d'autres institutions**: départements, régions, ministères, et autres institutions publiques.

Il sera également possible dans une future version de **comparer les budgets** entre eux.

Enfin, la navigation par fonction étant déjà disponible, la navigation par nature est envisagée, ainsi qu'un affichage plus détaillé de la donnée.

## Ça ne marche pas 🤬!

Livres ouverts est **en phase active de développement**, et est certainement sujet à différents bugs. De plus, la navigation sur mobile n'est pas encore adaptée.

Je fais mon possible pour améliorer cet outil en fonction de mon temps disponible.

**Si vous trouvez un bug, [n'hésitez pas à le remonter](https://twitter.com/r_ourson).**

## Comment puis-je aider ?

Livres ouverts un projet **open-source**, auquel tout le monde peut participer.

Vous pouvez bien sûr [faire des retours](https://twitter.com/r_ourson) sur l'outil, son usage, son design, son ergonomie.

Je suis plus précisément à la **recherche de connaissances métier sur la lecture d'un budget** de commune, afin d'affiner ma compréhension du sujet, et proposer des visulisations plus précises et plus détaillées.

Pour des contributions plus techniques, **vous pouvez participer [ici](https://github.com/iOiurson/open-books)**.

## Y a t'il des gens à remercier ?

Ce projet a été inspiré par **[David Bruant](https://twitter.com/DavidBruant)** et son travail sur [le budget du Département de la Gironde](https://www.gironde.fr/un-budget-au-service-des-solidarites-humaine-et-territoriale#!/explorer).

Je tiens également à remercier **les élèves de Master 2 Développement Web 2021-2022 de l'[ECV Digital](https://www.ecv.fr/digital/)**, qui ont apporté leur contribution à ce projet.

Et un merci à **vous** si vous avez pris le temps d'utiliser cet outil.

## Qui puis-je contacter ?

Pour toute question, **n'hésitez pas** à contacter le mainteneur du projet [sur Twitter](https://twitter.com/r_ourson).
