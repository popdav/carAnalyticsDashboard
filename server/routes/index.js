const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const MongoDB = require('../database/mongo_client/mongo_client');
const assert = require('assert');
const geolocation = require('../services/geolocation/geolocation');
const normalDistribution = require('../services/normal_distribution/normal_distribution');

// MongoDB.connectDB();

// const url = 'mongodb://localhost:27017';
//
// const dbName = 'Polovni';
// let cardb = null;
//
// MongoClient.connect(url, { useUnifiedTopology: true } , async function(err, client) {
//   assert.equal(null, err);
//
//   cardb = client.db(dbName);
//   await cardb.collection("polovni").createIndex({'marka':1, 'model':1});
//   await cardb.collection("test_cene").createIndex({'link':1, 'date':1});
//   console.error("Connected successfully to server");
//   // client.close();
// });



router.get('/', function(req, res, next) {
  res.send( { title: 'Express' });
});

router.post('/queryFromDateToDate',  (req, res)=> {
  // console.log("Usao!");
    // console.log(req.body);
  const collectionName = 'polovni';
  let match_object =   req.body.searchBody;
  match_object["link"] = { "$ne": 0 };
  console.log(match_object);

  cardb.collection(collectionName).aggregate([
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
          "$match" : { "istorija_cena.date": {"$gte": new Date(req.body.dates[0]), "$lte": new Date(req.body.dates[1])} }
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

  ]).toArray((err, results) => {
    assert.equal(err, null);
    // console.log(results);
    res.send(results);
  });


});

router.post('/normal',  async (req, res)=> {
    let match_object =   req.body;
    let result = await normalDistribution.calc_normal(match_object);
    res.send(result);
});

router.post('/places',  async (req, res)=> {
    console.log(req.body);
    let coords = await geolocation.map_to_coords(req.body);
    res.send(coords);

});


router.post('/distinctMakes', (req, res)=> {
    const collectionName = 'polovni';
    cardb.collection(collectionName)
        .distinct(
            "marka",
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
    const collectionName = 'polovni';
    console.log(req.body)
    cardb.collection(collectionName)
        .distinct(
            "model",
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
    const collectionName = 'polovni';
    cardb.collection(collectionName)
        .distinct(
            "karoserija",
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

router.post('/distinctRegion', (req, res)=> {
    const collectionName = 'geolocations';
    cardb.collection(collectionName)
        .distinct(
            "city",
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
