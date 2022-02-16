//const apiKeys = process.env.API_KEYS.split(',');

module.exports = {

  checkApiKey(req, res, next) {
    /*
    if (apiKeys.includes(req.headers.api_key)) {
      return next();
    }
    return res.status(401).json({ error: 'API_KEY invalid.' });
    */
    return next();
  },

};
