import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
import bodyParser from 'body-parser'; 
import router2 from './router/router2.js';
import "./router/config.js"
import User from './model/User.model.js';
import cookieParser from 'cookie-parser';
import cryptoRandomString from 'crypto-random-string';
import session from 'express-session';
import { MemoryStore } from 'express-session';
import serverless from 'serverless-http';

const app = express();
app.use(express.static('public'))
/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router.use(bodyParser.json());
const port = process.env.PORT || 8080;
const sessionSecret = cryptoRandomString({ 
  length: 6, 
  type: 'numeric' 
});


// Add config variable declaration
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}));
/** Https get req */

app.get('/', (req,res)=>{
  res.status(201).json("home get request")
})

app.get('/users', (req,res)=>{
  res.status(201).json("its working finilla😍😍😍😍")
})

/** api routes */
app.use('/api' , router )
app.use("/api", router2);

/** start server */
connect().then(()=>{
  try {
    module.exports.handler = serverless(app);
    app.listen(port, () =>{
      console.log(`server connected to https://localhost:${port}`);
      
    });
  } catch (error) {
    console.log('cannot connect to the server')
  }
}).catch(error => {
  console.log("invalid database connection.... !")
})

// Use config variables

export default app;