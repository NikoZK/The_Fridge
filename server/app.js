import express from 'express'
import authRouter from './routers/authRouter.js'
import fridgeRouter from './routers/fridgeRouter.js'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import session from 'express-session'
import cors from 'cors'
import path from 'path'
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
app.use(express.static('../client/dist'))

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
})

app.use(sessionMiddleware)

const generalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // Time
    limit: 199, // Requests
    standardHeaders: 'draft-8', // Newest format
    legacyHeaders: false, // Disables old X-RateLimit
    ipv6Subnet: 56, // IPv6 subnet grouping

})
app.use(generalLimiter)

const authenticationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 150,
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


app.get('/*splat', (req, res) => {
  res.sendFile(path.resolve('../client/dist/index.html'));
})


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

const dinnerPosts = []

io.engine.use(sessionMiddleware)

io.on("connection", (socket) => {
    socket.emit('post:all', dinnerPosts)

    socket.on("post:create", (data) => {
        data.username = socket.request.session.username
        
        dinnerPosts.push(data)
        if (dinnerPosts.length > 10) {
            dinnerPosts.shift()
        }

        io.emit("post:all", dinnerPosts)
    })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, (error) => {
    if (error) {
        console.log("Error starting the server")
    }
    console.log("Server is running on port", server.address().port, "The enviroment is:", process.env.NODE_ENV)
})