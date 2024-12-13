import {pool} from "../../../shared/index.js";

export async function registerUser(name,email,password) {
    try{
        const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`;
        const values = [name, email, password];
        console.log(`Executing query: ${query} with values: ${values}`);
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }catch (error){
        console.error(`Error in registerUser: ${error.message}`);
        throw new Error(error.message);
    }
}