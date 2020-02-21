const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';

const dbName = 'Polovni';
let db = null;

MongoClient.connect(url, { useUnifiedTopology: true } , async function(err, client) {
    assert.equal(null, err);
    db = client.db(dbName);
    await db.collection("geolocations").createIndex({'city':1});

});

async function get_places(match_object) {
    let places = await db.collection('polovni')
        .aggregate([ {"$match" : match_object}, {"$project": {"mesto" : 1, "_id" : 0 }}]).toArray();

    return places.map(e => e['mesto']);
}

async function map_to_coords(match_object) {

    let arrayOfCities = await get_places(match_object);

    return await Promise.all(
        arrayOfCities.map(async city => {
            return await get_coords(city);
        })
    );
}

async function get_coords(city) {
    let coords = await db.collection('geolocations').findOne(
        {"city": city}
    );
    if (coords === null || coords === undefined) {
        coords = await db.collection('geolocations').findOne(
            {"city": 'Beograd'}
        );
    }
    return {'lat': coords['lat'], 'lng':coords['lng']};
}

exports.map_to_coords = map_to_coords;

