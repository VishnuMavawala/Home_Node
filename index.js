const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const pusherConfig = require('./pusher.json');
const pusherClient = new Pusher(pusherConfig);

var arr=[];
/*arr['u112']=[
    {key: 1, value: true},
    {key: 2, value: false},
    {key: 3, value: true} ];*/

const app = express();
app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://home-static-server.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/api/:user/init', function(req, res) {
    console.log('User joined: ' + req.params.user);
    pusherClient.trigger(req.params.user, 'init', arr[req.params.user] || []);
    res.sendStatus(204);
});

app.post('/api/:user/part', (req, res) => {
    console.log('change part: ' + req.params.user);
    arr[req.params.user]=req.body;

    pusherClient.trigger(req.params.user, 'part', arr[req.params.user] || []);
    res.sendStatus(204);
});

app.post('/api/:user/assign', (req, res) => {
    arr[req.params.user]=req.body;
    pusherClient.trigger(req.params.user, 'init', arr[req.params.user] || []);
    res.sendStatus(204);
})

var port=process.env.PORT || 4000;

app.use('/', express.static(__dirname + '/'));
app.listen(port, function() {
    console.log('App listening on port ', port);
});

// Continue Run for Server
setInterval(()=> console.log("Continue run..."), 60000);

