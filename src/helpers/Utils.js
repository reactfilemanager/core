import {toast} from 'react-toastify';

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

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const EventBus = {
  listeners: {},
  $on(type, handler) {
    const $on = (type, handler) => {
      if (!this.listeners[type]) {
        this.listeners[type] = [];
      }
      this.listeners[type].push(handler);
    };

    if (Array.isArray(type)) {
      for (const _type of type) {
        $on(_type, handler);
      }
    }
    else {
      $on(type, handler);
    }
  },
  $off(type, handler) {
    const $off = (type, handler) => {
      if (!this.listeners[type]) {
        return;
      }

      const index = this.listeners[type].indexOf(handler);
      if(index<0) {
        return;
      }

      this.listeners[type].splice(index, 1);
    };

    if (Array.isArray(type)) {
      for (const _type of type) {
        $off(_type, handler);
      }
    }
    else {
      $off(type, handler);
    }
  },
  $emit(type, payload) {
    if (!this.listeners[type]) {
      return;
    }
    for (const handler of this.listeners[type]) {
      handler(payload);
    }
  },
};

const getImageDimensionAsync = imageUrl => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = e => {
      resolve({width: image.width, height: image.height});
    };
    image.onerror = e => {
      reject(e);
    };
    image.src = imageUrl;
  });
};

const SmoothScroll = {
  timer: null,

  stop: function() {
    clearTimeout(this.timer);
  },

  scrollTo: function(id, callback) {
    const settings = {
      duration: 1000,
      easing: {
        outQuint: function(x, t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
      },
    };
    let percentage;
    let startTime;
    const node = document.getElementById(id);
    const nodeTop = node.offsetTop;
    const nodeHeight = node.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
    );
    const windowHeight = window.innerHeight;
    const offset = window.pageYOffset;
    const delta = nodeTop - offset;
    const bottomScrollableY = height - windowHeight;
    const targetY = (bottomScrollableY < delta) ?
        bottomScrollableY - (height - nodeTop - nodeHeight + offset) :
        delta;

    startTime = Date.now();
    percentage = 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    function step() {
      let yScroll;
      const elapsed = Date.now() - startTime;

      if (elapsed > settings.duration) {
        clearTimeout(this.timer);
      }

      percentage = elapsed / settings.duration;

      if (percentage > 1) {
        clearTimeout(this.timer);

        if (callback) {
          callback();
        }
      }
      else {
        yScroll = settings.easing.outQuint(0, elapsed, offset, targetY,
            settings.duration);
        window.scrollTo(0, yScroll);
        this.timer = setTimeout(step, 10);
      }
    }

    this.timer = setTimeout(step, 10);
  },
};

export {
  viewport,
  fuzzySearch,
  uuidv4,
  EventBus,
  getImageDimensionAsync,
  SmoothScroll,
};

export default {};
