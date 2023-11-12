const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
var expressSession = require('express-session')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use(expressSession({secret : 'max', saveUninitialized : false, resave : false}))
app.use(cookieParser());

app.use('/uploads', express.static('uploads'))
app.use('/placesDetailsPics', express.static('placesDetailsPics'))
app.use('/placesPics', express.static('placesPics'))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
    
    next();
});

const Port = process.env.PORT || 3000

const api = require('./routes/api.js')

app.use('/api', api)

app.get('/', function(req,resp){
    
})

let server = app.listen(Port, function(){
    console.log("Server is running on localHost: " + Port)
})

module.exports = server
