import jwtDecode from 'jwt-decode';

export const getAccessToken = () => {
  if (!window.localStorage) {
    return null;
  }
  let user = {};
  const jwtToken = window.localStorage.getItem('jwtToken');
  if (jwtToken) {
    user = jwtDecode(jwtToken);
  }
  const accessToken = window.localStorage.getItem('accessToken');
  if (accessToken) {
    user = JSON.parse(accessToken);
  }
  return user.accessToken;
};