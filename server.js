import express from 'express'
import usersRouter from './routers/user.js'
import groupRouter from './routers/groups.js'
import errorHandler from './middleware/errorhandler.js'
import routeErrorHandler from './middleware/routeErrorHandler.js'
import cors from 'cors'


const app = express()

// parses json data and makes it available in req.body
app.use(express.json())
app.use(cors())

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
app.listen(8080,()=>{
  console.log("the server is running on port 8080")
})