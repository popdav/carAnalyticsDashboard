const MongoDB = require('../../database/mongo_client/mongo_client');
const uuidv4 = require('uuid/v4');

async function handleLog(userId) {

    let queries = {};
    if(userId === undefined) {
        userId = await register_user();
    }
    else {
        queries = {'res': 'ekstra'};
    }

    return {'userId': userId, 'queries': queries};

}

async function updateQuery(userId) {
    //TODO dodaj u bazu update novog kverija ako takav ne postoji
}

async function register_user() {
    return uuidv4();
}

module.exports = {
    handleLog,
    updateQuery,
};
