const pool = require('../database');

async function UpdateAccount(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {

            const data = JSON.parse(body);
            const {
                userID,
                first_name,
                last_name,
                date_of_birth,
                email,
                phone_number,
                street_address,
                city,
                state,
                zipcode
            } = data;


            if (!userID) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    error: true,
                    message: "User ID is required"
                }));
            }

            let updateFields = [];
            let params = [];

            if (first_name !== undefined) {
                updateFields.push("first_name = ?");
                params.push(first_name);
            }

            if (last_name !== undefined) {
                updateFields.push("last_name = ?");
                params.push(last_name);
            }

            if (date_of_birth !== undefined) {
                updateFields.push("date_of_birth = ?");
                params.push(date_of_birth);
            }

            if (email !== undefined) {
                updateFields.push("email = ?");
                params.push(email);
            }

            if (phone_number !== undefined) {
                updateFields.push("phone_number = ?");
                params.push(phone_number);
            }

            if (street_address !== undefined) {
                updateFields.push("street_address = ?");
                params.push(street_address);
            }

            if (city !== undefined) {
                updateFields.push("city = ?");
                params.push(city);
            }

            if (state !== undefined) {
                updateFields.push("state = ?");
                params.push(state);
            }

            if (zipcode !== undefined) {
                updateFields.push("zipcode = ?");
                params.push(zipcode);
            }


            if (updateFields.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    error: true,
                    message: "No fields to update"
                }));
            }


            params.push(userID);


            const query = `UPDATE theme_park.customers SET ${updateFields.join(", ")} WHERE customer_id = ?`;
            const [result] = await pool.execute(query, params);

            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    error: true,
                    message: "User not found"
                }));
            }


            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: false,
                message: "Account information updated successfully"
            }));

        } catch (error) {
            console.error('Error updating account information:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: true,
                message: "Internal server error"
            }));
        }
    });
}

module.exports = {
    UpdateAccount
}