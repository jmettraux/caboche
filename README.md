
# caboche

Almost empty headed.

Inspired by [head.js](http://headjs.com/) and [lazyload](https://github.com/rgrove/lazyload/).

Do not want to wait on [this](https://github.com/headjs/headjs/issues/203) or [that](https://github.com/rgrove/lazyload/pull/10).


## usage

The main use case: "require a bunch of file, let them load in parallel (hopefully) and run stuff when they are all loaded (and executed)".

```html
<html>

  <head>
    <title>whatever</title>
    <script src="http://example.org/js/caboche.js"></script>
  </head>

  <body>

    <!-- ... --->

    <script>

      Caboche.require('/js/jquery.js')
      Caboche.require('/js/a.js')
      Caboche.require('/js/b.js')
      //...

      Caboche.ready(function() {
        // all the scripts are loaded and executed, proceed...
      });

    </script>
  </body>
</html>
```

Passing a list of js URIs to require() will load them in sequence:

```js
Caboche.require('/js/a.js', '/js/b.js');
  // once a.js is loaded and executed, b.js will start loading
```

It's OK to place a callback at the end of a sequence:

```js
Caboche.require(
  '/js/a.js',
  '/js/b.js',
  function() { document.write("a and b.js got loaded!"); }
);
```

In fact, it's OK to place callback anywhere in a sequence:

```js
Caboche.require(
  '/js/a.js',
  '/js/b.js',
  function() { document.write("a and b.js got loaded,"),
  '/js/c.js',
  function() { document.write("a, b and c.js got loaded."); }
);
```

The ready() callbacks get executed once all the sequence have loaded.


## license

MIT (see LICENSE.txt)

