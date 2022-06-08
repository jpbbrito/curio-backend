module.exports = {

    save(request, response, next) {
      const {
        base64,
        description
      } = request.body;
  
      let errors = [];
      if (!base64 || (typeof base64 !== 'string')) {
        errors.push({ description: 'Esse campo deve preenchido corretamente' });
      }
      if (errors.length > 0) {
        return response.status(400).json({
          errors
        });
      }
      return next();
    },
  };
  