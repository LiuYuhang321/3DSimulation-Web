import instance from "./HttpClient"
import qs from "qs";
import * as apiConfig from "./config/index"

export const ApiConfig = apiConfig;

const baseHost = import.meta.env.VITE_APP_GEOCMS_BASE_URL;
const baseHostMis = import.meta.env.VITE_APP_MIS_API_BASE_URL;
const baseToken = import.meta.env.VITE_APP_GEOCMS_TOKEN;
const tokenEncoded = import.meta.env.VITE_APP_GEOCMS_TOKEN_ENCODED === 'true';

export const getAuthToken = () => {
    const tokenInfo = JSON.parse(localStorage.getItem("3DSIMULATION-TOKEN"));
    if (tokenInfo.created + tokenInfo.expiresIn * 1000 < new Date().getTime()) {
        console.log('token已失效');
        return null;
    } else {
        console.log('token有效');
        return tokenInfo.accessToken;
    }
}

export const setAuthToken = (tokenData) => {
    const token = {...tokenData, created: new Date().getTime()}
    localStorage.setItem("3DSIMULATION-TOKEN", JSON.stringify(token));
}

const httpGet = (api: any, {queryParams, pathParams, formParams}: any, {noAuth = false}) => {
    if (api.host && api.host.startsWith('VITE_APP_MIS')) {
        api.host = baseHostMis;
    }
    let baseUrl = (api.host === '' || api.host) ? api.host : baseHost;

    let url = api.url.startsWith('http') ? api.url : (baseUrl + api.url)
    let params: object = {}
    if (api.queryParams) {
        Object.assign(params, api.queryParams);
    }
    if (queryParams) {
        Object.assign(params, queryParams);
    }
    let _pathParams = {}
    if (api.pathParams) {
        Object.assign(_pathParams, api.pathParams);
    }
    if (pathParams) {
        Object.assign(_pathParams, pathParams);
    }
    if (_pathParams) {
        for (let key in _pathParams) {
            url = url.replace(`{${key}}`, encodeURIComponent(_pathParams[key]))
        }
    }
    if (url.indexOf('?') > 0 && Object.keys(params).length > 0) {
        url = url + '&' + qs.stringify(params)
    } else {
        url = url + '?' + qs.stringify(params)
    }
    if (noAuth) {
        return instance.get(url);
    } else {
        let headers = {};
        let token = baseToken;
        if (tokenEncoded) {
            token = decodeURIComponent(token);
        }
        if (api.token) {
            if (api.token.type === 2) {
                token = getAuthToken();
                headers[api.token.headerName] = token;
            } else {
                if (api.token instanceof String) {
                    token = api.token;
                } else {
                    token = api.token.urlEncoded ? decodeURIComponent(api.token.value) : api.token.value;
                }
                headers = {
                    "CF-GEO-TOKEN": token
                }
            }
        } else {
            headers = {
                "CF-GEO-TOKEN": token
            }
        }
        // console.log('============================url', url)
        // console.log('============================headers', headers)
        return instance.get(url, {
            headers: headers
        });
    }
}

const httpDelete = (api: any, {queryParams, pathParams, formParams}: any, {noAuth = false}) => {
    if (api.host && api.host.startsWith('VITE_APP_MIS')) {
        api.host = baseHostMis;
    }
    let baseUrl = (api.host === '' || api.host) ? api.host : baseHost;

    let url = api.url.startsWith('http') ? api.url : (baseUrl + api.url)
    let params: object = {}
    if (api.queryParams) {
        Object.assign(params, api.queryParams);
    }
    if (queryParams) {
        Object.assign(params, queryParams);
    }
    let _pathParams = {}
    if (api.pathParams) {
        Object.assign(_pathParams, api.pathParams);
    }
    if (pathParams) {
        Object.assign(_pathParams, pathParams);
    }
    if (_pathParams) {
        for (let key in _pathParams) {
            url = url.replace(`{${key}}`, encodeURIComponent(_pathParams[key]))
        }
    }
    if (url.indexOf('?') > 0 && Object.keys(params).length > 0) {
        url = url + '&' + qs.stringify(params)
    } else {
        url = url + '?' + qs.stringify(params)
    }
    if (noAuth) {
        return instance.delete(url);
    } else {
        let headers = {};
        let token = baseToken;
        if (tokenEncoded) {
            token = decodeURIComponent(token);
        }
        if (api.token) {
            if (api.token.type === 2) {
                token = getAuthToken();
                headers[api.token.headerName] = token;
            } else {
                if (api.token instanceof String) {
                    token = api.token;
                } else {
                    token = api.token.urlEncoded ? decodeURIComponent(api.token.value) : api.token.value;
                }
                headers = {
                    "CF-GEO-TOKEN": token
                }
            }
        } else {
            headers = {
                "CF-GEO-TOKEN": token
            }
        }
        // console.log('============================url', url)
        // console.log('============================headers', headers)
        return instance.delete(url, {
            headers: headers
        });
    }
}

const httpPost = (api: any, {bodyParams, queryParams, pathParams, formParams}: any, {noAuth = false}) => {
    if (api.host && api.host.startsWith('VITE_APP_MIS')) {
        api.host = baseHostMis;
    }
    let baseUrl = (api.host === '' || api.host) ? api.host : baseHost;

    let url = api.url.startsWith('http') ? api.url : (baseUrl + api.url)

    let _params = {}
    let isFormParam = false;
    if (bodyParams || api.bodyParams) {
        isFormParam = false;
        if (api.bodyParams) {
            Object.assign(_params, api.bodyParams);
        }
        if (bodyParams) {
            Object.assign(_params, bodyParams);
        }
    } else if (formParams || api.formParams) {
        isFormParam = true;
        if (api.formParams) {
            Object.assign(_params, api.formParams);
        }
        if (formParams) {
            Object.assign(_params, formParams);
        }
    }

    let _pathParams = {}
    if (api.pathParams) {
        Object.assign(_pathParams, api.pathParams);
    }
    if (pathParams) {
        Object.assign(_pathParams, pathParams);
    }
    if (_pathParams) {
        for (let key in _pathParams) {
            url = url.replace(`{${key}}`, encodeURIComponent(_pathParams[key]))
        }
    }
    if (noAuth) {
        if (!isFormParam) {
            return instance.post(url, _params);
        } else {
            return instance.post(url, _params, {
                headers: {
                    "Content-type": "application/x-www-formdata-urlencode"
                }
            });
        }
    } else {
        let headers = {};
        let token = baseToken;
        if (tokenEncoded) {
            token = decodeURIComponent(token);
        }
        if (api.token) {
            if (api.token.type === 2) {
                token = getAuthToken();
                // console.log(token);

                headers[api.token.headerName] = token;
            } else {
                if (api.token instanceof String) {
                    token = api.token;
                } else {
                    token = api.token.urlEncoded ? decodeURIComponent(api.token.value) : api.token.value;
                }
                headers = {
                    "CF-GEO-TOKEN": token
                }
            }
        } else {
            headers = {
                "CF-GEO-TOKEN": token
            }
        }
        if (!isFormParam) {
            return instance.post(url, _params, {
                headers: {
                    ...headers,
                }
            });
        } else {
            return instance.post(url, _params, {
                headers: {
                    ...headers,
                    "Content-type": "application/x-www-formdata-urlencode"
                }
            });
        }

    }
}

const httpPut = (api: any, {bodyParams, queryParams, pathParams, formParams}: any, {noAuth = false}) => {
    if (api.host && api.host.startsWith('VITE_APP_MIS')) {
        api.host = baseHostMis;
    }
    let baseUrl = (api.host === '' || api.host) ? api.host : baseHost;

    let url = api.url.startsWith('http') ? api.url : (baseUrl + api.url)

    let _params = {}
    let isFormParam = false;
    if (bodyParams || api.bodyParams) {
        isFormParam = false;
        if (api.bodyParams) {
            Object.assign(_params, api.bodyParams);
        }
        if (bodyParams) {
            Object.assign(_params, bodyParams);
        }
    } else if (formParams || api.formParams) {
        isFormParam = true;
        if (api.formParams) {
            Object.assign(_params, api.formParams);
        }
        if (formParams) {
            Object.assign(_params, formParams);
        }
    }

    let _pathParams = {}
    if (api.pathParams) {
        Object.assign(_pathParams, api.pathParams);
    }
    if (pathParams) {
        Object.assign(_pathParams, pathParams);
    }
    if (_pathParams) {
        for (let key in _pathParams) {
            url = url.replace(`{${key}}`, encodeURIComponent(_pathParams[key]))
        }
    }
    if (noAuth) {
        if (!isFormParam) {
            return instance.put(url, _params);
        } else {
            return instance.put(url, _params, {
                headers: {
                    "Content-type": "application/x-www-formdata-urlencode"
                }
            });
        }
    } else {
        let headers = {};
        let token = baseToken;
        if (tokenEncoded) {
            token = decodeURIComponent(token);
        }
        if (api.token) {
            if (api.token.type === 2) {
                token = getAuthToken();
                // console.log(token);

                headers[api.token.headerName] = token;
            } else {
                if (api.token instanceof String) {
                    token = api.token;
                } else {
                    token = api.token.urlEncoded ? decodeURIComponent(api.token.value) : api.token.value;
                }
                headers = {
                    "CF-GEO-TOKEN": token
                }
            }
        } else {
            headers = {
                "CF-GEO-TOKEN": token
            }
        }
        if (!isFormParam) {
            return instance.put(url, _params, {
                headers: {
                    ...headers,
                }
            });
        } else {
            return instance.put(url, _params, {
                headers: {
                    ...headers,
                    "Content-type": "application/x-www-formdata-urlencode"
                }
            });
        }

    }
}

export const httpRequest = (api: any, paramData: any | undefined | null, setting: any = {noAuth: false}) => {
    if (api) {
        switch (api.method) {
            case 'get': {
                return httpGet(api, paramData ? paramData : {}, setting);
            }
            case 'post': {
                return httpPost(api, paramData ? paramData : {}, setting);
            }
            case 'delete': {
                return httpDelete(api, paramData ? paramData : {}, setting);
            }
            case 'put': {
                return httpPut(api, paramData ? paramData : {}, setting);
            }
            default: {
                return null
            }
        }
    }
};

export const httpRequestAll = (datas: any[]) => {
    let requests: any[] = [];
    datas.forEach(item => {
        const {id, paramData, setting} = item;
        requests.push(httpRequest(id, paramData, setting))
    })
    return Promise.all(requests);
}

export const httpGetJSON = (url: string) => instance.get(url);
