import {
  S as e,
  i as s,
  s as r,
  L as i,
  M as o,
  a as t,
  d as l,
  b as n,
  f as a,
  F as h,
  N as c,
} from './vendor-74fb33b7.js';
function d(e) {
  let s, r, d, f, u;
  return {
    c() {
      (s = i('svg')), (r = i('use')), this.h();
    },
    l(e) {
      s = o(e, 'svg', {
        class: !0,
        fill: !0,
        stroke: !0,
        'stroke-width': !0,
        'stroke-linecap': !0,
        'stroke-linejoin': !0,
        width: !0,
        height: !0,
      });
      var i = t(s);
      (r = o(i, 'use', { href: !0 })), t(r).forEach(l), i.forEach(l), this.h();
    },
    h() {
      var i;
      n(r, 'href', (d = `feather-sprite.svg#${e[0]}`)),
        n(s, 'class', 'Icon'),
        n(s, 'fill', (f = e[2] ? e[1] : ' none')),
        n(s, 'stroke', (u = null != (i = e[1]) ? i : 'currentColor')),
        n(s, 'stroke-width', '2'),
        n(s, 'stroke-linecap', 'round'),
        n(s, 'stroke-linejoin', 'round'),
        n(s, 'width', e[3]),
        n(s, 'height', e[3]);
    },
    m(e, i) {
      a(e, s, i), h(s, r);
    },
    p(e, [i]) {
      var o;
      1 & i && d !== (d = `feather-sprite.svg#${e[0]}`) && n(r, 'href', d),
        6 & i && f !== (f = e[2] ? e[1] : ' none') && n(s, 'fill', f),
        2 & i &&
          u !== (u = null != (o = e[1]) ? o : 'currentColor') &&
          n(s, 'stroke', u),
        8 & i && n(s, 'width', e[3]),
        8 & i && n(s, 'height', e[3]);
    },
    i: c,
    o: c,
    d(e) {
      e && l(s);
    },
  };
}
function f(e, s, r) {
  let { id: i } = s,
    { color: o } = s,
    { filled: t = !1 } = s,
    { size: l = '1em' } = s;
  return (
    (e.$$set = e => {
      'id' in e && r(0, (i = e.id)),
        'color' in e && r(1, (o = e.color)),
        'filled' in e && r(2, (t = e.filled)),
        'size' in e && r(3, (l = e.size));
    }),
    [i, o, t, l]
  );
}
class u extends e {
  constructor(e) {
    super(), s(this, e, f, d, r, { id: 0, color: 1, filled: 2, size: 3 });
  }
}
export { u as I };
