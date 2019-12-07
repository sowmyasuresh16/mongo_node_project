console.log('Server-side code running');
const express = require('express');
const fs = require('fs');
const path = require('path');
var jsdom = require('jsdom');
global.document = jsdom.JSDOM;
global.win = document.defaultView;

var app = express()
const MongoClient = require('mongodb').MongoClient;
const index = require('./static/client.js');
const assert = require('assert');
app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
})
app.use("/static", express.static('./static/'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/view.html');
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//Establish connection to MongoDB
const client = MongoClient.connect("mongodb://localhost:27017", function (err, db) {

    if (err) throw err;

    //Write databse Insert/Update/Query code here..

    console.log("Connected successfully to server");
});

app.get('/clickedone', (req, res) => {
    const db1 = client.db("testemp");
    db1.collection('employees').aggregate([
        { $sort: { "birth_date": 1 } },
        {
            $group: {
                _id: "$gender", "First Name": { $first: "$first_name" },
                "Last Name": { $first: "$last_name" }, "Date of Birth": { $first: "$birth_date" }
            }
        }]).toArray((err, result) => {
            if (err) return console.log(err);
            res.send(result);
        });
});
app.get('/clickedtwo', (req, res) => {
    const db2 = client.db("testemp");
    db2.collection('department_emp').aggregate([
        { '$group': { '_id': '$dept_no', 'count': { '$sum': 1 } } }]).toArray((err, result) => {
            if (err) return console.log(err);
            res.send(result);
        });
});
app.get('/clickedthree', (req, res) => {
    const db3 = client.db("testemp");
    db3.collection('department_manager').aggregate([
        {
            "$lookup": {
                "localField": "emp_no",
                "from": "employees", "foreignField": "emp_no", "as": "dep"
            }
        },
        {
            "$group": {
                "_id": { "dept": "$dept_no", "gender": "$dep.gender" },
                "count": { "$sum": 1 }
            }
        }, {
            '$sort': {
                '_id.dept': 1
            }
        }]).toArray((err, result) => {
            if (err) return console.log(err);
            res.send(result);
        });
});
app.get('/clickedfour', (req, res) => {
    const db4 = client.db("testemp");
    db4.collection('salaries').aggregate([
        { $match: { "to_date": { $regex: /^9999/ } } },
        { $sort: { "salary": -1 } },
        {
            $group: {
                _id: "$gender", "First Name": { $first: "$first_name" },
                "Last Name": { $first: "$last_name" }, "Date of Birth": { $first: "$birth_date" }
            }
        }]).toArray((err, result) => {
            if (err) return console.log(err);
            res.send(result);
        });
});
app.get('/clickedfive', (req, res) => {
    const db5 = client.db("testemp");
    db5.collection('titles').aggregate([
        {
            '$project': {
                'title': '$title',
                'duration': {
                    '$subtract': [
                        {
                            '$dateFromString': {
                                'dateString': '$to_date',
                                'format': '%Y-%m-%d'
                            }
                        }, {
                            '$dateFromString': {
                                'dateString': '$from_date',
                                'format': '%Y-%m-%d'
                            }
                        }
                    ]
                }
            }
        }, {
            '$project': {
                '_id': 1,
                'title': 1,
                'Tenureyears': {
                    '$divide': [
                        '$duration', 31536000000
                    ]
                }
            }
        }, {
            '$project': {
                '_id': 1,
                'title': 1,
                'newduration': {
                    '$cond': {
                        'if': {
                            '$gte': [
                                '$Tenureyears', 50
                            ]
                        },
                        'then': {
                            '$subtract': [
                                '$Tenureyears', 7980
                            ]
                        },
                        'else': {
                            '$add': [
                                '$Tenureyears', 0
                            ]
                        }
                    }
                }
            }
        }, {
            '$group': {
                '_id': '$title',
                'Avg': {
                    '$avg': '$newduration'
                }
            }
        }, {
            '$project': {
                '_id': 1,
                'Floored': {
                    '$floor': '$Avg'
                }
            }
        }
    ]
    ).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

