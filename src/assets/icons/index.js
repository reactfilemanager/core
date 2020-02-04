/** @jsx jsx */
import {jsx} from 'theme-ui';

const icons = {};
const files = require.context('!!raw-loader!./', false, /\.svg$/);
files.keys().map(key => {
  const file = files(key);
  return {name: key.split(/\/|\./g)[2], svg: file.default};
}).forEach(file => {
  icons[file.name] = <span 
                      sx={{ display: 'inline-block' }}
                      dangerouslySetInnerHTML={{__html: file.svg}}/>;
});

export default icons;
