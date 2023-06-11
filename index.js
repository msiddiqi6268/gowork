import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';
import {Server }  from 'socket.io'


import authRoutes from './Routes/AuthRoutes.js'
import empRoutes from './Routes/EmpRoutes.js'
import generalRoutes from './Routes/generalRoutes.js'
import AdminRoutes from './Routes/AdminRoutes.js'
import CandidateRoutes from './Routes/CandidateRoutes.js'
import CoversationRoutes from './Routes/conversations.js';
// import MessageRoutes from './Routes/messages.js';



// ----------CONFIGS--------------

dotenv.config()
const app = express()
app.use(express.json({limit:'10mb'}))
// app.use(helmet())
// app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:'10mb'}))
app.use(bodyParser.urlencoded({extended:true,limit:'10mb'}))
app.use(cors())
app.disable('etag');

//set views file
const __filename = fileURLToPath(import.meta.url);
const dir = dirname(__filename);
app.set('views',path.join(dir,'views'));
app.set('public',path.join(dir,'public'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(dir + '/public'));





app.use('/api/gen',generalRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/emp',empRoutes)
app.use('/api/admin',AdminRoutes)
app.use('/api/candidate',CandidateRoutes)
app.use('/api/conversation', CoversationRoutes)

app.use(express.static(path.join(dir, "./build")))
// app.use('/messages', MessageRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(dir,"build","index.html"));
 });


app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
  })

// -------------MONGOOSE SETUP-----------
const PORT = parseInt(process.env.PORT) || 9001
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL,{
    dbName : 'gowork',
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName :'gowork'
}).then(()=>{
    console.log('Web Server Connected')
}).catch((error)=>{
    console.log(`${error}`)
})
const server = app.listen(PORT, ()=>{console.log(`Server is running at port ${PORT}`)})

const io = new Server(server);

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};



io.on('connection', (socket)=>{

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log('User connected')
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
})