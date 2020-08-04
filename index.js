const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const cors = require('cors');
const {books} = require('./models/books');

// Data
const {video,audio} = require('./models/media');
const {projects} = require('./models/portfolio');

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Handlebars Setting
app.set("view engine","hbs");
app.engine('hbs',exphbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
}));

const port = 8900;
server.listen(port);
console.log(`Listening to server: http://localhost:${port}`);

// Landing Page
app.get('/', (req,res)=>{
    res.render("main",{title:'Welcome to my home page!', video:video, audio:audio});
})

app.get('/about', (req,res)=>{
    res.render("about",{title:'About Me'});
})

app.get('/contact', (req,res)=>{
    res.render("contact",{title:'Contact Me'});
})

app.get('/portfolio', (req,res)=>{
    res.render("portfolio",{title:'My Creations', projects:projects});
})

app.get('/dragdrop', (req,res)=>{
    res.render("dragdrop",{title:'Scramble Game'});
})

app.get('/ajax', (req,res)=>{
    res.render("ajax",{title:'Asynchronous Operations: AJAX', layout:'ajax_main'});
})

app.get('/chat', (req,res)=>{
    res.render("chat",{title:'Chat With Me'});
})

app.get('*', (req,res)=>{
    res.render("notfound",{title:'Sorry, file not found!'});
})

//GET all books and/or records: /api/
app.get('/api/',(req,res)=>{
    res.json(books);
});

//GET ONE record: /api/:id
app.get('/api/:id',(req,res)=>{
    let id = req.params.id;
    let record = "No Record Found.";
    //if found record, return index position
    //else return -1
    let index = books.findIndex( (book)=> book.id==id );

    if(index != -1){
        record = books[index];
    };
    res.json([record]);
});

//POST - inserting new data and/or record
app.post('/api/',(req,res)=>{
    let newBook = req.body;
    books.push(newBook);
    res.json("New Book Added.");
});

//AJAX

//PUT - Updating an existing record
app.put('/api/:id',(req,res)=>{
    let message = "No Record Found.";
    let newBook = req.body;
    let id = req.params.id;
    let index = books.findIndex( (book)=> book.id == id );

    if(index != -1){
        books[index] = newBook;
        message = "Record Updated."
    };
    res.json(message);
});

//DELETE a single record
app.delete('/api/:id',(req,res)=>{
    let id = req.params.id;
    let message = "Sorry, No Record Found.";
    
    //if found record, return index position
    //else return -1
    let index = books.findIndex( (book)=> book.id == id );

    if(index != -1){
        books.splice(index,1);
        message = "Record Deleted."
    }
    res.json(message);
});

//DELETING all records
app.delete('/api/',(req,res)=>{
    books.splice(0);
    res.json("All Records Deleted.");
});

/* Chat Program */
var usernames = {};
io.sockets.on('connection', function(socket){
    socket.on('sendchat', function(data){
        io.sockets.emit('updatechat',socket.username,data);
    });

    socket.on('adduser', function(username){
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat','SERVER','you have connected');
        socket.broadcast.emit('updatechat','SERVER',username + ' has connected');
        io.sockets.emit('updateusers',usernames);
    });

    socket.on('disconnect', function(){
        delete usernames[socket.username];
        io.sockets.emit('updateusers',usernames);
        socket.broadcast.emit('updatechat','SERVER',socket.username + ' has disconnected');
    });
});