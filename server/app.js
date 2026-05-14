   import express from 'express'
   import authRouter from './routers/authRouter.js'
   import fridgeRouter from './routers/fridgeRouter.js'
   import helmet from 'helmet'
   import { rateLimit } from 'express-rate-limit'
   import session from 'express-session'
   import cors from 'cors'
   import 'dotenv/config'

   const app = express()
   app.use(cors( {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
   }))
   
    app.use(express.json()) 
    app.use(helmet())


    app.use(session({
        secret: process.env.SESSION_SECRET, 
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    }))

    const generalLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 99, // Limit each IP to 99 requests per `window` (here, per 5 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive

})
app.use(generalLimiter)

const authenticationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

const authorizationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

app.use('/auth/login', authenticationLimiter)
app.use('/auth/signup', authenticationLimiter)
app.use('/auth', authorizationLimiter)
app.use('/auth', authRouter)
app.use('/fridge', fridgeRouter)

    // /{*splat} is the new syntax in Express 5.x, before it was just /*
    app.get('/{*splat}', (req, res) => {
        res.send(`
            <div>
            <h1> ERROR 404 </h1>
            <h3> The path: "${req.path}" doesnt exist </h3>
            </div>
            `)
    })
    
    // too technical way to do make error pathing with json
    app.all('/{*splat}', (req, res) => {
        res.send({ errorMessage: `The route for ${req.path} and the http method ${req.method} does not exist`})
    })

    const PORT = process.env.PORT || 8080

    const server = app.listen(PORT, (error) => {
        if (error) {
            console.log("Error starting the server")
        }
        console.log("Server is running on port", server.address().port, "The enviroment is:", process.env.NODE_ENV)
    })