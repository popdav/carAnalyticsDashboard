const MongoDB = require('../../database/mongo_client/mongo_client');

async function getDistinct(field, match) {
    const db = await MongoDB.getDB();
    let distinctEntities = db.collection('polovni').distinct(
        field,
        match
    );

    console.log(distinctEntities);
    return distinctEntities;
}


module.exports.getDistinct = getDistinct;
