<style>
  main {
    padding: 2rem 0;
    width: 60%;
    margin: 0 auto;
  }

  a {
    color: coral;
  }

  h2 {
    text-align: center;
    margin-top: 2rem;
  }
</style>

<svelte:head>
  <title>À propos de Livres ouverts</title>
</svelte:head>

<main>
  <h2 id="livres-ouverts-c-est-quoi-">Livres ouverts, c'est quoi ?</h2>
  <p>
    Livres ouverts est un
    <strong>moteur de recherche</strong>
    permettant de parcourir
    <strong>les budgets des différentes communes françaises</strong>
    .
  </p>
  <h2 id="-quoi-a-sert-">À quoi ça sert ?</h2>
  <p>
    Depuis plusieurs années, le gouvernement français a une politique promouvant
    l'ouverture des données publiques.
  </p>
  <p>
    Néanmoins, malgré la disponibilité de nombreuses données, notamment
    <a href="https://www.data.gouv.fr/fr/">sur le portail Data.gouv.fr</a>
    , la plupart sont brutes, obscures et difficiles d'accès, ce qui rend
    l'objectif gouvernemental de transparence quelque peu candide.
  </p>
  <p>
    Les données budgétaires des établissements publics ne font pas exception.
  </p>
  <p>
    Livres ouverts a pour ambition d'offrir une interface simple permettant
    d'accéder aux différents budgets des communes françaises.
  </p>
  <h2 id="qui-est-concern-">Qui est concerné.e ?</h2>
  <p>
    <strong>Tout le monde.</strong>
  </p>
  <p>
    Les budget des collectivités locales, financés par les impôts locaux de tout
    un chacun.e, permettent de financer les salaires des fonctionnaires locaux,
    de construires des écoles, des hôpitaux, de financer des projets d'intérêt
    public...
  </p>
  <p>Ils concernent donc tout le monde.</p>
  <p>
    <strong>
      Ce projet s'adresse plus particulièrement aux personnes dont l'expertise
      peut permettre une analyse pertinente de ce type de données: journalistes,
      économistes, ou autres.
    </strong>
  </p>
  <h2 id="qu-est-ce-que-vous-ne-trouverez-pas-ici-">
    Qu'est-ce que vous ne trouverez pas ici ?
  </h2>
  <p>
    Livres ouverts ne fournit
    <strong>aucune analyse</strong>
    des données qu'il présente.
  </p>
  <p>
    Son rôle n'est pas de critiquer ou d'encenser telle ou telle politique, mais
    de rendre disponible des données au plus grand nombre, afin que d'autres
    puissent s'en saisir et les analyser.
  </p>
  <p>
    De plus,
    <strong>aucune manipulation n'est effectuée sur les données</strong>
    . D'éventuelles simplifications de labels peuvent être effectuées dans
    l'interface dans un souci de concision, mais les fichiers CSVs que vous
    pouvez télécharger sont tels qu'ils sont fournis par le Ministère de
    l'Économie et des Finances.
  </p>
  <h2 id="d-o-viennent-les-donn-es-">D'où viennent les données ?</h2>
  <p>Ce projet utilise les données ouvertes:</p>
  <ul>
    <li>
      du
      <a
        href="https://data.economie.gouv.fr/explore/dataset/balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec0/table/">
        Ministère de l'Économie et des Finances
      </a>
    </li>
    <li>
      de
      <a
        href="https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&amp;version=V3&amp;provider=insee#!/Etablissement/findBySiret">
        la base SIREN
      </a>
    </li>
    <li>
      de
      <a href="https://geo.api.gouv.fr/decoupage-administratif/communes">
        la Base d'Adresse Nationale
      </a>
    </li>
  </ul>
  <h2 id="je-ne-trouve-pas-ma-commune-">Je ne trouve pas ma commune...</h2>
  <p>
    Les données actuellement utilisées sont celles définies comme &quot;
    <em>
      Balances comptables des collectivités et des établissements publics locaux
      avec la présentation croisée nature-fonction
    </em>
    &quot;.
  </p>
  <p>
    Il est probable que certaines communes n'aient pas fourni au Ministère leurs
    données budgétaires sous ce format.
  </p>
  <p>Celles-ci ne seront donc pas référencées ici.</p>
  <p>
    Néanmoins, il est prévu d'intégrer les données définies par le Ministère
    comme &quot;
    <em>Balances comptable des communes</em>
    &quot;, qui devraient rendre accessibles plus de communes.
  </p>
  <h2 id="j-en-veux-plus-">J'en veux plus !</h2>
  <p>
    Actuellement, Livres ouverts ne propose que la navigation par Siret et par
    année.
  </p>
  <p>
    Bien que présents dans les CSV à télécharger, aucun détail n'est accessible
    via l'interface.
  </p>
  <p>
    Dans une version future,
    <strong>
      il est prévu d'intégrer une navigation croisée nature/fonction
    </strong>
    , permettant d'explorer chaque budget plus en détail.
  </p>
  <p>
    De plus, il est envisagé d'intégrer les données d'autres types de
    collectivités locales: régions, départements, ...
  </p>
  <h2 id="-a-ne-marche-pas-">Ça ne marche pas 🤬!</h2>
  <p>
    Livres ouverts est
    <strong>en phase active de développement</strong>
    , et est certainement sujet à différents bugs. Ceux-ci seront corrigés au
    fur et à mesure.
  </p>
  <p>
    <strong>Si vous trouvez un bug, n'hésitez pas à le remonter.</strong>
  </p>
  <h2 id="comment-puis-je-aider-">Comment puis-je aider ?</h2>
  <p>
    Livres ouverts un projet
    <strong>open-source</strong>
    , auquel
    <a href="https://github.com/iOiurson/open-books">vous pouvez contribuer</a>
    .
  </p>
  <h2 id="qui-puis-je-contacter-">Qui puis-je contacter ?</h2>
  <p>
    Pour toute question, n'hésitez pas à contacter le mainteneur du projet
    <a href="https://twitter.com/r_ourson">sur Twitter</a>
    .
  </p>

</main>
