const { v4: uuidv4 } = require('uuid');
const pool = require("../database");
const bcrypt = require('bcrypt');



async function insertTicketAndMerchQuery(data)
{
    const connection = await pool.getConnection();
    try{
        await connection.beginTransaction();

        const {Tickets, Merchandise, userID} = JSON.parse(data);
        const today = new Date(); 
        const merchandiseReceiptInsertQuery = "INSERT INTO theme_park.merchandise_receipt (receipt_id, customer_id, total_items_sold, total_cost, merchandise_name, purchase_date) VALUES (?, ?, ?, ?, ?, ?);";
        const updateMerchandiseStockQuery = "UPDATE theme_park.merchandise SET stock_amount = ? WHERE merchandise_id = ?";

        for (const item of Merchandise){
            const merchandise_receipt_id = uuidv4();  
            const [merchReceiptInsertResult] = await connection.execute(merchandiseReceiptInsertQuery, [merchandise_receipt_id, userID, item.in_shopping_cart, (item.merchandise_price * item.in_shopping_cart), item.merchandise_name, today]);
            const [merchStockUpdateResult] = await connection.execute(updateMerchandiseStockQuery, [item.stock_amount, item.merchandise_id]);
        }

        const ticketReceiptInsertQuery = "INSERT INTO theme_park.ticket_receipt (ticket_receipt_id, customer_id, number_of_days, number_of_standards, number_of_children, number_of_seniors, total_cost, purchase_date) VALUES (?,?,?,?,?,?,?, ?);";
        const ticketDateInsertQuery = "INSERT INTO theme_park.ticket_dates (ticket_date_id, ticket_receipt_id, ticket_date, includes_food_pass) VALUES (?,?,?,?);";
        for (const ticket of Tickets){
            const ticket_receipt_id = uuidv4(); 
            const [ticketReceiptInsertResult] = await connection.execute(ticketReceiptInsertQuery, [ticket_receipt_id, userID, Number(ticket.numOfDays), ticket.numOfStandardTickets, ticket.numOfChildrenTickets, ticket.numOfSeniorTickets, ticket.price, today]);
            for (const date of ticket.selectedDates)
            {
                const ticketDate = new Date(date); 
                const ticket_date_id = uuidv4(); 
                const includesFoodPass = ticket.selectedDatesForFoodPass.includes(date);
                const [ticketDateInsertResult] = await connection.execute(ticketDateInsertQuery, [ticket_date_id, ticket_receipt_id, ticketDate, includesFoodPass]);
            }
        }


        await connection.commit();
        connection.release();
        return true;
    }
    catch (error)
    {
        connection.rollback(); //rollback queries if any error happens
        console.error('Transaction rolled back due to error:', error);
        connection.release();
        return false;
    } 


}
async function purchaseTicketsAndMerch(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const queryWorked = await insertTicketAndMerchQuery(body);
                
                if(!queryWorked){
                    throw new Error('Failed to update Tickets and Merchandise');
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Success"}));
            } catch (error) {
                console.error("Error parsing request body:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Invalid request data" }));
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

module.exports = {
    purchaseTicketsAndMerch
};
