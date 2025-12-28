import express from 'express'
import connection from '../data_base/db_connection.js';

const studentsRouter = express()

studentsRouter.post('/', async (req, res) => {
    try {
        const { name, age, className } = req.body
        if (typeof age !== "number") {
            return res.status(400).json({ message: "please enter type of age number" })
        }

        if (!name || !age || !className) {
            return res.status(400).json({ message: "missing fields" })
        }

        const result = await connection.query(`INSERT INTO students (name, age, className) VALUES (?,?,?)`, [name, age, className])
        let insertid = result[0].insertId
        return res.status(201).json({ id: insertid, name, age, className })
    } catch (err) {
        return res.status(400).json({ error: err })
    }

})

studentsRouter.get('/', async (req, res) => {
    try {
        const [result] = await connection.query(`SELECT * FROM students`)
        return res.status(200).json({ count: result.length, students: result })

    } catch (err) {
        return res.json({ error: err })
    }
})


studentsRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [result] = await connection.query(`select * from students where id = ${id}`)

        if (result.length === 0) {
            return res.status(404).json({ message: "student not found" })
        }

        return res.status(200).send(result)
    } catch (err) {
        return res.status(400).json({ error: err })
    }
})

studentsRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const newObj = req.body
        let allowKeys = ["name", "age", "className"]
        for (let key in newObj) {
            if (!(allowKeys.includes(key))) {
                return res.status(400).send("invalid body")
            }
        } const [result] = await connection.query(`select * from students where id = ${id}`)
        
        
        if (result.length === 0) {
            return res.status(404).send("student not found")
        }
        await connection.query(`UPDATE students SET name = ?, age =?, className = ? where id = ${id}`, [newObj.name, newObj.age, newObj.className])
        const [change] = await connection.query(`select * from students where id = ${id}`)
        return res.send(change)

    } catch (err) {
        return res.status(400).json({ error: err })
    }
})

studentsRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [result] = await connection.query(`select * from students where id = ${id}`)

        if (result.length === 0) {
            return res.status(400).json({ error: "student not found" })
        }


        await connection.query(`DELETE FROM students WHERE id= ${id}`)
        return res.status(200).json({ message: "student deleted" })

    } catch (err) {
        res.json({ error: err })
    }
})


export default studentsRouter