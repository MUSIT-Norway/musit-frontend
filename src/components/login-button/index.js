import config from '../../config';
import real from './real';
import fake from './fake';
const Button = config.isFake ? fake : real;
export default Button;
