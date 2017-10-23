/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const testPort = 8888;

chai.should();
chai.use(chaiHttp);

let server;

describe('Image search abstraction layer', function() {
  this.timeout(10000);

  before(function initializeServer(done) {
    server = app.listen(testPort, done);
  });

  after(function killServer(done) {
    server.close(done);
  });

  it('should return an array of ten objects', function(done) {
    chai.request(server)
        .get('/search')
        .query({q: 'lolcat'})
        .end(function(err, res) {
          if (err) return done(err);

          res.should.have.status(200);
          res.body.should.be.an('array').that.has.lengthOf.at.most(10);
          res.body.forEach(function(obj) {
            obj.should.be.an('object')
                .that.has.all.own.keys('url', 'alt', 'context');
          });
          done();
        });
  });
});
