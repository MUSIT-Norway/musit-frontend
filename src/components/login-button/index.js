import config from '../../config'
const real = require('./real').default
const fake = require('./fake').default
const Button = config.isFake ? fake : real;
export default Button;
