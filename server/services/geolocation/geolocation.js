const MongoDB = require('../../database/mongo_client/mongo_client');

async function get_places(match_object) {
    const db = await MongoDB.getDB();
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
    const db = await MongoDB.getDB();
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
