var e = Object.defineProperty,
  t = Object.getOwnPropertySymbols,
  n = Object.prototype.hasOwnProperty,
  r = Object.prototype.propertyIsEnumerable,
  i = (t, n, r) =>
    n in t
      ? e(t, n, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[n] = r),
  s = (e, s) => {
    for (var l in s || (s = {})) n.call(s, l) && i(e, l, s[l]);
    if (t) for (var l of t(s)) r.call(s, l) && i(e, l, s[l]);
    return e;
  };
function l() {}
function o(e, t) {
  for (const n in t) e[n] = t[n];
  return e;
}
function a(e) {
  return e();
}
function c() {
  return Object.create(null);
}
function u(e) {
  e.forEach(a);
}
function h(e) {
  return 'function' == typeof e;
}
function p(e, t) {
  return e != e
    ? t == t
    : e !== t || (e && 'object' == typeof e) || 'function' == typeof e;
}
function d(e, ...t) {
  if (null == e) return l;
  const n = e.subscribe(...t);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function f(e, t, n) {
  e.$$.on_destroy.push(d(t, n));
}
function g(e, t, n, r) {
  if (e) {
    const i = m(e, t, n, r);
    return e[0](i);
  }
}
function m(e, t, n, r) {
  return e[1] && r ? o(n.ctx.slice(), e[1](r(t))) : n.ctx;
}
function k(e, t, n, r) {
  if (e[2] && r) {
    const i = e[2](r(n));
    if (void 0 === t.dirty) return i;
    if ('object' == typeof i) {
      const e = [],
        n = Math.max(t.dirty.length, i.length);
      for (let r = 0; r < n; r += 1) e[r] = t.dirty[r] | i[r];
      return e;
    }
    return t.dirty | i;
  }
  return t.dirty;
}
function x(e, t, n, r, i, s) {
  if (i) {
    const l = m(t, n, r, s);
    e.p(l, i);
  }
}
function b(e) {
  if (e.ctx.length > 32) {
    const t = [],
      n = e.ctx.length / 32;
    for (let e = 0; e < n; e++) t[e] = -1;
    return t;
  }
  return -1;
}
let w,
  y = !1;
function _(e, t, n, r) {
  for (; e < t; ) {
    const i = e + ((t - e) >> 1);
    n(i) <= r ? (e = i + 1) : (t = i);
  }
  return e;
}
function v(e, t) {
  if (y) {
    for (
      !(function (e) {
        if (e.hydrate_init) return;
        e.hydrate_init = !0;
        let t = e.childNodes;
        if ('HEAD' === e.nodeName) {
          const e = [];
          for (let n = 0; n < t.length; n++) {
            const r = t[n];
            void 0 !== r.claim_order && e.push(r);
          }
          t = e;
        }
        const n = new Int32Array(t.length + 1),
          r = new Int32Array(t.length);
        n[0] = -1;
        let i = 0;
        for (let a = 0; a < t.length; a++) {
          const e = t[a].claim_order,
            s =
              (i > 0 && t[n[i]].claim_order <= e
                ? i + 1
                : _(1, i, e => t[n[e]].claim_order, e)) - 1;
          r[a] = n[s] + 1;
          const l = s + 1;
          (n[l] = a), (i = Math.max(l, i));
        }
        const s = [],
          l = [];
        let o = t.length - 1;
        for (let a = n[i] + 1; 0 != a; a = r[a - 1]) {
          for (s.push(t[a - 1]); o >= a; o--) l.push(t[o]);
          o--;
        }
        for (; o >= 0; o--) l.push(t[o]);
        s.reverse(), l.sort((e, t) => e.claim_order - t.claim_order);
        for (let a = 0, c = 0; a < l.length; a++) {
          for (; c < s.length && l[a].claim_order >= s[c].claim_order; ) c++;
          const t = c < s.length ? s[c] : null;
          e.insertBefore(l[a], t);
        }
      })(e),
        (void 0 === e.actual_end_child ||
          (null !== e.actual_end_child &&
            e.actual_end_child.parentElement !== e)) &&
          (e.actual_end_child = e.firstChild);
      null !== e.actual_end_child && void 0 === e.actual_end_child.claim_order;

    )
      e.actual_end_child = e.actual_end_child.nextSibling;
    t !== e.actual_end_child
      ? (void 0 === t.claim_order && t.parentNode === e) ||
        e.insertBefore(t, e.actual_end_child)
      : (e.actual_end_child = t.nextSibling);
  } else (t.parentNode === e && null === t.nextSibling) || e.appendChild(t);
}
function $(e, t, n) {
  y && !n
    ? v(e, t)
    : (t.parentNode === e && t.nextSibling == n) ||
      e.insertBefore(t, n || null);
}
function S(e) {
  e.parentNode.removeChild(e);
}
function z(e, t) {
  for (let n = 0; n < e.length; n += 1) e[n] && e[n].d(t);
}
function A(e) {
  return document.createElement(e);
}
function j(e) {
  return document.createElementNS('http://www.w3.org/2000/svg', e);
}
function E(e) {
  return document.createTextNode(e);
}
function I() {
  return E(' ');
}
function O() {
  return E('');
}
function T(e, t, n, r) {
  return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
function D(e, t, n) {
  null == n
    ? e.removeAttribute(t)
    : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function R(e) {
  return Array.from(e.childNodes);
}
function M(e, t, n, r, i = !1) {
  !(function (e) {
    void 0 === e.claim_info &&
      (e.claim_info = { last_index: 0, total_claimed: 0 });
  })(e);
  const s = (() => {
    for (let r = e.claim_info.last_index; r < e.length; r++) {
      const s = e[r];
      if (t(s)) {
        const t = n(s);
        return (
          void 0 === t ? e.splice(r, 1) : (e[r] = t),
          i || (e.claim_info.last_index = r),
          s
        );
      }
    }
    for (let r = e.claim_info.last_index - 1; r >= 0; r--) {
      const s = e[r];
      if (t(s)) {
        const t = n(s);
        return (
          void 0 === t ? e.splice(r, 1) : (e[r] = t),
          i
            ? void 0 === t && e.claim_info.last_index--
            : (e.claim_info.last_index = r),
          s
        );
      }
    }
    return r();
  })();
  return (
    (s.claim_order = e.claim_info.total_claimed),
    (e.claim_info.total_claimed += 1),
    s
  );
}
function C(e, t, n, r) {
  return M(
    e,
    e => e.nodeName === t,
    e => {
      const t = [];
      for (let r = 0; r < e.attributes.length; r++) {
        const i = e.attributes[r];
        n[i.name] || t.push(i.name);
      }
      t.forEach(t => e.removeAttribute(t));
    },
    () => r(t),
  );
}
function F(e, t, n) {
  return C(e, t, n, A);
}
function P(e, t, n) {
  return C(e, t, n, j);
}
function N(e, t) {
  return M(
    e,
    e => 3 === e.nodeType,
    e => {
      const n = '' + t;
      if (e.data.startsWith(n)) {
        if (e.data.length !== n.length) return e.splitText(n.length);
      } else e.data = n;
    },
    () => E(t),
    !0,
  );
}
function q(e) {
  return N(e, ' ');
}
function L(e, t) {
  (t = '' + t), e.wholeText !== t && (e.data = t);
}
function V(e, t) {
  e.value = null == t ? '' : t;
}
function B(e, t, n, r) {
  e.style.setProperty(t, n, r ? 'important' : '');
}
function Z(e, t, n) {
  e.classList[n ? 'add' : 'remove'](t);
}
function W(e, t = document.body) {
  return Array.from(t.querySelectorAll(e));
}
function U(e) {
  w = e;
}
function Q() {
  if (!w) throw new Error('Function called outside component initialization');
  return w;
}
function H(e) {
  Q().$$.on_mount.push(e);
}
function J(e) {
  Q().$$.after_update.push(e);
}
function K() {
  const e = Q();
  return (t, n) => {
    const r = e.$$.callbacks[t];
    if (r) {
      const i = (function (e, t, n = !1) {
        const r = document.createEvent('CustomEvent');
        return r.initCustomEvent(e, n, !1, t), r;
      })(t, n);
      r.slice().forEach(t => {
        t.call(e, i);
      });
    }
  };
}
function X(e, t) {
  Q().$$.context.set(e, t);
}
function G(e) {
  return Q().$$.context.get(e);
}
function Y(e, t) {
  const n = e.$$.callbacks[t.type];
  n && n.slice().forEach(e => e.call(this, t));
}
const ee = [],
  te = [],
  ne = [],
  re = [],
  ie = Promise.resolve();
let se = !1;
function le(e) {
  ne.push(e);
}
let oe = !1;
const ae = new Set();
function ce() {
  if (!oe) {
    oe = !0;
    do {
      for (let e = 0; e < ee.length; e += 1) {
        const t = ee[e];
        U(t), ue(t.$$);
      }
      for (U(null), ee.length = 0; te.length; ) te.pop()();
      for (let e = 0; e < ne.length; e += 1) {
        const t = ne[e];
        ae.has(t) || (ae.add(t), t());
      }
      ne.length = 0;
    } while (ee.length);
    for (; re.length; ) re.pop()();
    (se = !1), (oe = !1), ae.clear();
  }
}
function ue(e) {
  if (null !== e.fragment) {
    e.update(), u(e.before_update);
    const t = e.dirty;
    (e.dirty = [-1]),
      e.fragment && e.fragment.p(e.ctx, t),
      e.after_update.forEach(le);
  }
}
const he = new Set();
let pe;
function de() {
  pe = { r: 0, c: [], p: pe };
}
function fe() {
  pe.r || u(pe.c), (pe = pe.p);
}
function ge(e, t) {
  e && e.i && (he.delete(e), e.i(t));
}
function me(e, t, n, r) {
  if (e && e.o) {
    if (he.has(e)) return;
    he.add(e),
      pe.c.push(() => {
        he.delete(e), r && (n && e.d(1), r());
      }),
      e.o(t);
  }
}
function ke(e, t) {
  const n = (t.token = {});
  function r(e, r, i, s) {
    if (t.token !== n) return;
    t.resolved = s;
    let l = t.ctx;
    void 0 !== i && ((l = l.slice()), (l[i] = s));
    const o = e && (t.current = e)(l);
    let a = !1;
    t.block &&
      (t.blocks
        ? t.blocks.forEach((e, n) => {
            n !== r &&
              e &&
              (de(),
              me(e, 1, 1, () => {
                t.blocks[n] === e && (t.blocks[n] = null);
              }),
              fe());
          })
        : t.block.d(1),
      o.c(),
      ge(o, 1),
      o.m(t.mount(), t.anchor),
      (a = !0)),
      (t.block = o),
      t.blocks && (t.blocks[r] = o),
      a && ce();
  }
  if ((i = e) && 'object' == typeof i && 'function' == typeof i.then) {
    const n = Q();
    if (
      (e.then(
        e => {
          U(n), r(t.then, 1, t.value, e), U(null);
        },
        e => {
          if ((U(n), r(t.catch, 2, t.error, e), U(null), !t.hasCatch)) throw e;
        },
      ),
      t.current !== t.pending)
    )
      return r(t.pending, 0), !0;
  } else {
    if (t.current !== t.then) return r(t.then, 1, t.value, e), !0;
    t.resolved = e;
  }
  var i;
}
function xe(e, t, n) {
  const r = t.slice(),
    { resolved: i } = e;
  e.current === e.then && (r[e.value] = i),
    e.current === e.catch && (r[e.error] = i),
    e.block.p(r, n);
}
function be(e, t) {
  e.d(1), t.delete(e.key);
}
function we(e, t, n, r, i, s, l, o, a, c, u, h) {
  let p = e.length,
    d = s.length,
    f = p;
  const g = {};
  for (; f--; ) g[e[f].key] = f;
  const m = [],
    k = new Map(),
    x = new Map();
  for (f = d; f--; ) {
    const e = h(i, s, f),
      o = n(e);
    let a = l.get(o);
    a ? r && a.p(e, t) : ((a = c(o, e)), a.c()),
      k.set(o, (m[f] = a)),
      o in g && x.set(o, Math.abs(f - g[o]));
  }
  const b = new Set(),
    w = new Set();
  function y(e) {
    ge(e, 1), e.m(o, u), l.set(e.key, e), (u = e.first), d--;
  }
  for (; p && d; ) {
    const t = m[d - 1],
      n = e[p - 1],
      r = t.key,
      i = n.key;
    t === n
      ? ((u = t.first), p--, d--)
      : k.has(i)
      ? !l.has(r) || b.has(r)
        ? y(t)
        : w.has(i)
        ? p--
        : x.get(r) > x.get(i)
        ? (w.add(r), y(t))
        : (b.add(i), p--)
      : (a(n, l), p--);
  }
  for (; p--; ) {
    const t = e[p];
    k.has(t.key) || a(t, l);
  }
  for (; d; ) y(m[d - 1]);
  return m;
}
function ye(e, t) {
  const n = {},
    r = {},
    i = { $$scope: 1 };
  let s = e.length;
  for (; s--; ) {
    const l = e[s],
      o = t[s];
    if (o) {
      for (const e in l) e in o || (r[e] = 1);
      for (const e in o) i[e] || ((n[e] = o[e]), (i[e] = 1));
      e[s] = o;
    } else for (const e in l) i[e] = 1;
  }
  for (const l in r) l in n || (n[l] = void 0);
  return n;
}
function _e(e) {
  return 'object' == typeof e && null !== e ? e : {};
}
function ve(e) {
  e && e.c();
}
function $e(e, t) {
  e && e.l(t);
}
function Se(e, t, n, r) {
  const { fragment: i, on_mount: s, on_destroy: l, after_update: o } = e.$$;
  i && i.m(t, n),
    r ||
      le(() => {
        const t = s.map(a).filter(h);
        l ? l.push(...t) : u(t), (e.$$.on_mount = []);
      }),
    o.forEach(le);
}
function ze(e, t) {
  const n = e.$$;
  null !== n.fragment &&
    (u(n.on_destroy),
    n.fragment && n.fragment.d(t),
    (n.on_destroy = n.fragment = null),
    (n.ctx = []));
}
function Ae(e, t) {
  -1 === e.$$.dirty[0] &&
    (ee.push(e), se || ((se = !0), ie.then(ce)), e.$$.dirty.fill(0)),
    (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
}
function je(e, t, n, r, i, s, o, a = [-1]) {
  const h = w;
  U(e);
  const p = (e.$$ = {
    fragment: null,
    ctx: null,
    props: s,
    update: l,
    not_equal: i,
    bound: c(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (h ? h.$$.context : [])),
    callbacks: c(),
    dirty: a,
    skip_bound: !1,
    root: t.target || h.$$.root,
  });
  o && o(p.root);
  let d = !1;
  if (
    ((p.ctx = n
      ? n(e, t.props || {}, (t, n, ...r) => {
          const s = r.length ? r[0] : n;
          return (
            p.ctx &&
              i(p.ctx[t], (p.ctx[t] = s)) &&
              (!p.skip_bound && p.bound[t] && p.bound[t](s), d && Ae(e, t)),
            n
          );
        })
      : []),
    p.update(),
    (d = !0),
    u(p.before_update),
    (p.fragment = !!r && r(p.ctx)),
    t.target)
  ) {
    if (t.hydrate) {
      y = !0;
      const e = R(t.target);
      p.fragment && p.fragment.l(e), e.forEach(S);
    } else p.fragment && p.fragment.c();
    t.intro && ge(e.$$.fragment),
      Se(e, t.target, t.anchor, t.customElement),
      (y = !1),
      ce();
  }
  U(h);
}
class Ee {
  $destroy() {
    ze(this, 1), (this.$destroy = l);
  }
  $on(e, t) {
    const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return (
      n.push(t),
      () => {
        const e = n.indexOf(t);
        -1 !== e && n.splice(e, 1);
      }
    );
  }
  $set(e) {
    var t;
    this.$$set &&
      ((t = e), 0 !== Object.keys(t).length) &&
      ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
  }
}
const Ie = [];
function Oe(e, t = l) {
  let n;
  const r = new Set();
  function i(t) {
    if (p(e, t) && ((e = t), n)) {
      const t = !Ie.length;
      for (const n of r) n[1](), Ie.push(n, e);
      if (t) {
        for (let e = 0; e < Ie.length; e += 2) Ie[e][0](Ie[e + 1]);
        Ie.length = 0;
      }
    }
  }
  return {
    set: i,
    update: function (t) {
      i(t(e));
    },
    subscribe: function (s, o = l) {
      const a = [s, o];
      return (
        r.add(a),
        1 === r.size && (n = t(i) || l),
        s(e),
        () => {
          r.delete(a), 0 === r.size && (n(), (n = null));
        }
      );
    },
  };
}
function Te(e, t, n) {
  const r = !Array.isArray(e),
    i = r ? [e] : e,
    s = t.length < 2;
  return {
    subscribe: Oe(n, e => {
      let n = !1;
      const o = [];
      let a = 0,
        c = l;
      const p = () => {
          if (a) return;
          c();
          const n = t(r ? o[0] : o, e);
          s ? e(n) : (c = h(n) ? n : l);
        },
        f = i.map((e, t) =>
          d(
            e,
            e => {
              (o[t] = e), (a &= ~(1 << t)), n && p();
            },
            () => {
              a |= 1 << t;
            },
          ),
        );
      return (
        (n = !0),
        p(),
        function () {
          u(f), c();
        }
      );
    }).subscribe,
  };
}
function De(e) {
  let t;
  return {
    c() {
      (t = A('div')), this.h();
    },
    l(e) {
      (t = F(e, 'DIV', { class: !0, style: !0 })), R(t).forEach(S), this.h();
    },
    h() {
      D(t, 'class', 'circle svelte-10roc01'),
        B(t, '--size', e[3] + e[1]),
        B(t, '--color', e[0]),
        B(t, '--duration', e[2]);
    },
    m(e, n) {
      $(e, t, n);
    },
    p(e, [n]) {
      10 & n && B(t, '--size', e[3] + e[1]),
        1 & n && B(t, '--color', e[0]),
        4 & n && B(t, '--duration', e[2]);
    },
    i: l,
    o: l,
    d(e) {
      e && S(t);
    },
  };
}
function Re(e, t, n) {
  let { color: r = '#FF3E00' } = t,
    { unit: i = 'px' } = t,
    { duration: s = '0.75s' } = t,
    { size: l = '60' } = t;
  return (
    (e.$$set = e => {
      'color' in e && n(0, (r = e.color)),
        'unit' in e && n(1, (i = e.unit)),
        'duration' in e && n(2, (s = e.duration)),
        'size' in e && n(3, (l = e.size));
    }),
    [r, i, s, l]
  );
}
class Me extends Ee {
  constructor(e) {
    super(),
      je(this, e, Re, De, p, { color: 0, unit: 1, duration: 2, size: 3 });
  }
}
function Ce(e, t, n) {
  let { dotIndex: r, key: i, remaining: s } = Fe(t);
  if (
    t.startsWith('__proto__') ||
    t.startsWith('constructor') ||
    t.startsWith('prototype')
  )
    return e;
  if (r >= 0) {
    if (!e[i] && Array.isArray(e)) return e.forEach(e => Ce(e, t, n));
    e[i] || (e[i] = {}), Ce(e[i], s, n);
  } else {
    if (Array.isArray(e)) return e.forEach(e => Ce(e, s, n));
    e[i] = n;
  }
  return e;
}
function Fe(e) {
  let t = (function (e) {
    for (let t = 0; t < e.length; t++) {
      const n = t > 0 ? e[t - 1] : '';
      if ('.' === e[t] && '\\' !== n) return t;
    }
    return -1;
  })(e);
  return {
    dotIndex: t,
    key: e.slice(0, t >= 0 ? t : void 0).replace(/\\./g, '.'),
    remaining: e.slice(t + 1),
  };
}
var Pe = {
  evaluatePath:
    /**
     * @license MIT
     * doc-path <https://github.com/mrodrig/doc-path>
     * Copyright (c) 2015-present, Michael Rodrigues.
     */
    function e(t, n) {
      if (!t) return null;
      let { dotIndex: r, key: i, remaining: s } = Fe(n);
      return r >= 0 && !t[n]
        ? Array.isArray(t[i])
          ? t[i].map(t => e(t, s))
          : e(t[i], s)
        : Array.isArray(t)
        ? t.map(t => e(t, n))
        : r >= 0 && n !== i && t[i]
        ? e(t[i], s)
        : -1 === r && t[i] && !t[n]
        ? t[i]
        : t[n];
    },
  setPath: function (e, t, n) {
    if (!e) throw new Error('No object was provided.');
    if (!t) throw new Error('No keyPath was provided.');
    return Ce(e, t, n);
  },
};
const Ne = {
  isNull: function (e) {
    return null === e;
  },
  isObject: function (e) {
    return 'object' == typeof e;
  },
  unique: function (e) {
    return [...new Set(e)];
  },
  flatten: function (e) {
    return [].concat(...e);
  },
};
function qe(e, t) {
  return (t = Ue(t)), Ne.isObject(e) ? Ve('', e, t) : [];
}
function Le(e, t) {
  return (t = Ue(t)), e.map(e => (Ne.isObject(e) ? qe(e, t) : []));
}
function Ve(e, t, n) {
  let r = Object.keys(t).map(r => {
    let i = Ze(e, Be(r, n));
    return (
      (s = t[r]),
      Ne.isObject(s) &&
      !Ne.isNull(s) &&
      !Array.isArray(s) &&
      Object.keys(s).length
        ? Ve(i, t[r], n)
        : n.expandArrayObjects && We(t[r])
        ? (function (e, t, n) {
            let r = Le(e, n);
            return e.length
              ? e.length && 0 === Ne.flatten(r).length
                ? [t]
                : ((r = r.map(e =>
                    (function (e) {
                      return Array.isArray(e) && !e.length;
                    })(e)
                      ? [t]
                      : e.map(e => Ze(t, Be(e, n))),
                  )),
                  Ne.unique(Ne.flatten(r)))
              : n.ignoreEmptyArraysWhenExpanding
              ? []
              : [t];
          })(t[r], i, n)
        : n.ignoreEmptyArrays && We(t[r]) && !t[r].length
        ? []
        : i
    );
    var s;
  });
  return Ne.flatten(r);
}
function Be(e, t) {
  return t.escapeNestedDots ? e.replace(/\./g, '\\.') : e;
}
function Ze(e, t) {
  return e ? e + '.' + t : t;
}
function We(e) {
  return Array.isArray(e);
}
function Ue(e) {
  return s(
    {
      expandArrayObjects: !1,
      ignoreEmptyArraysWhenExpanding: !1,
      escapeNestedDots: !1,
      ignoreEmptyArrays: !1,
    },
    e || {},
  );
}
var Qe = {
  errors: {
    callbackRequired: 'A callback is required!',
    optionsRequired: 'Options were not passed and are required.',
    json2csv: {
      cannotCallOn: 'Cannot call json2csv on ',
      dataCheckFailure: 'Data provided was not an array of documents.',
      notSameSchema: 'Not all documents have the same schema.',
    },
    csv2json: {
      cannotCallOn: 'Cannot call csv2json on ',
      dataCheckFailure: 'CSV is not a string.',
    },
  },
  defaultOptions: {
    delimiter: { field: ',', wrap: '"', eol: '\n' },
    excelBOM: !1,
    prependHeader: !0,
    trimHeaderFields: !1,
    trimFieldValues: !1,
    sortHeader: !1,
    parseCsvNumbers: !1,
    keys: null,
    checkSchemaDifferences: !1,
    expandArrayObjects: !1,
    unwindArrays: !1,
    useDateIso8601Format: !1,
    useLocaleFormat: !1,
    parseValue: null,
    wrapBooleans: !1,
  },
  values: { excelBOM: '\ufeff' },
};
let He = Pe,
  Je = Qe;
const Ke = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
var Xe = {
  isStringRepresentation: function (e, t) {
    const n = e[0],
      r = e.length - 1,
      i = e[r];
    return n === t.delimiter.wrap && i === t.delimiter.wrap;
  },
  isDateRepresentation: function (e) {
    return Ke.test(e);
  },
  computeSchemaDifferences: function (e, t) {
    return rt(e, t).concat(rt(t, e));
  },
  deepCopy: Ge,
  convert: function (e) {
    let { options: t, callback: n } = (function (e, t) {
      if (et(e) && ((n = e), 'function' != typeof n))
        return { options: e, callback: t };
      var n;
      return { options: t, callback: e };
    })(e.callback, e.options);
    (r = t),
      ((r = s(s({}, Je.defaultOptions), r || {})).fieldTitleMap = new Map()),
      (r.delimiter.field =
        r.delimiter.field || Je.defaultOptions.delimiter.field),
      (r.delimiter.wrap = r.delimiter.wrap || Je.defaultOptions.delimiter.wrap),
      (r.delimiter.eol = r.delimiter.eol || Je.defaultOptions.delimiter.eol),
      (t = r);
    var r;
    let i = new e.converter(t);
    (function (e) {
      if (!e.callback) throw new Error(Je.errors.callbackRequired);
      if (!e.data)
        return (
          e.callback(new Error(e.errorMessages.cannotCallOn + e.data + '.')), !1
        );
      if (!e.dataCheckFn(e.data))
        return e.callback(new Error(e.errorMessages.dataCheckFailure)), !1;
      return !0;
    })({
      data: e.data,
      callback: n,
      errorMessages: i.validationMessages,
      dataCheckFn: i.validationFn,
    }) && i.convert(e.data, n);
  },
  isEmptyField: Ye,
  removeEmptyFields: function (e) {
    return e.filter(e => !Ye(e));
  },
  getNCharacters: function (e, t, n) {
    return e.substring(t, t + n);
  },
  unwind: function (e, t) {
    const n = [];
    return (
      e.forEach(e => {
        !(function (e, t, n) {
          const r = He.evaluatePath(t, n);
          let i = Ge(t);
          Array.isArray(r) && r.length
            ? r.forEach(r => {
                (i = Ge(t)), e.push(He.setPath(i, n, r));
              })
            : Array.isArray(r) && 0 === r.length
            ? (He.setPath(i, n, ''), e.push(i))
            : e.push(i);
        })(n, e, t);
      }),
      n
    );
  },
  isInvalid: function (e) {
    return e === 1 / 0 || e === -1 / 0;
  },
  isString: function (e) {
    return 'string' == typeof e;
  },
  isNull: tt,
  isError: function (e) {
    return '[object Error]' === Object.prototype.toString.call(e);
  },
  isDate: function (e) {
    return e instanceof Date;
  },
  isUndefined: nt,
  isObject: et,
  unique: function (e) {
    return [...new Set(e)];
  },
  flatten: function (e) {
    if (e.flat) return e.flat();
    if (e.length > 1e5) {
      let t = [];
      for (let n = 0; n < e.length; n += 1e5)
        t = t.concat(...e.slice(n, n + 1e5));
      return t;
    }
    return [].concat(...e);
  },
};
function Ge(e) {
  return JSON.parse(JSON.stringify(e));
}
function Ye(e) {
  return nt(e) || tt(e) || '' === e;
}
function et(e) {
  return 'object' == typeof e;
}
function tt(e) {
  return null === e;
}
function nt(e) {
  return void 0 === e;
}
function rt(e, t) {
  return e.filter(e => !t.includes(e));
}
let it = Pe,
  st = { deepKeys: qe, deepKeysFromList: Le },
  lt = Qe,
  ot = Xe;
var at = {
  Json2Csv: function (e) {
    const t = new RegExp(e.delimiter.wrap, 'g'),
      n = /\r?\n|\r/,
      r =
        e.parseValue && 'function' == typeof e.parseValue
          ? e.parseValue
          : function (t) {
              const n = ot.isDate(t);
              return ot.isNull(t) || Array.isArray(t) || (ot.isObject(t) && !n)
                ? JSON.stringify(t)
                : ot.isUndefined(t)
                ? 'undefined'
                : n && e.useDateIso8601Format
                ? t.toISOString()
                : e.useLocaleFormat
                ? t.toLocaleString()
                : t.toString();
            },
      i = e.expandArrayObjects && !e.unwindArrays,
      s = {
        expandArrayObjects: i,
        ignoreEmptyArraysWhenExpanding: i,
        escapeNestedDots: !0,
      };
    function l(t) {
      if (e.checkSchemaDifferences)
        return (function (e) {
          let t = e[0],
            n = e.slice(1);
          if (
            (function (e, t) {
              return t.reduce(
                (t, n) =>
                  ot.computeSchemaDifferences(e, n).length > 0 ? t + 1 : t,
                0,
              );
            })(t, n)
          )
            return Promise.reject(new Error(lt.errors.json2csv.notSameSchema));
          return Promise.resolve(t);
        })(t);
      {
        let e = ot.unique(ot.flatten(t));
        return Promise.resolve(e);
      }
    }
    function o(t) {
      return e.excludeKeys ? t.filter(t => !e.excludeKeys.includes(t)) : t;
    }
    function a(t) {
      return e.sortHeader ? t.sort() : t;
    }
    function c(t) {
      return (
        e.trimHeaderFields &&
          (t.headerFields = t.headerFields.map(e =>
            e
              .split('.')
              .map(e => e.trim())
              .join('.'),
          )),
        t
      );
    }
    function u(t) {
      return (
        e.prependHeader &&
          (t.headerFields = t.headerFields.map(function (e) {
            return m(e);
          })),
        t
      );
    }
    function h(t) {
      let n = Object.keys(e.fieldTitleMap);
      return (
        (t.header = t.headerFields
          .map(function (t) {
            return m(n.includes(t) ? e.fieldTitleMap[t] : t);
          })
          .join(e.delimiter.field)),
        t
      );
    }
    function p(t) {
      return (
        e.keys &&
          (e.keys = e.keys.map(t =>
            ot.isObject(t) && t.field
              ? ((e.fieldTitleMap[t.field] = t.title || t.field), t.field)
              : t,
          )),
        e.keys && !e.unwindArrays
          ? Promise.resolve(e.keys).then(o).then(a)
          : (function (e) {
              return Promise.resolve(st.deepKeysFromList(e, s));
            })(t)
              .then(l)
              .then(o)
              .then(a)
      );
    }
    function d(t, n = !1) {
      if (e.unwindArrays) {
        const r = t.records.length;
        return (
          t.headerFields.forEach(e => {
            t.records = ot.unwind(t.records, e);
          }),
          p(t.records).then(
            i => (
              (t.headerFields = i),
              r !== t.records.length
                ? d(t)
                : n
                ? (e.keys && (t.headerFields = o(e.keys)), t)
                : d(t, !0)
            ),
          )
        );
      }
      return t;
    }
    function f(t) {
      return (
        (t.records = t.records
          .map(n => {
            let i = (function (t, n) {
              let r = [];
              return (
                n.forEach(n => {
                  let i = it.evaluatePath(t, n);
                  !ot.isUndefined(e.emptyFieldValue) && ot.isEmptyField(i)
                    ? (i = e.emptyFieldValue)
                    : e.expandArrayObjects &&
                      Array.isArray(i) &&
                      (i = (function (t) {
                        let n = ot.removeEmptyFields(t);
                        if (!t.length || !n.length)
                          return e.emptyFieldValue || '';
                        if (1 === n.length) return n[0];
                        return t;
                      })(i)),
                    r.push(i);
                }),
                r
              );
            })(n, t.headerFields).map(e => ((e = g(e)), (e = m((e = r(e))))));
            return i.join(e.delimiter.field);
          })
          .join(e.delimiter.eol)),
        t
      );
    }
    function g(t) {
      return e.trimFieldValues
        ? Array.isArray(t)
          ? t.map(g)
          : ot.isString(t)
          ? t.trim()
          : t
        : t;
    }
    function m(r) {
      const i = e.delimiter.wrap;
      return (
        r.includes(e.delimiter.wrap) && (r = r.replace(t, i + i)),
        (r.includes(e.delimiter.field) ||
          r.includes(e.delimiter.wrap) ||
          r.match(n) ||
          (e.wrapBooleans && ('true' === r || 'false' === r))) &&
          (r = i + r + i),
        r
      );
    }
    function k(t) {
      let n = t.header,
        r = t.records,
        i =
          (e.excelBOM ? lt.values.excelBOM : '') +
          (e.prependHeader ? n + e.delimiter.eol : '') +
          r;
      return t.callback(null, i);
    }
    return {
      convert: function (e, t) {
        ot.isObject(e) && !e.length && (e = [e]),
          p(e)
            .then(n => ({ headerFields: n, callback: t, records: e }))
            .then(d)
            .then(f)
            .then(u)
            .then(c)
            .then(h)
            .then(k)
            .catch(t);
      },
      validationFn: ot.isObject,
      validationMessages: lt.errors.json2csv,
    };
  },
};
let ct = Pe,
  ut = Qe,
  ht = Xe;
var pt = {
  Csv2Json: function (e) {
    const t = new RegExp(e.delimiter.wrap + e.delimiter.wrap, 'g'),
      n = new RegExp('^' + ut.values.excelBOM),
      r =
        e.parseValue && 'function' == typeof e.parseValue
          ? e.parseValue
          : JSON.parse;
    function i(t) {
      return (
        (t = u(t)),
        e.trimHeaderFields
          ? t
              .split('.')
              .map(e => e.trim())
              .join('.')
          : t
      );
    }
    function s(t) {
      let n = { lines: t },
        r = n.lines[0];
      return (
        (n.headerFields = r.map((e, t) => ({ value: i(e), index: t }))),
        e.keys &&
          (n.headerFields = n.headerFields.filter(t =>
            e.keys.includes(t.value),
          )),
        n
      );
    }
    function l(t) {
      return Promise.resolve(
        (function (t) {
          let n,
            r,
            i,
            s,
            l = [],
            o = [],
            a = t.length - 1,
            c = e.delimiter.eol.length,
            u = {
              insideWrapDelimiter: !1,
              parsingValue: !0,
              justParsedDoubleQuote: !1,
              startIndex: 0,
            },
            h = 0;
          for (; h < t.length; ) {
            if (
              ((n = t[h]),
              (r = h ? t[h - 1] : ''),
              (i = h < a ? t[h + 1] : ''),
              (s = ht.getNCharacters(t, h, c)),
              ((s !== e.delimiter.eol || u.insideWrapDelimiter) && h !== a) ||
                r !== e.delimiter.field)
            )
              if (h === a && n === e.delimiter.field) {
                let e = t.substring(u.startIndex, h);
                o.push(e), o.push(''), l.push(o);
              } else if (
                h === a ||
                (s === e.delimiter.eol &&
                  (!u.insideWrapDelimiter ||
                    (u.insideWrapDelimiter &&
                      r === e.delimiter.wrap &&
                      !u.justParsedDoubleQuote)))
              ) {
                let n = h !== a || r === e.delimiter.wrap ? h : void 0;
                o.push(t.substring(u.startIndex, n)),
                  l.push(o),
                  (o = []),
                  (u.startIndex = h + c),
                  (u.parsingValue = !0),
                  (u.insideWrapDelimiter = i === e.delimiter.wrap);
              } else if (
                (r !== e.delimiter.wrap ||
                  (u.justParsedDoubleQuote && r === e.delimiter.wrap)) &&
                n === e.delimiter.wrap &&
                ht.getNCharacters(t, h + 1, c) === e.delimiter.eol
              )
                (u.insideWrapDelimiter = !1), (u.parsingValue = !1);
              else if (
                n !== e.delimiter.wrap ||
                (0 !== h && ht.getNCharacters(t, h - c, c) !== e.delimiter.eol)
              )
                if (n === e.delimiter.wrap && i === e.delimiter.field)
                  o.push(t.substring(u.startIndex, h + 1)),
                    (u.startIndex = h + 2),
                    (u.insideWrapDelimiter = !1),
                    (u.parsingValue = !1);
                else if (
                  n !== e.delimiter.wrap ||
                  r !== e.delimiter.field ||
                  u.insideWrapDelimiter ||
                  u.parsingValue
                )
                  if (
                    n === e.delimiter.wrap &&
                    r === e.delimiter.field &&
                    !u.insideWrapDelimiter &&
                    u.parsingValue
                  )
                    o.push(t.substring(u.startIndex, h - 1)),
                      (u.insideWrapDelimiter = !0),
                      (u.parsingValue = !0),
                      (u.startIndex = h);
                  else {
                    if (n === e.delimiter.wrap && i === e.delimiter.wrap) {
                      (h += 2), (u.justParsedDoubleQuote = !0);
                      continue;
                    }
                    n === e.delimiter.field &&
                    r !== e.delimiter.wrap &&
                    i !== e.delimiter.wrap &&
                    !u.insideWrapDelimiter &&
                    u.parsingValue
                      ? (o.push(t.substring(u.startIndex, h)),
                        (u.startIndex = h + 1))
                      : n !== e.delimiter.field ||
                        r !== e.delimiter.wrap ||
                        i === e.delimiter.wrap ||
                        u.parsingValue ||
                        ((u.insideWrapDelimiter = !1),
                        (u.parsingValue = !0),
                        (u.startIndex = h + 1));
                  }
                else
                  (u.startIndex = h),
                    (u.insideWrapDelimiter = !0),
                    (u.parsingValue = !0);
              else
                (u.insideWrapDelimiter = !0),
                  (u.parsingValue = !0),
                  (u.startIndex = h);
            else
              (s === e.delimiter.eol && u.startIndex === h) ||
              n === e.delimiter.field
                ? o.push('')
                : o.push(t.substr(u.startIndex)),
                o.push(''),
                l.push(o),
                (o = []),
                (u.startIndex = h + c),
                (u.parsingValue = !0),
                (u.insideWrapDelimiter = i === e.delimiter.wrap);
            h++, (u.justParsedDoubleQuote = !1);
          }
          return l;
        })(t),
      );
    }
    function o(e) {
      return (e.recordLines = e.lines.splice(1)), e;
    }
    function a(t, n) {
      return (function (t) {
        let n = (function (t) {
          try {
            if (ht.isStringRepresentation(t, e) && !ht.isDateRepresentation(t))
              return t;
            let n = r(t);
            return Array.isArray(n) ? n.map(c) : n;
          } catch (n) {
            return n;
          }
        })(t);
        ht.isError(n) || ht.isInvalid(n)
          ? 'undefined' === t && (t = void 0)
          : (t = n);
        return t;
      })(t[n.index]);
    }
    function c(t) {
      return e.trimFieldValues && !ht.isNull(t) ? t.trim() : t;
    }
    function u(t) {
      let n = t[0],
        r = t.length - 1,
        i = t[r];
      return n === e.delimiter.wrap && i === e.delimiter.wrap
        ? t.substr(1, r - 1)
        : t;
    }
    function h(n) {
      return (
        (n.json = n.recordLines.reduce((r, i) => {
          i = i.map(
            n =>
              (n = c(
                (n = (function (n) {
                  return n.replace(t, e.delimiter.wrap);
                })((n = u(n)))),
              )),
          );
          let s = (function (e, t) {
            return e.reduce((e, n) => {
              let r = a(t, n);
              try {
                return ct.setPath(e, n.value, r);
              } catch (i) {
                return e;
              }
            }, {});
          })(n.headerFields, i);
          return r.concat(s);
        }, [])),
        n
      );
    }
    return {
      convert: function (t, r) {
        var i;
        ((i = t),
        e.excelBOM ? Promise.resolve(i.replace(n, '')) : Promise.resolve(i))
          .then(l)
          .then(s)
          .then(o)
          .then(h)
          .then(e => r(null, e.json))
          .catch(r);
      },
      validationFn: ht.isString,
      validationMessages: ut.errors.csv2json,
    };
  },
};
let { Json2Csv: dt } = at,
  { Csv2Json: ft } = pt,
  gt = Xe;
var mt = {
  json2csv: (e, t, n) => kt(dt, e, t, n),
  csv2json: (e, t, n) => kt(ft, e, t, n),
  json2csvAsync: (e, t) => xt(dt, e, t),
  csv2jsonAsync: (e, t) => xt(ft, e, t),
  json2csvPromisified: (e, t) =>
    bt(dt, 'json2csvPromisified()', 'json2csvAsync()', e, t),
  csv2jsonPromisified: (e, t) =>
    bt(ft, 'csv2jsonPromisified()', 'csv2jsonAsync()', e, t),
};
function kt(e, t, n, r) {
  return gt.convert({ data: t, callback: n, options: r, converter: e });
}
function xt(e, t, n) {
  return new Promise((r, i) => kt(e, t, (e, t) => (e ? i(e) : r(t)), n));
}
function bt(e, t, n, r, i) {
  return (
    console.warn(
      'WARNING: ' +
        t +
        ' is deprecated and will be removed soon. Please use ' +
        n +
        ' instead.',
    ),
    xt(e, r, i)
  );
}
function wt(e, t) {
  if (
    (n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf('e')) < 0
  )
    return null;
  var n,
    r = e.slice(0, n);
  return [r.length > 1 ? r[0] + r.slice(2) : r, +e.slice(n + 1)];
}
var yt,
  _t =
    /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function vt(e) {
  if (!(t = _t.exec(e))) throw new Error('invalid format: ' + e);
  var t;
  return new $t({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10],
  });
}
function $t(e) {
  (this.fill = void 0 === e.fill ? ' ' : e.fill + ''),
    (this.align = void 0 === e.align ? '>' : e.align + ''),
    (this.sign = void 0 === e.sign ? '-' : e.sign + ''),
    (this.symbol = void 0 === e.symbol ? '' : e.symbol + ''),
    (this.zero = !!e.zero),
    (this.width = void 0 === e.width ? void 0 : +e.width),
    (this.comma = !!e.comma),
    (this.precision = void 0 === e.precision ? void 0 : +e.precision),
    (this.trim = !!e.trim),
    (this.type = void 0 === e.type ? '' : e.type + '');
}
function St(e, t) {
  var n = wt(e, t);
  if (!n) return e + '';
  var r = n[0],
    i = n[1];
  return i < 0
    ? '0.' + new Array(-i).join('0') + r
    : r.length > i + 1
    ? r.slice(0, i + 1) + '.' + r.slice(i + 1)
    : r + new Array(i - r.length + 2).join('0');
}
(vt.prototype = $t.prototype),
  ($t.prototype.toString = function () {
    return (
      this.fill +
      this.align +
      this.sign +
      this.symbol +
      (this.zero ? '0' : '') +
      (void 0 === this.width ? '' : Math.max(1, 0 | this.width)) +
      (this.comma ? ',' : '') +
      (void 0 === this.precision ? '' : '.' + Math.max(0, 0 | this.precision)) +
      (this.trim ? '~' : '') +
      this.type
    );
  });
var zt = {
  '%': (e, t) => (100 * e).toFixed(t),
  b: e => Math.round(e).toString(2),
  c: e => e + '',
  d: function (e) {
    return Math.abs((e = Math.round(e))) >= 1e21
      ? e.toLocaleString('en').replace(/,/g, '')
      : e.toString(10);
  },
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: e => Math.round(e).toString(8),
  p: (e, t) => St(100 * e, t),
  r: St,
  s: function (e, t) {
    var n = wt(e, t);
    if (!n) return e + '';
    var r = n[0],
      i = n[1],
      s = i - (yt = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1,
      l = r.length;
    return s === l
      ? r
      : s > l
      ? r + new Array(s - l + 1).join('0')
      : s > 0
      ? r.slice(0, s) + '.' + r.slice(s)
      : '0.' + new Array(1 - s).join('0') + wt(e, Math.max(0, t + s - 1))[0];
  },
  X: e => Math.round(e).toString(16).toUpperCase(),
  x: e => Math.round(e).toString(16),
};
function At(e) {
  return e;
}
var jt,
  Et,
  It = Array.prototype.map,
  Ot = [
    'y',
    'z',
    'a',
    'f',
    'p',
    'n',
    'µ',
    'm',
    '',
    'k',
    'M',
    'G',
    'T',
    'P',
    'E',
    'Z',
    'Y',
  ];
function Tt(e) {
  var t,
    n,
    r =
      void 0 === e.grouping || void 0 === e.thousands
        ? At
        : ((t = It.call(e.grouping, Number)),
          (n = e.thousands + ''),
          function (e, r) {
            for (
              var i = e.length, s = [], l = 0, o = t[0], a = 0;
              i > 0 &&
              o > 0 &&
              (a + o + 1 > r && (o = Math.max(1, r - a)),
              s.push(e.substring((i -= o), i + o)),
              !((a += o + 1) > r));

            )
              o = t[(l = (l + 1) % t.length)];
            return s.reverse().join(n);
          }),
    i = void 0 === e.currency ? '' : e.currency[0] + '',
    s = void 0 === e.currency ? '' : e.currency[1] + '',
    l = void 0 === e.decimal ? '.' : e.decimal + '',
    o =
      void 0 === e.numerals
        ? At
        : (function (e) {
            return function (t) {
              return t.replace(/[0-9]/g, function (t) {
                return e[+t];
              });
            };
          })(It.call(e.numerals, String)),
    a = void 0 === e.percent ? '%' : e.percent + '',
    c = void 0 === e.minus ? '−' : e.minus + '',
    u = void 0 === e.nan ? 'NaN' : e.nan + '';
  function h(e) {
    var t = (e = vt(e)).fill,
      n = e.align,
      h = e.sign,
      p = e.symbol,
      d = e.zero,
      f = e.width,
      g = e.comma,
      m = e.precision,
      k = e.trim,
      x = e.type;
    'n' === x
      ? ((g = !0), (x = 'g'))
      : zt[x] || (void 0 === m && (m = 12), (k = !0), (x = 'g')),
      (d || ('0' === t && '=' === n)) && ((d = !0), (t = '0'), (n = '='));
    var b =
        '$' === p
          ? i
          : '#' === p && /[boxX]/.test(x)
          ? '0' + x.toLowerCase()
          : '',
      w = '$' === p ? s : /[%p]/.test(x) ? a : '',
      y = zt[x],
      _ = /[defgprs%]/.test(x);
    function v(e) {
      var i,
        s,
        a,
        p = b,
        v = w;
      if ('c' === x) (v = y(e) + v), (e = '');
      else {
        var $ = (e = +e) < 0 || 1 / e < 0;
        if (
          ((e = isNaN(e) ? u : y(Math.abs(e), m)),
          k &&
            (e = (function (e) {
              e: for (var t, n = e.length, r = 1, i = -1; r < n; ++r)
                switch (e[r]) {
                  case '.':
                    i = t = r;
                    break;
                  case '0':
                    0 === i && (i = r), (t = r);
                    break;
                  default:
                    if (!+e[r]) break e;
                    i > 0 && (i = 0);
                }
              return i > 0 ? e.slice(0, i) + e.slice(t + 1) : e;
            })(e)),
          $ && 0 == +e && '+' !== h && ($ = !1),
          (p = ($ ? ('(' === h ? h : c) : '-' === h || '(' === h ? '' : h) + p),
          (v =
            ('s' === x ? Ot[8 + yt / 3] : '') +
            v +
            ($ && '(' === h ? ')' : '')),
          _)
        )
          for (i = -1, s = e.length; ++i < s; )
            if (48 > (a = e.charCodeAt(i)) || a > 57) {
              (v = (46 === a ? l + e.slice(i + 1) : e.slice(i)) + v),
                (e = e.slice(0, i));
              break;
            }
      }
      g && !d && (e = r(e, 1 / 0));
      var S = p.length + e.length + v.length,
        z = S < f ? new Array(f - S + 1).join(t) : '';
      switch (
        (g && d && ((e = r(z + e, z.length ? f - v.length : 1 / 0)), (z = '')),
        n)
      ) {
        case '<':
          e = p + e + v + z;
          break;
        case '=':
          e = p + z + e + v;
          break;
        case '^':
          e = z.slice(0, (S = z.length >> 1)) + p + e + v + z.slice(S);
          break;
        default:
          e = z + p + e + v;
      }
      return o(e);
    }
    return (
      (m =
        void 0 === m
          ? 6
          : /[gprs]/.test(x)
          ? Math.max(1, Math.min(21, m))
          : Math.max(0, Math.min(20, m))),
      (v.toString = function () {
        return e + '';
      }),
      v
    );
  }
  return {
    format: h,
    formatPrefix: function (e, t) {
      var n,
        r = h((((e = vt(e)).type = 'f'), e)),
        i =
          3 *
          Math.max(
            -8,
            Math.min(
              8,
              Math.floor(((n = t), ((n = wt(Math.abs(n))) ? n[1] : NaN) / 3)),
            ),
          ),
        s = Math.pow(10, -i),
        l = Ot[8 + i / 3];
      return function (e) {
        return r(s * e) + l;
      };
    },
  };
}
(jt = Tt({ thousands: ',', grouping: [3], currency: ['$', ''] })),
  (Et = jt.format);
var Dt = { exports: {} };
function Rt() {
  return {
    baseUrl: null,
    breaks: !1,
    extensions: null,
    gfm: !0,
    headerIds: !0,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: !0,
    pedantic: !1,
    renderer: null,
    sanitize: !1,
    sanitizer: null,
    silent: !1,
    smartLists: !1,
    smartypants: !1,
    tokenizer: null,
    walkTokens: null,
    xhtml: !1,
  };
}
Dt.exports = {
  defaults: {
    baseUrl: null,
    breaks: !1,
    extensions: null,
    gfm: !0,
    headerIds: !0,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: !0,
    pedantic: !1,
    renderer: null,
    sanitize: !1,
    sanitizer: null,
    silent: !1,
    smartLists: !1,
    smartypants: !1,
    tokenizer: null,
    walkTokens: null,
    xhtml: !1,
  },
  getDefaults: Rt,
  changeDefaults: function (e) {
    Dt.exports.defaults = e;
  },
};
const Mt = /[&<>"']/,
  Ct = /[&<>"']/g,
  Ft = /[<>"']|&(?!#?\w+;)/,
  Pt = /[<>"']|&(?!#?\w+;)/g,
  Nt = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' },
  qt = e => Nt[e];
const Lt = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
function Vt(e) {
  return e.replace(Lt, (e, t) =>
    'colon' === (t = t.toLowerCase())
      ? ':'
      : '#' === t.charAt(0)
      ? 'x' === t.charAt(1)
        ? String.fromCharCode(parseInt(t.substring(2), 16))
        : String.fromCharCode(+t.substring(1))
      : '',
  );
}
const Bt = /(^|[^\[])\^/g;
const Zt = /[^\w:]/g,
  Wt = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
const Ut = {},
  Qt = /^[^:]+:\/*[^/]*$/,
  Ht = /^([^:]+:)[\s\S]*$/,
  Jt = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function Kt(e, t) {
  Ut[' ' + e] ||
    (Qt.test(e) ? (Ut[' ' + e] = e + '/') : (Ut[' ' + e] = Xt(e, '/', !0)));
  const n = -1 === (e = Ut[' ' + e]).indexOf(':');
  return '//' === t.substring(0, 2)
    ? n
      ? t
      : e.replace(Ht, '$1') + t
    : '/' === t.charAt(0)
    ? n
      ? t
      : e.replace(Jt, '$1') + t
    : e + t;
}
function Xt(e, t, n) {
  const r = e.length;
  if (0 === r) return '';
  let i = 0;
  for (; i < r; ) {
    const s = e.charAt(r - i - 1);
    if (s !== t || n) {
      if (s === t || !n) break;
      i++;
    } else i++;
  }
  return e.substr(0, r - i);
}
var Gt = {
  escape: function (e, t) {
    if (t) {
      if (Mt.test(e)) return e.replace(Ct, qt);
    } else if (Ft.test(e)) return e.replace(Pt, qt);
    return e;
  },
  unescape: Vt,
  edit: function (e, t) {
    (e = e.source || e), (t = t || '');
    const n = {
      replace: (t, r) => (
        (r = (r = r.source || r).replace(Bt, '$1')), (e = e.replace(t, r)), n
      ),
      getRegex: () => new RegExp(e, t),
    };
    return n;
  },
  cleanUrl: function (e, t, n) {
    if (e) {
      let e;
      try {
        e = decodeURIComponent(Vt(n)).replace(Zt, '').toLowerCase();
      } catch (r) {
        return null;
      }
      if (
        0 === e.indexOf('javascript:') ||
        0 === e.indexOf('vbscript:') ||
        0 === e.indexOf('data:')
      )
        return null;
    }
    t && !Wt.test(n) && (n = Kt(t, n));
    try {
      n = encodeURI(n).replace(/%25/g, '%');
    } catch (r) {
      return null;
    }
    return n;
  },
  resolveUrl: Kt,
  noopTest: { exec: function () {} },
  merge: function (e) {
    let t,
      n,
      r = 1;
    for (; r < arguments.length; r++)
      for (n in ((t = arguments[r]), t))
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
    return e;
  },
  splitCells: function (e, t) {
    const n = e
      .replace(/\|/g, (e, t, n) => {
        let r = !1,
          i = t;
        for (; --i >= 0 && '\\' === n[i]; ) r = !r;
        return r ? '|' : ' |';
      })
      .split(/ \|/);
    let r = 0;
    if (
      (n[0].trim() || n.shift(),
      n[n.length - 1].trim() || n.pop(),
      n.length > t)
    )
      n.splice(t);
    else for (; n.length < t; ) n.push('');
    for (; r < n.length; r++) n[r] = n[r].trim().replace(/\\\|/g, '|');
    return n;
  },
  rtrim: Xt,
  findClosingBracket: function (e, t) {
    if (-1 === e.indexOf(t[1])) return -1;
    const n = e.length;
    let r = 0,
      i = 0;
    for (; i < n; i++)
      if ('\\' === e[i]) i++;
      else if (e[i] === t[0]) r++;
      else if (e[i] === t[1] && (r--, r < 0)) return i;
    return -1;
  },
  checkSanitizeDeprecation: function (e) {
    e &&
      e.sanitize &&
      !e.silent &&
      console.warn(
        'marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options',
      );
  },
  repeatString: function (e, t) {
    if (t < 1) return '';
    let n = '';
    for (; t > 1; ) 1 & t && (n += e), (t >>= 1), (e += e);
    return n + e;
  },
};
const { defaults: Yt } = Dt.exports,
  { rtrim: en, splitCells: tn, escape: nn, findClosingBracket: rn } = Gt;
function sn(e, t, n, r) {
  const i = t.href,
    s = t.title ? nn(t.title) : null,
    l = e[1].replace(/\\([\[\]])/g, '$1');
  if ('!' !== e[0].charAt(0)) {
    r.state.inLink = !0;
    const e = {
      type: 'link',
      raw: n,
      href: i,
      title: s,
      text: l,
      tokens: r.inlineTokens(l, []),
    };
    return (r.state.inLink = !1), e;
  }
  return { type: 'image', raw: n, href: i, title: s, text: nn(l) };
}
var ln = class {
  constructor(e) {
    this.options = e || Yt;
  }
  space(e) {
    const t = this.rules.block.newline.exec(e);
    if (t)
      return t[0].length > 1 ? { type: 'space', raw: t[0] } : { raw: '\n' };
  }
  code(e) {
    const t = this.rules.block.code.exec(e);
    if (t) {
      const e = t[0].replace(/^ {1,4}/gm, '');
      return {
        type: 'code',
        raw: t[0],
        codeBlockStyle: 'indented',
        text: this.options.pedantic ? e : en(e, '\n'),
      };
    }
  }
  fences(e) {
    const t = this.rules.block.fences.exec(e);
    if (t) {
      const e = t[0],
        n = (function (e, t) {
          const n = e.match(/^(\s+)(?:```)/);
          if (null === n) return t;
          const r = n[1];
          return t
            .split('\n')
            .map(e => {
              const t = e.match(/^\s+/);
              if (null === t) return e;
              const [n] = t;
              return n.length >= r.length ? e.slice(r.length) : e;
            })
            .join('\n');
        })(e, t[3] || '');
      return { type: 'code', raw: e, lang: t[2] ? t[2].trim() : t[2], text: n };
    }
  }
  heading(e) {
    const t = this.rules.block.heading.exec(e);
    if (t) {
      let e = t[2].trim();
      if (/#$/.test(e)) {
        const t = en(e, '#');
        this.options.pedantic
          ? (e = t.trim())
          : (t && !/ $/.test(t)) || (e = t.trim());
      }
      const n = {
        type: 'heading',
        raw: t[0],
        depth: t[1].length,
        text: e,
        tokens: [],
      };
      return this.lexer.inline(n.text, n.tokens), n;
    }
  }
  hr(e) {
    const t = this.rules.block.hr.exec(e);
    if (t) return { type: 'hr', raw: t[0] };
  }
  blockquote(e) {
    const t = this.rules.block.blockquote.exec(e);
    if (t) {
      const e = t[0].replace(/^ *> ?/gm, '');
      return {
        type: 'blockquote',
        raw: t[0],
        tokens: this.lexer.blockTokens(e, []),
        text: e,
      };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n,
        r,
        i,
        s,
        l,
        o,
        a,
        c,
        u,
        h,
        p = t[1].trim();
      const d = p.length > 1,
        f = {
          type: 'list',
          raw: '',
          ordered: d,
          start: d ? +p.slice(0, -1) : '',
          loose: !1,
          items: [],
        };
      (p = d ? `\\d{1,9}\\${p.slice(-1)}` : `\\${p}`),
        this.options.pedantic && (p = d ? p : '[*+-]');
      const g = new RegExp(
        `^( {0,3}${p})((?: [^\\n]*| *)(?:\\n[^\\n]*)*(?:\\n|$))`,
      );
      for (; e && !this.rules.block.hr.test(e) && (t = g.exec(e)); ) {
        (u = t[2].split('\n')),
          this.options.pedantic
            ? ((s = 2), (h = u[0].trimLeft()))
            : ((s = t[2].search(/[^ ]/)),
              (s = t[1].length + (s > 4 ? 1 : s)),
              (h = u[0].slice(s - t[1].length))),
          (o = !1),
          (n = t[0]),
          !u[0] &&
            /^ *$/.test(u[1]) &&
            ((n = t[1] + u.slice(0, 2).join('\n') + '\n'),
            (f.loose = !0),
            (u = []));
        const p = new RegExp(
          `^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])`,
        );
        for (l = 1; l < u.length; l++) {
          if (
            ((c = u[l]),
            this.options.pedantic &&
              (c = c.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ')),
            p.test(c))
          ) {
            n = t[1] + u.slice(0, l).join('\n') + '\n';
            break;
          }
          if (o) {
            if (!(c.search(/[^ ]/) >= s) && c.trim()) {
              n = t[1] + u.slice(0, l).join('\n') + '\n';
              break;
            }
            h += '\n' + c.slice(s);
          } else
            c.trim() || (o = !0),
              c.search(/[^ ]/) >= s
                ? (h += '\n' + c.slice(s))
                : (h += '\n' + c);
        }
        f.loose || (a ? (f.loose = !0) : /\n *\n *$/.test(n) && (a = !0)),
          this.options.gfm &&
            ((r = /^\[[ xX]\] /.exec(h)),
            r && ((i = '[ ] ' !== r[0]), (h = h.replace(/^\[[ xX]\] +/, '')))),
          f.items.push({
            type: 'list_item',
            raw: n,
            task: !!r,
            checked: i,
            loose: !1,
            text: h,
          }),
          (f.raw += n),
          (e = e.slice(n.length));
      }
      (f.items[f.items.length - 1].raw = n.trimRight()),
        (f.items[f.items.length - 1].text = h.trimRight()),
        (f.raw = f.raw.trimRight());
      const m = f.items.length;
      for (l = 0; l < m; l++)
        (this.lexer.state.top = !1),
          (f.items[l].tokens = this.lexer.blockTokens(f.items[l].text, [])),
          f.items[l].tokens.some(e => 'space' === e.type) &&
            ((f.loose = !0), (f.items[l].loose = !0));
      return f;
    }
  }
  html(e) {
    const t = this.rules.block.html.exec(e);
    if (t) {
      const e = {
        type: 'html',
        raw: t[0],
        pre:
          !this.options.sanitizer &&
          ('pre' === t[1] || 'script' === t[1] || 'style' === t[1]),
        text: t[0],
      };
      return (
        this.options.sanitize &&
          ((e.type = 'paragraph'),
          (e.text = this.options.sanitizer
            ? this.options.sanitizer(t[0])
            : nn(t[0])),
          (e.tokens = []),
          this.lexer.inline(e.text, e.tokens)),
        e
      );
    }
  }
  def(e) {
    const t = this.rules.block.def.exec(e);
    if (t) {
      t[3] && (t[3] = t[3].substring(1, t[3].length - 1));
      return {
        type: 'def',
        tag: t[1].toLowerCase().replace(/\s+/g, ' '),
        raw: t[0],
        href: t[2],
        title: t[3],
      };
    }
  }
  table(e) {
    const t = this.rules.block.table.exec(e);
    if (t) {
      const e = {
        type: 'table',
        header: tn(t[1]).map(e => ({ text: e })),
        align: t[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        rows: t[3] ? t[3].replace(/\n$/, '').split('\n') : [],
      };
      if (e.header.length === e.align.length) {
        e.raw = t[0];
        let n,
          r,
          i,
          s,
          l = e.align.length;
        for (n = 0; n < l; n++)
          /^ *-+: *$/.test(e.align[n])
            ? (e.align[n] = 'right')
            : /^ *:-+: *$/.test(e.align[n])
            ? (e.align[n] = 'center')
            : /^ *:-+ *$/.test(e.align[n])
            ? (e.align[n] = 'left')
            : (e.align[n] = null);
        for (l = e.rows.length, n = 0; n < l; n++)
          e.rows[n] = tn(e.rows[n], e.header.length).map(e => ({ text: e }));
        for (l = e.header.length, r = 0; r < l; r++)
          (e.header[r].tokens = []),
            this.lexer.inlineTokens(e.header[r].text, e.header[r].tokens);
        for (l = e.rows.length, r = 0; r < l; r++)
          for (s = e.rows[r], i = 0; i < s.length; i++)
            (s[i].tokens = []), this.lexer.inlineTokens(s[i].text, s[i].tokens);
        return e;
      }
    }
  }
  lheading(e) {
    const t = this.rules.block.lheading.exec(e);
    if (t) {
      const e = {
        type: 'heading',
        raw: t[0],
        depth: '=' === t[2].charAt(0) ? 1 : 2,
        text: t[1],
        tokens: [],
      };
      return this.lexer.inline(e.text, e.tokens), e;
    }
  }
  paragraph(e) {
    const t = this.rules.block.paragraph.exec(e);
    if (t) {
      const e = {
        type: 'paragraph',
        raw: t[0],
        text: '\n' === t[1].charAt(t[1].length - 1) ? t[1].slice(0, -1) : t[1],
        tokens: [],
      };
      return this.lexer.inline(e.text, e.tokens), e;
    }
  }
  text(e) {
    const t = this.rules.block.text.exec(e);
    if (t) {
      const e = { type: 'text', raw: t[0], text: t[0], tokens: [] };
      return this.lexer.inline(e.text, e.tokens), e;
    }
  }
  escape(e) {
    const t = this.rules.inline.escape.exec(e);
    if (t) return { type: 'escape', raw: t[0], text: nn(t[1]) };
  }
  tag(e) {
    const t = this.rules.inline.tag.exec(e);
    if (t)
      return (
        !this.lexer.state.inLink && /^<a /i.test(t[0])
          ? (this.lexer.state.inLink = !0)
          : this.lexer.state.inLink &&
            /^<\/a>/i.test(t[0]) &&
            (this.lexer.state.inLink = !1),
        !this.lexer.state.inRawBlock &&
        /^<(pre|code|kbd|script)(\s|>)/i.test(t[0])
          ? (this.lexer.state.inRawBlock = !0)
          : this.lexer.state.inRawBlock &&
            /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) &&
            (this.lexer.state.inRawBlock = !1),
        {
          type: this.options.sanitize ? 'text' : 'html',
          raw: t[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          text: this.options.sanitize
            ? this.options.sanitizer
              ? this.options.sanitizer(t[0])
              : nn(t[0])
            : t[0],
        }
      );
  }
  link(e) {
    const t = this.rules.inline.link.exec(e);
    if (t) {
      const e = t[2].trim();
      if (!this.options.pedantic && /^</.test(e)) {
        if (!/>$/.test(e)) return;
        const t = en(e.slice(0, -1), '\\');
        if ((e.length - t.length) % 2 == 0) return;
      } else {
        const e = rn(t[2], '()');
        if (e > -1) {
          const n = (0 === t[0].indexOf('!') ? 5 : 4) + t[1].length + e;
          (t[2] = t[2].substring(0, e)),
            (t[0] = t[0].substring(0, n).trim()),
            (t[3] = '');
        }
      }
      let n = t[2],
        r = '';
      if (this.options.pedantic) {
        const e = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n);
        e && ((n = e[1]), (r = e[3]));
      } else r = t[3] ? t[3].slice(1, -1) : '';
      return (
        (n = n.trim()),
        /^</.test(n) &&
          (n =
            this.options.pedantic && !/>$/.test(e)
              ? n.slice(1)
              : n.slice(1, -1)),
        sn(
          t,
          {
            href: n ? n.replace(this.rules.inline._escapes, '$1') : n,
            title: r ? r.replace(this.rules.inline._escapes, '$1') : r,
          },
          t[0],
          this.lexer,
        )
      );
    }
  }
  reflink(e, t) {
    let n;
    if (
      (n = this.rules.inline.reflink.exec(e)) ||
      (n = this.rules.inline.nolink.exec(e))
    ) {
      let e = (n[2] || n[1]).replace(/\s+/g, ' ');
      if (((e = t[e.toLowerCase()]), !e || !e.href)) {
        const e = n[0].charAt(0);
        return { type: 'text', raw: e, text: e };
      }
      return sn(n, e, n[0], this.lexer);
    }
  }
  emStrong(e, t, n = '') {
    let r = this.rules.inline.emStrong.lDelim.exec(e);
    if (!r) return;
    if (r[3] && n.match(/[\p{L}\p{N}]/u)) return;
    const i = r[1] || r[2] || '';
    if (!i || (i && ('' === n || this.rules.inline.punctuation.exec(n)))) {
      const n = r[0].length - 1;
      let i,
        s,
        l = n,
        o = 0;
      const a =
        '*' === r[0][0]
          ? this.rules.inline.emStrong.rDelimAst
          : this.rules.inline.emStrong.rDelimUnd;
      for (
        a.lastIndex = 0, t = t.slice(-1 * e.length + n);
        null != (r = a.exec(t));

      ) {
        if (((i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]), !i)) continue;
        if (((s = i.length), r[3] || r[4])) {
          l += s;
          continue;
        }
        if ((r[5] || r[6]) && n % 3 && !((n + s) % 3)) {
          o += s;
          continue;
        }
        if (((l -= s), l > 0)) continue;
        if (((s = Math.min(s, s + l + o)), Math.min(n, s) % 2)) {
          const t = e.slice(1, n + r.index + s);
          return {
            type: 'em',
            raw: e.slice(0, n + r.index + s + 1),
            text: t,
            tokens: this.lexer.inlineTokens(t, []),
          };
        }
        const t = e.slice(2, n + r.index + s - 1);
        return {
          type: 'strong',
          raw: e.slice(0, n + r.index + s + 1),
          text: t,
          tokens: this.lexer.inlineTokens(t, []),
        };
      }
    }
  }
  codespan(e) {
    const t = this.rules.inline.code.exec(e);
    if (t) {
      let e = t[2].replace(/\n/g, ' ');
      const n = /[^ ]/.test(e),
        r = /^ /.test(e) && / $/.test(e);
      return (
        n && r && (e = e.substring(1, e.length - 1)),
        (e = nn(e, !0)),
        { type: 'codespan', raw: t[0], text: e }
      );
    }
  }
  br(e) {
    const t = this.rules.inline.br.exec(e);
    if (t) return { type: 'br', raw: t[0] };
  }
  del(e) {
    const t = this.rules.inline.del.exec(e);
    if (t)
      return {
        type: 'del',
        raw: t[0],
        text: t[2],
        tokens: this.lexer.inlineTokens(t[2], []),
      };
  }
  autolink(e, t) {
    const n = this.rules.inline.autolink.exec(e);
    if (n) {
      let e, r;
      return (
        '@' === n[2]
          ? ((e = nn(this.options.mangle ? t(n[1]) : n[1])),
            (r = 'mailto:' + e))
          : ((e = nn(n[1])), (r = e)),
        {
          type: 'link',
          raw: n[0],
          text: e,
          href: r,
          tokens: [{ type: 'text', raw: e, text: e }],
        }
      );
    }
  }
  url(e, t) {
    let n;
    if ((n = this.rules.inline.url.exec(e))) {
      let e, r;
      if ('@' === n[2])
        (e = nn(this.options.mangle ? t(n[0]) : n[0])), (r = 'mailto:' + e);
      else {
        let t;
        do {
          (t = n[0]), (n[0] = this.rules.inline._backpedal.exec(n[0])[0]);
        } while (t !== n[0]);
        (e = nn(n[0])), (r = 'www.' === n[1] ? 'http://' + e : e);
      }
      return {
        type: 'link',
        raw: n[0],
        text: e,
        href: r,
        tokens: [{ type: 'text', raw: e, text: e }],
      };
    }
  }
  inlineText(e, t) {
    const n = this.rules.inline.text.exec(e);
    if (n) {
      let e;
      return (
        (e = this.lexer.state.inRawBlock
          ? this.options.sanitize
            ? this.options.sanitizer
              ? this.options.sanitizer(n[0])
              : nn(n[0])
            : n[0]
          : nn(this.options.smartypants ? t(n[0]) : n[0])),
        { type: 'text', raw: n[0], text: e }
      );
    }
  }
};
const { noopTest: on, edit: an, merge: cn } = Gt,
  un = {
    newline: /^(?: *(?:\n|$))+/,
    code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
    fences:
      /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3}bull)( [^\n]+?)?(?:\n|$)/,
    html: '^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))',
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    table: on,
    lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
    _paragraph:
      /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
    text: /^[^\n]+/,
    _label: /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,
    _title: /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/,
  };
(un.def = an(un.def)
  .replace('label', un._label)
  .replace('title', un._title)
  .getRegex()),
  (un.bullet = /(?:[*+-]|\d{1,9}[.)])/),
  (un.listItemStart = an(/^( *)(bull) */)
    .replace('bull', un.bullet)
    .getRegex()),
  (un.list = an(un.list)
    .replace(/bull/g, un.bullet)
    .replace(
      'hr',
      '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))',
    )
    .replace('def', '\\n+(?=' + un.def.source + ')')
    .getRegex()),
  (un._tag =
    'address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul'),
  (un._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/),
  (un.html = an(un.html, 'i')
    .replace('comment', un._comment)
    .replace('tag', un._tag)
    .replace(
      'attribute',
      / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/,
    )
    .getRegex()),
  (un.paragraph = an(un._paragraph)
    .replace('hr', un.hr)
    .replace('heading', ' {0,3}#{1,6} ')
    .replace('|lheading', '')
    .replace('blockquote', ' {0,3}>')
    .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
    .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
    .replace(
      'html',
      '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)',
    )
    .replace('tag', un._tag)
    .getRegex()),
  (un.blockquote = an(un.blockquote)
    .replace('paragraph', un.paragraph)
    .getRegex()),
  (un.normal = cn({}, un)),
  (un.gfm = cn({}, un.normal, {
    table:
      '^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
  })),
  (un.gfm.table = an(un.gfm.table)
    .replace('hr', un.hr)
    .replace('heading', ' {0,3}#{1,6} ')
    .replace('blockquote', ' {0,3}>')
    .replace('code', ' {4}[^\\n]')
    .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
    .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
    .replace(
      'html',
      '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)',
    )
    .replace('tag', un._tag)
    .getRegex()),
  (un.pedantic = cn({}, un.normal, {
    html: an(
      '^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))',
    )
      .replace('comment', un._comment)
      .replace(
        /tag/g,
        '(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b',
      )
      .getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: on,
    paragraph: an(un.normal._paragraph)
      .replace('hr', un.hr)
      .replace('heading', ' *#{1,6} *[^\n]')
      .replace('lheading', un.lheading)
      .replace('blockquote', ' {0,3}>')
      .replace('|fences', '')
      .replace('|list', '')
      .replace('|html', '')
      .getRegex(),
  }));
const hn = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: on,
  tag: '^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  reflinkSearch: 'reflink|nolink(?!\\()',
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    rDelimAst:
      /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
    rDelimUnd:
      /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/,
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: on,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/,
  _punctuation: '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~',
};
(hn.punctuation = an(hn.punctuation)
  .replace(/punctuation/g, hn._punctuation)
  .getRegex()),
  (hn.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g),
  (hn.escapedEmSt = /\\\*|\\_/g),
  (hn._comment = an(un._comment).replace('(?:--\x3e|$)', '--\x3e').getRegex()),
  (hn.emStrong.lDelim = an(hn.emStrong.lDelim)
    .replace(/punct/g, hn._punctuation)
    .getRegex()),
  (hn.emStrong.rDelimAst = an(hn.emStrong.rDelimAst, 'g')
    .replace(/punct/g, hn._punctuation)
    .getRegex()),
  (hn.emStrong.rDelimUnd = an(hn.emStrong.rDelimUnd, 'g')
    .replace(/punct/g, hn._punctuation)
    .getRegex()),
  (hn._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g),
  (hn._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/),
  (hn._email =
    /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/),
  (hn.autolink = an(hn.autolink)
    .replace('scheme', hn._scheme)
    .replace('email', hn._email)
    .getRegex()),
  (hn._attribute =
    /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/),
  (hn.tag = an(hn.tag)
    .replace('comment', hn._comment)
    .replace('attribute', hn._attribute)
    .getRegex()),
  (hn._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/),
  (hn._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/),
  (hn._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/),
  (hn.link = an(hn.link)
    .replace('label', hn._label)
    .replace('href', hn._href)
    .replace('title', hn._title)
    .getRegex()),
  (hn.reflink = an(hn.reflink).replace('label', hn._label).getRegex()),
  (hn.reflinkSearch = an(hn.reflinkSearch, 'g')
    .replace('reflink', hn.reflink)
    .replace('nolink', hn.nolink)
    .getRegex()),
  (hn.normal = cn({}, hn)),
  (hn.pedantic = cn({}, hn.normal, {
    strong: {
      start: /^__|\*\*/,
      middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      endAst: /\*\*(?!\*)/g,
      endUnd: /__(?!_)/g,
    },
    em: {
      start: /^_|\*/,
      middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
      endAst: /\*(?!\*)/g,
      endUnd: /_(?!_)/g,
    },
    link: an(/^!?\[(label)\]\((.*?)\)/)
      .replace('label', hn._label)
      .getRegex(),
    reflink: an(/^!?\[(label)\]\s*\[([^\]]*)\]/)
      .replace('label', hn._label)
      .getRegex(),
  })),
  (hn.gfm = cn({}, hn.normal, {
    escape: an(hn.escape).replace('])', '~|])').getRegex(),
    _extended_email:
      /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal:
      /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
  })),
  (hn.gfm.url = an(hn.gfm.url, 'i')
    .replace('email', hn.gfm._extended_email)
    .getRegex()),
  (hn.breaks = cn({}, hn.gfm, {
    br: an(hn.br).replace('{2,}', '*').getRegex(),
    text: an(hn.gfm.text)
      .replace('\\b_', '\\b_| {2,}\\n')
      .replace(/\{2,\}/g, '*')
      .getRegex(),
  }));
var pn = { block: un, inline: hn };
const dn = ln,
  { defaults: fn } = Dt.exports,
  { block: gn, inline: mn } = pn,
  { repeatString: kn } = Gt;
function xn(e) {
  return e
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1‘')
    .replace(/'/g, '’')
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/\.{3}/g, '…');
}
function bn(e) {
  let t,
    n,
    r = '';
  const i = e.length;
  for (t = 0; t < i; t++)
    (n = e.charCodeAt(t)),
      Math.random() > 0.5 && (n = 'x' + n.toString(16)),
      (r += '&#' + n + ';');
  return r;
}
const { defaults: wn } = Dt.exports,
  { cleanUrl: yn, escape: _n } = Gt;
var vn = class {
    constructor(e) {
      this.options = e || wn;
    }
    code(e, t, n) {
      const r = (t || '').match(/\S*/)[0];
      if (this.options.highlight) {
        const t = this.options.highlight(e, r);
        null != t && t !== e && ((n = !0), (e = t));
      }
      return (
        (e = e.replace(/\n$/, '') + '\n'),
        r
          ? '<pre><code class="' +
            this.options.langPrefix +
            _n(r, !0) +
            '">' +
            (n ? e : _n(e, !0)) +
            '</code></pre>\n'
          : '<pre><code>' + (n ? e : _n(e, !0)) + '</code></pre>\n'
      );
    }
    blockquote(e) {
      return '<blockquote>\n' + e + '</blockquote>\n';
    }
    html(e) {
      return e;
    }
    heading(e, t, n, r) {
      return this.options.headerIds
        ? '<h' +
            t +
            ' id="' +
            this.options.headerPrefix +
            r.slug(n) +
            '">' +
            e +
            '</h' +
            t +
            '>\n'
        : '<h' + t + '>' + e + '</h' + t + '>\n';
    }
    hr() {
      return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
    }
    list(e, t, n) {
      const r = t ? 'ol' : 'ul';
      return (
        '<' +
        r +
        (t && 1 !== n ? ' start="' + n + '"' : '') +
        '>\n' +
        e +
        '</' +
        r +
        '>\n'
      );
    }
    listitem(e) {
      return '<li>' + e + '</li>\n';
    }
    checkbox(e) {
      return (
        '<input ' +
        (e ? 'checked="" ' : '') +
        'disabled="" type="checkbox"' +
        (this.options.xhtml ? ' /' : '') +
        '> '
      );
    }
    paragraph(e) {
      return '<p>' + e + '</p>\n';
    }
    table(e, t) {
      return (
        t && (t = '<tbody>' + t + '</tbody>'),
        '<table>\n<thead>\n' + e + '</thead>\n' + t + '</table>\n'
      );
    }
    tablerow(e) {
      return '<tr>\n' + e + '</tr>\n';
    }
    tablecell(e, t) {
      const n = t.header ? 'th' : 'td';
      return (
        (t.align ? '<' + n + ' align="' + t.align + '">' : '<' + n + '>') +
        e +
        '</' +
        n +
        '>\n'
      );
    }
    strong(e) {
      return '<strong>' + e + '</strong>';
    }
    em(e) {
      return '<em>' + e + '</em>';
    }
    codespan(e) {
      return '<code>' + e + '</code>';
    }
    br() {
      return this.options.xhtml ? '<br/>' : '<br>';
    }
    del(e) {
      return '<del>' + e + '</del>';
    }
    link(e, t, n) {
      if (null === (e = yn(this.options.sanitize, this.options.baseUrl, e)))
        return n;
      let r = '<a href="' + _n(e) + '"';
      return t && (r += ' title="' + t + '"'), (r += '>' + n + '</a>'), r;
    }
    image(e, t, n) {
      if (null === (e = yn(this.options.sanitize, this.options.baseUrl, e)))
        return n;
      let r = '<img src="' + e + '" alt="' + n + '"';
      return (
        t && (r += ' title="' + t + '"'),
        (r += this.options.xhtml ? '/>' : '>'),
        r
      );
    }
    text(e) {
      return e;
    }
  },
  $n = class {
    strong(e) {
      return e;
    }
    em(e) {
      return e;
    }
    codespan(e) {
      return e;
    }
    del(e) {
      return e;
    }
    html(e) {
      return e;
    }
    text(e) {
      return e;
    }
    link(e, t, n) {
      return '' + n;
    }
    image(e, t, n) {
      return '' + n;
    }
    br() {
      return '';
    }
  },
  Sn = class {
    constructor() {
      this.seen = {};
    }
    serialize(e) {
      return e
        .toLowerCase()
        .trim()
        .replace(/<[!\/a-z].*?>/gi, '')
        .replace(
          /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,
          '',
        )
        .replace(/\s/g, '-');
    }
    getNextSafeSlug(e, t) {
      let n = e,
        r = 0;
      if (this.seen.hasOwnProperty(n)) {
        r = this.seen[e];
        do {
          r++, (n = e + '-' + r);
        } while (this.seen.hasOwnProperty(n));
      }
      return t || ((this.seen[e] = r), (this.seen[n] = 0)), n;
    }
    slug(e, t = {}) {
      const n = this.serialize(e);
      return this.getNextSafeSlug(n, t.dryrun);
    }
  };
const zn = vn,
  An = $n,
  jn = Sn,
  { defaults: En } = Dt.exports,
  { unescape: In } = Gt;
const On = class e {
    constructor(e) {
      (this.tokens = []),
        (this.tokens.links = Object.create(null)),
        (this.options = e || fn),
        (this.options.tokenizer = this.options.tokenizer || new dn()),
        (this.tokenizer = this.options.tokenizer),
        (this.tokenizer.options = this.options),
        (this.tokenizer.lexer = this),
        (this.inlineQueue = []),
        (this.state = { inLink: !1, inRawBlock: !1, top: !0 });
      const t = { block: gn.normal, inline: mn.normal };
      this.options.pedantic
        ? ((t.block = gn.pedantic), (t.inline = mn.pedantic))
        : this.options.gfm &&
          ((t.block = gn.gfm),
          this.options.breaks ? (t.inline = mn.breaks) : (t.inline = mn.gfm)),
        (this.tokenizer.rules = t);
    }
    static get rules() {
      return { block: gn, inline: mn };
    }
    static lex(t, n) {
      return new e(n).lex(t);
    }
    static lexInline(t, n) {
      return new e(n).inlineTokens(t);
    }
    lex(e) {
      let t;
      for (
        e = e.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    '),
          this.blockTokens(e, this.tokens);
        (t = this.inlineQueue.shift());

      )
        this.inlineTokens(t.src, t.tokens);
      return this.tokens;
    }
    blockTokens(e, t = []) {
      let n, r, i, s;
      for (this.options.pedantic && (e = e.replace(/^ +$/gm, '')); e; )
        if (
          !(
            this.options.extensions &&
            this.options.extensions.block &&
            this.options.extensions.block.some(
              r =>
                !!(n = r.call({ lexer: this }, e, t)) &&
                ((e = e.substring(n.raw.length)), t.push(n), !0),
            )
          )
        )
          if ((n = this.tokenizer.space(e)))
            (e = e.substring(n.raw.length)), n.type && t.push(n);
          else if ((n = this.tokenizer.code(e)))
            (e = e.substring(n.raw.length)),
              (r = t[t.length - 1]),
              !r || ('paragraph' !== r.type && 'text' !== r.type)
                ? t.push(n)
                : ((r.raw += '\n' + n.raw),
                  (r.text += '\n' + n.text),
                  (this.inlineQueue[this.inlineQueue.length - 1].src = r.text));
          else if ((n = this.tokenizer.fences(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.heading(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.hr(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.blockquote(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.list(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.html(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.def(e)))
            (e = e.substring(n.raw.length)),
              (r = t[t.length - 1]),
              !r || ('paragraph' !== r.type && 'text' !== r.type)
                ? this.tokens.links[n.tag] ||
                  (this.tokens.links[n.tag] = { href: n.href, title: n.title })
                : ((r.raw += '\n' + n.raw),
                  (r.text += '\n' + n.raw),
                  (this.inlineQueue[this.inlineQueue.length - 1].src = r.text));
          else if ((n = this.tokenizer.table(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.lheading(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else {
            if (
              ((i = e),
              this.options.extensions && this.options.extensions.startBlock)
            ) {
              let t = 1 / 0;
              const n = e.slice(1);
              let r;
              this.options.extensions.startBlock.forEach(function (e) {
                (r = e.call({ lexer: this }, n)),
                  'number' == typeof r && r >= 0 && (t = Math.min(t, r));
              }),
                t < 1 / 0 && t >= 0 && (i = e.substring(0, t + 1));
            }
            if (this.state.top && (n = this.tokenizer.paragraph(i)))
              (r = t[t.length - 1]),
                s && 'paragraph' === r.type
                  ? ((r.raw += '\n' + n.raw),
                    (r.text += '\n' + n.text),
                    this.inlineQueue.pop(),
                    (this.inlineQueue[this.inlineQueue.length - 1].src =
                      r.text))
                  : t.push(n),
                (s = i.length !== e.length),
                (e = e.substring(n.raw.length));
            else if ((n = this.tokenizer.text(e)))
              (e = e.substring(n.raw.length)),
                (r = t[t.length - 1]),
                r && 'text' === r.type
                  ? ((r.raw += '\n' + n.raw),
                    (r.text += '\n' + n.text),
                    this.inlineQueue.pop(),
                    (this.inlineQueue[this.inlineQueue.length - 1].src =
                      r.text))
                  : t.push(n);
            else if (e) {
              const t = 'Infinite loop on byte: ' + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(t);
                break;
              }
              throw new Error(t);
            }
          }
      return (this.state.top = !0), t;
    }
    inline(e, t) {
      this.inlineQueue.push({ src: e, tokens: t });
    }
    inlineTokens(e, t = []) {
      let n,
        r,
        i,
        s,
        l,
        o,
        a = e;
      if (this.tokens.links) {
        const e = Object.keys(this.tokens.links);
        if (e.length > 0)
          for (
            ;
            null != (s = this.tokenizer.rules.inline.reflinkSearch.exec(a));

          )
            e.includes(s[0].slice(s[0].lastIndexOf('[') + 1, -1)) &&
              (a =
                a.slice(0, s.index) +
                '[' +
                kn('a', s[0].length - 2) +
                ']' +
                a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
      }
      for (; null != (s = this.tokenizer.rules.inline.blockSkip.exec(a)); )
        a =
          a.slice(0, s.index) +
          '[' +
          kn('a', s[0].length - 2) +
          ']' +
          a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      for (; null != (s = this.tokenizer.rules.inline.escapedEmSt.exec(a)); )
        a =
          a.slice(0, s.index) +
          '++' +
          a.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
      for (; e; )
        if (
          (l || (o = ''),
          (l = !1),
          !(
            this.options.extensions &&
            this.options.extensions.inline &&
            this.options.extensions.inline.some(
              r =>
                !!(n = r.call({ lexer: this }, e, t)) &&
                ((e = e.substring(n.raw.length)), t.push(n), !0),
            )
          ))
        )
          if ((n = this.tokenizer.escape(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.tag(e)))
            (e = e.substring(n.raw.length)),
              (r = t[t.length - 1]),
              r && 'text' === n.type && 'text' === r.type
                ? ((r.raw += n.raw), (r.text += n.text))
                : t.push(n);
          else if ((n = this.tokenizer.link(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.reflink(e, this.tokens.links)))
            (e = e.substring(n.raw.length)),
              (r = t[t.length - 1]),
              r && 'text' === n.type && 'text' === r.type
                ? ((r.raw += n.raw), (r.text += n.text))
                : t.push(n);
          else if ((n = this.tokenizer.emStrong(e, a, o)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.codespan(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.br(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.del(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.autolink(e, bn)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if (this.state.inLink || !(n = this.tokenizer.url(e, bn))) {
            if (
              ((i = e),
              this.options.extensions && this.options.extensions.startInline)
            ) {
              let t = 1 / 0;
              const n = e.slice(1);
              let r;
              this.options.extensions.startInline.forEach(function (e) {
                (r = e.call({ lexer: this }, n)),
                  'number' == typeof r && r >= 0 && (t = Math.min(t, r));
              }),
                t < 1 / 0 && t >= 0 && (i = e.substring(0, t + 1));
            }
            if ((n = this.tokenizer.inlineText(i, xn)))
              (e = e.substring(n.raw.length)),
                '_' !== n.raw.slice(-1) && (o = n.raw.slice(-1)),
                (l = !0),
                (r = t[t.length - 1]),
                r && 'text' === r.type
                  ? ((r.raw += n.raw), (r.text += n.text))
                  : t.push(n);
            else if (e) {
              const t = 'Infinite loop on byte: ' + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(t);
                break;
              }
              throw new Error(t);
            }
          } else (e = e.substring(n.raw.length)), t.push(n);
      return t;
    }
  },
  Tn = class e {
    constructor(e) {
      (this.options = e || En),
        (this.options.renderer = this.options.renderer || new zn()),
        (this.renderer = this.options.renderer),
        (this.renderer.options = this.options),
        (this.textRenderer = new An()),
        (this.slugger = new jn());
    }
    static parse(t, n) {
      return new e(n).parse(t);
    }
    static parseInline(t, n) {
      return new e(n).parseInline(t);
    }
    parse(e, t = !0) {
      let n,
        r,
        i,
        s,
        l,
        o,
        a,
        c,
        u,
        h,
        p,
        d,
        f,
        g,
        m,
        k,
        x,
        b,
        w,
        y = '';
      const _ = e.length;
      for (n = 0; n < _; n++)
        if (
          ((h = e[n]),
          this.options.extensions &&
            this.options.extensions.renderers &&
            this.options.extensions.renderers[h.type] &&
            ((w = this.options.extensions.renderers[h.type].call(
              { parser: this },
              h,
            )),
            !1 !== w ||
              ![
                'space',
                'hr',
                'heading',
                'code',
                'table',
                'blockquote',
                'list',
                'html',
                'paragraph',
                'text',
              ].includes(h.type)))
        )
          y += w || '';
        else
          switch (h.type) {
            case 'space':
              continue;
            case 'hr':
              y += this.renderer.hr();
              continue;
            case 'heading':
              y += this.renderer.heading(
                this.parseInline(h.tokens),
                h.depth,
                In(this.parseInline(h.tokens, this.textRenderer)),
                this.slugger,
              );
              continue;
            case 'code':
              y += this.renderer.code(h.text, h.lang, h.escaped);
              continue;
            case 'table':
              for (c = '', a = '', s = h.header.length, r = 0; r < s; r++)
                a += this.renderer.tablecell(
                  this.parseInline(h.header[r].tokens),
                  { header: !0, align: h.align[r] },
                );
              for (
                c += this.renderer.tablerow(a),
                  u = '',
                  s = h.rows.length,
                  r = 0;
                r < s;
                r++
              ) {
                for (o = h.rows[r], a = '', l = o.length, i = 0; i < l; i++)
                  a += this.renderer.tablecell(this.parseInline(o[i].tokens), {
                    header: !1,
                    align: h.align[i],
                  });
                u += this.renderer.tablerow(a);
              }
              y += this.renderer.table(c, u);
              continue;
            case 'blockquote':
              (u = this.parse(h.tokens)), (y += this.renderer.blockquote(u));
              continue;
            case 'list':
              for (
                p = h.ordered,
                  d = h.start,
                  f = h.loose,
                  s = h.items.length,
                  u = '',
                  r = 0;
                r < s;
                r++
              )
                (m = h.items[r]),
                  (k = m.checked),
                  (x = m.task),
                  (g = ''),
                  m.task &&
                    ((b = this.renderer.checkbox(k)),
                    f
                      ? m.tokens.length > 0 && 'paragraph' === m.tokens[0].type
                        ? ((m.tokens[0].text = b + ' ' + m.tokens[0].text),
                          m.tokens[0].tokens &&
                            m.tokens[0].tokens.length > 0 &&
                            'text' === m.tokens[0].tokens[0].type &&
                            (m.tokens[0].tokens[0].text =
                              b + ' ' + m.tokens[0].tokens[0].text))
                        : m.tokens.unshift({ type: 'text', text: b })
                      : (g += b)),
                  (g += this.parse(m.tokens, f)),
                  (u += this.renderer.listitem(g, x, k));
              y += this.renderer.list(u, p, d);
              continue;
            case 'html':
              y += this.renderer.html(h.text);
              continue;
            case 'paragraph':
              y += this.renderer.paragraph(this.parseInline(h.tokens));
              continue;
            case 'text':
              for (
                u = h.tokens ? this.parseInline(h.tokens) : h.text;
                n + 1 < _ && 'text' === e[n + 1].type;

              )
                (h = e[++n]),
                  (u +=
                    '\n' + (h.tokens ? this.parseInline(h.tokens) : h.text));
              y += t ? this.renderer.paragraph(u) : u;
              continue;
            default: {
              const e = 'Token with "' + h.type + '" type was not found.';
              if (this.options.silent) return void console.error(e);
              throw new Error(e);
            }
          }
      return y;
    }
    parseInline(e, t) {
      t = t || this.renderer;
      let n,
        r,
        i,
        s = '';
      const l = e.length;
      for (n = 0; n < l; n++)
        if (
          ((r = e[n]),
          this.options.extensions &&
            this.options.extensions.renderers &&
            this.options.extensions.renderers[r.type] &&
            ((i = this.options.extensions.renderers[r.type].call(
              { parser: this },
              r,
            )),
            !1 !== i ||
              ![
                'escape',
                'html',
                'link',
                'image',
                'strong',
                'em',
                'codespan',
                'br',
                'del',
                'text',
              ].includes(r.type)))
        )
          s += i || '';
        else
          switch (r.type) {
            case 'escape':
              s += t.text(r.text);
              break;
            case 'html':
              s += t.html(r.text);
              break;
            case 'link':
              s += t.link(r.href, r.title, this.parseInline(r.tokens, t));
              break;
            case 'image':
              s += t.image(r.href, r.title, r.text);
              break;
            case 'strong':
              s += t.strong(this.parseInline(r.tokens, t));
              break;
            case 'em':
              s += t.em(this.parseInline(r.tokens, t));
              break;
            case 'codespan':
              s += t.codespan(r.text);
              break;
            case 'br':
              s += t.br();
              break;
            case 'del':
              s += t.del(this.parseInline(r.tokens, t));
              break;
            case 'text':
              s += t.text(r.text);
              break;
            default: {
              const e = 'Token with "' + r.type + '" type was not found.';
              if (this.options.silent) return void console.error(e);
              throw new Error(e);
            }
          }
      return s;
    }
  },
  Dn = ln,
  Rn = vn,
  Mn = $n,
  Cn = Sn,
  { merge: Fn, checkSanitizeDeprecation: Pn, escape: Nn } = Gt,
  { getDefaults: qn, changeDefaults: Ln, defaults: Vn } = Dt.exports;
function Bn(e, t, n) {
  if (null == e)
    throw new Error('marked(): input parameter is undefined or null');
  if ('string' != typeof e)
    throw new Error(
      'marked(): input parameter is of type ' +
        Object.prototype.toString.call(e) +
        ', string expected',
    );
  if (
    ('function' == typeof t && ((n = t), (t = null)),
    (t = Fn({}, Bn.defaults, t || {})),
    Pn(t),
    n)
  ) {
    const i = t.highlight;
    let s;
    try {
      s = On.lex(e, t);
    } catch (r) {
      return n(r);
    }
    const l = function (e) {
      let l;
      if (!e)
        try {
          t.walkTokens && Bn.walkTokens(s, t.walkTokens), (l = Tn.parse(s, t));
        } catch (r) {
          e = r;
        }
      return (t.highlight = i), e ? n(e) : n(null, l);
    };
    if (!i || i.length < 3) return l();
    if ((delete t.highlight, !s.length)) return l();
    let o = 0;
    return (
      Bn.walkTokens(s, function (e) {
        'code' === e.type &&
          (o++,
          setTimeout(() => {
            i(e.text, e.lang, function (t, n) {
              if (t) return l(t);
              null != n && n !== e.text && ((e.text = n), (e.escaped = !0)),
                o--,
                0 === o && l();
            });
          }, 0));
      }),
      void (0 === o && l())
    );
  }
  try {
    const n = On.lex(e, t);
    return t.walkTokens && Bn.walkTokens(n, t.walkTokens), Tn.parse(n, t);
  } catch (r) {
    if (
      ((r.message +=
        '\nPlease report this to https://github.com/markedjs/marked.'),
      t.silent)
    )
      return (
        '<p>An error occurred:</p><pre>' + Nn(r.message + '', !0) + '</pre>'
      );
    throw r;
  }
}
(Bn.options = Bn.setOptions =
  function (e) {
    return Fn(Bn.defaults, e), Ln(Bn.defaults), Bn;
  }),
  (Bn.getDefaults = qn),
  (Bn.defaults = Vn),
  (Bn.use = function (...e) {
    const t = Fn({}, ...e),
      n = Bn.defaults.extensions || { renderers: {}, childTokens: {} };
    let r;
    e.forEach(e => {
      if (
        (e.extensions &&
          ((r = !0),
          e.extensions.forEach(e => {
            if (!e.name) throw new Error('extension name required');
            if (e.renderer) {
              const t = n.renderers ? n.renderers[e.name] : null;
              n.renderers[e.name] = t
                ? function (...n) {
                    let r = e.renderer.apply(this, n);
                    return !1 === r && (r = t.apply(this, n)), r;
                  }
                : e.renderer;
            }
            if (e.tokenizer) {
              if (!e.level || ('block' !== e.level && 'inline' !== e.level))
                throw new Error("extension level must be 'block' or 'inline'");
              n[e.level]
                ? n[e.level].unshift(e.tokenizer)
                : (n[e.level] = [e.tokenizer]),
                e.start &&
                  ('block' === e.level
                    ? n.startBlock
                      ? n.startBlock.push(e.start)
                      : (n.startBlock = [e.start])
                    : 'inline' === e.level &&
                      (n.startInline
                        ? n.startInline.push(e.start)
                        : (n.startInline = [e.start])));
            }
            e.childTokens && (n.childTokens[e.name] = e.childTokens);
          })),
        e.renderer)
      ) {
        const n = Bn.defaults.renderer || new Rn();
        for (const t in e.renderer) {
          const r = n[t];
          n[t] = (...i) => {
            let s = e.renderer[t].apply(n, i);
            return !1 === s && (s = r.apply(n, i)), s;
          };
        }
        t.renderer = n;
      }
      if (e.tokenizer) {
        const n = Bn.defaults.tokenizer || new Dn();
        for (const t in e.tokenizer) {
          const r = n[t];
          n[t] = (...i) => {
            let s = e.tokenizer[t].apply(n, i);
            return !1 === s && (s = r.apply(n, i)), s;
          };
        }
        t.tokenizer = n;
      }
      if (e.walkTokens) {
        const n = Bn.defaults.walkTokens;
        t.walkTokens = t => {
          e.walkTokens.call(this, t), n && n(t);
        };
      }
      r && (t.extensions = n), Bn.setOptions(t);
    });
  }),
  (Bn.walkTokens = function (e, t) {
    for (const n of e)
      switch ((t(n), n.type)) {
        case 'table':
          for (const e of n.header) Bn.walkTokens(e.tokens, t);
          for (const e of n.rows) for (const n of e) Bn.walkTokens(n.tokens, t);
          break;
        case 'list':
          Bn.walkTokens(n.items, t);
          break;
        default:
          Bn.defaults.extensions &&
          Bn.defaults.extensions.childTokens &&
          Bn.defaults.extensions.childTokens[n.type]
            ? Bn.defaults.extensions.childTokens[n.type].forEach(function (e) {
                Bn.walkTokens(n[e], t);
              })
            : n.tokens && Bn.walkTokens(n.tokens, t);
      }
  }),
  (Bn.parseInline = function (e, t) {
    if (null == e)
      throw new Error(
        'marked.parseInline(): input parameter is undefined or null',
      );
    if ('string' != typeof e)
      throw new Error(
        'marked.parseInline(): input parameter is of type ' +
          Object.prototype.toString.call(e) +
          ', string expected',
      );
    (t = Fn({}, Bn.defaults, t || {})), Pn(t);
    try {
      const n = On.lexInline(e, t);
      return (
        t.walkTokens && Bn.walkTokens(n, t.walkTokens), Tn.parseInline(n, t)
      );
    } catch (n) {
      if (
        ((n.message +=
          '\nPlease report this to https://github.com/markedjs/marked.'),
        t.silent)
      )
        return (
          '<p>An error occurred:</p><pre>' + Nn(n.message + '', !0) + '</pre>'
        );
      throw n;
    }
  }),
  (Bn.Parser = Tn),
  (Bn.parser = Tn.parse),
  (Bn.Renderer = Rn),
  (Bn.TextRenderer = Mn),
  (Bn.Lexer = On),
  (Bn.lexer = On.lex),
  (Bn.Tokenizer = Dn),
  (Bn.Slugger = Cn),
  (Bn.parse = Bn);
var Zn = Bn;
export {
  z as $,
  H as A,
  o as B,
  Oe as C,
  G as D,
  Z as E,
  v as F,
  f as G,
  g as H,
  x as I,
  b as J,
  k as K,
  j as L,
  P as M,
  l as N,
  W as O,
  T as P,
  u as Q,
  we as R,
  Ee as S,
  K as T,
  be as U,
  Y as V,
  ke as W,
  xe as X,
  V as Y,
  mt as Z,
  Me as _,
  R as a,
  h as a0,
  Te as a1,
  Et as a2,
  B as a3,
  Zn as a4,
  D as b,
  F as c,
  S as d,
  A as e,
  $ as f,
  N as g,
  L as h,
  je as i,
  ve as j,
  I as k,
  O as l,
  $e as m,
  q as n,
  Se as o,
  ye as p,
  _e as q,
  de as r,
  p as s,
  E as t,
  me as u,
  ze as v,
  fe as w,
  ge as x,
  X as y,
  J as z,
};
