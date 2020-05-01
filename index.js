const uid = (function() {
  let id = 1;
  return () => id++;
})();

function assign(to, from) {
  for (let i = 0, k = Object.keys(from); i < k.length; i++) {
    to[k] = from[k]
  }
  return to;
}

function getCoordinates(element) {
  const el = element.getBoundingClientRect();

  return {
    x: el.top + pageYOffset,
    y: el.left + pageXOffset
  };

}

function customEvent(name) {
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(name, false, false, 0);
  return e;
}

function createEvent(type, x, y) {
  const e = new UIEvent(type, {
    bubbles: true,
    cancelable: false,
    detail: 1
  });
  const touch = customEvent('touch');
  assign(touch, {
    identifier: uid(),
    screenX: x,
    screenY: y,
    clientX: x,
    clientY: y,
    pageX: x + document.body.scrollLeft,
    pageY: y + document.body.scrollTop
  });
  e.changedTouches = [touch];
  e.targetTouches = [touch];
  e.touches = [touch];
  return e;
}

function simulateClick(target) {
  const { x, y } = getCoordinates(target);
  const eventStart = createEvent('touchstart', x, y);
  const eventStop = createEvent('touchend', x, y);
  target.dispatchEvent(eventStart);
  setTimeout(() => target.dispatchEvent(eventStop), 1);
}

let prevNumber = 1;
function goLoop() {
  const numbers = Array.from(document.getElementById('grid').children);
  if (prevNumber < 51 && numbers) {
    for (let i = prevNumber; i <= 50; i++) {
      (function(i) {
        setTimeout(() => {
          const filtered = numbers.find(number => {
            if (parseInt(number.innerText, 10) === i) {
              simulateClick(number);
              return number;
            }
          });
          if (!filtered) {
            prevNumber = i;
            goLoop();
          }
        }, 100);
      })(i);
    }
    prevNumber++;
  }
}

goLoop();
