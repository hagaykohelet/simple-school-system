import express from 'express'
import connection from './data_base/db_connection.js';
import studentsRouter from './students/router.js';

const app = express()
app.use(express.json())
app.use('/students', studentsRouter)

await connection.query("SELECT 1")
console.log("myqsl connected");

app.get('/', async (req, res) => {
    try {
        const data = await connection.query("select NOW() as Time")
        res.json({
            db: "connection",
            time: data[0][0].Time
        })
    } catch (err) {
        res.status(500).json({
            db: "error",
            message: err.message
        })
    }
})


await connection.query(`create table IF NOT EXISTS students
    (id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name varchar(100) NOT NULL,
    age INT NOT NULL,
    className varchar(20) NOT NULL)`);





app.listen(3000, () => {
    console.log("server runinng on http://localhost:3000");
})
