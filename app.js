console.log('Server-side running');
// Importing Express library
const express = require('express');
// Initializing express object
var app = express();
// Importing mongo
const mongoClient = require('mongodb').MongoClient;
// Mongo connection url
const url = "mongodb://localhost:27017";
const client = new mongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//Establishing connection to MongoDB
client.connect(function (err) {
    console.log("Server Connected Successfully");

    app.listen(27017, () => {
        console.log('listening on 27017');
    });
});
// Initializing Port
app.set('port', (process.env.PORT || 3000))
// App listening on port
app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
});
// Setting the views and letting node know where to look for html files
app.use("/static", express.static('./static/'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/view.html');
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Function one - Called when query 1 button is clicked in the front-end
app.get('/queryOne', (req, res) => {
    console.log(client);
    const collectionOne = client.db("testemp");
    collectionOne.collection('employees').aggregate([
        {
            '$sort': {
                'birth_date': 1
            }
        }, {
            '$group': {
                '_id': '$gender',
                'First Name': {
                    '$first': '$first_name'
                },
                'Last Name': {
                    '$first': '$last_name'
                },
                'Date of birth': {
                    '$first': '$birth_date'
                }
            }
        }
    ]).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

// Function Two - Called when query 2 button is clicked in the front-end
app.get('/queryTwo', (req, res) => {
    const collectionTwo = client.db("testemp");
    collectionTwo.collection('department_emp').aggregate([
        {
            '$group': {
                '_id': '$dept_no',
                'count': {
                    '$sum': 1
                }
            }
        }
    ]).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

// Function Three - Called when query 3 button is clicked in the front-end
app.get('/queryThree', (req, res) => {
    const collectionThree = client.db("testemp");
    collectionThree.collection('department_manager').aggregate([
        {
            '$lookup': {
                'from': 'employees',
                'localField': 'emp_no',
                'foreignField': 'emp_no',
                'as': 'dep'
            }
        }, {
            '$group': {
                '_id': {
                    'dept': '$dept_no',
                    'gender': '$dep.gender'
                },
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$sort': {
                '_id.dept': 1
            }
        }
    ]).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

// Function Four - Called when query 4 button is clicked in the front-end
app.get('/queryFour', (req, res) => {
    const collectionFour = client.db("testemp");
    collectionFour.collection('salaries').aggregate([
        {
            '$match': {
                'to_date': {
                    '$regex': new RegExp('^9999')
                }
            }
        }, {
            '$sort': {
                'salary': -1
            }
        }, {
            '$project': {
                '_id': 1,
                'emp_no': 1,
                'salary': 1
            }
        }, {
            '$lookup': {
                'from': 'department_emp',
                'localField': 'emp_no',
                'foreignField': 'emp_no',
                'as': 'emp'
            }
        }, {
            '$project': {
                '_id': 1,
                'emp_no': 1,
                'salary': 1,
                'dept': '$emp.dept_no'
            }
        }, {
            '$lookup': {
                'from': 'employees',
                'localField': 'emp_no',
                'foreignField': 'emp_no',
                'as': 'emp2'
            }
        }, {
            '$project': {
                '_id': 1,
                'emp_no': 1,
                'salary': 1,
                'dept': 1,
                'gend': '$emp2.gender'
            }
        }, {
            '$limit': 10
        }, {
            '$group': {
                '_id': '$gend',
                'd': {
                    '$first': '$dept'
                },
                's': {
                    '$first': '$salary'
                }
            }
        }
    ]).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

// Function Five - Called when query 5 button is clicked in the front-end
app.get('/queryFive', (req, res) => {
    const collectionFive = client.db("testemp");
    collectionFive.collection('titles').aggregate([
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

