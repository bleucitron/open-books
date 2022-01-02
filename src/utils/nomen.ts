import type { FonctionTree } from '@interfaces';
import { makeFonctionTree } from '@utils';

export const nomenByDecl = new Map();

export interface Nomen {
  norme: string;
  exer: string;
  declinaison: string;
  fiByChapitre: Map<string, string>;
  fiByCompte: Map<string, string>;
  tree: FonctionTree;
}

export function buildNomen(s: string): Nomen {
  const parser = new DOMParser();
  const doc = parser.parseFromString(s, 'application/xml');

  const fiByChapitre = new Map();

  const chapters = [...doc.querySelectorAll('Chapitre')];
  chapters.forEach(chapter => {
    const code = chapter.getAttribute('Code');
    const fi = chapter.getAttribute('Section');
    fiByChapitre.set(code, fi);
  });

  const books = [...doc.querySelectorAll('Compte')];
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
    const nodes = [...n.children] as Element[];
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
    nodes.forEach(n => {
      [...n.children].forEach(assignFI);
    });
  }

  books.forEach(assignFI);

  const n = doc.querySelector('Nomenclature');
  const tree = makeFonctionTree(s);
  return {
    norme: n.getAttribute('Norme'),
    exer: n.getAttribute('Exer'),
    declinaison: n.getAttribute('Declinaison'),
    fiByChapitre,
    fiByCompte,
    tree,
  };
}
