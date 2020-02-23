const MongoDB = require('../../database/mongo_client/mongo_client');

async function price_time(match_object, start_date, end_date) {

    match_object["link"] = { "$ne": 0 };
    const db = await MongoDB.getDB();

    return await db.collection('polovni').aggregate([
        {
            "$match": match_object
        },
        {
            '$lookup': {
                'from': 'test_cene',
                'localField': 'link',
                'foreignField': 'link',
                'as': 'istorija_cena'
            }
        },
        {
            '$unwind': '$istorija_cena'
        },
        {
            "$match" : { "istorija_cena.date": {"$gte": new Date(start_date), "$lte": new Date(end_date)} }
        },
        {
            '$group': {
                '_id': '$istorija_cena.date',
                "places" : {"$push":"$$ROOT"},
                'avg_price': {
                    '$avg': '$istorija_cena.price'
                },
                "max": { "$max" : "$istorija_cena.price" },
                "min": { "$min" : "$istorija_cena.price" }

            }
        },
        {
            "$sort": {"_id": 1}
        }

    ]).toArray();

}

module.exports.price_time = price_time;
