const express = require('express');
const router = express.Router();
const geolocation = require('../services/geolocation/geolocation');
const normalDistribution = require('../services/normal_distribution/normal_distribution');
const distinctService = require('../services/distinct/distinct_queries');
const priceTime = require('../services/avg_query/price_time');
const cookieParser = require('cookie-parser');
const cookieHandler = require('../services/cookies/cookie_handler');

router.get('/test', async(req, res) => {
    console.log(req.cookies['userId']);
    let result = await cookieHandler.handleLog(req.cookies['userId']);
    res.cookie('userId', result.userId, { maxAge: 900000, httpOnly: true });
    res.send(result.queries);
});

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../client_v2/build', 'index.html'));
});

router.post('/queryFromDateToDate',  async (req, res)=> {
    //await cookieHandler.updateQuery(req.cookies['userId'], req.searchBody);
    let result = await priceTime.price_time(req.body.searchBody, req.body.dates[0], req.body.dates[1]);
    res.send(result);
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

router.post('/distinct', async (req, res)=> {
    //TODO samo ovde namesti da saljes req.body.field, da ne stoji kardkodirano makra i ruta moze da se zove samo distinct
    const distinctMakes = await distinctService.getDistinct(req.body.field, req.body.match);
    res.send(distinctMakes);

});

// router.post('/distinctModels', (req, res)=> {
//     const collectionName = 'polovni';
//     console.log(req.body);
//     cardb.collection(collectionName)
//         .distinct(
//             "model",
//             req.body, // query object
//             (function(err, docs){
//                 if(err){
//                     return console.log(err);
//                 }
//                 if(docs){
//                     res.send(docs.sort());
//                 }
//             })
//         );
// });


// router.post('/distinctType', (req, res)=> {
//     const collectionName = 'polovni';
//     cardb.collection(collectionName)
//         .distinct(
//             "karoserija",
//             {}, // query object
//             (function(err, docs){
//                 if(err){
//                     return console.log(err);
//                 }
//                 if(docs){
//                     res.send(docs.sort());
//                 }
//             })
//         );
// });

// router.post('/distinctRegion', (req, res)=> {
//     const collectionName = 'geolocations';
//     cardb.collection(collectionName)
//         .distinct(
//             "city",
//             {}, // query object
//             (function(err, docs){
//                 if(err){
//                     return console.log(err);
//                 }
//                 if(docs){
//                     res.send(docs.sort());
//                 }
//             })
//         );
// });

module.exports = router;
