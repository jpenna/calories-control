import axios from 'axios';

declare module 'axios' {
  interface AxiosError {
    apiError: {
      status: number,
      message: string,
    }
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
        message: 'Request error',
      };
    } else {
      const { status, data } = error.response;
      // eslint-disable-next-line no-param-reassign
      error.apiError = {
        status,
        message: (data || {}).success === false ? data.errorMessage : data,
      };
    }

    return Promise.reject(error);
  });

export default axiosBase;
