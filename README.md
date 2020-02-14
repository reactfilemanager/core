# HiveFM

### Setup

`yarn install`

`yarn watch`

### Usage
> View `build.js`
>

### FileInfo
```javascript
FileInfo {
    name;
    path;
    is_dir;
    is_file;
    is_link;
    is_readable;
    is_writable;
    is_executable;
    perms;
    size;
    extension;
    selected = false;
    _components = {};
    id;
    last_modified;

    components;
    addComponent();
    removeComponent();
    getName(length);
    getExtension();
}
```

### Pluggable
```javascript
{
    registerPlugins(pluginsConfig), // registers multiple plugins
    registerPlugin(pluginKey, plugin), // registers single plugin
    addTabs(tabs), // adds multiple tabs
    addTab(tabKey, tab), // adds a single tab
    addReducer(reducers), // adds reducer
    mapApi(pluginKey, apiConfig), // maps a given api config and returns api
    plugin(pluginKey) { // returns an instance of given plugin key, null if not registered
        addHandler(key, handles, handler, menuItem = null, order = 10), // adds a handler(used to open file)
        addContextMenu(key, shouldShow, handler, menuItem, order = 10),// adds a context menu item(on right click)
        addToolbarButton(key, button, order = 10), // adds a button on the toolbar
        mergeConfig(_config), // merges config with the plugins config
        inject(config), // injects config(pretty much similar as mergeConfig())
        accessor() // get the accessor of the plugin(if provided)
    }
}
```

Plugin Config
```javascript
{
  api: apiConfig<ApiConfig>,
  hanlders: {
    handlerKey: handler<HandlerConfig>,
  },
  context_menu: {
    contextMenuItemKey: contextMenuItem<ContextMenuItemConfig>,
  },
  boot: function({api<Object>, getConfig<Function>}),
  initial_state,
  tabs: {
    tabKey: tab<Object>,
  },
  reducers,
  accessor: function() {
              return {}<Object>
            },
  injects: {
     pluginKey: pluginConfig<PluginConfig>
  }
}
```

API Config
```javascript
{
  key(args) {
    return {
      ...args,
    }
  },
  key(args) {
    mapper: ResponseMapper<Function>,
    conf(moreArgs) {
      return {
        ...args,
        ...moreArgs,
      }
    }
  },
  key(args) {
    conf(moreArgs) {
      return {
          formData: {
             ...args,
             ...moreArgs,
              },
          config: {AxiosConfig<Object>},
          cancellable: true<Boolean>,
       }
    }
  }
}
```

Handler Config
```javascript
{
  handles(item<FileInfo>, state) {
    return <Boolean>;
  },
  handle(item<FileInfo>, state, dispatch) {
      // do something with the item
  },
  menu_item: { // optional
    icon: 'icon',
    title: 'title',
  },
  order: 0-10,
}
```

Context Menu Item Config
```javascript
{
  shouldShow(item<FileInfo>, state) {
    return <Boolean>;
  },
  handle(item<FileInfo>, state, dispatch) {
      // do something with the item
  },
  menu_item: { // required
    icon: 'icon',
    title: 'title',
  },
  order: 0-10,
}
```

Tab Config
```javascript
{
  title: 'Tab Title',
  component: TabComponent<React.Component>,
}
```