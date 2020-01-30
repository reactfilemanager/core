function viewport() {
  const w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
  return {
    width: x,
    height: y,
  };
}

function fuzzySearch(needle, haystack) {
  needle = needle.toLowerCase();
  haystack = haystack.toLowerCase();
  const hLen = haystack.length;
  const nLen = needle.length;
  if (nLen > hLen) {
    return false;
  }
  if (nLen === hLen) {
    return needle === haystack;
  }
  outer: for (let i = 0, j = 0; i < nLen; i++) {
    const nch = needle.charCodeAt(i);
    while (j < hLen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

export {
  viewport,
  fuzzySearch,
};

export default {};
