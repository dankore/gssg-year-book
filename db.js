const mongodb = require('mongodb');
const connectionString = ''

mongodb.connect(string, {useNewUrlParser: true, useUnifiedTopology: true}, (Error, client)=>{
    module.exports = client.db()
})