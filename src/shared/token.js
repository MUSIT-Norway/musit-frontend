import fakeUserInfo from '../../fake_security.json';
import jwtDecode from 'jwt-decode';

export const getAccessToken = () => {
  let user = {};
  const jwtToken = localStorage.getItem('jwtToken');
  if (jwtToken) {
    user = jwtDecode(jwtToken);
  }
  const fakeToken = localStorage.getItem('fakeToken');
  if (fakeToken) {
    const userid = JSON.parse(fakeToken).userid;
    user = fakeUserInfo.find(u => u.userid === userid);
  }
  return user.accessToken;
};

export const clearAccessToken = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('fakeToken');
};