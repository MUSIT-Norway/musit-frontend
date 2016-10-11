export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: process.env.FAKE_FEIDE || false,
  useDevTools: process.env.DEV_TOOLS || false
};
