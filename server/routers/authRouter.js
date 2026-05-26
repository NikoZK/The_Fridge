import { Router } from 'express'
import bcrypt from 'bcrypt'
import db from '../database/connection.js'
import { authChecker } from '../middleware/authChecker.js'
import { sendWelcomeEmail } from '../util/nodemailer.js'

const router = Router()

//session check
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ authenticated: false })
  }

  const user = await db.get('SELECT id, email, username FROM users WHERE id = ?', [req.session.userId])

  if (!user) {
    return res.status(401).send({ authenticated: false })
  } else {
    return res
      .status(200)
      .send({ authenticated: true, user: { id: user.id, email: user.email, username: user.username } })
  }
})

router.delete('/me', authChecker, async (req, res) => {
  await db.run('DELETE FROM users WHERE id = ?', [req.session.userId])

  req.session.destroy(() => {
    res.status(200).send({ message: 'User deleted' })
  })
})

// SIGNUP
router.post('/signup', async (req, res) => {
  const email = req.body.email?.trim()
  const username = req.body.username?.trim()
  const password = req.body.password?.trim()

  if (!email || !password || !username) {
    return res.status(400).send({ error: 'Missing email, password or username' })
  }

  if (!email.includes('@') || !email.includes('.') || email.includes(' ')) {
    return res.status(400).send({
      error: 'Use a valid email'
    })
  }

  if (username.length < 4 || username.includes(' ')) {
    return res.status(400).send({
      error: 'Username must be at least 4 characters and contain no spaces'
    })
  }

  if (password.length < 8 || password.includes(' ')) {
    return res.status(400).send({
      error: 'Password must be at least 8 characters and contain no spaces'
    })
  }

  const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email])

  if (existingUser) {
    return res.status(409).send({ error: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await db.run('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [
    email,
    username,
    hashedPassword
  ])

  const previewUrl = await sendWelcomeEmail(email, username)

  return res.status(201).send({
    message: 'User created, check your inbox: ',
    previewUrl,
    user: { id: result.lastID, email, username }
  })
})

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).send({ error: 'Missing username or password' })
  }

  const user = await db.get('SELECT id, email, username, password FROM users WHERE username = ?', [username])

  if (!user) {
    return res.status(401).send({ error: 'User not found' })
  }

  const isSame = await bcrypt.compare(password, user.password)

  if (!isSame) {
    return res.status(401).send({ error: 'Wrong password' })
  }

  req.session.userId = user.id
  req.session.username = user.username

  return res.send({
    message: 'Logged in',
    user: { id: user.id, email: user.email, username: user.username }
  })
})

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send({ message: 'Logged out' })
  })
})

export default router
