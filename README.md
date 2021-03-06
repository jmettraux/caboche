
# caboche

Almost empty headed.

Loads javascript files in phases (the loading of the files in a phase is done in "parallel" as much as possible). Callbacks may be inserted in phases. There is a final "last" phase for final callbacks (a bit like [head.js](http://headjs.com/) ready() method).

I generally load in two phases, first phase is for jquery and co, big ubiquitous libs and then second phase for the libs local to the application and that depend on jquery and co (the libs of the first phase). There is the third phase, the "last" one, where code depending on all the libs starts its execution.


## motivation

I was using [head.js](http://headjs.com) but faced [this issue](https://github.com/headjs/headjs/issues/203).


## history

The [first version](https://github.com/jmettraux/caboche/blob/5bf9b09f0fc59674832c6159477638e6130a775a/js/caboche.js) of caboche was very simple, but did not prevent issues with loose "scheduling" of js loading.

The [second version](https://github.com/jmettraux/caboche/blob/4cedf84bb41028a8015a6fa20c4709e848f0aa50/js/caboche.js) was pre-loading all the js files in parallel and then "requiring" them in sequence. That worked ok, but was a bit overkill when the files are already well cached. And requiring from here and then from there opened the possibility for loading libs before their dependencies (like in the first version).

The 1.2.0 version is much more simple, phases have to be declared, grouping the loading of files.

The [1.2.6 version](js/caboche.js) introduces `Caboche.ready()` for pieces of code to run when the DOM loading and preparation are complete.


## usage

The main use case: "load a first set of js files in parallel, then load a second set (that depends on the first one) in parallel, when all the loading is over run this code..."

```html
<html>

  <head>
    <title>whatever</title>
    <script src="http://example.org/js/caboche.js"></script>
  </head>

  <body>

    <!-- ... -->

    <script>

      Caboche.phase(0, '/js/jquery.js');
      Caboche.phase(1, '/js/a.js');
      Caboche.phase(1, '/js/b.js');
      //...

      Caboche.last(function() {
        // all the scripts are loaded and executed, proceed...
      });

    </script>
  </body>
</html>
```

One has to declare the load order in phases.

```javascript
Caboche.phase(0, 'jquery.js');
Caboche.phase(1, 'a.js');
  // load jquery.js then a.js
```

Items in the same phase get loaded in "parallel".

```javascript
Caboche.phase(0, 'a.js', 'b.js');
Caboche.phase(1, 'c.js', 'd.js');
  // load a and b.js, then c and d.js
```

The code above is equivalent to

```javascript
Caboche.phase(0, 'a.js');
Caboche.phase(0, 'b.js');
Caboche.phase(1, 'c.js');
Caboche.phase(1, 'd.js');
  // load a and b.js, then c and d.js
```

There is a Caboche.last() method for final callbacks.

```javascript
Caboche.phase(0, 'a.js', 'b.js');
Caboche.phase(1, 'c.js', 'd.js');
Caboche.last(function() {
  alert("a, b, c and d.js got loaded.");
});
```

Actually last(x) is equivalent to phase(998, x).

```javascript
Caboche.last(function() {
  alert("a, b, c and d.js got loaded.");
});
  //
  // is equivalent to
  //
Caboche.phase(998, function() {
  alert("a, b, c and d.js got loaded.");
});
```

It's OK to place callbacks (function) anywhere.

```javascript
Caboche.phase(0, 'a.js');
Caboche.phase(1, function() { alert("currently in phase 1"); });
Caboche.phase(2, 'b.js');
Caboche.phase(3, function() { alert("about to load c.js"); }, 'c.js');
Caboche.last(function() { alert("everything loaded."); });
```

When a "page" is composed of multiple partials, it's OK to scatter phases among the partial, caboche should be able to keep up, it always check back for newest phase entries with lower phase number than the one that just got processed. The loading happens in events, while the "phasing" happens in the main window "thread", that's what makes out of order phasing OK.

### conditional phases

If a listed element is a function and returns false, the elements that follow in the phase are not loaded (not executed if they are functions).

In the example below, the "local" jQuery is only loaded if the CDN jQuery load seems to have failed (`typeof jQuery === 'undefined'`).

```javascript
Caboche.phase(
  0,
  '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js');
Caboche.phase(
  1,
  function() { if ((typeof jQuery) === 'undefined') return false; return true; },
  '/js/jquery-1.11.0.js');
Caboche.phase(
  2,
  '/js/ourlibs.js');
```

### Caboche.ready()

```javascript
Caboche.ready(function() { console.log('executes when document ready'); });
```

`ready` accepts a number, an offset, as first argument.

```javascript
// a:
Caboche.ready(1, function() { console.log('executes after b:'); });
// b:
Caboche.ready(0, function() { console.log('executes before a:'); });
```


### simply requiring

Caboche let's you require a piece of javascript and set a callback for when the loading is done (or failed somehow).

```javascript
Caboche.require('xyz.js', function() { console.log("done."); });
```

The callback is optional.


## license

MIT (see LICENSE.txt)

