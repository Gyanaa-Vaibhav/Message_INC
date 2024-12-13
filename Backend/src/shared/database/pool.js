import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

export async function getAllUsers(){
    const query = 'SELECT * FROM users';
    console.log(`Executing query: ${query}`);
    const {rows} = await pool.query('SELECT * FROM users');
    return rows;
}

export async function getUser(email){
    try{
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        console.log(`Executing query: ${query} with values: ${values}`);
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }catch (er){
        console.error(er);
        throw new Error('Error getting user');
    }
}

export default pool;