//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
//app.set('view engine', 'ejs');
var mysql = require('mysql');
// var pool = require('./pool');
const multer = require('multer');
var fs = require('fs');

// var pool = mysql.createPool({
//     connectionLimit: 100,
//     host: 'localhost',
//     user: 'root',
//     password: 'Tina.1234',
//     database: 'grubhub',
//     debug: false
// })

var pool = mysql.createPool({
    connectionLimit: 100,
    port: '3306',
    host: 'samsbot1.cvrunnkd3clm.us-east-1.rds.amazonaws.com',
    user: 'ankitj03',
    password: 'ankitj03',
    database: 'samsbot',
    debug: false
})

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://3.88.193.169:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

// pool.connect(function(err) {
//     if (err) {
//       return console.error('error: ' + err.message);
//     }
  
//     console.log('Connected to the MySQL server.');
//   });

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());
var clientEmail = "";
var ownerEmail = "";
var sessionResponse = "";
var orderId;
var id;
var nextOrderId;
var imageId;

var storagePropFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("req.session.user is", JSON.stringify(req.params));
        callback(null, createDirectory(imageId));
    },
    filename: function (req, file, callback) {
        console.log("req", req.body);
        callback(null, file.originalname);
    }
});

// var rootDirectory = "public/images/";
var rootDirectory = "../frontend/public/images/";

var uploadPropFiles = multer({
    storage: storagePropFiles
});

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://3.88.193.169:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Route to handle Post Request Call
app.post('/clientLogin', function (req, res) {

    console.log("Inside Client Login Post Request");
    clientEmail = req.body.email;
    var password = req.body.password;
    var sql = "SELECT *  FROM client_signup WHERE client_email = " +
        mysql.escape(clientEmail) + "and password = " + mysql.escape(password);
    console.log(sql)
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                console.log(result)
                if (result.length == 0) {
                    console.log('hello');
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Invalid Credentials");
                } else {
                    res.cookie('cookie', 'client', { maxAge: 900000, httpOnly: false, path: '/' });
                    req.session.user = result;
                    sessionResponse = JSON.parse((JSON.stringify(req.session.user)));
                    imageId = sessionResponse[0].client_email;
                    console.log('imageId....', imageId);
                    console.log("client_email", sessionResponse[0].client_email);
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Successful Login");
                }
            });
        }
    });

});

app.post('/clientSignup', function (req, res) {
    console.log("Inside Client Create Request Handler");
    var sql = "INSERT INTO client_signup VALUES ( " +
        mysql.escape(req.body.firstName) + " , " + mysql.escape(req.body.lastName) + " , " + mysql.escape(req.body.email) + " , " +
        mysql.escape(req.body.password) + " ) ";
    console.log(sql);
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While Signing up Client");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Client Created Successfully');
        }
    });
});

app.post('/ownerLogin', function (req, res) {

    console.log("Inside Owner Login Post Request");
    ownerEmail = req.body.email;
    var password = req.body.password;
    var sql = "SELECT *  FROM owner_signup WHERE owner_email = " +
        mysql.escape(ownerEmail) + "and password = " + mysql.escape(password);


    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (result.length == 0) {
                    console.log("hello");
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Invalid Credentials");
                } else {
                    res.cookie('cookie', 'owner', { maxAge: 900000, httpOnly: false, path: '/' });
                    req.session.user = result;
                    sessionResponse = JSON.parse((JSON.stringify(req.session.user)));
                    console.log("r_id", sessionResponse[0].r_id);
                    imageId = sessionResponse[0].r_id;
                    console.log("imageId........", imageId);
                    console.log("owner_email", sessionResponse[0].owner_email);
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Successful Login");
                }
            });
        }
    });

});

app.post('/ownerSignup', function (req, res) {
    console.log("Inside Owner Create Request Handler");
    var sql = "INSERT INTO owner_signup (first_name, last_name, owner_email, restaurant_name, restaurant_zip_code, password) VALUES ( " +
        mysql.escape(req.body.firstName) + " , " + mysql.escape(req.body.lastName) + " , " + mysql.escape(req.body.email) + " , " + mysql.escape(req.body.restaurantName) + " , " + mysql.escape(req.body.restaurantZipCode) + " , " + mysql.escape(req.body.password) + " ) ";
    console.log(sql);

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While Signing up Owner");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Owner Created Successfully');
        }
    });
});

app.get('/userUpdate', function (req, res) {
    console.log(clientEmail)
    var sql = "SELECT * FROM client_signup where client_email = '" + clientEmail + "'";
    console.log(sql)
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection ");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    console.log(result);
                    console.log((result[0]).first_name);
                    console.log(JSON.stringify(result));
                    res.end(JSON.stringify(result));

                }
            });
        }
    })

})

app.get('/userProfileImage', function (req, res) {
    console.log(clientEmail)
    var sql = "SELECT profile_image from client_update where client_email = '" + clientEmail + "'";
    console.log(sql)
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection ");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    console.log(result);
                    console.log((result[0]).first_name);
                    console.log(JSON.stringify(result));
                    res.end(JSON.stringify(result));

                }
            });
        }
    })

})

app.post('/userUpdateName', function (req, res) {
    console.log("Inside Update name Handler");
    // var sql = "UPDATE client_update SET first_name = '"+req.body.first_name+"', last_name = '"+req.body.last_name+"'  WHERE client_email = '"+clientEmail+"'" ;
    var sql = "UPDATE client_signup SET first_name = '" + req.body.first_name + "', last_name = '" + req.body.last_name + "'  WHERE client_email = '" + clientEmail + "'";
    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating name");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Name updated Successfully');
        }
    });
});

app.post('/userUpdateEmail', function (req, res) {
    console.log("Inside Update email Handler");
    var sql = "UPDATE client_update SET client_email = '" + req.body.client_email + "'  WHERE client_email = '" + clientEmail + "' AND " + "'" + req.body.confirmEmail + "'" + " = '" + req.body.client_email + "'";
    var sql1 = "UPDATE client_signup SET client_email = '" + req.body.client_email + "'  WHERE client_email = '" + clientEmail + "' AND " + "'" + req.body.confirmEmail + "'" + " = '" + req.body.client_email + "'";
    console.log(sql)
    console.log(sql1)
    pool.query(sql1)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating email");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Email updated Successfully');
        }
    });
});

app.post('/userUpdatePassword', function (req, res) {
    console.log("Inside Update Password Handler");
    var sql = "UPDATE client_signup SET password = '" + req.body.newPassword + "'  WHERE password = '" + req.body.password + "' AND " + "'" + req.body.newPassword + "'" + " = '" + req.body.confirmPassword + "'";
    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating password");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Password updated Successfully');
        }
    });
});

app.get('/addressUpdate', function (req, res) {
    console.log(clientEmail)
    var sql = "SELECT * FROM client_update where client_email = '" + clientEmail + "'";
    console.log(sql)
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection ");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    console.log(result);
                    // console.log((result[0][0]).first_name); 
                    console.log(JSON.stringify(result));
                    res.end(JSON.stringify(result));

                }
            });
        }
    })

})

app.post('/userUpdateAddress', function (req, res) {
    console.log("Inside Update Address Handler");
    var sql = "UPDATE client_update SET street_address = '" + req.body.street_address + "', apt = '" + req.body.apt +
        "', city = '" + req.body.city + "', state = '" + req.body.state + "', zip_code = '" + req.body.zip_code +
        "', phone = '" + req.body.phone + "', cross_street = '" + req.body.cross_street + "', delivery_instructions = '" + req.body.delivery_instructions +
        "', address_name = '" + req.body.address_name + "'  WHERE client_email = '" + clientEmail + "'";
    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating address");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('client Address updated Successfully');
        }
    });
});

app.post('/userAddAddress', function (req, res) {
    console.log("Inside Insert Address Handler");
    
    var sql = "UPDATE client_update SET street_address = " + mysql.escape(req.body.street_address) +
    ", apt = " +  mysql.escape(req.body.apt) + ", city = " +  mysql.escape(req.body.city) +
    ", state = " +  mysql.escape(req.body.state) + ", zip_code = " +  mysql.escape(req.body.zip_code) +
    ", phone = " +  mysql.escape(req.body.phone) + ", cross_street = " +  mysql.escape(req.body.cross_street) +
    ", delivery_instructions = " +  mysql.escape(req.body.delivery_instructions) + ", address_name = " +  mysql.escape(req.body.address_name) +
    " WHERE client_email = " + mysql.escape(clientEmail);


    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating address");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('client Address added Successfully');
        }
    });
});

app.post('/userUpdateProfileImage', function (req, res) {
    console.log("Inside Update profile image Handler");
    var sql = "UPDATE client_update SET profile_image = '" + req.body.profile_image + "'  WHERE client_email = '" + clientEmail + "'";
    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating name");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('user profile image added Successfully');
        }
    });
});

app.post('/upload', uploadPropFiles.single('image'), (req, res) => {
    console.log(req.file.filename)

    if (req.file)
        res.json({
            imageUrl: `/images/${imageId}/${req.file.filename}`
        });
    else
        res.status("409").json("No Files to Upload.")
});


function createDirectory(imageId) {
    if (!fs.existsSync(rootDirectory)) {
        fs.mkdirSync(rootDirectory);
    }
    let directory = rootDirectory + imageId;
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    return directory;
}


// Owner

app.get('/ownerUpdate', function (req, res) {

    console.log('Inside owner profile')
    console.log(sessionResponse[0].owner_email);
    var sql = "SELECT * FROM owner_profile where owner_email = '" + sessionResponse[0].owner_email + "'";
    console.log(sql)
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection ");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    console.log(result);
                    console.log((result[0]).first_name);
                    console.log(JSON.stringify(result));
                    res.end(JSON.stringify(result));

                }
            });
        }
    })

})

app.post('/ownerUpdateProfile', function (req, res) {
    console.log("Inside Update name Handler");
    // var sql = "UPDATE client_update SET first_name = '"+req.body.first_name+"', last_name = '"+req.body.last_name+"'  WHERE client_email = '"+clientEmail+"'" ;
    var sql = "UPDATE owner_profile SET first_name = '" + req.body.first_name + "', last_name = '" + req.body.last_name
        + "', owner_email = '" + req.body.owner_email + "', phone = '" + req.body.phone + "', rest_name = '" + req.body.rest_name
        + "', cuisine = '" + req.body.cuisine + "'  WHERE owner_email = '" + sessionResponse[0].owner_email + "'";
    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating name");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Owner Name updated Successfully');
        }
    });
});

app.post('/ownerUpdateProfileImage', function (req, res) {
    console.log("Inside Update profile image for owner Handler");
    var sql = "UPDATE owner_profile SET profile_image = '" + req.body.profile_image + "'  WHERE r_id = " + sessionResponse[0].r_id;
    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating name");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Profile image added Successfully');
        }
    });
});

app.post('/ownerUpdateRestImage', function (req, res) {
    console.log("Inside Update profile image for owner Handler");
    var sql = "UPDATE owner_profile SET rest_image = '" + req.body.rest_image + "'  WHERE r_id = " + sessionResponse[0].r_id;
    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating name");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Restaurant image added Successfully');
        }
    });
});

app.post('/ownerAddSection', function (req, res) {
    console.log("Inside Insert Section Handler");

    var sql = "INSERT INTO menu_table (r_id, section_name, section_description) VALUES ( " +
        sessionResponse[0].r_id + " , " + mysql.escape(req.body.section_name) + " , " +
        mysql.escape(req.body.section_description) + " ) ";

    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating address");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Section added Successfully');
        }
    });
});

app.post('/ownerUpdateSection', function (req, res) {
    console.log("Inside update Section Handler");
    console.log(req.body)

    var sql = "UPDATE menu_table SET section_name = " + mysql.escape(req.body.section_name) +
        ", section_description = " + mysql.escape(req.body.section_description)
        + " WHERE section_id = " + mysql.escape(req.body.section_id);
    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While deleting section");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('section updated Successfully');
        }
    });
});

app.post('/ownerDeleteSection', function (req, res) {
    console.log("Inside Delete Section Handler");
    console.log(req.body)

    var sql = "DELETE FROM menu_table WHERE section_id = " + mysql.escape(req.body.deleteId);
    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While deleting section");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('section deleted Successfully');
        }
    });
});


app.get('/ownerSections', function (req, res) {
    console.log("Inside Owner Sections get Request Handler");

    var sql = "SELECT section_name, section_description, section_id from menu_table WHERE r_id = '" + sessionResponse[0].r_id + "'";
    console.log(sql);
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    console.log(result);
                    console.log(JSON.stringify(result))
                    res.end(JSON.stringify(result));

                }
            });
        }
    })

});

app.post('/ownerAddItem', function (req, res) {
    console.log("Inside Insert Item Handler");
    console.log(req.body)

    var sql = "INSERT INTO item_table (section_id, item_name, item_image, item_description, item_price) VALUES ( " +
        mysql.escape(req.body.section_id) + " , " + mysql.escape(req.body.item_name) + " , " +
        mysql.escape(req.body.item_image) + " , " + mysql.escape(req.body.item_description) + " , " +
        mysql.escape(req.body.item_price) + " ) ";

    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While updating address");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Item added Successfully');
        }
    });
});

app.get('/ownerItemsList', function (req, res) {
    console.log(sessionResponse[0])
    console.log("Inside Owner Sections get items Request Handler");

    var sql = "SELECT item_table.section_id, item_table.item_id, item_table.item_name, item_table.item_image, item_table.item_description, item_table.item_price from item_table, menu_table WHERE item_table.section_id = menu_table.section_id AND menu_table.r_id = " + sessionResponse[0].r_id;

    console.log(sql);
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })

                    res.end(JSON.stringify(result));

                }
            });
        }
    })

});

app.post('/ownerDeleteItem', function (req, res) {
    console.log("Inside Delete Item Handler");
    console.log(req.body)

    var sql = "DELETE FROM item_table WHERE item_id = " + mysql.escape(req.body.deleteId);
    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While deleting section");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('section deleted Successfully');
        }
    });
});

// Client side to view restaurants and order items

app.get('/restaurantList', function (req, res) {
    console.log("Inside clients homepage get restaurants list Request Handler");

    var sql = "SELECT rest_name, rest_image, cuisine, rest_zip_code, r_id from owner_profile";
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    console.log(result)
                    res.end(JSON.stringify(result));
                }
            });
        }
    })
});

app.post('/searchItem', function (req, res) {
    console.log("Inside get all menu sections for client Handler");

    console.log('cuisine....', req.body.filterCuisine)

    if (!req.body.searchItem && req.body.filterCuisine) {
        var sql = "SELECT owner_profile.rest_name, owner_profile.rest_image, owner_profile.cuisine, owner_profile.rest_zip_code, owner_profile.r_id " +
            "from owner_profile where cuisine = " + mysql.escape(req.body.filterCuisine);
    } else if (!req.body.filterCuisine && req.body.searchItem) {
        var sql = "SELECT owner_profile.rest_name, owner_profile.rest_image, owner_profile.cuisine, owner_profile.rest_zip_code, owner_profile.r_id "
            + "from owner_profile "
            + "inner join menu_table on owner_profile.r_id = menu_table.r_id "
            + "inner join item_table on menu_table.section_id = item_table.section_id "
            + "where item_table.item_name like " + mysql.escape('%' + req.body.searchItem + '%');
    } else {
        var sql = "SELECT owner_profile.rest_name, owner_profile.rest_image, owner_profile.cuisine, owner_profile.rest_zip_code, owner_profile.r_id "
            + "from owner_profile "
            + "inner join menu_table on owner_profile.r_id = menu_table.r_id "
            + "inner join item_table on menu_table.section_id = item_table.section_id "
            + "where item_table.item_name like " + mysql.escape('%' + req.body.searchItem + '%') + "and cuisine = " + mysql.escape(req.body.filterCuisine);
    }

    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While deleting section");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            console.log(result)
            res.end(JSON.stringify(result));
        }
    });
});

app.get('/nextOrderId', function (req, res) {
    console.log("Inside clients homepage get id for next order Request Handler");

    var sql = "SELECT MAX(order_id) FROM order_details_table";
    console.log(sql);

    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })

                    orderId = JSON.stringify(result);
                    console.log(orderId)
                    orderId = JSON.parse(orderId);
                    id = Object.values(orderId[0]);
                    nextOrderId = id[0];
                    nextOrderId = nextOrderId + 1
                    // res.end(JSON.stringify(result));

                }
            });
        }
    })

});

app.get('/distinctCuisines', function (req, res) {
    console.log("Inside clients homepage get list of distinct cuisines for dropdown filter Request Handler");

    var sql = "SELECT DISTINCT(cuisine) from owner_profile";
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    console.log(result)
                    res.end(JSON.stringify(result));

                }
            });
        }
    })
});

app.post('/menuSections', function (req, res) {
    console.log("Inside get all menu sections for client Handler");

    console.log(req.body)
    var sql = "SELECT section_name, section_description, section_id from menu_table WHERE r_id = " + mysql.escape(req.body.r_id);
    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While deleting section");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            console.log(result)
            res.end(JSON.stringify(result));
        }
    });
});

app.post('/menuItems', function (req, res) {
    console.log("Inside get all menu items for client Handler");
    console.log(req.body)
    var sql = "SELECT item_table.section_id, item_table.item_id, item_table.item_name, item_table.item_image, item_table.item_description, item_table.item_price from item_table, menu_table WHERE item_table.section_id = menu_table.section_id AND menu_table.r_id = " + mysql.escape(req.body.r_id);

    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While deleting section");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            console.log(result)
            res.end(JSON.stringify(result));
        }
    });

});

app.post('/addItemToCart', function (req, res) {
    console.log("Inside add items to cart client Handler");
    console.log(req.body.item_quantity * req.body.item_price);

    console.log('order id...', orderId)
    console.log('id.......', id)
    console.log('nextorderid.......', nextOrderId)

    console.log('nextorderid.......', nextOrderId)

    var sql = "INSERT INTO order_details_table (order_id, item_id, item_name, item_quantity, item_total_price) VALUES ( " +
        nextOrderId + " , " + mysql.escape(req.body.item_id) + " , " + mysql.escape(req.body.item_name) + " , " +
        req.body.item_quantity + " , " + req.body.item_quantity * req.body.item_price + " ) ";

    console.log(sql)
    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While adding item to cart");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Item added to cart Successfully');
        }
    });
});


app.get('/cartItems', function (req, res) {
    console.log("Inside clients cart get cart items list Request Handler");

    var sql = "SELECT * FROM order_details_table WHERE order_id = " + nextOrderId;
    console.log(sql);
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    if(result.length === 0){
                        console.log('empty')
                        res.end('Cart is empty')
                    } else{
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        res.end(JSON.stringify(result));
                    }
                }
            });
        }
    })

});

app.get('/cartTotal', function (req, res) {
    console.log("Inside clients calculating total order price Request Handler");

    var sql = "SELECT round(sum(item_total_price),2) from order_details_table group by order_id having order_id = " + nextOrderId;
    console.log(sql);

    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })

                    console.log(JSON.stringify(result))
                    let total = JSON.stringify(result);
                    // console.log(orderId)
                    total = JSON.parse(total);
                    let cartTotal = Object.values(total[0]);
                    console.log(cartTotal)
                    let orderTotal = cartTotal[0];
                    console.log(orderTotal)
                    // nextOrderId = nextOrderId + 1
                    res.end(orderTotal.toString());

                }
            });
        }
    })

});

app.post('/submitOrder', function (req, res) {
    console.log("Inside submit order client Handler");

    var sql = "INSERT INTO order_table (order_id, client_email, client_first_name, client_last_name, client_address, r_id, status, order_bill) VALUES ( " +
        req.body.order_id + " , " + mysql.escape(sessionResponse[0].client_email) + " , "
        + mysql.escape(sessionResponse[0].first_name) + " , " + mysql.escape(sessionResponse[0].last_name) + " , " +
        "(SELECT concat(street_address, ' ', apt, ' ', city, ' ', state, ' ', zip_code ) from client_update where client_email=" + mysql.escape(sessionResponse[0].client_email)
        + " ), " + req.body.r_id + ", 'New', " + req.body.cart_totalPrice + ")"

    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Error While adding item to cart");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Order submitted Successfully');
        }
    });
});

app.get('/upcomingOrdersForClient', function (req, res) {
    console.log("Inside get client's upcoming orders Request Handler");

    var sql = "SELECT order_id, client_email, client_address, order_bill, order_table.r_id, rest_name, status from order_table, owner_profile where client_email = " + mysql.escape(sessionResponse[0].client_email) + " and status not in ('Delivered', 'Cancelled') and order_table.r_id = owner_profile.r_id "
    console.log(sql);
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })

                    res.end(JSON.stringify(result));

                }
            });
        }
    })

});

app.get('/pastOrdersForClient', function (req, res) {
    console.log("Inside get client's upcoming orders Request Handler");

    var sql = "SELECT order_id, client_email, client_address, order_bill, order_table.r_id, rest_name, status from order_table, owner_profile where client_email = " + mysql.escape(sessionResponse[0].client_email) + " and status in ('Delivered', 'Cancelled') and order_table.r_id = owner_profile.r_id order by order_id desc"
    console.log(sql);
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })

                    res.end(JSON.stringify(result));

                }
            });
        }
    })

});

app.get('/upcomingOrdersForOwner', function (req, res) {
    console.log("Inside get owner's upcoming orders Request Handler");

    var sql = "SELECT * from order_table where r_id = " + sessionResponse[0].r_id + " and status  not in ('Delivered', 'Cancelled')";
    console.log(sql);
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })

                    res.end(JSON.stringify(result));

                }
            });
        }
    })

});

app.get('/pastOrdersForOwner', function (req, res) {
    console.log("Inside get owner's past orders Request Handler");

    var sql = "SELECT * from order_table where r_id = " + sessionResponse[0].r_id + " and status in ('Delivered', 'Cancelled') order by order_id desc";
    console.log(sql);
    pool.getConnection(function (err, pool) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            pool.query(sql, function (err, result) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })

                    res.end(JSON.stringify(result));

                }
            });
        }
    })

});

app.post('/itemsInOrders', function (req, res) {
    console.log("Inside get orders with list of items Request Handler");
    console.log('array of orderids..........', req.body.order_ids)

    var sql = "SELECT order_details_table.order_id, order_details_table.item_id, item_table.item_image, order_details_table.item_name, order_details_table.item_quantity, order_details_table.item_total_price from order_details_table, item_table WHERE order_id in (" + req.body.order_ids + ") and order_details_table.item_id = item_table.item_id";

    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })

            res.end(JSON.stringify(result));

        }
    });
});

app.post('/updateOrderStatus', function (req, res) {
    console.log("Inside update order status Request Handler");
    console.log('status....', req.body.status)
    console.log('order id to update ....', req.body.orderIdToUpdate)

    var sql = "UPDATE order_table SET status = " + mysql.escape(req.body.status) + " WHERE order_id = " + req.body.orderIdToUpdate;

    console.log(sql)

    pool.query(sql, function (err, result) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('Order status updated Successfully');
        }
    });
});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
