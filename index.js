import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';



import authRoutes from './Routes/AuthRoutes.js'
import empRoutes from './Routes/EmpRoutes.js'
import generalRoutes from './Routes/generalRoutes.js'
import AdminRoutes from './Routes/AdminRoutes.js'
import CandidateRoutes from './Routes/CandidateRoutes.js'



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

console.log(path.join(dir, "build", "index.html"))
app.get("/", (req, res) => {
  res.sendFile(path.join(dir,"build","index.html"));
 });


 app.use(express.static(dir + '/build'));
app.use(express.static('build'))

app.use('/',generalRoutes)
app.use('/auth',authRoutes)
app.use('/emp',empRoutes)
app.use('/admin',AdminRoutes)
app.use('/candidate',CandidateRoutes)


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
    app.listen(PORT, ()=>{console.log(`Server is running at port ${PORT}`)})
}).catch((error)=>{
    console.log(`${error}`)
})

process.on('SIGINT',async()=>{
    await mongoose.close()
    console.log('mongoose disconnected')
    process.exit(0)
})