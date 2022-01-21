import {
  S as s,
  i as n,
  s as a,
  j as t,
  m as e,
  o,
  N as r,
  x as m,
  u as c,
  v as i,
} from '../chunks/vendor-74fb33b7.js';
import u from './home/index.svelte-6c5a235b.js';
import '../chunks/navigation-86cde1c3.js';
import '../chunks/singletons-12a22614.js';
import '../chunks/Icon-b25d6312.js';
function f(s) {
  let n, a;
  return (
    (n = new u({})),
    {
      c() {
        t(n.$$.fragment);
      },
      l(s) {
        e(n.$$.fragment, s);
      },
      m(s, t) {
        o(n, s, t), (a = !0);
      },
      p: r,
      i(s) {
        a || (m(n.$$.fragment, s), (a = !0));
      },
      o(s) {
        c(n.$$.fragment, s), (a = !1);
      },
      d(s) {
        i(n, s);
      },
    }
  );
}
class l extends s {
  constructor(s) {
    super(), n(this, s, null, f, a, {});
  }
}
export { l as default };
