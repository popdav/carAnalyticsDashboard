const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';

const dbName = 'Polovni';
let db = null;

MongoClient.connect(url, { useUnifiedTopology: true } , async function(err, client) {
    assert.equal(null, err);
    db = client.db(dbName);
});


async function get(match_object) {

    return await db.collection('polovni').aggregate([

        {
            "$group": {
                "_id" : match_object,
                stdDev: {"$stdDevPop": "$cena"},
                mean: {"$avg": "$cena"},
                data : {"$push":"$cena"},
            }
        }

    ]).toArray();
}

async function calc_normal(match_object) {

    let resp = get(match_object);
    resp.data.map(price => (price - resp.mean) / resp.stdDev);
    console.log(resp.data);
    return resp;
}

exports.calc_normal = calc_normal;
