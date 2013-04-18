/*
 * Copyright (c) 2013-2013, John Mettraux, jmettraux@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Made in Japan.
 */

var Caboche = (function() {

  var VERSION = '1.1.0';

  //var self = this;

  var ie = /MSIE/.test(navigator.userAgent);

  var execQueue = [];
  var loadCount = 0;

  var callbacks = [];

  function create(tag, attributes) {

    var e = document.createElement(tag);
    for (var k in attributes) { e[k] = attributes[k]; }

    return e;
  };

  function executeNext(loaded) {

    if (loaded) loadCount = loadCount - 1;
    if (loadCount > 0) return;

    var item = execQueue.shift();

    if ( ! item) { // global callbacks
      var cb = callbacks.shift();
      if ( ! cb) return; // loading and executing over.
      cb();
      executeNext(null);
    }
    else if ((typeof item) === 'string') {
      var s = document.createElement('script');
      s.src = item;
      s.onload = s.onerror = function() { executeNext(null); };
      document.getElementsByTagName('head')[0].appendChild(s);
    }
    else { // sequential callback
      item();
      executeNext(null);
    }
  }

  // Mostly inspired from https://gist.github.com/mathiasbynens/375496
  //
  function load(src) {

    loadCount = loadCount + 1;

    var e;
    if (ie) {
      e = document.createElement('img');
      e.src = src;
    }
    else {
      e = document.createElement('object');
      e.data = src;
      e.setAttribute('style', 'border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px;');
    }
    e.addEventListener('load', function() { executeNext(src); });
    if ( ! ie) document.body.appendChild(e);
  }

  // Initiates the preload of the arguments immediately, queues
  // their execution.
  //
  this.require = function() {

    for (var i in arguments) {
      var arg = arguments[i];
      execQueue.push(arg);
      if ((typeof arg) === 'string') load(arg);
    }
  };

  // Registers a callback to run once all the scripts have loaded and
  // executed.
  // May be called multiple times.
  //
  this.ready = function(callback) {

    callbacks.push(callback);
  };

  //
  // over.

  return this;

}).apply({});

