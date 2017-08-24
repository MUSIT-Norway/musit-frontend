// @flow
export type Environment = 'utv' | 'test' | 'prod';

const env = () => {
  const a = process.env.NODE_ENV !== 'production' ? 'dev' : 'prod';
  if (
    a === 'dev' ||
    window.location.href.toLowerCase().includes('test:') ||
    window.location.href.toLowerCase().includes('utv')
  ) {
    return 'utv';
  } else if (window.location.href.toLowerCase().includes('test.uio.no')) {
    return 'test';
  } else {
    return 'prod';
  }
};

const environment: Environment = env();
export default environment;
