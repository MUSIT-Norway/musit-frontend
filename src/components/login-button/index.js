const real = require('./real')
const fake = require('./fake')
const Button = __FAKE_FEIDE__ ? fake : real;
export default Button;
