# Livres Ouverts

Il s'agit d'une application d'exploration de données concernant les budgets des communes françaises.

L'application est disponible à l'adresse suivante: [livres-ouverts.fr](https://livres-ouverts.fr).

Les données utilisées dans ce projet sont toutes publiées sous une licence permettant leur réutilisation :

- [budgets](https://data.economie.gouv.fr/explore/dataset/balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec0/table/)
- [SIRENE](https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee#!/Etablissement/findBySiret)
- [Géo](https://geo.api.gouv.fr/decoupage-administratif/communes)

Ce projet est basé sur:

- [Svelte](https://svelte.dev/)
- [SvelteKit](https://kit.svelte.dev/)

Vous pouvez avoir une idée des développements à venir [ici](./roadmap.md).

## Contributions

Ce projet est libre et ouvert aux contributions.  Vous pouvez les proposer en créant des /pull requests/.

## Usage

### Prérequis

Vous aurez besoin d'une clé d'API de l'API SIRENE, que vous pouvez demander [ici](https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee).

Une fois cette clé récupérée, copiez (ou renommez) le fichier `.env-sample` en `.env`, puis remplacez `xxx-xxx-xxx` par votre clé.

### Développement

```bash
npm install
npm run dev
```

Il est recommandé d'utiliser l'éditeur [VSCode](https://code.visualstudio.com/), ainsi que l'[extensions Svelte officielle](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

### Déploiement

Ce projet est déployé sur [Vercel](https://vercel.com/home). Il utilise actuellement la configuration `adapter-vercel` dans le fichier `svelte.config.js`.

Si vous souhaitez le déployer sur d'autres plateformes, il vous faudra changer d'adapteur. Plus d'infos sur [cette page](https://kit.svelte.dev/docs/adapters).

## Droits

Le code source de ce dépôt est publié sous [licence MIT](LICENSE.txt).
