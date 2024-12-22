import client, { axiosInstance } from '@kubb/plugin-client/clients/axios';
import type { RequestConfig } from '@kubb/plugin-client/clients/axios';

// Add interceptors to the Kubb-provided axiosInstance
axiosInstance.interceptors.request.use(
  config => {
    // console.log('Request interceptor:', config);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    // console.log('Response interceptor:', response);
    return response;
  },
  error => {
    // console.error('Response error:', error);
    return Promise.reject(error);
  }
);

// Export the original client since it internally uses axiosInstance from kubb library
export type { RequestConfig };
export default client;
