const MongoDB = require('../../database/mongo_client/mongo_client');
const uuidv4 = require('uuid/v4');

async function handleLog(userId) {

    let queries = [];
    if(userId === undefined) {
        userId = await register_user();
    }
    else {
        const db = await MongoDB.getDB();
        queries = await db.collection('queries').findOne(
            { 'userId': userId },
        )
    }

    return {'userId': userId, 'queries': queries};

}

async function updateQuery(userId, matchObject) {
    const db = await MongoDB.getDB();
    await db.collection('queries').update(
        { "userId": userId },
        {
            "$push": {
                "queries": {
                    "$each": matchObject
                }
            }
        }
    )
}

async function register_user() {
    const uuid = uuidv4();
    const db = await MongoDB.getDB();
    await db.collection('queries').insertOne(
        {'userId': uuid, 'searches':{}}
    );

    return uuid;
}

module.exports = {
    handleLog,
    updateQuery,
};
