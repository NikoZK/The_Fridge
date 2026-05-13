import { Router } from 'express'
import db from '../database/connection.js'
import { authChecker } from '../middleware/authChecker.js'

const router = Router()

router.get('/items', async (req, res) => {

    const fridgeItems = await db.all('SELECT * FROM fridge_items;')
    res.send({ data: fridgeItems})
})

router.post('/items', authChecker, async (req, res) => {
    const { name, quantity, lastRestocked, inNeed } = req.body

    const result = await db.run(`INSERT INTO fridge_items (name, quantity, last_restocked, in_need ) VALUES (?, ?, ?, ?)`, [name, quantity, lastRestocked, inNeed])

    res.send({ data: { id: result.lastID, name, quantity, lastRestocked, inNeed }})
})

router.patch('/items/:id', authChecker, async (req, res) => {
    const { quantity, lastRestocked, inNeed } = req.body
    const id = req.params.id

    const existingItem = await db.get(`SELECT * FROM fridge_items where id = ?`, [id])

    if (!existingItem) {
        return res.status(404).send({ error: 'Item not found'})
    }

    if (quantity === undefined || !lastRestocked) {
        return res.status(400).send({ error: 'Missing fields' })
    }

    await db.run (`UPDATE fridge_items SET quantity = ?, last_restocked = ?, in_need = ? WHERE id = ?`, [quantity, lastRestocked, inNeed, id])

    const result = await db.get(`SELECT * FROM fridge_items WHERE id = ?`, [id])

    res.send({ data: result})
})

router.delete('/items/:id', authChecker, async (req, res) => {
    const existingItem = await db.get(`SELECT * FROM fridge_items where id = ?`, [req.params.id])

    if (!existingItem) {
        return res.status(404).send({ error: 'Item not found'})
    }

    await db.run (`DELETE FROM fridge_items WHERE id = ?`, [req.params.id])

    res.send({ data: "Item removed"})
})

export default router