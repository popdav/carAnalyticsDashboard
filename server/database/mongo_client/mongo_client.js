const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
let _db;

const connectDB = async (callback) => {
    try {
        await MongoClient.connect(url, url, { useUnifiedTopology: true }, async (err, client) => {
            _db = client.db('Polovni');
            await _db.collection("polovni").createIndex({'marka':1, 'model':1});
            await _db.collection("test_cene").createIndex({'link':1, 'date':1});
            await _db.collection("geolocations").createIndex({'city':1});
            console.log("Connection to database successful");
            return callback(err);
        })
    } catch (e) {
        throw e
    }
};

const getDB = () => _db;

const disconnectDB = () => _db.close();

module.exports = { connectDB, getDB, disconnectDB };
