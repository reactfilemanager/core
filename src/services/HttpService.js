import Axios from 'axios';
import ResponseMapperService from '../mappers/ResponseMapper';

export function setBaseUrl(url) {
    Axios.defaults.baseURL = url;
    window.thumb = _url => getUrl(url, {thumb: _url});
    window.download = _url => getUrl(url, {download: _url});
    window.preview = _url => getUrl(url, {preview: _url});
}

const config = {
    query_params: {},
    post_data: {},
};

const getUrl = (url, data) => {
    const args = [];
    const _args = {...data, ...config.query_params};
    for (const key of Object.keys(_args)) {
        args.push(`${encodeURIComponent(key)}=${encodeURIComponent(_args[key])}`);
    }
    return `${COM_JMEDIA_BASEURL}${url}?${args.join('&')}`;
};

export function setQueryParams(query) {
    config.query_params = query;
}

export function setPostData(data) {
    config.post_data = data;
}

export function setHeaders(headers) {
    for (const key of Object.keys(headers)) {
        Axios.defaults.headers.common[key] = headers[key];
    }
}

Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export function setHeader(name, content) {
    Axios.defaults.headers.common[name] = content;
}

export function removeHeader(name) {
    delete Axios.defaults.headers.common[name];
}

export default {
    get(route, params = {}, config = {}) {
        const promise = Axios.get(route, makeGetRequest(params, config));
        return withMappedPromise(promise);
    },
    post(route, data = {}, _config = {}) {
        _config = {..._config, params: {..._config.params, ...config.query_params}};
        const promise = Axios.post(route, makeFormRequest(data), _config);
        return withMappedPromise(promise);
    },
    postJSON(route, data = {}, _config = {}) {
        _config = {..._config, params: {..._config.params, ...config.query_params}};
        const promise = Axios.post(route, data, _config);
        return withMappedPromise(promise);
    },
    put(route, data = {}, _config = {}) {
        _config = {..._config, params: {..._config.params, ...config.query_params}};
        const promise = Axios.put(route, makeFormRequest(data), _config);
        return withMappedPromise(promise);
    },
    putJSON(route, data = {}, _config = {}) {
        _config = {..._config, params: {..._config.params, ...config.query_params}};
        const promise = Axios.put(route, data, _config);
        return withMappedPromise(promise);
    },
    patch(route, data = {}, _config = {}) {
        _config = {..._config, params: {..._config.params, ...config.query_params}};
        const promise = Axios.patch(route, makeFormRequest(data), _config);
        return withMappedPromise(promise);
    },
    delete(route, data = {}) {
        const promise = Axios.delete(route, {data});
        return withMappedPromise(promise);
    },
    getCancelSource() {
        return Axios.CancelToken.source();
    },
};

function withMappedPromise(promise) {
    return new Promise((resolve, reject) => {
        promise.then(response => resolve(
            ResponseMapperService.mapSuccessResponse(response))).catch(error => reject(ResponseMapperService.mapErrorResponse(error)),
        );
    });
}

function makeFormRequest(_data, form = null, parent = null) {
    if (!form) {
        form = new FormData();
    }
    const data = {..._data, ...config.post_data};
    Object.keys(data).forEach(key => {
        const value = data[key];
        if (value === undefined) {
            return;
        }
        if (typeof value === 'object' && value.constructor.name !== 'File') {
            form = makeFormRequest(value, form, key);
        }
        else {
            let _value = value;
            if (typeof value === 'boolean') {
                _value = value ? 1 : 0;
            }
            if (!parent) {
                form.append(key, _value);
            }
            else {
                form.append(`${parent}[${key}]`, _value);
            }
        }
    });
    return form;
}

function makeGetRequest(params = {}, config = {}) {
    return {
        params: {
            ...params,
            ...config.query_params,
        },
        ...config,
    };
}
