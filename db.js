const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient
dotenv.config();

MongoClient.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function (client) {
        module.exports = client;
        const port = process.env.PORT || 3000;
        const server = require('./server/server');
        server.listen(port, () => console.log("Listening on port " + port));
    })
    .catch(error => console.log(error));
