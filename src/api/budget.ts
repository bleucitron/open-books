import { get } from './utils/verbs';
import { makeBudgetCroiseEndpoint, makeModelEndpoint } from './utils/budget';

import type { Record, BudgetParams } from '../interfaces';

const recordsUrl = 'https://data.economie.gouv.fr';

export function getRecords(params: BudgetParams): Promise<Record[]> {
  const endpoint = makeBudgetCroiseEndpoint(params);

  return get(endpoint, {
    baseURL: recordsUrl,
  }).then(({ records }) => records.map(record => record.fields));
}

const modelUrl =
  'https://raw.githubusercontent.com/iOiurson/plans-de-compte/main/';

function extractFunctions(e: Element) {
  if (e.tagName !== 'RefFonc' && e.tagName !== 'RefFonctionnelles')
    throw `${e.tagName} Not a <RefFonc> or a <RefFonctionnelle>`;

  const data = [...e.children].map(element => {
    const code = element.getAttribute('Code');
    const label = element.getAttribute('Libelle');
    const short = element.getAttribute('Lib_court');

    return [
      code,
      { code, label, short, subFunctions: extractFunctions(element) },
    ];
  });

  return Object.fromEntries(data);
}

function makeFunctionTree(txt: string) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(txt, 'application/xml');

  const refFonc = doc.querySelector('RefFonctionnelles');

  if (!refFonc) throw 'No <RefFonctionnelles> found';

  return extractFunctions(refFonc);
}

export function getModel(year: number, code: string, population: number) {
  const endpoint = makeModelEndpoint(year, code, population);

  console.log('FILE NAME', endpoint);

  return get(endpoint, {
    baseURL: modelUrl,
  }).then(makeFunctionTree);
}
