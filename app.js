const express = require("express");
const app = express();
const mysql = require("mysql");
const MySQLEvents = require('@rodrigogs/mysql-events');
const cors = require("cors");


const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const socket = require("socket.io");
const io = socket(server);

// Middlewares
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Define some  variables
let currentData = "";

const program = async () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '987430d'
  });

  const instance = new MySQLEvents(connection, {
    startAtEnd: true,
    excludedSchemas: {
      mysql: true,
    },
  });

  await instance.start();

  instance.addTrigger({
    name: 'TEST',
    expression: "*",
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (event) => { // will receive the events here
      currentData = event.affectedRows[0].after.comment;
      io.emit('newData', currentData);
    },
  });
  
  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
.then(() => console.log('Waiting for database events...'))
.catch(console.error);


io.on('connection', function(socket) {
  
  console.log("One User Connected..!")

  socket.on("disconnect", function(){
    console.log("One User Disconnected..!")
  })
  
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});




