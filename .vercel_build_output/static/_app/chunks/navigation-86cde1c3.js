var e = Object.defineProperty,
  t = Object.defineProperties,
  n = Object.getOwnPropertyDescriptors,
  r = Object.getOwnPropertySymbols,
  o = Object.prototype.hasOwnProperty,
  s = Object.prototype.propertyIsEnumerable,
  i = (t, n, r) =>
    n in t
      ? e(t, n, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[n] = r),
  c = (e, t) => {
    for (var n in t || (t = {})) o.call(t, n) && i(e, n, t[n]);
    if (r) for (var n of r(t)) s.call(t, n) && i(e, n, t[n]);
    return e;
  };
import { C as a, Z as u } from './vendor-74fb33b7.js';
import { r as l } from './singletons-12a22614.js';
var f = a();
function E(e, t) {
  return fetch(e, t).then(e => {
    if (!e.ok) throw new Error(e.statusText);
    return e.url.endsWith('.xml') ? e.text() : e.json();
  });
}
const b = ['code', 'nom', 'departement', 'region', 'population'];
const p = 'https://geo.api.gouv.fr';
async function O(e) {
  const t = (function (e) {
    if (!e) throw 'No text provided';
    return `communes?${[
      `nom="${e}"`,
      `fields=${b.join(',')}`,
      'boost=population',
    ].join('&')}`;
  })(e);
  return await E(`${p}/${t}&limit=5`);
}
function m(e) {
  const t = (function (e) {
    if (!e) throw 'No code provided';
    return `communes/${e}?fields=${b.join(',')}`;
  })(e);
  return E(`${p}/${t}`);
}
function d(e, t) {
  if (!e) throw Error('Missing siret');
  if (null == t) throw Error('Missing year');
  return `${e}_${t}`;
}
function B({ name: e, insee: t, siret: n, sirens: r, year: o }) {
  if (!(e && t && n && r && r.length && null != o))
    throw Error('Missing parameter');
  return `/budgets?name=${e}&insee=${t}&siret=${n}&sirens=${r.join(
    ',',
  )}&year=${o}`;
}
function g(e) {
  return e.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function C(e) {
  return new Intl.NumberFormat('fr', {
    style: 'currency',
    notation: 'compact',
    currency: 'EUR',
  }).format(e);
}
function h(e) {
  return e.substring(0, 9);
}
const N = ['-', ' de'];
function w(e, t) {
  return e.reduce((e, n) => e + n[t], 0);
}
function R(e) {
  return e.split('').map((e, t, n) => (t > 0 ? n[t - 1] + e : e));
}
const { json2csvAsync: T } = u,
  y = [
    'EXER',
    'IDENT',
    'NDEPT',
    'LBUDG',
    'INSEE',
    'CBUDG',
    'CTYPE',
    'CSTYP',
    'NOMEN',
    'SIREN',
    'CREGI',
    'CACTI',
    'SECTEUR',
    'FINESS',
    'CODBUD1',
    'CATEG',
    'BAL',
    'FONCTION',
    'COMPTE',
    'BEDEB',
    'BECRE',
    'OBNETDEB',
    'OBNETCRE',
    'ONBDEB',
    'ONBCRE',
    'OOBDEB',
    'OOBCRE',
    'SD',
    'SC',
  ].map(e => e.toLowerCase());
async function D(e) {
  const { city: t, label: n, records: r } = e,
    o = [...new Set(r.map(e => e.exer))],
    s = 1 === o.length ? o[0] : null,
    i = [...new Set(r.map(e => e.ident))],
    c = 1 === i.length ? i[0] : null;
  let a = `budget_${t.toLowerCase()}`;
  n && (a += `_${n.split(' ').join('_')}`),
    c && (a += `_${c}`),
    s && (a += `_${s}`),
    (a += '.csv');
  const u = await T(r, { keys: y }),
    l = new Blob([u], { type: 'text/csv' });
  return { file: a, url: URL.createObjectURL(l) };
}
function $(e) {
  const { city: t, siret: n, year: r, records: o } = e,
    s = d(n, r),
    i = o.length;
  if (0 === i) return null;
  const c = h(n),
    a = (function (e) {
      return e.substring(9);
    })(n),
    u = w(o, I.OBNETDEB),
    l = w(o, I.OBNETCRE),
    f = [...new Set(o.map(e => e.lbudg.toLowerCase()))],
    E = [...new Set(o.map(e => e.nomen))];
  f.length > 1 && console.log('More than 1 label for', n, r),
    E.length > 1 && console.log('More than 1 nomen for', n, r);
  const b =
    f.length > 0
      ? (function (e, t) {
          const n = g(e),
            r = g(t.toLowerCase());
          if (n === r) return 'commune';
          let o = e.replace(r, '').trim().toLowerCase();
          return (
            N.forEach(e => {
              o = o.replace(new RegExp(`${e}$`), '');
            }),
            o
          );
        })(f[0], t)
      : '';
  return {
    id: s,
    siret: n,
    siren: c,
    etabl: a,
    city: t,
    year: r,
    nomen: E.length > 0 ? E[0] : '',
    length: i,
    obnetdeb: u,
    obnetcre: l,
    label: b,
    records: o,
  };
}
function j(e) {
  return [...new Set(e.map(({ ident: e }) => e))]
    .map(t => {
      const n = e.filter(({ ident: e }) => e === t);
      return { siret: t, records: n };
    })
    .sort((e, t) => parseInt(e.siret) - parseInt(t.siret));
}
function v(e) {
  if ('RefFonc' !== e.tagName && 'RefFonctionnelles' !== e.tagName)
    throw `${e.tagName} Not a <RefFonc> or a <RefFonctionnelle>`;
  const t = [...e.children].map(e => {
    const t = e.getAttribute('Code'),
      n = e.getAttribute('Libelle'),
      r = e.getAttribute('Lib_court'),
      o = { code: t, label: n };
    return (
      n !== r && (o.short = r),
      e.children.length > 0 && (o.subTree = v(e)),
      [t, o]
    );
  });
  return 0 === t.length ? null : Object.fromEntries(t);
}
function S(e) {
  const t = new DOMParser()
    .parseFromString(e, 'application/xml')
    .querySelector('RefFonctionnelles');
  if (!t) throw 'No <RefFonctionnelles> found';
  return v(t);
}
var I, _, F, L;
((_ = I || (I = {})).OBNETDEB = 'obnetdeb'),
  (_.OBNETCRE = 'obnetcre'),
  (_.OOBDEB = 'oobdeb'),
  (_.OOBCRE = 'oobcre'),
  ((L = F || (F = {})).DEBIT = 'obnetdeb'),
  (L.CREDIT = 'obnetcre');
const M = { [F.DEBIT]: 'Dépenses', [F.CREDIT]: 'Recettes' };
function P(e, t) {
  return e in t ? t[e] : P(e, t[e[0]].subTree);
}
function x(e, r) {
  const o = Object.values(r).map(r => {
    const { code: o, subTree: s } = r;
    let i, a, u, l;
    const f = c({}, r),
      E = e.filter(e => {
        var t;
        return null == (t = e.fonction) ? void 0 : t.startsWith(o);
      });
    if (s) {
      const e = x(E, s),
        t = Object.values(e).map(e => e.value);
      (i = w(t, I.OBNETDEB)),
        (a = w(t, I.OBNETCRE)),
        (u = w(t, I.OOBDEB)),
        (l = w(t, I.OOBCRE)),
        (f.subTree = e);
    } else
      (i = w(E, I.OBNETDEB)),
        (a = w(E, I.OBNETCRE)),
        (u = w(E, I.OOBDEB)),
        (l = w(E, I.OOBCRE));
    return [
      o,
      ((b = c({}, f)),
      (p = { value: { obnetdeb: i, obnetcre: a, oobdeb: u, oobcre: l } }),
      t(b, n(p))),
    ];
    var b, p;
  });
  return Object.fromEntries(o);
}
function U(e, t) {
  let n = '';
  if (!e) throw Error('No code provided');
  return (
    (n =
      !t || t >= 3500
        ? '_COM_SUP3500'
        : t < 500
        ? '_COM_INF500'
        : '_COM_500_3500'),
    e + n
  );
}
const A = l,
  G = async function (e, t) {
    return A.goto(e, t, []);
  };
export {
  F as B,
  G as a,
  E as b,
  f as c,
  $ as d,
  d as e,
  P as f,
  O as g,
  D as h,
  C as i,
  x as j,
  R as k,
  S as l,
  U as m,
  g as n,
  j as o,
  B as p,
  h as q,
  m as r,
  w as s,
  M as t,
};
