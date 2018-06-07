import { TODO } from "../types/common";

export const getAccessToken = () => {
  try {
    window.localStorage; //Checking whether we can read this value
  } catch (e) {
    alert(
      'Cookies blokkert. Du må endre innstillingene i nettleseren din til å godta cookies for å bruke denne tjenesten. \n Cookies blocked. You must enable cookies in your browser to use this service.'
    );
  }
  if (!window.localStorage) {
    return null;
  }
  let user = {};
  const accessToken = window.localStorage.getItem('accessToken');
  if (accessToken) {
    user = JSON.parse(accessToken);
  }
  return (user as TODO).accessToken;
};
