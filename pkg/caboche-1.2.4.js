/*
 * Copyright (c) 2013-2014, John Mettraux, jmettraux@gmail.com
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

  var VERSION = '1.2.4';

  //var self = this;

  var MAXPHASE = 1414;
  var entries = [];
  var currentEntry = null;
  //var phaseLog = [];
  var cabocheState = 'loading';

  function loadDone(phase, item) {

    if (phase !== currentEntry[0]) {
      throw(
        "loadDone(" + phase + ") vs " +
        "currentEntry [ " + currentEntry[0] + " ]");
    }

    var i = currentEntry.indexOf(item);

    if (i < 0) {
      throw(
        "couldn't find " + JSON.stringify(item) +
        " in " + JSON.stringify(currentEntry));
    }

    currentEntry.splice(i, 1);

    if (currentEntry.length < 2) {
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

  function load() {

    var phase = currentEntry[0];

    for (var i = 0, l = currentEntry.length; i < l; i++) {

      var item = currentEntry[i];
      var t = (typeof item);

      if (t === 'number') {
        continue;
      }
      if (t === 'function') {
        item();
        loadDone(phase, item);
      }
      else { // t === 'string'
        Caboche.require(item, function() { loadDone(phase, item); });
      }
    }
  }

  function spliceLowestEntry() {

    var lowest = [ MAXPHASE + 2, -1 ];
    var i = -1;

    while(true) {
      i = i + 1;
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

  entries.push([ MAXPHASE + 1, function() { cabocheState = 'loaded'; } ]);

  //
  // public

  this.phase = function() {
    var a = []; for (var i in arguments) { a.push(arguments[i]); }
    entries.push(a);
    window.setTimeout(nextPhase, 10);
  };

  this.last = function() {
    var a = [ MAXPHASE ]; for (var i in arguments) { a.push(arguments[i]); }
    Caboche.phase.apply(null, a)
  };

  this.state = function() {
    return cabocheState;
  }

  //
  // over.

  return this;

}).apply({});


/* from commit edf1f9a on 2014-03-10 11:34:08 +0900 */
