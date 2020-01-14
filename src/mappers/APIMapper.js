import HttpService from '../services/HttpService';

export default {
  mapAPIConfigToMethod(plugin, list) {
    const methods = {};
    for (const key of Object.keys(list)) {
      const api = list[key];
      methods[key] = (...args) => {
        let data = api.conf ? api.conf(...args) : api(...args);
        data = {
          ...data,
          plugin,
        };
        return new Promise((resolve, reject) => {
          HttpService
              .post('', data)
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