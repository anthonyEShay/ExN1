const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var mongodb = require('mongodb');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
    .get('/cool', (req, res) => res.send(cool()))
    .get('/times', (req, res) => res.send(showTimes()))
    .get('/mongodb', function (request, response) {
        mongodb.MongoClient.connect('mongodb://heroku_54zgmmrg:is0cnci5tcmdlpkase8nfq73vg@ds329058.mlab.com:29058/heroku_54zgmmrg', function(err, client) {
            // mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {  // works with mongodb v2 but not v3
            if(err) throw err;
            //get collection of routes
            var db = client.db('heroku_xrhllv16');  // in v3 we need to get the db from the client
            var Routes = db.collection('Routes');
            //get all Routes with frequency >=1
            Routes.find({ frequency : { $gte: 1 } }).sort({ name: 1 }).toArray(function (err, docs) {
                if(err) throw err;
                response.render('pages/mongodb', {results: docs});
            });
            //close connection when your app is terminating.
            // db.close(function (err) {
            client.close(function (err) {
                if(err) throw err;
            });
        });//end of connect
    })//end app.get
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


showTimes = () => {
    let result = ''
    const times = process.env.TIMES || 5
    for (i = 0; i < times; i++) {
        result += i + ' '
    }
    return result;
}