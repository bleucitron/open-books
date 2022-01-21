import {
  S as e,
  i as t,
  s as n,
  e as s,
  t as a,
  k as c,
  c as r,
  a as l,
  g as o,
  d as i,
  n as u,
  b as f,
  E as h,
  f as m,
  F as $,
  P as d,
  h as v,
  Q as g,
  R as p,
  N as k,
  T as b,
  U as w,
  V as E,
  j as y,
  m as x,
  o as I,
  x as P,
  u as D,
  v as V,
  l as j,
  W as A,
  X as N,
  Y as S,
  r as U,
  w as L,
  O as M,
} from '../../chunks/vendor-74fb33b7.js';
import { c as T, g as _, a as z } from '../../chunks/navigation-86cde1c3.js';
import { I as C } from '../../chunks/Icon-b25d6312.js';
import '../../chunks/singletons-12a22614.js';
function F(e, t, n) {
  const s = e.slice();
  return (
    (s[9] = t[n].nom),
    (s[10] = t[n].code),
    (s[11] = t[n].departement),
    (s[13] = n),
    s
  );
}
function O(e) {
  let t,
    n,
    c = `${e[11].code} - ${e[11].nom}`;
  return {
    c() {
      (t = s('div')), (n = a(c)), this.h();
    },
    l(e) {
      t = r(e, 'DIV', { class: !0 });
      var s = l(t);
      (n = o(s, c)), s.forEach(i), this.h();
    },
    h() {
      f(t, 'class', 'other svelte-1vrm6ve');
    },
    m(e, s) {
      m(e, t, s), $(t, n);
    },
    p(e, t) {
      1 & t && c !== (c = `${e[11].code} - ${e[11].nom}`) && v(n, c);
    },
    d(e) {
      e && i(t);
    },
  };
}
function Q(e, t) {
  let n,
    p,
    k,
    b,
    w,
    E,
    y,
    x,
    I,
    P,
    D = t[9] + '',
    V = t[11] && O(t);
  function j() {
    return t[5](t[13]);
  }
  return {
    key: e,
    first: null,
    c() {
      (n = s('li')),
        (p = s('a')),
        (k = s('div')),
        (b = s('div')),
        (w = a(D)),
        (E = c()),
        V && V.c(),
        (x = c()),
        this.h();
    },
    l(e) {
      n = r(e, 'LI', { class: !0 });
      var t = l(n);
      p = r(t, 'A', { href: !0, 'sveltekit:prefetch': !0, class: !0 });
      var s = l(p);
      k = r(s, 'DIV', { class: !0 });
      var a = l(k);
      b = r(a, 'DIV', { class: !0 });
      var c = l(b);
      (w = o(c, D)),
        c.forEach(i),
        (E = u(a)),
        V && V.l(a),
        a.forEach(i),
        s.forEach(i),
        (x = u(t)),
        t.forEach(i),
        this.h();
    },
    h() {
      f(b, 'class', 'name'),
        f(k, 'class', 'infos svelte-1vrm6ve'),
        f(p, 'href', (y = `/budgets?name=${t[9]}&insee=${t[10]}`)),
        f(p, 'sveltekit:prefetch', ''),
        f(p, 'class', 'svelte-1vrm6ve'),
        h(p, 'active', t[1] === t[13]),
        f(n, 'class', 'Suggestion svelte-1vrm6ve'),
        (this.first = n);
    },
    m(e, s) {
      m(e, n, s),
        $(n, p),
        $(p, k),
        $(k, b),
        $(b, w),
        $(k, E),
        V && V.m(k, null),
        $(n, x),
        I ||
          ((P = [
            d(p, 'click', t[3]),
            d(p, 'keypress', t[4]),
            d(p, 'mouseenter', j),
            d(p, 'mouseleave', t[6]),
          ]),
          (I = !0));
    },
    p(e, n) {
      (t = e),
        1 & n && D !== (D = t[9] + '') && v(w, D),
        t[11]
          ? V
            ? V.p(t, n)
            : ((V = O(t)), V.c(), V.m(k, null))
          : V && (V.d(1), (V = null)),
        1 & n &&
          y !== (y = `/budgets?name=${t[9]}&insee=${t[10]}`) &&
          f(p, 'href', y),
        3 & n && h(p, 'active', t[1] === t[13]);
    },
    d(e) {
      e && i(n), V && V.d(), (I = !1), g(P);
    },
  };
}
function R(e) {
  let t,
    n,
    a,
    c = [],
    o = new Map(),
    u = e[0];
  const h = e => e[13];
  for (let s = 0; s < u.length; s += 1) {
    let t = F(e, u, s),
      n = h(t);
    o.set(n, (c[s] = Q(n, t)));
  }
  return {
    c() {
      t = s('ul');
      for (let e = 0; e < c.length; e += 1) c[e].c();
      this.h();
    },
    l(e) {
      t = r(e, 'UL', { class: !0 });
      var n = l(t);
      for (let t = 0; t < c.length; t += 1) c[t].l(n);
      n.forEach(i), this.h();
    },
    h() {
      f(t, 'class', 'svelte-1vrm6ve');
    },
    m(s, r) {
      m(s, t, r);
      for (let e = 0; e < c.length; e += 1) c[e].m(t, null);
      n || ((a = d(window, 'keyup', e[2])), (n = !0));
    },
    p(e, [n]) {
      3 & n && ((u = e[0]), (c = p(c, n, h, 1, e, u, o, t, w, Q, null, F)));
    },
    i: k,
    o: k,
    d(e) {
      e && i(t);
      for (let t = 0; t < c.length; t += 1) c[t].d();
      (n = !1), a();
    },
  };
}
function W(e, t, n) {
  let s,
    a,
    { suggestions: c = [] } = t;
  const r = b();
  return (
    (e.$$set = e => {
      'suggestions' in e && n(0, (c = e.suggestions));
    }),
    (e.$$.update = () => {
      1 & e.$$.dirty && (s = c.length - 1);
    }),
    [
      c,
      a,
      function (e) {
        switch (e.key) {
          case 'ArrowUp':
            n(1, 0 === a || void 0 === a ? (a = s) : (a -= 1));
            break;
          case 'ArrowDown':
            n(1, a === s || void 0 === a ? (a = 0) : (a += 1));
            break;
          case 'Enter': {
            const e = c[a];
            r('enterPress', { city: e });
            break;
          }
        }
        return a;
      },
      function (t) {
        E.call(this, e, t);
      },
      function (t) {
        E.call(this, e, t);
      },
      e => n(1, (a = e)),
      () => n(1, (a = 0)),
    ]
  );
}
class X extends e {
  constructor(e) {
    super(), t(this, e, W, R, n, { suggestions: 0 });
  }
}
function Y(e) {
  let t, n, a, c, o;
  return (
    (n = new C({ props: { id: 'x' } })),
    {
      c() {
        (t = s('span')), y(n.$$.fragment), this.h();
      },
      l(e) {
        t = r(e, 'SPAN', { class: !0 });
        var s = l(t);
        x(n.$$.fragment, s), s.forEach(i), this.h();
      },
      h() {
        f(t, 'class', 'reset svelte-9r2f5t');
      },
      m(s, r) {
        m(s, t, r),
          I(n, t, null),
          (a = !0),
          c || ((o = d(t, 'click', e[4])), (c = !0));
      },
      p: k,
      i(e) {
        a || (P(n.$$.fragment, e), (a = !0));
      },
      o(e) {
        D(n.$$.fragment, e), (a = !1);
      },
      d(e) {
        e && i(t), V(n), (c = !1), o();
      },
    }
  );
}
function q(e) {
  let t,
    n,
    s,
    a = {
      ctx: e,
      current: null,
      token: null,
      hasCatch: !1,
      pending: H,
      then: G,
      catch: B,
      value: 10,
      blocks: [, , ,],
    };
  return (
    A((n = e[0]), a),
    {
      c() {
        (t = j()), a.block.c();
      },
      l(e) {
        (t = j()), a.block.l(e);
      },
      m(e, n) {
        m(e, t, n),
          a.block.m(e, (a.anchor = n)),
          (a.mount = () => t.parentNode),
          (a.anchor = t),
          (s = !0);
      },
      p(t, s) {
        (e = t),
          (a.ctx = e),
          (1 & s && n !== (n = e[0]) && A(n, a)) || N(a, e, s);
      },
      i(e) {
        s || (P(a.block), (s = !0));
      },
      o(e) {
        for (let t = 0; t < 3; t += 1) {
          const e = a.blocks[t];
          D(e);
        }
        s = !1;
      },
      d(e) {
        e && i(t), a.block.d(e), (a.token = null), (a = null);
      },
    }
  );
}
function B(e) {
  return { c: k, l: k, m: k, p: k, i: k, o: k, d: k };
}
function G(e) {
  let t, n;
  return (
    (t = new X({ props: { suggestions: e[10] } })),
    t.$on('enterPress', e[3]),
    t.$on('click', e[3]),
    {
      c() {
        y(t.$$.fragment);
      },
      l(e) {
        x(t.$$.fragment, e);
      },
      m(e, s) {
        I(t, e, s), (n = !0);
      },
      p(e, n) {
        const s = {};
        1 & n && (s.suggestions = e[10]), t.$set(s);
      },
      i(e) {
        n || (P(t.$$.fragment, e), (n = !0));
      },
      o(e) {
        D(t.$$.fragment, e), (n = !1);
      },
      d(e) {
        V(t, e);
      },
    }
  );
}
function H(e) {
  let t, n;
  return (
    (t = new X({ props: { suggestions: e[2] } })),
    t.$on('enterPress', e[3]),
    t.$on('click', e[3]),
    {
      c() {
        y(t.$$.fragment);
      },
      l(e) {
        x(t.$$.fragment, e);
      },
      m(e, s) {
        I(t, e, s), (n = !0);
      },
      p: k,
      i(e) {
        n || (P(t.$$.fragment, e), (n = !0));
      },
      o(e) {
        D(t.$$.fragment, e), (n = !1);
      },
      d(e) {
        V(t, e);
      },
    }
  );
}
function J(e) {
  let t, n, a, o, h, v, p, k, b, w;
  a = new C({ props: { id: 'search' } });
  let E = e[1] && Y(e),
    j = e[0] && q(e);
  return {
    c() {
      (t = s('div')),
        (n = s('div')),
        y(a.$$.fragment),
        (o = c()),
        (h = s('input')),
        (v = c()),
        E && E.c(),
        (p = c()),
        j && j.c(),
        this.h();
    },
    l(e) {
      t = r(e, 'DIV', { class: !0 });
      var s = l(t);
      n = r(s, 'DIV', { class: !0 });
      var c = l(n);
      x(a.$$.fragment, c),
        (o = u(c)),
        (h = r(c, 'INPUT', { placeholder: !0, class: !0 })),
        (v = u(c)),
        E && E.l(c),
        c.forEach(i),
        (p = u(s)),
        j && j.l(s),
        s.forEach(i),
        this.h();
    },
    h() {
      f(h, 'placeholder', "Entrez le nom d'une commune"),
        f(h, 'class', 'svelte-9r2f5t'),
        f(n, 'class', 'searchbar svelte-9r2f5t'),
        f(t, 'class', 'Search svelte-9r2f5t');
    },
    m(s, c) {
      m(s, t, c),
        $(t, n),
        I(a, n, null),
        $(n, o),
        $(n, h),
        S(h, e[1]),
        $(n, v),
        E && E.m(n, null),
        $(t, p),
        j && j.m(t, null),
        (k = !0),
        b || ((w = [d(h, 'input', e[6]), d(h, 'input', e[5])]), (b = !0));
    },
    p(e, [s]) {
      2 & s && h.value !== e[1] && S(h, e[1]),
        e[1]
          ? E
            ? (E.p(e, s), 2 & s && P(E, 1))
            : ((E = Y(e)), E.c(), P(E, 1), E.m(n, null))
          : E &&
            (U(),
            D(E, 1, 1, () => {
              E = null;
            }),
            L()),
        e[0]
          ? j
            ? (j.p(e, s), 1 & s && P(j, 1))
            : ((j = q(e)), j.c(), P(j, 1), j.m(t, null))
          : j &&
            (U(),
            D(j, 1, 1, () => {
              j = null;
            }),
            L());
    },
    i(e) {
      k || (P(a.$$.fragment, e), P(E), P(j), (k = !0));
    },
    o(e) {
      D(a.$$.fragment, e), D(E), D(j), (k = !1);
    },
    d(e) {
      e && i(t), V(a), E && E.d(), j && j.d(), (b = !1), g(w);
    },
  };
}
function K(e, t, n) {
  var s =
    (this && this.__awaiter) ||
    function (e, t, n, s) {
      return new (n || (n = Promise))(function (a, c) {
        function r(e) {
          try {
            o(s.next(e));
          } catch (t) {
            c(t);
          }
        }
        function l(e) {
          try {
            o(s.throw(e));
          } catch (t) {
            c(t);
          }
        }
        function o(e) {
          var t;
          e.done
            ? a(e.value)
            : ((t = e.value),
              t instanceof n
                ? t
                : new n(function (e) {
                    e(t);
                  })).then(r, l);
        }
        o((s = s.apply(e, t || [])).next());
      });
    };
  const a = b();
  let c,
    r = null,
    l = '';
  return [
    r,
    l,
    undefined,
    function (e) {
      a('select', { city: e.detail.city || T });
    },
    function () {
      n(1, (l = '')), n(0, (r = null));
    },
    function (e) {
      return s(this, void 0, void 0, function* () {
        const t = e.target.value;
        n(0, (r = _(t)));
      });
    },
    function () {
      (l = this.value), n(1, l), n(9, c);
    },
  ];
}
class Z extends e {
  constructor(e) {
    super(), t(this, e, K, J, n, {});
  }
}
function ee(e) {
  let t, n, a, o;
  return (
    (a = new Z({})),
    a.$on('select', e[0]),
    {
      c() {
        (t = c()), (n = s('main')), y(a.$$.fragment), this.h();
      },
      l(e) {
        M('[data-svelte="svelte-12hdit8"]', document.head).forEach(i),
          (t = u(e)),
          (n = r(e, 'MAIN', { class: !0 }));
        var s = l(n);
        x(a.$$.fragment, s), s.forEach(i), this.h();
      },
      h() {
        (document.title = 'Livres ouverts'), f(n, 'class', 'svelte-14ev131');
      },
      m(e, s) {
        m(e, t, s), m(e, n, s), I(a, n, null), (o = !0);
      },
      p: k,
      i(e) {
        o || (P(a.$$.fragment, e), (o = !0));
      },
      o(e) {
        D(a.$$.fragment, e), (o = !1);
      },
      d(e) {
        e && i(t), e && i(n), V(a);
      },
    }
  );
}
function te(e) {
  return [
    function (e) {
      const { nom: t, code: n } = e.detail.city;
      z(`/budgets?name=${t}&insee=${n}`);
    },
  ];
}
class ne extends e {
  constructor(e) {
    super(), t(this, e, te, ee, n, {});
  }
}
export { ne as default };
