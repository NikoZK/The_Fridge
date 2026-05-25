import { Router } from 'express'
import db from '../database/connection.js'
import { authChecker } from '../middleware/authChecker.js'

const router = Router()

router.get('/items', async (req, res) => {
  const fridgeItems = await db.all('SELECT * FROM fridge_items;')
  res.send({ data: fridgeItems })
})

router.post('/items', authChecker, async (req, res) => {
  const { name, quantity, lastRestocked, inNeed } = req.body

  if (name.trim() === "" || quantity < 0 || lastRestocked === '' || inNeed !== 0 && inNeed !== 1) {
    return res.status(400).send({ error: 'Rows are invalid'})
  }

  const result = await db.run(
    `INSERT INTO fridge_items (name, quantity, last_restocked, in_need ) VALUES (?, ?, ?, ?)`,
    [name, quantity, lastRestocked, inNeed]
  )

  res.send({ data: { id: result.lastID, name, quantity, lastRestocked, inNeed } })
})

router.patch('/items/:id', authChecker, async (req, res) => {
  const { quantity, lastRestocked, inNeed } = req.body
  const id = req.params.id

  const existingItem = await db.get(`SELECT * FROM fridge_items where id = ?`, [id])

  if (!existingItem) {
    return res.status(404).send({ error: 'Item not found' })
  }

  let updatedQuantity = existingItem.quantity
  let updatedLastRestocked = existingItem.last_restocked
  let updatedInNeed = existingItem.in_need

  if (quantity !== undefined) {
    updatedQuantity = quantity
  }

  if (lastRestocked !== undefined) {
    updatedLastRestocked = lastRestocked
  }

  if (inNeed !== undefined) {
    updatedInNeed = inNeed
  }

  if (quantity === 0) {
    updatedInNeed = 1
  }

  if (updatedQuantity < 0) {
    return res.status(400).send({ error: 'Quantity cannot be negative' })
  }

  await db.run(`UPDATE fridge_items SET quantity = ?, last_restocked = ?, in_need = ? WHERE id = ?`, [
    updatedQuantity,
    updatedLastRestocked,
    updatedInNeed,
    id
  ])

  const result = await db.get(`SELECT * FROM fridge_items WHERE id = ?`, [id])

  res.send({ data: result })
})

router.delete('/items/:id', authChecker, async (req, res) => {
  const existingItem = await db.get(`SELECT * FROM fridge_items where id = ?`, [req.params.id])

  if (!existingItem) {
    return res.status(404).send({ error: 'Item not found' })
  }

  await db.run(`DELETE FROM fridge_items WHERE id = ?`, [req.params.id])

  res.send({ data: 'Item removed' })
})

export default router
