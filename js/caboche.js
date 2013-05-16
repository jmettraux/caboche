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

  var VERSION = '1.2.1';

  //var self = this;

  var MAXPHASE = 1000;
  var entries = [];
  var phaseNum;
  var phaseCount;
  //var phaseLog = [];

  function loadDone(item) {

    if ((typeof item) === 'string') phaseCount = phaseCount - 1;

    //if (phaseCount < 1) nextPhase(phaseNum);
    if (phaseCount < 1) {
      window.setTimeout(function() { nextPhase(phaseNum); }, 10);
    }
  }

  function load(entry) {

    var item = entry.shift();
    if (item === undefined) return;

    var t = (typeof item);

    if (t === 'string') { // file to load
      phaseCount = phaseCount + 1;
      var s = document.createElement('script');
      s.src = item;
      s.onload = s.onerror = function() { loadDone(item); };
      document.getElementsByTagName('head')[0].appendChild(s);
    }
    else if (t === 'function') { // callback
      item();
      loadDone(item);
    }

    load(entry);
  }

  function lowestPhase() {

    var min = MAXPHASE;

    for (var i in entries) {
      var num = entries[i][0]; if (num < min) min = num;
    }
    return min;
  }

  function nextEntryOffset() {

    for (var i in entries) {
      if (entries[i][0] === phaseNum) return i;
    }
    return -1;
  }

  function nextPhase(prev) {

    if (phaseNum !== prev) return;

    phaseNum = lowestPhase();
    phaseCount = 0;

    while(true) {
      var off = nextEntryOffset();
      if (off < 0) break;
      var entry = entries.splice(off, 1)[0];
      load(entry);
    }
  }

  this.phase = function() {
    var a = []; for (var i in arguments) { a.push(arguments[i]); }
    entries.push(a);
    if ( ! phaseNum) window.setTimeout(nextPhase, 10);
  };

  this.last = function() {
    // TODO: use apply() (or is it call()?)
    var a = [ MAXPHASE ]; for (var i in arguments) { a.push(arguments[i]); }
    entries.push(a);
    if ( ! phaseNum) window.setTimeout(nextPhase, 10);
  };

  //
  // over.

  return this;

}).apply({});

