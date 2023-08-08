const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assurez-vous que c'est le bon chemin vers votre application Express
const expect = chai.expect;

chai.use(chaiHttp);

describe('Tasks API', () => {
  // Test pour la route GET /tasks
  it('should return all tasks', (done) => {
    chai.request(app)
      .get('/tasks')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Test pour la route POST /tasks
  it('should create a new task', (done) => {
    chai.request(app)
      .post('/tasks')
      .send({ title: 'Test Task' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.title).to.equal('Test Task');
        done();
      });
  });
});
