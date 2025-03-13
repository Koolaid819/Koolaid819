const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('Functional Tests', () => {
  let threadId;
  let replyId;

  it('Create a new thread', (done) => {
    chai.request(server)
      .post('/api/threads/testboard')
      .send({ text: 'Test Thread', delete_password: 'password123' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('_id');
        threadId = res.body._id;
        done();
      });
  });

  it('Create a new reply', (done) => {
    chai.request(server)
      .post('/api/replies/testboard')
      .send({ thread_id: threadId, text: 'Test Reply', delete_password: 'password123' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('_id');
        replyId = res.body._id;
        done();
      });
  });

  // Additional tests based on other requirements...
});
