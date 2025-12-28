import mysql from 'mysql2/promise'
 
const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'moti',
    port: 3306
});


export default connection