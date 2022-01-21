import {
  S as s,
  i as e,
  s as a,
  e as t,
  t as c,
  k as r,
  c as o,
  a as l,
  g as n,
  d,
  n as h,
  O as u,
  b as i,
  f,
  F as m,
  h as p,
  N as v,
} from '../chunks/vendor-74fb33b7.js';
function $(s) {
  let e, a, $, g, w, E, b, q, k, x;
  return (
    (document.title = g = s[1]),
    {
      c() {
        (e = t('h1')),
          (a = c(s[2])),
          ($ = r()),
          (w = r()),
          (E = t('h1')),
          (b = c(s[1])),
          (q = r()),
          (k = t('p')),
          (x = c(s[0])),
          this.h();
      },
      l(t) {
        e = o(t, 'H1', { class: !0 });
        var c = l(e);
        (a = n(c, s[2])), c.forEach(d), ($ = h(t));
        u('[data-svelte="svelte-fpw6lw"]', document.head).forEach(d),
          (w = h(t)),
          (E = o(t, 'H1', { class: !0 }));
        var r = l(E);
        (b = n(r, s[1])),
          r.forEach(d),
          (q = h(t)),
          (k = o(t, 'P', { class: !0 }));
        var i = l(k);
        (x = n(i, s[0])), i.forEach(d), this.h();
      },
      h() {
        i(e, 'class', 'svelte-q8ws67'),
          i(E, 'class', 'svelte-q8ws67'),
          i(k, 'class', 'svelte-q8ws67');
      },
      m(s, t) {
        f(s, e, t),
          m(e, a),
          f(s, $, t),
          f(s, w, t),
          f(s, E, t),
          m(E, b),
          f(s, q, t),
          f(s, k, t),
          m(k, x);
      },
      p(s, [e]) {
        4 & e && p(a, s[2]),
          2 & e && g !== (g = s[1]) && (document.title = g),
          2 & e && p(b, s[1]),
          1 & e && p(x, s[0]);
      },
      i: v,
      o: v,
      d(s) {
        s && d(e), s && d($), s && d(w), s && d(E), s && d(q), s && d(k);
      },
    }
  );
}
function g({ error: s, status: e }) {
  return { props: { code: e, message: s.message } };
}
function w(s, e, a) {
  let t,
    { message: c } = e,
    { code: r } = e;
  return (
    (s.$$set = s => {
      'message' in s && a(0, (c = s.message)),
        'code' in s && a(1, (r = s.code));
    }),
    (s.$$.update = () => {
      3 & s.$$.dirty && a(2, (t = `${r}: ${c}`));
    }),
    [c, r, t]
  );
}
class E extends s {
  constructor(s) {
    super(), e(this, s, w, $, a, { message: 0, code: 1 });
  }
}
export { E as default, g as load };
