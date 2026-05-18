import express from 'express'
import authRouter from './routers/authRouter.js'
import fridgeRouter from './routers/fridgeRouter.js'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import session from 'express-session'
import cors from 'cors'
import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

app.use(express.json())
app.use(helmet())

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
})

app.use(sessionMiddleware)

const generalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // Time
    limit: 99, // Requests
    standardHeaders: 'draft-8', // Newest format
    legacyHeaders: false, // Disables old X-RateLimit
    ipv6Subnet: 56, // IPv6 subnet grouping

})
app.use(generalLimiter)

const authenticationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

const authorizationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 7,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

app.use('/auth/login', authorizationLimiter)
app.use('/auth/signup', authenticationLimiter)
app.use('/auth', authRouter)
app.use('/fridge', fridgeRouter)

// /{*splat} is the new syntax in Express 5.x, before it was just /*
app.all('/{*splat}', (req, res) => {
    res.send(`
            <div>
            <h1> ERROR 404 </h1>
            <h3> The path: "${req.path}" doesnt exist </h3>
            </div>
            `)
})


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

io.engine.use(sessionMiddleware)

io.on("connection", (socket) => {
    console.log("A new socket connected with id", socket.id)
    socket.on("post:create", (data) => {
        data.username = socket.request.session.username
        io.emit("post:new", data)
    })

    socket.on("disconnect", () => {
    console.log("bye bye socket id:", socket.id)
    })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, (error) => {
    if (error) {
        console.log("Error starting the server")
    }
    console.log("Server is running on port", server.address().port, "The enviroment is:", process.env.NODE_ENV)
})