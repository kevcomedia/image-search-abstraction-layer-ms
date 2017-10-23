const express = require('express');
const app = express();

require('dotenv').config();
const request = require('request-promise-native');

app.get('/', function(req, res) {
  res.send('Hello world');
});

app.get('/search', function(req, res) {
  const cx = process.env.SEARCH_CX;
  const key = process.env.SEARCH_KEY;
  const q = req.query.q;
  const start = req.query.offset ? Number.parseInt(req.query.offset) : 1;

  const options = {
    uri: 'https://www.googleapis.com/customsearch/v1',
    qs: {
      cx,
      key,
      q,
      start,
      searchType: 'image',
    },
    json: true,
  };

  request(options)
      .then(function(data) {
        res.json(data.items.map((item) => ({
          url: item.link,
          alt: item.snippet,
          context: item.image.contextLink,
        })));
      })
      .catch(function(err) {
        res.sendStatus(400);
      });
});

module.exports = app;
