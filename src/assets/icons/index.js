const files = require.context('./', false, /\.svg$/);
export default files.keys().map(key => {
  const file = files(key);
  console.log(file, key);
});
