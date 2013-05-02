
# passport-scope-restrict [![Build Status](https://travis-ci.org/timshadel/passport-scope-restrict.png?branch=master)](https://travis-ci.org/timshadel/passport-scope-restrict)

Enforce authorization based on OAuth scopes set by Passport.js.

This is typically used to protect an API by requiring that the `scopes` associated with the
client are allowed to call the API. Check out `passport-http-bearer` for one strategy you can
build on to achieve this.

## Examples

```js
var express = require('express')
  , passport = require('passport')
  , restrict = require('passport-scope-restrict');

// setup your Express app, and configure Passport with some strategy which add `scopes` to `req.authInfo`.

app.use('/api/admin', restrict('admin'));
```

## License 

MIT. See LICENSE for details.
