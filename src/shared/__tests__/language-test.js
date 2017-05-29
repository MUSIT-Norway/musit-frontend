import { getLanguage, loadLanguage } from '../language';

describe('Language', () => {
  it('should have working getLanguage method', () => {
    const language = getLanguage();
    expect(language).toBe('no');
  });

  it('should have working loadLanguage method', () => {
    loadLanguage();
    const languageAfterUpdate = localStorage.getItem('language');
    expect(languageAfterUpdate).toBe('no');
  });
});
