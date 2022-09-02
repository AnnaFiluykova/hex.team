export const API_PATH = 'http://79.143.31.216';
export const REGISTER_URL = `${API_PATH}/register`;
export const LOGIN_URL = `${API_PATH}/login`;
export const SQUEEZE_URL = `${API_PATH}/squeeze`;
export const STATISTICS_URL = `${API_PATH}/statistics`;

export const getShortUrl = (short: string) => {
  return `${API_PATH}/s/${short}`
};
