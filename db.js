const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, (Error, client)=>{
    module.exports = client.db()
    const server = require('./server');
    const port = process.env.PORT;
    server.listen(port, () => console.log("Listening on port " + port))
})