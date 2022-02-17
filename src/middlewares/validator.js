const apiKeys = process.env.API_KEYS.split(',');

module.exports = {
  checkApiKey(request, response, next) {
    console.log('[checkApiKey] headers: ', request.headers);
    console.log('[checkApiKey] apiKeys[] tipo: ', typeof apiKeys);
    if (apiKeys.includes(request.headers.api_key) || apiKeys.includes(request.headers['api-key'])) {
      console.log('[checkApiKey] api_key ou api-key valido');
      return next();
    }
    return response.status(401).json({ error: 'API_KEY invalid.' });
  },
};
