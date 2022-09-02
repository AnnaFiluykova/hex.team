import axios from 'axios';

export const addAccessTokenToHeader = (accessToken: string) => {
  axios.defaults.headers = {
    ...axios.defaults.headers,
    common: {
      ...axios.defaults.headers.common,
      Authorization: `Bearer ${accessToken}`
    }
  };
};
