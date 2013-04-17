
# caboche

Almost empty headed.

Inspired by [head.js](http://headjs.com/) and [lazyload](https://github.com/rgrove/lazyload/).

Do not want to wait on [this](https://github.co/headjs/headjs/issues/203) or [that](https://github.co/rgrove/lazyload/pull/10).

Notification test: [this](https://github.com/jmettraux/ruote-fluo/issues/5).


## usage

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
      Caboche.require('/js/a.js', '/js/b.js')
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

