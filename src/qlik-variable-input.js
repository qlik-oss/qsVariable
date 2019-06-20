/**
 * @license
 * Copyright (c) 2015 Erik Wetterberg. All rights reserved.
 * 
 * Copyrights licensed under the terms of the MIT license.
 * Original source <https://github.com/erikwett/qsVariable>
 */
/*global define*/
define(['jquery', 'qlik', './util', './properties', './style.less'], function ($, qlik, util, prop, css) {
  'use strict';

  $("<style>").html(css).appendTo("head");

  function calcPercent(el) {
    return (el.value - el.min) * 100 / (el.max - el.min);
  }

  var allowSetVariable = true;
  var setVariableRateLimitMS = 100;
  var lastValueSet;
  var lastValueNotSet;

  function setVariableValue(ext, name, value) {
    if (!allowSetVariable) {
      lastValueNotSet = value;
      return;
    }
    allowSetVariable = false;
    lastValueSet = value;
    lastValueNotSet = null;
    qlik.currApp(ext).variable.setStringValue(name, value);
    setTimeout(function () {
      allowSetVariable = true;
      if (lastValueNotSet && lastValueNotSet != lastValueSet) {
        setVariableValue(ext, name, lastValueNotSet);
      }
    }, setVariableRateLimitMS);
  }

  function getVariableValue(layout) {
    var T = typeof (layout.variableValue);
    if (T == "object" || T == "undefined") {
      return "";
    } else {
      return layout.variableValue;
    }
  }

  function getNumber(value, defaultVal) {
    var T = parseFloat(value);
    if (isNaN(T)) {
      return defaultVal;
    } else {
      return T;
    }
  }

  function getClass(style, type, selected) {
    switch (style) {
      case 'material':
      case 'bootstrap':
        if (selected) {
          return 'selected';
        }
        break;
      default:
        switch (type) {
          case 'button':
            var Def = "lui-button ";
            return Def + (selected ? " lui-active" : "");
            //return selected ? 'qui-button-selected lui-button lui-button--success' : 'qui-button lui-button';
          case 'select':
            return 'qui-select lui-select';
          case 'input':
            return 'qui-input lui-input';
          case 'button_text':
            return 'lui-button__text item-title';
        }
    }
  }

  function getWidth(layout) {
    if (layout.render === 'l') {
      return '98%';
    }
    if (layout.render === 'b') {
      if (layout.buttonMode === 'colfill') {
        return '100%';
      }
      var len = Math.max(1, getAlternativesCount(layout));
      return 'calc( ' + 100 / len + '% - 3px)';
    }
    return '100%';
  }

  function setLabel(slider) {
    if (slider.label) {
      {
        var T = $(slider.label).outerWidth();
        var S = $(slider.label.parentElement).width();
        var Offset = 100 * (T / S);
        var Cal = calcPercent(slider);
        if ((Cal + Offset) > 104) {
          Cal = 104 - Offset;
        }
        slider.label.style.left = Cal + "%";
        //slider.label.style.left = calcPercent(slider) + '%';
      }
      slider.label.textContent = slider.value;
    } else {
      slider.title = slider.value;
    }
  }

  function getAlternatives(text) {
    return text.split('|').map(function (item) {
      var arr = item.split('~');
      return {
        value: arr[0],
        label: arr.length > 1 ? arr[1] : arr[0]
      };
    });
  }

  function getAlternativesCount(layout) {
    var Tmp = layout.valueType === 'd' ? getAlternatives(layout.dynamicvalues) : layout.alternatives;
    return Tmp.length;
  }

  function showValue(element, layout) {
    // find elements
    var elements = element.querySelectorAll('input, button, option');

    for (var index = 0; index < elements.length; index++) {
      var el = elements[index];
      switch (el.tagName) {
        case 'INPUT':
          el.value = getVariableValue(layout);
          setLabel(el);
          break;
        case 'OPTION':
          el.selected = (el.value === layout.variableValue);
          break;
        case 'BUTTON':
          el.className = getClass(layout.style, 'button', el.dataset.value === layout.variableValue);
          break;
        default:
          console.log('showValue', el); // eslint-disable-line no-console
      }
    }
  }
  return {
    initialProperties: prop.initialProperties,
    definition: prop.definition,
    support: prop.support,
    paint: function ($element, layout) {
      var canInterAct = this.$scope.options.interactionState === 1;
      util.setPointerEvents($element[0], canInterAct);
      if (layout.thinHeader) {
        $element.closest('.qv-object-variable').addClass('thin-header');
      } else {
        $element.closest('.qv-object-variable').removeClass('thin-header');
      }
      if (this.oldSetup && !this.oldSetup.changed(layout)) {
        showValue($element[0], layout);
        return qlik.Promise.resolve();
      }
      this.oldSetup = prop.cloneSetup(layout);
      var wrapper = util.createElement('div', layout.style || 'qlik'),
        width = getWidth(layout),
        alternatives
          = layout.valueType === 'd' ? getAlternatives(layout.dynamicvalues) : layout.alternatives,
        ext = this;

      if (layout.render === 'b') {
        alternatives.forEach(function (alt) {
          var btn = util.createElement(
            'button', getClass(layout.style, 'button', alt.value === layout.variableValue), '');
          var txtSpan = util.createElement(
            'span', getClass(layout.style, 'button_text', false), alt.label);
          btn.appendChild(txtSpan);

          btn.onclick = function () {
            setVariableValue(ext, layout.variableName, alt.value);
          };
          btn.dataset.value = alt.value;
          btn.style.width = width;
          wrapper.appendChild(btn);
        });
      } else if (layout.render === 's') {
        var sel = util.createElement('select', getClass(layout.style, 'select'));
        sel.style.width = width;
        alternatives.forEach(function (alt) {
          var opt = util.createElement('option', undefined, alt.label);
          opt.value = alt.value;
          opt.selected = alt.value === layout.variableValue;
          sel.appendChild(opt);
        });
        sel.onchange = function () {
          setVariableValue(ext, layout.variableName, this.value);
        };
        wrapper.appendChild(sel);
      } else if (layout.render === 'l') {
        var range = util.createElement('input');
        range.style.width = width;
        range.type = 'range';
        var Min = getNumber(layout.min, 0);
        var Max = getNumber(layout.max, 100);
        var Step = Math.abs(getNumber(layout.step, 1)); 	// negative step does not work in HTML 5 as of 2018

        if (Min > Max) {
          var T = Max;
          Max = Min;
          Min = T;
        }

        range.min = Min;
        range.max = Max;
        range.step = Step;
        range.value = layout.variableValue;

        var rangeKeyListener = function () {
          window.requestAnimationFrame(function () {
            setLabel(range);
            setVariableValue(ext, layout.variableName, range.value);
          });
        };

        range.addEventListener("keydown", rangeKeyListener);

        var rangeListener = function () {
          window.requestAnimationFrame(function () {
            setLabel(range);
            if (layout.updateondrag) {
              setVariableValue(ext, layout.variableName, range.value);
            }
          });
        };

        range.addEventListener("mousedown", function () {
          setLabel(range);
          rangeListener();
          range.addEventListener("mousemove", rangeListener);
        });

        range.addEventListener("mouseup", function () {
          setLabel(range);
          setVariableValue(ext, layout.variableName, range.value);
          range.removeEventListener("mousemove", rangeListener);
        });

        wrapper.appendChild(range);
        if (layout.rangelabel) {
          var labelwrap = util.createElement('div', 'labelwrap');
          range.label = util.createElement('div', 'rangelabel', layout.variableValue);
          labelwrap.appendChild(range.label);
          wrapper.appendChild(labelwrap);
        }
        setLabel(range);
      } else {
        var fld = util.createElement('input', getClass(layout.style, 'input'));
        fld.style.width = width;
        fld.type = 'text';
        fld.value = getVariableValue(layout);
        fld.onchange = function () {
          setVariableValue(ext, layout.variableName, this.value);
        };
        wrapper.appendChild(fld);
      }
      util.setChild($element[0], wrapper);
      return qlik.Promise.resolve();
    }
  };
});
