import { DOMParser } from '@xmldom/xmldom';
import type { FonctionTree } from '@interfaces';
import { extractFonctions } from './budget';

const parser = new DOMParser();

export const nomenById = new Map<string, Nomen>();

export interface Nomen {
  id: string;
  norme: string;
  exer: string;
  declinaison: string;
  fiByChapitre: Map<string, string>;
  fiByCompte: Map<string, string>;
  tree: FonctionTree;
}

export function buildNomen(s: string): Nomen {
  const doc = parser.parseFromString(s, 'application/xml');

  const fiByChapitre = new Map();

  const chapters = Array.from(doc.getElementsByTagName('Chapitre'));
  chapters.forEach(chapter => {
    const code = chapter.getAttribute('Code');
    const fi = chapter.getAttribute('Section');
    fiByChapitre.set(code, fi);
  });

  const books = Array.from(doc.getElementsByTagName('Compte'));
  const fiByCompte = new Map();

  function findFI(e: Element): string {
    const code = e.getAttribute('Code');
    const fi = fiByChapitre.get(code);

    if (fi) return fi;
    if (e.parentNode.nodeName === 'Comptes') return undefined;

    return findFI(e.parentNode as Element);
  }

  function assignFI(n: Element): void {
    const code = n.getAttribute('Code');

    let fi = findFI(n);
    if (!fi) {
      const compte =
        n.getAttribute('DR') ||
        n.getAttribute('DOES') ||
        n.getAttribute('RR') ||
        n.getAttribute('ROES') ||
        n.getAttribute('ROIS');
      fi = fiByChapitre.get(compte);
    }
    fiByCompte.set(code, fi);

    const children = Array.from(n.childNodes).filter(
      n => n.nodeName === 'Compte',
    );
    children.forEach(n => {
      Array.from(n.childNodes)
        .filter(n => n.nodeName === 'Compte')
        .forEach(assignFI);
    });
  }

  books.forEach(assignFI);

  const refFonc = Array.from(doc.getElementsByTagName('RefFonctionnelles'))[0];
  const tree = extractFonctions(refFonc);

  const n = Array.from(doc.getElementsByTagName('Nomenclature'))[0];
  const norme = n.getAttribute('Norme');
  const exer = n.getAttribute('Exer');
  const declinaison = n.getAttribute('Declinaison');

  return {
    id: `${exer}_${declinaison}`,
    norme,
    exer,
    declinaison,
    fiByChapitre,
    fiByCompte,
    tree,
  };
}
