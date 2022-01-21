import {
  D as s,
  S as e,
  i as a,
  s as t,
  e as r,
  j as n,
  k as o,
  t as c,
  c as l,
  a as u,
  m as i,
  n as $,
  g as h,
  d as p,
  b as f,
  E as d,
  f as g,
  F as m,
  o as v,
  x as b,
  u as w,
  v as x,
  G as E,
  H as j,
  w as k,
  I as A,
  J as H,
  K as I,
  r as _,
} from '../chunks/vendor-74fb33b7.js';
import { I as D } from '../chunks/Icon-b25d6312.js';
const L = {
  subscribe: e =>
    (() => {
      const e = s('__svelte__');
      return {
        page: { subscribe: e.page.subscribe },
        navigating: { subscribe: e.navigating.subscribe },
        get preloading() {
          return (
            console.error(
              'stores.preloading is deprecated; use stores.navigating instead',
            ),
            { subscribe: e.navigating.subscribe }
          );
        },
        session: e.session,
      };
    })().page.subscribe(e),
};
function y(s) {
  let e, a, t, E, j, k, A, H, I, _, L, y, G, V, F, N, W, J;
  return (
    (E = new D({ props: { id: 'book-open' } })),
    (W = new D({ props: { id: 'github' } })),
    {
      c() {
        (e = r('header')),
          (a = r('a')),
          (t = r('div')),
          n(E.$$.fragment),
          (j = o()),
          (k = r('h1')),
          (A = c('Livres ouverts')),
          (H = o()),
          (I = r('h2')),
          (_ = c('Les données budgétaires des communes')),
          (L = o()),
          (y = r('nav')),
          (G = r('a')),
          (V = c('À propos')),
          (F = o()),
          (N = r('a')),
          n(W.$$.fragment),
          this.h();
      },
      l(s) {
        e = l(s, 'HEADER', { class: !0 });
        var r = u(e);
        a = l(r, 'A', { href: !0, class: !0 });
        var n = u(a);
        t = l(n, 'DIV', { class: !0 });
        var o = u(t);
        i(E.$$.fragment, o), (j = $(o)), (k = l(o, 'H1', { class: !0 }));
        var c = u(k);
        (A = h(c, 'Livres ouverts')),
          c.forEach(p),
          (H = $(o)),
          (I = l(o, 'H2', { class: !0 }));
        var f = u(I);
        (_ = h(f, 'Les données budgétaires des communes')),
          f.forEach(p),
          o.forEach(p),
          n.forEach(p),
          (L = $(r)),
          (y = l(r, 'NAV', { class: !0 }));
        var d = u(y);
        G = l(d, 'A', { href: !0, class: !0 });
        var g = u(G);
        (V = h(g, 'À propos')),
          g.forEach(p),
          (F = $(d)),
          (N = l(d, 'A', { href: !0, class: !0 }));
        var m = u(N);
        i(W.$$.fragment, m), m.forEach(p), d.forEach(p), r.forEach(p), this.h();
      },
      h() {
        f(k, 'class', 'svelte-xdj4w6'),
          f(I, 'class', 'svelte-xdj4w6'),
          f(t, 'class', 'svelte-xdj4w6'),
          f(a, 'href', '/'),
          f(a, 'class', 'home svelte-xdj4w6'),
          d(a, 'current', 'home' === s[0]),
          f(G, 'href', '/about'),
          f(G, 'class', 'svelte-xdj4w6'),
          d(G, 'current', 'about' === s[0]),
          f(N, 'href', 'https://github.com/iOiurson/open-books'),
          f(N, 'class', 'svelte-xdj4w6'),
          f(y, 'class', 'Nav svelte-xdj4w6'),
          f(e, 'class', 'svelte-xdj4w6');
      },
      m(s, r) {
        g(s, e, r),
          m(e, a),
          m(a, t),
          v(E, t, null),
          m(t, j),
          m(t, k),
          m(k, A),
          m(t, H),
          m(t, I),
          m(I, _),
          m(e, L),
          m(e, y),
          m(y, G),
          m(G, V),
          m(y, F),
          m(y, N),
          v(W, N, null),
          (J = !0);
      },
      p(s, [e]) {
        1 & e && d(a, 'current', 'home' === s[0]),
          1 & e && d(G, 'current', 'about' === s[0]);
      },
      i(s) {
        J || (b(E.$$.fragment, s), b(W.$$.fragment, s), (J = !0));
      },
      o(s) {
        w(E.$$.fragment, s), w(W.$$.fragment, s), (J = !1);
      },
      d(s) {
        s && p(e), x(E), x(W);
      },
    }
  );
}
function G(s, e, a) {
  let { path: t } = e;
  return (
    (s.$$set = s => {
      'path' in s && a(0, (t = s.path));
    }),
    [t]
  );
}
class V extends e {
  constructor(s) {
    super(), a(this, s, G, y, t, { path: 0 });
  }
}
function F(s, e, a) {
  let t;
  return (
    E(s, L, s => a(0, (t = s))),
    (s.$$.update = () => {
      1 & s.$$.dirty &&
        'undefined' != typeof gtag &&
        gtag('config', 'G-ZPGFWYWMHX', { page_path: t.path });
    }),
    [t]
  );
}
class N extends e {
  constructor(s) {
    super(), a(this, s, F, null, t, {});
  }
}
function W(s) {
  let e, a;
  return (
    (e = new V({ props: { path: s[0] || 'home' } })),
    {
      c() {
        n(e.$$.fragment);
      },
      l(s) {
        i(e.$$.fragment, s);
      },
      m(s, t) {
        v(e, s, t), (a = !0);
      },
      p(s, a) {
        const t = {};
        1 & a && (t.path = s[0] || 'home'), e.$set(t);
      },
      i(s) {
        a || (b(e.$$.fragment, s), (a = !0));
      },
      o(s) {
        w(e.$$.fragment, s), (a = !1);
      },
      d(s) {
        x(e, s);
      },
    }
  );
}
function J(s) {
  let e, a, t, c, h;
  e = new N({});
  let d = 'budgets' !== s[0] && W(s);
  const E = s[3].default,
    D = j(E, s, s[2], null);
  return {
    c() {
      n(e.$$.fragment),
        (a = o()),
        (t = r('div')),
        d && d.c(),
        (c = o()),
        D && D.c(),
        this.h();
    },
    l(s) {
      i(e.$$.fragment, s), (a = $(s)), (t = l(s, 'DIV', { class: !0 }));
      var r = u(t);
      d && d.l(r), (c = $(r)), D && D.l(r), r.forEach(p), this.h();
    },
    h() {
      f(t, 'class', 'page svelte-1hseanh');
    },
    m(s, r) {
      v(e, s, r),
        g(s, a, r),
        g(s, t, r),
        d && d.m(t, null),
        m(t, c),
        D && D.m(t, null),
        (h = !0);
    },
    p(s, [e]) {
      'budgets' !== s[0]
        ? d
          ? (d.p(s, e), 1 & e && b(d, 1))
          : ((d = W(s)), d.c(), b(d, 1), d.m(t, c))
        : d &&
          (_(),
          w(d, 1, 1, () => {
            d = null;
          }),
          k()),
        D &&
          D.p &&
          (!h || 4 & e) &&
          A(D, E, s, s[2], h ? I(E, s[2], e, null) : H(s[2]), null);
    },
    i(s) {
      h || (b(e.$$.fragment, s), b(d), b(D, s), (h = !0));
    },
    o(s) {
      w(e.$$.fragment, s), w(d), w(D, s), (h = !1);
    },
    d(s) {
      x(e, s), s && p(a), s && p(t), d && d.d(), D && D.d(s);
    },
  };
}
function K(s, e, a) {
  let t, r;
  E(s, L, s => a(1, (r = s)));
  let { $$slots: n = {}, $$scope: o } = e;
  return (
    (s.$$set = s => {
      '$$scope' in s && a(2, (o = s.$$scope));
    }),
    (s.$$.update = () => {
      2 & s.$$.dirty && a(0, (t = r.path.split('/')[1]));
    }),
    [t, r, o, n]
  );
}
class M extends e {
  constructor(s) {
    super(), a(this, s, K, J, t, {});
  }
}
export { M as default };
