const { response } = require('express');
const request = require('supertest');
const app = require('../../src/server');

const { Database, init } = require('../../src/database/index.js');
init();

const dataInvalidPayload = {
  description: 'Buraco na rua',
  address: 'Rua Ayrton Senna',
  telegramUser: 'jp_bbrito',
  longitude: '-12.1446365',
  latitude: '-38.4028528',
};
const dataValid = {
  description: 'Buraco na rua',
  address: 'Rua Ayrton Senna',
  reporterContact: 'jp_bbrito',
  longitude: -89.123456,
  latitude: -78.12345,
};

describe('api/problems', () => {
  afterAll(() => {
    Database.connection.destroy();
  });
  it('POST /problems -> Should be return status 422 - Invalid Payload ', async () => {
    await request(app)
      .post('/api/problems')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(dataInvalidPayload))
      .then(response => {
        const { body, status } = response;
        expect(status).toBe(422);
      }) 
    
  });

  it('POST /problems -> Should be create item and return status 201 ', async () => {
    const response = await request(app)
      .post('/api/problems')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(dataValid))
      .then( response => {
        const { body, status } = response;
        dataValid.problemId = body.problemId;
        expect(status).toBe(201);
      })
    
  });

  it('PUT /problems -> Should be update item and return status 200 ', async () => {
    const response = await request(app)
      .put(`/api/problems/${dataValid.problemId}`)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        description: 'REGISTRO MODIFICADO',
        address: 'REGISTRO MODIFICADO'
      }))  
      .then( response => {
        const { body, status } = response;
        expect(status).toBe(200);
      })
    
  });

  it('DELETE /problems -> Should be try delete item and return status 404 ', async () => {
    const response = await request(app)
      .delete(`/api/problems/0004efa5-1d0b-4644-9f40-0008317ec000`)
      .set('Content-Type', 'application/json')
      .then( response => {
        const { body, status } = response;
        expect(status).toBe(404);
        expect(body.message).toBe('Problem not found');
      })
    
  });

});
