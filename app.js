const express = require('express');
const app = express();

const Recent = require('./models/recent');

const moment = require('moment');
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
        return data.items.map((item) => ({
          url: item.link,
          alt: item.snippet,
          context: item.image.contextLink,
        }));
      })
      .then(function(data) {
        const recent = new Recent({
          query: q,
          timestamp: moment.utc().format(),
        });
        return recent.save().then(() => data);
      })
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        res.sendStatus(400);
      });
});

app.get('/recent', function(req, res) {
  Recent.find({})
      .select({_id: 0, query: 1, timestamp: 1})
      .limit(10)
      .sort({timestamp: -1})
      .then(function(recentQueries) {
        res.json(recentQueries);
      })
      .catch(function(error) {
        res.sendStatus(500);
      });
});

module.exports = app;
