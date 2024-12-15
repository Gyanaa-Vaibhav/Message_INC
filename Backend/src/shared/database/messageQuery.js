import pool, { getUsername } from "./pool.js";

export async function getMessages(room){
    try{
        const query = `
            SELECT * FROM messages 
                     WHERE room_name = $1 
                     ORDER BY sent_id
        `;
        const values = [room];
        console.log(`Executing query: ${query} with values: ${values}`);
        const {rows} = await pool.query(query, values);
        return rows;
    }catch (er){
        console.error(er);
        throw new Error(`Error getting Messages from ${room}`);
    }
}

export async function addMessage(username,room,message){
    try{
        const user = await getUsername(username);
        const id = user ? user.user_id : 1;
        const query = `
            INSERT INTO messages (sender_id, room_name, message_content,sender_name) 
            VALUES ($1, $2, $3, $4)
        `;
        const values = [id, room, message,username];
        console.log(`Executing query: ${query} with values: ${values}`);
        await pool.query(query, values);
    }catch (er){
        console.error(er);
        throw new Error(`Error getting Messages from ${room}`);
    }
}

export async function deleteOldMessages() {
    try {
        const query = `
            DELETE FROM messages
            WHERE sent_id < NOW() - INTERVAL '1 day'
              AND room_name != 'general';
        `;
        await pool.query(query);
        console.log('Old messages deleted successfully');
    } catch (error) {
        console.error('Error deleting old messages:', error);
    }
}
