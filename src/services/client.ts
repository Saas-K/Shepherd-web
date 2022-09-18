import axios, { AxiosResponse } from 'axios';
import queryString from 'query-string';

function _getAuthHeader() {
  return {
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    // }
    headers: {
      'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZXMiOlsiVVNFUiJdLCJpc3MiOiJTSEVQSEVSRCIsImV4cCI6MTY2MzYwMzc0MX0.I6Z0WKoB7B7BvVK-JYAUhbIHZEneFbJTgpE8KfTaMKOZPLobzSrrX8MnC133kc1QBvFbeUcW_tph0yhW3A60Pw`
    }
  };
}

function _setParams(params?: any) {
  return `?${queryString.stringify(params)}`;
}

function _setUrl(url: string, params?: any) {
  console.log(process.env.REACT_APP_BASE_URL);
  console.log(url);
  return process.env.REACT_APP_BASE_URL + url + _setParams(params);
}

function _handleResponse(response: AxiosResponse<any>) {
  const responseMessage: string = response.headers.message;
  if (responseMessage === 'OK' && response.status === 200) return response.data;
  throw new Error(responseMessage || 'Something went wrong');
}

export function client() {
  async function get(url: string, params?: any) {
    const response: AxiosResponse<any> = await axios.get(_setUrl(url, params), _getAuthHeader());
    return _handleResponse(response);
  }

  async function post(url: string, params?: any, data: any = {}) {
    const response: AxiosResponse<any> = await axios.post(_setUrl(url, params), data, _getAuthHeader());
    return _handleResponse(response);
  }

  async function put(url: string, params?: any, data: any = {}) {
    const response: AxiosResponse<any> = await axios.put(_setUrl(url, params), data, _getAuthHeader());
    return _handleResponse(response);
  }

  async function deletef(url: string, params?: any) {
    const response: AxiosResponse<any> = await axios.delete(_setUrl(url, params), _getAuthHeader());
    return _handleResponse(response);
  }

  return {
    get,
    post,
    put,
    deletef
  };
}

export function clientNoAuth() {
  async function get(url: string, params?: any) {
    const response: AxiosResponse<any> = await axios.get(_setUrl(url, params));
    return _handleResponse(response);
  }

  async function post(url: string, params?: any, data: any = {}) {
    const response: AxiosResponse<any> = await axios.post(_setUrl(url, params), data);
    return _handleResponse(response);
  }

  async function put(url: string, params?: any, data: any = {}) {
    const response: AxiosResponse<any> = await axios.put(_setUrl(url, params), data);
    return _handleResponse(response);
  }

  async function deletef(url: string, params?: any) {
    const response: AxiosResponse<any> = await axios.delete(_setUrl(url, params));
    return _handleResponse(response);
  }

  return {
    get,
    post,
    put,
    deletef
  };
}