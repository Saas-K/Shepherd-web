import axios, { AxiosResponse } from 'axios';
import queryString from 'query-string';
import { STORAGE_ACCESS_TOKEN } from '../components/_common/core/constants';

function _getAuthHeader() {
  return {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(STORAGE_ACCESS_TOKEN)}`
    }
  };
}

function _setParams(params?: any) {
  return `?${queryString.stringify(params)}`;
}

function _setUrl(url: string, params?: any) {
  return process.env.REACT_APP_BASE_URL + url + _setParams(params);
}

function _handleHeaderMessage(error: any) {
  throw new Error(error.response.headers.message || 'Something went wrong');
}

export function client() {
  async function get(url: string, params?: any) {
    try {
      const response: AxiosResponse<any> = await axios.get(_setUrl(url, params), _getAuthHeader());
      return response.data;
    } catch (error: any) {
      _handleHeaderMessage(error);
    }
  }

  async function post(url: string, params?: any, data: any = {}) {
    try {
      const response: AxiosResponse<any> = await axios.post(_setUrl(url, params), data, _getAuthHeader());
      return response.data;
    } catch (error: any) {
      _handleHeaderMessage(error);
    }
  }

  async function put(url: string, params?: any, data: any = {}) {
    try {
      const response: AxiosResponse<any> = await axios.put(_setUrl(url, params), data, _getAuthHeader());
      return response.data;
    } catch (error: any) {
      _handleHeaderMessage(error);
    }
  }

  async function deletef(url: string, params?: any) {
    try {
      const response: AxiosResponse<any> = await axios.delete(_setUrl(url, params), _getAuthHeader());
      return response.data;
    } catch (error: any) {
      _handleHeaderMessage(error);
    }
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
    try {
      const response: AxiosResponse<any> = await axios.get(_setUrl(url, params));
      return response.data;
    } catch (error: any) {
      _handleHeaderMessage(error);
    }
  }

  async function post(url: string, params?: any, data: any = {}) {
    try {
      const response: AxiosResponse<any> = await axios.post(_setUrl(url, params), data);
      return response.data;
    } catch (error: any) {
      _handleHeaderMessage(error);
    }
  }

  async function put(url: string, params?: any, data: any = {}) {
    try {
      const response: AxiosResponse<any> = await axios.put(_setUrl(url, params), data);
      return response.data;
    } catch (error: any) {
      _handleHeaderMessage(error);
    }
  }

  async function deletef(url: string, params?: any) {
    try {
      const response: AxiosResponse<any> = await axios.delete(_setUrl(url, params));
      return response.data;
    } catch (error: any) {
      _handleHeaderMessage(error);
    }
  }

  return {
    get,
    post,
    put,
    deletef
  };
}