/*
 * Copyright (c) 2013-2016, John Mettraux, jmettraux@gmail.com
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

  //
  // protected

  var VERSION = '1.2.7';

  //var self = this;

  var READYPHASE = 999;
  var entries = [];
  var currentEntry = null;
  var cabocheState = 'loading';

  function loadDone(phase, index) {

    if (phase !== currentEntry[0]) {

      throw(
        "loadDone(" + phase + ") vs " +
        "currentEntry [ " + currentEntry[0] + " ]");
    }

    var over = true;

    if (index !== true) {

      currentEntry[index] = null;

      for (var i = 1, l = currentEntry.length; i < l; i++) {
        if (currentEntry[i] != null) { over = false; break; }
      }
    }

    if (over) {

      currentEntry = null;

      window.setTimeout(function() { nextPhase(phase); }, 10);
    }
  }

  this.require = function(path, onLoad) {

    var s = document.createElement('script');
    s.src = path;
    if (onLoad) { s.onload = s.onerror = onLoad; }
    document.getElementsByTagName('head')[0].appendChild(s);
  };

  function doLoad(phase, index) {

    var item = currentEntry[index];
    var t = (typeof item);

    if (t === 'function') {

      var shouldContinue = item();
      if (shouldContinue === false) return false;

      loadDone(phase, index);
    }
    else { // t === 'string'

      Caboche.require(item, function() { loadDone(phase, index); });
    }

    return true;
  }

  function load() {

    var phase = currentEntry[0];

    if (phase === READYPHASE && document.readyState === 'loading') {

      window.setTimeout(load, 10);
      return;
    }

    for (var i = 1, l = currentEntry.length; i < l; i++) {

      var shouldContinue = doLoad(phase, i);
      if (shouldContinue !== false) continue;

      loadDone(phase, true); // flags everything as done
      break;
    }
  }

  function spliceLowestEntry() {

    var lowest = [ READYPHASE + 2, -1 ];

    for (var i = 0; ; i++) {

      var entry = entries[i];
      if ( ! entry) break;
      if (entry[0] >= lowest[0]) continue;
      lowest = [ entry[0], i ]
    }

    if (lowest[1] < 0) return null;
    return entries.splice(lowest[1], 1)[0];
  }

  function nextPhase(prev) {

    if (currentEntry) return;

    currentEntry = spliceLowestEntry();
    if (currentEntry) load();
  }

  entries.push([ READYPHASE + 1, function() { cabocheState = 'loaded'; } ]);

  //
  // public

  this.phase = function() {

    var a = []; for (var i in arguments) { a.push(arguments[i]); }
    entries.push(a);

    var t = (a[0] + 1) * 10; if (t > 98) t = 98;
    window.setTimeout(nextPhase, t);
  };

  this.last = function() {

    var a = [ READYPHASE - 1 ];
    for (var i in arguments) { a.push(arguments[i]); }

    Caboche.phase.apply(null, a);
  };

  this.ready = function() {

    var a = [ READYPHASE ];
    for (var i in arguments) { a.push(arguments[i]); }

    Caboche.phase.apply(null, a);
  };

  this.state = function() {

    return cabocheState;
  }

  //
  // over.

  return this;

}).apply({});

