import dotenv from 'dotenv'
const envConfigResult = dotenv.config()


import express from 'express'
import usersRouter from './routers/user.js'
import groupRouter from './routers/groups.js'
import errorHandler from './middleware/errorHandler.js'
import routeErrorHandler from './middleware/routeErrorHandler.js'
import cors from 'cors'


const app = express()

// parses json data and makes it available in req.body
app.use(express.json())

const allowedOrigins = ['http://localhost:5173', 'https://calpal-app.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// parses url encoded data and makes it available in req.body
app.use(express.urlencoded({extended:false}))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


// handles all responses on the routes starting with /api/users
app.use('/api/users',usersRouter)

// handles all responses on the routes starting with /api/groups
app.use('/api/groups',groupRouter)

//handles all route errors in application
app.use(routeErrorHandler)

// handles errors in the application
app.use(errorHandler)

// runs the server on port 8080
const port = process.env.PORT || 8080
app.listen(port,()=>{
  console.log(`the server is running on port ${port}`)
})
