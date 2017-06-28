// @flow

import pick from 'lodash/pick';

export type FeatureToggles = {
  administrationPage: boolean
};

const featureToggles: FeatureToggles = {
  /**
   * Administration page.
   */
  administrationPage: false
};

const featureToggleKeys = Object.keys(featureToggles);

/**
 * Looking for an object named featuretoggles in localstorage and exstract the
 * known keys from it.
 *
 * To set a feature in your browser:
 * localStorage.setItem('featuretoggles', JSON.stringify({"feature_key": true}))
 */
const overridesFromLocalStorage = () => {
  const ls = window.localStorage.getItem('featuretoggles');
  if (ls) {
    const togglesFromLocalStorage = pick(JSON.parse(ls), featureToggleKeys);
    return { ...featureToggles, ...togglesFromLocalStorage };
  }
  return featureToggles;
};

export default overridesFromLocalStorage();
