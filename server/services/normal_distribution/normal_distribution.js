const MongoDB = require('../../database/mongo_client/mongo_client');

async function get(match_object) {
    // let groupID = JSON.parse(JSON.stringify(match_object));
    match_object['cena'] = {'$gte': 0};
    const db = await MongoDB.getDB();
    return await db.collection('polovni').aggregate([
        {
            "$match" : match_object
        },
        {
            "$group": {
                _id : null,
                stdDev: {"$stdDevPop": "$cena"},
                mean: {"$avg": "$cena"},
                data : {"$push":"$cena"},
            }
        }

    ]).toArray();
}

async function calc_normal(match_object) {

    let resp = await get(match_object);
    resp = resp[0];
    resp.data = resp.data.map(price => (price - resp.mean) / resp.stdDev);

    return resp;
}

exports.calc_normal = calc_normal;
