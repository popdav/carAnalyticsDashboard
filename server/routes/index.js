const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'cardb';

let cardb = null;

MongoClient.connect(url, { useUnifiedTopology: true } , function(err, client) {
  assert.equal(null, err);
  console.error("Connected successfully to server");

  cardb = client.db(dbName);

  // client.close();
});

router.get('/', function(req, res, next) {
  res.send( { title: 'Express' });
});

router.post('/queryFromDateToDate', (req, res)=> {
  // console.log("Usao!");
    console.log(req.body);
  const collectionName = 'cars';
  const match_object =   req.body.searchBody;
  const date_begin = '2019-11-14';
  const date_end = '2019-11-17';
  cardb.collection(collectionName).aggregate([
    {"$match" : match_object},
    {"$unwind": "$istorija"},
    {"$project": {"istorijski_podaci": {"$objectToArray": "$istorija"}, "place" : "$mesto"}},
    {"$unwind": "$istorijski_podaci"},
    {"$match" : {
        "istorijski_podaci.v": {"$gt":0},
        "istorijski_podaci.k": {"$gte": req.body.dates[0], "$lte": req.body.dates[1]},
      }
    },
    {"$group":
          {
            "_id": "$istorijski_podaci.k",
            "places" : {"$push":"$$ROOT"},
            "avg_price": {"$avg": "$istorijski_podaci.v"},
            "max": { "$max" : "$istorijski_podaci.v" },
            "min": { "$min" : "$istorijski_podaci.v" }
          }
    },
    {"$sort": {"_id": 1}}

  ]).toArray((err, results) => {
    assert.equal(err, null);
    // console.log(results);
    res.send(results);
  });


});


router.post('/distinctMakes', (req, res)=> {
    const collectionName = 'cars';
    cardb.collection(collectionName)
        .distinct(
            "Marka",
            {}, // query object
            (function(err, docs){
                if(err){
                    return console.log(err);
                }
                if(docs){
                    res.send(docs.sort());
                }
            })
        );
});

router.post('/distinctModels', (req, res)=> {
    const collectionName = 'cars';
    console.log(req.body)
    cardb.collection(collectionName)
        .distinct(
            "Model",
            req.body, // query object
            (function(err, docs){
                if(err){
                    return console.log(err);
                }
                if(docs){
                    res.send(docs.sort());
                }
            })
        );
});


router.post('/distinctType', (req, res)=> {
    const collectionName = 'cars';
    cardb.collection(collectionName)
        .distinct(
            "Karoserija",
            {}, // query object
            (function(err, docs){
                if(err){
                    return console.log(err);
                }
                if(docs){
                    res.send(docs.sort());
                }
            })
        );
});

module.exports = router;
