var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectID = mongojs.ObjectID;
var app = express();

/*
// Custom Middleware 
var logger = function(req, res, next){
    console.log('Logging...');
    next();
}
// Example of Middleware, needs to be set before the server start
app.use(logger);
*/

// Global Variables
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
});



// View Engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Set Static path 
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));


var users = [
    {
    id: 1,
    first_name:'Jeff',
    last_name: 'Doe',
    email: 'johndoe@gmail.com',
},
{
    id: 2,
    first_name:'Jill',
    last_name: 'Doe',
    email: 'jilljill@gmail.com',
},
{
    id: 3,
    first_name:'Alice',
    last_name: 'Dogg',
    email: 'Alidog@gmail.com',
}
]
// Basic Route
app.get('/', function(req,res){

    // find everything
db.users.find(function (err, docs) {
    console.log(docs);
    res.render('index', {
        title: 'Customers',
        users: docs
    });
})

    
});

// Basic post request

app.post('/users/add', function(req, res){
    
    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        console.log('ERRORS');
    }else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        db.users.insert(newUser, function(err,result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
    }

   
    console.log(newUser);
});

app.delete('/users/delete/:id', function(req, res){
    console.log(req.params.id);
});

// Start Sever 
app.listen(3000, function(){
    console.log('Sever Started on Port 3000...');
})