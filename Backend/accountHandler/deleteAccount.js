const pool = require('../database');
const cookie = require('cookie');

async function deleteAccount(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {

            const { id } = JSON.parse(body);
            


            if (!id) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    error: true,
                    message: "User ID is required"
                }));
            }


            const deleteAccountQuery = `DELETE FROM theme_park.customers WHERE customer_id = ?`;
            const [deleteAccountQueryResult] = await pool.execute(deleteAccountQuery, [id]);

            if (deleteAccountQueryResult.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    error: true,
                    message: "User not found"
                }));
            }

            res.setHeader('Set-Cookie', cookie.serialize('token', '', {
                httpOnly: true,
                sameSite: 'Strict',
                expires: new Date(0), 
                path: '/'
            }));
        
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Account deleted successfully" }));


            /*res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: false,
                message: "Account deleted successfully"
            }));*/

        } catch (error) {
            console.error('Error deleting account:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: true,
                message: "Internal server error"
            }));
        }
    });
}

module.exports = {
    deleteAccount
}