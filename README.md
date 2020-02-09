# HiveFM

### Setup

`yarn install`

`yarn watch`

### config

```javascript
mount(element, {
  // URL of the server installation
  url: 'http://127.0.0.1:8000/',
  // prefix URL of the files
  root_url: 'http://127.0.0.1:8080/tmp/storage/',
  // HTTP request modifiers
  http: {
    // post params
    params: {
      foo: 'bar',
    },
    // get params
    query: {
      hello: 'world',
    },
    // additional headers
    headers: {
      'X-Token': 'API-Token',
    },
  },
  // selection handler
  handler: {
    // if context menu item should be shown/handle should be called
    accepts(items) {
      return true;
    },
    // menu item to show when `accepts(item, state)` returns `true`
    menu_item: {
      icon: '',
      title: 'Select',
    },
    // will be called if
    // menu item is defined and clicked or
    // menu item is not defined but accepts returned true or
    // accepts is not defined and any item selected
    handle(item) {
      console.log(item);
    },
  },
});
```