const apiKeys = process.env.API_KEYS.split(',');

module.exports = {

  checkApiKey(request, response, next) {
    console.log('[checkApiKey] api_key: ',request.headers.api_key);
    console.log('[checkApiKey] apiKeys[] tipo: ', typeof apiKeys);
    if (apiKeys.includes(request.headers.api_key)) {
      console.log('[checkApiKey] api_key valido');
      return next();
    }
    return response.status(401).json({ error: 'API_KEY invalid.' });
  },
};
