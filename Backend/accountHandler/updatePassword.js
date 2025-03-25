const pool = require('../database');
const bcrypt = require('bcrypt');

async function checkOldPassword(userID, oldPassword) {
    try {
        const [rows] = await pool.execute(
            "SELECT password FROM theme_park.customers WHERE customer_id = ?", 
            [userID]
        );
        
        if (rows.length > 0) {

            const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
            return isMatch;
        }
        
        return false;
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
}

async function updatePasswordInDB(userID, newPassword) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        const [result] = await pool.execute(
            "UPDATE theme_park.customers SET password = ? WHERE customer_id = ?",
            [hashedPassword, userID]
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
}

async function UpdatePassword(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {

            const { userID, current_password, new_password } = JSON.parse(body);
            

            if (!userID || !current_password || !new_password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    error: true, 
                    message: "Missing required fields" 
                }));
            }
            

            const passwordMatches = await checkOldPassword(userID, current_password);
            
            if (!passwordMatches) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    error: true, 
                    message: "Current password is incorrect" 
                }));
            }
            

            const updateSuccessful = await updatePasswordInDB(userID, new_password);
            
            if (!updateSuccessful) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    error: true, 
                    message: "User not found" 
                }));
            }
            

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: false, 
                message: "Password updated successfully" 
            }));
            
        } catch (error) {
            console.error('Error updating password:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: true, 
                message: "Internal server error" 
            }));
        }
    });
}

module.exports = {
    UpdatePassword
};