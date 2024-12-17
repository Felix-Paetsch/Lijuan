This module is supposed to be imported from, in contrast to the other ones.

### Throwing Errors
When you throw an error which end up in `errors._throw_internal` you can give it a data attribute which will be logged out (or can be dealt with in a corresponding listener.)
If you want to give the error a more specifc type (or error code) best practice is to declare it in `err.data.error_type`.

```js

const err = new Error("Something bad happened");
err.data =  {
    error_type: "channel_not_found"
}
_throw(err);

```