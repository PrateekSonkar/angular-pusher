var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    app = express(),
    session = require('express-session')({
        secret: "wakko1123",
        resave: true,
        saveUninitialized: true
    }),
    sharedsession = require('express-socket.io-session'),
    port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session);

app.all('/', function(req, res) {
    req.session.myCustomData = {
        msg: "Add something you need to session, like userID",
        userID: Math.floor(Math.random() * 100)
    }
    res.render('pages/index', {
        msg: "hello",
        session: req.session
    });
});

var httpServer = http.Server(app);
httpServer.listen(port, function() {
    console.log("server listening on port", port);
});

io = require('socket.io').listen(httpServer);
io.use(sharedsession(session));
io.on('connection', function(socket) {
    console.log("connected");
    socket.emit("greetings", {
        msg: "hello"
    });
    socket.on("something", function(data) {
        console.log("client[" + socket.handshake.session.myCustomData.userID + "] sent data: " + data);
    });
});