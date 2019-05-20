import axios, { AxiosError } from 'axios';

export interface ApiResponseError extends AxiosError {
  apiError: {
    status: number,
    message: string,
    code?: number,
  }
}

const axiosBase = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.token}`,
  },
});

// Intercptor on response for error
axiosBase.interceptors.response.use(res => res,
  (error) => {
    if (!error.response) {
      // eslint-disable-next-line no-param-reassign
      error.apiError = {
        status: -1, // status -1 means request error
        message: 'Connection Error',
      };
    } else if (error.response.data === 'Unauthorized' && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
      return;
    } else {
      const { status, data } = error.response;
      // eslint-disable-next-line no-param-reassign
      error.apiError = {
        status,
        message: (data || {}).success === false ? data.errorMessage : data,
        code: (data || {}).code,
      };
    }

    return Promise.reject(error as ApiResponseError);
  });

export default axiosBase;
