export const getAccessToken = () => {
  if (!window.localStorage) {
    return null;
  }
  let user = {};
  const accessToken = window.localStorage.getItem('accessToken');
  if (accessToken) {
    user = JSON.parse(accessToken);
  }
  return user.accessToken;
};
