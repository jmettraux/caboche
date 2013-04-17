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

  var VERSION = '1.0.0';

  //var self = this;

  var loadCount = 0;
  var callbacks = [];

  function loadNext(prev, chain) {

    if (prev) loadCount = loadCount - 1;
    var next = chain.shift();

    if ( ! next) { // end of sequence
      if (loadCount < 1) for (var i in callbacks) { callbacks[i]() }
    }
    else if ((typeof next) === 'string') {
      var e = document.createElement('script');
      e.src = next;
      e.type = 'text/javascript';
      e.className = 'caboche';
      e.onload = e.onerror = function() { loadNext(next, chain) };
      document.getElementsByTagName('head')[0].appendChild(e);
    }
    else { // function (sequence callback)
      next();
      loadNext(null, chain);
    }
  }

  // Accepts a list of strings (js script URIs) or functions (callbacks).
  // Loads each script sequentially, fires callback as it encounters them.
  // May be called multiple times.
  //
  this.require = function() {

    var a = [];

    for (var i in arguments) {
      var arg = arguments[i];
      if ((typeof arg) === 'string') loadCount = loadCount + 1;
      a.push(arguments[i]);
    }

    loadNext(null, a);
  };

  //
  // ready

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

