const pool = require("../database");

const updateTaskStatus = async (req, res) => {
    try {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk.toString();
        });

        req.on('end', async () => {
            try {
                let requestBody = {};
                try {
                    requestBody = JSON.parse(data);
                } catch (parseError) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Invalid JSON format" }));
                }

                const { notificationId, isCompleted } = requestBody;

                if (!notificationId) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Notification ID is required" }));
                }

                if (isCompleted === undefined || isCompleted === null) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Completion status is required" }));
                }

                const status = isCompleted === true || isCompleted === "true" || isCompleted === 1 ? true : false;

                const [result] = await pool.query(
                    "UPDATE merchandise_notification SET isCompleted = ? WHERE merchandise_notification_id = ?",
                    [status, notificationId]
                );

                if (result.affectedRows === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Notification not found" }));
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    message: "Notification status updated successfully",
                    notificationId,
                    isCompleted: status
                }));
            } catch (error) {
                console.error("Error updating notification status:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: "Internal server error" }));
            }
        });
    } catch (error) {
        console.error("Error handling request:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Internal server error" }));
    }
};

module.exports = {
    updateTaskStatus
};