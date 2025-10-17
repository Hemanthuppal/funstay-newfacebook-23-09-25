// main.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { createConnection } = require("./db");

 const { syncDatas } = require('./facebook_5sheet');
 const { syncData } = require('./facebook');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ['websocket', 'polling'],
});

const PORT = 4005;





// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Attach Socket.io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});


app.get('/newfacebook/enquiries', (req, res) => {
  const db = createConnection(); 

  const query = 'SELECT * FROM addleads ORDER BY created_at DESC';

  db.query(query, (err, results) => {
    db.end(); // Close connection after query execution

    if (err) {
      console.error('Error fetching enquiries:', err);
      return res.status(500).json({ message: 'Error fetching enquiries' });
    }
    res.json(results);
  });
});


// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

setInterval(syncDatas, 20 * 60 * 1000);
 setInterval(syncData, 30 * 60 * 1000);

//  setInterval(syncDatas, 20000);
//  setInterval(syncData, 10000);


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
