# Description
Diff plugin for noscript for making smart setData and other.

#Usage

```js

var A = {
    a: 'b',
    b: [1,[1, [1, [[[[3]]]]], [4,null]]],
    c: {
        a: 'b',
        b: [1,[1, [1, [[[[2]]]]], [4,null]]],
        c: function(){},
        d: null
    }
};

var B = {
    a: 'b',
    b: [1,[1, [1, [[[[2]]]]], [4,null]]],
    c: {
        a: 'b',
        b: [1,[1, [1, [[[[4]]]]], [4,null]]],
        c: function(){},
        d: {}
    },
    d: 'qwe'
};


ns.Model.define('foo');

// having some model
var a = ns.Model.get('foo').setData(A);

setTimeout(function () {
    // setting new data some time later
    a.setDataDiff(B);
});

// and listening to chages
a.on('ns-model-changed', function function_name () {
// this function will be called 5 times outputing:
// (one line per call)
//["ns-model-changed", ".d"]
//["ns-model-changed", ".c"]
//["ns-model-changed", ".c.d"]
//["ns-model-changed", ".c.b"]
//["ns-model-changed", ".b"]
  console.log(arguments); // logs e and jpath
})

```

TODOs
- [ ] add tests
- [ ] dont iterate over array if not necessary
- [ ] consider functions and objects (maybe not necessary)
- [ ] more sophisticated algorithm for checking js object (contrary to JSON objects): toString and valueOf


