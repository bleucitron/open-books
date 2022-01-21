import {
  S as e,
  i as s,
  s as n,
  k as t,
  e as r,
  O as o,
  d as a,
  n as i,
  c as u,
  a as p,
  b as c,
  f as l,
  N as d,
  a4 as m,
} from '../chunks/vendor-74fb33b7.js';
function f(e) {
  let s, n;
  return {
    c() {
      (s = t()), (n = r('main')), this.h();
    },
    l(e) {
      o('[data-svelte="svelte-1ef4m8e"]', document.head).forEach(a),
        (s = i(e)),
        (n = u(e, 'MAIN', { class: !0 })),
        p(n).forEach(a),
        this.h();
    },
    h() {
      (document.title = 'À propos de Livres ouverts'),
        c(n, 'class', 'md svelte-jtbs2k');
    },
    m(t, r) {
      l(t, s, r), l(t, n, r), (n.innerHTML = e[0]);
    },
    p: d,
    i: d,
    o: d,
    d(e) {
      e && a(s), e && a(n);
    },
  };
}
function h(e) {
  return [
    m(
      "<h2>Livres ouverts, c'est quoi ?</h2>\n<p>Livres ouverts est un <strong>moteur de recherche open-source</strong> permettant de parcourir <strong>les budgets des différentes communes françaises</strong>.</p>\n<h2>C'est payant ?</h2>\n<p><strong>Non.</strong></p>\n<p>Ce projet est porté avec une ambition citoyenne. Il ne sera jamais payant.</p>\n<h2>Pourquoi ce projet ?</h2>\n<p>Depuis plusieurs années, le gouvernement français a une politique promouvant l'ouverture des données publiques.</p>\n<p>Néanmoins, malgré la disponibilité de nombreuses données, notamment <a href=\"https://www.data.gouv.fr/fr/\">sur le portail Data.gouv.fr</a>, la plupart sont brutes, obscures et difficiles d'accès, ce qui dessert l'objectif de transparence de ces données.</p>\n<p>Les données budgétaires des établissements publics ne font pas exception.</p>\n<p>Livres ouverts a pour ambition d'<strong>offrir une interface simple permettant à tout le monde d'accéder aux différents budgets des communes françaises</strong>.</p>\n<h2>Qui est concerné.e ?</h2>\n<p><strong>Tout le monde.</strong></p>\n<p>Les budgets des collectivités locales sont financés par les impôts locaux de tout un chacun.e.\nIls permettent de payer les salaires des fonctionnaires locaux, de construire des écoles, des hôpitaux, de financer des projets d'intérêt public...</p>\n<p>Ils concernent donc tout le monde, et chacun.e est invité.e à parcourir le budget de sa commune avec cet outil.</p>\n<p>Toutefois, <strong>ce projet s'adresse plus particulièrement aux personnes dont l'expertise peut permettre une analyse pertinente de ce type de données</strong>: journalistes, économistes, ou autres.</p>\n<h2>Qu'est-ce que vous ne trouverez pas ici ?</h2>\n<p>Livres ouverts ne fournit <strong>aucune analyse</strong> des données budgétaires qu'il présente.</p>\n<p>Son rôle n'est pas de critiquer ou d'encenser une politique budgétaire, mais de rendre disponible des données au plus grand nombre, afin que certain.e.s puissent s'en saisir et les analyser.</p>\n<p>De plus, <strong>aucune manipulation n'est effectuée sur les données</strong>. D'éventuelles simplifications de labels peuvent être effectuées au niveau de l'interface dans un souci de concision, mais les fichiers CSV que vous pouvez télécharger sont tels qu'ils sont fournis par le Ministère de l'Économie et des Finances.</p>\n<h2>D'où viennent les données ?</h2>\n<p>Ce projet utilise les données ouvertes:</p>\n<ul>\n<li>du <a href=\"https://data.economie.gouv.fr/explore/dataset/balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec0/table/\">Ministère de l'Économie et des Finances</a></li>\n<li>de <a href=\"https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&amp;version=V3&amp;provider=insee#!/Etablissement/findBySiret\">la base SIREN</a></li>\n<li>de <a href=\"https://geo.api.gouv.fr/decoupage-administratif/communes\">la Base d'Adresse Nationale</a></li>\n</ul>\n<h2>Pourquoi ma commune n'a pas de budget ?</h2>\n<p>Les données actuellement utilisées sont celles définies comme:</p>\n<blockquote>\n<p><a href=\"https://data.economie.gouv.fr/explore/?sort=modified&amp;q=balances+crois%C3%A9e\"><em>Balances comptables des collectivités et des établissements publics locaux avec la présentation croisée nature-fonction</em></a></p>\n</blockquote>\n<p>Il est probable que certaines communes n'aient pas fourni au Ministère leurs données budgétaires sous ce format.</p>\n<p>Celles-ci ne seront donc pas référencées ici.</p>\n<p>D'autres données concernant les données des communes sont fournies par le Ministère de l'Économie et des Finances:</p>\n<blockquote>\n<p><a href=\"https://data.economie.gouv.fr/explore/?sort=modified&amp;q=balances+communes\"><em>Balances comptables des communes</em></a></p>\n</blockquote>\n<p><strong>Il est prévu d'intégrer ces données</strong> dans Livres ouverts, ce qui devrait rendre accessibles les données de plus de communes.</p>\n<h2>C'est tout ?</h2>\n<p>Actuellement, Livres ouverts ne propose que la navigation par Siret et par année.</p>\n<p>Bien que présents dans les fichiers CSV à télécharger, aucun détail n'est accessible via l'interface.</p>\n<p>Dans une version future, <strong>il est prévu d'intégrer une navigation croisée nature/fonction</strong> similaire à <a href=\"https://www.gironde.fr/un-budget-au-service-des-solidarites-humaine-et-territoriale#!/explorer\">celle proposée par le Département de la Gironde pour son budget 2018</a>.</p>\n<p>Une telle navigation permettra d'explorer chaque budget plus en détail.</p>\n<p>De plus, <strong>il est envisagé d'intégrer les données d'autres types de collectivités locales</strong>: régions, départements, ...</p>\n<h2>Ça ne marche pas 🤬!</h2>\n<p>Livres ouverts est <strong>en phase active de développement</strong>, et est certainement sujet à différents bugs. Ceux-ci seront corrigés au fur et à mesure.</p>\n<p><strong>Si vous trouvez un bug, <a href=\"https://twitter.com/r_ourson\">n'hésitez pas à le remonter</a>.</strong></p>\n<h2>Comment puis-je aider ?</h2>\n<p>Livres ouverts un projet <strong>open-source</strong>, auquel tout le monde peut contribuer.</p>\n<p>Vous pouvez contribuer <a href=\"https://github.com/iOiurson/open-books\">ici</a>, mais il est nécessaire d'être à l'aise avec <a href=\"https://github.com/\">Github</a>.</p>\n<h2>Qui puis-je contacter ?</h2>\n<p>Pour toute question, <strong>n'hésitez pas</strong> à contacter le mainteneur du projet <a href=\"https://twitter.com/r_ourson\">sur Twitter</a>.</p>\n",
    ),
  ];
}
class g extends e {
  constructor(e) {
    super(), s(this, e, h, f, n, {});
  }
}
export { g as default };
