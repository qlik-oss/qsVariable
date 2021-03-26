/*global define*/
define(['./lib/encoder'], function (encoder) {
  'use strict';

  function createElement(tag, cls, html) {
    var el = document.createElement(tag);
    if (cls) {
      el.className = cls;
    }
    if (html !== undefined) {
      html = encoder.encodeForHTML(html);
      el.innerHTML = html;
    }
    return el;
  }

  function setChild(el, ch) {
    if (el.childNodes.length === 0) {
      el.appendChild(ch);
    } else {
      el.replaceChild(ch, el.childNodes[0]);
    }
  }

  function setPointerEvents(el, canInteract) {
    el.style.pointerEvents = canInteract ? 'auto' : 'none';
  }

  return {
    createElement: createElement,
    setChild: setChild,
    setPointerEvents: setPointerEvents,
  };
});
