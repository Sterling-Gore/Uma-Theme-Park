const pool = require('../../database');
const bcrypt = require('bcrypt');

async function runQuery(newPassword, employee_id) {
    const query = "UPDATE theme_park.employee SET password = ? WHERE employee_id = ?;";
    try {
        const [rows] = await pool.execute(query, [newPassword, employee_id]);
        return rows.affectedRows > 0; 
    } catch (err) {
        throw err;
    }
}

async function checkPassword(password) {
    return { valid: true };
}

async function updateEmployeePassword(req, res) {
    let data = '';
    
    req.on('data', (chunk) => {
        data += chunk.toString();
    });
    

    req.on('end', async () => {
        try {
 
            const { employee_id, password } = JSON.parse(data);
            

            if (!employee_id || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Employee ID and password are required' }));
            }
            
    
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const updated = await runQuery(hashedPassword, employee_id);
            
            if (updated) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Password updated successfully' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
            }
        } catch (error) {
            console.error('Error updating employee password:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Server error occurred' }));
        }
    });
}

module.exports = {
    updateEmployeePassword,
};