
# caboche

Almost empty headed.


## usage

The main use case: "load a first set of js files in parallel, then load a second set (that depends on the first one) in parallel, when all the loading is over run this code..."

```html
<html>

  <head>
    <title>whatever</title>
    <script src="http://example.org/js/caboche.js"></script>
  </head>

  <body>

    <!-- ... --->

    <script>

      Caboche.phase(0, '/js/jquery.js')
      Caboche.phase(1, '/js/a.js')
      Caboche.phase(1, '/js/b.js')
      //...

      Caboche.final(function() {
        // all the scripts are loaded and executed, proceed...
      });

    </script>
  </body>
</html>
```


## history

* 1.0.0 - everything in parallel, some sequencing
* 1.1.0 - pre-load everything in parallel, sequence all executions
* 1.2.0 - phase system


## license

MIT (see LICENSE.txt)

