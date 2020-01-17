import HttpService from '../services/HttpService';

let cancelSource;

export default {
  mapAPIConfigToMethod(plugin, list) {
    const methods = {
      getCancelSource() {
        cancelSource = HttpService.getCancelSource();
        return cancelSource;
      },
    };
    for (const key of Object.keys(list)) {
      const api = list[key];
      methods[key] = (...args) => {

        // check if we have {mapper,conf}
        let config = api.conf ? api.conf(...args) : api(...args);

        // check if we have {formData,config,cancellable}
        let _data = config.formData ? config.formData : config;

        const data = {
          ..._data,
          plugin,
        };

        let _config = config.config ? config.config : {};
        let _cancelSource = config.cancellable ? cancelSource : null;
        if (_cancelSource) {
          _config = {..._config, cancelToken: _cancelSource.token};
          cancelSource = null;
        }

        return new Promise((resolve, reject) => {
          HttpService
              .post('', data, _config)
              .then(response => {
                if (api.mapper) {
                  resolve(api.mapper(response.data));
                }
                else {
                  resolve(response.data);
                }
              })
              .catch(error => reject(error));
        });
      };
    }
    return methods;
  },
};