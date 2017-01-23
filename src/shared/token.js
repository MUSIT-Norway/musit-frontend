import jwtDecode from 'jwt-decode';

export const getAccessToken = () => {
  let user = {};
  const jwtToken = localStorage.getItem('jwtToken');
  if (jwtToken) {
    user = jwtDecode(jwtToken);
  }
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    user = JSON.parse(accessToken);
  }
  return user.accessToken;
};