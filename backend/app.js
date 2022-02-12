const debug = require('debug')('log:');
const { init } = require('./src/database');
const app = require('./src/server');

init();

const PORT = 3000;

app.listen(PORT, () => {
  debug('Server running on PORT 3000');
});
