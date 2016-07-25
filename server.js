var path = require('path'),
    express = require('express'),
    staticPath = path.normalize(__dirname),
    app = express(),
    server = app.listen(3060);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://localhost:27017/chatDB';

var element;
var messages = [];

var insert = function (db, callback) {
    var collection = db.collection('users');
    collection.insert(element);
};
var find = function (db, callback) {
    var collection = db.collection('users');
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

app.use(express.static(staticPath));

app.get('/', function (req, res) {
    res.sendfile(staticDir + 'index.html');
});

app.get('/getchat', function (req, res) {
    if (messages.length == 0) {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            find(db, function (docs) {
                messages = docs;
                db.close();
            })
        });
    }
    res.json(messages);
});

app.post('/messages', function (req, res) {
    var message = req.body;
    element = message;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insert(db, function () {
            db.close();
        })
    });

    messages.push(message);
    res.json(message);
});