const mongoose = require('mongoose');
const app = require('./app');

require('dotenv').config();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
mongoose.connection
    .once('open', () => app.listen(port));
