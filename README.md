
# caboche

Almost empty headed.

Inspired by [head.js](http://headjs.com/) and [lazyload](https://github.com/rgrove/lazyload/).

Do not want to wait on [this](https://github.com/headjs/headjs/issues/203) or [that](https://github.com/rgrove/lazyload/pull/10).


## usage

For now, there is only one use case: "require a bunch of file, let them load in parallel (hopefully) and run stuff when they are all loaded (and executed)".

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


## license

MIT (see LICENSE.txt)

